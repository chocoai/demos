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

class RuleService {

    /**
     * 获取详情
     * @param {}
     * @return {}
     */
    getInfo(params, success, fail) {
        return Xhr.get('/v1/loan/logicVerify/dt', params, success, fail);
    }
    /**
     * 获取规则列表
     * @param {}
     * @return {}
     */
    getIndustryRule(params, success, fail) {
        return Xhr.get('/v1/loan/logicVerify/industryRule', params, success, fail);
    }
    /**
     * 获取配置tab
     * @param {}
     * @return {}
     */
    getConfiguresTab(params) {
        return Xhr.promiseGet('/v1/configure/tab', params);
    }
    /**
     * 获取逻辑规则默认值
     * @param {}
     * @return {}
     */
    getDefaultValue(params) {
        return Xhr.promiseGet('/v1/loan/logicVerify/default/dt', params);
    }
    /**
     * 新增规则
     * @param {}
     * @return {}
     */
    postIndustryRule(params, success, fail) {
        return Xhr.post('/v1/loan/logicVerify/dt', params, success, fail);
    }
    /**
     * 更新规则
     * @param {}
     * @return {}
     */
    putIndustryRule(params, success, fail) {
        return Xhr.put('/v1/loan/logicVerify/dt', params, success, fail);
    }
    /**
     * 删除行业规则
     * @param {}
     * @return {}
     */
    deleteIndustryRule(params, success, fail) {
        return Xhr.delete('/v1/loan/logicVerify/dt', params, success, fail);
    }
    /**
     * 行业规则详情
     * @param {}
     * @return {}
     */
    getRuleDetail(params, success, fail) {
        return Xhr.get('/v1/loan/logicVerify/dt', params, success, fail);
    }
    /**
     * 上传阈值
     * @param {}
     * @return {}
     */
    putInfo(params, success, fail) {
        return Xhr.put('/v1/loan/logicVerify/dt', params, success, fail);
    }
    /**
     * 获取配置列表
     * @param {}
     * @return {}
     */
    getConfigures(params, success, fail) {
        return Xhr.get('/v1/processConfigures', params, success, fail);
    }
     /**
     * 修改配置列表
     * @param {}
     * @return {}
     */
    putConfigures(params, success, fail) {
        return Xhr.put('/v1/processConfigures', params, success, fail);
    }
    /**
     * 获取产品配置项
     * @param {}
     * @return {}
     */
    getPictureConfigure(params, success, fail) {
        return Xhr.get('/v1/pictureConfigure', params, success, fail);
    }
    /**
     * 修改产品配置项
     * @param {}
     * @return {}
     */
    putPictureConfigure(params, success, fail) {
        return Xhr.put('/v1/pictureConfigure', params, success, fail);
    }
    /**
     * 获取所有产品配置项
     * @param {}
     * @return {}
     */
    getPictureConfigures(params, success, fail) {
        return Xhr.get('/v1/prod/rule/page', params, success, fail);
    }
    /**
     * 删除产品配置项
     * @param {}
     * @return {}
     */
    delPictureConfigure(params, success, fail) {
        return Xhr.delete('/v1/pictureConfigure', params, success, fail);
    }
    /**
     * 获取必拍项配置产品列表
     * @param {}
     * @return {}
     */
    getValuationDetail(params) {
        return Xhr.promiseGet('/v1/pictureConfigure/prods', params);
    }
    /**
     * 获取最高可贷额度
     * @param {}
     * @return {}
     */
    getMaxConfig(params) {
        return Xhr.promiseGet('/v1/configure/process', params);
    }
    /**
     * 获取客户经理分配规则
     * @param {}
     * @return {}
     */
    getDistribution(params) {
        return Xhr.promiseGet('/v1/allot/list/configure', params);
    }
    /**
     * 获取渠道分配规则
     * @param {}
     * @return {}
     */
    getChannelList(params) {
        return Xhr.promiseGet('/v1/allot/list/channel/configure', params);
    }
    /**
     * 获取客户经理分配规则规则列表
     * @param {}
     * @return {}
     */
    getDisRuleItem(params) {
        return Xhr.promiseGet('/v1/allot/list/rule', params);
    }
    /**
     * 获取客户经理分配规则小组列表
     * @param {}
     * @return {}
     */
    getDisTeamItem(params) {
        return Xhr.promiseGet('/v1/allot/list/team', params);
    }
    /**
     * 获取拍照规则
     * @param {}
     * @return {}
     */
    getPhoto(params) {
        return Xhr.promiseGet('/v1/configure/picture', params);
    }
    /**
     * 获取贷后规则下拉项
     * @param {}
     * @return {}
     */
    getLoanAfterItem(params) {
        return Xhr.promiseGet('/v1/loan/list/uncleard', params);
    }
    /**
     * 获取贷后规则下拉项
     * @param {}
     * @return {}
     */
    getLoanAfterOnWayItem(params) {
        return Xhr.promiseGet('/v1/loan/list/onway', params);
    }
    /**
     * 获取贷后规则
     * @param {}
     * @return {}
     */
    getLoanAfter(params) {
        return Xhr.promiseGet('/v1/loan/configure', params);
    }
    /**
     * 获取审查规则
     * @param {}
     * @return {}
     */
    getCheckRule(params) {
        return Xhr.promiseGet('/rule/examine/list', params);
    }
    /**
     * 获取审批规则
     * @param {}
     * @return {}
     */
    getApprovalRule(params) {
        return Xhr.promiseGet('/rule/audit/list', params);
    }
     /**
     * 获取审查员列表
     * @param {}
     * @return {}
     */
    getExaminerMember(params){
        return Xhr.promiseGet('/examiner/list', params);
    }
     /**
     * 获取审贷员列表
     * @param {}
     * @return {}
     */
    getAuditorMember(params){
        return Xhr.promiseGet('/auditor/list', params);
    }
}

// 实例化再导出
export default new RuleService();
