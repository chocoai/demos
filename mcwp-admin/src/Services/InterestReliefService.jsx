import Xhr from './Xhr/Index';
class InterestReliefService {
    // 获取列表
    getInterestReliefList(params){
        return Xhr.promiseGet('/v1/active/bonus/list',params)
    }
    // 获取配置
    getInterestReliefRuleConfs(params){
        return Xhr.promiseGet('/v1/active/bonus/bonus',params)
    }
    // 保存配置
    putInterestReliefRuleConfs(params){
        return Xhr.promisePost('/v1/active/bonus/bonus',params)
    }
}

// 实例化再导出
export default new InterestReliefService();
