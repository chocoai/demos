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
          <td class="finance-table-title tbody-title1 tbody-title">高流动性资产</td>
          <td class="finance-table-content tbody-title">{{loanAssetFinalInfo && loanAssetFinalInfo.totalCash}}</td>
          <td class="finance-table-content content-last tbody-title">{{loanAssetBeginInfo && loanAssetBeginInfo.totalCash}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">柜面现金</td>
          <td class="finance-table-content">{{loanAssetFinalInfo && loanAssetFinalInfo.accountCash}}</td>
          <td class="finance-table-content content-last">{{loanAssetBeginInfo && loanAssetBeginInfo.accountCash}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">其他手头现金</td>
          <td class="finance-table-content">{{loanAssetFinalInfo && loanAssetFinalInfo.otherCash}}</td>
          <td class="finance-table-content content-last">{{loanAssetBeginInfo && loanAssetBeginInfo.otherCash}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">银行活期账户</td>
          <td class="finance-table-content">{{loanAssetFinalInfo && loanAssetFinalInfo.currentAccount}}</td>
          <td class="finance-table-content content-last">{{loanAssetBeginInfo && loanAssetBeginInfo.currentAccount}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">银行定期存款</td>
          <td class="finance-table-content">{{loanAssetFinalInfo && loanAssetFinalInfo.depositAmount}}</td>
          <td class="finance-table-content content-last">{{loanAssetBeginInfo && loanAssetBeginInfo.depositAmount}}</td>
        </tr>
        <tr class="finance-tbody-title">
          <td class="finance-table-title tbody-title1 tbody-title">应收账款合计</td>
          <td class="finance-table-content tbody-title">{{loanAssetFinalInfo && loanAssetFinalInfo.totalAccountRec}}</td>
          <td class="finance-table-content content-last tbody-title">{{loanAssetBeginInfo && loanAssetBeginInfo.totalAccountRec}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">应收账款</td>
          <td class="finance-table-content">{{loanAssetFinalInfo && loanAssetFinalInfo.accountReceivable}}</td>
          <td class="finance-table-content content-last">{{loanAssetBeginInfo && loanAssetBeginInfo.accountReceivable}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">预付款</td>
          <td class="finance-table-content">{{loanAssetFinalInfo && loanAssetFinalInfo.prepayment}}</td>
          <td class="finance-table-content content-last">{{loanAssetBeginInfo && loanAssetBeginInfo.prepayment}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">其他应收款</td>
          <td class="finance-table-content">{{loanAssetFinalInfo && loanAssetFinalInfo.amountReceivableOth}}</td>
          <td class="finance-table-content content-last">{{loanAssetBeginInfo && loanAssetBeginInfo.amountReceivableOth}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">运输中的货品</td>
          <td class="finance-table-content">{{loanAssetFinalInfo && loanAssetFinalInfo.transitGoods}}</td>
          <td class="finance-table-content content-last">{{loanAssetBeginInfo && loanAssetBeginInfo.transitGoods}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">其他应收账户</td>
          <td class="finance-table-content">{{loanAssetFinalInfo && loanAssetFinalInfo.accountReceivableOth}}</td>
          <td class="finance-table-content content-last">{{loanAssetBeginInfo && loanAssetBeginInfo.accountReceivableOth}}</td>
        </tr>
        <tr class="finance-tbody-title">
          <td class="finance-table-title tbody-title1 tbody-title">存货</td>
          <td class="finance-table-content tbody-title">{{loanAssetFinalInfo && loanAssetFinalInfo.totalStock}}</td>
          <td class="finance-table-content content-last tbody-title">{{loanAssetBeginInfo && loanAssetBeginInfo.totalStock}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">货物材料库存</td>
          <td class="finance-table-content">{{loanAssetFinalInfo && loanAssetFinalInfo.mateialStock}}</td>
          <td class="finance-table-content content-last">{{loanAssetBeginInfo && loanAssetBeginInfo.mateialStock}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">种植已花费</td>
          <td class="finance-table-content">{{loanAssetFinalInfo && loanAssetFinalInfo.usedPlant}}</td>
          <td class="finance-table-content content-last">{{loanAssetBeginInfo && loanAssetBeginInfo.usedPlant}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">其他存货</td>
          <td class="finance-table-content">{{loanAssetFinalInfo && loanAssetFinalInfo.othStock}}</td>
          <td class="finance-table-content content-last">{{loanAssetBeginInfo && loanAssetBeginInfo.othStock}}</td>
        </tr>
        <tr class="finance-tbody-title">
          <td class="finance-table-title tbody-title1 tbody-title">流动资产合计</td>
          <td class="finance-table-content tbody-title">{{loanAssetFinalInfo && loanAssetFinalInfo.totalLiquidAsset}}</td>
          <td class="finance-table-content content-last tbody-title">{{loanAssetBeginInfo && loanAssetBeginInfo.totalLiquidAsset}}</td>
        </tr>
        <tr class="finance-tbody-title">
          <td class="finance-table-title tbody-title1 tbody-title">固定资产</td>
          <td class="finance-table-content tbody-title">{{loanAssetFinalInfo && loanAssetFinalInfo.fixedAssets}}</td>
          <td class="finance-table-content content-last tbody-title">{{loanAssetBeginInfo && loanAssetBeginInfo.fixedAssets}}</td>
        </tr>
        <tr class="finance-tbody-title">
          <td class="finance-table-title tbody-title1 tbody-title">资产总计</td>
          <td class="finance-table-content tbody-title">{{loanAssetFinalInfo && loanAssetFinalInfo.totalAsset}}</td>
          <td class="finance-table-content content-last tbody-title">{{loanAssetBeginInfo && loanAssetBeginInfo.totalAsset}}</td>
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
          <td class="finance-tbody-title tbody-title1 tbody-title">总计</td>
          <td class="finance-table-content tbody-title">{{loanAssetFinalInfo && loanAssetFinalInfo.totalPay}}</td>
          <td class="finance-table-content content-last tbody-title">{{loanAssetBeginInfo && loanAssetBeginInfo.totalPay}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">应付工资</td>
          <td class="finance-table-content">{{loanAssetFinalInfo && loanAssetFinalInfo.wagesPayable}}</td>
          <td class="finance-table-content content-last">{{loanAssetBeginInfo && loanAssetBeginInfo.wagesPayable}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">应付税金和罚款</td>
          <td class="finance-table-content">{{loanAssetFinalInfo && loanAssetFinalInfo.taxesPayable}}</td>
          <td class="finance-table-content content-last">{{loanAssetBeginInfo && loanAssetBeginInfo.taxesPayable}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">其他应付款</td>
          <td class="finance-table-content">{{loanAssetFinalInfo && loanAssetFinalInfo.othPayable}}</td>
          <td class="finance-table-content content-last">{{loanAssetBeginInfo && loanAssetBeginInfo.othPayable}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1"></td>
          <td class="finance-table-content"></td>
          <td class="finance-table-content content-last"></td>
        </tr>
        <tr class="finance-tbody-title">
          <td class="finance-tbody-title tbody-title1 tbody-title">应付账款</td>
          <td class="finance-table-content tbody-title">{{loanAssetFinalInfo && loanAssetFinalInfo.totalAccountPay}}</td>
          <td class="finance-table-content content-last tbody-title">{{loanAssetBeginInfo && loanAssetBeginInfo.totalAccountPay}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">应付款(设备租赁/服务)</td>
          <td class="finance-table-content">{{loanAssetFinalInfo && loanAssetFinalInfo.accountPayable}}</td>
          <td class="finance-table-content content-last">{{loanAssetBeginInfo && loanAssetBeginInfo.accountPayable}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">预收款</td>
          <td class="finance-table-content">{{loanAssetFinalInfo && loanAssetFinalInfo.preReceivable}}</td>
          <td class="finance-table-content content-last">{{loanAssetBeginInfo && loanAssetBeginInfo.preReceivable}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">应付货款</td>
          <td class="finance-table-content">{{loanAssetFinalInfo && loanAssetFinalInfo.goodsPayable}}</td>
          <td class="finance-table-content content-last">{{loanAssetBeginInfo && loanAssetBeginInfo.goodsPayable}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">其他应付账款</td>
          <td class="finance-table-content">{{loanAssetFinalInfo && loanAssetFinalInfo.othBillPayable}}</td>
          <td class="finance-table-content content-last">{{loanAssetBeginInfo && loanAssetBeginInfo.othBillPayable}}</td>
        </tr>
        <tr class="finance-tbody-title">
          <td class="finance-tbody-title tbody-title1 tbody-title">货款</td>
          <td class="finance-table-content tbody-title">{{loanAssetFinalInfo && loanAssetFinalInfo.totalLoan}}</td>
          <td class="finance-table-content content-last tbody-title">{{loanAssetBeginInfo && loanAssetBeginInfo.totalLoan}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">个人债务</td>
          <td class="finance-table-content">{{loanAssetFinalInfo && loanAssetFinalInfo.personDebt}}</td>
          <td class="finance-table-content content-last">{{loanAssetBeginInfo && loanAssetBeginInfo.personDebt}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">短期贷款</td>
          <td class="finance-table-content">{{loanAssetFinalInfo && loanAssetFinalInfo.shortLoans}}</td>
          <td class="finance-table-content content-last">{{loanAssetBeginInfo && loanAssetBeginInfo.shortLoans}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">长期借款</td>
          <td class="finance-table-content">{{loanAssetFinalInfo && loanAssetFinalInfo.longLoans}}</td>
          <td class="finance-table-content content-last">{{loanAssetBeginInfo && loanAssetBeginInfo.longLoans}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">其他借款</td>
          <td class="finance-table-content">{{loanAssetFinalInfo && loanAssetFinalInfo.othLoans}}</td>
          <td class="finance-table-content content-last">{{loanAssetBeginInfo && loanAssetBeginInfo.othLoans}}</td>
        </tr>
        <tr class="finance-tbody-title">
          <td class="finance-tbody-title tbody-title1 tbody-title">总负债</td>
          <td class="finance-table-content tbody-title">{{loanAssetFinalInfo && loanAssetFinalInfo.totalDebt}}</td>
          <td class="finance-table-content content-last tbody-title">{{loanAssetBeginInfo && loanAssetBeginInfo.totalDebt}}</td>
        </tr>
        <tr class="finance-tbody-title">
          <td class="finance-tbody-title tbody-title1 tbody-title">权益</td>
          <td class="finance-table-content tbody-title">{{loanAssetFinalInfo && loanAssetFinalInfo.totalRights}}</td>
          <td class="finance-table-content content-last tbody-title">{{loanAssetBeginInfo && loanAssetBeginInfo.totalRights}}</td>
        </tr>
        <tr class="finance-tbody-title">
          <td class="finance-tbody-title tbody-title1 tbody-title">权益+负债</td>
          <td class="finance-table-content tbody-title">{{loanAssetFinalInfo && loanAssetFinalInfo.totalRightsDebt}}</td>
          <td class="finance-table-content content-last tbody-title">{{loanAssetBeginInfo && loanAssetBeginInfo.totalRightsDebt}}</td>
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
      if (this.loanData[i].type === 1) {
        console.log(this.loanData[i].type)
        this.loanAssetFinalInfo = this.loanData[i]
        console.log(this.loanAssetFinalInfo, 'this.loanData')
      }
      if (this.loanData[i].type === 2) {
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
