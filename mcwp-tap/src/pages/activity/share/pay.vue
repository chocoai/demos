<template>
  <div class="pay-container">
    <div class="pay-phone line-1px-b">
      <field maxlength="11" @input="blurVerify" class="pay-input" v-model="phone" type="tel" placeholder="请输入或选择号码" />
      <span v-if="phoneError" class="pay-tip">请填写正确的手机号</span>
      <!-- <span v-else class="pay-location">{{location}}</span> -->
      <img class="pay-icon" @click="clear" :src="!phone ? require('@/assets/icon_user.png') : require('@/assets/icon_clear.png')">
    </div>
    <badge-group :active-key="activeKey">
      <badge  :class="!itemmoney.canSelect || phoneError ? 'badge-grey' : 'badge-regain'" v-for="(itemmoney, indexmoney) in consumerdata" :key="indexmoney" :title="consumerdata && itemmoney.consumerMoneyText" :disabled="!itemmoney.canSelect" @click="onClick" :info="'需' + itemmoney.score + '个积分'"/>
    </badge-group>
    <Button @click="payBtn" class="pay-btn" :class="phoneError ? 'btn-grey' : 'btn-regain'" type="primary" bottom-action>确认充值</Button>
    <popup class="pay-popup" v-model="show" position="bottom" :overlay="true">
      <div :disabled="phoneError" class="popup-title">确认充值
        <span @click="payClose" class="popup-close"></span>
      </div>
      <h1 class="popup-money">{{moneypay}}.00元</h1>
      <div class="popup-tip">
        <span class="tip-explain">抵扣说明</span>
        <span class="tip-text">扣除{{score}}个积分抵扣话费{{moneypay}}元</span>
      </div>
      <Button @click="postconsumer" class="popup-btn" type="primary" bottom-action>确认支付</Button>
    </popup>
  </div>
</template>
<script>
import { Popup, Button, Field, Badge, BadgeGroup } from "vant";
import { isTelephone } from "@/utils";
import Router from "@/utils/routerConfig.js";
import { getConsumerPage, postConsumer } from "@/service/activity.js";
import { Config } from "../../../utils";
export default {
  components: {
    Field,
    Badge,
    BadgeGroup,
    Button,
    Popup
  },
  data() {
    return {
      Router,
      phone: "",
      location: "",
      activeKey: "",
      moneypay: 0,
      score: 0,
      payid: 0,
      phoneError: false,
      show: false,
      consumerdata: []
    };
  },
  mounted() {
    this.getConsumerData();
  },
  methods: {
    async getConsumerData() {
      let res = await getConsumerPage({ giftType: 1 });
      this.phone = res.data.telephone;
      this.consumerdata = res.data.shareConsumerConfigDTOS;
    },
    //话费充值
    async postconsumer() {
      let phone = this.phone,
        payid = this.payid;
      await postConsumer({
        consumerMoney: payid,
        telephone: phone,
        consumerType: 1
      });
      this.$router.push(Router.paysuccess.path);
    },
    clear() {
      if (this.phone) {
        this.phone = "";
      }
    },
    //失去光标验证手机
    blurVerify() {
      let phone = this.phone;
      if (!isTelephone(phone)) {
        this.activeKey = "";
        this.phoneError = true;
      } else {
        //验证手机归属地
        this.location = "zhejiangyidong";
        this.phoneError = false;
      }
    },
    //选择充值金额
    onClick(key) {
      if (this.phoneError) {
        return false;
      } else {
        this.activeKey = key;
        this.moneypay = parseInt(this.consumerdata[key].consumerMoneyText);
        this.score = this.consumerdata[key].score;
        this.payid = this.consumerdata[key].consumerMoney;
      }
    },
    //点击充值弹出支付界面
    payBtn() {
      const that = this;
      let phone = this.phone;
      if (isTelephone(phone) && this.activeKey !== "") {
        this.show = true;
      } else {
        that.$toast(Config.toast.nullPayMoney);
        this.payClose();
      }
    },
    //关闭遮罩层
    payClose() {
      this.show = false;
    }
  }
};
</script>
<style lang="less">
.pay-container {
  width: 10.8rem;
  height: 100vh;
  margin: 0 auto;
  background: #fff;
  .pay-phone {
    position: relative;
    height: 1.96rem;
    .pay-input {
      position: absolute;
      top: 0;
      left: 0;
      .van-field__control {
        font-size: 0.72rem;
        color: #333;
        caret-color: #aaa;
      }
    }
    .pay-location,
    .pay-tip {
      position: absolute;
      top: 1.32rem;
      left: 0.4rem;
      color: #888;
      font-size: 0.32rem;
    }
    .pay-tip {
      color: #fa494b;
    }
    .pay-icon {
      pointer-events: auto;
      display: inline-block;
      height: 0.72rem;
      width: 0.72rem;
      padding: 0.24rem;
      position: absolute;
      top: 0.16rem;
      right: 0.08rem;
    }
  }
  .pay-btn {
    width: 8.4rem;
    height: 1.44rem;
    line-height: 1.44rem;
    border-radius: 0.72rem;
    margin-top: 0.8rem;
    font-size: 0.48rem;
    color: #fff;
  }
  .btn-grey {
    background: #ccc;
    pointer-events: none;
  }
  .btn-regain {
    background: #fa494b;
    pointer-events: auto;
  }
  .van-badge-group {
    display: flex;
    width: 10.8rem;
    margin: 0 auto;
    padding-top: 0.32rem;
    flex-direction: row;
    flex-wrap: wrap;
  }
  .van-badge-group::after {
    border: 0;
  }
  .van-badge {
    border: 1px solid #aaa;
    border-radius: 0.24rem;
    background-color: #fff;
    display: inline-block;
    width: 3.12rem;
    height: 1.68rem;
    font-size: 0.48rem;
    color: #333;
    margin: 0.32rem 0 0 0.36rem;
    padding: 0.36rem 0.12rem 0.84rem;
  }
  .badge-grey {
    pointer-events: none;
    color: #999;
    border-color: #ddd;
    .van-badge__info {
      color: #999;
    }
  }
  .badge-regain {
    pointer-events: auto;
    color: #333;
    border-color: #aaa;
    .van-badge__info {
      color: #666;
    }
  }
  .van-badge--select {
    color: #fa494b;
    border-color: #fa494b;
    font-weight: 400;
    .van-badge__info {
      color: #fa494b;
    }
  }
  .van-badge__info {
    height: 0.72rem;
    top: 0.98rem;
    right: 0;
    left: 0;
    margin: 0 auto;
    font-size: 0.32rem;
    color: #666;
    background: transparent;
  }
  .van-cell:not(:last-child)::after {
    border-bottom-width: 0;
  }
  .pay-popup {
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
