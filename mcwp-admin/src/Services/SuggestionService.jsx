/**
 * 意见反馈services层
 * @Date:   2017-09-21
 * @Last Modified time: 2017-09-21
 */

import Xhr from './Xhr/Index';

/**
 * 封装ajax请求
 * @param {any}
 */

class SuggestionService {

    /**
     * 显示图片
     * @param {} 
     * @return {}
     */
    getSuggestion(params, success, fail) {
        return Xhr.get('/comm/feedback/img/{fileId}', params, success, fail);
    }
    /**
     * 新增意见反馈
     * @param {} 
     * @return {}
     */
    postSuggestion(params, success, fail) {
        return Xhr.post('/v1/sys/feedback/add', params, success, fail);
    }
    /**
     * 删除图片
     * @param {} 
     * @return {}
     */
    deleteImg(params, success, fail) {
        return Xhr.delete(`/comm/feedback/img/${params.fileId}`, params, success, fail);
    }
  
    /**
     * 上传图片
     * @param {} 
     * @return {}
     */
    putImg(params, success, fail) {
        return Xhr.upload('/comm/feedback/img/upload', params, success, fail);
    }

}

// 实例化再导出
export default new SuggestionService();