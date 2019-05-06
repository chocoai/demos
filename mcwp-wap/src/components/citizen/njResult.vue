<template>
  <div class="result-back" v-if="prefixUrl" :style="{background: `url(${prefixUrl}product/result/bg_apply_result.png) no-repeat #f04b45`, backgroundSize: '100% auto'}">
    <p class="success-title">额度申请中</p>
    <p class="success-subtitle">请等候短信通知</p>
    <img v-if="prefixUrl" :src="`${prefixUrl}product/result/img_red_activity.png`" alt="activity" class="activity-back"/>
    <ul class="ul-back" v-if="branchList && branchList.length">
      <li class="li-back" v-for="(item, index) in branchList" :key="index">
        <p class="bank-name">{{item.bankName}}</p>
        <div class="single-line"></div>
        <div class="content-back">
          <img src="../../assets/njResult/icon_location.png" class="icon"/>
          <span class="content-desc">{{item.bankAddress}}</span>
        </div>
        <div class="content-back">
          <img src="../../assets/njResult/icon_phone.png" class="icon"/>
          <a class="content-desc" :href="`tel:${item.bankPhone}`">{{item.bankPhone}}</a>
        </div>
        <div class="content-back">
          <img src="../../assets/njResult/icon_time.png" class="icon"/>
          <span class="content-desc">{{`${item.startTime}-${item.endTime}`}}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    props: ['branchList', 'prefixUrl']
  }
</script>

<style lang="less" scoped>
  .result-back {
    top: 0;
    left: 0;
    /*right: 0;*/
    /*bottom: 0;*/
    width: 100%;
    // height: 100vh;
    /*background: url('../../assets/njResult/bg_apply_result.png') no-repeat ;*/
    background-color: #f04b45;
    min-height: 100vh;
    position: absolute;
    .success-title {
      margin-top: 1.12rem;
      left: 0;
      width: 100%;
      text-align: center;
      font-size: 0.56rem;
      color: #480817;
      font-weight: bold;
    }
    .success-subtitle {
      margin-top: 0.28rem;
      left: 0;
      width: 100%;
      text-align: center;
      font-size: 0.36rem;
      color: #480817;
    }
    .activity-back {
      margin: 0.72rem auto 0;
      border-radius: 0.2rem;
      /*background: url("../../assets/njResult/img_red_activity.png") no-repeat;*/
      width: 9.68rem;
      height: 8.96rem;
      background-size: cover;
      display: block;
      pointer-events: auto;
      background-repeat: no-repeat;
    }
    .ul-back {
      margin: 0.8rem auto 0;
      width: 9.68rem;
      .li-back {
        width: 9.68rem;
        border-radius: 0.2rem;
        background-color: #fff0d9;
        padding-bottom: 0.64rem;
        padding-top: 0.48rem;
        position: relative;
        margin-bottom: 0.24rem;
        .bank-name {
          font-size: 0.4rem;
          color: #333;
          margin-left: 0.56rem;
        }
        /*.distance {*/
          /*font-size: 0.4rem;*/
          /*color: #333;*/
          /*right: 0.56rem;*/
          /*top: 0.48rem;*/
          /*position: absolute;*/
        /*}*/
        .single-line {
          background-color: #aaa;
          height: 1px;
          margin-top: 0.48rem;
          margin-left: 0.48rem;
          width: 9.2rem;
        }
        .content-back {
          margin-top: 0.48rem;
          width: 100%;
          .icon {
            width: 0.36rem;
            height: 0.36rem;
            margin-top: 0;
            margin-left: 0.56rem;
          }
          .content-desc {
            font-size: 0.36rem;
            color: #444;
            margin-left: 0.24rem;
          }
        }
      }
    }
  }
</style>
