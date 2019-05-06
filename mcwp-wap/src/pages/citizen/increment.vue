<template>
  <div class="apply-loan">
    <p class="more-tips">填写更多信息，有助于提高您的贷款通过率</p>
    <ul class="apply-ul">
      <li class='apply-detail-content'>
        <p class='apply-detail-item font-32'>负债月还款</p>
        <input class='apply-detail-input font-32' type="number" placeholder='100-200,000' v-model="debtMoney"/>
        <p class='apply-detail-unit'>元</p>
      </li>
      <li class='apply-detail-content'>
        <p class='apply-detail-item font-32'>银行资产</p>
        <input class='apply-detail-input font-32' type="number" placeholder='1000-5,000,000' v-model="assetMoney"/>
        <p class='apply-detail-unit'>元</p>
      </li>
      <li class='apply-detail-content'>
        <popup-picker class="font-32" placeholder='请选择' title="抵押类型" value-text-align='left' :data="dylxData" :columns="1" v-model="dylxPicker" @on-show="onShow" show-name></popup-picker>
        <img class="icon-choice" src="../../assets/icon_choice.png"/>
      </li>
      <div v-if="dylxPicker[0] !== '3'">
        <li class='apply-detail-content'>
          <popup-picker class="font-32" placeholder='请选择' title="抵押种类" value-text-align='left' :data="dyzlData" :columns="1" v-model="dyzlPicker" @on-show="onShow" show-name></popup-picker>
          <img class="icon-choice" src="../../assets/icon_choice.png"/>
        </li>
        <li class='apply-detail-content'>
          <p class='apply-detail-item font-32'>抵押价值</p>
          <input class='apply-detail-input font-32' type="number" placeholder='1000-5,000,000' v-model="guarantyMoney"/>
          <p class='apply-detail-unit'>元</p>
        </li>
      </div>
      <li class='apply-detail-content'>
        <popup-picker class="font-32" placeholder='请选择' title="有无历史房贷" value-text-align='left' :data="houseLoan" :columns="1" v-model="houseLoanPicker" @on-show="onShow" show-name></popup-picker>
        <img class="icon-choice" src="../../assets/icon_choice.png"/>
      </li>
      <li class='apply-detail-content'>
        <p class='apply-detail-item font-32'>活跃贷款余额</p>
        <input class='apply-detail-input font-32' type="number" placeholder='1000-5,000,000' v-model="activeMoney"/>
        <p class='apply-detail-unit'>元</p>
      </li>
      <li class='apply-detail-content'>
        <popup-picker class="font-32" placeholder='请选择' title="住房情况" value-text-align='left' :data="houseCondition" :columns="1" v-model="houseConditionPicker" @on-show="onShow" show-name></popup-picker>
        <img class="icon-choice" src="../../assets/icon_choice.png"/>
      </li>
      <li class='apply-detail-content'>
        <p class='apply-detail-item font-32'>居住年数</p>
        <input class='apply-detail-input font-32' type="number" placeholder='0-100' v-model="liveYear"/>
        <p class='apply-detail-unit'>年</p>
      </li>
      <li class='apply-detail-content'>
        <p class='apply-detail-item font-32'>就职年数</p>
        <input class='apply-detail-input font-32' type="tel" placeholder='0-50' v-model="workYear"/>
        <p class='apply-detail-unit'>年</p>
      </li>
    </ul>
    <v-button @next='nextStep' style="margin: 2.08rem auto;">提交</v-button>
  </div>
</template>

<script>
/**
 * 数据服务
 * @Author: 魏昌华
 * @Date:   2017-07-13
 * @Last Modified by:   魏昌华
 * @Last Modified time: 2017-07-13
 */
import Store from 'store'
import VButton from './../../components/button'
import Config from '../../config/index'
import Utils from '../../config/utils'
import { getCitizenAdditional, postCitizenAdditional, getDictValueAll } from '../../service/getData'
import { PopupPicker, Group, Checker, CheckerItem } from 'vux'
export default {
  components: {
    VButton,
    PopupPicker,
    Group,
    Checker,
    CheckerItem
  },
  data () {
    return {
      debtMoney: '',
      assetMoney: '',
      dylxData: [],
      dylxPicker: [],
      dyzlData: [],
      dyzlPicker: [],
      guarantyMoney: '',
      houseLoan: [],
      houseLoanPicker: [],
      activeMoney: '',
      houseCondition: [],
      houseConditionPicker: [],
      liveYear: '',
      workYear: '',
      loanCode: '',
      loanRoutes: [],
      pathIndex: '',
      onOff: false,
      type: this.$route.params.type,
      getTime: new Date().getTime()   // 时长统计
    }
  },
  created () {
    const that = this
    const cookies = Store.get(Config.constants.cookies)
    that.isClear = true
    that.loanCode = cookies.loanCode
    that.loanRoutes = cookies.loanRoutes
    that.pathIndex = Utils.getIndex(that.loanRoutes, window.location.pathname)
    Store.set('loan_apply', {})
  },
  mounted () {
    const that = this
    if (!that.loanCode) return
    that.getDict()
    that.getCitizenAdditional()
    Utils.countPlus('基本信息', 'send')
  },
  beforeDestroy () {
    if (this.timer) clearInterval(this.timer)
    if (this.isClear) {
      Store.set('loan_apply', {})
    }
  },
  methods: {
    async getCitizenAdditional () {
      let res = getCitizenAdditional({reqCode: this.loanCode})
      let that = this
      if (res.code - 0 === 0) {
        if (!res.data) return
        that.debtMoney = res.data.debtMonthRepayment
        that.assetMoney = res.data.bankAsset
        that.dylxPicker = [res.data.mortgageSort]
        that.dyzlPicker = [res.data.mortgageType]
        that.houseLoanPicker = res.data.isHouseLoan
        that.activeMoney = res.data.activeLoanBalance
        that.houseConditionPicker = [res.data.houseSituation]
        that.liveYear = res.data.liveYear
        that.workYear = res.data.jobYear
      }
    },
    async getDict () {
      let dic = getDictValueAll({code: 'smddylx,smddyzl,smdywfd,smdzfqk'})
      let res = await dic
      if (res.code - 0 === 0 && res.data) {
        this.dylxData = Array.from(res.data.smddylx, item => { item.name = item.ddText; item.value = item.ddValue; return item })
        this.dyzlData = Array.from(res.data.smddyzl, item => { item.name = item.ddText; item.value = item.ddValue; return item })
        this.houseLoan = Array.from(res.data.smdywfd, item => { item.name = item.ddText; item.value = item.ddValue; return item })
        this.houseCondition = Array.from(res.data.smdzfqk, item => { item.name = item.ddText; item.value = item.ddValue; return item })
      } else {
        alert(res.msg)
      }
    },
    onShow () {
      // setTimeout(_ => {
      //   this.listData = [...this.listData]
      // }, 800)
    },
    async nextStep () {
      const that = this
      const debtMoney = that.debtMoney
      if (debtMoney && !(debtMoney >= 100 && debtMoney <= 200000)) return that.$vux.toast.text(Config.constants.debtMoneyRange)
      const assetMoney = that.assetMoney
      if (assetMoney && !(assetMoney >= 1000 && assetMoney <= 5000000)) return that.$vux.toast.text(Config.constants.assetMoneyRange)
      const dylxPicker = that.dylxPicker[0]
      if (!dylxPicker) return that.$vux.toast.text(Config.constants.nullDylxPicker)
      const dyzlPicker = that.dyzlPicker[0]
      const guarantyMoney = that.guarantyMoney
      if (guarantyMoney && !(guarantyMoney >= 1000 && guarantyMoney <= 5000000)) return that.$vux.toast.text(Config.constants.guarantyMoneyRange)
      const houseLoanPicker = that.houseLoanPicker[0]
      const activeMoney = that.activeMoney
      if (activeMoney && !(activeMoney >= 1000 && activeMoney <= 5000000)) return that.$vux.toast.text(Config.constants.activeMoneyRange)
      const houseConditionPicker = that.houseConditionPicker[0]
      // if (!houseConditionPicker) return that.$vux.toast.text(Config.constants.nullHouseConditionPicker)
      const liveYear = that.liveYear
      if (liveYear && !(liveYear >= 0 && liveYear <= 100)) return that.$vux.toast.text(Config.constants.liveYearRange)
      const workYear = that.workYear
      if (workYear && !(workYear >= 0 && workYear <= 50)) return that.$vux.toast.text(Config.constants.workYearRange)
      // let cookies = Store.get(Config.constants.cookies)
      let additionalParams = {
        debtMonthRepayment: debtMoney || '',
        bankAsset: assetMoney || '',
        mortgageSort: dyzlPicker || '',
        mortgageType: dylxPicker || '',
        mortgageValue: guarantyMoney || '',
        isHouseLoan: houseLoanPicker || '',
        activeLoanBalance: activeMoney || '',
        houseSituation: houseConditionPicker || '',
        liveYear: liveYear || '',
        jobYear: workYear || '',
        reqCode: that.loanCode
      }
      // 借款人信息录入,经营贷和车抵贷产品入口
      that.$vux.loading.show({
        text: '请稍候...'
      })

      const res = await postCitizenAdditional(additionalParams)
      if (res.code === Config.resCode.success) {
        let loanRoutes = that.loanRoutes
        Utils.countPlus('页面停留时长', 'send', {'pageName': '基本信息', 'stayTime': new Date().getTime() - this.getTime})
        if (that.pathIndex > -1 && that.pathIndex !== loanRoutes.length - 1) {
          that.$router.push(loanRoutes[that.pathIndex + 1])
        } else {
          that.$router.push(Config.constants.confirmRouter)
        }
      } else {
        that.$vux.loading.hide()
        that.$vux.toast.text(res.msg)
      }
    }
  }
}
</script>

<style lang='less'>
.apply-loan {
  position: relative;
  width: 10.8rem;
  background-color: #fafafa;
  margin: 0 auto;
  padding-bottom: 1.6rem;
  .more-tips{
    width: 10.8rem;
    height: 1.04rem;
    background: #f2f9ff;
    line-height: 1.04rem;
    font-size: .36rem;
    color: #218beb;
    padding-left: 1.36rem;
    position: relative;
  }
  .more-tips::before{
    content: "";
    position: absolute;
    width: .48rem;
    height: .48rem;
    background: url(../../assets/icon_prompt.png) no-repeat;
    background-size: cover;
    top: .22rem;
    left: .64rem;
  }
  .apply-ul {
    position: relative;
    width: 100%;
    height: auto;
    background-color: #fff;
    overflow: hidden;
  }
  .apply-detail-content {
    position: relative;
    width: 100%;
    display: flex;
  }
  .apply-detail-item {
    width: 3.5rem;
    text-indent: .48rem;
    color: #333;
    height: 1.46rem;
    line-height: 1.46rem;
  }
  .apply-detail-input {
    flex: 1;
    border: none;
    outline: none;
    text-indent: .48rem;
    color: #333;
    min-width: 5rem;
  }
  .apply-detail-verify {
    padding-right: .48rem;
    box-sizing: border-box;
    height: 1.46rem;
    line-height: 1.46rem;
    color: #369fff;
    text-align: right;
  }
  .apply-detail-unit {
    float: right;
    padding-right: .48rem;
    color: #666;
    height: 1.46rem;
    line-height: 1.46rem;
    font-size: .4rem;
  }
  .icon-choice {
    width: .4rem;
    height: .4rem;
    position: relative;
    top: .5rem;
    right: .48rem;
  }
  .confirm-authorize {
    padding-top: .3rem;
    background-color: #fafafa;
  }
  .vux-tap-active:active {
    background-color: transparent;
  }
  .ipieces-item{
    background: url(../../assets/icon_choice_disable.png) no-repeat .48rem .15rem;
    background-size: .4rem .4rem;
  }
  .ipieces-item-selected{
    background: url(../../assets/icon_choice_pressed.png) no-repeat .48rem .15rem;
    background-size: .4rem .4rem;
  }
  .content-container {
    padding-top: .48rem;
    overflow: hidden;
  }
  .content-left {
    float: left;
    text-indent: 1rem;
  }
  .content-right {
    float: left;
    color: #369fff;
  }
  .weui-cell {
    display: flex;
    padding: 0;
    height: 1.46rem;
    line-height: 1.46rem;
  }
  .weui-cell__hd {
    width: 3.5rem;
    text-indent: .48rem;
    text-align: left;
    color: #333;
  }
  .vux-cell-box {
    width: 100%;
  }
  .vux-popup-picker-select {
    padding-left: .48rem;
  }
  .vux-cell-box:before {
    border-top: none;
  }
  .weui-cell_access .weui-cell__ft:after {
    display: none;
  }
  .vux-popup-picker-placeholder {
    color: #777;
  }
}
</style>
