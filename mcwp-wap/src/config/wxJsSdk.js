/**
 * 封装微信JS-SDK函数
 * @param {any}
 */
import { getWxSign } from '../service/getData'
import { getShareConfig } from '../service/common'
import Store from 'store'
import wx from 'weixin-js-sdk'
import Config from '../config/index'
class Wxjssdk {
  /**
   * 拍照或从手机相册中选图接口
   * @param {name} 回调函数
   * @return {回调函数}
   */
  wxImage (fn) {
    getWxSign({url: encodeURIComponent(window.location.href)}).then((result) => {
      if (+result.code === 0) {
        // 微信配置
        wx.config({
          debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: result.data.appId, // 必填，公众号的唯一标识
          timestamp: result.data.timestamp, // 必填，生成签名的时间戳
          nonceStr: result.data.noncestr, // 必填，生成签名的随机串
          signature: result.data.sign, // 必填，签名，见附录1
          jsApiList: ['chooseImage', 'uploadImage'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        })
        wx.ready(function () {
          if (fn) fn(wx)
        })
      }
    })
  }
  /**
   * 微信关闭窗口
   * @param {name} 回调函数
   * @return {回调函数}
   */
  wxClose (fn) {
    getWxSign({url: encodeURIComponent(window.location.href)}).then((result) => {
      if (+result.code === 0) {
        // 微信配置
        wx.config({
          debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: result.data.appId, // 必填，公众号的唯一标识
          timestamp: result.data.timestamp, // 必填，生成签名的时间戳
          nonceStr: result.data.noncestr, // 必填，生成签名的随机串
          signature: result.data.sign, // 必填，签名，见附录1
          jsApiList: ['closeWindow'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        })
        wx.ready(function () {
          wx.closeWindow()
        })
      }
    })
  }
  /**
   * 拍照或从手机相册中选图接口
   * @param {name} 回调函数
   * @return {回调函数}
   */
  wxShare (fn, params, type) {
    const cookies = Store.get(Config.constants.cookies) || {}
    getWxSign({url: encodeURIComponent(window.location.href)}).then((result) => {
      if (result.code === 0 || result.code === '0') {
        let shareParams = {
          title: cookies.prdTitle,
          summary: cookies.prdSummary,
          url: cookies.prdUrl,
          imgUrl: cookies.prdImgUrl
        }
        if (params) {
          shareParams = Object.assign(shareParams, params)
        }
        // 活动估值排名
        if (type === 'activityValuation') {
          let openId = sessionStorage.getItem(Config.constants.activityOpenId)
          let shareOpenId = sessionStorage.getItem(Config.constants.activityShareOpenId)
          let cookies = Store.get(Config.constants.cookies)
          let growthRate = sessionStorage.getItem(Config.constants.activityValuationGrowthRate)
          let nickName = sessionStorage.getItem(Config.constants.wxNickName)
          if (!growthRate) {
            shareParams = Object.assign(shareParams, {
              title: '房价一往无前，你的房子涨了吗？',
              summary: '点这里测房价！',
              imgUrl: sessionStorage.getItem(Config.constants.activityValuationImg),
              url: `${window.location.origin}/h5/activity/valuation?code=${cookies.wxCode}&bankCode=${cookies.bankCode}&authType=${cookies.authType}&shareOpenId=${openId}&shareStartOpenId=${shareOpenId}`
            })
          } else {
            if (growthRate < 0) {
              shareParams = Object.assign(shareParams, {
                title: `扎心了！${nickName}的房子居然下跌${growthRate}%，贬值了！`,
                summary: '别幸灾乐祸了，赶快来测测你的房子贬值了没！',
                imgUrl: sessionStorage.getItem(Config.constants.activityValuationImg),
                url: `${window.location.origin}/h5/activity/valuation?code=${cookies.wxCode}&bankCode=${cookies.bankCode}&authType=${cookies.authType}&shareOpenId=${openId}&shareStartOpenId=${shareOpenId}`
              })
            } else {
              shareParams = Object.assign(shareParams, {
                title: `天呐！${nickName}的房子居然上涨了${growthRate}%！`,
                summary: '今天，你的房子升值了吗？快来测一测吧！',
                imgUrl: sessionStorage.getItem(Config.constants.activityValuationImg),
                url: `${window.location.origin}/h5/activity/valuation?code=${cookies.wxCode}&bankCode=${cookies.bankCode}&authType=${cookies.authType}&shareOpenId=${openId}&shareStartOpenId=${shareOpenId}`
              })
            }
          }
        }
        // 微信配置
        wx.config({
          debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: result.data.appId, // 必填，公众号的唯一标识
          timestamp: result.data.timestamp, // 必填，生成签名的时间戳
          nonceStr: result.data.noncestr, // 必填，生成签名的随机串
          signature: result.data.sign, // 必填，签名，见附录1
          jsApiList: ['hideMenuItems', 'onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone', 'chooseImage'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        })
        // ready
        wx.ready(function () {
          wx.hideMenuItems({
            menuList: ['menuItem:copyUrl', 'menuItem:readMode', 'menuItem:openWithSafari', 'menuItem:share:email', 'menuItem:favorite', 'menuItem:share:facebook', 'menuItem:openWithQQBrowser'] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
          })
          // 分享到朋友圈
          wx.onMenuShareTimeline({
            title: shareParams.title, // 分享标题
            desc: shareParams.summary, // 分享描述
            link: shareParams.url, // 分享链接
            imgUrl: shareParams.imgUrl, // 分享图标
            success: function () { fn && fn() },
            cancel: function () { fn && fn() }
          })
          // 分享给朋友
          wx.onMenuShareAppMessage({
            title: shareParams.title, // 分享标题
            desc: shareParams.summary, // 分享描述
            link: shareParams.url, // 分享链接
            imgUrl: shareParams.imgUrl, // 分享图标
            success: function () { fn && fn() },
            cancel: function () { fn && fn() }
          })
          // 分享到QQ
          wx.onMenuShareQQ({
            title: shareParams.title, // 分享标题
            desc: shareParams.summary, // 分享描述
            link: shareParams.url, // 分享链接
            imgUrl: shareParams.imgUrl, // 分享图标
            success: function () { fn && fn() },
            cancel: function () { fn && fn() }
          })
          // 分享到腾讯微博
          wx.onMenuShareWeibo({
            title: shareParams.title, // 分享标题
            desc: shareParams.summary, // 分享描述
            link: shareParams.url, // 分享链接
            imgUrl: shareParams.imgUrl, // 分享图标
            success: function () { fn && fn() },
            cancel: function () { fn && fn() }
          })
          // 分享到QQ空间
          wx.onMenuShareQZone({
            title: shareParams.title, // 分享标题
            desc: shareParams.summary, // 分享描述
            link: shareParams.url, // 分享链接
            imgUrl: shareParams.imgUrl, // 分享图标
            success: function () { fn && fn() },
            cancel: function () { fn && fn() }
          })
        })
        // wx.error(function (err) {
        //   console.log(err)
        //   alert(JSON.stringify(err))
        // })
      } else {
        alert('签名失败')
      }
    })
  }
  /**
   * 共用分享
   * /wx/v1/active/share/config
   * @param {fn} 回调函数
   * @param {params} /wx/v1/active/share/config 接口参数
   * @param {url} 分享url
   * @return {回调函数}
   */
  async wxShareCommon (fn, params, url) {
    const cookies = Store.get(Config.constants.cookies) || {}
    let result = await getWxSign({ url: encodeURIComponent(window.location.href) })
    if (+result.code === 0) {
      let res = await getShareConfig(params)
      let shareParams = {
        title: res.data.title,
        summary: res.data.summary,
        url,
        imgUrl: res.data.shareLogo || cookies.sharePicture
      }
      // 微信配置
      wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: result.data.appId, // 必填，公众号的唯一标识
        timestamp: result.data.timestamp, // 必填，生成签名的时间戳
        nonceStr: result.data.noncestr, // 必填，生成签名的随机串
        signature: result.data.sign, // 必填，签名，见附录1
        jsApiList: [
          'hideMenuItems',
          'onMenuShareTimeline',
          'onMenuShareAppMessage',
          'onMenuShareQQ',
          'onMenuShareWeibo',
          'onMenuShareQZone',
          'chooseImage'
        ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
      })
      // ready
      wx.ready(function () {
        wx.hideMenuItems({
          menuList: [
            'menuItem:copyUrl',
            'menuItem:readMode',
            'menuItem:openWithSafari',
            'menuItem:share:email',
            'menuItem:share:qq',
            'menuItem:share:weiboApp',
            'menuItem:share:QZone',
            'menuItem:share:facebook',
            'menuItem:favorite',
            'menuItem:share:facebook',
            'menuItem:openWithQQBrowser'
          ] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
        })
        // 分享到朋友圈
        wx.onMenuShareTimeline({
          title: shareParams.title, // 分享标题
          desc: shareParams.summary, // 分享描述
          link: shareParams.url, // 分享链接
          imgUrl: shareParams.imgUrl, // 分享图标
          success: function () {
            fn && fn()
          },
          cancel: function () {
            fn && fn()
          }
        })
        // 分享给朋友
        wx.onMenuShareAppMessage({
          title: shareParams.title, // 分享标题
          desc: shareParams.summary, // 分享描述
          link: shareParams.url, // 分享链接
          imgUrl: shareParams.imgUrl, // 分享图标
          success: function () {
            fn && fn()
          },
          cancel: function () {
            fn && fn()
          }
        })
      })
    } else {
      alert('签名失败')
    }
  }
}

// 实例化再导出
export default new Wxjssdk()
