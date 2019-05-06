// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router'
import Carousel3d from 'vue-carousel-3d'
import './config/rem'
import './style/index.less'
import setPageTitle from './config/setPageTitle'
import Config from './config/index'
import wxAuth from './config/wxAuth'
import Wxsdk from './config/wxJsSdk'
import store from './store/'
import routes from './router'
import App from './app'
import FastClick from 'fastclick'
import wx from 'weixin-js-sdk'
import Utils from './config/utils'
import 'babel-polyfill'

import { ToastPlugin, LoadingPlugin, WechatPlugin, AlertPlugin, ConfirmPlugin } from 'vux'
Vue.use(ToastPlugin)
Vue.use(LoadingPlugin)
Vue.use(WechatPlugin)
Vue.use(AlertPlugin)
Vue.use(Carousel3d)
Vue.use(ConfirmPlugin)
if ('addEventListener' in document) {
  document.addEventListener('DOMContendLoaded', function () {
    FastClick.attach(document.body)
  }, false)
}

// getWxSign
import { wxWebAuth } from './service/getData'

import Sto from 'store'

Vue.config.productionTip = false

Vue.use(VueRouter)

// 创建路由实例
const router = new VueRouter({
  routes: routes,
  mode: 'history',
  strict: process.env.NODE_ENV === 'development' // 生产环境使用严格模式
})

router.beforeEach((to, from, next) => {
  if (to.path === '/h5/common/wxAuth') {
    let wxAuthClose = Sto.get(Config.constants.wxAuthClose)
    if (wxAuthClose === window.location.href) {
      Wxsdk.wxClose()
      Sto.set(Config.constants.wxAuthCloseWindow, 'close')
    } else {
      // code不同
      Sto.set(Config.constants.wxAuthClose, window.location.href)
      Sto.set(Config.constants.wxAuthCloseWindow, 'open')
    }
  }
  let cookies = Sto.get(Config.constants.cookies) || {}
  if (Config.test) {
    cookies.wxToken = Config.wxToken
    Sto.set(Config.constants.cookies, cookies)
  }
  if (cookies.isIpieces && to.path !== '/h5/product/detail' && to.path !== '/h5/borrow/personal') { // 进件确认页面，防止后退
    if (cookies.personalUrl && Utils.isWeixin()) { // 如果在微信中且有个人中心页面
      next(cookies.personalUrl)
      return
    } else { // 其他返回产品详情页面
      if (cookies.proCode && cookies.managerCode && cookies.open) {
        next('/h5/product/detail?prdCode=' + (cookies && cookies.proCode) + '&managerCode=' + (cookies && cookies.managerCode) + '&openWith=' + (cookies && cookies.open))
        return
      } else {
        next()
        return
      }
    }
  }
  if (from.path === '/h5/product/detail' && (to.path === '/h5/loan/confirm' || to.path === '/h5/loan/refuse')) { // 产品详情页面，防止后退
    next(from.fullPath)
    return
  }
  if (from.path === '/h5/borrow/personal' && (to.path === '/h5/loan/confirm' || to.path === '/h5/loan/refuse')) { // 个人中心页面，防止后退
    next(from.fullPath)
    return
  }
  // if (cookies && cookies.loanCode && from.meta.title && to.meta.serviceAuth && from.path.indexOf(Config.constants.accreditRouter) === -1) { // 服务授权
  //   next(Config.constants.accreditRouter)
  //   return
  // }
  if (/\/h5\/borrow\/personal\?(code|bankCode)=|\/h5\/borrow\/loanList\?(code|bankCode)=|\/h5\/borrow\/bankDot\?(code|bankCode)=|\/h5\/borrow\/product\?(code|bankCode)=|\/h5\/activity\/turntable\?(code|bankCode)=|\/h5\/valuation\/market\?(code|bankCode)=|\/h5\/activity\/valuation\?(code|bankCode)=|\/h5\/activity\/list\?(code|bankCode|enterpriseCode)=/.test(to.fullPath) && !Utils.getQueryParams('wxWebAuthCode') && !Utils.getQueryParams('appid') && !Utils.getQueryParams('redirectUrl')) {
    // code 或 bankCode 存在
    let wxCode = Utils.getQueryParams('code')
    let bankCode = Utils.getQueryParams('bankCode')
    if (wxCode || bankCode) {
      cookies.wxCode = wxCode
      cookies.wxToken = ''
      Utils.countPlus({'enterCode': bankCode}, 'register')
      Sto.set(Config.constants.cookies, cookies)
      wxAuth()
    } else {
      next()
      // alert('TOKEN失效，请进入公众号重新点击菜单授权')
      // wx.closeWindow()
    }
  // 第三方授权或直接授权
  } else if (Utils.getQueryParams('wxWebAuthCode') && Utils.getQueryParams('enterpriseCode')) {
    const params = {
      code: Utils.getQueryParams('wxWebAuthCode'),
      enterpriseCode: Utils.getQueryParams('enterpriseCode'),
      appId: Utils.getQueryParams('wxWebAuthAppId') || Sto.get(Config.constants.cookies).appid,
      authType: Utils.getQueryParams('wxWebAuthType')
    }
    // userCode
    let user = Sto.get(Config.constants.cookies)
    if (user && user.userCode) {
      params.userCode = user.userCode
    }
    cookies.enterpriseCode = Utils.getQueryParams('enterpriseCode') // 企业编号
    Sto.set(Config.constants.enterpriseCode, params.enterpriseCode)
    let activityCode = Utils.getUrlkey(window.location.search)['activityCode']
    let openId = Utils.getUrlkey(window.location.search)['openId']
    // 授权，获取token
    wxWebAuth(params).then(res => {
      if (res.code === 0 || res.code === '0') {
        cookies.wxToken = res.data.token
        cookies.openId = res.data.openId
        Sto.set(Config.constants.cookies, cookies)
        // 抽奖
        if (activityCode) {
          if (openId) {
            location.replace(to.path + '?openId=' + openId + '&activityCode=' + activityCode + '&v=' + Utils.randomStr(16))
          } else {
            location.replace(to.path + '?activityCode=' + activityCode + '&v=' + Utils.randomStr(16))
          }
        } else {
          location.replace(to.path + '?v=' + Utils.randomStr(16))
          // location.replace(to.path + '?openId=' + openId + '&v=' + Utils.randomStr(16))
        }
      } else {
        if (cookies.wxToken) {
          wx.closeWindow()
        } else {
          alert(res.msg)
        }
      }
    })
  // 直接授权，不存在appid
  // } else if (Utils.getQueryParams('wxWebAuthCode') && Utils.getQueryParams('enterpriseCode') && !Utils.getQueryParams('wxWebAuthAppId')) {
  //   const params = {
  //     code: Utils.getQueryParams('wxWebAuthCode'),
  //     appId: Sto.get(Config.constants.cookies).appid,
  //     authType: Utils.getQueryParams('wxWebAuthType'),
  //     enterpriseCode: Utils.getQueryParams('enterpriseCode')
  //   }
  //   wxWebAuth(params).then(res => {
  //     if (res.code === 0 || res.code === '0') {
  //       cookies.wxToken = res.data.token
  //       cookies.openId = res.data.openId
  //       Sto.set(Config.constants.cookies, cookies)
  //       sessionStorage.setItem(Config.constants.activityOpenId, res.data.openId)
  //       location.replace(to.path + '?openId=' + res.data.openId + '&v=' + Utils.randomStr(16))
  //     } else {
  //       if (cookies.wxToken) {
  //         wx.closeWindow()
  //       } else {
  //         alert(res.msg)
  //       }
  //     }
  //   })
  } else {
    Sto.set(Config.constants.cookies, cookies)
    // XXX: 修复iOS版微信HTML5 History兼容性问题 todo android微信内可能也会存在路由问题
    if (Utils.isWeixin() && to.path !== location.pathname) {
      if (!Utils.isAndroidWeChat() && (to.path === '/h5/loan/accredit' || to.path === '/h5/loan/confirm')) {
        next()
      } else {
        // 此处不可使用location.replace
        location.assign(window.location.protocol + '//' + window.location.host + to.fullPath)
      }
      // router.push(to.fullPath)
    } else {
      next()
    }
  }
})

router.afterEach((transition) => {
  window.scrollTo(0, 0)
  let cookies = Sto.get(Config.constants.cookies) || {}
  const title = transition.meta.title
  const isAuth = transition.meta.auth
  if (transition.meta.countPlus) Utils.countPlus(transition.meta.countPlus, 'send')
  if (title !== 'prdDetail') setPageTitle(title)
  if (isAuth) {
    cookies.prdTitle = cookies.enterPriseName
    cookies.prdSummary = cookies.enterPriseName + '，让您一次贷款，一生信赖'
    cookies.prdUrl = window.location.protocol + '//' + window.location.host + '/h5/borrow/personal?code=' + cookies.wxCode + '&bankCode=' + cookies.bankCode + '&authType=' + cookies.authType
    cookies.prdImgUrl = cookies.enterpSymbol
    Sto.set(Config.constants.cookies, cookies)
  }
  if (Utils.isWeixin() && !window.location.pathname.includes(Config.constants.downloadApp)) {
    if (transition.meta.shareCountPlus) Wxsdk.wxShare(() => Utils.countPlus(transition.meta.shareCountPlus, 'send'))
    else Wxsdk.wxShare()
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App }
})
