<template>
    <div class="help-container" v-if="detail" :style="{background: `url(${helpBgImg}) 0 0 no-repeat`, backgroundSize: '100% 100%'}">
        <p class="help-text">日利率最低砍至万分之{{detail.minimumRate}} &nbsp;&nbsp;刀刀都是钱</p>
        <img class="help-banner" :src="`${detail.prodImg}`">
        <div class="help-btn">
            <Button class="btn-left" v-if="detail.canHelp" type="primary" @click="postKnifeNum">助你一刀之力</Button>
            <Button class="btn-left btn-left-gray" v-else type="primary">助你一刀之力</Button>
            <Button class="btn-right" type="primary" @click="redirectPro">我也要提款</Button>
        </div>
        <div class="qrcode">
            <!-- <img v-if="qrImg == 'pre'" class="qrcode-img" @click.prevent="1" src="@/assets/img-lrcb-pre-qr.png"> -->
            <img class="qrcode-img" @click.prevent="1" :src="`${qrcodeImg}`">
            <span class="qrcode-tip">长按识别关注公众号</span>
        </div>
    </div>
</template>
<script>
import { Button, Toast } from "vant";
import { getActiveKnife, postKnifeNum } from "@/service/activity";
import { getUrlkey, doLoading, countPlus, getReferer } from "@/utils";
import prefixUrl from "@/utils/mixins/prefixUrl";

export default {
  components: {
    Button
  },
  mixins: [prefixUrl],
  data() {
    return {
      code: getUrlkey(window.location.search)["activityCode"],
      detail: "",
      qrImg: getReferer(),
      helpBgImg: "",
      qrcodeImg: ""
    };
  },
  created() {
    this.getActiveKnife();
  },
  methods: {
    // 增加刀数
    async postKnifeNum() {
      const { code } = this;
      // todo 置灰限制
      doLoading(this, true);
      let res = await postKnifeNum({ code });
      countPlus("点击“助你一刀之力”", "send");
      // this.getActiveKnife();
      let resDetail = await getActiveKnife({ code });
      this.detail = resDetail.data;
      doLoading(this, false);
      if (res.data) {
        Toast(res.msg);
      }
    },
    // 获取页面信息
    async getActiveKnife() {
      const { code } = this;
      doLoading(this, true);
      let res = await getActiveKnife({ code });
      doLoading(this, false);
      this.detail = res.data;
      this.helpBgImg = this.detail.helpBgImg;
      this.qrcodeImg = this.detail.qrcodeImg;
    },
    redirectPro() {
      countPlus("点击“我也要提款”", "send");
      window.location.href = this.detail.proUrl;
    }
  }
};
</script>
<style lang="less" scoped>
.help-container {
  text-align: center;
  width: 10.8rem;
  margin: 0 auto;
  height: 100%;
  // background: url(../../../assets/bg_friend_help.png) 0 0 no-repeat;
  // background-size: 100% 100%;
  .help-text {
    margin: 0;
    padding: 3.12rem 0 0.8rem;
    color: #fff;
    font-size: 0.48rem;
  }
  .help-banner {
    display: block;
    width: 10.16rem;
    height: 4.64rem;
    margin: 0 auto;
    border-radius: 0.16rem 0.16rem 0 0;
    pointer-events: none;
  }
  .help-btn {
    width: 10.16rem;
    margin: 0 auto;
    background: #fff;
    border-radius: 0 0 0.16rem 0.16rem;
    .btn-left,
    .btn-right {
      width: 4.4rem;
      height: 1.24rem;
      font-size: 0.48rem;
      border-radius: 0.64rem;
      margin: 0.96rem 0 0.8rem;
      border: 0;
      font-weight: 600;
    }
    .btn-left {
      background: #ffd33b;
      color: #5102bf;
    }
    .btn-left-gray {
      background: #dcdcdc;
      color: #888;
    }
    .btn-right {
      margin-left: 0.4rem;
      background: #fa494b;
      color: #fff;
    }
  }
  .qrcode {
    width: 5.04rem;
    height: 6.44rem;
    border-radius: 0.24rem;
    margin: 1.2rem auto 1.2rem;
    background: #fff;
    .qrcode-img {
      width: 4.4rem;
      height: 4.4rem;
      margin: 0.32rem;
      pointer-events: auto;
    }
    .qrcode-tip {
      display: block;
      width: 5.04rem;
      height: 1.4rem;
      line-height: 1.4rem;
      background: #eee;
      color: #666;
      font-size: 0.36rem;
      border-radius: 0 0 0.24rem 0.24rem;
    }
  }
}
</style>
