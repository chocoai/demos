import Xhr from './Xhr/Index';

/**
 * 封装ajax请求
 * @param {any}
 */

class TemplateService {
    // 增加营销短信签名
    addOperateTemplate(params) {
        return Xhr.promisePost('/v1/message/template/operate/add', params);
    }
     // 编辑营销短信签名
     editOperateTemplate(params) {
        return Xhr.promisePut('/v1/message/template/operate/edit', params);
    }
     // 编辑短信签名
     editTemplate(params) {
        return Xhr.promisePut('/v1/message/template/edit', params);
    }
     // 删除营销短信签名check
     delOperateTemplate(params) {
        return Xhr.promisePost('/v1/message/template/operate/check', params);
    }
     // 删除营销短信签名
     delSureOperateTemplate(params) {
        return Xhr.promiseDel('/v1/message/template/operate/del', params);
    }
     // 删除短信模板
     delSureTemplate(params) {
        return Xhr.promiseDel('/v1/message/template/del', params);
    }
     // 获取通知模板tab
     getTab() {
        return Xhr.promiseGet('/v1/message/tabs');
    }
}
// 实例化再导出
export default new TemplateService();
