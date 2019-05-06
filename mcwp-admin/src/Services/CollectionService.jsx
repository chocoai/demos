/**
 * 规则管理services层
 * @Author: 赵俊
 * @Date:   2017-07-07
 * @Last Modified by:   赵俊
 * @Last Modified time: 2017-07-08
 */

import Xhr from './Xhr/Index';

/**
 * 封装ajax请求
 * @param {any}
 */

class CollectionService {

    /**
     * 获取催收列表
     * @param {} 
     * @return {}
     */
    getCollection(params, success, fail) {
        return Xhr.get('/v1/loan/collections', params, success, fail);
    }
    /**
     * 获取催收详情
     */
    getCollectionD(params, success, fail) {
        return Xhr.get('/v1/loan/collection', params, success, fail);
    }
    /**
     * 获取还款计划
     */
    getRepaymentPlan(params, success, fail) {
        return Xhr.get('/v1/loan/collection/repaymentPlan', params, success, fail);
    }
    /**
     * 语音转写
     * @param {infoId} 文件id
     * @return {转写结果}
     */
    translateVoice(params, success, fail) {
        return Xhr.post('/v1/surveyInfo/voice', params, success, fail);
    }
    /**
     * 语音速记列表
     * @param {reqCode} 进件编码
     * @return {语音速记列表}
     */
    getSurveyList(params, success, fail) {
        return Xhr.get('/v1/surveyInfo/list/front', params, success, fail);
    }
}

// 实例化再导出
export default new  CollectionService();