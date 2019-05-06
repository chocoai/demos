import Store from 'store'
import { getWxAuthParams } from '../service/getData'
import Config from './index'
import Utils from './utils'
// import wx from 'weixin-js-sdk'
// type 授权方式
export default (type, code, reUrl) => {
  let cookies = Store.get(Config.constants.cookies)
  let wxCode = Utils.getQueryParams('code') || cookies.wxCode
  let enterpriseCode = Utils.getUrlkey(window.location.search)['enterpriseCode']
  // 获取银行code
  let bankCode = Utils.getUrlkey(window.location.search)['bankCode']
  // 授权类型
  let authType = Utils.getUrlkey(window.location.search)['authType']
  // 分享人openId
  sessionStorage.setItem(Config.constants.activityShareOpenId, Utils.getUrlkey(window.location.search)['shareOpenId'])
  sessionStorage.setItem(Config.constants.activityshareStartOpenId, Utils.getUrlkey(window.location.search)['shareStartOpenId'])
  if (wxCode || enterpriseCode || bankCode) {
    const params = {
      code: wxCode
    }
    if (code) params.code = code
    if (bankCode) params.bankCode = bankCode
    if (enterpriseCode) params.enterpriseCode = enterpriseCode
    if (authType) params.authType = authType
    getWxAuthParams(params).then(res => {
      if (res.code === Config.resCode.success) {
        const appid = res.data && res.data.appid
        // 缓存appid
        cookies.appid = appid
        // 缓存bankCode
        cookies.bankCode = bankCode
        // 缓存enterpriseCode
        cookies.enterpriseCode = enterpriseCode
        // 缓存authType
        cookies.authType = authType
        Store.set(Config.constants.cookies, cookies)
        const componentAppId = res.data && res.data.componentAppId
        let state = res.data && res.data.enterpriseCode
        let currentUrl = window.location.href
        // 非第三方授权/第三方授权 根据环境来进行判断
        // let refererUrl = 'https://mp.zhudb.com'
        // if (componentAppId) {
        let refererUrl = Config.refererUrl // 测试
        if (currentUrl.indexOf('mp-test.zhudb.com') > -1) {
          refererUrl = 'https://mp-test.zhudb.com' // 预生产
        }
        if (currentUrl.indexOf('mp.zhudb.com') > -1) {
          refererUrl = 'https://mp.zhudb.com' // 生产
        }
        // if (currentUrl.indexOf('mp.zhudb.com') > -1 || currentUrl.indexOf('mp-test.zhudb.com') > -1) {
        //   refererUrl = window.location.origin
        // }
        // }
        if (reUrl) currentUrl = `${window.location.origin}${reUrl}`
        const redirectUri = refererUrl + '/h5/common/wxAuth?redirectUrl=' + encodeURIComponent(currentUrl)
        // 授权方式
        let scopeType
        if (type) {
          scopeType = type
        } else {
          scopeType = 'snsapi_userinfo'
        }
        // 第三方appid是否存在
        if (componentAppId) {
          window.location.replace('https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + appid + '&redirect_uri=' + encodeURI(redirectUri) + '&response_type=code&scope=' + scopeType + '&state=' + state + '&component_appid=' + componentAppId + '#wechat_redirect')
        } else {
          window.location.replace('https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + appid + '&redirect_uri=' + encodeURI(redirectUri) + '&response_type=code&scope=' + scopeType + '&state=' + state + '#wechat_redirect')
        }
      } else {
        alert(res.msg)
      }
    })
  } else {
    // alert('TOKEN失效，请进入公众号重新点击菜单授权')
    // wx.closeWindow()
  }
}
