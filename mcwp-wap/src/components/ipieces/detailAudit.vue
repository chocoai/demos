<template>
  <div class="audit-container">
    <div class="top-btn-container">
      <div class="top-btn" ref="topBtn">
        <p v-if="loanAuditVOList && loanAuditVOList.length > 0" class="audit-top">
          <img class="audit-img" src="../../assets/approval-record.png" alt="审批记录" />
          <span @click="showAudit=true" class="approve-result">查看审批记录</span>
        </p>
        <p class="audit-top" v-if="loanOperatorVO && loanOperatorVO.length > 0">
          <img class="personnel-icon" src="../../assets/personnel-icon.png" alt="人员信息" />
          <span @click="showPersonal=true" class="personnel-result">人员信息</span>
        </p>
        <p v-if="top.isHouseAuditSubmit" class="audit-top">
          <img class="audit-img" src="../../assets/icon_trial_report.png" alt="初审报告" />
          <span @click="goTrialReport" class="approve-result">初审报告</span>
        </p>
        <div v-if="top.auditStatus && top.auditStatus==='审批通过'">
          <p class="audit-result">审批结果:&nbsp&nbsp<span class="audit-result-pass">{{top.auditStatus}}</span></p>
          <p v-if="showTop" class="audit-result">授信金额:&nbsp&nbsp{{top.authMoney || 0}}元</p>
          <p v-if="top.auditStatus==='综合授信审批通过' && top.dailyRate" class="audit-result">借款日利率:&nbsp&nbsp{{top.dailyRate || '%'}}元</p>
          <p v-if="top.auditStatus==='综合授信审批通过' && top.fnlStore" class="audit-result">评分:&nbsp&nbsp{{top.fnlStore || 0}}</p>
        </div>
        <div v-else-if="top.auditStatus && top.auditStatus==='审批拒绝'">
          <p class="audit-result">审批结果:&nbsp&nbsp<span class="audit-result-reject">{{top.auditStatus}}</span></p>
          <p v-if="showTop" class="audit-result">拒绝原因:&nbsp&nbsp{{top.rejectReasonOther || top.rejectReason}}</p>
        </div>
        <img v-if="!showTop" class="show-icon" @click="$emit('topChange')" src='../../assets/ipieces-top-show.png' alt='top-show' />
      </div>
    </div>
    <div v-transfer-dom>
      <x-dialog v-model="showAudit" hide-on-blur :dialog-style="{'max-width': '80%', width: '80%', height: '60%', padding: '.6rem', overflow: 'scroll'}">
        <p class="audit-title">审批记录</p>
        <ul>
          <li class="audit-item" v-for="(item, index) in loanAuditVOList" :key="index">
            <p>{{formatDateTime(item.operateDate)}}</p>
            <p class="audit-status"><span>{{item.event}}:&nbsp&nbsp{{item.operatePeople}}</span></p>
            <p class="audit-status" v-if="item.eventResult">结果:{{item.eventResult}}</p>
            <p class="audit-p"><pre>{{item.descr}}</pre></p>
          </li>
        </ul>
        <p v-if="(!loanAuditVOList || !loanAuditVOList.length)">暂无审批记录</p>
      </x-dialog>
    </div>
    <div v-transfer-dom>
      <x-dialog v-model="showPersonal" hide-on-blur :dialog-style="{'max-width': '80%', width: '80%', height: '60%', padding: '.6rem', overflow: 'scroll'}">
        <p class="audit-title">人员信息</p>
        <ul v-if="loanOperatorVO">
          <li class="audit-item">
            <p class="personal-p" v-if="loanOperatorVO.mainCustomer">主调客户经理:{{loanOperatorVO.mainCustomer}}</p>
            <p class="personal-p" v-if="loanOperatorVO.escortCustomer">陪调客户经理:{{loanOperatorVO.escortCustomer}}</p>
            <p class="personal-p" v-if="loanOperatorVO.examintor">审查员:{{loanOperatorVO.examintor}}</p>
            <p class="personal-p" v-if="loanOperatorVO.creditReviewer">贷审员:{{loanOperatorVO.creditReviewer}}</p>
          </li>
        </ul>
        <p v-if="!loanOperatorVO">暂无人员信息</p>
      </x-dialog>
    </div>
  </div>
</template>

<script>
import { XDialog, TransferDomDirective as TransferDom } from 'vux'
import Utils from '../../config/utils'

export default {
  directives: {
    TransferDom
  },
  components: {
    XDialog
  },
  props: ['showTop', 'top', 'loanAuditVOList', 'loanOperatorVO'],
  data () {
    return {
      showAudit: false,
      showPersonal: false
    }
  },
  created () {
    console.log(JSON.stringify(this.top) + '>top')
  },
  methods: {
    formatDateTime (time) {
      return Utils.formatDateTime(time)
    },
    goTrialReport () {
      this.$router.push(`/h5/trial/report?code=${Utils.getUrlkey(window.location.search)['code']}&token=${Utils.getUrlkey(window.location.search)['token']}`)
    }
  }
}
</script>

<style lang="less" scoped>
.top-btn-container {
  background: #F7F7FA;
  width: 100%;
  height: 1.68rem;
}
.top-btn {
  font-size: .32rem;
  width: 10rem;
  height: 1.2rem;
  background-color: #fff;
  position: relative;
  top: .24rem;
  left: .4rem;
  border-radius: .18rem;
}
.audit-top {
  padding-left: .4rem;
  height: 1.2rem;
  line-height: 1.2rem;
  display: inline-block;
  color: #369fff;
  vertical-align: middle;
  position: relative;
}
.audit-result {
  // height: .68rem;
  line-height: .68rem;
  color: #6b6b6b;
}
.audit-img {
  width: .4rem;
  height: .4rem;
  vertical-align: middle;
}
.show-icon {
  width: .6rem;
  height: .6rem;
  position: absolute;
  top: .3rem;
  right: .4rem;
}
.audit-title {
  font-size: .42rem;
  color: #000;
  padding-bottom: .68rem;
}
.audit-item {
  font-size: .36rem;
  line-height: .76rem;
  text-align: left;
  margin-bottom: .2rem;
  overflow: hidden;
}
.audit-status {
  display: flex;
  justify-content: space-between;
}
.audit-result-pass {
  color: #43b549;
  font-size: .38rem;
}
.audit-result-reject {
  color: #ff0000;
  font-size: .38rem;
}
.reason-left {
  float: left;
  width: 12%;
}
.reason-right {
  float: left;
  width: 88%;
}
.personnel-icon {
  width: .4rem;
  height: .4rem;
  vertical-align: middle;
}
.personal-p {
  line-height: 1rem;
}
</style>
