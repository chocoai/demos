<template>
  <div class="puzzle-rule-container">
    <div class="wrapper">
      <div class="inner">
        <p class="title">一、活动时间</p>
        <p class="content">{{date}}</p>
        <p class="title">二、活动说明</p>
        <p class="content">{{rule.activityDesc}}</p>
        <p class="title">三、活动奖品</p>
        <p class="content">{{rule.jigsawPrizes.join('、')}}</p>
        <p class="title">四、主办方</p>
        <div class="sponsor-wrapper">
          <img class="sponsor" @click.prevent="1" :src="rule.qrcodeUrl" alt="rule">
          <p class="follow">长按识别二维码<br />关注公众号</p>
        </div>
        <p class="right-explain">本活动解释权归主办方所有</p>
        <img class="close" @click.prevent="$emit('hide')" src="../../../assets/activity/puzzle/puzzle-rule-close.png" alt="close">
      </div>
    </div>
  </div>
</template>

<script>
import { formatDateTime } from "../../../utils";

export default {
  props: ["rule"],
  data() {
    return {
      date: `${formatDateTime(
        this.rule.activityDate.split(",")[0] - 0
      )}至${formatDateTime(this.rule.activityDate.split(",")[1] - 0)}`
    };
  },
  mounted() {}
};
</script>

<style lang="less" scoped>
.puzzle-rule-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  // bottom: 0;
  min-height: 100vh;
  z-index: 1400;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.8);
  // background: url(../../../assets/puzzle_bg.png) no-repeat top left;
  // background-size: 100%;
  .wrapper {
    margin: 1.92rem auto;
    width: 9.84rem;
    box-sizing: border-box;
    // height: 10rem;
    padding: 0.24rem;
    background-color: #f4cf06;
    border: 0.06rem solid #1a0009;
  }
  .inner {
    background-color: #fee556;
    width: 100%;
    height: 100%;
    max-height: 60vh;
    overflow-y: scroll;
    position: relative;
    box-sizing: border-box;
    padding: 1rem 0.64rem 0.48rem;
    border: 0.06rem solid #1a0009;
  }
  .prize {
    margin-bottom: 0.8rem;
    font-size: 0.56rem;
    color: #441314;
  }
  .title {
    text-align: left;
    font-size: 0.4rem;
    line-height: 0.4rem;
    margin-top: 0.6rem;
    font-weight: bold;
    color: #441314;
  }
  .content {
    text-align: left;
    font-size: 0.36rem;
    margin-top: 0.2rem;
    line-height: 0.36rem;
    color: #441314;
  }
  .right-explain {
    font-size: 0.36rem;
    line-height: 0.36rem;
    color: #441314;
    margin-top: 0.64rem;
  }
  .close {
    position: absolute;
    top: 0.36rem;
    right: 0.36rem;
    width: 0.72rem;
    height: 0.72rem;
    pointer-events: auto;
  }
  .sponsor-wrapper {
    display: flex;
    align-items: center;
    margin-top: 0.2rem;
  }
  .sponsor {
    width: 1.6rem;
    height: 1.6rem;
    pointer-events: auto;
  }
  .follow {
    text-align: left;
    font-size: 0.36rem;
    line-height: 0.48rem;
    color: #441314;
    margin-left: 0.24rem;
  }
}
</style>
