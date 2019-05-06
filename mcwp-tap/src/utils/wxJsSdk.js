/**
 * 封装微信JS-SDK函数
 * @param {any}
 */
import { getWxSign, getShareConfig } from "@/service/common";
import Store from "store";
import wx from "weixin-js-sdk";
import { Config } from "./index";
import Router from "@/utils/routerConfig.js";

class Wxjssdk {
  /**
   * 拍照或从手机相册中选图接口
   * @param {name} 回调函数
   * @return {回调函数}
   */
  wxImage(fn) {
    getWxSign({ url: encodeURIComponent(window.location.href) }).then(
      result => {
        if (+result.code === 0) {
          // 微信配置
          wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: result.data.appId, // 必填，公众号的唯一标识
            timestamp: result.data.timestamp, // 必填，生成签名的时间戳
            nonceStr: result.data.noncestr, // 必填，生成签名的随机串
            signature: result.data.sign, // 必填，签名，见附录1
            jsApiList: ["chooseImage", "uploadImage"] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
          });
          wx.ready(function() {
            if (fn) fn(wx);
          });
        }
      }
    );
  }
  /**
   * 微信关闭窗口
   * @param {name} 回调函数
   * @return {回调函数}
   */
  wxClose() {
    getWxSign({ url: encodeURIComponent(window.location.href) }).then(
      result => {
        if (+result.code === 0) {
          // 微信配置
          wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: result.data.appId, // 必填，公众号的唯一标识
            timestamp: result.data.timestamp, // 必填，生成签名的时间戳
            nonceStr: result.data.noncestr, // 必填，生成签名的随机串
            signature: result.data.sign, // 必填，签名，见附录1
            jsApiList: ["closeWindow"] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
          });
          wx.ready(function() {
            wx.closeWindow();
          });
        }
      }
    );
  }
  /**
   * 拍照或从手机相册中选图接口
   * @param {name} 回调函数
   * @return {回调函数}
   */
  wxShare(fn, params, type, others) {
    const cookies = Store.get(Config.constants.cookies) || {};
    getWxSign({ url: encodeURIComponent(window.location.href) }).then(
      result => {
        if (result.code === 0 || result.code === "0") {
          let shareParams = {
            title: cookies.shareTitle,
            summary: cookies.shareSummary,
            url: `${window.location.origin}/tap/home?code=${
              cookies.wxCode
            }&bankCode=${cookies.bankCode}&authType=${cookies.authType}`,
            // 添加企业默认展示图片 sharePicture
            imgUrl: cookies.sharePicture
          };
          if (params) {
            shareParams = Object.assign(shareParams, params);
          }
          // 砍利率活动
          if (type == "knife") {
            let cookies = Store.get(Config.constants.cookies);
            shareParams = Object.assign(shareParams, {
              title: sessionStorage.getItem(
                Config.constants.activityKnifeTitle
              ),
              summary: sessionStorage.getItem(
                Config.constants.activityKnifeSummary
              ),
              imgUrl: sessionStorage.getItem(Config.constants.activityKnifeImg),
              url: `${window.location.origin}/tap${Router.help.path}?code=${
                cookies.wxCode
              }&bankCode=${cookies.bankCode}&authType=${
                cookies.authType
              }&activityCode=${sessionStorage.getItem(
                Config.constants.activityKnifeCode
              )}`
            });
          }
          // 立即邀请活动
          if (type == "invite") {
            let cookies = Store.get(Config.constants.cookies);
            shareParams = Object.assign(shareParams, {
              title: sessionStorage.getItem(
                Config.constants.activityInviteTitle
              ),
              summary: sessionStorage.getItem(
                Config.constants.activityInviteSummary
              ),
              imgUrl: sessionStorage.getItem(
                Config.constants.activityInviteImg
              ),
              url: `${window.location.origin}/tap${
                Router.homeProdEntry.path
              }?code=${cookies.wxCode}&bankCode=${cookies.bankCode}&authType=${
                cookies.authType
              }&shareUserCode=${cookies.userCode}&category=${
                others.category
              }&channel=${others.channel}`
            });
          }
          // 微信配置
          wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: result.data.appId, // 必填，公众号的唯一标识
            timestamp: result.data.timestamp, // 必填，生成签名的时间戳
            nonceStr: result.data.noncestr, // 必填，生成签名的随机串
            signature: result.data.sign, // 必填，签名，见附录1
            jsApiList: [
              "hideMenuItems",
              "onMenuShareTimeline",
              "onMenuShareAppMessage",
              "onMenuShareQQ",
              "onMenuShareWeibo",
              "onMenuShareQZone",
              "chooseImage"
            ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
          });
          // ready
          wx.ready(function() {
            wx.hideMenuItems({
              menuList: [
                "menuItem:copyUrl",
                "menuItem:readMode",
                "menuItem:openWithSafari",
                "menuItem:share:email",
                "menuItem:share:qq",
                "menuItem:share:weiboApp",
                "menuItem:share:QZone",
                "menuItem:share:facebook",
                "menuItem:favorite",
                "menuItem:share:facebook",
                "menuItem:openWithQQBrowser"
              ] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
            });
            // 分享到朋友圈
            wx.onMenuShareTimeline({
              title: shareParams.title, // 分享标题
              desc: shareParams.summary, // 分享描述
              link: shareParams.url, // 分享链接
              imgUrl: shareParams.imgUrl, // 分享图标
              success: function() {
                fn && fn();
              },
              cancel: function() {
                fn && fn();
              }
            });
            // 分享给朋友
            wx.onMenuShareAppMessage({
              title: shareParams.title, // 分享标题
              desc: shareParams.summary, // 分享描述
              link: shareParams.url, // 分享链接
              imgUrl: shareParams.imgUrl, // 分享图标
              success: function() {
                fn && fn();
              },
              cancel: function() {
                fn && fn();
              }
            });
            // 分享到QQ
            // wx.onMenuShareQQ({
            //   title: shareParams.title, // 分享标题
            //   desc: shareParams.summary, // 分享描述
            //   link: shareParams.url, // 分享链接
            //   imgUrl: shareParams.imgUrl, // 分享图标
            //   success: function() {
            //     fn && fn();
            //   },
            //   cancel: function() {
            //     fn && fn();
            //   }
            // });
            // 分享到腾讯微博
            // wx.onMenuShareWeibo({
            //   title: shareParams.title, // 分享标题
            //   desc: shareParams.summary, // 分享描述
            //   link: shareParams.url, // 分享链接
            //   imgUrl: shareParams.imgUrl, // 分享图标
            //   success: function() {
            //     fn && fn();
            //   },
            //   cancel: function() {
            //     fn && fn();
            //   }
            // });
            // 分享到QQ空间
            // wx.onMenuShareQZone({
            //   title: shareParams.title, // 分享标题
            //   desc: shareParams.summary, // 分享描述
            //   link: shareParams.url, // 分享链接
            //   imgUrl: shareParams.imgUrl, // 分享图标
            //   success: function() {
            //     fn && fn();
            //   },
            //   cancel: function() {
            //     fn && fn();
            //   }
            // });
          });
          // wx.error(function (err) {
          //   console.log(err)
          //   alert(JSON.stringify(err))
          // })
        } else {
          alert("签名失败");
        }
      }
    );
  }
  /**
   * 共用分享
   * /wx/v1/active/share/config
   * @param {fn} 回调函数
   * @param {params} /wx/v1/active/share/config 接口参数
   * @param {url} 分享url
   * @return {回调函数}
   */
  async wxShareCommon(fn, params, url) {
    const cookies = Store.get(Config.constants.cookies) || {};
    let result = await getWxSign({
      url: encodeURIComponent(window.location.href)
    });
    if (+result.code === 0) {
      let res = await getShareConfig(params);
      let shareParams = {
        title: res.data.title,
        summary: res.data.summary,
        url,
        imgUrl: res.data.shareLogo || cookies.sharePicture
      };
      // 微信配置
      wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: result.data.appId, // 必填，公众号的唯一标识
        timestamp: result.data.timestamp, // 必填，生成签名的时间戳
        nonceStr: result.data.noncestr, // 必填，生成签名的随机串
        signature: result.data.sign, // 必填，签名，见附录1
        jsApiList: [
          "hideMenuItems",
          "onMenuShareTimeline",
          "onMenuShareAppMessage",
          "onMenuShareQQ",
          "onMenuShareWeibo",
          "onMenuShareQZone",
          "chooseImage"
        ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
      });
      // ready
      wx.ready(function() {
        wx.hideMenuItems({
          menuList: [
            "menuItem:copyUrl",
            "menuItem:readMode",
            "menuItem:openWithSafari",
            "menuItem:share:email",
            "menuItem:share:qq",
            "menuItem:share:weiboApp",
            "menuItem:share:QZone",
            "menuItem:share:facebook",
            "menuItem:favorite",
            "menuItem:share:facebook",
            "menuItem:openWithQQBrowser"
          ] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
        });
        // 分享到朋友圈
        wx.onMenuShareTimeline({
          title: shareParams.title, // 分享标题
          desc: shareParams.summary, // 分享描述
          link: shareParams.url, // 分享链接
          imgUrl: shareParams.imgUrl, // 分享图标
          success: function() {
            fn && fn();
          },
          cancel: function() {
            fn && fn();
          }
        });
        // 分享给朋友
        wx.onMenuShareAppMessage({
          title: shareParams.title, // 分享标题
          desc: shareParams.summary, // 分享描述
          link: shareParams.url, // 分享链接
          imgUrl: shareParams.imgUrl, // 分享图标
          success: function() {
            fn && fn();
          },
          cancel: function() {
            fn && fn();
          }
        });
      });
    } else {
      alert("签名失败");
    }
  }
  /**
   * 禁用分享
   */
  async wxNoShare() {
    let result = await getWxSign({
      url: encodeURIComponent(window.location.href)
    });
    if (+result.code === 0) {
      // 微信配置
      wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: result.data.appId, // 必填，公众号的唯一标识
        timestamp: result.data.timestamp, // 必填，生成签名的时间戳
        nonceStr: result.data.noncestr, // 必填，生成签名的随机串
        signature: result.data.sign, // 必填，签名，见附录1
        jsApiList: [
          "hideMenuItems",
          "onMenuShareTimeline",
          "onMenuShareAppMessage",
          "onMenuShareQQ",
          "onMenuShareWeibo",
          "onMenuShareQZone",
          "chooseImage"
        ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
      });
      // ready
      wx.ready(function() {
        wx.hideMenuItems({
          menuList: [
            "menuItem:copyUrl",
            "menuItem:readMode",
            "menuItem:openWithSafari",
            "menuItem:share:appMessage",
            "menuItem:share:timeline",
            "menuItem:share:email",
            "menuItem:share:qq",
            "menuItem:share:weiboApp",
            "menuItem:share:QZone",
            "menuItem:share:facebook",
            "menuItem:favorite",
            "menuItem:share:facebook",
            "menuItem:openWithQQBrowser"
          ] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
        });
      });
    } else {
      alert("签名失败");
    }
  }
}

// 实例化再导出
export default new Wxjssdk();
