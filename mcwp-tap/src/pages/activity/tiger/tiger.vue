<template>
  <div class="tiger-container">
    <img v-if="displayType!==DISPLAY_TYPE_RECEIVE" :src="logoUrl" class="logo" alt="">
    <img v-if="displayType!==DISPLAY_TYPE_RECEIVE"
         @click="()=>{ displayType = DISPLAY_TYPE_RULES }"
         src="../../../assets/activity/tiger/btn-activity-rules.png"
         class="activity-rules btn" alt="">
    <div class="empty"></div>
    <div class="news">
      <swipe class="news-content" :autoplay="1500" :show-indicators="false" vertical>
        <swipe-item v-for="(text,index) in news" :key="index">
          <span class="news-text">{{text}}</span>
        </swipe-item>
      </swipe>
    </div>
    <tiger-body
      ref="tigerBody"
      :chance="chance"
      :person-count="personCount"
      :images="images"
      :activity-code="activityCode"
      :showCount="showCount"
      @scroll="scroll"
      @prize="prized"></tiger-body>
    <img
      class="share btn" @click="share"
      src="../../../assets/activity/tiger/btn-share.png"
      alt="">
    <tiger-declare
      v-if="displayType === DISPLAY_TYPE_RULES"
      :rule="rules"
      @clickBackground="displayType=DISPLAY_TYPE_DEFAULT"></tiger-declare>
    <share v-if="showShare" @hide="showShare=false"></share>
    <tiger-result
      v-if="displayType===DISPLAY_TYPE_RESULT"
      :shake-type="prize&&prize.prizeName==null?2:1"
      :message="prize&&prize.prizeName"
      :show-share-tips="prize.maxContinue"
      :leftBtnType:="chance>0"
      :prizeType="prizeType"
      @clickBackground="displayType=DISPLAY_TYPE_DEFAULT"
      @clickReward="clickReward"
      @clickConfirm="()=>{displayType=DISPLAY_TYPE_DEFAULT}"
      @clickOnceMore="start"
      @clickShare="share"></tiger-result>
      <Login v-show="showLogin" @success="loginSuccess" />
    <!--<popup :overlay="false" v-model="showLogin" style="width:100%;height:100%;"><Login v-show="showLogin" @success="loginSuccess" @changeTab="changeTab" /></popup>-->
    <winner
      v-if="displayType===DISPLAY_TYPE_RECEIVE"
      :activity-code="activityCode"
      :prize-id="prize.pId"
      :prize="prize"
      :is-shake="true"
      :qr-code="qrCode"
      @exchange="clickExchange"
      @takeSuccess="()=>{getActivityConfig()}"></winner>

  </div>
</template>

<script>
import { Swipe, SwipeItem, Popup } from "vant";
import tigerBody from "./tigerBody";
import {
  activityConfig,
  postShakeShare
} from "../../../service/activity/tiger/tiger";
import wxSdk from "../../../utils/wxJsSdk";
import tigerDeclare from "../../../components/activity/tiger/tigerDeclare";
import share from "../../../components/share";
import tigerResult from "../../../components/activity/tiger/tigerResult";
import winner from "../../../components/activity/puzzle/winner";
import { Config, countPlus } from "../../../utils";
import Store from "store";
import Login from "../../../components/home/login";
import { getWxLoginStatus } from "../../../service/user";

export default {
  name: "tiger",

  data() {
    return {
      activityCode: "",
      bankCode: null,
      displayType: 0,
      logoUrl: window.location.href.split("?")[0],
      chance: 0,
      personCount: 0,
      news: [],
      images: ["", "", ""],
      shareUrl: "",
      rules: {},
      showCount: true,
      prize: null,
      userPrize: null,
      qrCode: "",
      openId: "",
      showShare: false,
      DISPLAY_TYPE_DEFAULT: 0,
      DISPLAY_TYPE_RULES: 1,
      // DISPLAY_TYPE_SHARE: 2,
      DISPLAY_TYPE_RESULT: 3,
      DISPLAY_TYPE_RECEIVE: 4,
      showLogin: false,
      userPhone: null,
      userName: null,
      loginStatus: false,
      prizeType: null
    };
  },
  mounted() {
    this.getWxLoginStatus();
    this.activityCode = this.$route.query["activityCode"];
    this.bankCode = this.$route.query["bankCode"];
    // this.activityCode = "2421b226bc73400f9d9a38100cf6bd9b";
    // this.bankCode = "10001";
    if (
      this.activityCode == null ||
      this.activityCode === "" ||
      this.bankCode == null ||
      this.bankCode === ""
    ) {
      this.$toast("参数错误");
    }
    let wxUserInfo = Store.get(Config.constants.wxUserInfo);
    this.openId = wxUserInfo && wxUserInfo.openid;
    this.userName = wxUserInfo && wxUserInfo.userName;
    this.userPhone = wxUserInfo && wxUserInfo.telephone;
    // this.loginStatus = wxUserInfo && wxUserInfo.loginStatus;
    let isHelp = this.$route.query["isHelp"];
    if (isHelp == 1) {
      this.help(this.$route.query["openId"]);
    }

    this.getActivityConfig();
    this.shareUrl = `${
      window.location.origin
    }/backend/comm/v1/wx/authorize?url=${encodeURIComponent(
      `/tap/activity/tiger?openId=${this.openId}&isHelp=1`
    )}&bankCode=${this.bankCode}&activityCode=${
      this.activityCode
    }&activityType=shake`;
    this.shareInit();
  },
  components: {
    Swipe,
    SwipeItem,
    tigerBody,
    tigerDeclare,
    share,
    tigerResult,
    winner,
    Login,
    Popup
  },
  methods: {
    async getWxLoginStatus() {
      let res = await getWxLoginStatus();
      if (res.data) {
        this.loginStatus = res.data.loginStatus;
        if (res.data.telephone) {
          this.userPhone = res.data.telephone;
        }
        if (res.data.userName) {
          this.userName = res.data.userName;
        }
      }
    },
    async getActivityConfig() {
      this.$toast.loading({
        message: "请稍后",
        mask: true
      });
      let res = await activityConfig(this.activityCode);
      this.$toast.clear();
      let data = res.data;
      if (data) {
        this.logoUrl = data.coverUrl;
        this.news = data.winners;
        this.images = data.operateConf.map(it => {
          return it.coverUrl;
        });
        this.personCount = data.peopleNum;
        this.chance = data.liveNum;
        this.rules = data.jigsawStateDTO;
        this.showCount = data.numType == "1";
        this.qrCode = data.jigsawStateDTO && data.jigsawStateDTO.qrcodeUrl;
        if (data.userPrize) {
          data.userPrize.logoUrl = this.logoUrl;
          data.userPrize.personCount = this.personCount;
          data.userPrize.showCount = this.showCount;
          data.userPrize.news = this.news;
          data.userPrize.rules = JSON.stringify(this.rules);
          this.$router.replace({
            name: "PrizeResult",
            path: "/activity/prize/result",
            query: data.userPrize
          });
        }
      }
    },
    scroll() {
      this.chance--;
      countPlus("点击“试试手气”", "send");
    },
    prized(pri) {
      this.prize = pri;
      this.prizeType = pri.prizeType;
      this.displayType = this.DISPLAY_TYPE_RESULT;
    },
    async shareInit() {
      let params = {
        activityCode: this.activityCode,
        type: 5
      };
      wxSdk.wxShareCommon(
        () => {
          this.showShare = false;
          countPlus("摇一摇分享", "send");
        },
        params,
        this.shareUrl
      );
    },
    async share() {
      this.showShare = true;
    },
    async help(otherOpenId) {
      await postShakeShare({
        activityCode: this.activityCode,
        openId: otherOpenId
      });
    },
    start() {
      this.displayType = this.DISPLAY_TYPE_DEFAULT;
      this.$refs.tigerBody.scroll();
    },
    clickReward() {
      //判断是否需要登录
      if (this.loginStatus) {
        this.displayType = this.DISPLAY_TYPE_RECEIVE;
        countPlus("摇一摇游戏点击“领取奖品”", "send");
      } else {
        this.showLogin = true;
      }
    },
    loginSuccess() {
      this.showLogin = false;
      // this.userPhone = data.telephone;
      // if (data.userName) {
      //   this.userName = data.userName;
      // }
      this.displayType = this.DISPLAY_TYPE_RECEIVE;
    },
    clickExchange() {
      this.router.replace("/score/scoreExchange");
    }
  }
};
</script>

<style lang="less" scoped>
img.btn {
  pointer-events: auto;
}
.tiger-container {
  background: url("../../../assets/activity/tiger/img-bg.png");
  background-size: cover;
  width: 100vw;
  height: 100vh;

  .logo {
    position: relative;
    margin-top: 0;
    margin-left: 0.24rem;
    width: 1.2rem;
    height: 1.2rem;
    z-index: 1;
    float: left;
  }

  .activity-rules {
    position: relative;
    margin-top: 0.48rem;
    margin-right: 0.08rem;
    width: 2rem;
    height: 0.8rem;
    pointer-events: auto;
    float: right;
    z-index: 1;
  }

  .empty {
    height: 1.12rem;
  }

  .news {
    width: 8.84rem;
    height: 2.04rem;
    border: 0.1rem #161235 solid;
    background-color: #bae0fd;
    border-radius: 0.08rem;
    margin: 0 auto;
    position: relative;

    .news-content {
      width: 8.2rem;
      height: 1.4rem;
      border: 0.1rem #161235 solid;
      background-color: #1582d5;
      margin: auto;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);

      .news-text {
        font-size: 0.4rem;
        color: white;
        font-weight: bold;
        text-align: center;
        position: absolute;
        width: 8.2rem;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        /*line-height: 1.4rem;*/
      }
    }
  }

  .share {
    width: 100vw;
    position: relative;
    top: -0.2rem;
  }
}
</style>
