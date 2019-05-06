<template>
  <div :class="['puzzle-received-container',{'bg-tiger':isTiger}]">
    <div class="empty"></div>
    <div :class="['wrapper',{'color-tiger':isTiger}]">
      <div class="inner">
        <p class="prize">{{userPrize.prizeName}}</p>
        <p class="title">姓名</p>
        <p class="content">{{userPrize.userName}}</p>
        <p class="title">联系方式</p>
        <p class="content">{{userPrize.userPhone}}</p>
        <p class="title">联系地址</p>
        <p class="content">{{userPrize.userAddress}}</p>
        <p class="title">兑奖期限</p>
        <p class="content">{{date}}</p>
        <div class="received-wrapper">
          <img class="received" src="../../../assets/activity/puzzle/img-received.png" alt="received">
        </div>
      </div>
    </div>
    <slot></slot>
  </div>
</template>

<script>
import { formatDateTime } from "../../../utils";

export default {
  props: ["userPrize", "is-tiger"],
  data() {
    return {
      date: ""
    };
  },
  mounted() {
    this.date =
      this.userPrize.prizeDate &&
      `${formatDateTime(
        this.userPrize.prizeDate.split(",")[0] - 0
      )}至${formatDateTime(this.userPrize.prizeDate.split(",")[1] - 0)}`;
  }
};
</script>

<style lang="less" scoped>
.puzzle-received-container {
  min-height: 100vh;
  height: 100vw;
  z-index: 1300;
  position: absolute;
  background-size: 100%;
  left: 0;
  top: 0;
  right: 0;
  padding: 0 0.56rem;
  background: url(../../../assets/puzzle_bg.png) no-repeat top left;
  &.bg-tiger {
    background: url(../../../assets/activity/tiger/img-bg.png) no-repeat top
      left !important;
    background-size: cover !important;
    position: static !important;
  }
  .empty {
    height: 1.92rem;
  }
  .wrapper {
    margin: 0 auto;
    width: 9.84rem;
    box-sizing: border-box;
    // height: 10rem;
    padding: 0.24rem;
    background-color: #f4cf06;
    border: 0.06rem solid #1a0009;
    &.color-tiger {
      background-color: #bae0fd !important;
    }
  }
  .inner {
    background-color: #fff;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 0.8rem 0.52rem 0.56rem;
    border: 0.06rem solid #1a0009;
  }
  .prize {
    margin-bottom: 0.8rem;
    font-size: 0.56rem;
    color: #441314;
  }
  .title {
    text-align: left;
    font-size: 0.36rem;
    line-height: 0.48rem;
    font-weight: bold;
    color: #888;
  }
  .content {
    text-align: left;
    font-size: 0.4rem;
    line-height: 0.64rem;
    color: #441314;
  }
  .received-wrapper {
    display: flex;
    flex-direction: row-reverse;
  }
  .received {
    width: 2rem;
    height: 1.5rem;
    display: block;
    text-align: right;
    margin-top: 1rem;
    margin-right: 0.64rem;
  }
}
</style>
