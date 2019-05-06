<template>
  <div class='com-res-container' v-if="success">
    <div v-if="result">
        <div class="loan-pass">
          <p class="number font-90">提交成功</p>
          <p class="mini-rote">请等候短信通知</p>
        </div>
    </div>
    <branch-list v-if="result" :branchList="branchList" :style="styleObject" />
    <div class="loan-refuse" v-else>
      <img class="success-img" src="../../assets/loan-refuse.png" alt="success" />
      <!-- <p class="submit font-90">{{error ? '审核验证失败' : '审核拒绝'}}</p> -->
      <p class="wait font-28">{{ errorMsg }}</p>
      <!-- <p class="wait font-28">可联系下方网点进行咨询</p> -->
    </div>
  </div>
</template>

<script>
import { finishLoan, getBranchList, postFirstAudit } from '../../service/getData'
import BranchList from './../../components/loan/branchList'
import Utils from '../../config/utils'
import Config from '../../config/index'
import Store from 'store'

export default {
  components: {
    BranchList
  },
  props: ['city'],
  data () {
    return {
      branchList: [],
      resType: '17',   // 等待下个结果页
      result: false,
      success: false,
      error: false,    // 接口异常
      errorMsg: '审核验证系统异常，请稍后重试',
      enterpriseCode: '',
      amount: 0,
      minimumRate: 0,
      startRate: 0,
      yearInterest: null,
      styleObject: {},
      firstAuditUrl: '',
      qrImg: Utils.getReferer(),
      getTime: new Date().getTime()    // 时长统计
    }
  },
  created () {
    this.$vux.loading.show({
      text: 'Loading'
    })
    const cookies = Store.get(Config.constants.cookies)
    this.loanCode = cookies.loanCode
    this.enterpriseCode = cookies.enterpriseCode
    this.rateProdName = cookies.rateProdName
    this.qrCodeUrl = cookies.qrCodeUrl
    this.getBranchList()
    this.signFinish()
  },
  mounted () {
    Utils.countPlus('申请成功', 'send')
  },
  destroyed () {
    // Store.clearAll()
    // 删除未完成组件缓存
    Store.remove(Config.constants.citizenFirstStep())
    Utils.countPlus('页面停留时长', 'send', {'pageName': '申请成功', 'stayTime': new Date().getTime() - this.getTime})
  },
  methods: {
    async getBranchList () {
      const that = this
      const res = await getBranchList({enterpriseCode: that.enterpriseCode})
      if (res.code === Config.resCode.success) {
        this.branchList = res.data
      } else {
        that.$vux.loading.hide()
      }
    },
    async signFinish () {
      const that = this
      // 删除未完成组件缓存
      Store.remove(Config.constants.citizenFirstStep())

      const res = await postFirstAudit({reqCode: that.loanCode}, this.firstAuditUrl)
      if (res.code === Config.resCode.success) {
        this.result = true
        // this.result = +res.data.success
        // if (+res.data.success) {
        //   this.amount = res.data && res.data.amount
        //   this.startRate = res.data && res.data.startRate
        //   this.minimumRate = res.data && res.data.minimumRate
        //   this.weChatCode = res.data && res.data.weChatCode
        //   this.bankCode = res.data && res.data.bankCode
        //   let monthRate = this.minimumRate * 30 / 10000
        //   let yearInterest = ((((this.amount * monthRate * Math.pow(1 + monthRate, 12))) / (Math.pow(1 + monthRate, 12) - 1)) * 12 - this.amount) + ''
        //   this.yearInterest = yearInterest.match(/\./) === null ? yearInterest : yearInterest.substr(0, yearInterest.match(/\./).index)
        // }
      } else {
        that.$vux.loading.hide()
        that.success = true
        that.result = false
        that.errorMsg = '审核验证系统异常，请稍后重试'
        return
        // that.$vux.toast.text(res.msg)
      }
      const final = await finishLoan({code: that.loanCode})
      that.$vux.loading.hide()
      if (final.code === Config.resCode.success) {
        that.success = true
      } else {
        that.$vux.toast.text(final.msg)
      }
    },
    interest (amount, startRate) {
      let monthRate = startRate * 30 / 10000
      return ((((amount * monthRate * Math.pow(1 + monthRate, 12))) / (Math.pow(1 + monthRate, 12) - 1)) * 12 - this.amount) + ''
    }
  }
}
</script>

<style lang="less" scoped>
.com-res-container {
  background-color: #F5F5F5;
  min-height: 100%;
  .part-act {
    position: fixed;
    left: 0;
    top: 0;
    overflow: hidden;
    width: 100%;
    height: 100vh;
    z-index: 100;
    .img {
      width: 100%;
      height: 100%;
      display: block;
    }
  }
  .loan-pass {
  padding-top: 1.12rem;
  display: flex;
  align-items: center;
  flex-direction: column;
  color: #fff;
  height: 5.48+0.88rem;
  background: url(../../assets/loan-success-bg.png) no-repeat;
  background-size: cover;
  .number {
    margin-top: 0.4rem;
  }
  .mini-rote {
    font-size: 0.40rem;
    color: white;
    padding-top: 0.48rem;
  }
}
.loan-refuse {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  padding-top: 0.8rem;
  padding-bottom: 1rem;
  .success-img {
    width: 2rem;
    height: 2rem;
    padding-top: 0.5rem;
  }
  .submit {
    margin-top: 0.64rem;
    line-height: 1;
    color: #333;
  }
  .wait {
    margin-top: 0.4rem;
    line-height: 1;
    color: #888;
  }
  .share-btn {
    margin-bottom: 0.8rem;
  }
  .back {
    // margin-top: .2rem;
    line-height: 1;
    padding: 0.8rem 0.2rem;
    color: #369fff;
  }
}
}
</style>
