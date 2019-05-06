<template>
    <div class="help-container" v-if="detail" :style="{background: `url(${bgImg}) 0 0 no-repeat`, backgroundSize: '100% 100%'}">
        <p class="help-text">日利率最低砍至万分之{{detail.minimumRate}} &nbsp;&nbsp;刀刀都是钱</p>
        <div class="help-knife">
          <p class="user-name">{{name}}</p>
          <span class="now">当前利率：</span>
          <span class="now-value">{{detail.thisRate}}‱</span>
          <span class="before">初始利率：{{detail.startRate}}‱</span>
          <!-- <div class="progress">
            <span class="progress-01 progress-all"></span>
            <span class="progress-02 progress-all"></span>
            <span class="progress-03 progress-all"></span>
            <span class="progress-04 progress-all"></span>
            <span class="progress-05 progress-all"></span>
          </div> -->
          <Progress
            style="width: 9.2rem;height: 0.88rem;margin: 0.6rem auto 0.64rem;"
            class="progress"
            color="#fa494b"
            :percentage="percentage"
            :show-pivot="false"
          />
        </div>
        <div class="help-btn">
            <p class="help-get" v-if="detail.minimumRate == detail.thisRate">恭喜，您已经获得最低利率</p>
            <p class="help-txt">邀请好友助力，最低砍至{{detail.minimumRate}}‱</p>
            <Button class="btn-left" type="primary" v-if="detail.canKnife && detail.knifeNum" @click="postKnife">砍一刀
              <span class="btn-knife">(余{{detail.knifeNum}}刀)</span>
            </Button>
            <Button class="btn-left btn-left-gray" type="primary" v-else>砍一刀
              <span class="btn-knife">(余{{detail.knifeNum}}刀)</span>
            </Button>
            <Button class="btn-right" type="primary" @click="showShareTip=true">分享</Button>
        </div>
        <div class="intro">
          <img class="intro-title" src="@/assets/img_title.png">
          <!-- <p class="intro-info">尊敬的用户，您当前申请的{{detail.prodName}}日利率为万分之{{detail.thisRate}}，邀请好友助力，最低砍至万分之{{detail.minimumRate}}，快来试试你的手气吧~</p>
          <p class="intro-list">1.成功申请潞盈人人贷之后即可参加砍利率活动，并获得一次砍利率的机会。</p>
          <p class="intro-list">2.每{{detail.helpNum}}个好友点击链接成功助力，获得一次砍一刀的机会。</p>
          <p class="intro-list">3.可以砍获的最低日利率为万分之{{detail.minimumRate}}。</p>
          <p class="intro-list">4.砍获的利率为优惠利率，一次有效！</p>
          <p class="intro-list">5.您本次借款的放款时间即为您参与本次活动的有效截止时间。</p>
          <p class="intro-list">6.{{detail.copyright}}</p> -->
          <pre class="intro-list">{{detail.description}}</pre>
        </div>
        <v-share v-if="showShareTip" @hide="showShareTip=false" :showShareTip="showShareTip"></v-share>
    </div>
</template>
<script>
import { Button, Progress, Toast } from "vant";
import VShare from "@/components/share";
import Wxsdk from "@/utils/wxJsSdk";
import { Config, doLoading } from "@/utils";
import { getKnifePage, postKnife } from "@/service/activity";
import { getUrlkey, countPlus } from "@/utils";
import Store from "store";
import prefixUrl from "@/utils/mixins/prefixUrl";

export default {
  components: {
    Button,
    Progress,
    VShare
  },
  mixins: [prefixUrl],
  data() {
    return {
      detail: "",
      percentage: 0,
      showShareTip: false,
      code: getUrlkey(window.location.search)["activityCode"],
      name: "",
      bgImg: ""
    };
  },
  created() {
    const that = this;
    let cookies = Store.get(Config.constants.cookies);
    that.name =
      cookies.userName ||
      (cookies.telephone &&
        cookies.telephone.substr(0, 3) +
          "****" +
          cookies.telephone.substr(7)) ||
      "客户姓名";
    doLoading(this, true);
    that.getKnifePage();
  },
  mounted() {
    const { code } = this;
    const that = this;
    countPlus("一砍到底", "send");
    if (this.timer) clearInterval(this.timer);
    this.timer = setInterval(async () => {
      let res = await getKnifePage({ code });
      this.detail = res.data;
      if (res.data.knifeThisNum > res.data.knifeTotal)
        res.data.knifeThisNum = res.data.knifeTotal;
      that.percentage = (1 - res.data.knifeThisNum / res.data.knifeTotal) * 100;
    }, 20000);
  },
  destroyed() {
    if (this.timer) clearInterval(this.timer);
  },
  methods: {
    async getKnifePage() {
      const { code } = this;
      const that = this;
      let res = await getKnifePage({ code });
      doLoading(this, false);
      if (!res.data.canKnife && res.data.message) {
        Toast(res.data.message);
      }
      let params = {
        imgUrl: res.data.shareLogo,
        title: res.data.title,
        summary: res.data.summary
      };
      sessionStorage.setItem(
        Config.constants.activityKnifeImg,
        res.data.shareLogo
      );
      sessionStorage.setItem(
        Config.constants.activityKnifeTitle,
        res.data.title
      );
      sessionStorage.setItem(
        Config.constants.activityKnifeSummary,
        res.data.summary
      );
      sessionStorage.setItem(Config.constants.activityKnifeCode, this.code);
      Wxsdk.wxShare(
        () => {
          that.showShareTip = false;
          countPlus("砍利率分享", "send");
        },
        params,
        "knife"
      );
      this.detail = res.data;
      if (!this.bgImg) this.bgImg = this.detail.bgImg;
      if (res.data.knifeThisNum > res.data.knifeTotal)
        res.data.knifeThisNum = res.data.knifeTotal;
      this.percentage = (1 - res.data.knifeThisNum / res.data.knifeTotal) * 100;
    },
    async postKnife() {
      const { code } = this;
      // todo loading
      doLoading(this, true);
      await postKnife({ code });
      countPlus("点击“砍一刀”", "send");
      this.getKnifePage();
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
    padding: 3.8rem 0 0.8rem;
    color: #fff;
    font-size: 0.48rem;
  }
  .help-knife {
    text-align: center;
    width: 10.16rem;
    height: 4.64rem;
    margin: 0 auto;
    background: #fff;
    border-radius: 0.16rem 0.16rem 0 0;
    .user-name {
      font-size: 0.4rem;
      color: #333;
      padding: 0.6rem 0 0.88rem;
      margin: 0;
    }
    .now,
    .now-value,
    .before {
      display: table-cell;
      height: 0.64rem;
      vertical-align: bottom;
    }
    .now {
      font-size: 0.44rem;
      color: #333;
      padding-left: 1.52rem;
    }
    .now-value {
      color: #fa494b;
      font-size: 0.64rem;
    }
    .before {
      font-size: 0.38rem;
      color: #888;
      text-decoration: line-through;
      padding-left: 0.24rem;
    }
    .progress {
      margin: 0.6rem auto 0.64rem;
      width: 9.2rem;
      height: 0.88rem;
      border-radius: 0.44rem;
      background: #eee;
    }
    .progress-all {
      display: inline-block;
      height: 0.88rem;
      width: 1.8rem;
      background: #eee;
      border-right: #dcdcdc 0.02rem solid;
    }
    .progress-01 {
      border-radius: 0.44rem 0 0 0.44rem;
    }
    .progress-05 {
      border-radius: 0 0.44rem 0.44rem 0;
      border: 0;
    }
  }
  .help-btn {
    width: 10.16rem;
    margin: 0 auto;
    background: #fff;
    border-radius: 0 0 0.16rem 0.16rem;
    .help-get {
      color: #5102bf;
      font-size: 0.4rem;
      padding: 0.64rem 0 0.72rem;
    }
    .help-txt {
      color: #333;
      font-size: 0.36rem;
    }
    .btn-left,
    .btn-right {
      width: 4.4rem;
      height: 1.24rem;
      font-size: 0.48rem;
      border-radius: 0.64rem;
      margin: 0.32rem 0 0.64rem;
      border: 0;
      font-weight: 600;
    }
    .btn-left {
      background: #ffd33b;
      color: #5102bf;
      .btn-knife {
        font-size: 0.32rem;
        color: #333;
      }
    }
    .btn-left-gray {
      background: #dcdcdc;
      color: #888;
      .btn-knife {
        font-size: 0.32rem;
        color: #888;
      }
    }
    .btn-right {
      margin-left: 0.4rem;
      background: #fa494b;
      color: #fff;
    }
  }
  .intro {
    width: 10.16rem;
    border-radius: 0.16rem;
    background: #fff;
    margin: 0.48rem auto 0.8rem;
    padding-bottom: 0.8rem;
    .intro-title {
      width: 4.4rem;
      height: 0.88rem;
      margin: 0.64rem auto;
    }
    .intro-info,
    .intro-list {
      margin: 0;
      text-align: left;
      padding: 0 0.64rem;
      font-size: 0.4rem;
      color: #333;
    }
    .intro-info {
      line-height: 0.6rem;
      margin-bottom: 0.48rem;
    }
    .intro-list {
      line-height: 0.52rem;
      margin: 0.32rem 0;
    }
  }
}
</style>
