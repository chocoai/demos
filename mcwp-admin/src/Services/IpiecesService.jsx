/**
 * 进件管理services层
 * @Author: 魏昌华
 * @Date:   2017-05-27 14:08:20
 * @Last Modified by:   魏昌华
 * @Last Modified time: 2017-05-27 14:01:59
 */

import Xhr from './Xhr/Index';

/**
 * 封装ajax请求
 * @param {any}
 */

class IpiecesService {

    /**
     * 进件详情 > 头部信息查询
     * @param {code} 进件编码
     * @return {头部信息}
     */
    getLoanTop(params, success, fail) {
        return Xhr.get('/v1/loan/top', params, success, fail);
    }

    /**
     * 进件详情 > 基本信息查询
     * @param {code} 进件编码
     * @return {基本信息}
     */
    getLoanBasic(params, success, fail) {
        return Xhr.get('/v1/loan/basic', params, success, fail);
    }

    /**
     * 进件详情 > 共同借款人和担保人信息
     * @param {code} 进件编码
     * @return {共同借款人和担保人信息}
     */
    getLoanGuarantee(params, success, fail) {
        return Xhr.get('/v1/loan/guarantee', params, success, fail);
    }
    /**
     * 进件详情 > 获取个人/共同借款人/担保人信贷历史信息
     * @param {code} 进件编码
     * @return {信贷历史信息录入或编辑}
     */
    getLoanCreditHisAll(params, success, fail) {
        return Xhr.get('/v1/loan/creditHis', params, success, fail);
    }

    /**
     * 进件详情 > 获取个人信贷历史信息
     * @param {code} 进件编码
     * @return {信贷历史信息录入或编辑}
     */
    getLoanCreditHis(params, success, fail) {
        return Xhr.get('/v1/loan/creditHis/customer', params, success, fail);
    }

    /**
     * 进件详情 > 获取共同借款人信贷历史信息
     * @param {code} 进件编码
     * @return {信贷历史信息录入或编辑}
     */
    getLoanCreditLoan(params, success, fail) {
        return Xhr.get('/v1/loan/creditHis/coBorrower', params, success, fail);
    }

    /**
     * 进件详情 > 获取共同担保人信贷历史信息
     * @param {code} 进件编码
     * @return {信贷历史信息录入或编辑}
     */
    getLoanCreditGua(params, success, fail) {
        return Xhr.get('/v1/loan/creditHis/guarantor', params, success, fail);
    }

    /**
     * 进件详情 > 信贷历史信息录入或编辑
     * @param {loanCreditHisList} 数组 [{cid: 信用人ID, ctype: 信用人类型(1借款人2共同借款人3担保人), proValue: 问题类型(1.征信情况良好无逾期记录,2.存在以下征信问题, remark: 选择征信问题时输入的污点信息)}]
     * @param {reqCode} 进件编码
     * @return {信贷历史信息录入或编辑}
     */
    postLoanCreditHis(params, success, fail) {
        return Xhr.post('/v1/loan/creditHis', params, success, fail);
    }

    /**
     * 语音速记列表
     * @param {reqCode} 进件编码
     * @return {语音速记列表}
     */
    getSurveyList(params, success, fail) {
        return Xhr.get('/v1/surveyInfo/list/front', params, success, fail);
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
     * 单个语音速记转写状态
     * @param {infoId} 文件id
     * @return {转写状态}
     */
    translateStatus(params, success, fail) {
        return Xhr.get('/v1/surveyInfo', params, success, fail);
    }

    /**
     * 审批记录
     * @param {reqCode} 进件编码
     * @return {审批记录}
     */
    getLoanAudit(params, success, fail) {
        return Xhr.get('/v1/loan/loanAudit', params, success, fail);
    }

    /**
     * 进件详情 > 核身验证
     * @param {reqCode} 身份CODE
     * @return {共同借款人和担保人核身验证}
     */
    postIdentityVerify(params, success, fail) {
        return Xhr.post('/v1/za/identity/verify', params, success, fail);
    }

    /**
     * 进件列表 > 人工干预
     * @param {reqCode} 进件CODE
     * @return {人工干预}
     */
    postIoanIntervene(params, success, fail) {
        return Xhr.post('/v1/loan/intervene', params, success, fail);
    }

    // 办理抵押
    postDoMortgage(params, success, fail) {
        return Xhr.post('/v1/loan/mortgage/do', params, success, fail);
    }

    // 抵押完成
    postFinishMortgage(params, success, fail) {
        return Xhr.post('/v1/loan/mortgage/finish', params, success, fail);
    }

    /**
     * 获取进件头部信息，可以判断具体显示的tab页
     */
    getTopInfo = (params) => Xhr.promiseGet('/v1/loan/top', params);

    /**
     * 获取基本信息
     */
    getBaseInfo = (params) => Xhr.promiseGet('/v1/loan/basic', params);

    /**
     * 获取经营基本信息 businessInfoData
     */
    getBusinessInfo = (params) => Xhr.promiseGet('/v1/loan/business/info', params);

    /**
     * 获取进件其他信息 businessOtherData
     */
    getBusinessOther = (params) => Xhr.promiseGet('/v1/loan/business/other', params);

    /**
     * 生产情况分析（主营业务分析） businessAnalysisData
     */
    getBusinessAnalysis = (params) => Xhr.promiseGet('/v1/loan/business/analysis', params);

    /**
     * 共同借款人和担保人 guaranteeData
     */
    getGuaranteeData = (params) => Xhr.promiseGet('/v1/loan/guarantee', params);

    /**
     * 逻辑验证 logicData
     */
    getLogicData = (params) => Xhr.promiseGet('/v1/loan/logicVerify/dr', params);

    /**
     * 资产信息 assetsData
     */
    getAssetsData = (params) => Xhr.promiseGet('/v1/loan/assets', params);

    /**
     * 软信息 softInfo
     */
    getSoftInfo = (params) => Xhr.promiseGet('/v1/survey/softLisy', params);

    /**
     * 单条软信息 sigleSoftInfo
     */
    getSingleSoft = (params) => Xhr.promiseGet('/v1/survey/softLisy', params);

    /**
     * 进件各类校验项不匹配信息 mismatch
     */
    getMismatch = (params) => Xhr.promiseGet('/v1/loan/verifyResult/mismatch', params);

    /**
     * 获取信贷历史7/8 loanCreditHisData
     */
    getCreditHis = (params) => Xhr.promiseGet('/v1/loan/creditHis', params);

    /**
     * 获取信贷历史 loanCreditHisData
     */
    getCreditHisCustomer = (params) => Xhr.promiseGet('/v1/loan/creditHis/customer', params);

    /**
     * 获取职业信息 proInfoData
     */
    getProInfoData = (params) => Xhr.promiseGet('/v1/loan/proInfo', params);

    /**
     * 财务情况资产负债表 balance
     */
    getBalance = (params) => Xhr.promiseGet('/v1/loan/assets/info', params);

    /**
     * 财务情况损益表 income
     */
    getIncome = (params) => Xhr.promiseGet('/v1/loan/assets/incstat', params);

    /**
     * 财务情况现金流量 cash
     */
    getCash = (params) => Xhr.promiseGet('/v1/loan/assets/cash/flow', params);

    /**
     * 财务情况资产负债表 farmBalance
     */
    getFarmBalance = (params) => Xhr.promiseGet('/v1/loan/agro/assets', params);

    /**
     * 财务情况损益表 farmIncome
     */
    getFarmIncome = (params) => Xhr.promiseGet('/v1/loan/agro/assets/incstat', params);

    /**
     * 财务情况现金流量 farmCash
     */
    getFarmCash = (params) => Xhr.promiseGet('/v1/loan/agro/assets/cash/flow', params);

    /**
     * 经营信息 farmBase
     */
    getFarmBase = (params) => Xhr.promiseGet('/v1/loan/business/agricultural', params);

    /**
     * 获取上下游信息 loanDownStream
     */
    getLoanDownStream = (params) => Xhr.promiseGet('/v1/loan/business/agricultural/updowninfo', params);

    /**
     * 获取进件调查初审信息
     */
    getFirstAudit = (params) => Xhr.promiseGet('/v1/house/survey/firstAudit', params);

    /**
     * 市民贷提交综合授信审批
     */
    postFinalAudit = (params) => Xhr.promisePost('/v1/loan/citizen/finalAudit', params);

    postReplenishData = (params)=>Xhr.promisePost('/v1/loan/car/nj/replenishdata',params)
}

// 实例化再导出
export default new IpiecesService();

