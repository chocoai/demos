<template>
  <div class="center-container">
    <div class="limit" v-if="wxMe.creditAmount && wxMe.dailyRate">
      <span class="limit-text">授信额度（元）</span>
      <p class="limit-num">{{thousandBitSeparator(wxMe.creditAmount)}}</p>
      <span class="limit-text">日利率万分之{{parseInt(wxMe.dailyRate * 100000000) / 1000000}}</span>
    </div>
    <div v-else class="limit">
      <span class="limit-text">授信额度（元）</span>
      <p class="limit-num">暂无额度</p>
    </div>
    <div class="score">
      <div class="score-pisition">
        <div class="score-t">
          当前积分
          <span class="score-num">{{wxMe.score}}</span>
        </div>
        <div>
          <router-link tag="span" :to="Router.scoreDetail.path" class="score-li score-li-01">
            积分明细
          </router-link>
          <router-link tag="span" :to="Router.scoreRank.path" class="score-li score-li-02">
            积分排行榜
          </router-link>
          <router-link tag="span" :to="Router.scoreExchange.path" class="score-li score-li-03">
            积分兑换
          </router-link>
        </div>
      </div>
    </div>
    <ul class="list">
      <div class="li-bg">
        <li class="list-bg" v-if="wxContainModule('wdjk')">
          <div :class="['list-click','touched-bg','border-bottom']" @click="warn">
            <span class="left icon-01">我的借款</span>
          </div>
        </li>
        <li class="list-bg border-bottom" v-if="wxContainModule('wyte')">
          <router-link :to="Router.increase.path">
            <div :class="['list-click','touched-bg','border-bottom']">
              <span class="right icon-02">我要提额</span>
            </div>
          </router-link>
        </li>
        <li class="list-bg" v-if="wxContainModule('grxx')">
          <router-link :to="Router.myinfo.path">
            <div class="list-click touched-bg border-bottom">
              <span class="right icon-04">个人信息</span>
            </div>
          </router-link>
        </li>
        <li class="list-bg" v-if="wxContainModule('wdzs')">
          <router-link :to="Router.homeCert.path">
            <div class="list-click touched-bg border-bottom">
              <span class="right icon-09">我的证书</span>
            </div>
          </router-link>
        </li>
      </div>

      <div class="li-bg">
        <li class="list-bg border-bottom list-margin-top" v-if="wxContainModule('wdhd')">
          <router-link :to="Router.activity.path">
            <div :class="['list-click','touched-bg','border-bottom']">
              <span class="left icon-05">我的活动</span>
            </div>
          </router-link>
        </li>
        <li class="list-bg border-bottom list-margin-top" v-if="wxContainModule('wtzx')">
          <router-link :to="Router.problem.path">
            <div :class="['list-click','touched-bg','border-bottom']">
              <span class="right icon-06">问题中心</span>
            </div>
          </router-link>
        </li>
        <li class="list-bg list-margin-bottom" v-if="wxContainModule('sjrz')">
          <router-link :to="`${Router.shopsJoin.path}?merchantCode=${wxMe.merchantCode}&telephone=${wxMe.telephone}&merchantStatus=${wxMe.merchantStatus}`" v-if="+wxMe.merchantStatus != 99">
            <div :class="['list-click','touched-bg','border-bottom']">
              <div class="icon-07 high">
                <span class="right">商家入驻</span>
                <span class="hint">{{`${['已解除合作', '审核中', '已入驻', '入驻失败'][+wxMe.merchantStatus]}`}}</span>
              </div>
            </div>
          </router-link>
          <router-link v-if="+wxMe.merchantStatus == 99" :to="Router.shopsJoin.path">
            <div :class="['list-click','touched-bg','border-bottom']">
              <div class="icon-07 high">
                <span class="right">商家入驻</span>
              </div>
            </div>
          </router-link>
        </li>
        <li class="list-bg list-margin-bottom" v-if="+wxMe.merchantStatus == 2 && wxContainModule('tgewm')">
          <router-link :to="`${Router.geneQRcode.path}?merchantCode=${wxMe.merchantCode}`">
            <div class="list-click touched-bg">
              <span class="right icon-08">推广二维码</span>
            </div>
          </router-link>
        </li>
      </div>
    </ul>
    <div class="service">
      <h2 class="service-title">我的专属客服</h2>
      <ul class="service-list" v-if="wxMe.managerName && wxMe.managerPhone">
        <li class="service-li">
          <p class="service-stitle">{{wxMe.managerName}}</p>
          <a class="service-phone" :href="`tel:${wxMe.managerPhone}`">{{wxMe.managerPhone}}</a>
          <a class="icon-phone" :href="`tel:${wxMe.managerPhone}`"></a>
        </li>
      </ul>
      <ul class="service-list" v-else>
        <li v-for="branch in wxMe.branchWebsites" :key="branch.code" class="service-li">
          <p class="service-stitle">{{branch.bankName}}</p>
          <a class="service-phone" :href="`tel:${branch.bankPhone}`">{{branch.bankPhone}}</a>
          <a class="icon-phone" :href="`tel:${branch.bankPhone}`"></a>
        </li>
      </ul>
    </div>
    <p @click="$emit('login')" class="change-user">
      切换账号
    </p>
  </div>
</template>
<script>
import Router from "@/utils/routerConfig.js";
import { thousandBitSeparator, getReferer } from "@/utils/";
import { getWxInfoModule } from "../../service/user";
// import { Config } from "@/utils/index.js";
import { countPlus } from "@/utils";
export default {
  props: ["wxMe"],
  data() {
    return {
      Router,
      thousandBitSeparator,
      merchantShow: getReferer() === "test",
      scdj: 0, //数仓对接 1 未对接 2 对接
      wxmkList: [],
      centerCount: 0,
      topCount: 0
    };
  },
  created() {
    if (!this.wxMe || !this.wxMe.telephone) this.$emit("login");
    this.getMyInfoModule();
    countPlus("浏览“个人中心”", "send");
  },
  methods: {
    async getMyInfoModule() {
      let res = await getWxInfoModule();
      let scdjList = res.data.scdj;
      this.scdj = scdjList[0].ddValue;
      this.wxmkList = res.data.wxmk;
    },
    warn() {
      if (this.scdj == 2) {
        this.$router.push({
          path: "/my/myborrow"
        });
      } else {
        this.$toast("暂未开通此功能，敬请期待！");
      }
    },
    wxContainModule(str) {
      if (str != null) {
        for (let i = 0; i < this.wxmkList.length; i++) {
          let text = this.wxmkList[i].ddValue;
          if (text == str) {
            return true;
          }
        }
        return false;
      } else {
        return false;
      }
    }
    // baseWxAuth() {
    //   window.location.href = `${
    //     Config.api.url
    //   }/comm/v1/wx/authorize/redpack?url=%2Ftap%2Fscore%2FscoreExchange&userCode=${
    //     this.wxMe.userCode
    //   }`;
    // }
  }
};
</script>
<style lang="less" scoped>
.center-container {
  display: flex;
  flex-direction: column;
  width: 10.8rem;
  margin: 0 auto;
  background: #fafafa;
  margin-bottom: 1.4rem;
  padding-bottom: 0.96rem;
  .limit {
    width: 100%;
    height: 4.64rem;
    background: #fa494b;
    padding-bottom: 0.6rem;
    color: #fff;
    text-align: center;
    .limit-num {
      height: 1.28rem;
      font-size: 1.28rem;
      margin: 0;
    }
    .limit-text {
      display: block;
      height: 0.4rem;
      font-size: 0.4rem;
      padding: 0.6rem 0;
    }
  }
  .score {
    width: 10.8rem;
    height: 3.2rem;
    margin: 0 auto;
    position: relative;
    .score-pisition {
      width: 10rem;
      border-radius: 0.16rem;
      background: #fff;
      padding-bottom: 0.32rem;
      position: absolute;
      margin: auto;
      left: 0;
      right: 0;
      top: -0.8rem;
      .score-t {
        font-size: 0.44rem;
        color: #333;
        margin-top: 0.72rem;
        .score-num {
          font-size: 0.64rem;
          color: #fa494b;
        }
      }
      .score-li {
        margin: 0.4rem 0.76rem 0 0;
        display: inline-block;
        width: 2.56rem;
        font-size: 0.44rem;
        color: #666;
        padding: 0.96rem 0 0.24rem;
      }
      .score-li-01 {
        position: relative;
        background: url(../../assets/icon_detail.png) 1rem 0.24rem no-repeat;
        background-size: 0.56rem 0.56rem;
      }
      .score-li-02 {
        background: url(../../assets/icon_rank.png) 1rem 0.24rem no-repeat;
        background-size: 0.56rem 0.56rem;
      }
      .score-li-03 {
        background: url(../../assets/icon_center_dui.png) 1rem 0.24rem no-repeat;
        background-size: 0.56rem 0.56rem;
        margin-right: 0;
      }
      // .score-li-01:after {
      //   height: 1.04rem;
      //   content: "";
      //   width: 0.02rem;
      //   border-right: 0.02rem solid #eee;
      //   position: absolute;
      //   bottom: 0;
      //   top: 0;
      //   right: 0.04rem;
      //   margin: auto;
      // }
    }
  }
  .list {
    margin-top: 0.32rem;
    overflow-x: auto;
    .border-bottom {
      position: relative;
    }
    .border-bottom:after {
      height: 1px;
      content: "";
      width: 100%;
      border-bottom: 1px solid #eee;
      position: absolute;
      bottom: 0;
      right: 0;
      transform: scaleY(0.5);
      -webkit-transform: scaleY(0.5);
    }
    .li-bg {
      background: #fff;
      overflow: hidden;
      margin-top: 0.32rem;
    }
    .list-bg {
      display: flex;
      background: #fff;
      height: 2.08rem;
      line-height: 2.08rem;
      float: left;
      &:last-child {
        .left,
        .right {
          display: inline-block;
          width: 4.09rem;
          height: 1.04rem;
          line-height: 1.04rem;
          text-align: left;
          padding-left: 1.28rem;
          color: #333;
          font-size: 0.48rem;
          font-weight: 600;
          border-right: 0;
        }
      }
      .list-click {
        position: relative;
        display: inline-block;
        padding: 0.52rem 0;
      }
      .left,
      .right {
        display: inline-block;
        width: 4.09rem;
        height: 1.04rem;
        line-height: 1.04rem;
        text-align: left;
        padding-left: 1.28rem;
        color: #333;
        font-size: 0.48rem;
        font-weight: 600;
        border-right: 0.02rem #eee solid;
      }
      .high {
        height: 1.34rem !important;
        line-height: 0 !important;
        width: 4.09rem;
        padding-left: 1.28rem;
        /*border-right: 0.02rem #eee solid;*/
        text-align: left;
        .right {
          text-align: left;
          padding-left: 1.28rem;
          color: #333;
          font-size: 0.48rem;
          font-weight: 600;
        }
        .hint {
          font-size: 0.38rem;
          text-align: left;
          color: #999999;
        }
      }
      /*.left {*/
      /*border-right: 0.02rem #eee solid;*/
      /*}*/
      .icon-01 {
        background: url(../../assets/icon_jiekuan.png) 0.48rem 0.26rem no-repeat;
        background-size: 0.48rem 0.48rem;
      }
      .icon-02 {
        background: url(../../assets/icon_increase.png) 0.48rem 0.26rem
          no-repeat;
        background-size: 0.48rem 0.48rem;
      }
      .icon-03 {
        background: url(../../assets/icon_zijin.png) 0.48rem 0.26rem no-repeat;
        background-size: 0.48rem 0.48rem;
      }
      .icon-04 {
        background: url(../../assets/icon_mycenter.png) 0.48rem 0.26rem
          no-repeat;
        background-size: 0.48rem 0.48rem;
      }
      .icon-05 {
        background: url(../../assets/icon_huodong.png) 0.48rem 0.26rem no-repeat;
        background-size: 0.48rem 0.48rem;
      }
      .icon-06 {
        background: url(../../assets/icon_problem.png) 0.48rem 0.26rem no-repeat;
        background-size: 0.48rem 0.48rem;
      }
      .icon-07 {
        background: url(../../assets/icon_merchant.png) 0.48rem 0.26rem
          no-repeat;
        background-size: 0.48rem 0.48rem;
      }
      .icon-08 {
        background: url(../../assets/icon_center_qr.png) 0.48rem 0.26rem
          no-repeat;
        background-size: 0.48rem 0.48rem;
      }
      .icon-09 {
        background: url(../../assets/icon_certificate.png) 0.48rem 0.26rem
          no-repeat;
        background-size: 0.48rem 0.48rem;
      }
    }
    .list-margin-top {
      margin: 0.32rem 0 0 0;
    }
    .list-margin-bottom {
      margin: 0 0 0.32rem 0;
    }
  }
  .service {
    background: #fff;
    text-align: center;
    padding-bottom: 0.36rem;
    margin-top: 0.32rem;
    .service-title {
      font-size: 0.44rem;
      color: #333;
      margin: 0.5rem 0.4rem;
      text-align: left;
    }
    .service-list {
      overflow: auto;
      white-space: nowrap;
      display: flex;
      .service-li {
        display: inline-block;
        text-align: left;
        width: 4.8rem;
        min-width: 4.8rem;
        height: 2.12rem;
        background: #fafafa;
        border-radius: 0.16rem;
        margin-left: 0.24rem;
        .service-stitle {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 0.4rem;
          color: #333;
          margin: 0.48rem 0.4rem 0.2rem 0.4rem;
        }
        .service-phone {
          display: inline-block;
          height: 0.4rem;
          font-size: 0.36rem;
          color: #666;
          padding: 0 0.2rem 0.02rem 0.32rem;
          vertical-align: bottom;
        }
        .icon-phone {
          display: inline-block;
          vertical-align: bottom;
          width: 0.4rem;
          height: 0.4rem;
          background: url(../../assets/icon_phone.png) 0 0 no-repeat;
          background-size: 0.4rem 0.4rem;
        }
      }
    }
  }
  .change-user {
    width: 10.8rem;
    height: 1.44rem;
    line-height: 1.44rem;
    color: #fa494b;
    font-size: 0.4rem;
    background: #fff;
    margin-top: 0.32rem;
  }
}
</style>
