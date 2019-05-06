 
 /**
 * 数据分析服务services层
 * @Date:   2017-10-11
 * @Last Modified time: 2017-10-11
 */

import Xhr from './Xhr/Index';

/**
 * 封装ajax请求
 * @param {any}
 */

class ScreenService {
     /**
     * 获取客户发展趋势
     * @param {} 
     * @return {}
     */
    getDataDevTrend(params, success, fail) {
        return Xhr.get('/v1/da/customer/devTrend', params, success, fail);
    }
    /**
     * 获取业务发展趋势
     * @param {} 
     * @return {}
     */
    getDataBusiTrend(params, success, fail) {
        return Xhr.get('/v1/da/busiTrend', params, success, fail);
    }
    /**
     * 获取客户经理排行
     * @param {} 
     * @return {}
     */
    getDataRank(params, success, fail) {
        return Xhr.get('/v1/da/rank', params, success, fail);
    }
    /**
     * 获取授信、客户、放款概要
     * @param {} 
     * @return {}
     */
    getDataSummary(params, success, fail) {
        return Xhr.get('/v1/da/summary', params, success, fail);
    }
    /**
     * 获取进件、授信率、管户数
     * @param {} 
     * @return {}
     */
    getDataLoanInfo(params, success, fail) {
        return Xhr.get('/v1/da/loanInfo', params, success, fail);
    }
     /**
     * 获取实时业务情况
     * @param {} 
     * @return {}
     */
    getDataTimeBusiness(params, success, fail) {
        return Xhr.get('/v1/da/realTime/business', params, success, fail);
    }
     /**
     * 获取实时任务情况
     * @param {} 
     * @return {}
     */
    getDataTimeTask(params, success, fail) {
        return Xhr.get('/v1/da/realTime/task', params, success, fail);
    }
     /**
     * 报表数据预览
     * @param {} 
     * @return {}
     */
    getDataOverview() {
        return Xhr.promiseGet('/lc/da/overview');
    }
     /**
     * 业务流水
     * @param {} 
     * @return {}
     */
    getDataBusiFlow() {
        return Xhr.promiseGet('/lc/da/busiFlow');
    }
     /**
     * 月排行
     * @param {} 
     * @return {}
     */
    getDataRankM() {
        return Xhr.promiseGet('/lc/da/month/rank');
    }
     /**
     * 贷款金额趋势
     * @param {} 
     * @return {}
     */
    getDataLoanTrend() {
        return Xhr.promiseGet('/lc/da/loan/trend');
    }

}

// 实例化再导出
export default new ScreenService();
 