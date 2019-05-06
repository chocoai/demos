import Xhr from './Xhr/Index';

/**
 * 封装ajax请求
 * @param {any}
 */

class IntegralService {
    /**
     * 积分奖励列表信息
     * @param {page} 第几页
     * @param {rows} 每页记录数
     * @param {startTime} 开始时间
     * @param {endTime} 结束时间
     * @param {keyWord} 模糊搜索：可以按照客户姓名、产品名称进行模糊搜索，按照联系方式精确搜索
     * @param {proCode} 产品
     * @param {rewardTerm} 奖励条件
     * @return {积分奖励列表}
     */
    getRewardList(params) {
        return Xhr.promiseGet('/v1/score/rewardList', params);
    }
    /**
     * 积分扣除列表信息
     * @param {page} 第几页
     * @param {rows} 每页记录数
     * @param {startTime} 开始时间
     * @param {endTime} 结束时间
     * @param {keyWord} 模糊搜索：可以按照客户姓名、产品名称进行模糊搜索，按照联系方式精确搜索
     * @param {giftType} 礼品
     * @return {积分扣除列表}
     */
    getRewardDeduct(params) {
        return Xhr.promiseGet('/v1/score/consumerList', params);
    }

    // /**
    //  * 获取产品列表用于下拉接口
    //  * @return {获取产品列表用于下拉接口}
    //  */
    // getProName(params) {
    //     return Xhr.promiseGet('/v1/prod/name', params);
    // }
     /**
     * 获取奖励条件用于下拉接口
     * @return {获取奖励条件用于下拉接口}
     */
    getRewardType() {
        return Xhr.promiseGet('/v1/score/giftType');
    }

     /**
     * 获取分享设置接口
     * @return {积分奖励列配置编辑保存接口}
     */
    getShareConf(params) {
        return Xhr.promiseGet('/v1/score/configInfo', params);
    }
    /**
     * 分享编辑保存接口
     * @return {积分奖励列配置编辑保存接口}
     */
    putShareConf(params) {
        return Xhr.promisePut('/v1/score/configInfo', params);
    }
}

// 实例化再导出
export default new IntegralService();
