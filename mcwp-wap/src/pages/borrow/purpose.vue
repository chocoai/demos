<template>
  <div class="purpose-loanSelect"  v-bind:class="{ active: isActive}">
    <ul class="purpose-ul" @touchmove.prevent>
      <li class='purpose-detail-content content-top'>
        <flexbox @click.native="showBank=true">
          <flexbox-item :span="234/910">
            <div class="flex-demo">
              <img class="bank-card" src="../../assets/borrow-bank-card.png"/>
            </div>
          </flexbox-item>
          <flexbox-item>
            <div class="flex-demo">
              <flexbox orient="vertical">
                <flexbox-item><div class="purpose-account font-40">收款账户</div></flexbox-item>
                <flexbox-item><div class="purpose-bank font-30">{{ bankName && bankTailNo ? `${bankName}&nbsp${bankTailNo}` : '选择收款银行卡'}}</div></flexbox-item>
              </flexbox>
            </div>
          </flexbox-item>
          <flexbox-item :span="34/910">
            <div class="flex-demo">
              <img class="manager-view" src="../../assets/account-manager-view.png"/>
            </div></flexbox-item>
        </flexbox>
      </li>
      <li class='purpose-detail-content content-middle'>
        <popup-picker class="font-32"  placeholder='请选择' title="借款用途" v-model="jkytValue" :data="jkyt" value-text-align='right'  :columns="1"  show-name></popup-picker>
      </li>
      <li class='purpose-detail-content content-bottom font-32'>
        <flexbox orient="vertical">
          <flexbox-item>
            <div class="flex-demo">
              <flexbox>
                <flexbox-item :span="3.5"><div class="purpose-title">还款计划</div></flexbox-item>
                <flexbox-item><div class="purpose-val purpose-view" @click="showTimeline=true,isActive=true">查看</div></flexbox-item>
              </flexbox>
            </div>
          </flexbox-item>
          <flexbox-item>
            <div class="flex-demo">
              <flexbox>
                <flexbox-item :span="3.5"><div class="purpose-title">借款金额</div></flexbox-item>
                <flexbox-item><div class="purpose-val">{{originData.borrowMoney}}元</div></flexbox-item>
              </flexbox>
            </div>
          </flexbox-item>
          <flexbox-item>
            <div class="flex-demo">
              <flexbox>
                <flexbox-item :span="3.5"><div class="purpose-title">总利息</div></flexbox-item>
                <flexbox-item><div class="purpose-val">{{originData.interest}}元</div></flexbox-item>
              </flexbox>
            </div>
          </flexbox-item>
          <flexbox-item>
            <div class="flex-demo">
              <flexbox>
                <flexbox-item :span="3.5"><div class="purpose-title">还款期数</div></flexbox-item>
                <flexbox-item><div class="purpose-val">{{originData.repaymentPeriodText}}期</div></flexbox-item>
              </flexbox>
            </div>
          </flexbox-item>
          <!--<flexbox-item>
            <div class="flex-demo">
              <flexbox>
                <flexbox-item :span="2.5"><div class="purpose-title">还款日</div></flexbox-item>
                <flexbox-item><div class="purpose-val">每月25日</div></flexbox-item>
              </flexbox>
            </div>
          </flexbox-item>-->
        </flexbox>
      </li>
    </ul>
    <p class="purpose-tip font-30" v-if="showLoanContract">点击"确认按钮"，表示您同意<span class="purpose-contract" @click="contract">《借款合同》</span></p>
    <v-button class="font-50" style="width: 9rem; margin-top: 1.1rem" @next="next">确认借款</v-button>
    <popup v-model="showTimeline" @on-hide="closePopup" position="bottom" height="80%">
      <div class="repay-plan-container">
        <p class="repay-plan-title font-36" @touchmove.prevent>还款计划</p>
        <p class="repay-plan-total font-32" @touchmove.prevent>
          <span class="total-money">共还{{repayPlan.totalPI}}元</span>
          <span class="total-interest">总利息{{repayPlan.totalInterest}}元</span>
        </p>
        <div class="time-line">
          <timeline v-if="repayPlan.list" :list="repayPlan.list" />
        </div>
      </div>
    </popup>
    <popup v-model="showBank" position="bottom" height="40%">
      <div class="bank-container">
        <p class="bank-title font-36" @touchmove.prevent>选择银行卡</p>
        <ul class="bank-list-wrapper">
          <li class="bank-list font-32" v-for="(item, index) in bankcard" :key="index" @click="chooseBank(item.bankName, item.bankNo, item.code, item.bankTailNo)">
            <span class="bank-name">{{item.bankName}}</span>
            <span class="bank-num">{{item.bankTailNo}}</span>
          </li>
          <li class="bank-add font-32" @click='addCard'><span class="add-bankcard">添加银行卡</span><img class="add-bankcard-img" src='../../assets/add_bankcard.png' /></li>
        </ul>
      </div>
    </popup>
  </div>
  <!-- <a v-if='showTimeline' class='owner-popup-show' @click.prevent.self="showTimeline = false"></a> -->
</template>

<script>
import VButton from './../../components/button'
import { repayPlan, perBankcard, borrowMoney } from '../../service/getData'
import Timeline from './../../components/timeline'
import Sto from 'store'
import Config from '../../config/index'
import { PopupPicker, Flexbox, FlexboxItem, Divider, Popup } from 'vux'
import { getDictCustom } from '../../service/common.js'

export default {
  components: {
    VButton,
    PopupPicker,
    Flexbox,
    FlexboxItem,
    Divider,
    Timeline,
    Popup
  },
  data () {
    return {
      showTimeline: false,
      showBank: false,
      jkyt: [],
      jkytValue: [],
      repayPlan: {},
      bankcard: [],
      bankName: '',
      bankNum: '',
      bankCode: '',
      bankTailNo: '',
      showLoanContract: JSON.parse(sessionStorage.getItem(Config.constants.loanContractAuth)),
      isActive: false
    }
  },
  methods: {
    closePopup () {
      this.isActive = false
    },
    async getDict () {
      // TODO: 借款用途存在问题，未来启用该模块的时候对接口进行修改
      let dic = getDictCustom({ddItem: 'smdjkyt'})
      let res = await dic
      if (res.code - 0 === 0) {
        this.jkyt = Array.from(res.data.smdjkyt, item => { item.name = item.ddText; item.value = item.ddValue; return item })
        let originData = Sto.get('MCWP_LOAN_SELECT')
        this.bankName = originData.bankName
        this.bankNum = originData.bankNo
        if (originData.borrowUse) this.jkytValue[0] = originData.borrowUse
        this.bankTailNo = originData.bankTailNo
        this.bankCode = originData.bankCode
      } else {
        alert(res.msg)
      }
    },
    async repaymentplan (originData) {
      let res = await repayPlan(originData)
      if (res.code - 0 === 0) {
        this.repayPlan = res.data
      } else {
        this.$router.push(Config.constants.personalRouter)
        // alert(res.msg)
      }
    },
    async getBankCard () {
      let res = await perBankcard()
      if (res.code - 0 === 0) {
        this.bankcard = res.data
      } else {
        this.$router.push(Config.constants.personalRouter)
        // alert(res.msg)
      }
    },
    chooseBank (name, num, code, bankTailNo) {
      this.bankName = name
      this.bankNum = num
      this.bankCode = code
      this.showBank = false
      this.bankTailNo = bankTailNo
    },
    async next () {
      let params = Sto.get('MCWP_LOAN_SELECT')
      if (!this.bankCode) return this.$vux.toast.text('请选择收款账户')
      if (!this.jkytValue[0]) return this.$vux.toast.text('请选择借款用途')
      params.borrowUse = this.jkytValue[0]
      params.accountCode = this.bankCode
      let res = await borrowMoney(params)
      if (res.code - 0 === 0) {
        Sto.remove('MCWP_LOAN_SELECT')
        this.$router.push(Config.constants.boSuccessRouter)
        // this.$vux.toast.text('借款成功')
      } else {
        alert(res.msg)
      }
    },
    addCard () {
      this.$router.push(Config.constants.addBankcardRouter)
    },
    contract () {
      if (!this.bankCode) return this.$vux.toast.text('请选择收款账户')
      if (!this.jkytValue[0]) return this.$vux.toast.text('请选择借款用途')
      let params = Sto.get('MCWP_LOAN_SELECT')
      params.bankName = this.bankName
      params.bankNo = this.bankNum
      params.borrowUse = this.jkytValue[0]
      params.bankTailNo = this.bankTailNo
      params.bankCode = this.bankCode
      Sto.set('MCWP_LOAN_SELECT', params)
      this.$router.push(Config.constants.boContractRouter)
    },
    stopPop () {
      console.log(1)
    }
  },
  created () {
    this.originData = Sto.get('MCWP_LOAN_SELECT')
    this.getDict()
    this.repaymentplan(this.originData)
  },
  mounted () {
    this.getBankCard()
  }
}
</script>

<style lang="less">
.active {
    overflow: hidden;
  }
.purpose-loanSelect{
  width: 10.2rem;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: #fff;
  margin: .3rem auto;
  font-size: .44rem;
  padding-left: .6rem;
  box-sizing: border-box;
  border-radius: .3rem;
  // .purpose-ul {
  //   margin-top: .3rem
  // }
  .purpose-tip{
    color: #4c4c4c;
    padding-top: .45rem;
  }
  .purpose-contract{
    color: #369bff;
  }
  // 还款计划弹出
  .repay-plan-container {
    position: relative;
    padding-top: 3.5rem;
    padding-bottom: 1rem;
    height: 80vh;
    box-sizing: border-box;
  }
  .vux-popup-dialog {
    background-color: #fff;
    // margin-top: 20vh;
  }
  .repay-plan-title {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1.42rem;
    line-height: 1.42rem;
    text-align: center;
    // font-size: .44rem;
    color: #000;
  }
  .repay-plan-total {
    position: absolute;
    top: 1.42rem;
    left: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    // font-size: .42rem;
    height: 2.08rem;
    .total-money {
      color: #010101;
      line-height: .8rem;
    }
    .total-interest {
      color: #8c8c8c;
      line-height: .8rem;
    }
  }
  .repay-plan-total::before, .repay-plan-total::after {
    content: '';
    position: absolute;
    transform: scaleY(.5);
    border-top: 1px solid #e5e5e5;
    left: .5rem;
    right: 0;
  }
  .repay-plan-total::before {
    top: 0;
  }
  .repay-plan-total::after {
    bottom: 0;
  }
  .time-line {
    padding-top: .5rem;
    box-sizing: border-box;
    height: 100%;
    overflow: scroll;
  }
  // 银行卡弹出
  .bank-container {
    position: relative;
    overflow: hidden;
  }
  .bank-title {
    position: fixed;
    // top: 0;
    left: 0;
    right: 0;
    // font-size: .44rem;
    color: #000;
    text-align: center;
    // font-weight: bold;
    line-height: 1.42rem;
    box-sizing: border-box;
    background-color: #fff;
    z-index: 10000;
  }
  .bank-title:after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    border-bottom: 1px solid #e5e5e5;
    transform: scaleY(.5);
  }
  .bank-list-wrapper {
    margin-bottom: 1.36rem;
    padding-top: 1.42rem;
  }
  .bank-list {
    line-height: 1.36rem;
    // font-size: .38rem;
    margin-left: .5rem;
    position: relative;
    // border-bottom: 1px solid #c5c5c5;
    .bank-name {
      color: #494949;
    }
    .bank-num {
      padding-left: .5rem;
      color: #818181;
    }
  }
  .bank-list::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    border-bottom: 1px solid #e5e5e5;
    transform: scaleY(.5);
  }
  .bank-add {
    // position: fixed;
    // bottom: 0;
    // left: 0;
    // right: 0;
    position: relative;
    line-height: 1.36rem;
    background-color: #fff;
    // font-size: .38rem;
    padding-left: .5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    // border-bottom: 1px solid #7b7b7b;
    .add-bankcard {
      vertical-align: middle;
    }
    .add-bankcard-img {
      vertical-align: middle;
      width: .4rem;
      height: .4rem;
      padding: .48rem;
    }
  }
  .bank-add:before {
    content: "";
    position: absolute;
    bottom: 0;
    width: 100%;
    border-top: 1px solid #e5e5e5;
    color: #d9d9d9;
    transform: scaleY(0.5);
  }
  .content-top{
    padding: .8rem 0 1.2rem;
  }
  .content-bottom{
    padding: .35rem 0;
  }
  .vux-flexbox-item{
    // margin-top: .2rem!important;
    height: .71rem;
    line-height: .71rem;
  }
  .purpose-detail-content{
    position: relative;
    .bank-card{
      width: 1.84rem;
      height: 1.32rem;
    }
    .manager-view{
      width: .34rem;
      height: .34rem;
      position: absolute;
      top: 1.28rem;
      right: .54rem;
    }
    .purpose-account{
      color: #010101;
    }
    .purpose-bank{
      color: #7b7b7b;
    }
    .purpose-title{
      color: #4c4c4c;
    }
    .purpose-val{
      color: #0a0a0a;
    }
    .purpose-view{
      color: #369bff;
    }
    .weui-cell {
      display: flex;
      // padding: 0;
      padding: .5rem 0;
    }
    .weui-cell__hd {
      width: 3.3rem;
      text-align: left;
    }
    .vux-cell-box {
      width: 100%;
    }
    .vux-popup-picker-placeholder {
      color: #7b7b7b;
    }
    .vux-popup-picker-select {
      padding-left: 0;
    }
  }
  .purpose-detail-content:after{
    content: " ";
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    height: 1px;
    border-bottom: 1px solid #e5e5e5;
    color: #e5e5e5;
    -webkit-transform-origin: 0 100%;
    transform-origin: 0 100%;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
    width:9.6rem;
  }
  .vux-cell-box:before{
    display:none;
  }
  .content-middle{
    padding-right:.54rem;
  }
}
.owner-popup-show {
  z-index: 500;
  opacity: 1;
  // background-color: rgba(0, 0, 0, .5);
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  transition: opacity 400ms;
}
</style>
