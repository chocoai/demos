<template>
    <div></div>
</template>

<script>
import Utils from '../../config/utils'
import Store from 'store'
import wx from 'weixin-js-sdk'
import Config from '../../config/index'
export default {
  data () {
    return {}
  },
  created () {
    let cookies = Store.get(Config.constants.cookies) || {}
    if (cookies.wxToken) wx.closeWindow()
    const wxWebAuthCode = Utils.getQueryParams('code')
    const enterpriseCode = Utils.getQueryParams('state')
    const wxWebAuthAppId = Utils.getQueryParams('appid')
    let wxWebAuthUrl = decodeURIComponent(Utils.getQueryParams('redirectUrl'))
    // wxWebAuthType已废弃，未删除兼容以前版本
    let wxWebAuthType = 1
    if (wxWebAuthUrl.includes(Config.constants.sharePersonalRouter)) {
      wxWebAuthType = 2
    }
    if (wxWebAuthUrl.includes('/h5/activity/turntable')) {
      wxWebAuthType = 3
    }
    if (wxWebAuthUrl.includes('/h5/activity/valuation')) {
      wxWebAuthType = 4
    }
    if (wxWebAuthUrl.indexOf('?') > -1) {
      wxWebAuthUrl = wxWebAuthUrl + '&wxWebAuthCode=' + wxWebAuthCode + `${enterpriseCode !== 'null' ? '&enterpriseCode=' + enterpriseCode : ''}` + `${wxWebAuthAppId ? '&wxWebAuthAppId=' + wxWebAuthAppId : ''}` + '&wxWebAuthType=' + wxWebAuthType
    } else {
      wxWebAuthUrl = wxWebAuthUrl + '?wxWebAuthCode=' + wxWebAuthCode + `${enterpriseCode !== 'null' ? '&enterpriseCode=' + enterpriseCode : ''}` + `${wxWebAuthAppId ? '&wxWebAuthAppId=' + wxWebAuthAppId : ''}` + '&wxWebAuthType=' + wxWebAuthType
    }
    // window.location.href = wxWebAuthUrl
    if (Store.get(Config.constants.wxAuthCloseWindow) === 'open') {
      // this.$router.push(wxWebAuthUrl.split('.com')[1])
      window.location.href = wxWebAuthUrl
    }
  }
}
</script>
