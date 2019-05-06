<template>
  <div class="activity-puzzle-containr">
    <div class="outer">
      <div class="inner">
        <!-- 闯关成功 -->
        <div v-if="nextBtn">
          <p class="describe">恭喜你，闯关成功</p>
          <img class="img" @click.prevent="$emit('startNext')" src="../../../assets/activity/puzzle/result-next.png" alt="next">
        </div>
        <!-- 闯关失败 -->
        <div v-if="repeatBtn">
          <p class="describe">sorry！闯关失败</p>
          <p class="describe">邀请好友来拼图吧</p>
          <img class="img" @click.prevent="$emit('reStart')" src="../../../assets/activity/puzzle/result-again.png" alt="again">
          <img class="img" @click.prevent="$emit('showShare')" src="../../../assets/activity/puzzle/result-share.png" alt="share">
        </div>
        <!-- 通关没中奖 -->
        <div v-if="finishBtn && !prizeName">
          <p class="describe">恭喜你，闯关成功</p>
          <p class="describe">可惜与奖品擦肩而过</p>
          <p class="describe">邀请好友来拼图吧</p>
          <img class="img" @click.prevent="$emit('reStart')" src="../../../assets/activity/puzzle/result-again.png" alt="again">
          <img class="img" @click.prevent="$emit('showShare')" src="../../../assets/activity/puzzle/result-share.png" alt="share">
        </div>
        <!-- 通关且中奖 -->
        <div v-if="finishBtn && prizeName">
          <p class="describe">恭喜你，闯关成功</p>
          <p class="describe">恭喜获得{{prizeName}}</p>
          <img class="prize" src="../../../assets/activity/puzzle/img-prize.png" alt="prize">
          <p class="tip">（每人只有一次领奖机会，再来一局将放弃本次奖品）</p>
          <img class="img" @click.prevent="$emit('receive')" src="../../../assets/activity/puzzle/result-prize.png" alt="receive">
          <img class="img" @click.prevent="$emit('reStart')" src="../../../assets/activity/puzzle/result-again.png" alt="again">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["nextBtn", "repeatBtn", "finishBtn", "prizeName", "chance"],
  data() {
    return {};
  }
};
</script>

<style lang="less" scoped>
.activity-puzzle-containr {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  z-index: 1000;
  .outer {
    margin: 3rem auto;
    width: 8.24rem;
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
    box-sizing: border-box;
    padding: 1.6rem 0.44rem 0.8rem;
    border: 0.06rem solid #1a0009;
  }
  .describe {
    font-size: 0.48rem;
    font-weight: bold;
    line-height: 0.72rem;
  }
  .img {
    width: 3.12rem;
    height: 1.2rem;
    margin-top: 0.96rem;
    pointer-events: auto;
  }
  .img + .img {
    margin-left: 0.4rem;
  }
  .prize {
    width: 2.92rem;
    height: 2.92rem;
    display: block;
    margin: auto;
  }
  .tip {
    font-size: 0.4rem;
    line-height: 0.4rem;
    font-weight: bold;
    line-height: 0.72rem;
    margin: 0.64rem 0 -0.48rem;
  }
}
</style>
