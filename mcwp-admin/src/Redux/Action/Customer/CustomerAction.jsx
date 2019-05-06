/**
 * 客户管理action
 * @return
 */
import { message } from 'antd';
import { REQ_CUST_SUCCESS, REQ_CUST_LIST_SUCCESS, SAVE_CUST, MANAGER_LIST, REQ_CUST_LOAN_SUCCESS, CUST_TASK_SUCCESS, EMPTY_CUST_TASK, REQ_CUST_BORROW_SUCCESS,PUT_ITEM_ARR,CLEAR_DATA } from '../../Constants/CustomerTypes';
import { Config } from '../../../Config/Index';
import CustomerService from '../../../Services/CustomerService';
import { loading } from '../Index';
import { browserHistory } from 'react-router'

/**
 * 获取客户信息成功
 * @return
 */
const reqCustSuccess = (res) => {
    return {
        type: REQ_CUST_SUCCESS,
        res
    }
}

/**
 * 获取客户信息列表成功
 * @return
 */
const reqCustListSuccess = (params, res) => {
    return {
        type: REQ_CUST_LIST_SUCCESS,
        params,
        res
    }
}

/**
 * 获取进件申请列表成功
 * @return
 */
const reqCustLoanSuccess = (params, res) => {
    return {
        type: REQ_CUST_LOAN_SUCCESS,
        params,
        res
    }
}

/**
 * 任务进度查询成功
 * @return
 */
const custTaskSuccess = (res) => {
    return {
        type: CUST_TASK_SUCCESS,
        res
    }
}

/**
 * 保存客户信息
 * @return
 */
export const saveCustomer = (info) => {
    return {
        type: SAVE_CUST,
        info
    }
}
/**
 * 改变itemarr
 * @return
 */
export const putItemArr = (info) => {
    return {
        type: PUT_ITEM_ARR,
        info
    }
}
/**
 * 客户客户经理列表
 * @return
 */
export const managerList = (info) => {
    return {
        type: MANAGER_LIST,
        info
    }
}
/**
 * 获取用户借款列表
 * @return
 */
const reqCustBorrowSuccess = (params, res) => {
    return {
        type: REQ_CUST_BORROW_SUCCESS,
        params,
        res
    }
}


/**
 * 客户信息详情
 * @param {code} 客户内码
 * @return {客户信息详情}
 */
export const getCustomer = (code) => {
    return dispatch => {
        dispatch(loading(true));
        CustomerService.getCustomer(code, (res) => {
            dispatch(loading(false));
            if(res.code == Config.errorCode.success) {
                dispatch(reqCustSuccess(res));
            } else {
                message.error(res.msg);
            }
        })
    }
}

/**
 * 获取客户信息列表
 * @param {page}
 * @param {rows} 第几页
 * @param {rowStart} 每页记录数
 * @param {sort} 排序字段
 * @param {order} 排序方式：(升序:asc,降序：desc)默认降序
 * @param {startTime} 开始时间
 * @param {endTime} 结束时间
 * @param {custType} 客户类型(1正常,2黑名单,3白名单)
 * @param {word} 模糊查询字段(目前为客户姓名/客户联系方式)
 * @return {获取客户信息列表}
 */
export const getCustomers = (params) => {
    return dispatch => {
        dispatch(loading(true));
        CustomerService.getCustomers(params, (res) => {
            dispatch(loading(false));
            if(res.code == Config.errorCode.success) {
                dispatch(reqCustListSuccess(params, res));
            } else {
                message.error(res.msg);
            }
        })
    }
}

/**
 * 客户信息编辑(批量修改客户类型)
 * @param {codes} 客户内码(用‘|’隔开)
 * @param {type} 修改类型(1加入白名单,2加入黑名单,3移出到正常)
 * @return {客户信息编辑结果}
 */
export const editCustomerType = (params, getParams) => {
    return dispatch => {
        dispatch(loading(true));
        CustomerService.editCustomerType(params, (res) => {
            dispatch(loading(false));
            if(res.code == Config.errorCode.success) {
                if(params.type == 1) {
                    message.success('已成功加入白名单！');
                }
                if(params.type == 2) {
                    message.success('已成功加入黑名单！');
                }
                if(params.type == 3) {
                    message.success('已成功移出！');
                }
                // browserHistory.push('/empty');
                browserHistory.push('/customer/list');
                dispatch(getCustomers(getParams));
            } else {
                message.error(res.msg);
            }
        })
    }
}

/**
 * 添加客户信息
 * @param {name} 用户姓名
 * @param {custType} 客户类型(1正常,2黑名单,3白名单)
 * @param {idCardNo} 身份证号码
 * @param {telephone} 客户联系方式
 * @param {maritalStatus} 婚姻状况(1未婚,2初婚,3二婚,4多次结婚,5离异)
 * @param {orgName} 企业名称
 * @param {address} 家庭地址
 * @return {添加客户信息结果}
 */
export const addCustomer = (params, router) => {
    return dispatch => {
        dispatch(loading(true));
        CustomerService.addCustomer(params, (res) => {
            if(res.code == Config.errorCode.success) {
                message.success('新增成功');
                setTimeout(function() {
                    router.push({
                        pathname: '/customer/list'
                    });
                }, 2000);
            } else {
                dispatch(loading(false));
                message.error(res.msg);
            }
        });
    }
}

/**
 * 客户信息编辑(单个客户)
 * @param {code} 客户内码
 * @param {name} 用户姓名
 * @param {custType} 客户类型(1正常,2黑名单,3白名单)
 * @param {idCardNo} 身份证号码
 * @param {telephone} 客户联系方式
 * @param {maritalStatus} 婚姻状况(1未婚,2初婚,3二婚,4多次结婚,5离异)
 * @param {orgName} 企业名称
 * @param {address} 家庭地址
 * @return {添加客户信息结果}
 */
export const editCustomer = (params, router) => {
    return dispatch => {
        dispatch(loading(true));
        CustomerService.editCustomer(params, (res) => {
            if(res.code == Config.errorCode.success) {
                message.success('修改成功');
                setTimeout(function() {
                    router.push({
                        pathname: '/customer/list'
                    });
                }, 2000);
            } else {
                dispatch(loading(false));
                message.error(res.msg);
            }
        });
    }
}

/**
 * 客户信息删除
 * @param {code} 导入任务code
 * @return {客户信息删除结果}
 */
export const delCustomer = (params, code) => {
    return dispatch => {
        dispatch(loading(true));
        CustomerService.delCustomer(code, (res) => {
            if(res.code == Config.errorCode.success) {
                message.success('删除客户成功！');
                dispatch(getCustomers(params));
            } else {
                dispatch(loading(false));
                message.error(res.msg);
            }
        })
    }
}
/**
 * 获取客户经理列表
 * @param {}
 * @return {客户经理列表}
 */
export const getManagerList = (params) => {
    return dispatch => {
        CustomerService.managerList({}, (res) => {
            if(res.code == Config.errorCode.success) {
                dispatch(managerList(res.data));
            } else {
                dispatch(loading(false));
                message.error(res.msg);
            }
        })
    }
}

/**
 * 进件申请列表
 * @param {page} 第几页
 * @param {rows} 每页记录数
 * @param {sort} 排序字段
 * @param {order} 排序方式：(升序:asc,降序：desc)默认降序
 * @param {startTime} 开始时间
 * @param {endTime} 结束时间
 * @param {code} 用户内码
 * @return {进件申请列表}
 */
export const getCustomerLoan = (params) => {
    return dispatch => {
        dispatch(loading(true));
        CustomerService.getCustomerLoan(params, (res) => {
            dispatch(loading(false));
            if(res.code == Config.errorCode.success) {
                dispatch(reqCustLoanSuccess(params, res));
            } else {
                message.error(res.msg);
            }
        })
    }
}

/**
 * 用户借款列表
 * @param {page} 第几页
 * @param {rows} 每页记录数
 * @param {sort} 排序字段
 * @param {order} 排序方式：(升序:asc,降序：desc)默认降序
 * @param {startTime} 开始时间
 * @param {endTime} 结束时间
 * @param {code} 用户内码
 * @return {用户借款列表}
 */
export const getCustomerBorrow = (params) => {
    return dispatch => {
        dispatch(loading(true));
        CustomerService.getCustomerBorrow(params, (res) => {
            dispatch(loading(false));
            if(res.code == Config.errorCode.success) {
                dispatch(reqCustBorrowSuccess(params, res));
            } else {
                message.error(res.msg);
            }
        })
    }
}
/**
 * 客户信息文件上传
 * @param {multipartFile} excel文件
 * @return {任务code}
 */
export const importCustomer = (params) => {
    return dispatch => {
        dispatch(loading(true));
        CustomerService.importCustomer(params, (res) => {
            dispatch(loading(false));
            if(res.code == Config.errorCode.success) {
                dispatch(getCustTask({code: res.data}));
            } else {
                message.error(res.msg);
            }
        })
    }
}

/**
 * 任务进度查询
 * @param {code} 导入任务code
 * @return {任务进度结果}
 */
export const getCustTask = (params) => {
    return dispatch => {
        CustomerService.getCustTask(params, (res) => {
            if(res.code == Config.errorCode.success) {
                dispatch(custTaskSuccess(res));
            } else {
                message.error(res.msg);
            }
        })
    }
}

/**
 * 清空任务进度数据
 * @return
 */
export const emptyCustTask = () => {
    return {
        type: EMPTY_CUST_TASK
    }
}
/**
 * 清空数据
 * @return
 */
export const clearData= () => {
    return {
        type: CLEAR_DATA
    }
}
