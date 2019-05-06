<template>
  <div class="finance-tab-container">
    <table class="finance-tab">
      <thead class="finance-thead">
        <th class="finance-table-title">项目</th>
        <th class="finance-table-content">本年累计金额</th>
      </thead>
      <tbody class="finance-tbody">
        <tr class="finance-tbody-title">
          <td class="finance-table-title tbody-title1 tbody-title">销售收入</td>
          <td class="finance-table-content tbody-title">{{loanAssetYearIncstat && loanAssetYearIncstat.sellIncome}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">种植收入</td>
          <td class="finance-table-content">{{loanAssetYearIncstat && loanAssetYearIncstat.plantIncome}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">养殖收入</td>
          <td class="finance-table-content">{{loanAssetYearIncstat && loanAssetYearIncstat.farmIncome}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">其他生意收入</td>
          <td class="finance-table-content">{{loanAssetYearIncstat && loanAssetYearIncstat.othBusiIncome}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">机械设备出租收入</td>
          <td class="finance-table-content">{{loanAssetYearIncstat && loanAssetYearIncstat.machineLeaseIncome}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">加工服务收入</td>
          <td class="finance-table-content">{{loanAssetYearIncstat && loanAssetYearIncstat.machiningIncome}}</td>
        </tr>
        <tr class="finance-tbody-title">
          <td class="finance-table-title tbody-title1 tbody-title">经营直接成本</td>
          <td class="finance-table-content tbody-title">{{loanAssetYearIncstat && loanAssetYearIncstat.operateCost}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">种植成本</td>
          <td class="finance-table-content">{{loanAssetYearIncstat && loanAssetYearIncstat.plantCost}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">喂养成本</td>
          <td class="finance-table-content">{{loanAssetYearIncstat && loanAssetYearIncstat.farmCost}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">其他生意成本</td>
          <td class="finance-table-content">{{loanAssetYearIncstat && loanAssetYearIncstat.othBusiCost}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">其他成本</td>
          <td class="finance-table-content">{{loanAssetYearIncstat && loanAssetYearIncstat.othCost}}</td>
        </tr>
        <tr class="finance-tbody-title">
          <td class="finance-table-title tbody-title1 tbody-title">农业周期杂费</td>
          <td class="finance-table-content tbody-title">{{loanAssetYearIncstat && loanAssetYearIncstat.agricultureCost}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">购买用于施肥的幼畜</td>
          <td class="finance-table-content">{{loanAssetYearIncstat && loanAssetYearIncstat.neonate}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">防疫及受精成本</td>
          <td class="finance-table-content">{{loanAssetYearIncstat && loanAssetYearIncstat.epidemicCost}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">包装的成本</td>
          <td class="finance-table-content">{{loanAssetYearIncstat && loanAssetYearIncstat.packageCost}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">收割的装卸和饲料的装卸</td>
          <td class="finance-table-content">{{loanAssetYearIncstat && loanAssetYearIncstat.bargeCost}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">秋收和饲料的运输成本</td>
          <td class="finance-table-content">{{loanAssetYearIncstat && loanAssetYearIncstat.trasportCost}}</td>
        </tr>
        <tr class="finance-tbody-title">
          <td class="finance-table-title tbody-title1 tbody-title">经营的毛利润</td>
          <td class="finance-table-content tbody-title">{{loanAssetYearIncstat && loanAssetYearIncstat.grossProfit}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">经营的杂费</td>
          <td class="finance-table-content">{{loanAssetYearIncstat && loanAssetYearIncstat.incidentalExpenses}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">土地租金</td>
          <td class="finance-table-content">{{loanAssetYearIncstat && loanAssetYearIncstat.landLease}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">农用设备的维修费</td>
          <td class="finance-table-content">{{loanAssetYearIncstat && loanAssetYearIncstat.farmingRepair}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">税款</td>
          <td class="finance-table-content">{{loanAssetYearIncstat && loanAssetYearIncstat.taxs}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">工人的资金</td>
          <td class="finance-table-content">{{loanAssetYearIncstat && loanAssetYearIncstat.workerSalary}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">雇工伙食费</td>
          <td class="finance-table-content">{{loanAssetYearIncstat && loanAssetYearIncstat.employeeMeals}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">杂费，管理费</td>
          <td class="finance-table-content">{{loanAssetYearIncstat && loanAssetYearIncstat.overhead}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">房屋租金</td>
          <td class="finance-table-content">{{loanAssetYearIncstat && loanAssetYearIncstat.houseLease}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">房屋修理费用</td>
          <td class="finance-table-content">{{loanAssetYearIncstat && loanAssetYearIncstat.houseRepair}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">招待费</td>
          <td class="finance-table-content">{{loanAssetYearIncstat && loanAssetYearIncstat.invitationFee}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">仓储费用</td>
          <td class="finance-table-content">{{loanAssetYearIncstat && loanAssetYearIncstat.storageFee}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">安保费用</td>
          <td class="finance-table-content">{{loanAssetYearIncstat && loanAssetYearIncstat.securityFee}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">其他生意费用</td>
          <td class="finance-table-content">{{loanAssetYearIncstat && loanAssetYearIncstat.othBillFee}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">私人交通费</td>
          <td class="finance-table-content">{{loanAssetYearIncstat && loanAssetYearIncstat.traffic}}</td>
        </tr>
        <tr class="finance-tbody-title">
          <td class="finance-table-title tbody-title1 tbody-title">经营净利润</td>
          <td class="finance-table-content tbody-title">{{loanAssetYearIncstat && loanAssetYearIncstat.netProfit}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">其他收入</td>
          <td class="finance-table-content">{{loanAssetYearIncstat && loanAssetYearIncstat.othIncome}}</td>
        </tr>
        <tr class="finance-tbody-content">
          <td class="finance-table-title tbody-content1">家庭支出</td>
          <td class="finance-table-content">{{loanAssetYearIncstat && loanAssetYearIncstat.familyPay}}</td>
        </tr>
        <tr class="finance-tbody-title">
          <td class="finance-table-title tbody-title1 tbody-title">年可支</td>
          <td class="finance-table-content tbody-title">{{loanAssetYearIncstat && loanAssetYearIncstat.disposable}}</td>
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
      loanAssetYearIncstat: ''
    }
  },
  mounted () {
    console.log(this.loanData, 'this.loanData')
    this.loanAssetYearIncstat = this.loanData.loanAssetAgroIncstat
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
