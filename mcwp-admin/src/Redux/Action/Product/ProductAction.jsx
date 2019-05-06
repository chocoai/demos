/**
 * 产品管理action
 * @return
 */
import { message } from 'antd';
import { REQ_PRO_SUCCESS, PROD_PUB, PROD_SHARE_SUCCESS } from '../../Constants/ProductTypes';
import { Config } from '../../../Config/Index';
import ProductService from '../../../Services/ProductService';
import { loading } from '../Index';

/**
 * 获取产品分页列表成功
 * @return
 */
const reqProSuccess = (params, res) => {
    return {
        type: REQ_PRO_SUCCESS,
        params,
        res
    }
}

/**
 * 产品发布、停贷、启用成功
 * @param {code} 产品code
 * @param {pubOp} 产品状态
 * @return
 */
const prodPubSuccess = (code, pubOp) => {
    return {
        type: PROD_PUB,
        code,
        pubOp
    }
}

/**
 * 发布成功后生成分享内容成功
 * @param {res} 响应数据
 * @return
 */
const prodShareSuccess = (res) => {
    return {
        type: PROD_SHARE_SUCCESS,
        res
    }
}

/**
 * 获取产品分页列表
 * @param {params} 请求参数
 * @param {res} 响应数据
 * @return {产品列表数据}
 */
export const getProdPage = (params) => {
    return dispatch => {
        dispatch(loading(true));
        ProductService.getProdPage(params, (res) => {
            dispatch(loading(false));
            if(res.code == Config.errorCode.success) {
                dispatch(reqProSuccess(params, res));
            } else {
                message.error(res.msg);
            }
        })
    }
} 

/**
 * 删除产品
 * @param {code} 产品code
 * @return {删除}
 */
export const deleteProduct = (params, code) => {
    return dispatch => {
        dispatch(loading(true));
        ProductService.delProduct(code, (res) => {
            if(res.code == Config.errorCode.success) {
                message.success('删除产品成功！');
                dispatch(getProdPage(params));
            } else {
                dispatch(loading(false));
                message.error(res.msg);
            }
        })
    }
}

/**
 * 产品发布、停贷、启用
 * @param {code} 产品code
 * @param {pubOp} 产品发布操作:2.发布 3.停贷 4.启用,点击发布返回2~4表示第几步未完成
 * @return
 */
export const prodPub = (code, pubOp) => {
    return dispatch => {
        dispatch(loading(true));
        ProductService.prodPub(code, pubOp, (res) => {
            dispatch(loading(false));
            if(res.code == Config.errorCode.success) {
                dispatch(prodPubSuccess(code, pubOp));
            } else {
                message.error(res.msg);
            }
        });
    }
}

/**
 * 发布成功后生成分享内容
 * @param {url} 产品URL地址
 * @param {code} 产品code
 * @param {width} 二维码宽
 * @param {height} 二维码高
 * @return
 */
export const prodShare = (params) => {
    return dispatch => {
        dispatch(loading(true));
        ProductService.prodShare(params, (res) => {
            dispatch(loading(false));
            if(res.code == Config.errorCode.success) {
                dispatch(prodShareSuccess(res));
            } else {
                message.error(res.msg);
            }
        });
    }
}