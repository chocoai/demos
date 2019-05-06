<template>
  <div class="success">
    <img class="success-img" src="../../assets/img_submit-successfully.png" alt="success" />
    <p class="submit font-44">申请信息提交成功</p>
    <p class="wait font-32">请耐心等待审核</p>
    <p class="back font-32" @click="back">返回产品列表</p>
  </div>
</template>

<script>
import Config from '../../config/index'

export default {
  methods: {
    back () {
      this.$router.push(Config.constants.productRouter)
    }
  }
}
</script>

<style lang="less" scoped>
.success {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  padding-top: .8rem;
  padding-bottom: 1rem;
  .success-img {
    width: 2rem;
    height: 2rem;
  }
  .submit {
    margin-top: .64rem;
    line-height: 1;
    color: #333;
  }
  .wait {
    margin-top: .4rem;
    line-height: 1;
    color: #888;
  }
  .back {
    margin-top: .5rem;
    line-height: 1;
    padding: .2rem;
    color: #369fff;
  }
}
</style>
