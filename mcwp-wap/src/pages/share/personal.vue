<template>
  <div class="share-personal">
    <img class='share-personal-bg' src='./../../assets/share-personal.png' />
    <div class="personal-main">
      <p class="personal-title font-40">可提现金额(元)</p>
      <p class="personal-num font-90">{{unDepositCount}}</p>
      <div class="personal-content">
        <div class="content-left">
          <p class="personal-total font-36">累计总金额(元)</p>
          <p class="personal-price font-50">{{totalNum}}</p>
        </div>
        <div class="content-right">
          <p class="personal-total font-36">已提现金额(元)</p>
          <p class="personal-price font-50">{{depositCount}}</p>
        </div>
      </div>
      <v-button @next='nextStep'>提现</v-button>
    </div>
  </div>
</template>

<script>
import Store from 'store'
import Config from '../../config/index'
import VButton from './../../components/button'
import { getLoanshare, postShareDeposit } from '../../service/getData'

export default {
  components: {
    VButton
  },
  data () {
    return {
      loanCode: '',
      totalNum: '0',
      unDepositCount: '0',
      depositCount: '0'
    }
  },
  created () {
    const that = this
    const cookies = Store.get(Config.constants.cookies)
    that.loanCode = cookies.userCode
    that.prdType = cookies.prdType
    that.loanRoutes = cookies.loanRoutes
  },
  mounted () {
    const that = this
    // if (!that.loanCode) return
    getLoanshare({code: that.loanCode}).then(res => {
      that.$vux.loading.hide()
      if (res.code === Config.resCode.success) {
        const data = res.data
        if (data) {
          if (data.bkgeCount) that.totalNum = data.bkgeCount
          if (data.unDepositCount) that.unDepositCount = data.unDepositCount
          if (data.depositCount) that.depositCount = data.depositCount
        }
      } else {
        that.$vux.toast.text(res.msg)
      }
    })
  },
  methods: {
    async nextStep () {
      const that = this
      const unDepositCount = that.unDepositCount
      if (!unDepositCount) return that.$vux.toast.text(Config.constants.nullTotalNum)
      const res = await postShareDeposit()
      console.log(res)
      if (res.code === Config.resCode.success) {
        this.$router.push(Config.constants.shareSuccessRouter)
      } else {
        that.$vux.loading.hide()
        that.$vux.toast.text(res.msg)
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .share-personal{
    position: relative;
    .share-personal-bg {
      width: 100%;
    }
    .personal-main{
      position: absolute;
      top: 0;
      width: 100%;
    }
    .personal-title{
      text-align: center;
      color: #fff;
      margin-top: 1.2rem;
    }
    .personal-num{
      text-align: center;
      color: #fff;
      margin-top: .48rem;
      height: 1.38rem;
    }
    .personal-content{
      width: 10rem;
      height: 3.08rem;
      background: #fff;
      margin: 0 auto;
      margin-top: .96rem;
      border-radius: .24rem;
    }
    .content-left{
      width: 50%;
      height: 100%;
      float: left;
    }
    .content-right{
      width: 50%;
      height: 100%;
      float: left;
    }
    .personal-total{
      color: #666;
      text-align: center;
      margin-top: .7rem;
    }
    .personal-price{
      color: #333;
      text-align: center;
      margin-top: .48rem;
    }
  }
</style>
