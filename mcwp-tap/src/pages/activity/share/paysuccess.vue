<template>
  <div class="success-container">
    <img class="success-img" src="@/assets/img_s.png">
    <h2 class="success-title">支付成功</h2>
    <span class="success-tip">话费预计在30分钟内到账，请注意查收</span>
    <p class="close-time">关闭（{{times}}s）</p>
  </div>
</template>
<script>
import Router from "@/utils/routerConfig.js";
export default {
  data() {
    return {
      Router,
      times: 5
    };
  },
  destroyed() {
    if (this.timer) clearInterval(this.timer);
  },
  mounted() {
    this.closeTime();
  },
  methods: {
    closeTime() {
      const that = this;
      that.times = 5;
      that.timer = setInterval(() => {
        that.times--;
        if (that.times === -1) {
          that.times = 0;
          clearInterval(that.timer);
          this.$router.push(Router.invite.path);
        }
      }, 1000);
    }
  }
};
</script>
<style lang="less" scoped>
.success-container {
  width: 10.8rem;
  margin: 0 auto;
  padding-bottom: 0.4rem;
  background: #fff;
  .success-img {
    width: 2rem;
    height: 2rem;
    margin-top: 0.8rem;
  }
  .success-title {
    font-size: 0.5rem;
    color: #333;
    margin-top: 0.64rem;
  }
  .success-tip {
    font-size: 0.4rem;
    color: #888;
    margin-top: 0.32rem;
  }
  .close-time {
    width: 4rem;
    font-size: 0.4rem;
    color: #666;
    margin: 0.44rem auto 0;
    padding: 0.36rem 0 0.4rem;
  }
}
</style>
