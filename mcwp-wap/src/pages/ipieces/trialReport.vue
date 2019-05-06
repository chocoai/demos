<template>
  <div class="trial-report" v-if='trialReport'>
    <div class="report-result">
      <div class="result-content" :style="`color: ${trialReport.auditResultRet == 1 ? '#43b549' : '#f82335' }`"><span class="title">审核结果：</span>{{trialReport.auditResult}}</div>
      <div class="result-advice">{{trialReport.auditResultRet == 1 ? '建议进入后续调查环节！' : '建议停止后续调查流程！'}}</div>
    </div>
    <div class="report-customer">
      <h2 class="report-nav">客户信息</h2>
      <div v-if="ossPics.length > 0" class="view-pics" @click="viewPics"><img class="icon-view" src="../../assets/icon_pic_default.png"/><span class="text-view">查看照片</span></div>
      <div class="customer-item first">{{trialReport.cname}}</div>
      <div class="customer-item">身份证号：{{confusionCardno}}</div>
      <div class="customer-item">联系方式：{{trialReport.telephone}}</div>
      <div class="customer-item">房屋单价：{{trialReport.houseUnitPrice ? `${trialReport.houseUnitPrice}元/平` : '暂无信息'}}</div>
      <div class="customer-item">房屋估值：{{trialReport.houseTotal ? `${trialReport.houseTotal}万` : '暂无信息'}}</div>
      <div class="customer-item last">最高可贷额度：{{trialReport.topLoanAmount ? `${trialReport.topLoanAmount}万` : '暂无信息'}}</div>
    </div>
    <div class="report-fit">
      <h2 class="report-nav">初审结果</h2>
      <div class="report-rule-tilte">符合准入规则项</div>
      <div v-if='fitRules.length == 0' class="report-rule-item">暂无</div>
      <div v-else v-for='(item, index) in fitRules' :key='`fitRules${index}`' class="report-rule-item"><span>{{item}}</span></div>
    </div>
    <div class="report-nofit">
      <div class="report-rule-tilte nofit">不符合准入规则项</div>
      <div v-if='noFitRules.length == 0' class="report-rule-item">暂无</div>
      <div v-else v-for='(item, index) in noFitRules' :key='`fitRules${index}`' class="report-rule-item">{{item}}</div>
    </div>
    <div class="result-des">
      <h2 class="result-des-tilte">涉诉情况说明</h2>
      <div class="result-des-content">{{trialReport.caseDesp ? trialReport.caseDesp : '暂无涉诉情况'}}</div>
    </div>
    <div>
      <previewer :list="ossPics" ref="previewer"></previewer>
    </div>
  </div>
</template>

<script>
import { Previewer } from 'vux'
import Utils from '../../config/utils'
import Config from '../../config/index'
import { getFirstAudit, getOSSPicToken } from '../../service/getData'
export default {
  components: {
    Previewer
  },
  data () {
    return {
      trialReport: '',
      ossPics: [],
      preview: false,
      token: Utils.getUrlkey(window.location.search)['token'],
      code: Utils.getUrlkey(window.location.search)['code']
    }
  },
  computed: {
    fitRules () {
      let trialReport = this.trialReport
      if (trialReport && trialReport.fitRules) return Utils.objectV(trialReport.fitRules)
      return null
    },
    noFitRules () {
      let trialReport = this.trialReport
      if (trialReport && trialReport.notFitRules) return Utils.objectV(trialReport.notFitRules)
      return null
    },
    confusionCardno () {
      let trialReport = this.trialReport
      if (trialReport && trialReport.idCardNo) return Utils.confusionStr(trialReport.idCardNo, 4, 4)
    }
  },
  methods: {
    viewPics () { // 查看照片
      const that = this
      that.$nextTick(() => {
        that.$refs.previewer.show(0)
      })
    },
    async getFirstAudit (params, token) {
      const that = this
      const res = await getFirstAudit(params, token)
      if (res.code === Config.resCode.success) {
        that.trialReport = res.data
      } else {
        that.$vux.toast.text(res.msg)
      }
    },
    async getOSSPic (params) {
      const that = this
      const res = await getOSSPicToken(params, that.token)
      if (res.code === Config.resCode.success) {
        const data = res.data
        let pics = []
        let ossPics = []
        if (data.LOAN_PLEDGEHOUSE_LOCATED) ossPics = ossPics.concat(data.LOAN_PLEDGEHOUSE_LOCATED)
        if (data.LOAN_PLEDGEHOUSE_PAPER) ossPics = ossPics.concat(data.LOAN_PLEDGEHOUSE_PAPER)
        if (data.LOAN_PLEDGEHOUSE_REGISTER) ossPics = ossPics.concat(data.LOAN_PLEDGEHOUSE_REGISTER)
        if (data.LOAN_PERSON_IDENTITY_BACK) ossPics = ossPics.concat(data.LOAN_PERSON_IDENTITY_BACK)
        if (data.LOAN_PERSON_IDENTITY_FRONT) ossPics = ossPics.concat(data.LOAN_PERSON_IDENTITY_FRONT)
        ossPics.forEach((item, index) => {
          if (item) {
            pics.push({
              src: item.srcUrl
            })
          }
        })
        that.ossPics = pics
      } else {
        that.$vux.toast.text(res.msg)
      }
    }
  },
  created () {
    const that = this
    that.getFirstAudit({reqCode: that.code}, that.token)
    const params = {
      bizCode: that.code,
      bizTypes: 'LOAN_PERSON_IDENTITY_FRONT,LOAN_PERSON_IDENTITY_BACK,LOAN_PLEDGEHOUSE_PAPER,LOAN_PLEDGEHOUSE_LOCATED,LOAN_PLEDGEHOUSE_REGISTER',
      fileTypes: 'picture'
    }
    that.getOSSPic(params)
  }
}
</script>

<style lang="less" scoped>
.trial-report {
  min-height: 17.04rem;
  background-color: #fff;
  .report-result {
    padding: .64rem .72rem;
    font-size: .4rem;
    border-bottom: .08rem solid #f5f5f5;
    .result-content {
      color: #43b549;
      .title {
        color: #333;
      }
    }
    .result-advice {
      color: #666;
      margin-top: .48rem;
    }
  }
  .report-nav {
    position: relative;
    font-size: .44rem;
    padding: 0 .48rem 0 .96rem;
    color: #333;
    &:before {
      content: '';
      position: absolute;
      left: .48rem;
      top: .12rem;
      height: .36rem;
      width: .18rem;
      background-color: #369fff;
      border-radius: .18rem;
    }
  }
  .report-customer {
    position: relative;
    padding: .4rem 0 .64rem 0;
    border-bottom: .08rem solid #f5f5f5;
    .view-pics {
      position: absolute;
      right: .48rem;
      top: .4rem;
      color: #999;
      font-size: .4rem;
      line-height: .64rem;
      .icon-view {
        width: .64rem;
        height: .64rem;
        display: inline-block;
        vertical-align: middle;
        margin-right: .2rem;
      }
      .text-view {
        display: inline-block;
        vertical-align: middle;
      }
    }
    .customer-item {
      padding: 0 .72rem;
      margin-bottom: .36rem;
      color: #333;
      font-size: .4rem;
      &.first {
        font-size: .44rem;
        margin-bottom: .44rem;
        margin-top: .64rem;
      }
      &.last {
        margin-bottom: 0;
      }
    }
  }
  .report-fit {
    padding: .4rem 0 .64rem 0;
    border-bottom: .08rem solid #f5f5f5;
  }
  .report-nofit {
    padding: .4rem 0 .64rem 0;
    border-bottom: .08rem solid #f5f5f5;
  }
  .report-rule-tilte {
    font-size: .4rem;
    color: #555;
    padding: 0 .72rem;
    margin-top: .64rem;
    &.nofit {
      margin-top: 0;
    }
  }
  .report-rule-item {
    position: relative;
    margin-top: .36rem;
    padding: 0 .72rem 0 1.12rem;
    &:before {
      content: '';
      position: absolute;
      width: .16rem;
      height: .16rem;
      border-radius: 50%;
      background-color: #9acfff;
      left: .72rem;
      top: 50%;
      margin-top: -.08rem;
    }
  }
  .result-des {
    padding: .4rem .72rem .64rem .72rem;
    .result-des-tilte {
      font-size: .4rem;
      color: #555;
    }
    .result-des-content {
      margin-top: .48rem;
      font-size: .4rem;
      color: #555;
    }
  }
}
</style>
