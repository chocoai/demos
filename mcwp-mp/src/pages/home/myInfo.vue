<template>
  <div class="myinfo-container">
    <ul class="info">
      <li class="info-list border">
        <span class="info-title">姓名</span>
        <span class="info-detail">{{meInfo.name || "暂无信息"}}</span>
      </li>
      <li class="info-list border">
        <span class="info-title">手机号</span>
        <span class="info-detail">{{meInfo.telephone || "暂无信息"}}</span>
      </li>
      <li class="info-list">
        <span class="info-title">实名认证</span>
        <span class="info-detail">{{meInfo.hasAuthentication ? "已认证" : "暂未认证"}}</span>
      </li>
      <li class="info-list info-bank">
        <span class="info-title">银行卡号</span>
        <span class="info-detail">{{meInfo.bankCard || "暂无信息"}}</span>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: 'myInfo'
  }
</script>

<style lang="less" scoped>
  .myinfo-container {
    width: 10.8rem;
    height: 100%;
    margin: 0 auto;
    padding-top: 0.32rem;
    background: #fafafa;
    .info-list {
      display: flex;
      justify-content: space-between;
      width: 10.32rem;
      height: 1.2rem;
      background: #fff;
      padding-left: 0.48rem;
      .info-title {
        font-size: 0.44rem;
        color: #333;
        line-height: 1.2rem;
      }
      .info-detail {
        font-size: 0.4rem;
        color: #666;
        line-height: 1.2rem;
        padding-right: 0.72rem;
      }
    }
    .info-bank {
      margin-top: 0.32rem;
    }
    .border {
      border-bottom: 0.01rem solid #eee;
    }
  }
</style>
