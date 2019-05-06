<template>
  <div class="finance-tab-container">
    <table class="finance-tab">
      <thead class="finance-thead">
        <th class="finance-table-title">项目</th>
        <th class="finance-table-content">本年累计金额</th>
      </thead>
      <tbody class="finance-tbody">
        <tr class="finance-tbody-title">
          <td class="finance-table-title tbody-title1 tbody-title">期初现金</td>
          <td class="finance-table-content tbody-title">{{loanAssetYearCashFlow && loanAssetYearCashFlow.initialCash}}</td>
        </tr>
        <tr class="finance-tbody-title">
          <td class="finance-table-title tbody-title1 tbody-title">现金流入合计</td>
          <td class="finance-table-content tbody-title">{{loanAssetYearCashFlow && loanAssetYearCashFlow.totalCashInflow}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">变卖库存</td>
          <td class="finance-table-content">{{loanAssetYearCashFlow && loanAssetYearCashFlow.sellStock}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">回收应收账款</td>
          <td class="finance-table-content">{{loanAssetYearCashFlow && loanAssetYearCashFlow.recAccount}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">获得贷款</td>
          <td class="finance-table-content">{{loanAssetYearCashFlow && loanAssetYearCashFlow.acquireLoan}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">其他生意收入</td>
          <td class="finance-table-content">{{loanAssetYearCashFlow && loanAssetYearCashFlow.othBusiIncome}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">机械设备出租收入</td>
          <td class="finance-table-content">{{loanAssetYearCashFlow && loanAssetYearCashFlow.machineLeaseIncome}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">加工服务收入</td>
          <td class="finance-table-content">{{loanAssetYearCashFlow && loanAssetYearCashFlow.machiningIncome}}</td>
        </tr>
        <tr class="finance-tbody-title">
          <td class="finance-table-title tbody-title1 tbody-title">经营活动现金流出合计</td>
          <td class="finance-table-content tbody-title">{{loanAssetYearCashFlow && loanAssetYearCashFlow.operateCashOutflow}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">土地租金</td>
          <td class="finance-table-content">{{loanAssetYearCashFlow && loanAssetYearCashFlow.landLease}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">农用设备的维修费</td>
          <td class="finance-table-content">{{loanAssetYearCashFlow && loanAssetYearCashFlow.farmingRepair}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">税款</td>
          <td class="finance-table-content">{{loanAssetYearCashFlow && loanAssetYearCashFlow.taxs}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">工人的工资</td>
          <td class="finance-table-content">{{loanAssetYearCashFlow && loanAssetYearCashFlow.workerSalary}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">雇工伙食费</td>
          <td class="finance-table-content">{{loanAssetYearCashFlow && loanAssetYearCashFlow.employeeMeals}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">杂费，伙食费</td>
          <td class="finance-table-content">{{loanAssetYearCashFlow && loanAssetYearCashFlow.overhead}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">房屋租金</td>
          <td class="finance-table-content">{{loanAssetYearCashFlow && loanAssetYearCashFlow.houseLease}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">房屋修理费用</td>
          <td class="finance-table-content">{{loanAssetYearCashFlow && loanAssetYearCashFlow.houseRepair}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">招待费</td>
          <td class="finance-table-content">{{loanAssetYearCashFlow && loanAssetYearCashFlow.invitationFee}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">仓储费用</td>
          <td class="finance-table-content">{{loanAssetYearCashFlow && loanAssetYearCashFlow.storageFee}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">安保费用</td>
          <td class="finance-table-content">{{loanAssetYearCashFlow && loanAssetYearCashFlow.securityFee}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">其他生意费用</td>
          <td class="finance-table-content">{{loanAssetYearCashFlow && loanAssetYearCashFlow.othBillFee}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">私人交通费</td>
          <td class="finance-table-content">{{loanAssetYearCashFlow && loanAssetYearCashFlow.traffic}}</td>
        </tr>
        <tr class="finance-tbody-title">
          <td class="finance-table-title tbody-title1 tbody-title">其他的现金流出合计</td>
          <td class="finance-table-content tbody-title">{{loanAssetYearCashFlow && loanAssetYearCashFlow.otherCashOutflow}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">办理贷款的费用</td>
          <td class="finance-table-content">{{loanAssetYearCashFlow && loanAssetYearCashFlow.loanFee}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">其他贷款的还款</td>
          <td class="finance-table-content">{{loanAssetYearCashFlow && loanAssetYearCashFlow.payOthLoan}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">贷款的还款</td>
          <td class="finance-table-content">{{loanAssetYearCashFlow && loanAssetYearCashFlow.payLoan}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">退款支付，债务支付</td>
          <td class="finance-table-content">{{loanAssetYearCashFlow && loanAssetYearCashFlow.payRefund}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">投资</td>
          <td class="finance-table-content">{{loanAssetYearCashFlow && loanAssetYearCashFlow.investment}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">家庭和其他个人的支出</td>
          <td class="finance-table-content">{{loanAssetYearCashFlow && loanAssetYearCashFlow.familyPersonPay}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">有针对性使用要求的贷款</td>
          <td class="finance-table-content">{{loanAssetYearCashFlow && loanAssetYearCashFlow.specificLoan}}</td>
        </tr>
        <tr class="finance-tbody-title">
          <td class="finance-table-title tbody-title1 tbody-title">期末现金余额</td>
          <td class="finance-table-content tbody-title">{{loanAssetYearCashFlow && loanAssetYearCashFlow.finalCashBalance}}</td>
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
      loanAssetYearCashFlow: ''
    }
  },
  mounted () {
    console.log(this.loanData, 'this.loanData')
    this.loanAssetYearCashFlow = this.loanData.loanAssetAgroCashFlow
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
    width: 5.76rem;
    text-align: right;
    padding-right: 0.5rem;
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
