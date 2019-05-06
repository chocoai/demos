import Store from "store";
import { getWxAuthParams } from "../service/common";
import { Config, getQueryParams, getUrlkey } from "./index";

// type 授权方式
export default (type, code, reUrl) => {
  let cookies = Store.get(Config.constants.cookies);
  // 获取code
  let wxCode = getQueryParams("code") || (cookies && cookies.wxCode);
  // 获取企业code
  let enterpriseCode = getUrlkey(window.location.search)["enterpriseCode"];
  // 获取银行code
  let bankCode = getUrlkey(window.location.search)["bankCode"];
  // 获取授权类型
  let authType = getUrlkey(window.location.search)["authType"];
  // 分享人openId
  // sessionStorage.setItem(
  //   Config.constants.activityShareOpenId,
  //   getUrlkey(window.location.search)["shareOpenId"]
  // );
  // sessionStorage.setItem(
  //   Config.constants.activityshareStartOpenId,
  //   getUrlkey(window.location.search)["shareStartOpenId"]
  // );
  // 分享人userCode, category, channel
  sessionStorage.setItem(
    Config.constants.activityShareUser,
    JSON.stringify({
      shareUserCode: getUrlkey(window.location.search)["shareUserCode"],
      category: getUrlkey(window.location.search)["category"],
      channel: getUrlkey(window.location.search)["channel"]
    })
  );
  if (wxCode || enterpriseCode || bankCode) {
    const params = {
      code: wxCode
    };
    // if (code) params.code = code
    if (enterpriseCode) params.enterpriseCode = enterpriseCode;
    if (bankCode) params.bankCode = bankCode;
    if (authType) params.authType = authType;
    // 获取公众号信息
    getWxAuthParams(params).then(res => {
      const appid = res.data && res.data.appid;
      // 缓存appid
      cookies.appid = appid;
      // 缓存bankCode
      cookies.bankCode = bankCode;
      // 缓存enterpriseCode
      cookies.enterpriseCode = enterpriseCode;
      // 缓存bankCode
      cookies.authType = authType;
      // 企业标志
      cookies.enterpSymbol = res.data && res.data.enterpSymbol;
      // 分享图标
      cookies.sharePicture = res.data && res.data.sharePicture;
      cookies.shareTitle = res.data && res.data.title;
      cookies.shareSummary = res.data && res.data.summary;
      Store.set(Config.constants.cookies, cookies);
      const componentAppId = res.data && res.data.componentAppId;
      let state = res.data && res.data.enterpriseCode;
      let currentUrl = window.location.href;
      // 非第三方授权/第三方授权 根据环境来进行判断
      // let refererUrl = "https://mp.zhudb.com";
      // if (componentAppId) {
      let refererUrl = Config.refererUrl; // 测试
      if (currentUrl.indexOf("mp-test.zhudb.com") > -1) {
        refererUrl = "https://mp-test.zhudb.com"; // 预生产
      }
      if (currentUrl.indexOf("mp.zhudb.com") > -1) {
        refererUrl = "https://mp.zhudb.com"; // 生产
      }
      // if (
      //   currentUrl.indexOf("mp.zhudb.com") > -1 ||
      //   currentUrl.indexOf("mp-test.zhudb.com") > -1
      // ) {
      //   refererUrl = window.location.origin;
      // }
      // }
      if (reUrl) currentUrl = `${window.location.origin}${reUrl}`;
      let redirectUri =
        refererUrl +
        "/tap/common/wxAuth?redirectUrl=" +
        encodeURIComponent(currentUrl);
      // 授权方式
      // let scopeType = type || "snsapi_userinfo";
      let scopeType = "snsapi_base";
      // 第三方appid是否存在
      if (componentAppId) {
        window.location.replace(
          "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" +
            appid +
            "&redirect_uri=" +
            encodeURI(redirectUri) +
            "&response_type=code&scope=" +
            scopeType +
            "&state=" +
            state +
            "&component_appid=" +
            componentAppId +
            "#wechat_redirect"
        );
      } else {
        window.location.replace(
          "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" +
            appid +
            "&redirect_uri=" +
            encodeURI(redirectUri) +
            "&response_type=code&scope=" +
            scopeType +
            "&state=" +
            state +
            "#wechat_redirect"
        );
      }
    });
  } else {
    // alert('TOKEN失效，请进入公众号重新点击菜单授权')
    // wx.closeWindow()
  }
};
