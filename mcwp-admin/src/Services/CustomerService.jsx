import Xhr from './Xhr/Index';

/**
 * 封装ajax请求
 * @param {any}
 */
class CustomerService {
    /**
     * 客户信息列表
     * @param {page} 第几页
     * @param {rows} 每页记录数
     * @param {sort} 排序字段
     * @param {order} 排序方式：(升序:asc,降序：desc)默认降序
     * @param {startTime} 开始时间
     * @param {endTime} 结束时间
     * @param {custType} 客户类型(1正常,2黑名单,3白名单)
     * @param {word} 模糊查询字段(目前为客户姓名/客户联系方式)
     * @return {客户信息列表}
     */
    getCustomers(params, success, fail) {
        return Xhr.get('/v1/customers', params, success, fail);
    }

    /**
     * 客户信息详情
     * @param {code} 客户内码
     * @return {客户信息详情}
     */
    getCustomer(code, success, fail) {
        return Xhr.get('/v1/customer', {code: code}, success, fail);
    }
     /**
     * 客户详情展示共同借款人、担保人、亲属（配偶）
     * @param {code} 客户内码
     * @return {共同借款人、担保人、亲属}
     */
    getCustomerPartners(code, success, fail) {
        return Xhr.get('/v1/customer/partners', {code: code}, success, fail);
    }
    /**
     * 客户信息编辑(批量修改客户类型)
     * @param {codes} 客户内码(用‘|’隔开)
     * @param {type} 修改类型(1加入白名单,2加入黑名单,3移出到正常)
     * @return {客户信息编辑结果}
     */
    editCustomerType(params, success, fail) {
        return Xhr.put('/v1/customer/type', params, success, fail);
    }
    /**
     * 添加客户信息
     * @param {name} 用户姓名
     * @param {custType} 客户类型(1正常,2黑名单,3白名单)
     * @param {idCardNo} 身份证号码
     * @param {telephone} 客户联系方式
     * @param {maritalStatus} 婚姻状况(1未婚,2初婚,3二婚,4多次结婚,5离异)
     * @param {orgName} 企业名称
     * @param {address} 家庭地址
     * @return {添加客户信息结果}
     */
    addCustomer(params, success, fail) {
        return Xhr.post('/v1/customer', params, success, fail);
    }
    /**
     * 客户信息编辑(单个客户)
     * @param {code} 客户内码
     * @param {name} 用户姓名
     * @param {custType} 客户类型(1正常,2黑名单,3白名单)
     * @param {idCardNo} 身份证号码
     * @param {telephone} 客户联系方式
     * @param {maritalStatus} 婚姻状况(1未婚,2初婚,3二婚,4多次结婚,5离异)
     * @param {orgName} 企业名称
     * @param {address} 家庭地址
     * @return {添加客户信息结果}
     */
    editCustomer(params, success, fail) {
        return Xhr.put('/v1/customer', params, success, fail);
    }
    /**
     * 客户信息删除
     * @param {code} 导入任务code
     * @return {客户信息删除结果}
     */
    delCustomer(code, success, fail) {
        return Xhr.delete('/v1/customer', {code: code}, success, fail);
    }
    /**
     * 查询客户经理
     * @param {code} 导入任务code
     * @return {客户信息删除结果}
     */
    managerList(code, success, fail) {
        return Xhr.get('/v1/user/role/select', {}, success, fail);
    }
    /**
     * 进件申请列表
     * @param {page} 第几页
     * @param {rows} 每页记录数
     * @param {sort} 排序字段
     * @param {order} 排序方式：(升序:asc,降序：desc)默认降序
     * @param {startTime} 开始时间
     * @param {endTime} 结束时间
     * @param {code} 用户内码
     * @return {进件申请列表}
     */
    getCustomerLoan(params, success, fail) {
        return Xhr.get('/v1/customer/loanReqs', params, success, fail);
    }
    /**
     * 用户借款列表
     * @param {page} 第几页
     * @param {rows} 每页记录数
     * @param {sort} 排序字段
     * @param {order} 排序方式：(升序:asc,降序：desc)默认降序
     * @param {startTime} 开始时间
     * @param {endTime} 结束时间
     * @param {code} 用户内码
     * @return {用户借款列表}
     */
    getCustomerBorrow(params, success, fail) {
        return Xhr.get('/v1/customer/borrowInfos', params, success, fail);
    }
    /**
     * 客户信息文件上传
     * @param {multipartFile} excel文件
     * @return {任务code}
     */
    importCustomer(params, success, fail) {
        return Xhr.upload('/v1/customer/import', params, success, fail);
    }

    /**
     * 任务进度查询
     * @param {code} 导入任务code
     * @return {任务进度结果}
     */
    getCustTask(params, success, fail) {
        return Xhr.get('/v1/customer/task', params, success, fail);
    }
}

// 实例化再导出
export default new CustomerService();
