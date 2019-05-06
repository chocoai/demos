import { message } from 'antd';
import { browserHistory } from 'react-router'; // 创建route所需
import { Config } from '../../Config/Index';

const Tool = {};

const target = Config.target;
/**
 * 发送ajax请求和服务器交互
 * @param {object} mySetting 配置ajax的配置
 */
Tool.ajax = function (mySetting) {
    var setting = {
        url: window.location.pathname, //默认ajax请求地址
        async: true, //true。默认设置下，所有请求均为异步请求。如果需要发送同步请求，请将此选项设置为 false
        type: 'GET', //请求的方式
        data: {}, //发给服务器的数据
        dataType: 'json',
        success: function (text) { }, //请求成功执行方法
        error: function () { } //请求失败执行方法
    };

    var aData = []; //存储数据
    var sData = ''; //拼接数据
    //属性覆盖
    for (var attr in mySetting) {
        setting[attr] = mySetting[attr];
    }
    setting.type = setting.type.toUpperCase();
    if(setting.type != 'UPLOAD') {
        for (let attr in setting.data) {
        aData.push(attr + '=' + filter(setting.data[attr]));
    }
        sData = aData.join('&');
    }

    var xhr = new XMLHttpRequest();
    try {
        if (setting.type == 'GET' || setting.type == 'DELETE') { //get、delete方式请求
            sData = setting.url + '?' + sData;
            xhr.open(setting.type, sData + '&' + new Date().getTime(), setting.async);
            xhr.setRequestHeader("Authorization", Config.localItem('USER_AUTHORIZATION'));
            xhr.setRequestHeader("EnterpriseCode", Config.localItem('ENTERP_CODE'));
            xhr.send();
        } else if(setting.type == 'UPLOAD') { // 用作图片上传
            setting.type = 'POST';
            sData = setting.data;
            xhr.open(setting.type, setting.url, setting.async);
            xhr.setRequestHeader("Authorization", Config.localItem('USER_AUTHORIZATION'));
            xhr.setRequestHeader("EnterpriseCode", Config.localItem('ENTERP_CODE'));
            xhr.send(sData);
        } else { //post方式请求
            xhr.open(setting.type, setting.url, setting.async);
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhr.setRequestHeader("Authorization", Config.localItem('USER_AUTHORIZATION'));
            xhr.setRequestHeader("EnterpriseCode", Config.localItem('ENTERP_CODE'));
            xhr.send(sData);
        }
    } catch (e) {
        return httpEnd();
    }

    if (setting.async) {
        xhr.addEventListener('readystatechange', httpEnd, false);
    } else {
        httpEnd();
    }

    function httpEnd() {
        if (xhr.readyState == 4) {
            var head = xhr.getAllResponseHeaders();
            var response = xhr.responseText;
            //将服务器返回的数据，转换成json

            if (/application\/json/.test(head) || setting.dataType === 'json' && /^(\{|\[)([\s\S])*?(\]|\})$/.test(response)) {
                response = JSON.parse(response);
            }
            if (xhr.status == 200) { // 请求成功
                if( response.code == Config.errorCode.tokenExpire || response.code == Config.errorCode.authorityWithout || response.code == Config.errorCode.userKickout) { // 权限不足或Token到期
                    if (window.location.pathname == "/workbench/scan") {
                        // 扫码登录超时
                        browserHistory.push('/scan');
                        return;
                    } else {
                        // 登录超时
                        browserHistory.push('/error/timeout');
                        return;
                    }
                }
                var Authorization = xhr.getResponseHeader("Authorization");
                if(Authorization) Config.localItem('USER_AUTHORIZATION', Authorization); // 重新覆盖新Token
                setting.success(response, setting, xhr);
            } else { // 请求失败
                // if(!xhr.withCredentials) {
                //     // 重新登录
                //     Config.removeLocalItem();
                //     window.location.href = '/login';
                // } else {
                //     setting.error(setting, xhr);
                // }
            }
        }
    }
    xhr.end = function () {
        xhr.removeEventListener('readystatechange', httpEnd, false);
    }

    function filter(str) { //特殊字符转义
        str += ''; //隐式转换
        str = str.replace(/%/g, '%25');
        str = str.replace(/\+/g, '%2B');
        str = str.replace(/ /g, '%20');
        str = str.replace(/\//g, '%2F');
        str = str.replace(/\?/g, '%3F');
        str = str.replace(/&/g, '%26');
        str = str.replace(/=/g, '%3D');
        str = str.replace(/#/g, '%23');
        return str;
    }
    return xhr;
};

/**
 * 封装ajax put请求
 * @param {string} pathname 服务器请求地址
 * @param {object} data     发送给服务器的数据
 * @param {function} success  请求成功执行方法
 * @param {function} error    请求失败执行方法
 */
Tool.put = function (pathname, data, success, error) {
    var setting = {
        url: target + pathname, //默认ajax请求地址
        type: 'PUT', //请求的方式
        data: data, //发给服务器的数据
        success: success || function () { }, //请求成功执行方法
        error: error || function () { } //请求失败执行方法
    };
    return Tool.ajax(setting);
};

/**
 * 封装ajax delete请求
 * @param {string} pathname 服务器请求地址
 * @param {object} data     发送给服务器的数据
 * @param {function} success  请求成功执行方法
 * @param {function} error    请求失败执行方法
 */
Tool.delete = function (pathname, data, success, error) {
    var setting = {
        url: target + pathname, //默认ajax请求地址
        type: 'DELETE', //请求的方式
        data: data, //发给服务器的数据
        success: success || function () { }, //请求成功执行方法
        error: error || function () { } //请求失败执行方法
    };
    return Tool.ajax(setting);
};

/**
 * 封装ajax post请求
 * @param {string} pathname 服务器请求地址
 * @param {object} data     发送给服务器的数据
 * @param {function} success  请求成功执行方法
 * @param {function} error    请求失败执行方法
 */
Tool.post = function (pathname, data, success, error) {
    var setting = {
        url: target + pathname, //默认ajax请求地址
        type: 'POST', //请求的方式
        data: data, //发给服务器的数据
        success: success || function () { }, //请求成功执行方法
        error: error || function () { } //请求失败执行方法
    };
    return Tool.ajax(setting);
};

/**
 * 封装ajax 上传图片请求
 * @param {string} pathname 服务器请求地址
 * @param {object} data     发送给服务器的数据
 * @param {function} success  请求成功执行方法
 * @param {function} error    请求失败执行方法
 */
Tool.upload = function (pathname, data, success, error) {
    var setting = {
        url: target + pathname, //默认ajax请求地址
        type: 'UPLOAD', //请求的方式
        data: data, //发给服务器的数据
        success: success || function () { }, //请求成功执行方法
        error: error || function () { } //请求失败执行方法
    };
    return Tool.ajax(setting);
};

/**
 * 封装ajax get请求
 * @param {string} pathname 服务器请求地址
 * @param {object} data     发送给服务器的数据
 * @param {function} success  请求成功执行方法
 * @param {function} error    请求失败执行方法
 */

Tool.get = function (pathname, data, success, error) {
    var setting = {
        url: target + pathname, //默认ajax请求地址
        type: 'GET', //请求的方式
        data: data, //发给服务器的数据
        success: success || function () { }, //请求成功执行方法
        error: error || function () { } //请求失败执行方法
    };
    return Tool.ajax(setting);
};


Tool.promiseGet = function (pathname, data, success, error) {
    return new Promise((resolve, reject) => {
        Tool.get(pathname, data, (res) => {
            if(res.code == Config.errorCode.success || res.code == Config.errorCode.qrCodeTimeout) {
              resolve(res)
            } else {
              message.destroy()
              message.error(res.msg)
              reject(res.msg)
            }
        }, (err) => {
            reject()
        });
    })
}

Tool.promisePut = function (pathname, data, success, error) {
    return new Promise((resolve, reject) => {
        Tool.put(pathname, data, (res) => {
            if(res.code == Config.errorCode.success) {
              resolve(res)
            } else {
              message.destroy()
              message.error(res.msg);
              resolve(false); // code非0，直接返回false
            }
        }, (err) => {
          reject()
        });
    })
  }

Tool.promisePost = function (pathname, data, success, error) {
  return new Promise((resolve, reject) => {
      Tool.post(pathname, data, (res) => {
          if(res.code == Config.errorCode.success) {
            resolve(res)
          } else {
            message.destroy()
            message.error(res.msg);
            resolve(false); // code非0，直接返回false
          }
      }, (err) => {
        reject()
      });
  })
}

Tool.promiseDel = function (pathname, data, success, error) {
  return new Promise((resolve, reject) => {
      Tool.delete(pathname, data, (res) => {
          if(res.code == Config.errorCode.success||res.code==Config.errorCode.cannotDelTeam) {
            resolve(res)
          } else {
            message.destroy()
            message.error(res.msg)
            reject(res.msg)
          }
      }, (err) => {
          reject()
      });
  })
}

Tool.promiseUpload = function (pathname, data, success, error) {
    return new Promise((resolve, reject) => {
        Tool.upload(pathname, data, (res) => {
            if(res.code == Config.errorCode.success||res.code==Config.errorCode.channelImportError) {
                resolve(res)
            } else {
                message.destroy()
                message.error(res.msg)
                resolve(false); // code非0，直接返回false
            }
        }, (err) => {
            reject()
        });
    })
  }


export default Tool;
