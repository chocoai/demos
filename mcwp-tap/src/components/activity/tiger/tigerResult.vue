<template>
  <div class="back" @click="$emit('clickBackground')">
    <div class="blue-back" @click.stop="">
      <div class="message-back">
        <div class="big-title" v-if="shakeType != '3'">{{shakeType == '1' ? '恭喜你' : '很抱歉'}}</div>
        <div class="small-title" v-if="shakeType == '1' || shakeType == '3'">{{shakeType == '1' ? '获得奖品' : (prizeType == '1' ? '奖品领取成功':'积分已到帐中')}}</div>
        <div class="message">{{shakeType == '1' ? message : (shakeType == '2' ? '你什么都没有获得!' : (prizeType == '1' ? '请耐心等待相关人员联系!':'请在"个人中心"-"积分兑换"\n进行兑换')) }}</div>
        <div class="share-tip" v-if="(showShareTips == '0' || shakeType == '1')">{{shakeType == '1' ? '(每人只有一次领奖机会)' : '分享好友获取额外机会'}}</div>
        <img class="single-button" v-if="shakeType == '3'" :src="prizeType == '1' ? require('@/assets/btn_deter.png') : require('@/assets/activity/tiger/tiger-exchange.png')" alt="deter" @click.prevent="singleBtnAction"/>
        <img class="left-button" v-if="shakeType == '2' || (shakeType == '1' && prizeType == '1')" :src="shakeType == '1' ? require('@/assets/btn_reward.png') : (leftBtnType ? require('@/assets/btn_oncemore.png') : require('@/assets/btn_deter.png'))" alt="reward" @click.prevent="leftBtnAction"/>
        <img class="right-button" v-if="shakeType == '2' || (shakeType == '1' && prizeType == '1')" src="@/assets/btn_share.png" alt="share" @click.prevent="$emit('clickShare')"/>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "shakeResult",
  // props: {
  //   shakeType: '1',  // 1 中奖  2 未中奖  3 领取奖品
  //   message: null,    //中奖内容提示信息
  //   showShareTips // 0可以分享   1 不可以分享
  //   leftBtnType: false  //分享好友获得额外机会是否显示
  //   prizeType   // 1 线下  2  线上
  // }
  props: ["shakeType", "message", "showShareTips", "leftBtnType", "prizeType"],
  methods: {
    leftBtnAction() {
      if (this.shakeType == "1") {
        this.$emit("clickReward");
      } else if (this.shakeType == "2") {
        if (this.leftBtnType === true) {
          this.$emit("clickOnceMore");
        } else {
          this.$emit("clickConfirm");
        }
      }
    },
    singleBtnAction() {
      if (this.prizeType == "1") {
        this.$emit("clickConfirm");
      } else {
        this.$emit("clickExchange");
      }
    }
  }
};
</script>

<style lang="less" scoped>
.back {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  /*min-height: 100vh;*/
  /*height: 100vh;*/
  background: rgba(0, 0, 0, 0.8);
  position: fixed;
  z-index: 1000;
  .blue-back {
    margin: 2.8rem 0.8rem auto;
    border: #161235 solid 0.1rem;
    border-radius: 0.08rem;
    background-color: #bae0fd;
    padding: 0.28rem;
    .message-back {
      overflow: hidden;
      border: #161235 solid 0.1rem;
      border-radius: 0.08rem;
      margin: 0;
      background-color: #fff;
      .big-title {
        color: #da2b3c;
        font-size: 0.96rem;
        display: flex;
        justify-content: center;
        margin-top: 0.96rem;
        font-weight: bold;
        letter-spacing: 0.2rem;
      }
      .small-title {
        color: #161235;
        font-size: 0.56rem;
        display: flex;
        justify-content: center;
        margin-top: 0.96rem;
        font-weight: bold;
        letter-spacing: 0.05rem;
      }
      .message {
        color: #161235;
        font-size: 0.56rem;
        display: flex;
        justify-content: center;
        margin-top: 0.28rem;
        font-weight: bold;
        letter-spacing: 0.05rem;
      }
      .share-tip {
        color: #161235;
        font-size: 0.48rem;
        display: flex;
        justify-content: center;
        margin-top: 1.2rem;
        letter-spacing: 0.1rem;
      }
      .single-button {
        height: 1.4rem;
        margin: 1.52rem auto 0.48rem;
        pointer-events: auto;
      }
      .left-button {
        margin: 0.64rem auto 0.48rem 0.48rem;
        height: 1.4rem;
        float: left;
        pointer-events: auto;
      }
      .right-button {
        margin: 0.64rem 0.48rem 0.48rem auto;
        height: 1.4rem;
        float: right;
        pointer-events: auto;
      }
    }
  }
}
</style>
