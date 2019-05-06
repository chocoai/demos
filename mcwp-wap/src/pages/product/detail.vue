<template>
    <div class="mode-list">
      <scroll>
        <div v-if="!stay">
          <Detail-one @goApply="goApply" :proInfoData="proInfoData" v-if="modeType === 'templet1'" />
          <Detail-two @goApply="goApply" :proInfoData="proInfoData" v-if="modeType === 'templet2'" />
          <Detail-three @goApply="goApply" :proInfoData="proInfoData" v-if="modeType === 'templet3'"/>
          <Detail-four @goApply="goApply" :proInfoData="proInfoData"  v-if="modeType === 'templet4' || modeType === 'templet5'"/>
          <!-- <Detail-five @goApply="goApply" :proInfoData="proInfoData"  v-if="modeType === 'templet5'"/> -->
          <Detail-six @goApply="goApply" :proInfoData="proInfoData"  v-if="modeType === 'templet6'"/>
          <Detail-seven @goApply="goApply" :proInfoData="proInfoData"  v-if="modeType === 'templet7'"/>
          <detail-eight @goApply="goApply" :proInfoData="proInfoData"  v-if="modeType === 'templet8'"/>
          <detail-nine @goApply="goApply" :proInfoData="proInfoData"  v-if="modeType === 'templet9'"/>
        </div>
      </scroll>
    </div>
</template>

<script>
    import Config from '../../config/index'
    import VBlank from '../../components/blank'
    import DetailOne from '../../components/product/detailOne'
    import DetailTwo from '../../components/product/detailTwo'
    import DetailThree from '../../components/product/detailThree'
    import DetailFour from '../../components/product/detailFour'
    // import DetailFive from '../../components/product/detailFive'
    import DetailSix from '../../components/product/detailSix'
    import DetailSeven from '../../components/product/detailSeven'
    import DetailEight from '../../components/product/detailEight.vue'
    import DetailNine from '../../components/product/detailNine.vue'
    import Scroll from '../../components/scroll.vue'
    import { getProdDesc, getLoanCode, getListProdStep, getWxSign } from '../../service/getData'
    import Store from 'store'
    import setPageTitle from '../../config/setPageTitle'
    import Utils from '../../config/utils'
    import wx from 'weixin-js-sdk'
    export default {
      components: {
        VBlank,
        DetailOne,
        DetailTwo,
        DetailThree,
        DetailFour,
        Scroll,
        DetailSix,
        DetailSeven,
        DetailEight,
        DetailNine
        // DetailFive
      },
      data () {
        return {
          proInfoData: '', // 产品信息
          modeType: 1,
          phone: null, // 领取额度页面所输手机号
          stay: Utils.getQueryParams('stay'), // 是否停留，存在则跳转
          channel: Utils.getQueryParams('channel') || sessionStorage.getItem('YX_CHANNEL'),
          category: Utils.getQueryParams('category') || sessionStorage.getItem('YX_CATEGORY')
        }
      },
      computed: {
      },
      mounted () {
        const that = this
        const proCode = Utils.getQueryParams('prdCode')
        const params = {
          code: proCode,
          style: 'image/resize,m_fixed,w_1080,h_712'
        }
        // getProdDesc(params).then(res => {
        //   that.$vux.loading.hide()
        //   if (res.code === Config.resCode.success) {
        //     that.proInfoData = res.data
        //   }
        // })
        // 获取产品详情
        getProdDesc(params).then(res => {
          if (res.code === Config.resCode.success) {
            that.proInfoData = res.data
            that.modeType = res.data.tplCode
            // console.log(res.data)
            that.initWx(res.data) // 微信初始化
            that.citiesText = res.data.citiesText // 支持的城市列表
            that.prdType = res.data.prdType // 产品类型
            const managerCode = Utils.getQueryParams('managerCode')
            const open = Utils.getQueryParams('openWith') || 'h5'
            let cookies = Store.get(Config.constants.cookies)
            if (cookies && cookies.isIpieces) delete cookies.isIpieces
            if (cookies && cookies.loanCode) delete cookies.loanCode
            let shareUrl
            if (Utils.getQueryParams('userCode')) {
              shareUrl = cookies.userCode ? Utils.replaceParamVal('userCode', cookies.userCode) : window.location.href
            } else {
              shareUrl = window.location.href + `${cookies.userCode ? '&userCode=' + cookies.userCode : ''}`
            }
            // 缓存授权协议是否显示
            sessionStorage.setItem(Config.constants.contractProductAuth, res.data.auth)
            // 将相关信息存入本地
            cookies = Object.assign(cookies, {
              proCode: proCode,
              managerCode: managerCode,
              open: open,
              enterpriseName: res.data.enterpriseName,
              enterpriseIcon: res.data.enterpriseIcon,
              prdType: res.data.prdType, // 2：经营贷 3：房抵贷 4：车抵贷 5：其他
              prdTitle: res.data.prdName,
              prdSummary: `${res.data.prdAd || '畅想生活 随心所贷'}\n本产品出自：${res.data.enterpriseName}`,
              prdUrl: shareUrl,
              rateProdName: res.data.rateProdName,
              qrCodeUrl: res.data.qrCodeUrl,
              prdImgUrl: res.data.enterpriseIcon,
              enterpriseCode: res.data.enterpriseCode,
              prefixUrl: res.data.prefixUrl,
              jumpPage: res.data.jumpPage,
              byname: res.data.byname
            })
            Utils.countPlus({
              'env': Utils.getReferer(),
              'enterCode': cookies.enterpriseCode
            }, 'register')
            Utils.countPlus({
              'prodName': res.data.prdName,
              'prodCode': proCode,
              'prodType': res.data.prdType,
              'managerCode': managerCode,
              'channel': that.channel,
              'category': that.category
            }, 'save')
            Utils.countPlus('贷款产品浏览', 'send')
            // 保存申请流程所需参数
            Store.set(Config.constants.cookies, cookies)
            if (that.stay) {
              this.phone = Utils.getQueryParams('phone')
              this.goApply()
            }
          } else {
            console.log('未收到数据')
          }
        })
      },
      methods: {
        goApply () { // 立即申请
          const that = this
          that.$vux.loading.show({
            text: '请稍候...'
          })
          let cookies = Store.get(Config.constants.cookies)
          let params = {
            prdCode: cookies.proCode,
            managerCode: cookies.managerCode || '',
            userCode: Utils.getQueryParams('userCode') || '',
            channel: Utils.getQueryParams('channel') || sessionStorage.getItem('YX_CHANNEL'),
            category: Utils.getQueryParams('category') || sessionStorage.getItem('YX_CATEGORY')
          }
          if (!params.channel) delete params.channel
          if (!params.category) delete params.category
          getLoanCode(params).then(res => {
            that.$vux.loading.hide()
            if (res.code === Config.resCode.success) {
              cookies.loanCode = res.data.reqCode
              Utils.countPlus({
                'loanCode': res.data.reqCode
              }, 'save')
              Utils.countPlus('进件转化', 'send')
              cookies.enterpriseCode = res.data.enterpriseCode
              getListProdStep({proCode: cookies.proCode}).then(res => {
                let loanRoutes = []
                res.data.forEach((item, index) => {
                  loanRoutes.push(`${item.itemIds}?loanCode=${cookies.loanCode}`)
                })
                let route = loanRoutes[0]
                cookies.loanRoutes = loanRoutes
                Store.set(Config.constants.cookies, cookies)
                // 如果不是直接跳过，记录时长，否则不记录
                if (!that.stay) {
                  Utils.countPlus('页面停留时长', 'send', {'pageName': '贷款产品浏览', 'stayTime': new Date().getTime() - this.getTime})
                }
                if (that.phone) {
                  if (route.indexOf('?') > -1) {
                    route = route + '&phone=' + that.phone
                  } else {
                    route = route + '?phone=' + that.phone
                  }
                }
                that.$router.push(route)
              })
            } else {
              that.$vux.toast.text(res.msg)
            }
          })
        },
        initWx (proInfoData) {
          const that = this
          setPageTitle(proInfoData.prdName)
          let cookies = Store.get(Config.constants.cookies)
          let shareUrl
          if (Utils.getQueryParams('userCode')) {
            shareUrl = window.location.href + `${cookies.userCode ? '&userCode=' + cookies.userCode : ''}`
          } else {
            shareUrl = window.location.href + `${cookies.userCode ? '&userCode=' + cookies.userCode : ''}`
          }
          const ua = window.navigator.userAgent.toLowerCase()
          let micr = ua.match(/MicroMessenger/i) && ua.match(/MicroMessenger/i).toString()
          if (micr === 'micromessenger') {
            getWxSign({url: encodeURIComponent(window.location.href)}).then((result) => {
              if (result.code === 0 || result.code === '0') {
                const shareParams = {
                  title: proInfoData.prdName,
                  summary: `${proInfoData.prdAd || '畅想生活 随心所贷'}\n本产品出自：${proInfoData.enterpriseName}`,
                  url: shareUrl,
                  imgUrl: proInfoData.enterpriseIcon
                }
                // 微信配置
                wx.config({
                  debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                  appId: result.data.appId, // 必填，公众号的唯一标识
                  timestamp: result.data.timestamp, // 必填，生成签名的时间戳
                  nonceStr: result.data.noncestr, // 必填，生成签名的随机串
                  signature: result.data.sign, // 必填，签名，见附录1
                  jsApiList: ['chooseImage', 'hideMenuItems', 'onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                })
                // ready
                wx.ready(function () {
                  wx.hideMenuItems({
                    menuList: ['menuItem:exposeArticle', 'menuItem:copyUrl', 'menuItem:readMode', 'menuItem:openWithSafari', 'menuItem:share:email', 'menuItem:favorite', 'menuItem:share:facebook', 'menuItem:openWithQQBrowser'] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
                  })
                  // 分享到朋友圈
                  wx.onMenuShareTimeline({
                    title: shareParams.title, // 分享标题
                    desc: shareParams.summary, // 分享描述
                    link: shareParams.url, // 分享链接
                    imgUrl: shareParams.imgUrl, // 分享图标
                    success: function () { Utils.countPlus('贷款产品分享', 'send') },
                    cancel: function () {}
                  })
                  // 分享给朋友
                  wx.onMenuShareAppMessage({
                    title: shareParams.title, // 分享标题
                    desc: shareParams.summary, // 分享描述
                    link: shareParams.url, // 分享链接
                    imgUrl: shareParams.imgUrl, // 分享图标
                    success: function () { Utils.countPlus('贷款产品分享', 'send') },
                    cancel: function () {}
                  })
                  // 分享到QQ
                  wx.onMenuShareQQ({
                    title: shareParams.title, // 分享标题
                    desc: shareParams.summary, // 分享描述
                    link: shareParams.url, // 分享链接
                    imgUrl: shareParams.imgUrl, // 分享图标
                    success: function () { Utils.countPlus('贷款产品分享', 'send') },
                    cancel: function () {}
                  })
                  // 分享到腾讯微博
                  wx.onMenuShareWeibo({
                    title: shareParams.title, // 分享标题
                    desc: shareParams.summary, // 分享描述
                    link: shareParams.url, // 分享链接
                    imgUrl: shareParams.imgUrl, // 分享图标
                    success: function () { Utils.countPlus('贷款产品分享', 'send') },
                    cancel: function () {}
                  })
                  // 分享到QQ空间
                  wx.onMenuShareQZone({
                    title: shareParams.title, // 分享标题
                    desc: shareParams.summary, // 分享描述
                    link: shareParams.url, // 分享链接
                    imgUrl: shareParams.imgUrl, // 分享图标
                    success: function () { Utils.countPlus('贷款产品分享', 'send') },
                    cancel: function () {}
                  })
                })
                // wx.error(function (err) {
                  // todo
                  // that.$vux.toast.text(err)
                // })
              } else {
                that.$vux.toast.text(result.msg)
              }
            })
          }
        }
      }
    }
</script>

<style lang="less" scoped>
  .mode-list {
    height: 100%;
    width: 100%;
  }
</style>
