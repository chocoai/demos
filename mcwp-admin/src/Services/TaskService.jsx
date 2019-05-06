import Xhr from './Xhr/Index';

/**
 * 封装ajax put请求
 * @param {any}
 */
class TaskService {
    /**
     * 获取任务执行情况
     * @param {}
     * @return {任务执行情况}
     */
    getTaskSituation(params, success, fail) {
        return Xhr.get('/v1/task/situation', params, success, fail);
    }
    
    /**
     * 获取任务列表
     * @param {page} 第几页
     * @param {rows} 每页记录数
     * @param {sort} 排序字段
     * @param {order} 排序方式：(升序:asc,降序：desc)默认降序
     * @param {startTime} 开始时间
     * @param {endTime} 结束时间
     * @param {dateKey} 日期标记天数
     * @param {keyWord} 搜索关键字
     * @param {taskStatus} 完成情况
     * @param {taskType} 任务类型:1.营销任务,2.调查任务,3.全部任务
     * @return {任务列表}
     */
    getTasks(params, success, fail) { 
        return Xhr.get('/v1/tasks', params, success, fail);
    }

    /**
     * 任务状态编辑
     * @param {code} 任务编码
     * @param {taskStatus} 任务状态:1.待完成,2.已完成,3.延期
     * @param {expiryDateLong} 到期日(时间戳)
     * @param {owner} 执行人
     * @param {ownerName} 执行人姓名
     * @return {任务列表}
     */
    updateTaskStatus(params, success, fail) { 
        return Xhr.put('/v1/task', params, success, fail);
    }

    /**
     * 创建任务
     * @param {taskType} 任务类型:1.营销任务,2.调查任务,4.催收任务
     * @param {taskName} 任务名（营销任务必传）
     * @param {owner} 执行人ID
     * @param {ownerName} 执行人姓名
     * @param {expiryDate} 到期日(时间戳)
     * @return {创建状态}
     */
    addTask(params) {
      return Xhr.promisePost('/v1/task', params);
    }
}

// 实例化再导出
export default new TaskService();