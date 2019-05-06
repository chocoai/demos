<template>
    <div class="product-desc tpl-eight">
      <div class="product-apply" @click="goApply">立即申请</div>
    </div>
</template>
<script>
    export default {
      data () {
        return {
        }
      },
      components: {
      },
      props: ['proInfoData'],
      computed: {
      },
      mounted () {
      },
      methods: {
        goApply () {
          this.$emit('goApply')
        }
      }
    }
</script>
<style lang="less">
.product-desc {
  width: 10.8rem;
  background-color: #fff;
  margin: 0 auto;
  -moz-user-select: none;
  -khtml-user-select: none;
  user-select: none;
  -webkit-tap-highlight-color:rgba(0,0,0,0);
  overflow: hidden;
  &.tpl-eight {
    height: 20.84rem;
    // background: url('./../../assets/product-bg-sxdt.png') no-repeat;
    background: url('./../../assets/product_bg_eight.png') no-repeat;
    background-size: cover;
  }
  .product-apply {
    width: 5.4rem;
    height: 1.36rem;
    background: #fff;
    color: #5e9bff;
    font-size: .56rem;
    text-align: center;
    line-height: 1.36rem;
    border-radius: 1.36rem;
    position: absolute;
    top: 12.24rem;
    left: 50%;
    margin-left: -2.7rem;
    :active {
      background: #fff;
    }
  }
  .peoduct-phone {
    position: absolute;
    top: 15.4rem;
    width: 100%;
    // color: #bdbac1;
    color: #fff;
    font-size: 0.36rem;
    line-height: 0.64rem;
    text-align: center;
    .tel {
      // color: #bdbac1;
      color: #fff;
    }
  }
}

</style>
