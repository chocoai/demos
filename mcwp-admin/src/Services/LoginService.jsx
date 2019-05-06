/**
 * 登录Service层
 * @Author: 魏昌华
 * @Date:   2017-09-26
 * @Last Modified by:   魏昌华
 * @Last Modified time: 2017-07-08
 */

import Xhr from './Xhr/Index';

/**
 * 封装ajax请求
 * @param {any}
 */

class RuleService {

    /**
     * 登录发送验证码
     * @param {userName} 用户名
     * @return {}
     */
    smsVerifyCode(params, success, fail) {
        return Xhr.post('/comm/v1/user/smsVerifyCode', params, success, fail);
    }

    getQrCode (params, success, fail) {
        return Xhr.get('/comm/v1/scan/user/QRCode', params, success, fail);
    }

    qrLoginStatus (params, success, fail) {
        return Xhr.get('/comm/v1/scan/user/status', params, success, fail);
    }
}

// 实例化再导出
export default new RuleService();