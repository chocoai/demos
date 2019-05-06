/**
 * 表单配置services层
 * @Author: 赵俊
 * @Date:   2018-03-07
 * @Last Modified by:   赵俊
 * @Last Modified time: 2018-03-07
 */

import Xhr from './Xhr/Index';


class FormService {
    /**
     * 获取表单配置项
     */
    getFormConf = (params) => Xhr.promiseGet('/v1/formConf', params);
    /**
     * 表单名称修改
     */
    putFormName = (params) => Xhr.promisePut('/v1/form/name', params);
    /**
     * 移动表单
     */
    postFormMove = (params) => Xhr.promisePost('/v1/form/move', params);
    /**
     * 表单启用禁用
     */
    postFormOnoff = (params) => Xhr.promisePost('/v1/form/onOff', params);


    /**
     * 获取模块配置项
     */
    getModuleConf = (params) => Xhr.promiseGet('/v1/moduleConf', params);


    /**
     * 获取字段配置项
     */
    getFieldConf = (params) => Xhr.promiseGet('/v1/fieldConf', params);
    /**
     * 字段是否必填
     */
    postFieldRequire = (params) => Xhr.promisePost('/v1/field/require', params);
     /**
     * 字段是否显示
     */
    postFieldShow = (params) => Xhr.promisePost('/v1/field/show', params);
     /**
     * 字段名称修改
     */
    postFieldName = (params) => Xhr.promisePost('/v1/field/name', params);

    /**
     * 上传报告模版
     */
    uploadModel = (params) => Xhr.promiseUpload('/v1/loan/upload/model/excel', params);
}

export default new FormService();
