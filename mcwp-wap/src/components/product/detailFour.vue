<template>
    <div class="product-desc" :class="proInfoData.tplCode == 'templet4' ? 'tpl-four' : 'tpl-five'">
      <div class="product-apply" @click="goApply">{{proInfoData.tplCode == 'templet4' ? "申请优惠" : "立即申请"}}</div>
      <!-- <p class="apply-tip">点击获取更多利率优惠</p> -->
      <!-- <p class="product-tip">本产品除利息支出外不收取其他任何手续费</p> -->
      <p class="peoduct-phone">本产品除利息支出外不收取其他任何手续费<br>
      监督电话：&nbsp;&nbsp;<a class="tel" href="tel:18835506567">18835506567</a>&nbsp;&nbsp;&nbsp;&nbsp;<a class="tel" href="tel:18835506582">18835506582</a></p>
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
  &.tpl-four {
    height: 18.64rem;
    background: url('./../../assets/product-bg-four.png') no-repeat;
    background-size: cover;
  }
  &.tpl-five {
    height: 20.84rem;
    background: url('./../../assets/product-bg-five.png') no-repeat;
    background-size: cover;
  }
  .product-apply {
    width: 5.4rem;
    height: 1.36rem;
    background: #f0564f;
    color: #fff;
    font-size: .56rem;
    text-align: center;
    line-height: 1.36rem;
    border-radius: 1.36rem;
    position: absolute;
    top: 12.24rem;
    left: 50%;
    margin-left: -2.7rem;
    :active {
      background: #d84d47;
    }
  }
  .peoduct-phone {
    position: absolute;
    top: 15.4rem;
    width: 100%;
    color: #bdbac1;
    font-size: 0.36rem;
    line-height: 0.64rem;
    text-align: center;
    .tel {
      color: #bdbac1;
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
