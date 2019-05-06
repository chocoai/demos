 require(['../js/config.js?v=' + (new Date()).getTime(), '../lib/dot/dot.min'],  function(config, doT) {
    require([], function() {
       var houseHtml = '<div class="weui-cell">\
            <div class="weui-cell__bd">\
                <div class="weui-uploader">\
                    <div class="weui-uploader__hd">\
                        <p class="weui-uploader__title">房产证</p>\
                        <div class="weui-uploader__info">{{=it && it.houseRightsUrl ? it.houseRightsUrl.length : 0}}/10</div>\
                    </div>\
                    <div class="weui-uploader__bd">\
                        <ul id="uploaderFiles" class="weui-uploader__files">\
                            {{for(var i in it.houseRightsUrl){  }}\
                                <li class="weui-uploader__file weui-uploader__file_status">\
                                    <img src="../images/product-desc-bg.png" />\
                                </li>\
                            {{ } }}\
                        </ul>\
                        {{? !it.houseRightsUrl || it.houseRightsUrl.length < 10 }}\
                            <div class="weui-uploader__input-box">\
                                <input id="uploaderHouse" class="weui-uploader__input" type="file" accept="image/*" multiple="" />\
                            </div>\
                        {{?}}\
                    </div>\
                </div>\
            </div>\
        </div>\
        <div class="weui-cell house-desc-addr">{{=it && it.houseAddress ? it.houseAddress : ""}}</div>\
        <div class="weui-cell house-appr">\
            <div class="weui-cell__bd">\
                <p>房屋估值</p>\
            </div>\
            <div class="weui-cell__ft">{{=it && it.houseTotal ? it.houseTotal : 0}}万元</div>\
        </div>\
        <div class="weui-cell  loan-limit">\
            <div class="weui-cell__bd">\
                <p>最高贷款额度</p>\
            </div>\
            <div class="weui-cell__ft">{{=it && it.topLoanAmount ? it.topLoanAmount : 0}}万元</div>\
        </div>\
        <div id="gotoLoan" class="weui-btn weui-btn_primary">我要贷款</div>';
        
        var loanCode = LS.get(config.constants.houseLoanCode);
        
         // 用于压缩图片的canvas
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        // 瓦片canvas
        var tCanvas = document.createElement('canvas');
        var tctx = tCanvas.getContext('2d');

       loanAssetHouse();

       // 房屋估值信息查询
        function loanAssetHouse() {
            $.ajax({
                url: config.url + '/comm/loan/asset/house',
                type: 'GET',
                data: {code: loanCode},
                dataType: 'json',
                success: function(result) {
                    if(result.code == 0) {
                        $('#houseToLoan').html(doT.template(houseHtml)(result.data)); 
                        var maxSize = 100 * 1024;   //100KB
                        $('#uploaderHouse').on('change', function() {
                            $.showLoading();
                            var file = document.getElementById('uploaderHouse').files[0];
                            var fileNames= file.name.split('.');
                            var fileFormat = fileNames[fileNames.length-1];
                            
                            var reader = new FileReader();
                            reader.onload = function() {
                                var result = this.result;
                                var img = new Image();
                                img.src = result;
                                //如果图片大小小于100kb，则直接上传
                                if(result.length <= maxSize) {
                                    $('#uploaderFiles').append('<li class="weui-uploader__file weui-uploader__file_status"><img src="'+ result +'" /></li>');
                                    upload(result, file.type);
                                    img = null;
                                    return;
                                }
                                // 图片加载完毕之后进行压缩，然后上传
                                if(img.complete) {
                                    callback();
                                } else {
                                    img.onload = callback;
                                }

                                function callback() {
                                    var data = compress(img);
                                    $('#uploaderFiles').append('<li class="weui-uploader__file weui-uploader__file_status"><img src="'+ result +'" /></li>');
                                    // 文件上传
                                    upload(data, file.type);
                                    img = null;
                                }
                            }
                            reader.readAsDataURL(file);
                        });
                        // 我要贷款
                        $('#gotoLoan').on('click', function() {

                        });
                    } else {
                        $.toast(result.msg, 'text');
                    }
                },
                error: function() {
                    $.toast(config.constants.networkTimeout, 'text');
                }
            });
        }

        /**
         * 图片上传，将base64的图片转成二进制对象，塞进formdata上传
         * @param {*} basestr 
         * @param {*} type 
         */
        function upload(basestr, type) {
            var text = window.atob(basestr.split(",")[1]);
            var buffer = new Uint8Array(text.length);
            for (var i = 0; i < text.length; i++) {
                buffer[i] = text.charCodeAt(i);
            }
            var blob = getBlob([buffer], type);
            var xhr = new XMLHttpRequest();
            var formdata = getFormData();
            formdata.append('multipartFile', blob);
            formdata.append('loanCode', loanCode);
            formdata.append('bizType', config.constants.houseRight);
            xhr.open('post', config.url + '/comm/files/upload');
            xhr.onreadystatechange = function() {
                $.hideLoading();
                if (xhr.readyState == 4 && xhr.status == 200) {
                    var jsonData = JSON.parse(xhr.responseText);
                    if(jsonData.code == 0) {
                        $.toast('已上传成功', 'text');
                    } else {
                        $.toast(result.msg, 'text');
                    }
                } else {
                    $.toast(config.constants.networkTimeout, 'text');
                }
            };
            xhr.send(formdata);
        }
    
        /**
         * 使用canvas对大图片进行压缩
         * @param {img} 图片 
         */
        function compress(img) {
            var initSize = img.src.length;
            var width = img.width;
            var height = img.height;
            // 如果图片大于四百万像素，计算压缩比并将大小压至400万以下
            var ratio;
            if ((ratio = width * height / 4000000) > 1) {
                ratio = Math.sqrt(ratio);
                width /= ratio;
                height /= ratio;
            } else {
                ratio = 1;
            }
            canvas.width = width;
            canvas.height = height;
            // 铺底色
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            // 如果图片像素大于100万则使用瓦片绘制
            var count;
            if ((count = width * height / 1000000) > 1) {
                count = ~~(Math.sqrt(count) + 1); //计算要分成多少块瓦片
                // 计算每块瓦片的宽和高
                var nw = ~~(width / count);
                var nh = ~~(height / count);
                tCanvas.width = nw;
                tCanvas.height = nh;
                for (var i = 0; i < count; i++) {
                    for (var j = 0; j < count; j++) {
                        tctx.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, 0, 0, nw, nh);
                        ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh);
                    }
                }
            } else {
                ctx.drawImage(img, 0, 0, width, height);
            }
            //进行最小压缩
            var ndata = canvas.toDataURL('image/jpeg', 0.1);
            // console.log('压缩前：' + initSize);
            // console.log('压缩后：' + ndata.length);
            // console.log('压缩率：' + ~~(100 * (initSize - ndata.length) / initSize) + "%");
            tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0;
            return ndata;
        }

        /**
         * 获取blob对象的兼容性写法
         * @param buffer
         * @param format
         * @returns {*}
         */
        function getBlob(buffer, format) {
            try {
                return new Blob(buffer, {type: format});
            } catch (e) {
                var bb = new (window.BlobBuilder || window.WebKitBlobBuilder || window.MSBlobBuilder);
                buffer.forEach(function(buf) {
                    bb.append(buf);
                });
                return bb.getBlob(format);
            }
        }

        /**
         * 获取formdata
         */
        function getFormData() {
            var isNeedShim = ~navigator.userAgent.indexOf('Android')
                && ~navigator.vendor.indexOf('Google')
                && !~navigator.userAgent.indexOf('Chrome')
                && navigator.userAgent.match(/AppleWebKit\/(\d+)/).pop() <= 534;
            return isNeedShim ? new FormDataShim() : new FormData()
        }

        /**
         * formdata 补丁, 给不支持formdata上传blob的android机打补丁
         * @constructor
         */
        function FormDataShim() {
            var o = this,
                parts = [],
                boundary = Array(21).join('-') + (+new Date() * (1e16 * Math.random())).toString(36),
                oldSend = XMLHttpRequest.prototype.send;
            this.append = function(name, value, filename) {
                parts.push('--' + boundary + '\r\nContent-Disposition: form-data; name="' + name + '"');
                if (value instanceof Blob) {
                    parts.push('; filename="' + (filename || 'blob') + '"\r\nContent-Type: ' + value.type + '\r\n\r\n');
                    parts.push(value);
                } else {
                    parts.push('\r\n\r\n' + value);
                }
                parts.push('\r\n');
            };
            XMLHttpRequest.prototype.send = function(val) {
                var fr,
                    data,
                    oXHR = this;
                if (val === o) {
                    parts.push('--' + boundary + '--\r\n');
                    data = getBlob(parts);
                    fr = new FileReader();
                    fr.onload = function() {
                        oldSend.call(oXHR, fr.result);
                    };
                    fr.onerror = function(err) {
                        throw err;
                    };
                    fr.readAsArrayBuffer(data);
                    this.setRequestHeader('Content-Type', 'multipart/form-data; boundary=' + boundary);
                    XMLHttpRequest.prototype.send = oldSend;
                } else {
                    oldSend.call(this, val);
                }
            };
        }

    });
});
