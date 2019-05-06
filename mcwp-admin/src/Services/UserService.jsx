import Xhr from './Xhr/Index';

/**
 * 封装基础ajax请求
 * @param {any}
 */
class UserService {
    /**
     * 查询企业客户经理，用于任务分配
     * @param {}
     * @return {企业客户经理}
     */
    getUserRole (params) {
        return Xhr.promiseGet('/v1/user/role/select', params);
    }

    /**
     * 运营平台跳转作业平台登录
     * @param {enterpCode} 企业编码
     * @param {str} 运营平台字符串
     */
    loginOperate(params) {
        return Xhr.promisePost('/comm/v1/user/login/operate', params);
    }
}

export default new UserService();
