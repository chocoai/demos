/**
 * services层
 * 营销管理 —— 渠道管理
 * @Author: 魏昌华
 * @Date:   2018-03-06
 * @Last Modified by:   魏昌华
 * @Last Modified time: 2018-03-06
 */

import Xhr from './Xhr/Index';

/**
 * 封装ajax请求
 * @param {any}
 */

class MarChannelService {
    /**
     * 获取短链管理列表
     * @param {page} 第几页
     * @param {rows} 每页记录数
     * @param {sort} 排序字段
     * @param {order} 排序方式：(升序:asc,降序：desc)默认降序
     * @param {startTime} 开始时间
     * @param {endTime} 结束时间
     * @param {category} 类别:(1.短信 2.软文 3.图片 4.中介)
     * @param {channel} 渠道
     * @param {word} 模糊查询字段
     * @return {渠道管理列表}
     */
    getOpChannels(params) {
        return Xhr.promiseGet('/v1/operate/channels', params);
    }
    getChannelList(params) {
        return Xhr.promiseGet('/v1/channelType/list', params);
    }
    /**
     * 删除短链
     * @param {code} 渠道CODE
     * @return {删除状态}
     */
    delChannel(params) {
        return Xhr.promiseDel('/v1/operate/channel', params);
    }
    /**
     * 新增短链
     * @param {category} 类别:(1.短信 2.软文 3.图片 4.中介)
     * @param {channel} 渠道
     * @param {jumpType} 跳转url类型：1估值管理 2产品
     * @param {jumpPrdCode} 跳转产品code
     * @param {jumpPage} 产品具体页面（1.产品说明 2.申请入口）
     * @return {成功}
     */
    addChannel(params) {
        return Xhr.promisePost('/v1/operate/channel', params);
    }

    // 获取营销渠道
    getChannelType(params) {
        return Xhr.promiseGet('/v1/channelType/channelType', params);
    }
    // 获取渠道商家详情
    getChannelDetail(params) {
        return Xhr.promiseGet('/v1/merchant/info', params);
    }
    //修改商家信息
    putChannelInfo(params) {
        return Xhr.promisePut('/v1/merchant/edit', params);
    }
    // 审核商铺
    putChannelCheck(params) {
        return Xhr.promisePut('/v1/merchant/check', params);
    }
    // 停用 启用商家
    checkIsUes(params) {
        return Xhr.promisePut('/v1/merchant/status', params);
    }
    // 获取全局唯一id
    getCommId(params) {
        return Xhr.promiseGet('/comm/uuid', params);
    }
    // 新增渠道
    newChannel(params) {
        return Xhr.promisePost('/v1/channelType/add', params);
    }
    // 新增渠道
    editChannel(params) {
        return Xhr.promisePost('/v1/channelType/edit', params);
    }
    // 普通渠道详情
    getChannelComm(params) {
        return Xhr.promiseGet('/v1/channelType/info', params);
    }
    // 自由员工导入校验
    putChannelBatchCheck(params){
        return Xhr.promiseUpload('/v1/channelType/channel/import/check', params);
    }
    // 自由员工导入
    putChannelBatch(params){
        return Xhr.promiseUpload('/v1/channelType/channel/import', params);
    }
}

// 实例化再导出
export default new MarChannelService();
