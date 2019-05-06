import Vue from "vue";
import Router from "vue-router";
import routerConfig from "../utils/routerConfig";
import {
  getQueryParams,
  Config,
  setPageTitle,
  getUrlkey,
  randomStr
} from "../utils";
import wxAuth from "../utils/wxAuth";
import Store from "store";
import wx from "weixin-js-sdk";
import { wxWebAuth, getWxUserInfo } from "../service/common";
import { isWeixin, getCookie } from "../utils";
import Wxsdk from "@/utils/wxJsSdk";
import { countPlus } from "@/utils";

Vue.use(Router);

// 获取数据
export const getRouterData = () => {
  const routes = Object.values(routerConfig).map(item => {
    const route = {
      path: item.path,
      name: item.name,
      component: () => import(`../pages/${item.component}`),
      props: true,
      // require.ensure: chunk名称不能为变量
      // component: r =>
      //   require.ensure([], () => r(require(`../views/${item.component}.vue`)), item.name),
      meta: item.meta
    };
    return item.redirect ? { ...route, redirect: item.redirect } : route;
  });
  const router = new Router({
    base: Config.baseRouter,
    mode: "history", // 路由模式
    routes: routes
  });
  beforeRouter(router);
  afterRouter(router);
  return router;
};

// 全局前置钩子
function beforeRouter(router) {
  router.beforeEach((to, from, next) => {
    if (to.path === "/common/wxAuth") {
      let wxAuthClose = Store.get(Config.constants.wxAuthClose);
      if (wxAuthClose === window.location.href) {
        // Wxsdk.wxClose()
        wx.closeWindow();
        Store.set(Config.constants.wxAuthCloseWindow, "close");
      } else {
        // code不同
        Store.set(Config.constants.wxAuthClose, window.location.href);
        Store.set(Config.constants.wxAuthCloseWindow, "open");
      }
    }
    let cookies = Store.get(Config.constants.cookies) || {};
    // 进入测试
    if (Config.test) {
      cookies.wxToken = Config.wxToken;
      Store.set(Config.constants.cookies, cookies);
      // 获取微信信息
      to.meta.authorization === "backend" &&
        getWxUserInfo({}).then(res => {
          let wxUserInfo = res && res.data;
          Store.set(Config.constants.wxUserInfo, wxUserInfo);
        });
    }
    // 后端授权进入
    if (to.meta.authorization === "backend" && !Config.test) {
      // 禁止浏览器
      if (!isWeixin()) wxAuth();
      const ua = window.navigator.userAgent.toLowerCase();
      if (ua.match(/iPhone/i) || ua.match(/Android/i)) {
        to.meta.showQr = false;
        // cookies.wxToken = getCookie(`token`);
        let wxUserInfo = getCookie(`userInfo`);
        if (JSON.parse(wxUserInfo) && JSON.parse(wxUserInfo).bankCode) {
          // TODO: 3.1 重构
          let wxInfo = JSON.parse(wxUserInfo) || {};
          Store.set(Config.constants.bankCode, wxInfo.bankCode);
          cookies = Object.assign(cookies, wxInfo);
          cookies.wxToken = wxInfo.token;
          Store.set(Config.constants.cookies, cookies);
        }
        // TODO:3.1 重构
        wxUserInfo = wxUserInfo
          ? JSON.parse(wxUserInfo)
          : Store.get(Config.constants.wxUserInfo);
        // token不存在表示是直接进入链接，授权拦截，以后可以重定向到进件页面 todo
        if (!cookies.wxToken) wxAuth();
        // 待修改
        if (cookies.bankCode)
          countPlus({ enterCode: cookies.bankCode }, "register");
        Store.set(Config.constants.cookies, cookies);
        Store.set(Config.constants.wxUserInfo, wxUserInfo);
        // 获取微信信息
        // getWxUserInfo({}).then(res => {
        //   let wxUserInfo = res && res.data;
        //   Store.set(Config.constants.wxUserInfo, wxUserInfo);
        // });
        // 活动到期不显示
        if (
          wxUserInfo.status !== "open" &&
          !to.path.includes("due") &&
          !to.path.includes("/common")
        )
          location.replace(Config.baseRouter + routerConfig.activityDue.path);
      } else {
        to.meta.showQr = true;
      }
    }
    // 进入授权页面
    if (
      /\/home\?(code|bankCode)=|\/activity\/help\?(code|bankCode)=|\/home\/product\/entry\?(code|bankCode)=/.test(
        to.fullPath
      ) &&
      !getQueryParams("wxWebAuthCode") &&
      !getQueryParams("appid") &&
      !getQueryParams("redirectUrl")
    ) {
      let wxCode = getQueryParams("code");
      let bankCode = getQueryParams("bankCode");
      // 缓存bankCode
      Store.set(Config.constants.bankCode, bankCode);
      // 先清空缓存
      Store.set(Config.constants.cookies, {});
      Store.set(Config.constants.wxUserInfo, {});
      // 公众号code存入
      if (wxCode || bankCode) {
        cookies.wxCode = wxCode;
        cookies.wxToken = "";
        countPlus({ enterCode: bankCode }, "register");
        Store.set(Config.constants.cookies, cookies);
        wxAuth();
      } else {
        next();
        // alert('TOKEN失效，请进入公众号重新点击菜单授权')
        // wx.closeWindow()
      }
      // 第三方授权
    } else if (
      getQueryParams("wxWebAuthCode") &&
      getQueryParams("enterpriseCode")
    ) {
      const params = {
        code: getQueryParams("wxWebAuthCode"),
        enterpriseCode: getQueryParams("enterpriseCode"),
        appId:
          getQueryParams("wxWebAuthAppId") ||
          Store.get(Config.constants.cookies).appid,
        authType: getQueryParams("wxWebAuthType")
      };
      // userCode
      let user = Store.get(Config.constants.cookies);
      if (user && user.userCode) {
        params.userCode = user.userCode;
      }
      cookies.enterpriseCode = getQueryParams("enterpriseCode"); // 企业编号
      Store.set(Config.constants.enterpriseCode, params.enterpriseCode);
      let activityCode = getUrlkey(window.location.search)["activityCode"];
      let type = getUrlkey(window.location.search)["type"];
      let openId = getUrlkey(window.location.search)["openId"];
      // 进行授权，获取token
      wxWebAuth(params).then(res => {
        if (res.code === 0 || res.code === "0") {
          cookies.wxToken = res.data.token;
          cookies.openId = res.data.openId;
          Store.set(Config.constants.cookies, cookies);
          // 抽奖，此处判断暂时无用，暂作以后拓展（todo）
          if (activityCode) {
            if (openId) {
              location.replace(
                Config.baseRouter +
                  to.path +
                  "?openId=" +
                  openId +
                  "&activityCode=" +
                  activityCode +
                  "&v=" +
                  randomStr(16)
              );
            } else {
              location.replace(
                Config.baseRouter +
                  to.path +
                  "?activityCode=" +
                  activityCode +
                  "&v=" +
                  randomStr(16)
              );
            }
            // 主页登录
          } else if (type) {
            location.replace(
              Config.baseRouter +
                to.path +
                "?type=" +
                type +
                "&v=" +
                randomStr(16)
            );
            // 其他情况
          } else {
            location.replace(
              Config.baseRouter + to.path + "?v=" + randomStr(16)
            );
            // location.replace(to.path + '?openId=' + openId + '&v=' + randomStr(16))
          }
        } else {
          if (cookies.wxToken) {
            wx.closeWindow();
          } else {
            alert(res.msg);
          }
        }
      });
    } else {
      if (
        isWeixin() &&
        to.meta.wxSign &&
        "/tap" + to.path !== location.pathname
      ) {
        location.assign(
          window.location.protocol +
            "//" +
            window.location.host +
            "/tap" +
            to.fullPath
        );
      } else {
        next();
      }
      // next();
    }
  });
}

// 全局后置钩子
function afterRouter(router) {
  router.afterEach(transition => {
    // 埋点全局设置，除分享
    if (transition.meta.countPlus) countPlus(transition.meta.countPlus, "send");
    window.scrollTo(0, 0);
    const title = transition.meta.title;
    setPageTitle(title);
    if (
      isWeixin() &&
      !window.location.pathname.includes(routerConfig.WeChatAuth.path) &&
      !/\?code=/.test(window.location.search)
    ) {
      Wxsdk.wxShare();
    }
  });
}
