<template>
    <div class="bankDot-container">
      <div v-if="branchList && branchList.length">
        <div class="bankDot-content" v-for="(item, index) in branchList" :key="index">
          <p class="bankDot-title font-40">{{item.bankName}}</p>
          <p class="bankDot-address font-36">{{item.bankAddress}}</p>
          <a class="bankDot-iphone font-36" :href="`tel:${item.bankPhone}`">{{item.bankPhone}}</a>
          <p class="bankDot-time font-36">{{`${item.startTime}-${item.endTime}`}}</p>
        </div>
      </div>
      <v-blank style="height: 100%" v-else>没有网点</v-blank>
    </div>
</template>

<script>
import VBlank from '../blank'

export default {
  components: {
    VBlank
  },
  props: ['branchList']
}
</script>


<style lang="less" scoped>
.bankDot-container {
  width: 10.2rem;
  // position: absolute;
  // left: 0;
  // right: 0;
  // top: 0;
  // bottom: 0;
  margin: 0.3rem auto;
  .bankDot-content + .bankDot-content {
    margin-top: 0.3rem;
  }
  .bankDot-content {
    width: 9.6rem;
    background: #fff;
    padding-left: 0.6rem;
    padding-bottom: 0.4rem;
    position: relative;
    border-radius: 0.3rem;
    .bankDot-title {
      color: #2f2f2f;
      padding: 0.425rem 0;
      position: relative;
    }
    .bankDot-title:after {
      content: " ";
      position: absolute;
      left: 0;
      bottom: 0;
      right: 0;
      height: 1px;
      border-bottom: 1px solid #e5e5e5;
      color: #e5e5e5;
      -webkit-transform-origin: 0 100%;
      transform-origin: 0 100%;
      -webkit-transform: scaleY(0.5);
      transform: scaleY(0.5);
      width: 9.6rem;
    }
    .bankDot-iphone {
      background: url(../../assets/account-manager-iphone.png) no-repeat 0 center;
      background-size: 0.34rem 0.34rem;
      display: block;
      padding-left: 0.64rem;
      color: #545454;
      margin-top: 0.5rem;
    }
    .bankDot-address::after {
      content: "";
      position: absolute;
      width: 0.34rem;
      height: 0.34rem;
      background-size: 0.34rem 0.34rem;
      right: 0.54rem;
      top: 0.1rem;
    }
    .bankDot-address {
      background: url(../../assets/account-manager-address.png) no-repeat 0 center;
      background-size: 0.34rem 0.34rem;
      padding-left: 0.64rem;
      color: #545454;
      margin-top: 0.42rem;
      position: relative;
    }
    .bankDot-time {
      background: url(../../assets/account-manager-time.png) no-repeat 0 center;
      background-size: 0.34rem 0.34rem;
      padding-left: 0.64rem;
      color: #545454;
      margin-top: 0.42rem;
    }
  }
}
</style>
