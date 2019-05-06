<template>
  <div class="finance-tab-container">
    <table class="finance-tab">
      <thead class="finance-thead">
        <th class="finance-table-title">项目</th>
        <th class="finance-table-content">本年累计金额</th>
        <th class="finance-table-content  content-last">上年金额</th>
      </thead>
      <tbody class="finance-tbody">
        <tr class="finance-tbody-title">
          <td class="finance-table-title tbody-title1 tbody-title">经营活动产生的现金流量</td>
          <td class="finance-table-content tbody-title"></td>
          <td class="finance-table-content content-last tbody-title"></td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">销售产成品、商品、提供劳务收到的现金</td>
          <td class="finance-table-content">{{loanAssetYearCashFlow && loanAssetYearCashFlow.saleActivitiesCash}}</td>
          <td class="finance-table-content content-last">{{loanAssetMouthCashflow && loanAssetMouthCashflow.saleActivitiesCash}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">收到其他与经营活动有关的现金</td>
          <td class="finance-table-content">{{loanAssetYearCashFlow && loanAssetYearCashFlow.otherCash}}</td>
          <td class="finance-table-content content-last">{{loanAssetMouthCashflow && loanAssetMouthCashflow.otherCash}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">购买原材料、商品、接受劳务支付的现金</td>
          <td class="finance-table-content">{{loanAssetYearCashFlow && loanAssetYearCashFlow.commoditiesLaborCash}}</td>
          <td class="finance-table-content content-last">{{loanAssetMouthCashflow && loanAssetMouthCashflow.commoditiesLaborCash}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">支付的职工薪酬</td>
          <td class="finance-table-content">{{loanAssetYearCashFlow && loanAssetYearCashFlow.employeesCash}}</td>
          <td class="finance-table-content content-last">{{loanAssetMouthCashflow && loanAssetMouthCashflow.employeesCash}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">支付的税费</td>
          <td class="finance-table-content">{{loanAssetYearCashFlow && loanAssetYearCashFlow.cashpaidTaxes}}</td>
          <td class="finance-table-content content-last">{{loanAssetMouthCashflow && loanAssetMouthCashflow.cashpaidTaxes}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">支付其他与经营活动相关的现金</td>
          <td class="finance-table-content">{{loanAssetYearCashFlow && loanAssetYearCashFlow.otherOperatingActivitiesCash}}</td>
          <td class="finance-table-content content-last">{{loanAssetMouthCashflow && loanAssetMouthCashflow.otherOperatingActivitiesCash}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content2">经营活动产生的现金流量净额</td>
          <td class="finance-table-content">{{loanAssetYearCashFlow && loanAssetYearCashFlow.operatingActivitiesCash}}</td>
          <td class="finance-table-content content-last">{{loanAssetMouthCashflow && loanAssetMouthCashflow.operatingActivitiesCash}}</td>
        </tr>
        <tr class="finance-tbody-title">
          <td class="finance-table-title tbody-title1 tbody-title">投资活动产生的现金流量</td>
          <td class="finance-table-content tbody-title"></td>
          <td class="finance-table-content content-last tbody-title"></td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">收回短期投资、长期债券投资和长期股权投资收到的现金</td>
          <td class="finance-table-content">{{loanAssetYearCashFlow && loanAssetYearCashFlow.recoveryCash}}</td>
          <td class="finance-table-content content-last">{{loanAssetMouthCashflow && loanAssetMouthCashflow.recoveryCash}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">取得投资收益收到的现金</td>
          <td class="finance-table-content">{{loanAssetYearCashFlow && loanAssetYearCashFlow.profitCash}}</td>
          <td class="finance-table-content content-last">{{loanAssetMouthCashflow && loanAssetMouthCashflow.profitCash}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">处置固定资产、无形资产和其他非流动资产收回的现金净额</td>
          <td class="finance-table-content">{{loanAssetYearCashFlow && loanAssetYearCashFlow.fixedAssetsCash}}</td>
          <td class="finance-table-content content-last">{{loanAssetMouthCashflow && loanAssetMouthCashflow.fixedAssetsCash}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">短期投资、长期债券投资和长期股权投资支付的现金</td>
          <td class="finance-table-content">{{loanAssetYearCashFlow && loanAssetYearCashFlow.investmentCash}}</td>
          <td class="finance-table-content content-last">{{loanAssetMouthCashflow && loanAssetMouthCashflow.investmentCash}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">购建固定资产、无形资产和非流动资产支付的现金</td>
          <td class="finance-table-content">{{loanAssetYearCashFlow && loanAssetYearCashFlow.structureCash}}</td>
          <td class="finance-table-content content-last">{{loanAssetMouthCashflow && loanAssetMouthCashflow.structureCash}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content2">投资活动产生的现金流量净额</td>
          <td class="finance-table-content">{{loanAssetYearCashFlow && loanAssetYearCashFlow.investmentActivitiesCash}}</td>
          <td class="finance-table-content content-last">{{loanAssetMouthCashflow && loanAssetMouthCashflow.investmentActivitiesCash}}</td>
        </tr>
        <tr class="finance-tbody-title">
          <td class="finance-table-title tbody-title1 tbody-title">筹资活动产生的现金流量</td>
          <td class="finance-table-content tbody-title"></td>
          <td class="finance-table-content content-last tbody-title"></td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">取得借款收到的现金</td>
          <td class="finance-table-content">{{loanAssetYearCashFlow && loanAssetYearCashFlow.borrowings}}</td>
          <td class="finance-table-content content-last">{{loanAssetMouthCashflow && loanAssetMouthCashflow.borrowings}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">吸收投资者投资收到的现金</td>
          <td class="finance-table-content">{{loanAssetYearCashFlow && loanAssetYearCashFlow.investorCash}}</td>
          <td class="finance-table-content content-last">{{loanAssetMouthCashflow && loanAssetMouthCashflow.investorCash}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">偿还借款本金支付的现金</td>
          <td class="finance-table-content">{{loanAssetYearCashFlow && loanAssetYearCashFlow.debtPaid}}</td>
          <td class="finance-table-content content-last">{{loanAssetMouthCashflow && loanAssetMouthCashflow.debtPaid}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">偿还借款利息支付的现金</td>
          <td class="finance-table-content">{{loanAssetYearCashFlow && loanAssetYearCashFlow.borrowingInterestPaid}}</td>
          <td class="finance-table-content content-last">{{loanAssetMouthCashflow && loanAssetMouthCashflow.borrowingInterestPaid}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">分配利润支付的现金</td>
          <td class="finance-table-content">{{loanAssetYearCashFlow && loanAssetYearCashFlow.distributionProfitPaid}}</td>
          <td class="finance-table-content content-last">{{loanAssetMouthCashflow && loanAssetMouthCashflow.distributionProfitPaid}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content2">筹资活动产生的现金流量净额</td>
          <td class="finance-table-content">{{loanAssetYearCashFlow && loanAssetYearCashFlow.financingActivitiesPaid}}</td>
          <td class="finance-table-content content-last">{{loanAssetMouthCashflow && loanAssetMouthCashflow.financingActivitiesPaid}}</td>
        </tr>
        <tr class="finance-tbody-title">
          <td class="finance-table-title tbody-title1 tbody-title">现金净增加额</td>
          <td class="finance-table-content tbody-title">{{loanAssetYearCashFlow && loanAssetYearCashFlow.netCashIncrease}}</td>
          <td class="finance-table-content content-last tbody-title">{{loanAssetMouthCashflow && loanAssetMouthCashflow.netCashIncrease}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">加：期初现金余额</td>
          <td class="finance-table-content">{{loanAssetYearCashFlow && loanAssetYearCashFlow.beginningCashBalance}}</td>
          <td class="finance-table-content content-last">{{loanAssetMouthCashflow && loanAssetMouthCashflow.beginningCashBalance}}</td>
        </tr>
        <tr class="finance-tbody-title">
          <td class="finance-table-title tbody-title1 tbody-title">期末现金余额</td>
          <td class="finance-table-content tbody-title">{{loanAssetYearCashFlow && loanAssetYearCashFlow.finalCashBalance}}</td>
          <td class="finance-table-content content-last tbody-title">{{loanAssetMouthCashflow && loanAssetMouthCashflow.finalCashBalance}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: ['loanData'],
  data () {
    return {
      loanAssetYearCashFlow: '',
      loanAssetMouthCashflow: ''
    }
  },
  mounted () {
    console.log(this.loanData, 'this.loanData')
    for (var i = 0; i < this.loanData.length; i++) {
      if (this.loanData[i].type === '1') {
        console.log(this.loanData[i].type)
        this.loanAssetYearCashFlow = this.loanData[i]
        console.log(this.loanAssetYearCashFlow, 'this.loanData')
      }
      if (this.loanData[i].type === '2') {
        this.loanAssetMouthCashflow = this.loanData[i]
        console.log(this.loanData[i].type)
        console.log(this.loanAssetMouthCashflow, 'this.loanData')
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .finance-tab-container {
    width: 100%;
    background: #fff;
    padding-bottom: 0.5rem;
  }
  .finance-thead{
    font-size: 0.38rem;
    color: #333;
    height: 1.26rem;
    line-height: 1.26rem;
    border-bottom: 1px solid #e5e5e5;
    padding: 0 0.4rem;
  }
  .finance-table-title{
    text-align: left;
    width: 3.64rem;
    padding-left: 0.4rem;
  }
  .finance-table-content{
    width: 2.68rem;
    text-align: right;
    padding-left: 0.5rem;
  }
  .finance-table-content.content-last{
    padding-right: 0.4rem;
  }
  .finance-tbody {
    .finance-tbody-title{
      font-size: 0.38rem;
      color: #000;
      .tbody-title{
        padding-top: 0.6rem;
        line-height: 0.6rem;
      }
      .tbody-title1{
        width: 3.64rem;
        padding-left: 0.4rem;
      }
      .tbody-title2{
        width: 3.64rem;
        padding-left: 0.8rem;
      }
    }
    .finance-tbody-content{
      font-size: 0.36rem;
      color: #4f4e4e;
      td{
        padding-top: 0.4rem;
      }
      .tbody-content1{
        width: 3.64rem;
        padding-left: 0.8rem;
      }
      .tbody-content2{
        padding-left: 1.2rem;
      }
      .tbody-content3{
        padding-left: 1.6rem;
      }
    }
  }
</style>
