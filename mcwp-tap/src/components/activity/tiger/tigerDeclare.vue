<template>
  <div class="back" @click="$emit('clickBackground')">
    <div class="blue-back" @click.stop="">
      <div class="message-back">
        <div class="shake-title">活动说明</div>
        <div class="sub-title">一、活动时间</div>
        <div class="desc-content">{{date}}</div>
        <div class="sub-title">二、活动说明</div>
        <p class="desc-content">{{rule.activityDesc}}</p>
        <div class="sub-title">三、活动奖品</div>
        <div class="desc-content">{{rule.jigsawPrizes.join('、')}}</div>
        <div class="sub-title">四、主办方</div>
        <div class="qrcode-back">
          <img :src="rule.qrcodeUrl" class="qrcode-img" alt="qrcode" @click.prevent="1"/>
          <p class="qrcode-message">长按识别二维码<br />关注公众号</p>
        </div>
        <div class="shake-rights">本活动解释权归主办方所有</div>
      </div>
    </div>
  </div>
</template>

<script>
import { formatDateTime } from "../../../utils";
export default {
  name: "shakeDeclare",
  props: ["rule"],
  data() {
    return {
      date: `${formatDateTime(
        this.rule.activityDate.split(",")[0] - 0
      )}至${formatDateTime(this.rule.activityDate.split(",")[1] - 0)}`
    };
  }
};
</script>

<style lang="less" scoped>
.back {
  top: 0;
  left: 0;
  right: 0;
  /*min-height: 100vh;*/
  /*height: 100vh;*/
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  position: fixed;
  z-index: 1400;
  .blue-back {
    margin: 1.44rem 0.8rem auto;
    border: #161235 solid 0.1rem;
    border-radius: 0.08rem;
    background-color: #bae0fd;
    padding: 0.28rem;
    .message-back {
      overflow-y: scroll;
      border: #161235 solid 0.1rem;
      border-radius: 0.08rem;
      margin: 0;
      height: 100%;
      max-height: 70vh;
      background-color: #fff;
      padding: 0.64rem 0.48rem 0.48rem;
      .shake-title {
        color: #161235;
        font-size: 0.48rem;
        font-weight: bold;
        margin: 0 auto;
      }
      .sub-title {
        color: #161235;
        font-size: 0.4rem;
        font-weight: bold;
        margin-top: 0.64rem;
        margin-left: 0;
        text-align: left;
      }
      .desc-content {
        color: #161235;
        font-size: 0.36rem;
        margin-top: 0.4rem;
        line-height: 0.6rem;
        margin-left: 0;
        margin-right: 0;
        text-align: left;
        /*word-wrap: break-word;*/
      }
      .qrcode-back {
        margin-top: 0.4rem;
        width: 100%;
        height: 1.6rem;
        align-items: center;
        display: flex;
        .qrcode-img {
          margin-left: 0;
          width: 1.6rem;
          height: 1.6rem;
          pointer-events: auto;
          float: left;
        }
        .qrcode-message {
          font-size: 0.36rem;
          color: #161235;
          margin-left: 0.24rem;
          text-align: left;
        }
      }
      .shake-rights {
        font-size: 0.36rem;
        color: #161235;
        margin: 0.64rem auto 0;
      }
    }
  }
}
</style>
