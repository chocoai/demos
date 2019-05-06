import Xhr from './Xhr/Index';

/**
 * 封装ajax请求
 * @param {any}
 */

class MessageService {
    // 获取群发短信列表
    getMessageInfo(params){
        return Xhr.promiseGet('/v1/group/sms/list', params);
    }
    //获取消息模板
    getTemplateItem(params){
        return Xhr.promisePost('/v1/message/template/group/list', params);
    }
     //群发短信
     sendMessage(params){
        return Xhr.promiseUpload('/v1/group/sms/add', params);
    }
      //验证手机号
      checkPhoneNum(params){
        return Xhr.promiseUpload('/v1/group/sms/checkPhone', params);
    }
}
// 实例化再导出
export default new MessageService();
