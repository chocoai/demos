<template>
  <div class="borrow-personal" v-show="showLogin">
    <div class="borrow-personal-top" :class="{'loan-verify-bg': userStatus==2, 'loan-refuse-bg': userStatus==3 || userStatus==4, 'center' : userStatus!=5}" >
      <img class="enterpSymbol" :src="enterpSymbol" v-if='userStatus != 5' />
      <div class="borrow-personal-go font-40" v-if='userStatus == 2' @click='goNext("borrow")'>我要贷款</div>
      <div class="product-tip-content content-verify font-40" v-if='userStatus == 3'>额度审批中</div>
      <div class="product-tip-content content-refuse font-40" v-if='userStatus == 4'>审批拒绝</div>
      <p class="top-credit-tip font-32" v-if='userStatus == 5' @click='goNext("loanList")'>我的借款</p>
      <div class="product-credit-content" v-if='userStatus == 5'>
        <p class="content-credit-p1 font-40">可贷额度</p>
        <p class="content-credit-p2 font-90">&#165{{creditBalance || 0}}</p>
        <p class="content-credit-p3 font-32">总额度{{creditAmount || 0}},日利率{{dailyRate || 0}}%</p>
        <button class="content-credit-btn font-36" @click='goNext("loanSelect")'>去借钱</button>
      </div>
    </div>
    <div class="product-result-bottom">
      <!--<group v-if='userStatus == 5'>
        <cell-box @click.native='goNext("loanList")' is-link>我的借款</cell-box>
      </group>-->
      <group>
        <cell-box class="font-32" @click.native='showBank=true' is-link>我的银行卡</cell-box>
        <cell class="font-32" title="手机号" :value='moreTelephone' ></cell>
      </group>
      <group class="manager-group" v-if='userStatus >= 3'>
        <cell-box class="font-32" @click.native='goNext("mention")' is-link>提升额度</cell-box>
      </group>
      <group class="manager-group">
        <cell-box class="font-32" @click.native='goNext("share")' is-link>分享有礼</cell-box>
      </group>
      <group class="manager-group">
        <cell-box class="font-32" @click.native='goNext("manager")' is-link>我的客户经理</cell-box>
      </group>
      <group class="manager-group">
        <cell-box class="font-32" @click.native='goNext("login")' is-link>切换帐号</cell-box>
      </group>
    </div>
    <popup v-model="showBank" position="bottom" height="50%" style="background: #fff">
      <div class="bank-container">
        <p  class="bank-title font-36">我的银行卡</p>
        <ul class="bank-list-wrapper">
          <li class="bank-list font-32" v-for="(item, index) in bankcard" :key="index" @click="chooseBank(item.bankName, item.bankNo, item.code)">
            <span class="bank-name">{{item.bankName}}</span>
            <span class="bank-num">{{item.bankTailNo}}</span>
          </li>
        </ul>
      </div>
    </popup>
  </div>
</template>

<script>
import { Group, Cell, CellBox, Popup } from 'vux'
import Config from '../../config/index'
import { wxMe, perBankcard } from '../../service/getData'
import Utils from '../../config/utils'
import Sto from 'store'

export default {
  components: {
    Group,
    Cell,
    CellBox,
    Popup
  },
  data () {
    return {
      userStatus: 0,
      showLogin: false,
      telephone: '',
      creditAmount: '',    // 授信额度
      creditBalance: '',   // 授信余额
      dailyRate: '',        // 日利率(万分之一)
      showBank: false,
      bankcard: [],
      enterpSymbol: ''      // 图片地址
    }
  },
  computed: {
    moreTelephone () {
      let telephone = this.telephone
      if (telephone) {
        telephone = telephone.substring(0, 3) + '****' + telephone.substring(7, 11)
      }
      return telephone
    }
  },
  created () {
    const that = this
    that.$vux.loading.show()
    wxMe({}).then(res => {
      that.$vux.loading.hide()
      if (res.code === Config.resCode.success) {
        const data = res.data
        let cookies = Sto.get(Config.constants.cookies)
        cookies.enterpSymbol = res.data.enterpSymbol
        cookies.enterPriseName = res.data.enterPriseName
        cookies.userCode = res.data.userCode
        if (cookies.isIpieces) delete cookies.isIpieces
        this.enterpSymbol = res.data.enterpSymbol
        Sto.set(Config.constants.cookies, cookies)
        // 借款合同是否显示
        sessionStorage.setItem(Config.constants.loanContractAuth, res.data.auth)
        if (data) {
          const status = data.status
          if (status === 1) { // 无帐号
            that.$router.push(Config.constants.loginRouter)
          } else {
            that.getBankCard()
          }
          that.showLogin = true
          that.userStatus = data.status
          that.telephone = data.telephone
          that.creditAmount = data.creditAmount
          that.creditBalance = data.creditBalance
          that.dailyRate = data.dailyRate
          Utils.countPlus({'userName': data.telephone}, 'register')
        }
      } else {
        that.$vux.toast.text(res.msg)
      }
    })
  },
  mounted () {
    Sto.remove('MCWP_LOAN_SELECT')
  },
  methods: {
    goNext (type) { // 我要贷款
      const that = this
      if (type === 'borrow') {
        that.$router.push(Config.constants.productRouter)
      }
      // if (type === 'bank') { // 我的银行卡
      //   console.log('银行卡')
      // }
      if (type === 'manager') { // 我的业务经理
        that.$router.push(Config.constants.accManager)
      }
      if (type === 'loanSelect') { // 借钱
        if (!+this.creditBalance) {
          return that.$vux.toast.text('无可用额度')
        }
        that.$router.push(Config.constants.loanSelectRouter)
      }
      if (type === 'loanList') {  // 借款列表
        that.$router.push(Config.constants.loanListRouter)
      }
      if (type === 'share') {  // 分享有礼
        that.$router.push(Config.constants.shareIntroduceRouter)
      }
      if (type === 'mention') { // 提额
        that.$router.push(Config.constants.mentionRouter)
      }
      if (type === 'login') { // 登录
        that.$router.push(Config.constants.loginRouter)
      }
    },
    async getBankCard () {
      let res = await perBankcard()
      if (res.code - 0 === 0) {
        this.bankcard = res.data
      } else {
        alert(res.msg)
      }
    }
  }
}
</script>

<style lang="less">
.borrow-personal {
  .center {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
  }
  .borrow-personal-top {
    background: #369bff;
    position: relative;
    width: 100%;
    padding: .4rem 0 .8rem;
    .enterpSymbol {
      margin: 1.6rem 0 .6rem;
      width: 1.44rem;
      height: 1.44rem;
    }
    &.loan-verify-bg {
      // background: url(../../assets/loan-verify-bg.png) no-repeat center center;
      background: #369bff;
      // background-size: cover;
    }
    &.loan-refuse-bg {
      // background: url(../../assets/loan-refuse-bg.png) no-repeat;
      background: #369bff;
      // background-size: cover;
    }
    .borrow-personal-go {
      width: 4.8rem;
      height: 1.2rem;
      line-height: 1.2rem;
      border-radius: .78rem;
      color: #369fff;
      // color: #fff;
      background-color: #fff;
      text-align: center;
      margin-bottom: 1rem;
    }
  }
  .product-tip-content {
    background: transparent;
    // opacity: .8;
    margin: 0 auto;
    text-align: center;
    line-height: 1.08rem;
    margin-bottom: 1rem;
  }
  .content-refuse{
    width: 7.66rem;
    height: 1.08rem;
    // color: #ff3f36;
    color: #fff;
  }
  .content-verify{
    width: 9.4rem;
    height: 1.08rem;
    // color: #369bff;
    color: #fff;
    animation: opacityChange 4s linear infinite;
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
    // border-bottom: .01rem solid #7b7b7b;
    box-sizing: border-box;
    background-color: #fff;
  }
  .bank-title::after {
    content:'';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    border-top: 1px solid #e5e5e5;
    transform: scaleY(.5);
  }
  .bank-list-wrapper {
    // margin-bottom: 1.36rem;
    padding-top: 1.42rem;
  }
  .bank-list {
    position: relative;
    line-height: 1.36rem;
    // font-size: .38rem;
    margin-left: .5rem;
    .bank-name {
      color: #494949;
    }
    .bank-num {
      padding-left: .5rem;
      color: #818181;
    }
  }
  .bank-list::after {
    content:'';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    border-top: 1px solid #e5e5e5;
    transform: scaleY(.5);
  }
  .top-credit-tip{
    color: #fff;
    background: url(../../assets/borrow-credit.png) no-repeat no-repeat .5rem center;
    background-size: .38rem .38rem;
    padding-left: 1.02rem;
  }
  .product-credit-content{
    text-align: center;
    padding-top: .44rem;
    .content-credit-p1{
      color: #fff;
    }
    .content-credit-p2{
      padding-top: .39rem;
      color: #fff;
    }
    .content-credit-p3{
      padding-top: .3rem;
      color: #e4efff;
    }
    .content-credit-btn{
      width: 3.5rem;
      height: 1rem;
      border-radius: .5rem;
      background: #fff;
      color: #369bff;
      margin-top: .5rem;
      line-height: 1rem;
    }
  }
  .weui-cell{
    color: #3f3f3f!important;
    padding: .5rem;
  }
  .weui-cell:before{
    color: #e5e5e5!important;
    left: .5rem;
  }
  .weui-cell:after{
    color: #e5e5e5;
  }
  .weui-cells{
    margin-top:0;
    font-size: .4rem;
  }
  .weui-cell_access.vux-cell-box:after{
    width: .34rem;
    height: .34rem;
    margin-top: -.17rem;
    right: .44rem;
  }
  .manager-group{
    margin-top: .3rem;
  }
  @keyframes opacityChange {
    0% {
      opacity: 1
    }
    50% {
      opacity: 0
    }
    100% {
      opacity: 1
    }
  }
}
</style>
