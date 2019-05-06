<template>
  <div class='valuation-result'>
    <img class="result-img" src="./../../assets/valuation_result_img.png"/>
    <div class="car-content">
      <div class="result-title font-40">
        <p>您的身价高达<span class="title-num font-42">{{valuationMoney || 0}}万</span></p>
        <p>您的可贷额度<span class="title-num font-42">{{loanMoney}}万</span></p>
        <p v-if="houseTotal === 0" class="subtitle font-32">该区房屋估值无数据</p>
      </div>
      <!-- <li class='contact-detail-content' flex="">
        <p class='contact-detail-item font-32' flex-box="0">姓名</p>
        <input flex-box="1" class='contact-detail-input font-32' type="text" placeholder='请输入姓名' v-model="applyName" >
      </li>
      <li class='contact-detail-content' flex="">
        <p class='contact-detail-item font-32' flex-box="0">联系方式</p>
        <input flex-box="1" class='contact-detail-input font-32' type="text" placeholder='请输入联系方式' v-model="applyPhone" >
      </li>
      <li class='contact-detail-content' flex="">
        <p class='contact-detail-item font-32'>验证码</p>
        <input class='contact-detail-input font-32' type="tel" placeholder='请输入验证码' v-model="verifyCode" maxlength="6" />
        <p v-show="!computedTime" @click.prevent='getVerifyCode' class='apply-detail-verify font-32'>{{codeText}}</p>
        <p v-show="computedTime" @click.prevent class='apply-detail-verify font-32'>{{codeText}}</p>
      </li> -->
    </div>
    <v-button class="car-btn" @next='nextStep'>我要贷款</v-button>
  </div>
</template>

<script>
import { PopupPicker } from 'vux'
import VButton from './../../components/button'
import Config from '../../config/index'
import Utils from '../../config/utils'
import { postValuationLoan, postValuationVerification, getValuationResult } from '../../service/valuation'
export default {
  components: {
    PopupPicker,
    VButton
  },
  data () {
    return {
      applyName: '',
      applyPhone: '',
      verifyCode: '',
      computedTime: false,
      codeText: '获取验证码',
      valuationMoney: '',
      loanMoney: 0,
      houseTotal: null
    }
  },
  created () {
    const that = this
    let valuation = JSON.parse(sessionStorage.getItem(Config.constants.valuation) || {})
    that.valuationCode = valuation.valuationCode
    that.loanRoutes = valuation.list
    that.getValuationResult()
  },
  methods: {
    async getValuationResult () { // 获取估值结果
      const that = this
      let params = {
        valuationCode: that.valuationCode
      }
      let res = await getValuationResult(params)
      if (res.code === Config.resCode.success) {
        that.valuationMoney = (res.data && res.data.assetTotal) || 0
        if (res.data && res.data.loanMoney) that.loanMoney = res.data.loanMoney
        that.houseTotal = res.data.houseTotal
      } else {
        that.$vux.toast.text(res.msg)
      }
    },
    async getVerifyCode () { // 获取验证码
      const that = this
      const applyName = that.applyName
      if (!applyName) return that.$vux.toast.text(Config.constants.nullName)
      const applyPhone = that.applyPhone
      if (!applyPhone) return that.$vux.toast.text(Config.constants.nullPhone)
      // 发送短信验证码
      let res = await postValuationVerification({phone: applyPhone, valuationCode: that.valuationCode})
      if (res.code === Config.resCode.success) {
        that.$vux.toast.text(Config.constants.sendVerifyCode)
        that.computedTime = 60
        that.timer = setInterval(() => {
          that.codeText = that.computedTime + 's后重新获取'
          that.computedTime --
          if (that.computedTime === -1) {
            that.codeText = '再次重新获取'
            that.computedTime = 0
            clearInterval(that.timer)
          }
        }, 1000)
      } else {
        that.$vux.toast.text(res.msg)
      }
    },
    async nextStep () {
      const that = this
      const valuationCode = that.valuationCode
      // const applyName = that.applyName
      // if (!applyName) return that.$vux.toast.text(Config.constants.nullName)
      // const applyPhone = that.applyPhone
      // if (!applyPhone) return that.$vux.toast.text(Config.constants.nullPhone)
      // const verifyCode = that.verifyCode
      // if (!verifyCode) return that.$vux.toast.text(Config.constants.nullVerifyCode)
      // let params = {
      //   valuationCode: valuationCode,
      //   name: applyName,
      //   telephone: applyPhone,
      //   verificationCode: verifyCode
      // }
      let params = {
        valuationCode: valuationCode
      }
      const res = await postValuationLoan(params)
      console.log(res)
      if (res.code === Config.resCode.success) {
        let loanRoutes = that.loanRoutes
        let pathIndex = Utils.getIndex(loanRoutes, window.location.pathname)
        that.$router.push(loanRoutes[pathIndex + 1])
      } else {
        that.$vux.loading.hide()
        that.$vux.toast.text(res.msg)
      }
    }
  }
}
</script>

<style lang="less">
.valuation-result {
  background: url('./../../assets/valuation_result_bg.png') no-repeat;
  background-size: 10.8rem 6.6rem;
  width: 100%;
  height: 100%;
  position: relative;
  .result-img {
    width: 3.6rem;
    height: 4.4rem;
    position: absolute;
    top: 1.88rem;
    left: 3.6rem;
    z-index: 100;
  }
  .car-content {
    position: absolute;
    width: 10rem;
    height: auto;
    background-color: #fff;
    overflow-x: hidden;
    top: 6rem;
    left: .4rem;
    border-radius: .24rem;
  }
  .result-title {
    text-align: center;
    padding: .8rem 0 .4rem;
    color: #333;
  }
  .subtitle {
    padding-top: .2rem;
    color: #999;
  }
  .title-num {
    color: #f64349;
  }
  .contact-detail-content {
      position: relative;
      width: 100%;
      display: flex;
    }
  .car-btn {
    position: absolute;
    top: 12rem;
    left: 2.4rem;
    font-size: .44rem;
    color: #fff !important;
  }
  .contact-detail-content {
    position: relative;
    width: 100%;
    display: flex;
  }
  .contact-detail-item {
    width: 80px;
    padding-left: 10px;
    color: #333;
    height: 1.46rem;
    line-height: 1.46rem;
  }
  .apply-detail-verify {
    box-sizing: border-box;
    height: 1.46rem;
    line-height: 1.46rem;
    color: #369fff;
    text-align: center;
    margin-right: .64rem;
  }
  .contact-detail-input {
    flex: 1;
    border: none;
    outline: none;
    padding-left: .48rem;
    color: #333;
    height: 1.46rem;
    line-height: 1.46rem;
    &.empty {
      color: #777;
    }
  }
  .contact-detail-unit {
    float: right;
    padding-right: .48rem;
    color: #666;
    height: 1.46rem;
    line-height: 1.46rem;
  }
}
</style>
