import Xhr from './Xhr/Index';
class WxStationService {
    // 获取微站配置
    getWxStationConfig(){
        return Xhr.promiseGet('/v1/active/microstation')
    }
    // 获取下拉框
    getSelectList(params){
        return Xhr.promisePost('/v1/active/microstation/selected',params)
    }
    // 获取下拉框
    getSelectListAll(params){
        return Xhr.promiseGet('/v1/active/microstation/selected/all',params)
    }
    //修改配置
    putWxStationConfig(params){
        return Xhr.promisePost('/v1/active/microstation',params)
    }
}

export default new WxStationService();
