/**
 * 数据服务action
 * @return
 */
import { message } from 'antd';
import { REQ_SRV_LIST_SUCCESS, REQ_SRV_DETAIL_SUCCESS, OP_SERV_SUCCESS } from '../../Constants/DataServiceTypes';
import { Config } from '../../../Config/Index';
import DataService from '../../../Services/DataService';
import { loading } from '../Index';

/**
 * 获取数据服务列表成功
 * @return
 */
const reqSrvListSuccess = (params, res) => {
    return {
        type: REQ_SRV_LIST_SUCCESS,
        params,
        res
    }
}

/**
 * 获取数据服务明细成功
 * @return
 */
const reqSrvDetailSuccess = (res) => {
    return {
        type: REQ_SRV_DETAIL_SUCCESS,
        res
    }
}

/**
 * 操作服务成功
 * @return
 */
const opServSuccess = (params) => {
    return {
        type: OP_SERV_SUCCESS,
        params
    }
}

/**
 * 获取数据服务列表
 * @param {page} 第几页
 * @param {rows} 每页记录数
 * @param {sort} 排序字段
 * @param {order} 排序方式：(升序:asc,降序：desc)默认降序
 * @param {startTime} 开始时间
 * @param {endTime} 结束时间
 * @param {keyWord} 搜索关键字
 * @param {srvType} 1:风控供应商 2：数据校验
 * @return {数据服务列表}
 */
export const getSrvList = (params) => {
    return dispatch => {
        dispatch(loading(true));
        DataService.getSrvList(params, (res) => {
            dispatch(loading(false));
            if(res.code == Config.errorCode.success) {
                dispatch(reqSrvListSuccess(params, res));
            } else {
                message.error(res.msg);
            }
        })
    }
} 

/**
 * 获取数据服务明细
 * @param {code} 数据服务code
 * @return {数据服务明细}
 */
export const getSrvDetail = (params) => {
    return dispatch => {
        DataService.getSrvDetail(params, (res) => {
            if(res.code == Config.errorCode.success) {
                dispatch(reqSrvDetailSuccess(res));
            } else {
                message.error(res.msg);
            }
        })
    }
}

/**
 * 操作服务
 * @param {code} 数据服务code 
 * @param {srvStatus} 操作状态，true为开启，false为关闭
 * @return {操作结果}
 */
export const operationServ = (params) => {
    return dispatch => {
        dispatch(loading(true));
        DataService.operationServ(params, (res) => {
            dispatch(loading(false));
            if(res.code == Config.errorCode.success) {
                dispatch(opServSuccess(params));
            } else {
                message.error(res.msg);
            }
        });
    }
}
