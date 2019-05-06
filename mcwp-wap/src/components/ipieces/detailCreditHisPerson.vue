<template>
  <div>
    <div class="credit-container" >
          <p class="p-title">个人央行征信情况</p>
          <div class="base-content" v-if='creditHisCustomer' >
              <!-- <div v-if="identityResult">
                <p class="col-p">
                  <span class="lable-span">身份证与姓名是否一致:</span> <span className="verify-true" v-if="identityResult.idNameCheckResult">是</span><span className="verify-false" v-else>否</span>
                </p>
                <p class="col-p">
                  <span class="lable-span">手机号是否实名认证:</span>  <span className="verify-true" v-if="identityResult.idNameCheckResult">是</span><span className="verify-false" v-else>否</span>
                </p>
              </div>
              <p class="col-p" v-else>
                <span class="row-p">核身模型暂未验证</span>
              </p> -->
              <div v-if="creditQueryResult">
                <p class="col-p" v-if="creditQueryResult.pbocScore">
                  <span class="lable-span">央行授信评分:</span> <span className="verify-true">{{creditQueryResult.pbocScore}}{{creditQueryResult.pbocScore < 490 ? '征信较差' : 490 < creditQueryResult.pbocScore && creditQueryResult.pbocScore < 510 ? '征信一般' : 510 < creditQueryResult.pbocScore && creditQueryResult.pbocScore < 530 ? '征信良好' : '征信优秀'}}</span>
                  <span class="checkout-result-success">
                    <img class="icon-explain" src="../../assets/icon_explain.png"/>
                    <Popover :placement='true' class="popover-show">
                      <div class="creContent-container">
                          <p className="creContent-p">征信较差:分值范围[-,490]</p>
                          <p className="creContent-p">征信一般:分值范围[490,510]</p>
                          <p className="creContent-p">征信良好:分值范围[510,530]</p>
                          <p className="creContent-p">征信优秀:分值范围[530,+]</p>
                      </div>
                    </Popover>
                  </span>
                </p>
                <p class="col-p" v-else>
                  <span class="lable-span">央行拒绝原因:</span> <span className="verify-true">{{creditQueryResult.message}}</span>
                </p>
              </div>
              <p class="col-p" v-else>
                <span class="row-p">征信模型暂未验证</span>
              </p>
              <p class="col-p">
                <span class="row-p-problem" v-if='creditHisCustomer'>
                  {{proValueText}}
                </span>
                <span class="row-p-problem"  v-if='!creditHisCustomer'>
                  暂无征信分析情况
                </span>
              </p>
              <ul v-if='creditHisCustomer.loanCreditTaints'>
                <li class="col-p" v-for='item in creditHisCustomer.loanCreditTaints' :key="item">
                  <span class="problem-icon"></span>
                  <span class="row-p-problem problem-content">{{item.remark}}</span>
                </li>
              </ul>
          </div>
          <p class="no-data" v-if='!creditHisCustomer' > 暂无征信情况 </p>
    </div>
    <div class="credit-container" v-if='creditCentralBankInfo'>
          <p class="p-title">央行征信信息详情</p>
          <div class="base-content" v-if='creditCentralBankInfo' >
            <p class="col-p">
              <span class="lable-span bold-lable">人行信用记录是否为空白:</span>
              <span class="content-span">{{creditCentralBankInfo.peopleBankRecord && creditCentralBankInfo.peopleBankRecord ? '是' : '否' }}</span>
            </p>
             <div v-if='!creditCentralBankInfo.peopleBankRecord' >
              <p class="col-p">
                <span class="lable-span bold-lable">是否有法院强制执行记录:</span>
                <span class="content-span">{{creditCentralBankInfo.hasForceExecution && creditCentralBankInfo.hasForceExecution ? '是' : '否'}}</span>
              </p>
              <p class="col-p">
                <span class="lable-span bold-lable">是否出现‘低保救助记录’:</span>
                <span class="content-span">{{creditCentralBankInfo.hasSalvationRecord && creditCentralBankInfo.hasSalvationRecord ? '是' : '否'}}</span>
              </p>
              <p class="col-p">
                <span class="lable-span bold-lable">是否有‘欠税记录’:</span>
                <span class="content-span">{{creditCentralBankInfo.hasTaxArrear && creditCentralBankInfo.hasTaxArrear ? '是' : '否'}}</span>
              </p>
              <p class="col-p">
                <span class="lable-span bold-lable">执业资格记录是否有吊销记录:</span>
                <span class="content-span">{{creditCentralBankInfo.hasCompetenceRevoke && creditCentralBankInfo.hasCompetenceRevoke ? '是' : '否'}}</span>
              </p>
              <p class="col-p">
                <span class="lable-span bold-lable">电信缴费记录‘当前欠费金额’:</span>
                <span class="content-span">{{(creditCentralBankInfo.telPaymentOverdueAmout ||creditCentralBankInfo.telPaymentOverdueAmout === 0) && creditCentralBankInfo.telPaymentOverdueAmout + '元' || '未录入'}}</span>
              </p>
              <p class="col-p">
                <span class="lable-span bold-lable">政处罚记录表中‘处罚金额’:</span>
                <span class="content-span">{{(creditCentralBankInfo.adminPunishmentAmount ||creditCentralBankInfo.adminPunishmentAmount === 0) && creditCentralBankInfo.adminPunishmentAmount + '元' || '未录入'}}</span>
              </p>
              <p class="col-p">
                <span class="lable-span bold-lable">是否出现资产处置、保证人代偿、担保人代偿记录、以资抵债、呆账记录：</span>
                <span class="content-span">{{creditCentralBankInfo.hasBadCreditRecord && creditCentralBankInfo.hasBadCreditRecord ? '是' : '否'}}</span>
              </p>
              <p class="col-p">
                <span class="lable-span bold-lable">未销户贷记卡机构数:</span>
                <span class="content-span">{{(creditCentralBankInfo.loanCardFinanceOrgCount ||creditCentralBankInfo.loanCardFinanceOrgCount === 0) && creditCentralBankInfo.loanCardFinanceOrgCount + '个' || '未录入'}}</span>
              </p>
              <p class="col-p">
                <span class="lable-span bold-lable">最近1个月内的本人查询次数:</span>
                <span class="content-span">{{(creditCentralBankInfo.selfQueryCountIn1m ||creditCentralBankInfo.selfQueryCountIn1m === 0) && creditCentralBankInfo.selfQueryCountIn1m + '次' || '未录入'}}</span>
              </p>
              <p class="col-p">
                <span class="lable-span bold-lable">贷款最近24个月内逾期次数:</span>
                <span class="content-span">{{(creditCentralBankInfo.loanOverdueCountIn24m ||creditCentralBankInfo.loanOverdueCountIn24m === 0) && creditCentralBankInfo.loanOverdueCountIn24m + '期' || '未录入'}}</span>
              </p>
              <p class="col-p">
                <span class="lable-span bold-lable">贷款最长逾期期数:</span>
                <span class="content-span">{{(creditCentralBankInfo.loanMaxOverduePeriod ||creditCentralBankInfo.loanMaxOverduePeriod === 0) && creditCentralBankInfo.loanMaxOverduePeriod + '期' || '未录入'}}</span>
              </p>
              <p class="col-p">
                <span class="lable-span bold-lable">贷款逾期笔数:</span>
                <span class="content-span">{{(creditCentralBankInfo.overdueLoanCount ||creditCentralBankInfo.overdueLoanCount === 0) && creditCentralBankInfo.overdueLoanCount + '笔' || '未录入'}}</span>
              </p>
               <p class="col-p">
                <span class="lable-span bold-lable">贷款最近24个月最大逾期期数:</span>
                <span class="content-span">{{(creditCentralBankInfo.loanMaxOverduePeriodIn24m ||creditCentralBankInfo.loanMaxOverduePeriodIn24m === 0) && creditCentralBankInfo.loanMaxOverduePeriodIn24m + '期' || '未录入'}}</span>
              </p>
              <p class="col-p">
                <span class="lable-span bold-lable">贷款最近1次逾期距今月数:</span>
                <span class="content-span">{{(creditCentralBankInfo.minLoanOverdueMonthDiff ||creditCentralBankInfo.minLoanOverdueMonthDiff === 0) && creditCentralBankInfo.minLoanOverdueMonthDiff + '个月' || '未录入'}}</span>
              </p>
              <p class="col-p">
                <span class="lable-span bold-lable">最近3个月贷款审批查询次数:</span>
                <span class="content-span">{{(creditCentralBankInfo.queryCountForLoanApprovalIn3m ||creditCentralBankInfo.queryCountForLoanApprovalIn3m === 0) && creditCentralBankInfo.queryCountForLoanApprovalIn3m + '次' || '未录入'}}</span>
              </p>
              <p class="col-p">
                <span class="lable-span bold-lable">最近6个月贷款审批查询次数:</span>
                <span class="content-span">{{(creditCentralBankInfo.queryCountForLoanApprovalIn6m ||creditCentralBankInfo.queryCountForLoanApprovalIn6m === 0) && creditCentralBankInfo.queryCountForLoanApprovalIn6m + '次' || '未录入'}}</span>
              </p>
              <p class="col-p">
                <span class="lable-span bold-lable">贷记卡最近3个月内正常还款月数:</span>
                <span class="content-span">{{(creditCentralBankInfo.loanCardNomalPaymentMonIn3m ||creditCentralBankInfo.loanCardNomalPaymentMonIn3m === 0) && creditCentralBankInfo.loanCardNomalPaymentMonIn3m + '个月' || '未录入'}}</span>
              </p>
              <p class="col-p">
                <span class="lable-span bold-lable">贷记卡最近6个月内正常还款月数:</span>
                <span class="content-span">{{(creditCentralBankInfo.loanCardNomalPaymentMonIn6m ||creditCentralBankInfo.loanCardNomalPaymentMonIn6m === 0) && creditCentralBankInfo.loanCardNomalPaymentMonIn6m + '个月' || '未录入'}}</span>
              </p>
              <p class="col-p">
                <span class="lable-span bold-lable">贷记卡最近24个月内正常还款月数:</span>
                <span class="content-span">{{(creditCentralBankInfo.loanCardNomalPaymentMonIn24m ||creditCentralBankInfo.loanCardNomalPaymentMonIn24m === 0) && creditCentralBankInfo.loanCardNomalPaymentMonIn24m + '个月' || '未录入'}}</span>
              </p>
              <p class="col-p">
                <span class="lable-span bold-lable">未销户且共享额度>100的人民币贷记卡账户的平均共享额度:</span>
                <span class="content-span">{{(creditCentralBankInfo.loanCardAvgShareAmount ||creditCentralBankInfo.loanCardAvgShareAmount === 0) && creditCentralBankInfo.loanCardAvgShareAmount + '元' || '未录入'}}</span>
              </p>
              <p class="col-p">
                <span class="lable-span bold-lable">申请人对外担保贷款五级分类为：次级、可疑、损失:</span>
                <span class="content-span">{{(creditCentralBankInfo.telPaymentOverdueAmout ||creditCentralBankInfo.telPaymentOverdueAmout === 0) && creditCentralBankInfo.hasBadCreditFiveClass ? '是' : '否'}}</span>
              </p>
              <p class="col-p">
                <span class="lable-span bold-lable">最近2个月到期负债总额:</span>
                <span class="content-span">{{(creditCentralBankInfo.liabilitiesEndIn2m ||creditCentralBankInfo.liabilitiesEndIn2m === 0) && creditCentralBankInfo.liabilitiesEndIn2m + '元' || '未录入'}}</span>
              </p>
              <p class="col-p">
                <span class="lable-span bold-lable">信用类授信总额:</span>
                <span class="content-span">{{(creditCentralBankInfo.allCreditAmount ||creditCentralBankInfo.allCreditAmount === 0) && creditCentralBankInfo.allCreditAmount + '元' || '未录入'}}</span>
              </p>
              <!-- <p class="col-p">
                <span class="lable-span bold-lable">央行征信贷款种类是否含 '住房:</span>
                <span class="content-span">{{creditCentralBankInfo.iscontainhouse ? creditCentralBankInfo.iscontainhouse ? '是' : '否'  : '未录入'}}</span>
              </p>
              <p class="col-p">
                <span class="lable-span bold-lable">央行征信贷款种类是否含 '车':</span>
                <span class="content-span">{{creditCentralBankInfo.iscontaincar ? creditCentralBankInfo.iscontaincar ? '是' : '否'  : '未录入'}}</span>
              </p> -->

              <p class="col-p">
                <span class="lable-span bold-lable">贷款/贷记卡当前逾期金额:</span>
                <span class="content-span">{{(creditCentralBankInfo.curtOverdueAmt ||creditCentralBankInfo.curtOverdueAmt === 0) && creditCentralBankInfo.curtOverdueAmt + '元' || '未录入'}}</span>
              </p>
              <p class="col-p">
                <span class="lable-span bold-lable">贷记卡最近24个月内逾期次数:</span>
                <span class="content-span">{{(creditCentralBankInfo.creditcardOverdueCountIn24m ||creditCentralBankInfo.creditcardOverdueCountIn24m === 0) && creditCentralBankInfo.creditcardOverdueCountIn24m + '次' || '未录入'}}</span>
              </p>
              <p class="col-p">
                <span class="lable-span bold-lable">贷记卡最近24个月内最大逾期期数:</span>
                <span class="content-span">{{(creditCentralBankInfo.creditcardMaxOverduePeriodIn24m ||creditCentralBankInfo.creditcardMaxOverduePeriodIn24m === 0) && creditCentralBankInfo.creditcardMaxOverduePeriodIn24m + '期' || '未录入'}}</span>
              </p>
              <p class="col-p">
                <span class="lable-span bold-lable">最近12个月贷款审批查询次数:</span>
                <span class="content-span">{{(creditCentralBankInfo.queryCountForLoanApprovalIn12m ||creditCentralBankInfo.queryCountForLoanApprovalIn12m === 0) && creditCentralBankInfo.queryCountForLoanApprovalIn12m + '次' || '未录入'}}</span>
              </p>
              <p class="col-p">
                <span class="lable-span bold-lable">贷记卡最近6个月内最大逾期期数:</span>
                <span class="content-span">{{(creditCentralBankInfo.creditcardMaxOverduePeriodIn6m ||creditCentralBankInfo.creditcardMaxOverduePeriodIn6m === 0) && creditCentralBankInfo.creditcardMaxOverduePeriodIn6m + '期' || '未录入'}}</span>
              </p>
              <p class="col-p">
                <span class="lable-span bold-lable">最近6个月贷款审批查询机构数:</span>
                <span class="content-span">{{(creditCentralBankInfo.querycompForLoanApprovalIn6m ||creditCentralBankInfo.querycompForLoanApprovalIn6m === 0) && creditCentralBankInfo.querycompForLoanApprovalIn6m + '个' || '未录入'}}</span>
              </p>
              <p class="col-p">
                <span class="lable-span bold-lable">最近3个月贷款审批查询机构数:</span>
                <span class="content-span">{{(creditCentralBankInfo.querycompForLoanApprovalIn3m ||creditCentralBankInfo.querycompForLoanApprovalIn3m === 0) && creditCentralBankInfo.querycompForLoanApprovalIn3m + '个' || '未录入'}}</span>
              </p>
              <p class="col-p">
                <span class="lable-span bold-lable">贷款最近6个月内逾期次数:</span>
                <span class="content-span">{{(creditCentralBankInfo.loanOverdueCountIn6m ||creditCentralBankInfo.loanOverdueCountIn6m === 0) && creditCentralBankInfo.loanOverdueCountIn6m + '次' || '未录入'}}</span>
              </p>
              <p class="col-p">
                <span class="lable-span bold-lable">首张贷记卡发卡月份距今月份数:</span>
                <span class="content-span">{{(creditCentralBankInfo.firstCreditCardMonthSeg ||creditCentralBankInfo.firstCreditCardMonthSeg === 0) && creditCentralBankInfo.firstCreditCardMonthSeg + '个月' || '未录入'}}</span>
              </p>
              <p class="col-p">
                <span class="lable-span bold-lable">其他贷款笔数:</span>
                <span class="content-span">{{(creditCentralBankInfo.lnotherloancount ||creditCentralBankInfo.lnotherloancount === 0) && creditCentralBankInfo.lnotherloancount + '笔' || '未录入'}}</span>
              </p>
               <p class="col-p">
                <span class="lable-span bold-lable">未销户贷记卡额度使用率:</span>
                <span class="content-span">{{(creditCentralBankInfo.loanCardUseAvgRate ||creditCentralBankInfo.loanCardUseAvgRate === 0) && creditCentralBankInfo.loanCardUseAvgRate + '%' || '未录入'}}</span>
              </p>
              <p class="col-p">
                <span class="lable-span bold-lable">央行房贷有效月供:</span>
                <span class="content-span">{{(creditCentralBankInfo.effectHouseLoanMonthAmount ||creditCentralBankInfo.effectHouseLoanMonthAmount === 0) && creditCentralBankInfo.effectHouseLoanMonthAmount + '元' || '未录入'}}</span>
              </p>
              <p class="col-p">
                <span class="lable-span bold-lable">央行未销户贷记卡最高授信额度:</span>
                <span class="content-span">{{(creditCentralBankInfo.maxLoanCardCreditAmount ||creditCentralBankInfo.maxLoanCardCreditAmount === 0) && creditCentralBankInfo.maxLoanCardCreditAmount + '元' || '未录入'}}</span>
              </p>
              <!-- <p class="col-p">
                <span class="lable-span bold-lable">过去6个月贷款逾期1及以上的机构数:</span>
                <span class="content-span">{{creditCentralBankInfo.lately6MonthOverdueOrg && creditCentralBankInfo.lately6MonthOverdueOrg + '个' || '未录入'}}</span>
              </p> -->
              <!-- <p class="col-p">
                <span class="lable-span bold-lable">未结清贷款:</span>
                <span class="content-span">{{creditCentralBankInfo.outstandingLoan && creditCentralBankInfo.outstandingLoan + '个' || '未录入'}}</span>
              </p> -->
              <!-- <p class="col-p">
                <span class="lable-span bold-lable">未销户贷记卡和准贷记卡的授信机构数总和:</span>
                <span class="content-span">{{creditCentralBankInfo.totalAuditOrgNum && creditCentralBankInfo.totalAuditOrgNum + '个' || '未录入'}}</span>
              </p> -->
              <!-- <p class="col-p">
                <span class="lable-span bold-lable">过去6个月贷记卡逾期1以及以上的机构数:</span>
                <span class="content-span">{{creditCentralBankInfo.lately6MonthCardOverdueOrg && creditCentralBankInfo.lately6MonthCardOverdueOrg + '个' || '未录入'}}</span>
              </p> -->
              <!-- <p class="col-p">
                <span class="lable-span bold-lable">产生时间最早的一次逾期发生的年月距今月份数:</span>
                <span class="content-span">{{creditCentralBankInfo.earlyOverdueMonthAgo && creditCentralBankInfo.earlyOverdueMonthAgo + '个' || '未录入'}}</span>
              </p> -->
              <!-- <p class="col-p">
                <span class="lable-span bold-lable">贷记卡机构授信平均授信额度:</span>
                <span class="content-span">{{creditCentralBankInfo.averageAuditMoney && creditCentralBankInfo.averageAuditMoney + '个' || '未录入'}}</span>
              </p> -->
              </div>
          </div>
          <p class="no-data" v-if='!creditCentralBankInfo' >暂无央行征信信息详情 </p>
    </div>
  </div>
</template>

<script>
import Popover from '../../components/popover.vue'
export default {
  props: ['loanData'],
  components: {
    Popover
  },
  data () {
    return {
      creditHisCustomer: this.loanData.creditHisCustomer,
      creditCentralBankInfo: this.loanData.creditCentralBankInfo,
      creditHisCoBorrower: this.loanData.creditHisCoBorrower,
      creditHisGuarantee: this.loanData.creditHisGuarantee,
      creditQueryResult: this.loanData.creditQueryResult,
      identityResult: this.loanData.identityResult,
      proValueText: this.loanData.proValueText,
      coproValueText: this.loanData.coproValueText,
      guproValueText: this.loanData.guproValueText
    }
  },
  mounted () {
    console.log(this.creditCentralBankInfo, 'this.loanData')
  }
}
</script>

<style lang="less" scoped>
 .credit-container{
    width: 10rem;
    margin: 0.26rem auto;
    background: #fff;
    .p-title{
      border-bottom: 1px solid #e5e5e5;
      height: 1.28rem;
      line-height: 1.28rem;
      font-size: 0.38rem;
      color: #000;
      padding-left: 0.72rem;
      font-weight: bold;
      position: relative;
    }
    .p-title::before{
      content: "";
      width: 0.14rem;
      height: 0.42rem;
      background: #369fff;
      border-radius: 8px;
      position: absolute;
      left: 0.4rem;
      top: 0.4rem;
    }
    .base-content{
      padding: 0.6rem 0.7rem;
    }

    .col-p{
      font-size: 0.36rem;
      color: #4f4e4e;
      line-height: 0.86rem;
      position:relative;
    }

    .row-p{
      display: inline-block;
      width: 4rem;
    }
    // 根据央行个人征信系统同报告，存在以下征信问题
    .row-p-problem {
      width:100%;
    }
    .problem-icon {
      position:absolute;
      top:0.3rem;
      width:0.16rem;
      height:0.16rem;
      border-radius:0.08rem;
      background:#a7d5ff;
    }
    // 征信问题具体问题
    .problem-content {
      margin-left:0.4rem;
    }
   .no-data {
      font-size: 0.36rem;
      color: #4f4e4e;
      line-height: 0.76rem;
      padding: 0 0.7rem;
    }
    .checkout-result-success {
      position: relative;
    }
    .checkout-result-success:hover .popover-show {
      display: block;
    }
    .checkout-result-success .popover-show {
      display: none;
    }
    .creContent-container {
      width: 5.5rem;
      font-size: .26rem;
      line-height: .8rem;
    }
    .popover,.active {
      width: 5rem!important;
    }
    .icon-explain {
      width: .4rem;
      height: .4rem;
      position: relative;
      top: .05rem;
    }
}
</style>
