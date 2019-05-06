<template>
    <div class="product-desc">
      <div class="product-phone">
        <input class="phone-input" type="text" placeholder="手机号">
      </div>
      <div class="product-verifyCode">
        <input class="verifyCode-input" type="text" placeholder="验证码">
        <span class="verifyCode-btn">发送验证码</span>
      </div>
      <div class="product-apply">领取额度</div>
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
  height: 20.84rem;
  background-color: #fff;
  margin: 0 auto;
  -moz-user-select: none;
  -khtml-user-select: none;
  user-select: none;
  -webkit-tap-highlight-color:rgba(0,0,0,0);
  overflow: hidden;
  background: url('./../../assets/bg_invitedetail.png') 0 0 no-repeat;
  background-size: cover;
  .product-phone ,
  .product-verifyCode {
    background: #fff;
    border-radius: 0.32rem;
    width: 8.32rem;
    height: 1.2rem;
    margin: 0 auto;
    .verifyCode-input, .phone-input {
      width: 8rem;
      height: 1.2rem;
      border-radius: 0.32rem;
      padding-left: 0.32rem;
      font-size: 0.4rem;
      color: #333;
    }
  }
  .product-phone {
    margin-top: 8.78rem;
  }
  .product-verifyCode {
    margin-top: 0.4rem;
    position: relative;
    .verifyCode-btn {
      text-align: center;
      width: 2.8rem;
      height: 1.2rem;
      line-height: 1.2rem;
      border-radius: 0 0.32rem 0.32rem 0;
      font-size: 0.4rem;
      color: #fff;
      background: #f0564f;
      position: absolute;
      right: 0;
      top: 0;
    }
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
    margin: 0.8rem auto 0;
    :active {
      background: #d84d47;
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
