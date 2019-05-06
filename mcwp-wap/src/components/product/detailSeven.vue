<template>
    <div class="product-desc tpl-seven">
      <div class="product-apply" @click="goApply">立即申请</div>
      <p class="peoduct-phone">产品详情请咨询&nbsp;&nbsp;"沈阳农商银行总行营业部"<br>
      点击拨打：&nbsp;&nbsp;<a class="tel" href="tel:024-31138698">024-31138698</a><br>
      本产品除利息支出外不收取其他任何手续费</p>
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
  &.tpl-seven {
    height: 20.84rem;
    background: url('./../../assets/product-bg-syns-fix.png') no-repeat;
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
