/**
 * 支行网点设置services层
 * @Author: 魏昌华
 * @Date:   2018-05-23
 * @Last Modified by:   赵俊
 * @Last Modified time: 2018-05-23
 */

import Xhr from './Xhr/Index';


class SubbranchService {
    /**
     * 支行网点列表,带分页
     *
     * @param {page} 第几页
     * @param {rows} 每页记录数
     * @param {sort} 排序字段
     * @param {order} 排序方式：(升序:asc,降序：desc)默认降序
     * @param {startTime} 开始时间
     * @param {endTime} 结束时间
     */
    getBranchList = (params) => Xhr.promiseGet('/bw/v1/branch/page', params);

    /**
     * 支行网点列表，不带分页
     *
     * @param {enterpriseCode} 企业编码
     */
    getBranchItems = (params) => Xhr.promiseGet('/comm/bw/v1/branch/list', params);

    /**
     * 删除支行网点信息
     *
     * @param {code} 唯一编码
     */
    delBranch = (params) => Xhr.promiseDel('/bw/v1/branch', params);

    /**
     * 获取支行网点详情
     *
     * @param {code} 唯一编码
     */
    getBranch = (params) => Xhr.promiseGet('/bw/v1/branch', params);

    /**
     * 添加支行网点
     *
     * @param {bankName} 支行名称
     * @param {bankPhone} 支行电话
     * @param {provinceRegion} 支行住址的省市区,多级斜杠隔开
     * @param {address} 支行具体地址
     * @param {startTime} 营业开始时间
     * @param {endTime} 营业结束时间
     * @param {code} 唯一编码
     */
    addBranch = (params) => Xhr.promisePost('/bw/v1/branch', params);

    /**
     * 编辑支行网点
     *
     * @param {bankName} 支行名称
     * @param {bankPhone} 支行电话
     * @param {provinceRegion} 支行住址的省市区,多级斜杠隔开
     * @param {address} 支行具体地址
     * @param {startTime} 营业开始时间
     * @param {endTime} 营业结束时间
     * @param {code} 唯一编码
     */
    editBranch = (params) => Xhr.promisePut('/bw/v1/branch', params);
}

export default new SubbranchService();
