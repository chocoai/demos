<template>
  <div class="repay-container">
    <div class="repay">
      <p class="repay-title font-36">{{repayPlan.repaymentDate?`每月${repayPlan.repaymentDate}日`:"确定还款日后"}}&nbsp自动还款</p>
      <p class="repay-content font-28">请在还款日三天前存入足够资金至您的还款账户中</p>
    </div>
    <div class="repay-timeline">
      <timeline :list="repayPlan.list"></timeline>
    </div>
  </div>
</template>

<script>
import Timeline from './../../components/timeline'
import { repayPlanAct, repayPlanActToken } from '../../service/getData'
import Utils from '../../config/utils'

export default {
  components: {
    Timeline
  },
  data () {
    return {
      repayPlan: {}
    }
  },
  methods: {
    async repaymentplan (code) {
      let token = Utils.getUrlkey(window.location.search)['token']
      let res
      if (token) {
        res = await repayPlanActToken({borrowCode: code}, token)
      } else {
        res = await repayPlanAct({code: code})
      }
      if (res.code - 0 === 0) {
        this.repayPlan = res.data
      } else {
        alert(res.msg)
      }
    }
  },
  created () {
    this.repaymentplan(this.$route.params.code)
  }
}
</script>

<style lang="less" scoped>
.repay-container {
  position: relative;
  padding-top: 3.8rem;
  box-sizing: border-box;
  height: 100%;
  .repay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3rem;
    margin: .4rem .34rem 0;
    background-color: #fff;
    text-align: center;
    border-radius: .2rem;
    .repay-title {
      padding-top: .5rem;
      // font-size: .44rem;
      line-height: 1.04rem;
      color: #010101;
    }
    .repay-content {
      // font-size: .36rem;
      color: #8c8c8c;
      line-height: .96rem
    }
  }
  .repay-timeline {
    box-sizing: border-box;
    padding-top: .8rem;
    margin: 0 .34rem;
    background-color: #fff;
    height: 100%;
    overflow: scroll;
  }
}
</style>
