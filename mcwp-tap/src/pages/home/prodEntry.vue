<template>
    <div class="product-desc" v-if="prefixUrl" :style="{background: `url(${prefixUrl}home/bg_invitedetail.png) 0 0 no-repeat`, backgroundSize: '100% 100%'}">
      <div>
        <div class="line-1px-b product-phone">
          <input maxlength="11" type="tel" v-model="phone" class="phone-input" placeholder="手机号">
        </div>
        <div class="img-verify">
          <input v-model="imgVerify" class="img-verify-input" type="text" placeholder="图形验证码">
          <img @click="getImgShare()" class="img-verify-btn" :src="imgVerifyApi">
        </div>
      </div>
      <div class="product-verifyCode">
        <input v-model="verifyCode" class="verifyCode-input" type="text" placeholder="验证码">
        <span v-if="!computedTime" @click="getVerifyCode" class="verifyCode-btn">{{codeText}}</span>
        <span v-else class="verifyCode-btn">{{codeText}}</span>
      </div>
      <div @click="ProdShare" class="product-apply">领取额度</div>
    </div>
</template>
<script>
import { Config, isTelephone } from "@/utils/";
import { postProdShare, postImgShare } from "../../service/home.js";
import prefixUrl from "@/utils/mixins/prefixUrl";
import { countPlus } from "../../utils";

export default {
  mixins: [prefixUrl],
  data() {
    return {
      phone: "",
      codeText: "获取验证码",
      computedTime: 0,
      imgVerify: "",
      verifyCode: "",
      shareCode: "",
      category: "",
      channel: "",
      imgVerifyApi: ""
      // errorImgVerify: false
    };
  },
  mounted() {
    this.getImgShare();
    let share =
      JSON.parse(sessionStorage.getItem(Config.constants.activityShareUser)) ||
      {};
    this.shareCode = share.shareUserCode;
    this.category = share.category;
    this.channel = share.channel;
  },
  destroyed() {
    if (this.timer) clearInterval(this.timer);
  },
  methods: {
    //获取图形验证码
    getImgShare() {
      this.imgVerifyApi = `${
        Config.api.url
      }/comm/captcha?width=98&height=40&scene=3&v=${Math.random()}`;
    },
    //获取验证码
    async getVerifyCode() {
      const that = this;
      const { phone, imgVerify } = this;
      if (!imgVerify) return that.$toast(Config.toast.nullImgVerify);
      if (!phone) return that.$toast(Config.toast.nullPhone);
      if (!imgVerify) return that.$toast(Config.toast.nullImgVerify);
      if (!isTelephone(phone)) return that.$toast(Config.toast.errorPhone);
      //验证图形验证码
      await postImgShare({ phone: phone, captchaCode: imgVerify });
      // that.errorImgVerify = true;
      that.computedTime = 60;
      that.timer = setInterval(() => {
        that.codeText = that.computedTime + "s";
        that.computedTime--;
        if (that.computedTime === -1) {
          that.codeText = "重新获取";
          that.computedTime = 0;
          clearInterval(that.timer);
        }
      }, 1000);
      //发送验证码
      // await sendWxVerifyCode({ phone: phone });
      that.$toast(Config.toast.sendVerifyCode);
    },
    //领取额度btn
    async ProdShare() {
      const that = this;
      const { phone, verifyCode, shareCode } = this;
      if (!phone) return that.$toast(Config.toast.nullPhone);
      if (!isTelephone(phone)) return that.$toast(Config.toast.errorPhone);
      if (!that.imgVerify) return that.$toast(Config.toast.nullImgVerify);
      // if (!that.errorImgVerify) return that.$toast(Config.toast.errorImgVerify);
      if (!verifyCode) return that.$toast(Config.toast.nullverificationCode);
      let res = await postProdShare({
        phone: phone,
        verificationCode: verifyCode,
        shareCode: shareCode
      });
      countPlus("点击“领取额度”", "send");
      window.location.href = `/h5/product/detail?prdCode=${
        res.data
      }&userCode=${shareCode}&stay=1&phone=${window.btoa(
        unescape(encodeURIComponent(phone))
      )}&category=${that.category}&channel=${that.channel}`;
    }
  }
};
</script>
<style lang="less">
.product-desc {
  width: 10.8rem;
  // height: 100%;
  // min-height: 17.04rem;
  height: 20.84rem;
  background-color: #fff;
  margin: 0 auto;
  -moz-user-select: none;
  -khtml-user-select: none;
  user-select: none;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  overflow: hidden;
  // background: url("./../../assets/bg_invitedetail.png") 0 0 no-repeat;
  // background-size: cover;
  .product-phone,
  .product-verifyCode,
  .img-verify {
    background: #fff;
    border-radius: 0.32rem;
    width: 8.32rem;
    height: 1.2rem;
    margin: 0 auto;
    .verifyCode-input,
    .phone-input,
    .img-verify-input {
      width: 8rem;
      height: 1.2rem;
      border-radius: 0.32rem;
      padding-left: 0.32rem;
      font-size: 0.4rem;
      color: #333;
    }
  }
  .product-phone {
    margin-top: 8.78rem;
    resize: none;
    box-sizing: border-box;
    border-radius: 0.32rem 0.32rem 0 0;
    .phone-input {
      border-radius: 0.32rem 0.32rem 0 0;
    }
  }
  .img-verify {
    position: relative;
    border-radius: 0 0 0.32rem 0.32rem;
    .img-verify-input {
      border-radius: 0 0 0.32rem 0.32rem;
    }
    .img-verify-btn {
      width: 2.8rem;
      height: 1.2rem;
      cursor: pointer;
      pointer-events: auto;
      border-radius: 0 0 0.32rem 0;
      font-size: 0;
      color: #fff;
      position: absolute;
      right: 0;
      bottom: 0;
      font-size: 0;
      border: none;
    }
  }
  .product-verifyCode {
    margin-top: 0.4rem;
    position: relative;
    border-radius: 0.32rem;
    .verifyCode-btn {
      text-align: center;
      width: 2.8rem;
      height: 1.2rem;
      line-height: 1.2rem;
      border-radius: 0 0.32rem 0.32rem 0;
      font-size: 0.4rem;
      color: #fff;
      background: #f0564f;
      position: absolute;
      right: 0;
      top: 0;
    }
  }
  .product-apply {
    width: 5.4rem;
    height: 1.36rem;
    background: #f0564f;
    color: #fff;
    font-size: 0.56rem;
    text-align: center;
    line-height: 1.36rem;
    border-radius: 1.36rem;
    margin: 0.8rem auto 0;
    :active {
      background: #d84d47;
    }
  }
  // .apply-tip {
  //   position: absolute;
  //   top: 16.8rem;
  //   width: 100%;
  //   color: #f8efef;
  //   text-align: center;
  // }
}
</style>
