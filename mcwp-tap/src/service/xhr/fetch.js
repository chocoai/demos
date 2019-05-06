import Store from "store";
import { Config } from "../../utils/index";
import { Toast } from "vant";

const baseUrl = Config.api.url;

export default async (type = "GET", url = "", data = {}) => {
  type = type.toUpperCase();
  url = baseUrl + url;
  let aData = []; // 存储数据
  let sData = ""; // 拼接数据
  for (let attr in data) {
    aData.push(attr + "=" + data[attr]);
  }
  sData = aData.join("&");
  if (type === "GET") {
    if (sData) url = url + "?" + sData;
  }
  let token = "";
  let cookies = Store.get(Config.constants.cookies);
  if (cookies && cookies.wxToken && !token) token = cookies.wxToken;
  return new Promise((resolve, reject) => {
    let requestObj;
    if (window.XMLHttpRequest) {
      requestObj = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
      // requestObj = new ActiveXObject();
    }
    requestObj.open(type, url, true);
    requestObj.setRequestHeader(
      "Content-type",
      "application/x-www-form-urlencoded"
    );
    requestObj.setRequestHeader("Authorization", token);
    if (Store.get(Config.constants.enterpriseCode))
      requestObj.setRequestHeader(
        "EnterpriseCode",
        Store.get(Config.constants.enterpriseCode)
      );
    requestObj.send(sData);
    requestObj.onreadystatechange = () => {
      if (requestObj.readyState === 4) {
        if (requestObj.status === 200) {
          const authorization = requestObj.getResponseHeader("Authorization");
          if (authorization) Store.set(Config.store.token, authorization); // 重新覆盖新Token
          let obj = requestObj.response;
          if (typeof obj !== "object") {
            obj = JSON.parse(obj);
          }
          if (obj.code === "TOKEN_EXPIRE") {
            // TOKEN失效！
            if (cookies && cookies.wxToken) delete cookies.wxToken;
            Store.set(Config.constants.cookies, cookies);
            // 暂时做统一处理，以后可以区分微信、浏览器、APP
            window.location.replace(
              "https://open.weixin.qq.com/connect/oauth2/authorize?appid=null&redirect_uri=null&response_type=code&scope=null&state=null&component_appid=null#wechat_redirect"
            );
            return;
          }
          if (obj.code === Config.api.success) {
            resolve(obj);
          } else {
            Toast(obj.msg);
          }
        } else {
          reject(requestObj);
        }
      }
    };
  });
};
