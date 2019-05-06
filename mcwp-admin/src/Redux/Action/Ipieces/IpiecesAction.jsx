/**
 * 产品管理action
 * @return
 */
import { message } from 'antd';
import { LOAN_TOP_SUCCESS, LOAN_BASIC_SUCCESS, LOAN_GUARANTEE_SUCCESS, CHANGE_BASIC_REMARK, CHANGE_GUARANTEE_REMARK } from '../../Constants/IpiecesTypes';
import { Config } from '../../../Config/Index';
import IpiecesService from '../../../Services/IpiecesService';
import { loading } from '../Index';
import { browserHistory } from 'react-router';

/**
 * 获取 进件详情 > 头部信息查询 成功
 * @return
 */
const loanTopSuccess = (res) => {
    return {
        type: LOAN_TOP_SUCCESS,
        res
    }
}

/**
 * 获取 进件详情 > 基本信息查询 成功
 * @return
 */
const loanBasicSuccess = (res) => {
    return {
        type: LOAN_BASIC_SUCCESS,
        res
    }
}

/**
 * 获取 进件详情 > 信贷历史信息 成功
 * @return
 */
const loanGuaranteeSuccess = (res) => {
    return {
        type: LOAN_GUARANTEE_SUCCESS,
        res
    }
}

/**
 * 获取 进件详情 > 基本信息逾期情况内容
 * @return
 */
export const changeBasicRemark = (info) => {
    return {
        type: CHANGE_BASIC_REMARK,
        info
    }
}

/**
 * 获取 进件详情 > 共同借款人及担保人信息逾期情况内容
 * @return
 */
export const changeGuaranteeRemark = (info) => {
    return {
        type: CHANGE_GUARANTEE_REMARK,
        info
    }
}

/**
 * 进件详情 > 头部信息查询
 * @param {code} 进件编码
 * @return {头部信息}
 */
export const getLoanTop = (params) => {
    return dispatch => {
        dispatch(loading(true));
        IpiecesService.getLoanTop(params, (res) => {
            dispatch(loading(false));
            if(res.code == Config.errorCode.success) {
                dispatch(loanTopSuccess(res));
            } else {
                message.error(res.msg);
            }
        });
    }
}

/**
 * 进件详情 > 基本信息查询
 * @param {code} 进件编码
 * @return {基本信息}
 */
export const getLoanBasic = (params) => {
    return dispatch => {
        dispatch(loading(true));
        IpiecesService.getLoanBasic(params, (res) => {
            dispatch(loading(false));
            if(res.code == Config.errorCode.success) {
                dispatch(loanBasicSuccess(res));
            } else {
                message.error(res.msg);
            }
        });
    }
}

/**
 * 进件详情 > 信贷历史信息查询
 * @param {code} 进件编码
 * @return {信贷历史信息录入或编辑}
 */
export const getLoanGuarantee = (params) => {
    return dispatch => {
        dispatch(loading(true));
        IpiecesService.getLoanGuarantee(params, (res) => {
            dispatch(loading(false));
            if(res.code == Config.errorCode.success) {
                dispatch(loanGuaranteeSuccess(res));
            } else {
                message.error(res.msg);
            }
        });
    }
}

/**
 * 进件详情 > 信贷历史信息录入或编辑
 * @param {loanCreditHisList} 数组 [{cid: 信用人ID, ctype: 信用人类型(1借款人2共同借款人3担保人), proValue: 问题类型(1.征信情况良好无逾期记录,2.存在以下征信问题, remark: 选择征信问题时输入的污点信息)}]
 * @param {reqCode} 进件编码
 * @return {信贷历史信息录入或编辑}
 */
export const postLoanCreditHis = (params, router, address) => {
    return dispatch => {
        dispatch(loading(true));
        IpiecesService.postLoanCreditHis(params, (res) => {
            if(res.code == Config.errorCode.success) {
                message.success('提交成功');
                if (router) {
                    setTimeout(function() {
                        router.push({
                            pathname: '/ipieces/operate'
                        });
                    }, 2000);
                } else {
                    browserHistory.push(address)
                }
            } else {
                dispatch(loading(false));
                message.error(res.msg);
                if (router) {
                    setTimeout(function() {
                        router.push({
                            pathname: '/ipieces/operate'
                        });
                    }, 2000);
                } else {
                    browserHistory.push(address)
                }
            }
        });
    }
}


