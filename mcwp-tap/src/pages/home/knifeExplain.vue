<template>
  <div class="knife-container">
    <!-- <h2 class="knife-title">怎样获得利率优惠？</h2>
    <p class="knife-content">1、关注微信公众号“潞城农商行”。点击“潞盈人人贷”菜单栏，进入首页。</p>
    <img class="knife-img" src="@/assets/knife_01.png">
    <p class="knife-content">2、点击“好友助力，一砍到底”页面，即可参与。友情提醒，必须申请“潞盈人人贷”，获得额度和利率后才可以参与砍利率的活动。</p>
    <img class="knife-img" src="@/assets/knife_02.png">
    <p class="knife-content">3、点击“砍一刀”即可砍低利率。如果刀数不够，点击“分享”，将链接分享至朋友圈或者微信群，好友助力后即可获得刀数。</p>
    <img class="knife-img" src="@/assets/knife_03.png">
    <p class="knife-content">4、日利率最低可砍至万分之3.5，多多分享吧~</p>
    <img class="knife-img" src="@/assets/knife_04.png"> -->
    <img class="knife-img knife-img-click" @click.prevent="1" src="@/assets/knife_01.png">
    <img class="knife-img" src="@/assets/knife_02.png">
    <img class="knife-img" src="@/assets/knife_03.png">
    <img class="knife-img" src="@/assets/knife_04.png">
  </div>
</template>
<script>
export default {};
</script>
<style lang="less" scoped>
.knife-container {
  width: 10.8rem;
  margin: 0 auto;
  padding-bottom: 1.2rem;
  background: #fff;
  .knife-title {
    width: 9.84rem;
    margin: 0 auto;
    text-align: left;
    font-size: 0.48rem;
    color: #333;
    height: 1.44rem;
    line-height: 1.44rem;
    border-bottom: #ddd 0.02rem solid;
  }
  .knife-content {
    width: 9.84rem;
    margin: 0.48rem auto 0.4rem;
    text-align: left;
    font-size: 0.4rem;
    color: #333;
    line-height: 0.72rem;
  }
  .knife-img-click {
    pointer-events: auto;
  }
  .knife-img {
    // width: 9.84rem;
    // margin: 0 auto 0.24rem;
    width: 10.8rem;
  }
  .condition {
    width: 9.84rem;
    margin: 0.4rem auto 0;
    text-align: left;
    font-size: 0.4rem;
    color: #333;
    line-height: 0.72rem;
  }
  .condition-content {
    width: 9.84rem;
    margin: 0 auto;
    text-align: left;
    font-size: 0.4rem;
    color: #333;
    line-height: 0.72rem;
    padding-bottom: 1.2rem;
  }
}
</style>
