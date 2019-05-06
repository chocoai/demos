import Store from 'store'
import Config from './index'
import get from 'lodash.get'

export const objToStr = obj => {
  let des = ''
  for (let name in obj) {
    let value = obj[name]
    if (
      value !== null &&
      value !== undefined &&
      typeof value !== 'string' &&
      typeof value !== 'number' &&
      typeof value !== 'boolean' &&
      typeof value !== 'symbol'
    ) {
      des += `\n${name}:[\n${objToStr(value)}\n]\n`
    }
    des += name + ':' + obj[name] + ''
  }
  return des
}
/**
 * 封装基础工具函数
 * @param {any}
 */
class BaseUtils {
  /**
   * 获取地址栏url后面的参数
   * @param {name} 参数名
   * @return {参数值}
   */
  getQueryParams (name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
    var r = window.location.search.substr(1).match(reg)
    if (r != null) return unescape(r[2])
    return null
  }
  // 替换url参数
  replaceParamVal (paramName, replaceWith) {
    let oUrl = window.location.href.toString()
    let re = new RegExp('(' + paramName + '=)([^&]*)', 'g')
    let nUrl = oUrl.replace(re, `${paramName}=${replaceWith}`)
    return nUrl
  }
  /**
   * 判断手机号码
   * @param {name} 参数名
   * @return {参数值}
   */
  isTelephone (phone) {
    let reg = /^[1][3,4,5,7,8,9][0-9]{9}$/
    phone = phone.replace(/[\u202D+\u202C+\s+]/g, '')
    if (!reg.test(phone)) {
      return false
    } else {
      return true
    }
  }
  /**
   * 去除特殊字符 空格/左对齐/右对齐
   *
   */
  clearSpecChars (str) {
    return str.replace(/[\u202D+\u202C+\s+]/g, '')
  }
  // 判断身份证格式
  isIdCardNo (sId) {
    var aCity = { 11: '北京', 12: '天津', 13: '河北', 14: '山西', 15: '内蒙古', 21: '辽宁', 22: '吉林', 23: '黑龙江', 31: '上海', 32: '江苏', 33: '浙江', 34: '安徽', 35: '福建', 36: '江西', 37: '山东', 41: '河南', 42: '湖北', 43: '湖南', 44: '广东', 45: '广西', 46: '海南', 50: '重庆', 51: '四川', 52: '贵州', 53: '云南', 54: '西藏', 61: '陕西', 62: '甘肃', 63: '青海', 64: '宁夏', 65: '新疆', 71: '台湾', 81: '香港', 82: '澳门', 91: '国外' }
    var iSum = 0
    if (!/^\d{17}(\d|x)$/i.test(sId)) return false // 身份证长度或格式错误
    sId = sId.replace(/x$/i, 'a')
    if (aCity[parseInt(sId.substr(0, 2))] == null) return false // 身份证地区非法
    let sBirthday = sId.substr(6, 4) + '-' + Number(sId.substr(10, 2)) + '-' + Number(sId.substr(12, 2))
    var d = new Date(sBirthday.replace(/-/g, '/'))
    if (sBirthday !== (d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate())) return false // 身份证出生日期非法
    for (var i = 17; i >= 0; i--) iSum += (Math.pow(2, i) % 11) * parseInt(sId.charAt(17 - i), 11)
    if (iSum % 11 !== 1) return false // 身份证号非法
    // aCity[parseInt(sId.substr(0,2))]+","+sBirthday+","+(sId.substr(16,1)%2?"男":"女");//此次还可以判断出输入的身份证号的人性别
    return true
  }
  isNumber (n) {
    if (!/^[0-9]+([.]{1}[0-9]{1,3})?$/.test(n)) {
      return false
    }
    return true
  }
  isInt (n) {
    if (!/^[0-9]+$/.test(n)) {
      return false
    }
    return true
  }
   /**
   * 获取随机字符串
   * @param 随机字符串
   */
  randomStr (size) {
    const chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
    let state = ''
    for (let i = 0; i < size; i++) {
      let id = Math.ceil(Math.random() * 35)
      state += chars[id]
    }
    return state
  }
  /**
   * 使用canvas对大图片进行压缩
   * @param {img} 图片
   */
  compress (img) {
    // 用于压缩图片的canvas
    let canvas = document.createElement('canvas')
    let ctx = canvas.getContext('2d')
    // 瓦片canvas
    let tCanvas = document.createElement('canvas')
    let tctx = tCanvas.getContext('2d')
    // let initSize = img.src.length
    let width = img.width
    let height = img.height
    // 如果图片大于四百万像素，计算压缩比并将大小压至400万以下
    let ratio
    if ((ratio = width * height / 4000000) > 1) {
      ratio = Math.sqrt(ratio)
      width /= ratio
      height /= ratio
    } else {
      ratio = 1
    }
    canvas.width = width
    canvas.height = height
    // 铺底色
    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    // 如果图片像素大于100万则使用瓦片绘制
    let count
    if ((count = width * height / 1000000) > 1) {
      count = ~~(Math.sqrt(count) + 1) // 计算要分成多少块瓦片
      // 计算每块瓦片的宽和高
      let nw = ~~(width / count)
      let nh = ~~(height / count)
      tCanvas.width = nw
      tCanvas.height = nh
      for (let i = 0; i < count; i++) {
        for (let j = 0; j < count; j++) {
          tctx.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, 0, 0, nw, nh)
          ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh)
        }
      }
    } else {
      ctx.drawImage(img, 0, 0, width, height)
    }
    // 进行最小压缩
    var ndata = canvas.toDataURL('image/jpeg', 0.1)
    // console.log('压缩前：' + initSize)
    // console.log('压缩后：' + ndata.length)
    // console.log('压缩率：' + ~~(100 * (initSize - ndata.length) / initSize) + "%")
    tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0
    return ndata
  }
  /**
   * 获取formdata
   */
  getFormData () {
    let isNeedShim = ~navigator.userAgent.indexOf('Android') && ~navigator.vendor.indexOf('Google') && !~navigator.userAgent.indexOf('Chrome') && navigator.userAgent.match(/AppleWebKit\/(\d+)/).pop() <= 534
    return isNeedShim ? new this.FormDataShim() : new FormData()
  }
  /**
   * formdata 补丁, 给不支持formdata上传blob的android机打补丁
   * @constructor
   */
  FormDataShim () {
    let o = this
    let parts = []
    let boundary = Array(21).join('-') + (+new Date() * (1e16 * Math.random())).toString(36)
    let oldSend = XMLHttpRequest.prototype.send
    this.append = function (name, value, filename) {
      parts.push('--' + boundary + '\r\nContent-Disposition: form-data; name="' + name + '"')
      if (value instanceof Blob) {
        parts.push('; filename="' + (filename || 'blob') + '"\r\nContent-Type: ' + value.type + '\r\n\r\n')
        parts.push(value)
      } else {
        parts.push('\r\n\r\n' + value)
      }
      parts.push('\r\n')
    }
    XMLHttpRequest.prototype.send = function (val) {
      let fr
      let data
      let oXHR = this
      if (val === o) {
        parts.push('--' + boundary + '--\r\n')
        data = this.getBlob(parts)
        fr = new FileReader()
        fr.onload = function () {
          oldSend.call(oXHR, fr.result)
        }
        fr.onerror = function (err) {
          throw err
        }
        fr.readAsArrayBuffer(data)
        this.setRequestHeader('Content-Type', 'multipart/form-data; boundary=' + boundary)
        XMLHttpRequest.prototype.send = oldSend
      } else {
        oldSend.call(this, val)
      }
    }
  }
  /**
   * 获取blob对象的兼容性写法
   * @param buffer
   * @param format
   * @returns {*}
   */
  getBlob (buffer, format) {
    try {
      return new Blob(buffer, {type: format})
    } catch (e) {
      let bb = new (window.BlobBuilder || window.WebKitBlobBuilder || window.MSBlobBuilder)()
      buffer.forEach(function (buf) {
        bb.append(buf)
      })
      return bb.getBlob(format)
    }
  }
  /**
   * @param {string} img 图片的base64
   * @param {int} dir exif获取的方向信息
   * @param {function} next 回调方法，返回校正方向后的base64
   */
  getImgData (img, dir, next) {
    let image = new Image()
    image.onload = function () {
      let degree = 0
      let drawWidth
      let drawHeight
      let width
      let height
      drawWidth = this.naturalWidth
      drawHeight = this.naturalHeight  // 以下改变一下图片大小
      let maxSide = Math.max(drawWidth, drawHeight)
      if (maxSide > 1024) {
        let minSide = Math.min(drawWidth, drawHeight)
        minSide = minSide / maxSide * 1024
        maxSide = 1024
        if (drawWidth > drawHeight) {
          drawWidth = maxSide
          drawHeight = minSide
        } else {
          drawWidth = minSide
          drawHeight = maxSide
        }
      }
      let canvas = document.createElement('canvas')
      canvas.width = width = drawWidth
      canvas.height = height = drawHeight
      let context = canvas.getContext('2d')  // 判断图片方向，重置canvas大小，确定旋转角度，iphone默认的是home键在右方的横屏拍摄方式
      if (!window.navigator.userAgent.toLowerCase().includes('android') && window.zdb) {
        switch (dir) {
          // iphone横屏拍摄，此时home键在左侧
          case 3:
            degree = 180
            drawWidth = -width
            drawHeight = -height
            break
          // iphone竖屏拍摄，此时home键在下方(正常拿手机的方向)
          case 6:
            canvas.width = height
            canvas.height = width
            degree = 90
            drawWidth = width
            drawHeight = -height
            break
          // iphone竖屏拍摄，此时home键在上方
          case 8:
            canvas.width = height
            canvas.height = width
            degree = 270
            drawWidth = -width
            drawHeight = height
            break
        }
      }
      // 使用canvas旋转校正
      context.rotate(degree * Math.PI / 180)
      context.drawImage(this, 0, 0, drawWidth, drawHeight)
      // 返回校正图片
      next(canvas.toDataURL('image/jpeg', 0.8))
    }
    image.src = img
  }
  /**
   * 获取元素在数组的索引值
   * @param arr 数组
   * @param ele 元素
   * @return
   */
  getIndex (arr, ele) {
    let i = arr.length
    while (i--) {
      if (arr[i].indexOf(ele) > -1) return i
    }
    return -1
  }
  /**
   * 时间戳转换时间
   * @param inputTime 时间戳
   * @return
   */
  formatDateTime (inputTime) {
    let date = new Date(inputTime)
    let y = date.getFullYear()
    let m = date.getMonth() + 1
    m = m < 10 ? ('0' + m) : m
    let d = date.getDate()
    d = d < 10 ? ('0' + d) : d
    let h = date.getHours()
    h = h < 10 ? ('0' + h) : h
    let minute = date.getMinutes()
    // let second = date.getSeconds()
    minute = minute < 10 ? ('0' + minute) : minute
    // second = second < 10 ? ('0' + second) : second
    return y + '-' + m + '-' + d + ' ' + h + ':' + minute
  }
  /**
   * 时间戳转换时间 形式 2017-08-22
   * @param inputTime 时间戳
   * @return
   */
  formatTime (inputTime) {
    let date = new Date()
    if (inputTime) date = new Date(inputTime)
    let y = date.getFullYear()
    let m = date.getMonth() + 1
    m = m < 10 ? ('0' + m) : m
    let d = date.getDate()
    d = d < 10 ? ('0' + d) : d
    return y + '-' + m + '-' + d
  }
  formatTimeToS (inputTime) {
    let date = new Date()
    if (inputTime) date = new Date(inputTime)
    let y = date.getFullYear()
    let m = date.getMonth() + 1
    m = m < 10 ? ('0' + m) : m
    let d = date.getDate()
    d = d < 10 ? ('0' + d) : d
    let h = date.getHours()
    h = h < 10 ? ('0' + h) : h
    let ms = date.getMinutes()
    ms = ms < 10 ? ('0' + ms) : ms
    let s = date.getSeconds()
    s = s < 10 ? ('0' + s) : s
    return y + '-' + m + '-' + d + ' ' + h + ':' + ms + ':' + s
  }
  getUrlkey (url) {
    let params = {}
    let arr = url.split('?')
    if (arr.length <= 1) return params
    arr = arr[1].split('&')
    for (let i = 0, l = arr.length; i < l; i++) {
      let a = arr[i].split('=')
      params[a[0]] = a[1]
    }
    return params
  }
  isWeixin () {
    const ua = window.navigator.userAgent.toLowerCase()
    return ua.match(/MicroMessenger/i) && ua.match(/MicroMessenger/i).toString() === 'micromessenger'
  }
  isAndroidWeChat () {
    const ua = window.navigator.userAgent.toLowerCase()
    return ua.match(/MicroMessenger/i) && ua.match(/MicroMessenger/i).toString() === 'micromessenger' && (ua.indexOf('android') > -1 || ua.indexOf('adr') > -1)
  }
  isAndroid () {
    const ua = window.navigator.userAgent.toLowerCase()
    return ua.indexOf('android') > -1 && window.zdb
  }
  isIOSWeChat () {
    const ua = window.navigator.userAgent.toLowerCase()
    return ua.match(/MicroMessenger/i) && ua.match(/MicroMessenger/i).toString() === 'micromessenger' && ua.indexOf('iphone') > -1
  }
  isApp () {
    return window.zdb
  }
  isPInt (str) {
    let g = /^[1-9]*[1-9][0-9]*$/
    return g.test(str)
  }
  checkNumLenFtwo (str) {
    let g = /^(\d{1,5})$/
    let f = /^(\d{1,5})\.(\d{0,2})$/
    return g.test(str) || f.test(str)
  }
  checkNumLenTen (str) {
    let g = /^(\d{1,10})$/
    return g.test(str)
  }
  // 获取不同环境
  getReferer () {
    const currentUrl = window.location.href
    if (currentUrl.indexOf('mp-test.zhudb.com') > -1) {
      return 'pre' // 预生产
    }
    if (currentUrl.indexOf('mp.zhudb.com') > -1) {
      return 'prod' // 生产
    }
    return 'test' // 测试
  }
  // 选择框格式化列表
  getPickerList (data) {
    let newArr = []
    if (data && data.length > 0) {
      data.forEach((item, index) => {
        newArr.push({
          value: item.ddValue,
          name: item.ddText,
          parent: item.parentValue
        })
        if (item.dictDTOS && item.dictDTOS.length > 0) {
          item.dictDTOS.forEach((item, index) => {
            newArr.push({
              value: item.ddValue,
              name: item.ddText,
              parent: item.parentValue
            })
            if (item.dictDTOS && item.dictDTOS.length > 0) {
              item.dictDTOS.forEach((item, index) => {
                newArr.push({
                  value: item.ddValue,
                  name: item.ddText,
                  parent: item.parentValue
                })
              })
            }
          })
        }
      })
      return newArr
    } else {
      return
    }
  }
  // 对象深合并
  deepMerge (obj1, obj2) {
    let key
    for (key in obj2) {
      // 如果target(也就是obj1[key])存在，且是对象的话再去调用deepMerge，否则就是obj1[key]里面没这个对象，需要与obj2[key]合并
      obj1[key] = obj1[key] && obj1[key].toString() === '[object Object]' ? this.deepMerge(obj1[key], obj2[key]) : obj1[key] = obj2[key]
    }
    return obj1
  }
  /**
   * 去左右空格
   * @param 字符串
   * @return
   */
  trimSides (s) {
    return (s && s.replace(/(^\s*)|(\s*$)/g, '')) || ''
  }
  /**
   * 获取对象的值
   * @param {any} obj
   * @returns
   */
  objectV (obj) {
    let arr = []
    for (let key in obj) {
      arr.push(obj[key])
    }
    return arr
  }
  confusionStr (str, frontLen, endLen) {
    const len = str.length - frontLen - endLen
    let xing = ''
    for (let i = 0; i < len; i++) {
      xing += '*'
    }
    return str.substring(0, frontLen) + xing + str.substring(str.length - endLen)
  }
  // 千分位
  commafy (num) {
    return num && num
      .toString()
      .replace(/(\d)(?=(\d{3})+$)/g, function ($1) {
        return $1 + ','
      })
  }

  addUnit (field, unit, handle) {
    if (handle && this[handle]) return field === '未录入' || field == null ? '未录入' : `${this[handle](field)}${unit}`
    return field === '未录入' || field == null ? '未录入' : `${field}${unit}`
  }
  /**
   * 展示字段处理
   * @param obj 字段所在对象
   * @param field 字段位置，String
   * @param unit 单位
   * @param handle 特殊处理
   */
  field (obj, field, unit, handle) {
    return this.addUnit(get(obj, field, '未录入'), unit, handle)
  }
  /**
   * 防止POST重复请求
   * @param type 类型 url 存储地址
   * @return
   */
  repeatReq (type, url) {
    let limitUrl = Config.limitUrl
    if (limitUrl.includes(url)) {
      let tmpReq
      if (type === 'save') {
        tmpReq = sessionStorage.getItem(Config.constants.noRepeatPost)
        tmpReq = tmpReq ? tmpReq.split(',') : []
        if (tmpReq.includes(url)) return 3
        tmpReq.push(url)
        sessionStorage.setItem(Config.constants.noRepeatPost, tmpReq)
      }
      if (type === 'clear') {
        tmpReq = sessionStorage.getItem(Config.constants.noRepeatPost)
        tmpReq = tmpReq ? tmpReq.split(',') : []
        tmpReq = tmpReq.filter(i => url !== i)
        sessionStorage.setItem(Config.constants.noRepeatPost, tmpReq)
      }
      return 1
    } else {
      return 0
    }
  }
  // 埋点
  countPlus (data, type, duration) {
      // 默认全局注册环境
    window.dplus.register({ env: this.getReferer() })
    // 全局注册 enterCode userName env
    if (type === 'register') {
      for (let key in data) {
        if (data[key] === undefined || data[key] === null || data[key] === '') {
          data[key] = '-1'
        }
        data[key] = data[key].toString()
      }
      window.dplus.register(data)
    }
    // 单个页面注册
    if (type === 'save') {
      for (let key in data) {
        if (data[key] === undefined || data[key] === null || data[key] === '') {
          data[key] = '-1'
        }
        data[key] = data[key].toString()
      }
      let storeData = {}
      if (Store.get('COUNT_PLUS')) storeData = Store.get('COUNT_PLUS')
      let newDate = Object.assign({}, storeData, data)
      Store.set('COUNT_PLUS', newDate)
    }
    // 发送
    if (type === 'send') {
      let sendData = Object.assign({
        'prodName': '-1',
        'prodCode': '-1',
        'prodType': '-1',
        'managerCode': '-1',
        'loanCode': '-1',
        'channel': '-1',
        'category': '-1'
      }, Store.get('COUNT_PLUS'))
      let registerData = Object.assign({
        'userName': window.dplus.get_property('userName') || '-1',
        'env': window.dplus.get_property('env') || this.getReferer(),
        'enterCode': window.dplus.get_property('enterCode') || '-1'
      })
      window.dplus.unregister(['userName', 'env', 'enterCode', 'prodName', 'prodCode', 'prodType', 'managerCode', 'channel', 'category'])
      if (duration) {
        sendData.pageName = duration.pageName.toString()
        sendData.stayTime = (duration.stayTime / 1000 | 0).toString()
      }
      window.dplus.register(registerData)
      // if (registerData.env === 'test' || registerData.env === 'pre') return
      window.dplus.track(data, sendData, () => (console.log(data + 'success')))
    }
  }
}

// 实例化再导出
export default new BaseUtils()
