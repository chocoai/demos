import Xhr from './Xhr/Index';

/**
 * 封装基础ajax请求
 * @param {any}
 */
class ValuationService {
    /**
     * 获取估值工具列表
     * @param {} 
     * @return {获取估值工具列表}
     */
    getValuationInfo(params, success, fail) {
        return Xhr.get('/v1/valuation/info', params, success, fail);
    }
    /**
     * 设置估值工具
     * @param {} 
     * @return {设置估值工具}
     */
    putValuationDepl(params, success, fail) {
        return Xhr.put('/v1/valuation/depl', params, success, fail);
    }
    /**
     * 获取估值工具配置
     * @param {} 
     * @return {获取估值工具配置}
     */
    getValuationDepl(params, success, fail) {
        return Xhr.get('/v1/valuation/depl', params, success, fail);
    }

    /**
     * 估值记录详情
     * @param {code} 估值记录code
     * @return {估值记录详情}
     */
    getValuationDetail(params) {
      return Xhr.promiseGet('/v1/valuation/info/' + params.code, params);
    }

    /**
     * 新增估值记录备注
     * @param {remark} 备注信息
     * @param {code} 估值记录code
     * @return {新增}
     */
    addValuationRemark(params) {
      return Xhr.promisePost('/v1/valuation/info/remark', params);
    }
}

// 实例化再导出
export default new ValuationService();