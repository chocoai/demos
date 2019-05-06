<template>
  <div class="loan-accredit">
    <div class="accredit-content">
      <img class="bank-icon" :src="enterpriseIcon" v-if="enterpriseIcon"/>
      <img class="bank-icon" src="../../assets/bank_icon.png" v-if="!enterpriseIcon"/>
      <p class="content-tip">该服务由{{name}}提供，向其提供以下权限即可继续操作</p>
      <p class="content-list">核实您的身份信息</p>
      <p class="content-list">查询您的个人征信信息</p>
      <p class="content-confirm confirm-p1">确认授权即表示同意<span class="accredit-book" @click='viewContract'>《用户授权协议》</span></p>
    </div>
    <v-button class="confirm-btn" @next='nextStep'>确定</v-button>
  </div>
</template>

<script>
import VButton from './../../components/button'
import Store from 'store'
import Utils from '../../config/utils'
import Config from '../../config/index'
import { getAccreditSign } from '../../service/getData'
export default {
  components: {
    VButton
  },
  data () {
    return {
      name: '',
      enterpriseIcon: '',
      getTime: new Date().getTime()   // 时长统计
    }
  },
  created () {
    const that = this
    const cookies = Store.get(Config.constants.cookies)
    that.loanCode = cookies.loanCode
    that.open = cookies.open
    that.loanRoutes = cookies.loanRoutes
    that.enterpriseCode = cookies.enterpriseCode
    that.enterpriseIcon = cookies.enterpriseIcon
    that.name = cookies.enterpriseName
  },
  mounted () {
    this.$vux.loading.hide()
    Utils.countPlus('用户授权', 'send')
  },
  beforeDestroy () {
  },
  methods: {
    viewContract () { // 搜索企业
      const that = this
      that.$router.push('/h5/loan/contract')
    },
    async nextStep () { // 下一步
      const that = this
      that.$vux.loading.show({
        text: '请稍候...'
      })
      if (!that.loanCode) return
      const res = await getAccreditSign({loanCode: that.loanCode})
      if (res.code === Config.resCode.success) {
        Utils.countPlus('页面停留时长', 'send', {'pageName': '用户授权', 'stayTime': new Date().getTime() - this.getTime})
        that.$router.push(Config.constants.confirmRouter)
      } else {
        that.$vux.loading.hide()
        that.$vux.toast.text(res.msg)
      }
    }
  }
}
</script>

<style lang="less">
  .accredit-content {
    padding: .64rem .8rem;
    background: #fff;
    .bank-icon{
      width: 2rem;
      height: 2rem;
      display: block;
      margin: 0 auto;
    }
    .content-tip{
      font-size: .44rem;
      color: #555;
      margin-top: .4rem;
      line-height: .8rem;
    }
    .content-list {
      color: #999;
      font-size: .42rem;
      position: relative;
      padding-left: .72rem;
      margin-top: .64rem;
    }
    .content-list::before{
      content: "";
      position: absolute;
      width: .16rem;
      height: .16rem;
      background: #aaa;
      background-size: cover;
      top: .16rem;
      left: .16rem;
    }
    .confirm-p1{
      margin-top: 1.04rem;
    }
    .confirm-p2{
      margin-left: 3.6rem;
    }
    .content-confirm{
      font-size: .4rem;
      color: #555;
    }
    .content-confirm+.content-confirm{
      margin-top: .2rem;
    }
    .accredit-book{
      color: #369fff;
    }
  }
  .confirm-btn{
    width: 9.2rem!important;
    height: 1.44rem!important;
    color: #fff!important;
    font-size: 0.5rem!important;
    margin-top: 1.1rem!important;
  }
</style>
