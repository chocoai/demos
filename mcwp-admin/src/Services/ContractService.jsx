import Xhr from './Xhr/Index';

class ContractService {
    // 查询合同模板是否开启
    getTplIsOpen () {
        return Xhr.promiseGet('/v1/contract/tpl/isopen');
    }
    // 切换合同的开关开启
    postTplIsOpen (params) {
        return Xhr.promisePost('/v1/contract/tpl/open',params);
    }
}

// 实例化再导出
export default new ContractService();