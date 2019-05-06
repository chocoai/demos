/**
 * 共用services层
 * @Author: 赵俊
 * @Date:   2018-03-07
 * @Last Modified by:   赵俊
 * @Last Modified time: 2018-03-07
 */

import Xhr from './Xhr/Index';

class CommonService {
    /**
     * 获取字典值
     */
    getDict = (params) => Xhr.promiseGet('/comm/sys/dict/items/all', params);

    /**
     * 根据字典代码获取字典列表,带层级关系
     *
     * @param {code} 字典代码，用逗号分隔
     */
    getDictItems = (params) => Xhr.promiseGet('/comm/sys/dict/items', params);

    // 获取全局唯一id
    getCommId() {
        return Xhr.promiseGet('/comm/uuid');
    }
    getPictureInfo(code,fileType){
        return Xhr.promiseGet('/v1/oss/' + code + fileType + '/*')
    }
    getProductType(params){
        params.enterpriseCode=window.localStorage.getItem("ENTERP_CODE");
        return Xhr.promiseGet('/comm/sys/dict/items/custom',params)
    }
    // 获取分享的配置1,首页，2，拼图，3，分享有礼，4抽奖，5，摇一摇，6，砍利率
    getShareConfs(params){
        return Xhr.promiseGet('/v1/active/share/config',params)
    }
    // 保存分享设置
    putShareConfs(params){
        return Xhr.promisePut('/v1/active/share/config',params)
    }
    // 获取当前用户最大角色
    getUserMaxRole(){
        return Xhr.promiseGet('/v1/user/role/max')
    }
}

export default new CommonService();
