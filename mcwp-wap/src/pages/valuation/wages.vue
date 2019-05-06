<template>
  <div class='valuation-wages'>
    <div class="car-content">
      <li class='contact-detail-content' flex="">
        <p class='contact-detail-item font-32' flex-box="0">月度工资</p>
        <input flex-box="1" class='contact-detail-input font-32' type="text" placeholder='请输入月度工资' v-model="wagesMonth" >
        <span class="contact-detail-unit font-28">元</span>
      </li>
      <li class='contact-detail-content' flex="">
        <p class='contact-detail-item font-32' flex-box="0">年度奖金</p>
        <input flex-box="1" class='contact-detail-input font-32' type="text" placeholder='请输入年度奖金' v-model="wagesReward" >
        <span class="contact-detail-unit font-28">元</span>
      </li>
    </div>
    <v-button class="car-btn" @next='nextStep'>下一步</v-button>
    <span class="car-pass" @click="next">跳过</span>
  </div>
</template>

<script>
import Store from 'store'
import Utils from '../../config/utils'
import Config from '../../config/index'
import { PopupPicker } from 'vux'
import VButton from './../../components/button'
import { postValuationWage } from '../../service/valuation'
export default {
  components: {
    PopupPicker,
    VButton
  },
  data () {
    return {
      wagesMonth: '',
      wagesReward: '',
      valuationCode: '',
      loanRoutes: null
    }
  },
  created () {
    const that = this
    let valuation = JSON.parse(sessionStorage.getItem(Config.constants.valuation)) || {}
    that.valuationCode = valuation.valuationCode
    that.loanRoutes = valuation.list
  },
  methods: {
    async nextStep () {
      const that = this
      const valuationCode = that.valuationCode
      const wagesMonth = that.wagesMonth
      if (!wagesMonth) return that.$vux.toast.text(Config.constants.nullWagesMonth)
      if (!Utils.checkNumLenTen(wagesMonth)) return that.$vux.toast.text('月度工资最多输入十位整数')
      const wagesReward = that.wagesReward
      if (!wagesReward) return that.$vux.toast.text(Config.constants.nullWagesReward)
      if (!Utils.checkNumLenTen(wagesReward)) return that.$vux.toast.text('年度奖金最多输入十位整数')
      let params = {
        valuationCode: valuationCode,
        monthlyWage: wagesMonth,
        yearlyWage: wagesReward
      }
      const res = await postValuationWage(params)
      if (res.code === Config.resCode.success) {
        if (res.data) {
          const cookies = Store.get(Config.constants.cookies)
          cookies.valuationMoney = res.data
          Store.set(Config.constants.cookies, cookies)
        }
        let loanRoutes = that.loanRoutes
        let pathIndex = Utils.getIndex(loanRoutes, window.location.pathname)
        that.$router.push(loanRoutes[pathIndex + 1])
      } else {
        that.$vux.loading.hide()
        that.$vux.toast.text(res.msg)
      }
    },
    next () {
      const that = this
      let loanRoutes = that.loanRoutes
      let pathIndex = Utils.getIndex(loanRoutes, window.location.pathname)
      that.$router.push(loanRoutes[pathIndex + 1])
    }
  }
}
</script>

<style lang="less">
.valuation-wages {
  background: url('./../../assets/valuation_wages_bg.png') no-repeat;
  background-size: 10.8rem 6.6rem;
  width: 100%;
  height: 100vh;
  position: relative;
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
  }
  .car-pass {
    position: absolute;
    top: 16rem;
    left: 5rem;
    font-size: .4rem;
    color: #369fff;
    text-decoration: underline;
  }
  .contact-detail-content {
    position: relative;
    width: 100%;
    display: flex;
  }
  .contact-detail-item {
    width: 130px;
    padding-left: 10px;
    color: #333;
    height: 1.46rem;
    line-height: 1.46rem;
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
    padding-right: .48rem;
    color: #666;
    height: 1.46rem;
    line-height: 1.46rem;
  }
}
</style>
