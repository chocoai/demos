import Xhr from './Xhr/Index';

/**
 * 封装基础ajax请求
 * @param {any}
 */
class ActivityService {
    /**
     * 活动列表获取
     * @param {} 
     * @return {活动列表}
     */
    getActivityList(params) {
        return Xhr.promiseGet('/v1/op/activity/list',params);
    }
    /**
     * 拼图活动列表获取
     * @param {} 
     * @return {活动列表}
     */
    getJigsawList(params){
        return Xhr.promiseGet('/v1/op/jigsaw/list/activity',params);
    }
    /**
     * 摇一摇活动列表获取
     * @param {} 
     * @return {活动列表}
     */
    getShakeList(params){
        return Xhr.promiseGet('/v1/op/shake/list/activity',params);
    }
     /**
     * 答题活动列表获取
     * @param {} 
     * @return {活动列表}
     */
    getAnswerList(params){
        return Xhr.promiseGet('/v1/op/answer/listAnswer',params);
    }
    /**
     * 活动编辑获取
     * @param {} 
     * @return {活动编辑}
     */
    getActivityEdit(params, success, fail) {
        return Xhr.get('/v1/op/activity/edit', params, success, fail);
    }
     /**
     * 拼图活动编辑获取
     * @param {} 
     * @return {活动编辑}
     */
    getJigsawEdit(params) {
        return Xhr.promiseGet('/v1/op/jigsaw/activity', params);
    }
     /**
     * 摇一摇编辑获取
     * @param {} 
     * @return {活动编辑}
     */
    getShakeEdit(params) {
        return Xhr.promiseGet('/v1/op/shake/activity', params);
    }
    /**
     * 活动结束
     * @param {} 
     * @return {活动结束}
     */
    postActivityPause(params, success, fail) {
        return Xhr.post('/v1/op/activity/pause', params, success, fail);
    }
    /**
     * 活动详情获取
     * @param {} 
     * @return {活动详情获取}
     */
    getActivityDetail(params, success, fail) {
        return Xhr.get('/v1/op/activity/detail', params, success, fail);
    }
    /**
     * 拼图活动中奖详情获取
     * @param {} 
     * @return {活动详情获取}
     */
    getJigsawDetail(params) {
        return Xhr.promisePost('/v1/op/jigsaw/winner', params);
    }
    /**
     * 摇一摇中奖详情获取
     * @param {} 
     * @return {活动详情获取}
     */
    getShakeDetail(params) {
        return Xhr.promisePost('/v1/op/shake/winner', params);
    }
    /**
     * 发布活动
     * @param {} 
     * @return {发布活动}
     */
    publishActivity(params, success, fail) {
        return Xhr.put('/v1/op/activity/publish', params, success, fail);
    }
    /**
     * 发布活动
     * @param {} 
     * @return {发布活动}
     */
    publishActivitys(params) {
        return Xhr.promisePut('/v1/op/activity/publish', params);
    }
     /**
     * 拼图发布活动
     * @param {} 
     * @return {发布活动}
     */
    putJigsawPublish(params){
        return Xhr.promisePut('/v1/op/jigsaw/publish',params)
    }
     /**
     * 答题发布活动或者关闭活动
     * @param {} 
     * @return {发布活动}
     */
    putAnswerEndorPublish(params){
        return Xhr.promisePut('/v1/op/answer/updateStatus',params)
    }
     /**
     * 摇一摇发布活动
     * @param {} 
     * @return {发布活动}
     */
    putShakePublish(params){
        return Xhr.promisePut('/v1/op/shake/publish',params)
    }
     /**
     * 摇一摇结束活动
     * @param {} 
     * @return {结束活动}
     */
    putShakeEnd(params){
        return Xhr.promisePut('/v1/op/shake/close',params)
    }
     /**
     * 拼图结束活动
     * @param {} 
     * @return {结束活动}
     */
    putJigsawEnd(params){
        return Xhr.promisePut('/v1/op/jigsaw/close',params)
    }
    /**
     * 兑奖
     * @param {} 
     * @return {兑奖}
     */
    getCashPrize(params, success, fail) {
        return Xhr.put('/v1/op/activity/cashprize', params, success, fail);
    }

    /**
     * 保存活动(未发布)
     * @param {} 
     * @return {保存活动(未发布)}
     */
    saveUnActivity (params, success, fail) {
      return Xhr.put('/v1/op/activity/save', params, success, fail)
    }
    getJigsawQRImg(params){
        return Xhr.promiseGet('/v1/op/jigsaw/qrcode',params);
    }
    getAnswerQRImg(params){
        return Xhr.promiseGet('/v1/op/answer/qrcode',params);
    }
    getShakeQRImg(params){
        return Xhr.promiseGet('/v1/op/shake/qrcode',params);
    }
}

// 实例化再导出
export default new ActivityService();