/**
 * services层
 * 营销管理 —— 利率营销
 * @Author: 魏昌华
 * @Date:   2018-06-05
 * @Last Modified by:   魏昌华
 * @Last Modified time: 2018-06-05
 */

import Xhr from './Xhr/Index';

/**
 * 封装ajax请求
 * @param {any}
 */

class MarRateService {
    /**
     * 利率营销列表信息
     * @param {page} 第几页
     * @param {rows} 每页记录数
     * @param {startTime} 开始时间
     * @param {endTime} 结束时间
     * @param {keyWord} 模糊搜索：可以按照客户姓名、产品名称进行模糊搜索，按照联系方式精确搜索
     * @return {利率营销列表}
     */
    getRates(params) {
        return Xhr.promiseGet('/v1/rate/rateList', params);
    }

    /**
     * 利率营销列配置编辑查看接口
     * @return {利率营销列配置编辑查看接口}
     */
    getRateConf(params) {
        return Xhr.promiseGet('/v1/rate/configInfo', params);
    }

    /**
     * 利率营销列配置编辑保存接口
     * @return {利率营销列配置编辑保存接口}
     */
    putRateConf(params) {
        return Xhr.promisePut('/v1/rate/configInfo', params);
    }
}

// 实例化再导出
export default new MarRateService();
