<template>
  <div class="activity-winnerRes-containr">
    <div class="outer">
      <div class="inner">
        <img class="close" @click.prevent="$emit('showReceived')" src="../../../assets/activity/puzzle/puzzle-rule-close.png" alt="close" />
        <p v-if="prizeType=='1'" class="describe">奖品领取成功<br />请耐心等待相关人员联系您！</p>
        <p v-if="prizeType!='1'" class="describe">积分已到帐中<br />请在"个人中心"-"积分兑换"<br />进行兑换</p>
        <img class="img" v-if="prizeType!= '1'" src="../../../assets/activity/puzzle/puzzle-exchange.png" @click.prevent="$emit('clickExchange')" alt="exchange"/>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["prizeType"]
};
</script>

<style lang="less" scoped>
.activity-winnerRes-containr {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  // z-index: 1200;
  .outer {
    margin: 5rem auto;
    width: 8.24rem;
    box-sizing: border-box;
    // height: 10rem;
    padding: 0.24rem;
    background-color: #f4cf06;
    border: 0.06rem solid #1a0009;
  }
  .inner {
    position: relative;
    background-color: #fee556;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 1.6rem 0.44rem 1.6rem;
    border: 0.06rem solid #1a0009;
  }
  .describe {
    font-size: 0.48rem;
    font-weight: bold;
    line-height: 0.72rem;
  }
  .close {
    position: absolute;
    right: 0.24rem;
    top: 0.24rem;
    width: 0.72rem;
    height: 0.72rem;
    pointer-events: auto;
  }
  .img {
    width: 3.12rem;
    height: 1.2rem;
    margin-top: 0.96rem;
    pointer-events: auto;
  }
}
</style>
