/**
 * 公共 action
 * @return
 */

import { message } from 'antd';
import { LOADING, MODAL, REQ_SYS_DICT_SUCCESS,REQ_ENTER_DICT_SUCCESS,CLEAR_ENTER_DICT_SUCCESS, OSS_CLIENT_SUCCESS, FILE_LIST_SUCCESS, SAVA_CITIESID, SAVA_INDUSTRY, INSERT_CUST_SUCCESS, EMPTY_CITY_IND } from '../Constants/DispatchTypes';
import BaseService from '../../Services/BaseService';
import { Config } from '../../Config/Index';

/**
 * 根据字典代码获取字典列表成功
 * @return
 */
const reqSysDictSuccess = (res) => {
    return {
        type: REQ_SYS_DICT_SUCCESS,
        res
    }
}
/**
 * 根据字典代码，企业编码获取字典列表成功
 * @return
 */
const reqEnterDictSuccess = (res) => {
    return {
        type: REQ_ENTER_DICT_SUCCESS,
        res
    }
}
// 清空字典值
const clearEnterDict=()=>{
    return {
        type:CLEAR_ENTER_DICT_SUCCESS
    }
}

/**
 * 获取OSS client成功
 * @param {client} OSS client
 * @return
 */
const ossClientSuccess = (client) => {
    return {
        type: OSS_CLIENT_SUCCESS,
        client
    }
}

/**
 * 获取 已上传文件列表 成功
 * @param {res} 成功响应信息
 * @return
 */
const fileListSuccess = (res) => {
    return {
        type: FILE_LIST_SUCCESS,
        res
    }
}

/**
 * 客户信息批量导入成功
 * @return
 */
const insertCustomerSuccess = (res) => {
    return {
        type: INSERT_CUST_SUCCESS,
        res
    }
}

/**
 * 用于页面和区块的加载中状态
 * @return
 */
const loading = (loading) => {
    return {
        type: LOADING,
        loading
    }
}

/**
 * 设置对话框是否可见
 * @return
 */
const setModal = (status) => {
    return {
        type: MODAL,
        status
    }
}

/**
 * 保存多级联动多选支持城市
 * @return
 */
const saveCitiesId = (data) => {
    return {
        type: SAVA_CITIESID,
        data
    }
}

/**
 * 保存多级联动多选受众行业
 * @return
 */
const saveIndustry = (data) => {
    return {
        type: SAVA_INDUSTRY,
        data
    }
}

/**
 * 根据字典代码获取字典列表
 * @param {code} 字典代码，用逗号分隔
 * @return {字典列表}
 */
const getSysDict = (params) => {
    return dispatch => {
        dispatch(loading(true));
        BaseService.getSysDictItems(params, (res) => {
            dispatch(loading(false));
            if(res.code == Config.errorCode.success) {
                dispatch(reqSysDictSuccess(res));
            } else {
                message.error(res.msg);
            }
        })
    }
} 
/**
 * 根据字典项编码,产品编码,企业编码获取字典列表,带层级关系
 * @param {code} 字典代码，用逗号分隔
 * @return {字典列表}
 */
const getProductDict = (params) => {
    return dispatch => {
        dispatch(loading(true));
        BaseService.getProductDict(params, (res) => {
            dispatch(loading(false));
            if(res.code == Config.errorCode.success) {
                dispatch(reqEnterDictSuccess(res));
            } else {
                message.error(res.msg);
            }
        })
    }
} 

/**
 * 生成OSS client
 * @param {} 
 * @return {OSS client}
 */
const getOssClient = (params) => {
    return dispatch => {
        let OSS = window.OSS;
        const wOSS = OSS.Wrapper,
        bucket = Config.ossKey.bucket,
        region = Config.ossKey.region;
        let ossClient = null;
        if(Config.localItem('OOS_CLIENT')) ossClient = JSON.parse(Config.localItem('OOS_CLIENT'));
        let currentTime = (new Date()).getTime();
        if(!ossClient || currentTime >= ossClient.expiration) {
            BaseService.getStsToken(params, (res) => {
                if(res.code == Config.errorCode.success) {
                    let expiration = currentTime + res.data.durationSeconds * 1000;
                    let wOssParams = {
                        region: region,
                        secure: true, 
                        accessKeyId: res.data.accessKeyId,
                        accessKeySecret: res.data.accessKeySecret,
                        stsToken: res.data.securityToken,
                        bucket: bucket
                    };
                    const client = new wOSS(wOssParams);
                    dispatch(ossClientSuccess(client));
                    wOssParams.expiration = expiration;
                    Config.localItem('OOS_CLIENT', JSON.stringify(wOssParams));
                } else {
                    message.error(res.msg); 
                }
            });
        } else {
            delete ossClient.expiration;
            const client = new wOSS(ossClient);
            dispatch(ossClientSuccess(client));
        }
    }
}

/**
 * 获取文件列表
 * @param {bizCode} 关联业务ID
 * @param {bizType} 关联业务类型
 * @return {文件列表} 文件列表
 */
const getFileList = (params) => {
    return dispatch => {
        BaseService.getFileList(params, (res) => {
            dispatch(loading(false));
            if(res.code == Config.errorCode.success) {
                dispatch(fileListSuccess(res));
            } else {
                message.error(res.msg);
            }
        });
    }
}

/**
 * 删除OSS文件
 * @param {codes} 文件code,以逗号分隔
 * @return {删除状态}
 */
const delOssFile = (params, fileListParams) => {
    return dispatch => {
        dispatch(loading(true));
        BaseService.delOssFile(params, (res) => {
            if(res.code == Config.errorCode.success) {
                message.success('删除成功');
                dispatch(getFileList(fileListParams));
            } else {
                message.error(res.msg);
            }
        });
    }
}

/**
 * WEB上传到OSS后的回调接口
 * @param {bucket} 存储位置
 * @param {object} 对象名称
 * @param {etag}
 * @param {size}
 * @param {mimeType}
 * @param {bizId} 关联业务ID
 * @param {enterpriseCode} 企业用户编码
 * @param {bizType} 关联业务类型
 * @return {int32} int32
 */
const uploadCallback = (params, fileListBizType) => {
    return dispatch => {
        BaseService.ossUploadCb(params, (res) => {
            dispatch(loading(false));
            if(res.code == Config.errorCode.success) {
                message.success('上传成功');
                // 此处为征信报告所用，上传code和获取的code暂时有冲突
                // if (params.tmpCode) params.bizCode = params.tmpCode
                dispatch(getFileList({bizCode: params.bizCode, bizType: fileListBizType, fileTypes: '*'}));
            } else {
                message.error(res.msg);
            }
        })
    }
}

/**
 * 基于OSS JavaScript SDK上传文件
 * @param {client} OSS client
 * @param {key} 文件key
 * @param {file} 文件 
 * @param {fileListBizType} 用于获取文件列表的bizType
 * @return {文件}
 */
const uploadFile = (cbParams, client, key, file, fileListBizType) => {
    return dispatch => {
        dispatch(loading(true));
        client.multipartUpload(key, file, {}).then(function (res) {
            cbParams.bucket = res.bucket || Config.ossKey.bucket;
            cbParams.objKey = res.name || key;
            cbParams.etag = res.etag;
            dispatch(uploadCallback(cbParams, fileListBizType)); // 上传成功
        });
    }
}

/**
 * 基于OSS JavaScript SDK上传文件
 * @param {client} OSS client
 * @param {key} 文件key
 * @param {file} 文件 
 * @return {文件}
 */
const downloadFile = (client, object, filename) => {
    return dispatch => {
        const result = client.signatureUrl(object, {
            response: {
                'content-disposition': 'attachment; filename="' + filename + '"'
            }
        });
        window.location = result;
    }
}

/**
 * 客户信息批量导入
 * @param {multipartFile} excel文件
 * @return {excel模板}
 */
const insertCustomer = (params) => {
    return dispatch => {
        BaseService.insertCustomer(params, (res) => {
            dispatch(loading(false));
            if(res.code == Config.errorCode.success) {
                dispatch(insertCustomerSuccess(res));
            } else {
                message.error(res.msg);
            }
        });
    }
}

/**
 * 清空支持城市、受众行业
 * @return 
 */
const emptyCityInd = () => {
    return {
        type: EMPTY_CITY_IND
    }
}

export { loading, setModal, saveCitiesId, saveIndustry, getSysDict,getProductDict, getOssClient, uploadFile, downloadFile, getFileList, delOssFile, insertCustomer, emptyCityInd,clearEnterDict };