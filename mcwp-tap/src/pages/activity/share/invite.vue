<template>
  <div class="invite-container">
    <div class="invite-friend" v-if="sharedata.activityImg" :style="{background: `url(${sharedata.activityImg}) 0 0 no-repeat`, backgroundSize: '100% 100%'}">
      <!-- <img class="invite-btn" src="@/assets/btn_invite_default.png"> -->
      <button class="invite-btn" @click="showShareTip=true"></button>
    </div>
    <div class="invite-score">
      当前积分: <span class="score-num">{{sharedata.currentScore}}</span>
      <router-link tag="span" :to="Router.scoreDetail.path" class="score-detail">积分明细</router-link>
      <router-link tag="span" :to="Router.scoreRank.path" class="score-rank"></router-link>
    </div>
    <!-- <div v-for="(item, index) in giftVos" :key="index" class="invite-exchange">
      <img v-if="item.giftType == 1" class="phone-img" src="@/assets/img_phone.png">
      <img v-if="item.giftType == 6" class="phone-img" src="@/assets/img_money.png">
      <span class="exchange-title">{{giftVos && item.giftName}}</span>
      <span v-if="item.giftDesc" class="exchange-detail">{{giftVos && item.giftDesc}}</span>
      <router-link v-if="item.giftType == 1" :to="Router.pay.path" class="exchange-btn">兑换</router-link>
      <router-link v-if="item.giftType == 6" :to="Router.money.path" class="exchange-btn">兑换</router-link>
    </div> -->
    <div class="intro">
      <img class="intro-title" src="@/assets/intro.png">
      <!-- <p class="intro-list">点击“立即邀请”邀请好友，可以获得相应的积分奖励。</p>
      <p v-if="sharedata.registScore" class="intro-list">好友成功注册获得{{sharedata.registScore}}积分（仅限{{sharedata.areaLimit}}内的手机号码注册）。</p>
      <p v-if="sharedata.entryMessage" class="intro-list">{{sharedata.entryMessage}}</p>
      <p v-if="sharedata.loanMessage" class="intro-list">{{sharedata.loanMessage}}</p>
      <p class="intro-list">每个客户可邀请的好友人数上限为50人。</p>
      <p class="intro-list">该积分可叠加使用，用于兑换各种礼品。</p>
      <p class="intro-list">{{sharedata.copyright}}</p> -->
      <pre v-if="sharedata.description" class="intro-list">{{sharedata.description}}</pre>
    </div>
    <v-share v-if="showShareTip" @hide="showShareTip=false" :showShareTip="showShareTip"></v-share>
  </div>
</template>
<script>
import { Button } from "vant";
import Router from "@/utils/routerConfig.js";
import VShare from "@/components/share";
import { getSharePage, postShare } from "@/service/activity.js";
import Wxsdk from "@/utils/wxJsSdk";
import { Config, countPlus } from "@/utils";
import prefixUrl from "@/utils/mixins/prefixUrl";

export default {
  components: {
    Button,
    VShare
  },
  mixins: [prefixUrl],
  data() {
    return {
      Router,
      sharedata: {},
      giftVos: [],
      showShareTip: false
    };
  },
  mounted() {
    this.getShareData();
  },
  methods: {
    async getShareData() {
      const that = this;
      let res = await getSharePage();
      this.sharedata = res.data;
      this.giftVos = res.data.activitySharePageGiftVos;
      let params = {
        imgUrl: res.data.shareLogo,
        title: res.data.title,
        summary: res.data.summary
      };
      sessionStorage.setItem(
        Config.constants.activityInviteImg,
        res.data.shareLogo
      );
      sessionStorage.setItem(
        Config.constants.activityInviteTitle,
        res.data.title
      );
      sessionStorage.setItem(
        Config.constants.activityInviteSummary,
        res.data.summary
      );
      Wxsdk.wxShare(
        () => {
          that.showShareTip = false;
          that.postshare();
          countPlus("邀请好友", "send");
        },
        params,
        "invite",
        {
          category: res.data.category,
          channel: res.data.channel
        }
      );
    },
    //分享动作
    async postshare() {
      await postShare();
    }
  }
};
</script>
<style lang="less" scoped>
.invite-container {
  width: 10.8rem;
  margin: 0 auto;
  padding-bottom: 0.4rem;
  background: #fafafa;
  .invite-friend {
    width: 10.8rem;
    height: 5.4rem;
    // background: url(../../../assets/img_share_banner.png) 0 0 no-repeat;
    // background-size: 100% 100%;
    .invite-btn {
      width: 3.96rem;
      height: 1.32rem;
      background: url(../../../assets/btn_invite_default.png) 0 0 no-repeat;
      background-size: 100% 100%;
      margin-top: 3.8rem;
    }
    .invite-btn:active {
      background: url(../../../assets/btn_invite_pressed.png) 0 0 no-repeat;
      background-size: 100% 100%;
    }
  }
  .invite-score {
    width: 10.8rem;
    height: 2.08rem;
    line-height: 1.52rem;
    font-size: 0.48rem;
    color: #333;
    background: #fff;
    text-align: left;
    vertical-align: top;
    padding-left: 0.4rem;
    position: relative;
    .score-num {
      font-size: 0.6rem;
      color: #fa494b;
      padding-left: 0.16rem;
    }
    .score-detail {
      padding: 0.24rem 0.16rem 0.24rem 0.96rem;
      background: url(../../../assets/icon_score_detail.png) 0.4rem 0.24rem
        no-repeat;
      background-size: 0.4rem 0.4rem;
      font-size: 0.42rem;
      height: 0.42rem;
      line-height: 0.42rem;
      color: #666;
      position: absolute;
      bottom: 0.2rem;
      left: 0.06rem;
    }
    .score-rank {
      width: 2.64rem;
      height: 0.96rem;
      background: url(../../../assets/btn_score_rank.png) 0 0 no-repeat;
      background-size: 100% 100%;
      // line-height: 0.96rem;
      // text-align: center;
      // font-size: 0.42rem;
      // color: #333;
      // // border: #999 1px solid;
      // border-radius: 0.72rem;
      position: absolute;
      right: 0.8rem;
      top: 0;
      bottom: 0;
      margin: auto;
    }
  }
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
  .intro {
    width: 10rem;
    border-radius: 0.24rem;
    background: #fff;
    margin: 0.32rem auto 0;
    padding-bottom: 0.4rem;
    box-shadow: 0 0 0.04rem 0.08rem rgba(0, 0, 0, 0.02);
    .intro-title {
      width: 3.4rem;
      height: 0.48rem;
      margin: 0.64rem auto 0.1rem;
    }
    .intro-list {
      text-align: left;
      padding: 0 0.44rem;
      font-size: 0.38rem;
      color: #333;
      line-height: 0.5rem;
      margin: 0.56rem 0;
    }
  }
}
</style>
