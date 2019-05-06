import Xhr from './Xhr/Index';

/**
 * 封装ajax请求
 * @param {any}
 */

class ReportsService {
    /**
     * 市民贷贷款数据统计
     * @param
     */
    postReportsCustomer(params) {
        return Xhr.promisePost('/v1/da/customer/loanlist', params);
    }
    /**
     * 营销渠道客户统计
     * @param
     */
    postReportsCustList(params) {
        return Xhr.promisePost('/v1/da/channel/custlist', params);
    }
    /**
     * 渠道数据统计
     */
    postReportsChannel(params) {
        return Xhr.promisePost('/v1/da/channel', params);
    }
    /**
     * 数据汇总统计
     */
    getDataSum(params) {
        return Xhr.promiseGet('/v1/report/summary', params);
    }
}

// 实例化再导出
export default new ReportsService();
