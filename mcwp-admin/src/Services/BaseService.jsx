import Xhr from './Xhr/Index';

/**
 * 封装基础ajax请求
 * @param {any}
 */
class BaseService {
    /**
     * 根据字典代码获取字典列表
     * @param {code} 字典代码，用逗号分隔
     * @return {字典列表}
     */
    getSysDictItems(params, success, fail) {
        return Xhr.get('/v1/sys/dict/items', params, success, fail);
    }
    getProductDict(params,success,fail){
        params.enterpriseCode=window.localStorage.getItem("ENTERP_CODE");
        return Xhr.get('/comm/sys/dict/items/custom',params,success,fail)
    }
    /**
     * 获取OSS临时授权TOKEN
     * @param {}
     * @return {OSS临时授权TOKEN}
     */
    getStsToken(params, success, fail) {
        return Xhr.get('/v1/oss/stsToken', params, success, fail);
    }

    /**
     * WEB上传到OSS后的回调接口
     * @param {bucket} 存储位置
     * @param {objKey} 对象名称
     * @param {style} 上传图片指定样式
     * @param {etag}
     * @param {size}
     * @param {mimeType}
     * @param {bizCode} 关联业务ID
     * @param {enterpriseCode} 企业用户编码
     * @param {bizType} 关联业务类型
     * @return {int32} int32
     */
    ossUploadCb(params, success, fail) {
        return Xhr.post('/v1/oss/callback', params, success, fail);
    }

    /**
     * 获取文件列表
     * @param {bizCode} 关联业务ID
     * @param {bizType} 关联业务类型
     * @param {fileTypes} fileTypes 文件小写后缀名，逗号分隔多类型:png,jpg,jpeg,gif;picture表示图片 video表示视频或音频 office表示(excel,word,ppt) *表示所有
     * @return {文件列表} 文件列表
     */
    getFileList(params, success, fail) {
        return Xhr.get('/v1/oss/' + params.bizCode + '/' + params.bizType + '/' + params.fileTypes, {},success, fail);
    }

    /**
     * 删除OSS文件
     * @param {codes} 文件code,以逗号分隔
     * @return {删除状态}
     */
    delOssFile(params, success, fail) {
        return Xhr.delete('/v1/oss/del/' + params.codes, params, success, fail);
    }

    /**
     * 客户信息批量导入
     * @param {multipartFile} excel文件
     * @return {excel模板}
     */
    insertCustomer(params, success, fail) {
        return Xhr.upload('/v1/customer/insert', params, success, fail);
    }
    /**
     * 版本公告获取
     * @param {}
     * @return {版本公告}
     */
    getNotice(params, success, fail) {
        return Xhr.get('/comm/version/notice', params, success, fail);
    }
    /**
     * 菜单获取
     * @param {}
     * @return {版本公告}
     */
    getMenus(params, success, fail) {
        return Xhr.get('/v1/menus', params, success, fail);
    }
    /**
     * 获取众安决策url
     * @param {}
     * @return {版本公告}
     */
    // getZaDecisionUrl(params, success, fail) {
    //     return Xhr.get('/v1/prod/zaDecision/url', params, success, fail);
    // }
    /**
     * 生成二维码(通用)
     * @param {width} 二维码宽
     * @param {height} 二维码高
     * @param {url} 链接
     * @return {二维码}
     */
    getQRCode(params) {
        return Xhr.promiseGet('/comm/v1/QRCode', params);
    }
}

// 实例化再导出
export default new BaseService();
