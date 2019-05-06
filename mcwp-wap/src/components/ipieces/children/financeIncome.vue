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
          <td class="finance-table-title tbody-title1 tbody-title">营业收入</td>
          <td class="finance-table-content tbody-title">{{loanAssetYearIncstat && loanAssetYearIncstat.revenue}}</td>
          <td class="finance-table-content content-last tbody-title">{{loanAssetMonthIncstat && loanAssetMonthIncstat.revenue}}</td>
        </tr>
        <tr class="finance-tbody-title">
          <td class="finance-table-title tbody-title2 tbody-title">减：营业成本</td>
          <td class="finance-table-content tbody-title">{{loanAssetYearIncstat && loanAssetYearIncstat.costOfSales}}</td>
          <td class="finance-table-content content-last tbody-title">{{loanAssetMonthIncstat && loanAssetMonthIncstat.costOfSales}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content2">营业税金及附加</td>
          <td class="finance-table-content">{{loanAssetYearIncstat && loanAssetYearIncstat.countSalesTax}}</td>
          <td class="finance-table-content content-last">{{loanAssetMonthIncstat && loanAssetMonthIncstat.countSalesTax}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content3">消费税</td>
          <td class="finance-table-content">{{loanAssetYearIncstat && loanAssetYearIncstat.exciseTax}}</td>
          <td class="finance-table-content content-last">{{loanAssetMonthIncstat && loanAssetMonthIncstat.exciseTax}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content3">营业税</td>
          <td class="finance-table-content">{{loanAssetYearIncstat && loanAssetYearIncstat.salesTax}}</td>
          <td class="finance-table-content content-last">{{loanAssetMonthIncstat && loanAssetMonthIncstat.salesTax}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content3">城市维护建设税</td>
          <td class="finance-table-content">{{loanAssetYearIncstat && loanAssetYearIncstat.constructionTax}}</td>
          <td class="finance-table-content content-last">{{loanAssetMonthIncstat && loanAssetMonthIncstat.constructionTax}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content3">资源税</td>
          <td class="finance-table-content">{{loanAssetYearIncstat && loanAssetYearIncstat.resourceTax}}</td>
          <td class="finance-table-content content-last">{{loanAssetMonthIncstat && loanAssetMonthIncstat.resourceTax}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content3">土地增值税</td>
          <td class="finance-table-content">{{loanAssetYearIncstat && loanAssetYearIncstat.landValueIncrementTax}}</td>
          <td class="finance-table-content content-last">{{loanAssetMonthIncstat && loanAssetMonthIncstat.landValueIncrementTax}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content3">城镇土地使用税、房产税、车船税、印花税</td>
          <td class="finance-table-content">{{loanAssetYearIncstat && loanAssetYearIncstat.uhvsTax}}</td>
          <td class="finance-table-content content-last">{{loanAssetMonthIncstat && loanAssetMonthIncstat.uhvsTax}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content3">教育费附加、矿产资源补偿费、排污费</td>
          <td class="finance-table-content">{{loanAssetYearIncstat && loanAssetYearIncstat.emsTax}}</td>
          <td class="finance-table-content content-last">{{loanAssetMonthIncstat && loanAssetMonthIncstat.emsTax}}</td>
        </tr>
        <tr class="finance-tbody-title">
          <td class="finance-table-title tbody-title2 tbody-title">销售费用</td>
          <td class="finance-table-content tbody-title">{{loanAssetYearIncstat && loanAssetYearIncstat.saleExpense}}</td>
          <td class="finance-table-content content-last tbody-title">{{loanAssetMonthIncstat && loanAssetMonthIncstat.saleExpense}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content2">商品维修费</td>
          <td class="finance-table-content">{{loanAssetYearIncstat && loanAssetYearIncstat.repairExpense}}</td>
          <td class="finance-table-content content-last">{{loanAssetMonthIncstat && loanAssetMonthIncstat.repairExpense}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content2">广告费和业务宣传费</td>
          <td class="finance-table-content">{{loanAssetYearIncstat && loanAssetYearIncstat.publicityExpense}}</td>
          <td class="finance-table-content content-last">{{loanAssetMonthIncstat && loanAssetMonthIncstat.publicityExpense}}</td>
        </tr>
        <tr class="finance-tbody-title">
          <td class="finance-table-title tbody-title2 tbody-title">管理费用</td>
          <td class="finance-table-content tbody-title">{{loanAssetYearIncstat && loanAssetYearIncstat.manageExpense}}</td>
          <td class="finance-table-content content-last tbody-title">{{loanAssetMonthIncstat && loanAssetMonthIncstat.manageExpense}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content2">开办费</td>
          <td class="finance-table-content">{{loanAssetYearIncstat && loanAssetYearIncstat.startExpense}}</td>
          <td class="finance-table-content content-last">{{loanAssetMonthIncstat && loanAssetMonthIncstat.startExpense}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content2">业务招待费</td>
          <td class="finance-table-content">{{loanAssetYearIncstat && loanAssetYearIncstat.entertainExpense}}</td>
          <td class="finance-table-content content-last">{{loanAssetMonthIncstat && loanAssetMonthIncstat.entertainExpense}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content2">研究费用</td>
          <td class="finance-table-content">{{loanAssetYearIncstat && loanAssetYearIncstat.researchExpense}}</td>
          <td class="finance-table-content content-last">{{loanAssetMonthIncstat && loanAssetMonthIncstat.researchExpense}}</td>
        </tr>
        <tr class="finance-tbody-title">
          <td class="finance-table-title tbody-title2 tbody-title">财务费用</td>
          <td class="finance-table-content tbody-title">{{loanAssetYearIncstat && loanAssetYearIncstat.financeExpense}}</td>
          <td class="finance-table-content content-last tbody-title">{{loanAssetMonthIncstat && loanAssetMonthIncstat.financeExpense}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content2">利息费用（收入以"-"号填列）</td>
          <td class="finance-table-content">{{loanAssetYearIncstat && loanAssetYearIncstat.interestExpense}}</td>
          <td class="finance-table-content content-last">{{loanAssetMonthIncstat && loanAssetMonthIncstat.interestExpense}}</td>
        </tr>
        <tr class="finance-tbody-title">
          <td class="finance-table-title tbody-title2 tbody-title">加：投资收益（亏损以"-"号填列）</td>
          <td class="finance-table-content tbody-title">{{loanAssetYearIncstat && loanAssetYearIncstat.investmentIncome}}</td>
          <td class="finance-table-content content-last tbody-title">{{loanAssetMonthIncstat && loanAssetMonthIncstat.investmentIncome}}</td>
        </tr>
        <tr class="finance-tbody-title">
          <td class="finance-table-title tbody-title1 tbody-title">营业利润：投资收益（亏损以"-"号填列）</td>
          <td class="finance-table-content tbody-title">{{loanAssetYearIncstat && loanAssetYearIncstat.profitFromOperation}}</td>
          <td class="finance-table-content content-last tbody-title">{{loanAssetMonthIncstat && loanAssetMonthIncstat.profitFromOperation}}</td>
        </tr>
        <tr class="finance-tbody-title">
          <td class="finance-table-title tbody-title2 tbody-title">加：营业收入</td>
          <td class="finance-table-content tbody-title">{{loanAssetYearIncstat && loanAssetYearIncstat.nonOperatingIncome}}</td>
          <td class="finance-table-content content-last tbody-title">{{loanAssetMonthIncstat && loanAssetMonthIncstat.nonOperatingIncome}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content2">政府补助</td>
          <td class="finance-table-content">{{loanAssetYearIncstat && loanAssetYearIncstat.subsidyIncome}}</td>
          <td class="finance-table-content content-last">{{loanAssetMonthIncstat && loanAssetMonthIncstat.subsidyIncome}}</td>
        </tr>
        <tr class="finance-tbody-title">
          <td class="finance-table-title tbody-title2 tbody-title">减：营业外支出</td>
          <td class="finance-table-content tbody-title">{{loanAssetYearIncstat && loanAssetYearIncstat.nonOperatingExpense}}</td>
          <td class="finance-table-content content-last tbody-title">{{loanAssetMonthIncstat && loanAssetMonthIncstat.nonOperatingExpense}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content2">坏账损失</td>
          <td class="finance-table-content">{{loanAssetYearIncstat && loanAssetYearIncstat.badDebtLoss}}</td>
          <td class="finance-table-content content-last">{{loanAssetMonthIncstat && loanAssetMonthIncstat.badDebtLoss}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content3">无法收回的长期债券投资损失</td>
          <td class="finance-table-content">{{loanAssetYearIncstat && loanAssetYearIncstat.bondInvestmentLoss}}</td>
          <td class="finance-table-content content-last">{{loanAssetMonthIncstat && loanAssetMonthIncstat.bondInvestmentLoss}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content3">无法回收的长期股权投资损失</td>
          <td class="finance-table-content">{{loanAssetYearIncstat && loanAssetYearIncstat.equityInvestmentLoss}}</td>
          <td class="finance-table-content content-last">{{loanAssetMonthIncstat && loanAssetMonthIncstat.equityInvestmentLoss}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content3">自然灾害等不可抗力因素造成的投资损失</td>
          <td class="finance-table-content">{{loanAssetYearIncstat && loanAssetYearIncstat.naturalDisasterLoss}}</td>
          <td class="finance-table-content content-last">{{loanAssetMonthIncstat && loanAssetMonthIncstat.naturalDisasterLoss}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content3">税收滞纳金</td>
          <td class="finance-table-content">{{loanAssetYearIncstat && loanAssetYearIncstat.taxLatePayment}}</td>
          <td class="finance-table-content content-last">{{loanAssetMonthIncstat && loanAssetMonthIncstat.taxLatePayment}}</td>
        </tr>
        <tr class="finance-tbody-title">
          <td class="finance-table-title tbody-title2 tbody-title">利润总额（亏损以“-”号填列）</td>
          <td class="finance-table-content tbody-title">{{loanAssetYearIncstat && loanAssetYearIncstat.profitBeforeTax}}</td>
          <td class="finance-table-content content-last tbody-title">{{loanAssetMonthIncstat && loanAssetMonthIncstat.profitBeforeTax}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content2">减：所得税费用</td>
          <td class="finance-table-content">{{loanAssetYearIncstat && loanAssetYearIncstat.incomeTax}}</td>
          <td class="finance-table-content content-last">{{loanAssetMonthIncstat && loanAssetMonthIncstat.incomeTax}}</td>
        </tr>
        <tr class="finance-tbody-title">
          <td class="finance-table-title tbody-title2 tbody-title">净利润（亏损以“-”号填列）</td>
          <td class="finance-table-content tbody-title">{{loanAssetYearIncstat && loanAssetYearIncstat.netProfit}}</td>
          <td class="finance-table-content content-last tbody-title">{{loanAssetMonthIncstat && loanAssetMonthIncstat.netProfit}}</td>
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
      loanAssetYearIncstat: '',
      loanAssetMonthIncstat: ''
    }
  },
  mounted () {
    console.log(this.loanData, 'this.loanData')
    for (var i = 0; i < this.loanData.length; i++) {
      if (this.loanData[i].type === '1') {
        console.log(this.loanData[i].type)
        this.loanAssetYearIncstat = this.loanData[i]
        console.log(this.loanAssetYearIncstat, 'this.loanData')
      }
      if (this.loanData[i].type === '2') {
        this.loanAssetMonthIncstat = this.loanData[i]
        console.log(this.loanData[i].type)
        console.log(this.loanAssetMonthIncstat, 'this.loanData')
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
