<template>
    <div></div>
</template>

<script>
import { getQueryParams, Config } from "../../utils";
import Store from "store";
import wx from "weixin-js-sdk";
export default {
  data() {
    return {};
  },
  created() {
    let cookies = Store.get(Config.constants.cookies) || {};
    if (cookies.wxToken) wx.closeWindow();
    const wxWebAuthCode = getQueryParams("code");
    const enterpriseCode = getQueryParams("state");
    const wxWebAuthAppId = getQueryParams("appid");
    let wxWebAuthUrl = decodeURIComponent(getQueryParams("redirectUrl"));
    let wxWebAuthType = 1;
    // if (wxWebAuthUrl.includes(Config.constants.sharePersonalRouter)) {
    //   wxWebAuthType = 2;
    // }
    // if (wxWebAuthUrl.includes("/h5/activity/turntable")) {
    //   wxWebAuthType = 3;
    // }
    // if (wxWebAuthUrl.includes("/h5/activity/valuation")) {
    //   wxWebAuthType = 4;
    // }
    if (wxWebAuthUrl.indexOf("?") > -1) {
      wxWebAuthUrl =
        wxWebAuthUrl +
        "&wxWebAuthCode=" +
        wxWebAuthCode +
        `${
          enterpriseCode !== "null" ? "&enterpriseCode=" + enterpriseCode : ""
        }` +
        `${wxWebAuthAppId ? "&wxWebAuthAppId=" + wxWebAuthAppId : ""}` +
        "&wxWebAuthType=" +
        wxWebAuthType;
    } else {
      wxWebAuthUrl =
        wxWebAuthUrl +
        "?wxWebAuthCode=" +
        wxWebAuthCode +
        `${
          enterpriseCode !== "null" ? "&enterpriseCode=" + enterpriseCode : ""
        }` +
        `${wxWebAuthAppId ? "&wxWebAuthAppId=" + wxWebAuthAppId : ""}` +
        "&wxWebAuthType=" +
        wxWebAuthType;
    }
    // window.location.href = wxWebAuthUrl
    if (Store.get(Config.constants.wxAuthCloseWindow) === "open") {
      // this.$router.push(wxWebAuthUrl.split('.com')[1])
      // window.location.href = wxWebAuthUrl;
      window.location.replace(wxWebAuthUrl);
    }
  }
};
</script>
