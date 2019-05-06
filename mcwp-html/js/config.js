require.config({
    baseUrl: '../lib/',
    paths: {
        'Zepto': 'zepto/zepto.min.js?v=' + (new Date()).getTime(),
        'FastClick': 'fastclick/fastclick.js?v=' + (new Date()).getTime(),
        'WeUI': 'jquery-weui/jquery-weui.min.js?v=' + (new Date()).getTime(),
        'LS': 'utils/LS.js?v=' + (new Date()).getTime(),
        'appconfig': 'api/apiUrl.js?v=' + (new Date()).getTime(),
        'wx': 'jweixin/jweixin-1.2.0'
    },
    shim: {　　
        'WeUI': {　　　　　　　
            deps: ['Zepto']　　　　　
        },
        'FastClick': {
            deps: ['Zepto']
        },
        'LS': {
            deps: ['Zepto']
        }
    }
});

define((['FastClick', 'wx', 'WeUI', 'LS', 'appconfig']), function(FastClick, wx) {
    FastClick.attach(document.body);
    var config = {
        url: appconfig.apiUrl == 'backend' ? (window.location.protocol + '//' + window.location.host + '/backend') : appconfig.apiUrl,
        constants: {
            bucket: 'zhudaibao',
            region: 'oss-cn-hangzhou',
            bizTypeFront:'LOAN_PERSON_IDENTITY_FRONT',
            bizTypeBack: 'LOAN_PERSON_IDENTITY_BACK',
            bizTypeFace: 'LOAN_PERSON_IDENTITY_FACE',
            houseRight: 'LOAN_HOUSE_HOUSERIGHT', // 进件.房产.房屋产权证
            waiter: 60,
            mobileReg: /^1[3|4|5|7|8]\d{9}$/,
            nullMobile: '请输入联系方式！',
            errorMobile: '请输入正确的联系方式！',
            nullTelephone: '请输入联系方式！',
            networkTimeout: '网络连接超时，请重试！',
            nullCname: '请输入姓名',
            nullSex: '请选择性别',
            nullVerifyCode: '请输入验证码',
            nullLoanUse: '请选择贷款用途',
            nullIdCardNo: '请输入身份证号',
            errorIdCardNo: '请输入正确的身份证号',
            nullIdCardAddr: '请输入身份证地址',
            nullMaritalStatus: '请选择婚姻状况',
            nullName: '请输入姓名',
            nullOrgName: '请输入单位名称',
            nullOrgAddr: '请输入单位地址',
            nullLoanAmount: '请输入申请金额',
            errorLoanAmount: '申请金额最多3位小数',
            nullRepaymentPeriod: '请输入申请期限',
            errorRepaymentPeriod: '申请期限只能为整数且大于0',
            nullRepaymentKind: '请选择还款方式',
            nullRelationship: '请选择您的关系',
            enterpriseCode: 'ENTERPRISE_CODE',
            reqCode: 'REQ_CODE',
            prdCode: 'PRODUCT_CODE',
            houseVal: 'HOUSE_VAL',
            houseLoanCode: 'HOUSE_LOAN_CODE',
            prdType: 'PRODUCT_TYPE',
            open: 'OPEN_WITH',
            managerCode: 'MANAGER_CODE'
        },
        isNumber: function(n) {
            if (!/^[0-9]+([.]{1}[0-9]{1,3})?$/.test(n)) {
                return false;
            }
            return true;
        },
        isInt: function(n) {
            if (!/^[0-9]+$/.test(n)) {
                return false;
            }
            return true;  
        },
        // 获取地址栏url后面的参数
        getQueryParams: function(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]);
            return null;
        },
        /**
         * 获取OSS UUID
         * 
         * @param {any} len:长度
         * @returns
         */
        getOssUUID: function(len) {
            len = len || 11;
    　　    var $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'; 
    　　    var maxPos = $chars.length;
        　　var str = '';
        　　for (var i = 0; i < len; i++) {
        　　　　str += $chars.charAt(Math.floor(Math.random() * maxPos));
        　　}
        　　return str;
        },
        codeTime: function(o) {
            waiter = config.constants.waiter;
            if (waiter == 0) {
                o.html('重新获取');
                config.constants.waiter = 60;
            } else {
                o.html(waiter + 's后重新获取');
                config.constants.waiter--;
                setTimeout(function() {
                    config.codeTime(o);
                }, 1000);
            }
        },
        // 判断身份证格式
        isIdCardNo: function(sId) {
            var aCity = { 11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁", 22: "吉林", 23: "黑龙江", 31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖北", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏", 61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外" };
            var iSum = 0;
            var info = '';
            if (!/^\d{17}(\d|x)$/i.test(sId)) return false; // 身份证长度或格式错误
            sId = sId.replace(/x$/i, "a");
            if (aCity[parseInt(sId.substr(0, 2))] == null) return false; // 身份证地区非法
            sBirthday = sId.substr(6, 4) + "-" + Number(sId.substr(10, 2)) + "-" + Number(sId.substr(12, 2));
            var d = new Date(sBirthday.replace(/-/g, "/"));
            if (sBirthday != (d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate())) return false; //身份证出生日期非法
            for (var i = 17; i >= 0; i--) iSum += (Math.pow(2, i) % 11) * parseInt(sId.charAt(17 - i), 11);
            if (iSum % 11 != 1) return false; // 身份证号非法
            //aCity[parseInt(sId.substr(0,2))]+","+sBirthday+","+(sId.substr(16,1)%2?"男":"女");//此次还可以判断出输入的身份证号的人性别
            return true;
        },
        // 判断是不是android系统
        isAndroid: function() {
            var u = navigator.userAgent;
            return u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
        },
        // 判断是不是ios系统
        isIOS: function() {
            var u = navigator.userAgent;
            return !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        },
        // 对参数进行特殊转化
        serializeObjects: function(params) {
            var obj = {};
            for (var k in params) {
                var o = params[k];
                if ('[object Array]' === Object.prototype.toString.call(o))
                    for (var i = 0; i < o.length; i++) {
                        var o1 = o[i];
                        if ('[object Object]' === Object.prototype.toString.call(o1))
                            for (var k1 in o1) obj[(k + '[' + i + '].' + k1).toString()] = o1[k1];
                        else obj[(k + '[' + i + ']').toString()] = o1;
                    } else if ('[object Object]' === Object.prototype.toString.call(o))
                        for (var k2 in o) obj[(k + '.' + k2).toString()] = o[k2];
                    else obj[k.toString()] = o;
            }
            return obj;
        },
        trimAll: function(str) {
            var result = str.replace(/(^\s+)|(\s+$)/g, '');
            return result.replace(/\s/g, '');
        },
        addTrim: function(str) {
            return str.substr(0, 3) + ' ' + str.substr(3, 4) + ' ' + str.substr(7, 4);
        }      
    };

    $.ajax({
        url: config.url + '/comm/wechat/sdk/sign',
        type: 'GET',
        data: {
            url: window.location.href
        },
        success: function(result) {
            if (result.code == 0) {
                // 微信配置
                wx.config({
                    debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId: result.data.appId, // 必填，公众号的唯一标识
                    timestamp: result.data.timestamp, // 必填，生成签名的时间戳
                    nonceStr: result.data.noncestr, // 必填，生成签名的随机串
                    signature: result.data.sign, // 必填，签名，见附录1
                    jsApiList: ['hideMenuItems'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                });
                console.log(result.data.appId);
                console.log(result.data.appId);
                // ready
                wx.ready(function() {
                    wx.hideMenuItems({
                        menuList: ["menuItem:share:appMessage", "menuItem:share:timeline", "menuItem:share:qq", "menuItem:share:weiboApp", "menuItem:favorite", "menuItem:share:facebook", "menuItem:share:QZone", "menuItem:openWithQQBrowser"] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
                    });
                });
                wx.error(function(err) {
                    $.toptip(err, 'error');
                    $.hideLoading();
                });
            } else {
                $.toptip(result.msg, 'error');
                $.hideLoading();
            }
        },
        error: function() {
            $.toptip(config.constants.networkTimeout, 'error');
            $.hideLoading();
        }
    });

    return config;
});
