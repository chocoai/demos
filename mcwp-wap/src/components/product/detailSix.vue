<template>
    <div class="product-desc tpl-six">
      <div class="product-apply" @click="goApply">立即申请</div>
      <!-- <p class="apply-tip">点击获取更多利率优惠</p> -->
      <!-- <p class="product-tip">本产品除利息支出外不收取其他任何手续费</p> -->
      <!-- <p class="peoduct-phone">产品详情请咨询&nbsp;&nbsp;"零售金融事业部"<br>
      点击拨打：&nbsp;&nbsp;<a class="tel" href="tel:0472-2165126">0472-2165126</a><br>
      本产品除利息支出外不收取其他任何手续费</p> -->
    </div>
</template>
<script>
    export default {
      data () {
        return {
          proInfo: '', // 产品信息
          citiesText: '', // 支持的城市列表
          curIndex: 0,
          channel: '',
          category: ''
        }
      },
      components: {
      },
      props: ['proInfoData'],
      computed: {
      },
      mounted () {
        this.proInfo = this.proInfoData
        this.citiesText = this.proInfoData.citiesText
      },
      methods: {
        onAfterSlideChange (index) {
          this.curIndex = index
        },
        goApply () {
          this.$emit('goApply')
        }
      }
    }
</script>
<style lang="less">
.product-desc {
  width: 10.8rem;
  // height: 100%;
  // min-height: 17.04rem;
  background-color: #fff;
  margin: 0 auto;
  -moz-user-select: none;
  -khtml-user-select: none;
  user-select: none;
  -webkit-tap-highlight-color:rgba(0,0,0,0);
  overflow: hidden;
  &.tpl-six {
    height: 20.84rem;
    background: url('./../../assets/product-bg-btnj.png') no-repeat;
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
  // .apply-tip {
  //   position: absolute;
  //   top: 16.8rem;
  //   width: 100%;
  //   color: #f8efef;
  //   text-align: center;
  // }
}

</style>
