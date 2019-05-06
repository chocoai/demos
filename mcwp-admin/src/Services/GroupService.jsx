import Xhr from './Xhr/Index';

/**
 * 封装ajax请求
 * @param {any}
 */

class GroupService {

    /**
    * 获取小组列表接口
    * @return {获取小组列表接口}
    */
    getGroupInfo(params) {
        return Xhr.promiseGet('/v1/team/teams', params);
    }
    /**
    * 删除小组接口
    * @return {删除小组接口}
    */
    delGroup(params) {
        return Xhr.promiseDel('/v1/team/team', params);
    }
    /**
       * 新增/新增小组接口
       * @return {新增小组接口}
       */
    putGroupInfo(params) {
        return Xhr.promisePost('/v1/team/save', params);
    }
    /**
       * 获取成员接口
       * @return {获取成员接口}
       */
    getteamInfo(params) {
        return Xhr.promiseGet('/v1/team/member', params);
    }
    /**
       * 获取小组详情接口
       * @return {获取小组详情接口}
       */
      getGroupItem(params) {
        return Xhr.promiseGet('/v1/team/team', params);
    }
}
// 实例化再导出
export default new GroupService();
