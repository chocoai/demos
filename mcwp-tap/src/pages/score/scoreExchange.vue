<template>
  <div class="exchange-container">
    <div v-if="giftVos" v-for="(item, index) in giftVos" :key="index" class="invite-exchange">
      <img v-if="item.giftType == 1" class="phone-img" src="@/assets/img_phone.png">
      <img v-if="item.giftType == 6" class="phone-img" src="@/assets/img_money.png">
      <span class="exchange-title">{{giftVos && item.giftName}}</span>
      <span v-if="item.giftDesc" class="exchange-detail">{{giftVos && item.giftDesc}}</span>
      <router-link v-if="item.giftType == 1" :to="Router.pay.path" class="exchange-btn">兑换</router-link>
      <span v-if="item.giftType == 6" @click="baseWxAuth" class="exchange-btn">兑换</span>
    </div>
    <div v-if="!giftVos" class="no-exchange">
      没有可兑换奖品
    </div>
  </div>
</template>
<script>
import Router from "@/utils/routerConfig.js";
import { getShareGifts } from "@/service/home.js";
import { getWxMe } from "@/service/user.js";
import { Config } from "@/utils/index.js";
// import Store from "store";

export default {
  data() {
    return {
      Router,
      giftVos: [],
      userCode: ""
    };
  },
  mounted() {
    this.getShareData();
  },
  methods: {
    async getShareData() {
      const that = this;
      let res = await getShareGifts();
      that.giftVos = res.data;
      let meRes = await getWxMe();
      that.userCode = meRes.data.userCode;
    },
    baseWxAuth() {
      // let cookies = Store.get(Config.constants.cookies);
      window.location.href = `${
        Config.api.url
      }/comm/v1/wx/authorize/redpack?url=${encodeURIComponent(
        window.location.origin
      )}%2Ftap%2Factivity%2Fmoney&userCode=${this.userCode}`;
    }
  }
};
</script>
<style lang="less" scoped>
.exchange-container {
  width: 10.8rem;
  margin: 0 auto;
  .invite-exchange {
    height: 2.76rem;
    width: 7.8rem;
    margin: 0.32rem auto 0;
    padding-left: 2.2rem;
    text-align: left;
    background: #fff;
    border-radius: 0.24rem;
    position: relative;
    box-shadow: 0 0 0.04rem 0.08rem rgba(0, 0, 0, 0.02);
    .phone-img {
      height: 1.32rem;
      width: 1.32rem;
      position: absolute;
      left: 0.48rem;
      top: 0;
      bottom: 0;
      margin: auto;
    }
    .exchange-title {
      display: block;
      color: #333;
      font-size: 0.56rem;
      padding-top: 0.8rem;
    }
    .exchange-detail {
      display: block;
      font-size: 0.32rem;
      color: #666;
    }
    .exchange-btn {
      display: block;
      position: absolute;
      right: 0.56rem;
      top: 0;
      bottom: 0;
      margin: auto;
      height: 0.88rem;
      line-height: 0.88rem;
      width: 2rem;
      text-align: center;
      font-size: 0.4rem;
      color: #fa494b;
      border-radius: 0.44rem;
      border: #f00 0.03rem solid;
    }
  }
  .no-exchange {
    font-size: 0.56rem;
    line-height: 5rem;
  }
}
</style>
