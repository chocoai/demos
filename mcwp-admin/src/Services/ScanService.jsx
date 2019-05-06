/**
 * 扫码登录services层
 * @Author: 赵俊
 * @Date:   2018-12-05
 * @Last Modified by:   赵俊
 * @Last Modified time: 2018-12-05
 */

import Xhr from './Xhr/Index';


class ScanService {
    /**
     * 获取微信二维码
     */
    getQrCode = (params) => Xhr.promiseGet('/comm/v1/scan/user/QRCode/wx', params);
    /**
     * 微信扫码登录状态
     */
    qrScanStatus  = (params) => Xhr.promiseGet('/comm/v1/scan/user/status/wx', params);
}

export default new ScanService();
