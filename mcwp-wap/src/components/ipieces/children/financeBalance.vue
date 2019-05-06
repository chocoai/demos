<template>
  <div class="finance-tab-container">
    <table class="finance-tab">
      <thead class="finance-thead">
        <th class="finance-table-title">资产</th>
        <th class="finance-table-content">期末金额</th>
        <th class="finance-table-content  content-last">年初金额</th>
      </thead>
      <tbody class="finance-tbody">
        <tr class="finance-tbody-title">
          <td class="finance-table-title tbody-title1 tbody-title">流动资产</td>
          <td class="finance-table-content tbody-title">期末金额</td>
          <td class="finance-table-content content-last tbody-title">年初金额</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">货币资金</td>
          <td class="finance-table-content">{{loanAssetFinalInfo && loanAssetFinalInfo.bankCash}}</td>
          <td class="finance-table-content content-last">{{loanAssetBeginInfo && loanAssetBeginInfo.bankCash}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">短期投资</td>
          <td class="finance-table-content">{{loanAssetFinalInfo && loanAssetFinalInfo.currentInvestment}}</td>
          <td class="finance-table-content content-last">{{loanAssetBeginInfo && loanAssetBeginInfo.currentInvestment}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">应收票据</td>
          <td class="finance-table-content">{{loanAssetFinalInfo && loanAssetFinalInfo.notesReceivable}}</td>
          <td class="finance-table-content content-last">{{loanAssetBeginInfo && loanAssetBeginInfo.notesReceivable}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">应收账款</td>
          <td class="finance-table-content">{{loanAssetFinalInfo && loanAssetFinalInfo.accountReceivable}}</td>
          <td class="finance-table-content content-last">{{loanAssetBeginInfo && loanAssetBeginInfo.accountReceivable}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">预付账款</td>
          <td class="finance-table-content">{{loanAssetFinalInfo && loanAssetFinalInfo.prepayment}}</td>
          <td class="finance-table-content content-last">{{loanAssetBeginInfo && loanAssetBeginInfo.prepayment}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">应付股利</td>
          <td class="finance-table-content">{{loanAssetFinalInfo && loanAssetFinalInfo.dividendPayable}}</td>
          <td class="finance-table-content content-last">{{loanAssetFinalInfo && loanAssetFinalInfo.dividendPayable}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">应收利息</td>
          <td class="finance-table-content">{{loanAssetFinalInfo && loanAssetFinalInfo.interestReceivable}}</td>
          <td class="finance-table-content content-last">{{loanAssetBeginInfo && loanAssetBeginInfo.interestReceivable}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">其他应收款</td>
          <td class="finance-table-content">{{loanAssetFinalInfo && loanAssetFinalInfo.otherReceivable}}</td>
          <td class="finance-table-content content-last">{{loanAssetBeginInfo && loanAssetBeginInfo.otherReceivable}}</td>
        </tr>
        <tr class="finance-tbody-title">
          <td class="finance-table-title tbody-title2 tbody-title">存货</td>
          <td class="finance-table-content tbody-title">{{loanAssetFinalInfo && loanAssetFinalInfo.inventory}}</td>
          <td class="finance-table-content content-last tbody-title">{{loanAssetBeginInfo && loanAssetBeginInfo.inventory}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content2">原材料</td>
          <td class="finance-table-content">{{loanAssetFinalInfo && loanAssetFinalInfo.rawMaterial}}</td>
          <td class="finance-table-content content-last">{{loanAssetBeginInfo && loanAssetBeginInfo.rawMaterial}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content2">原产品</td>
          <td class="finance-table-content">{{loanAssetFinalInfo && loanAssetFinalInfo.onSaleProducts}}</td>
          <td class="finance-table-content content-last">{{loanAssetBeginInfo && loanAssetBeginInfo.onSaleProducts}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content2">库存商品</td>
          <td class="finance-table-content">{{loanAssetFinalInfo && loanAssetFinalInfo.stockProducts}}</td>
          <td class="finance-table-content content-last">{{loanAssetBeginInfo && loanAssetBeginInfo.stockProducts}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content2">周转材料</td>
          <td class="finance-table-content">{{loanAssetFinalInfo && loanAssetFinalInfo.turnoverMaterial}}</td>
          <td class="finance-table-content content-last">{{loanAssetBeginInfo && loanAssetBeginInfo.turnoverMaterial}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content2">其他流动资产</td>
          <td class="finance-table-content">{{loanAssetFinalInfo && loanAssetFinalInfo.otherCurrentAssets}}</td>
          <td class="finance-table-content content-last">{{loanAssetBeginInfo && loanAssetBeginInfo.otherCurrentAssets}}</td>
        </tr>
        <tr class="finance-tbody-title">
          <td class="finance-table-title tbody-title3 tbody-title">流动资产合计</td>
          <td class="finance-table-content tbody-title">{{loanAssetFinalInfo && loanAssetFinalInfo.totalCurrentAssets}}</td>
          <td class="finance-table-content content-last tbody-title">{{loanAssetBeginInfo && loanAssetBeginInfo.totalCurrentAssets}}</td>
        </tr>
        <tr class="finance-tbody-title">
          <td class="finance-tbody-title tbody-title1 tbody-title">非流动资产</td>
          <td class="finance-table-content tbody-title"></td>
          <td class="finance-table-content content-last tbody-title"></td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">长期债券投资</td>
          <td class="finance-table-content">{{loanAssetFinalInfo && loanAssetFinalInfo.longDebtInvestment}}</td>
          <td class="finance-table-content content-last">{{loanAssetBeginInfo && loanAssetBeginInfo.longDebtInvestment}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">长期股权投资</td>
          <td class="finance-table-content">{{loanAssetFinalInfo && loanAssetFinalInfo.longEquityInvestment}}</td>
          <td class="finance-table-content content-last">{{loanAssetBeginInfo && loanAssetBeginInfo.longEquityInvestment}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">固定资产原价</td>
          <td class="finance-table-content">{{loanAssetFinalInfo && loanAssetFinalInfo.cost}}</td>
          <td class="finance-table-content content-last">{{loanAssetFinalInfo && loanAssetBeginInfo.cost}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">减：累计折旧</td>
          <td class="finance-table-content">{{loanAssetFinalInfo && loanAssetFinalInfo.accumulatedDepreciation}}</td>
          <td class="finance-table-content content-last">{{loanAssetBeginInfo && loanAssetBeginInfo.accumulatedDepreciation}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">固定资产账面价值</td>
          <td class="finance-table-content">{{loanAssetFinalInfo && loanAssetFinalInfo.fixedAssets}}</td>
          <td class="finance-table-content content-last">{{loanAssetBeginInfo && loanAssetBeginInfo.fixedAssets}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">在建工程</td>
          <td class="finance-table-content">{{loanAssetFinalInfo && loanAssetFinalInfo.constructionInProgress}}</td>
          <td class="finance-table-content content-last">{{loanAssetBeginInfo && loanAssetBeginInfo.constructionInProgress}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">工程物资</td>
          <td class="finance-table-content">{{loanAssetFinalInfo && loanAssetFinalInfo.engineeringMaterials}}</td>
          <td class="finance-table-content content-last">{{loanAssetBeginInfo && loanAssetBeginInfo.engineeringMaterials}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">固定资产清理</td>
          <td class="finance-table-content">{{loanAssetFinalInfo && loanAssetFinalInfo.fixedAssetsDisposed}}</td>
          <td class="finance-table-content content-last">{{loanAssetBeginInfo && loanAssetBeginInfo.fixedAssetsDisposed}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">生产性生物资产</td>
          <td class="finance-table-content">{{loanAssetFinalInfo && loanAssetFinalInfo.biologicalAssets}}</td>
          <td class="finance-table-content content-last">{{loanAssetBeginInfo && loanAssetBeginInfo.biologicalAssets}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">无形资产</td>
          <td class="finance-table-content">{{loanAssetFinalInfo && loanAssetFinalInfo.intangibleAssets}}</td>
          <td class="finance-table-content content-last">{{loanAssetBeginInfo && loanAssetBeginInfo.intangibleAssets}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">开发支出</td>
          <td class="finance-table-content">{{loanAssetFinalInfo && loanAssetFinalInfo.developmentExpenditure}}</td>
          <td class="finance-table-content content-last">{{loanAssetBeginInfo && loanAssetBeginInfo.developmentExpenditure}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">长期待摊费用</td>
          <td class="finance-table-content">{{loanAssetFinalInfo && loanAssetFinalInfo.longDeferredExpense}}</td>
          <td class="finance-table-content content-last">{{loanAssetBeginInfo && loanAssetBeginInfo.longDeferredExpense}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">其他非流动资产</td>
          <td class="finance-table-content">{{loanAssetFinalInfo && loanAssetFinalInfo.otherNotCurrentAssets}}</td>
          <td class="finance-table-content content-last">{{loanAssetBeginInfo && loanAssetBeginInfo.otherNotCurrentAssets}}</td>
        </tr>
        <tr class="finance-tbody-title">
          <td class="finance-table-title tbody-title3 tbody-title">非流动资产合计</td>
          <td class="finance-table-content tbody-title">{{loanAssetFinalInfo && loanAssetFinalInfo.countNotCurrentAssets}}</td>
          <td class="finance-table-content content-last tbody-title">{{loanAssetBeginInfo && loanAssetBeginInfo.countNotCurrentAssets}}</td>
        </tr>
        <tr class="finance-tbody-title tbody-title">
          <td class="finance-tbody-title tbody-title1 tbody-title">资产总计</td>
          <td class="finance-table-content tbody-title">{{loanAssetFinalInfo && loanAssetFinalInfo.totalAssets}}</td>
          <td class="finance-table-content content-last tbody-title">{{loanAssetBeginInfo && loanAssetBeginInfo.totalAssets}}</td>
        </tr>
      </tbody>
    </table>
    <table class="finance-tab">
      <thead class="finance-thead">
        <th class="finance-table-title">负债和所有者权益</th>
        <th class="finance-table-content">期末金额</th>
        <th class="finance-table-content  content-last">年初金额</th>
      </thead>
      <tbody class="finance-tbody">
        <tr class="finance-tbody-title">
          <td class="finance-tbody-title tbody-title1 tbody-title">流动负债</td>
          <td class="finance-table-content tbody-title"></td>
          <td class="finance-table-content content-last tbody-title"></td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">短期借款</td>
          <td class="finance-table-content">{{loanAssetFinalInfo && loanAssetFinalInfo.shortLoans}}</td>
          <td class="finance-table-content content-last">{{loanAssetBeginInfo && loanAssetBeginInfo.shortLoans}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content2">其中：银行贷款，信用卡</td>
          <td class="finance-table-content">{{loanAssetFinalInfo && loanAssetFinalInfo.creditCardLoans}}</td>
          <td class="finance-table-content content-last">{{loanAssetBeginInfo && loanAssetBeginInfo.creditCardLoans}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content2">私人借款</td>
          <td class="finance-table-content">{{loanAssetFinalInfo && loanAssetFinalInfo.personalLoans}}</td>
          <td class="finance-table-content content-last">{{loanAssetBeginInfo && loanAssetBeginInfo.personalLoans}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">应付票据</td>
          <td class="finance-table-content">{{loanAssetFinalInfo && loanAssetFinalInfo.notesPayable}}</td>
          <td class="finance-table-content content-last">{{loanAssetBeginInfo && loanAssetBeginInfo.notesPayable}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">应付账款</td>
          <td class="finance-table-content">{{loanAssetFinalInfo && loanAssetFinalInfo.accountsPayable}}</td>
          <td class="finance-table-content content-last">{{loanAssetBeginInfo && loanAssetBeginInfo.accountsPayable}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">预收账款</td>
          <td class="finance-table-content">{{loanAssetFinalInfo && loanAssetFinalInfo.advanceFromCustomers}}</td>
          <td class="finance-table-content content-last">{{loanAssetBeginInfo && loanAssetBeginInfo.advanceFromCustomers}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">应付职工薪酬</td>
          <td class="finance-table-content">{{loanAssetFinalInfo && loanAssetFinalInfo.payrollPayable}}</td>
          <td class="finance-table-content content-last">{{loanAssetBeginInfo && loanAssetBeginInfo.payrollPayable}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">应交税费</td>
          <td class="finance-table-content">{{loanAssetFinalInfo && loanAssetFinalInfo.taxesPayable}}</td>
          <td class="finance-table-content content-last">{{loanAssetBeginInfo && loanAssetBeginInfo.taxesPayable}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">应付利息</td>
          <td class="finance-table-content">{{loanAssetFinalInfo && loanAssetFinalInfo.interestPayable}}</td>
          <td class="finance-table-content content-last">{{loanAssetBeginInfo && loanAssetBeginInfo.interestPayable}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">应付利润</td>
          <td class="finance-table-content">{{loanAssetFinalInfo && loanAssetFinalInfo.profitPayable}}</td>
          <td class="finance-table-content content-last">{{loanAssetBeginInfo && loanAssetBeginInfo.profitPayable}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">其他应付款</td>
          <td class="finance-table-content">{{loanAssetFinalInfo && loanAssetFinalInfo.otherPayable}}</td>
          <td class="finance-table-content content-last">{{loanAssetBeginInfo && loanAssetBeginInfo.otherPayable}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">其他流动负债</td>
          <td class="finance-table-content">{{loanAssetFinalInfo && loanAssetFinalInfo.otherCurrentLiability}}</td>
          <td class="finance-table-content content-last">{{loanAssetBeginInfo && loanAssetBeginInfo.otherCurrentLiability}}</td>
        </tr>
        <tr class="finance-tbody-title">
          <td class="finance-table-title tbody-title3 tbody-title">流动负债合计</td>
          <td class="finance-table-content tbody-title">{{loanAssetFinalInfo && loanAssetFinalInfo.totalCurrentLiability}}</td>
          <td class="finance-table-content content-last tbody-title">{{loanAssetBeginInfo && loanAssetBeginInfo.totalCurrentLiability}}</td>
        </tr>
        <tr class="finance-tbody-title">
          <td class="finance-table-title tbody-title1 tbody-title">非流动负债</td>
          <td class="finance-table-content tbody-title"></td>
          <td class="finance-table-content content-last tbody-title"></td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">长期借款</td>
          <td class="finance-table-content">{{loanAssetFinalInfo && loanAssetFinalInfo.longLoans}}</td>
          <td class="finance-table-content content-last">{{loanAssetBeginInfo && loanAssetBeginInfo.longLoans}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">长期应付款</td>
          <td class="finance-table-content">{{loanAssetFinalInfo && loanAssetFinalInfo.longPayable}}</td>
          <td class="finance-table-content content-last">{{loanAssetBeginInfo && loanAssetBeginInfo.longPayable}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">递延收益</td>
          <td class="finance-table-content">{{loanAssetFinalInfo && loanAssetFinalInfo.deferredRevenue}}</td>
          <td class="finance-table-content content-last">{{loanAssetBeginInfo && loanAssetBeginInfo.deferredRevenue}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">其他非流动负债</td>
          <td class="finance-table-content">{{loanAssetFinalInfo && loanAssetFinalInfo.otherNotCurrentLiability}}</td>
          <td class="finance-table-content content-last">{{loanAssetBeginInfo && loanAssetBeginInfo.otherNotCurrentLiability}}</td>
        </tr>
        <tr class="finance-tbody-title">
          <td class="finance-table-title tbody-title3 tbody-title">非流动负债合计</td>
          <td class="finance-table-content tbody-title">{{loanAssetFinalInfo && loanAssetFinalInfo.countNotCurrentLiability}}</td>
          <td class="finance-table-content content-last tbody-title">{{loanAssetBeginInfo && loanAssetBeginInfo.countNotCurrentLiability}}</td>
        </tr>
        <tr class="finance-tbody-title">
          <td class="finance-table-title tbody-title1 tbody-title">负债总计</td>
          <td class="finance-table-content tbody-title">{{loanAssetFinalInfo && loanAssetFinalInfo.totalLiability}}</td>
          <td class="finance-table-content content-last tbody-title">{{loanAssetBeginInfo && loanAssetBeginInfo.totalLiability}}</td>
        </tr>
        <tr class="finance-tbody-title">
          <td class="finance-table-title tbody-title1 tbody-title">所有者权益(或股东权益)</td>
          <td class="finance-table-content tbody-title"></td>
          <td class="finance-table-content content-last tbody-title"></td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">实收资本(或股本)</td>
          <td class="finance-table-content">{{loanAssetFinalInfo && loanAssetFinalInfo.paidInCapital}}</td>
          <td class="finance-table-content content-last">{{loanAssetBeginInfo && loanAssetBeginInfo.paidInCapital}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">资本公积</td>
          <td class="finance-table-content">{{loanAssetFinalInfo && loanAssetFinalInfo.capitalReserves}}</td>
          <td class="finance-table-content content-last">{{loanAssetBeginInfo && loanAssetBeginInfo.capitalReserves}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">盈余公积</td>
          <td class="finance-table-content">{{loanAssetFinalInfo && loanAssetFinalInfo.surplusReserves}}</td>
          <td class="finance-table-content content-last">{{loanAssetBeginInfo && loanAssetBeginInfo.surplusReserves}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">未分配利润</td>
          <td class="finance-table-content">{{loanAssetFinalInfo && loanAssetFinalInfo.undistributedProfit}}</td>
          <td class="finance-table-content content-last">{{loanAssetBeginInfo && loanAssetBeginInfo.undistributedProfit}}</td>
        </tr>
        <tr class="finance-tbody-title">
          <td class="finance-table-title tbody-title1 tbody-title">所有者权益(或股东权益)合计</td>
          <td class="finance-table-content tbody-title">{{loanAssetFinalInfo && loanAssetFinalInfo.totalEquity}}</td>
          <td class="finance-table-content content-last tbody-title">{{loanAssetBeginInfo && loanAssetBeginInfo.totalEquity}}</td>
        </tr>
        <tr class="finance-tbody-title">
          <td class="finance-table-title tbody-title1 tbody-title">负债和所有者权益(或股东权益)总计</td>
          <td class="finance-table-content tbody-title">{{loanAssetFinalInfo && loanAssetFinalInfo.totalLiabilityEquity}}</td>
          <td class="finance-table-content content-last tbody-title">{{loanAssetBeginInfo && loanAssetBeginInfo.totalLiabilityEquity}}</td>
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
      loanAssetFinalInfo: '',
      loanAssetBeginInfo: ''
    }
  },
  mounted () {
    console.log(this.loanData, 'this.loanData')
    for (var i = 0; i < this.loanData.length; i++) {
      if (this.loanData[i].type === '1') {
        console.log(this.loanData[i].type)
        this.loanAssetFinalInfo = this.loanData[i]
        console.log(this.loanAssetFinalInfo, 'this.loanData')
      }
      if (this.loanData[i].type === '2') {
        this.loanAssetBeginInfo = this.loanData[i]
        console.log(this.loanData[i].type)
        console.log(this.loanAssetBeginInfo, 'this.loanData')
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
      .tbody-title3{
        width: 3.64rem;
        padding-left: 1.6rem;
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
