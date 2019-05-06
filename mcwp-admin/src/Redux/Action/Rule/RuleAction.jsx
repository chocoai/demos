/**
 * 规则管理action
 * @return
 */
import { message } from 'antd';
import { CHANGE_RULE, RIGHT_STATUS_EDIT, RIGHT_STATUS_CANCEL, PROFIT_STATUS_EDIT, PROFIT_STATUS_CANCEL,SALE_STATUS_EDIT,SALE_STATUS_CANCEL,PURCHASE_STATUS_EDIT,PURCHASE_STATUS_CANCEL} from '../../Constants/RuleTypes';
import { Config } from '../../../Config/Index';
import RuleService from '../../../Services/RuleService';
import { loading } from '../Index';

/**
 * 获取逻辑校验阈值
 * @return
 */
export const getRule = () => {
    return dispatch => {
        dispatch(loading(true));
        RuleService.getInfo({}, (res) => {
            dispatch(loading(false));
            if(res.code == Config.errorCode.success) {
                dispatch(changeRule(res.data));
            } else {
                message.error(res.msg);
            }
        });
    }
}


/**
 * 保存逻辑校验阈值
 * @return
 */
export const putRule = (data,type) => {
    return dispatch => {
        // dispatch(loading(true));
        let params = Config.serializeObjects(data);
        RuleService.putInfo(params, (res) => {
            // dispatch(loading(false));
            if(res.code == Config.errorCode.success) {
                dispatch(editRule(type,1));
            } else {
                message.error(res.msg);
            }
        });
    }
}

/**
 * 修改逻辑校验阈值
 * @return
 */
export const changeRule = (data) => {
    return {
        type: CHANGE_RULE,
        data
    }
}

/**
 * 修改逻辑校验阈值状态
 * @return
 */
export const editRule = (type, data) => {
    switch (type) {
        case 'RIGHT_STATUS_EDIT':
            return {
                type: RIGHT_STATUS_EDIT,
                data
            }
        case 'RIGHT_STATUS_CANCEL':
            return {
                type: RIGHT_STATUS_CANCEL,
                data
            }
        case 'PROFIT_STATUS_EDIT':
            return {
                type: PROFIT_STATUS_EDIT,
                data
            }
        case 'PROFIT_STATUS_CANCEL':
            return {
                type: PROFIT_STATUS_CANCEL,
                data
            }
        case 'SALE_STATUS_EDIT':
            return {
                type: SALE_STATUS_EDIT,
                data
            }
        case 'SALE_STATUS_CANCEL':
            return {
                type: SALE_STATUS_CANCEL,
                data
            }
        case 'PURCHASE_STATUS_EDIT':
            return {
                type: PURCHASE_STATUS_EDIT,
                data
            }
        case 'PURCHASE_STATUS_CANCEL':
            return {
                type: PURCHASE_STATUS_CANCEL,
                data
            }
        default:
        break;
    }
}