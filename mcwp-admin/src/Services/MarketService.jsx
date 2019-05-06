/**
 * services层
 * 营销管理 —— 渠道管理
 * @Author: 魏昌华
 * @Date:   2018-03-06
 * @Last Modified by:   魏昌华
 * @Last Modified time: 2018-03-06
 */

import Xhr from './Xhr/Index';

/**
 * 封装ajax请求
 * @param {any}
 */

class MarketService {
    // 查询模版
    getProdTpl (params) {
        return Xhr.promiseGet('/v1/prodTpl/query', params);
    }
}

// 实例化再导出
export default new MarketService();
