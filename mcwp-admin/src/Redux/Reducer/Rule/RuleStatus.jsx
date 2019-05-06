import { fromJS } from 'immutable';
import { RIGHT_STATUS_EDIT, RIGHT_STATUS_CANCEL, PROFIT_STATUS_EDIT, PROFIT_STATUS_CANCEL } from '../../Constants/RuleTypes';

// 初始化state数据
const initialState = {
    rightStatus : 1,    //权益逻辑
    profitStatus : 1,   //毛利逻辑
    saleStatus: 1,      //销售额逻辑
    purchaseStatus: 1   //采购额逻辑
};

/**
 * 产品管理reducer
 * @return
 */
const RuleStatus = (state = initialState, action) => {
    switch(action.type) {
        case RIGHT_STATUS_EDIT:
            return fromJS(state).setIn(["rightStatus"],action.data).toJS();
        case RIGHT_STATUS_CANCEL:
            return fromJS(state).setIn(["rightStatus"],action.data).toJS();
        case PROFIT_STATUS_EDIT:
            return fromJS(state).setIn(["profitStatus"],action.data).toJS();
        case PROFIT_STATUS_CANCEL:
            return fromJS(state).setIn(["profitStatus"],action.data).toJS();
        case 'SALE_STATUS_EDIT':
            return fromJS(state).setIn(["saleStatus"],action.data).toJS();
        case 'SALE_STATUS_CANCEL':
            return fromJS(state).setIn(["saleStatus"],action.data).toJS();
        case 'PURCHASE_STATUS_EDIT':
            return fromJS(state).setIn(["purchaseStatus"],action.data).toJS();
        case 'PURCHASE_STATUS_CANCEL':
            return fromJS(state).setIn(["purchaseStatus"],action.data).toJS();
        default:
            return state;
    }
}

export default RuleStatus;