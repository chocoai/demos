import Xhr from './Xhr/Index';

/**
 * 封装ajax请求
 * @param {any}
 */
class DataService {
    /**
     * 获取数据服务列表
     * @param {page} 第几页
     * @param {rows} 每页记录数
     * @param {sort} 排序字段
     * @param {order} 排序方式：(升序:asc,降序：desc)默认降序
     * @param {startTime} 开始时间
     * @param {endTime} 结束时间
     * @param {keyWord} 搜索关键字
     * @param {srvType} 1:风控供应商 2：数据校验
     * @return {数据服务列表}
     */
    getSrvList(params, success, fail) {
        return Xhr.get('/v1/sys/srvList', params, success, fail);
    }

    /**
     * 获取数据服务明细
     * @param {code} 数据服务code
     * @return {数据服务明细}
     */
    getSrvDetail(params, success, fail) {
        return Xhr.get('/v1/sys/extendSrv', params, success, fail);
    }

    /**
     * 操作服务
     * @param {code} 数据服务code 
     * @param {srvStatus} 操作状态，true为开启，false为关闭
     * @return {操作结果}
     */
    operationServ(params, success, fail) {
        return Xhr.put('/v1/sys/enterpSrv/operation', params, success, fail);
    }
}

// 实例化再导出
export default new DataService();