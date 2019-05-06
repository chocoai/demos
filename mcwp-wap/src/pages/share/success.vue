<template>
  <div class="share-success">
    <img class='share-success-bg' src='./../../assets/img_submit-successfully.png' />
    <p class="success-title font-44">提现成功</p>
    <p class="success-content font-32">我们将佣金以红包的形式发送给您</p>
    <p class="success-content font-32">请注意查收!</p>
    <p class="success-back font-32" @click="back">返回</p>
  </div>
</template>

<script>
import Config from '../../config/index'
import VButton from './../../components/button'

export default {
  components: {
    VButton
  },
  methods: {
    back () {
      this.$router.push(Config.constants.personalRouter)
    }
  }
}
</script>

<style lang="less" scoped>
  .share-success {
    background: #fff;
    padding: .8rem 0;
    .share-success-bg {
      width: 2rem;
      height: 2rem;
      display: block;
      margin: 0 auto;
    }
    .success-title {
      text-align: center;
      margin-top: .64rem;
      color: #333;
    }
    .success-content {
      text-align: center;
      margin-top: .4rem;
      color: #888;
    }
    .success-back {
      text-align: center;
      margin-top: .5rem;
      padding: .2rem;
      color: #369fff;
    }
  }
</style>
