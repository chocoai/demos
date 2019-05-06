<template>
  <div class="red-packet-share-bg" v-if="bgImg" :style="{background:`url('${bgImg}') no-repeat 0 0 / 100% auto #F95C51`}">
    <div class="product-bg" v-if="prodImg" :style="{background:`url('${prodImg}') no-repeat 0 0 / 100% auto`}">
      <img v-if="canHelp" @click="help" src="../../../assets/activity/redPacket/btn_help.png" alt="" class="help"/>
      <img v-else src="../../../assets/activity/redPacket/btn_help_disable.png" alt="" class="help"/>
      <img @click="requestLoan" src="../../../assets/activity/redPacket/btn_request.png" alt="" class="apply"/>
    </div>
    <div class="qr-code-bg">
      <img v-if="qrImg" :src="qrImg" alt="" class="qr-code-img"/>
      <img v-else src="../../../assets/activity/redPacket/img_product_bg.png" alt="" class="qr-code-img"/>
      <p class="qr-code-focus">长按识别 关注我们</p>
    </div>
    <div class="space"></div>
  </div>
</template>

<script>
import { getHelpContent, help } from "../../../service/activity/redPacket";
import wxSdk from "@/utils/wxJsSdk";
import { countPlus } from "../../../utils";

export default {
  name: "share",
  data() {
    return {
      telephone: "",
      bgImg: "",
      prodImg: "",
      qrImg: "",
      canHelp: false,
      prodUrl: ""
    };
  },
  mounted() {
    this.telephone = this.$route.query["telephone"];
    this.initInfo();
    wxSdk.wxNoShare();
  },
  methods: {
    async initInfo() {
      this.$toast.loading("请稍后...");
      let res = await getHelpContent({ telephone: this.telephone });
      this.$toast.clear();
      this.bgImg = res.data.helpBgImg;
      this.prodImg = res.data.prodImg;
      this.qrImg = res.data.qrcodeImg;
      this.canHelp = res.data.canHelp;
      this.prodUrl = res.data.proUrl;
    },
    async help() {
      this.$toast.loading("请稍后...");
      let res = await help({ telephone: this.telephone });
      countPlus("点击“助力抢红包”", "send");
      if (res && res.data) {
        this.$toast({
          mask: true,
          message: `<span style='white-space:pre-wrap;padding:0.3rem 0.5rem;display:block;font-size:0.36rem;border-radius:0.05rem;text-align:center'>${
            res.data
          }</span>`,
          type: "html"
        });
        this.canHelp = false;
      }
    },
    requestLoan() {
      if (this.prodUrl) {
        countPlus("点击“申请额度”", "send");
        window.location.href = window.location.origin + this.prodUrl;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.red-packet-share-bg {
  padding-top: 0.001rem;
  width: 100%;
  min-height: 100vh;
  background: url("../../../assets/activity/redPacket/bg_red_packet_share.png")
    no-repeat 0 0 / 100% auto;
  .product-bg {
    margin: 4.72rem auto 0;
    background: url("../../../assets/activity/redPacket/img_product_bg.png");
    height: 8.24rem;
    width: 9.68rem;
    background-size: cover;
    position: relative;
    .help {
      bottom: 0.4rem;
      left: 0.72rem;
      width: 3.6rem;
      height: 1.2rem;
      position: absolute;
      pointer-events: auto;
    }
    .apply {
      bottom: 0.4rem;
      right: 0.72rem;
      width: 3.6rem;
      height: 1.2rem;
      position: absolute;
      pointer-events: auto;
    }
  }
  .qr-code-bg {
    background-color: white;
    border-radius: 0.2rem;
    width: 4.32rem;
    height: 5.24rem;
    margin: 1.2rem auto 0;
    position: relative;
    .qr-code-img {
      margin: 0.28rem 0.28rem;
      width: 3.76rem;
      height: 3.76rem;
      background-size: cover;
      pointer-events: auto;
    }
    .qr-code-focus {
      position: absolute;
      margin-bottom: 0;
      height: 0.94rem;
      line-height: 0.94rem;
      width: 4.32rem;
      font-size: 0.36rem;
      color: #555;
      background-color: #eee;
      text-align: center;
      border-bottom-left-radius: 0.2rem;
      border-bottom-right-radius: 0.2rem;
    }
  }
  .space {
    height: 2.3rem;
  }
}
</style>
