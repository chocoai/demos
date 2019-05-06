import Xhr from './Xhr/Index';

/**
 * 封装ajax put请求
 * @param {any}
 */
class WechatService {

    /**
     * 查询企业绑定公众号
     * @param
     * @return {已绑定公众号列表}
     */
    getBoundInfo(params, success, fail) {
        return Xhr.get('/v1/sys/wx/publicSignal', params, success, fail);
    }

    /**
     * 获取公众号授权地址
     * @param
     * @return {公众号授权地址}
     */
    getAuthUrl(params, success, fail) {
        return Xhr.get('/v1/sys/wx/auth/url', params, success, fail);
    }

    /**
     * 查询公众号关注人数
     * @param
     * @return {公众号关注情况}
     */
    getFollowUser(params, success, fail) {
        return Xhr.get('/v1/sys/wx/followUser', params, success, fail);
    }

    /**
     * 同步自定义菜单
     * @param
     * @return {菜单情况}
     */
    getSyncMenu(params, success, fail) {
        return Xhr.get('/v1/sys/wx/menu/sync', params, success, fail);
    }

    /**
     * 获取缓存自定义菜单
     * @param
     * @return {缓存自定义菜单情况}
     */
    getCacheMenu(params, success, fail) {
        return Xhr.get('/v1/sys/wx/menu/cache', params, success, fail);
    }

    /**
     * 获取菜单模板
     * @param
     * @return {菜单模板情况}
     */
    getTmplMenu(params, success, fail) {
        return Xhr.get('/v1/sys/wx/menu/template', params, success, fail);
    }

    /**
     * 保存自定义菜单
     * @param
     * @return 
     */
    saveWxMenu(params, success, fail) {
        return Xhr.post('/v1/sys/wx/menu/add', params, success, fail);
    }

    /**
     * 发布自定义菜单
     * @param
     * @return 
     */
    releaseWxMenu(params, success, fail) {
        return Xhr.post('/v1/sys/wx/menu/release', params, success, fail);
    }
}

// 实例化再导出
export default new WechatService();