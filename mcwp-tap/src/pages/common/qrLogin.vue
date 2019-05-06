<template>
  <div class="qr-login" v-if="show">
    <div class="qr-content">
      <img class="logo" :src="imgUrl" alt="logo" />
      <p class="title">助贷宝中介平台登录确认</p>
    </div>
    <div>
      <v-button class="login" @next='nextStep'>登录</v-button>
      <span class="cancel-login" @click='cancel'>取消登录</span>
    </div>
  </div>
</template>

<script>
import { postQrLogin } from "../../service/common";
import { Config, getUrlkey } from "../../utils";
// import routerConfig from "../../utils/routerConfig";
import defaultImg from "../../assets/img_default_logo.png";
import VButton from "./../../components/button";
import { Toast } from "vant";

export default {
  components: {
    VButton
  },
  data() {
    return {
      nonceStr: getUrlkey(window.location.search)["nonceStr"],
      token: getUrlkey(window.location.search)["token"],
      imgUrl: getUrlkey(window.location.search)["logo"] || "",
      show: true
    };
  },
  created() {
    const that = this;
    if (!that.nonceStr || !that.token) {
      Toast("该页面禁止访问");
      // that.show = false;
      // that.$router.push(routerConfig.downloadApp.path);
    }
    if (that.imgUrl) that.imgUrl = window.decodeURIComponent(that.imgUrl);
    if (window.zdb && !that.imgUrl)
      that.imgUrl = window.zdb.tGetEnterpriseLogo();
    if (!that.imgUrl) that.imgUrl = defaultImg;
  },
  methods: {
    nextStep() {
      const that = this;
      const { nonceStr, token } = that;
      Toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true, // 禁用背景点击
        message: "加载中..."
      });
      postQrLogin({ nonceStr, token }).then(res => {
        Toast.clear();
        if (res.code === Config.api.success) {
          window.zdb.tExit();
        } else {
          Toast(res.msg);
        }
      });
    },
    cancel() {
      window.zdb.tExit();
    }
  }
};
</script>

<style lang="less" scoped>
.qr-login {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #fff;
  .qr-content {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .logo {
    display: inline-block;
    width: 3.6rem;
    height: 3.6rem;
    margin-top: 2.8rem;
  }
  .title {
    line-height: 1;
    font-size: 0.48rem;
    text-align: center;
    margin-top: 0.64rem;
    color: #333;
  }
  .login {
    width: 4.8rem;
    height: 1.2rem;
    line-height: 1.2rem;
    border-radius: 0.6rem;
    font-size: 0.48rem;
    margin: 0 auto 0.8rem;
  }
  .cancel-login {
    display: block;
    width: 4.8rem;
    height: 1.2rem;
    line-height: 1.2rem;
    font-size: 0.44rem;
    color: #888;
    margin: 0 auto 0.8rem;
    cursor: pointer;
    text-align: center;
  }
}
</style>
