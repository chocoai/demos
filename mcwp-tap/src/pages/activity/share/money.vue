<template>
  <div class="money-container" v-if="scoreData">
    <h2 class="money-title">兑换金额</h2>
    <div class="money-content line-1px-b">
      <span class="money-icon">￥</span>
      <input v-model="money" @input="payMax" class="money-input" type="text" placeholder="1.00-200元">
    </div>
    <div class="money-tip">
      <span >当前积分{{scoreData.totalScore}}个={{scoreData.exchangeMoney}}元，</span>
      <span class="money-all" @click="exchangeAll" v-if="scoreData.totalScore">全部兑换</span>
    </div>
    <Button @click="payBtn" class="money-btn" :class="!money != '' ? 'btn-grey' : 'btn-regain'" type="primary" bottom-action>确认兑换</Button>
    <popup class="money-popup" v-model="show" position="bottom" :overlay="true">
      <div class="popup-title">确认兑换
        <span @click="payClose" class="popup-close"></span>
      </div>
      <h1 class="popup-money">{{(""+money).indexOf(".")?money:`${money}.00`}}元</h1>
      <div class="popup-tip">
        <span class="tip-explain">抵扣说明</span>
        <span class="tip-text">扣除{{(new BigNumber(money).dividedBy(scoreData.proportion)).times(100).toFormat(2)}}个积分抵扣现金红包{{money}}元</span>
      </div>
      <Button @click="postconsumer" class="popup-btn" type="primary" bottom-action>确认</Button>
    </popup>
  </div>
</template>
<script>
import { Popup, Button, Badge, BadgeGroup } from "vant";
import { getConsumerPage, postConsumer } from "@/service/activity.js";
// import { Config } from "../../../utils";
import Router from "@/utils/routerConfig.js";
import { BigNumber } from "bignumber.js";

export default {
  components: {
    Button,
    Popup,
    Badge,
    BadgeGroup
  },
  data() {
    return {
      Router,
      money: null,
      // moneyAll: 190,
      // scoreAll: 0,
      scoreData: null,
      BigNumber: BigNumber,
      show: false
    };
  },
  mounted() {
    this.getConsumerData();
  },
  methods: {
    //获取积分数据
    async getConsumerData() {
      let that = this;
      let res = await getConsumerPage({ giftType: 6 });
      that.scoreData = res.data;
    },
    //红包兑换
    async postconsumer() {
      let money = this.money;
      await postConsumer({ consumerMoney: money, consumerType: 6 });
      this.$router.push(Router.moneysuccess.path);
    },
    //input充值范围
    payMax() {
      const that = this;
      let moneyStr = that.money.toString();
      let strings = moneyStr.indexOf(".") !== -1 ? moneyStr.split(".") : null;
      if (that.money > that.moneyAll) {
        that.money = that.moneyAll;
      } else if (that.money > 200) {
        that.money = 200;
      } else {
        if (that.money < 0) {
          that.money = 0.01;
        } else if (strings && (strings[1].length >= 2 || strings.length > 2)) {
          that.money = Number(
            `${strings[0]}.${strings[1]}`.substring(0, strings[0].length + 3)
          );
        }
      }
    },
    //点击全部兑换
    exchangeAll() {
      this.money = this.scoreData.exchangeMoney;
      this.payMax();
    },
    //点击充值，弹出支付界面
    payBtn() {
      this.show = true;
    },
    //关闭遮罩层
    payClose() {
      this.show = false;
    }
  }
};
</script>
<style lang="less" scoped>
.money-container {
  background: #fff;
  padding-top: 0.64rem;
  width: 10.8rem;
  height: 100vh;
  margin: 0 auto;
  .money-title {
    padding-left: 0.64rem;
    font-weight: normal;
    text-align: left;
    font-size: 0.4rem;
    color: #333;
  }
  .money-content {
    margin-top: 0.68rem;
    padding: 0 0 0.56rem 0.64rem;
    background: #fff;
    text-align: left;
    vertical-align: top;
    white-space: nowrap;
    .money-icon {
      display: inline-block;
      font-size: 1.04rem;
      color: #333;
    }
    .money-input {
      display: inline-block;
      font-size: 1.32rem;
      color: #333;
    }
    .money-input::-webkit-input-placeholder {
      color: #888;
      line-height: 1.32+0.68rem;
      font-size: 0.8rem !important;
    }
  }
  .money-tip {
    text-align: left;
    padding-left: 0.64rem;
    margin-top: 0.48rem;
    font-size: 0.36rem;
    color: #999;
    .money-all {
      font-size: 0.36rem;
      color: #333;
    }
  }
  .money-btn {
    width: 8.4rem;
    height: 1.44rem;
    line-height: 1.44rem;
    margin-top: 1rem;
    border-radius: 0.72rem;
  }
  .btn-grey {
    background: #ccc;
    pointer-events: none;
  }
  .btn-regain {
    background: #fa494b;
    pointer-events: auto;
  }
  .money-popup {
    padding-bottom: 1rem;
    .popup-title {
      font-size: 0.48rem;
      color: #333;
      height: 1.44rem;
      line-height: 1.44rem;
      position: relative;
      .popup-close {
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0.16rem;
        margin: auto;
        padding: 0.28rem;
        width: 0.4rem;
        height: 0.4rem;
        background: url(../../../assets/icon_close_share.png) 0.28rem 0.28rem
          no-repeat;
        background-size: 0.4rem 0.4rem;
      }
    }
    .popup-title:after {
      height: 1px;
      content: "";
      width: 100%;
      border-bottom: 1px solid #dcdcdc;
      position: absolute;
      bottom: 0;
      right: 0;
      transform: scaleY(0.5);
      -webkit-transform: scaleY(0.5);
    }
    .popup-money {
      font-size: 1.04rem;
      color: #333;
      margin-top: 0.8rem;
    }
    .popup-tip {
      display: flex;
      justify-content: space-between;
      padding: 0 0.48rem;
      margin-top: 1.04rem;
      .tip-explain {
        font-size: 0.44rem;
        color: #666;
      }
      .tip-text {
        font-size: 0.44rem;
        color: #333;
      }
    }
    .popup-btn {
      color: #fff;
      font-size: 0.48rem;
      width: 8.4rem;
      height: 1.44rem;
      line-height: 1.44rem;
      background: #fa494b;
      border-radius: 0.72rem;
      margin-top: 1.2rem;
    }
  }
}
</style>
