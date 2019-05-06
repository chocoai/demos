/**
 * 数据分析服务services层
 * @Author: 钟观发
 * @Date:   2017-09-15
 * @Last Modified by:   钟观发
 * @Last Modified time: 2017-09-15
 */

import Xhr from './Xhr/Index';

/**
 * 封装ajax请求
 * @param {any}
 */

class AnalysisService {

    /**
     * 获取数据概况
     * @param {} 
     * @return {}
     */
    getDataProfile(params, success, fail) {
        return Xhr.get('/v1/da/total', params, success, fail);
    }
    /**
     * 获取员工列表
     * @param {} 
     * @return {}
     */
    getDataStaffs(params, success, fail) {
        return Xhr.get('/v1/da/staffs', params, success, fail);
    }
    /**
     * 获取营销趋势
     * @param {} 
     * @return {}
     */
    getDataTrend(params, success, fail) {
        return Xhr.get('/v1/da/market/trend', params, success, fail);
    }
    /**
     * 营销转化率
     * @param {} 
     * @return {}
     */
    getDataConvert(params, success, fail) {
        return Xhr.get('/v1/da/market/convert', params, success, fail);
    }
    /**
     * 获取产品分析
     * @param {} 
     * @return {}
     */
    getDataProduct(params, success, fail) {
        return Xhr.get('/v1/da/product/analysis', params, success, fail);
    }
   /**
     * 获取用户性别分析
     * @param {} 
     * @return {}
     */
    getDataSex(params, success, fail) {
        return Xhr.get('/v1/da/user/userSex', params, success, fail);
    }
   /**
     * 获取用户用途分析
     * @param {} 
     * @return {}
     */
    getDataUse(params, success, fail) {
        return Xhr.get('/v1/da/user/loanUse', params, success, fail);
    }
   /**
     * 获取用户年龄
     * @param {} 
     * @return {}
     */
    getDataAge(params, success, fail) {
        return Xhr.get('/v1/da/user/userAge', params, success, fail);
    }
     /**
     * 获取任务统计（饼图）
     * @param {} 
     * @return {}
     */
    getDataTaskPie(params, success, fail) {
        return Xhr.get('/v1/da/task/statistics/pieChart', params, success, fail);
    }
     /**
     * 获取任务统计（柱状图）
     * @param {} 
     * @return {}
     */
    getDataTask(params, success, fail) {
        return Xhr.get('/v1/da/task/statistics/column', params, success, fail);
    }

    /**
     * 营销浏览量、进件量、进件率
     * @param {} 
     * @return {}
     */
    getMarketProd(params, success, fail) {
        return Xhr.get('/v1/da/market/product', params, success, fail);
    }
}

// 实例化再导出
export default new AnalysisService();