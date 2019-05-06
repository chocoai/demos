import { fromJS } from 'immutable';
import { LOAN_TOP_SUCCESS, LOAN_BASIC_SUCCESS, LOAN_GUARANTEE_SUCCESS, CHANGE_BASIC_REMARK, CHANGE_GUARANTEE_REMARK } from '../../Constants/IpiecesTypes';

// 初始化state数据
const initialState = {
    loanTopInfo: '',
    loanBasicInfo: '',
    loanGuarantee: '',
    loanCreditHis: '', // 信贷历史信息
    basicInfo: '',
    guarantee: ''
};

/**
 * 进件管理reducer
 * @return
 */
const Ipieces = (state = initialState, action) => {
    switch(action.type) {
        case LOAN_TOP_SUCCESS:
            return fromJS(state).merge({loanTopInfo: action.res.data}).toJS();
        case LOAN_BASIC_SUCCESS:
            return fromJS(state).merge({loanBasicInfo: action.res.data}).toJS();
        case LOAN_GUARANTEE_SUCCESS:
            return fromJS(state).merge({loanGuarantee: action.res.data}).toJS();
        case CHANGE_BASIC_REMARK:
            return fromJS(state).merge({basicInfo: action.info}).toJS();
        case CHANGE_GUARANTEE_REMARK:
            return fromJS(state).merge({guarantee: action.info}).toJS();
        default:
            return state;
    }
}

export default Ipieces;