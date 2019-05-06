import { Config } from "./index";

class ImageUtils {
  /**
   * @param {string} img 图片的base64
   * @param {int} dir exif获取的方向信息
   * @param {function} next 回调方法，返回校正方向后的base64
   */
  getImgData(img, dir, next) {
    let image = new Image();
    image.onload = function() {
      let degree = 0;
      let drawWidth;
      let drawHeight;
      let width;
      let height;
      drawWidth = this.naturalWidth;
      drawHeight = this.naturalHeight; // 以下改变一下图片大小
      let maxSide = Math.max(drawWidth, drawHeight);
      if (maxSide > 1024) {
        let minSide = Math.min(drawWidth, drawHeight);
        minSide = (minSide / maxSide) * 1024;
        maxSide = 1024;
        if (drawWidth > drawHeight) {
          drawWidth = maxSide;
          drawHeight = minSide;
        } else {
          drawWidth = minSide;
          drawHeight = maxSide;
        }
      }
      let canvas = document.createElement("canvas");
      canvas.width = width = drawWidth;
      canvas.height = height = drawHeight;
      let context = canvas.getContext("2d"); // 判断图片方向，重置canvas大小，确定旋转角度，iphone默认的是home键在右方的横屏拍摄方式
      switch (dir) {
        // iphone横屏拍摄，此时home键在左侧
        case 3:
          degree = 180;
          drawWidth = -width;
          drawHeight = -height;
          break;
        // iphone竖屏拍摄，此时home键在下方(正常拿手机的方向)
        case 6:
          canvas.width = height;
          canvas.height = width;
          degree = 90;
          drawWidth = width;
          drawHeight = -height;
          break;
        // iphone竖屏拍摄，此时home键在上方
        case 8:
          canvas.width = height;
          canvas.height = width;
          degree = 270;
          drawWidth = -width;
          drawHeight = height;
          break;
      }
      // 使用canvas旋转校正
      context.rotate((degree * Math.PI) / 180);
      context.drawImage(this, 0, 0, drawWidth, drawHeight);
      // 返回校正图片
      next(canvas.toDataURL("image/jpeg", 0.8));
    };
    image.src = img;
  }

  /**
   * 使用canvas对大图片进行压缩
   * @param img 图片
   */
  compress(img) {
    // 用于压缩图片的canvas
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");
    // 瓦片canvas
    let tCanvas = document.createElement("canvas");
    let tctx = tCanvas.getContext("2d");
    // let initSize = img.src.length
    let width = img.width;
    let height = img.height;
    // 如果图片大于四百万像素，计算压缩比并将大小压至400万以下
    let ratio;
    if ((ratio = (width * height) / 4000000) > 1) {
      ratio = Math.sqrt(ratio);
      width /= ratio;
      height /= ratio;
    } else {
      ratio = 1;
    }
    canvas.width = width;
    canvas.height = height;
    // 铺底色
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // 如果图片像素大于100万则使用瓦片绘制
    let count;
    if ((count = (width * height) / 1000000) > 1) {
      count = ~~(Math.sqrt(count) + 1); // 计算要分成多少块瓦片
      // 计算每块瓦片的宽和高
      let nw = ~~(width / count);
      let nh = ~~(height / count);
      tCanvas.width = nw;
      tCanvas.height = nh;
      for (let i = 0; i < count; i++) {
        for (let j = 0; j < count; j++) {
          tctx.drawImage(
            img,
            i * nw * ratio,
            j * nh * ratio,
            nw * ratio,
            nh * ratio,
            0,
            0,
            nw,
            nh
          );
          ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh);
        }
      }
    } else {
      ctx.drawImage(img, 0, 0, width, height);
    }
    // 进行最小压缩
    var ndata = canvas.toDataURL("image/jpeg", 0.1);
    // console.log('压缩前：' + initSize)
    // console.log('压缩后：' + ndata.length)
    // console.log('压缩率：' + ~~(100 * (initSize - ndata.length) / initSize) + "%")
    tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0;
    return ndata;
  }

  /**
   * 图片上传，将base64的图片转成二进制对象，塞进formdata上传
   * @param {string} baseStr 图片base64编码
   * @param type
   * @param {string} filename 文件名
   * @param {string} bizType 业务类型
   * @param {string} bizCode 业务Code
   * @param {string} enterpriseCode 企业code
   * @param {function} callback 上传回调
   */
  upload(baseStr, type, filename, bizType, bizCode, enterpriseCode, callback) {
    let text = window.atob(baseStr.split(",")[1]);
    let buffer = new Uint8Array(text.length);
    for (let i = 0; i < text.length; i++) {
      buffer[i] = text.charCodeAt(i);
    }
    let blob = this.getBlob([buffer], type);
    let xhr = new XMLHttpRequest();
    let formdata = this.getFormData();
    formdata.append("multipartFile", blob, filename);
    formdata.append("bizCode", bizCode);
    formdata.append("bizType", bizType);
    formdata.append("enterpriseCode", enterpriseCode);
    xhr.open("post", Config.api.url + "/comm/files/upload/v1");
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
        let jsonData = JSON.parse(xhr.responseText);
        callback(jsonData);
      }
      if (xhr.status !== 200) {
        callback(null);
      }
    };
    xhr.send(formdata);
  }

  /**
   * 获取blob对象的兼容性写法
   * @param buffer
   * @param format
   * @returns {*}
   */
  getBlob(buffer, format) {
    try {
      return new Blob(buffer, { type: format });
    } catch (e) {
      let bb = new (window.BlobBuilder ||
        window.WebKitBlobBuilder ||
        window.MSBlobBuilder)();
      buffer.forEach(function(buf) {
        bb.append(buf);
      });
      return bb.getBlob(format);
    }
  }

  /**
   * 获取formdata
   */
  getFormData() {
    let isNeedShim =
      ~navigator.userAgent.indexOf("Android") &&
      ~navigator.vendor.indexOf("Google") &&
      !~navigator.userAgent.indexOf("Chrome") &&
      navigator.userAgent.match(/AppleWebKit\/(\d+)/).pop() <= 534;
    return isNeedShim ? new this.FormDataShim() : new FormData();
  }

  /**
   * formdata 补丁, 给不支持formdata上传blob的android机打补丁
   * @constructor
   */
  FormDataShim() {
    let o = this;
    let parts = [];
    let boundary =
      Array(21).join("-") + (+new Date() * (1e16 * Math.random())).toString(36);
    let oldSend = XMLHttpRequest.prototype.send;
    this.append = function(name, value, filename) {
      parts.push(
        "--" +
          boundary +
          '\r\nContent-Disposition: form-data; name="' +
          name +
          '"'
      );
      if (value instanceof Blob) {
        parts.push(
          '; filename="' +
            (filename || "blob") +
            '"\r\nContent-Type: ' +
            value.type +
            "\r\n\r\n"
        );
        parts.push(value);
      } else {
        parts.push("\r\n\r\n" + value);
      }
      parts.push("\r\n");
    };
    XMLHttpRequest.prototype.send = val => {
      let fr;
      let data;
      let oXHR = this;
      if (val === o) {
        parts.push("--" + boundary + "--\r\n");
        data = this.getBlob(parts);
        fr = new FileReader();
        fr.onload = function() {
          oldSend.call(oXHR, fr.result);
        };
        fr.onerror = function(err) {
          throw err;
        };
        fr.readAsArrayBuffer(data);
        this.setRequestHeader(
          "Content-Type",
          "multipart/form-data; boundary=" + boundary
        );
        XMLHttpRequest.prototype.send = oldSend;
      } else {
        oldSend.call(this, val);
      }
    };
  }
}

export default new ImageUtils();
