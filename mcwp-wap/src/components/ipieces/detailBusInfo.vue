<template>
  <div>
    <div class="base-container">
      <p class="p-title">经营主体基本信息</p>
      <div class="base-content" v-if="loanBusinessEntity">
        <p class="col-p">
          <span class="lable-span">企业名称:</span>
          <span class="content-span exist-result">{{loanBusinessEntity.name || '未录入'}}</span>
          <!-- <span v-if="(!loanBusinessEntityBO.nameRes && loanBusinessEntityBO.nameRes != 0) || loanBusinessEntityBO.nameRes==3" class="checkout-result-fail">未核实</span>
          <span v-else class="checkout-result-success" :class="{'identical-result': loanBusinessEntityBO.nameRes==0, 'different-result': loanBusinessEntityBO.nameRes!=0 }">查看结果
            <Popover class="popover-show">{{loanBusinessEntityBO.nameResMsg}}</Popover>
          </span> -->
        </p>
        <p class="col-p">
          <span class="lable-span">雇佣人数:</span>
          <span class="content-span exist-result">{{loanBusinessEntity.employeeNumber && loanBusinessEntity.employeeNumber + '人' || '未录入'}}</span>
        </p>
        <p class="col-p">
          <span class="lable-span">法人代表:</span>
          <span class="content-span">{{loanBusinessEntity.legalPerson || '未录入'}}</span>
          <!-- <span v-if="(!loanBusinessEntityBO.legalPersonRes && loanBusinessEntityBO.legalPersonRes != 0) || loanBusinessEntityBO.legalPersonRes==3" class="checkout-result-fail">未核实</span>
          <span v-else class="checkout-result-success" :class="{'identical-result': loanBusinessEntityBO.legalPersonRes==0, 'different-result': loanBusinessEntityBO.legalPersonRes!=0 }">查看结果
            <Popover class="popover-show">{{loanBusinessEntityBO.legalPersonResMsg}}</Popover>
          </span> -->
        </p>
        <p class="col-p">
          <span class="lable-span">联系方式:</span>
          <span class="content-span">{{loanBusinessEntity.telephone || '未录入'}}</span>
        </p>
        <p class="col-p">
          <span class="lable-span">营业执照:</span>
          <span class="content-span">{{loanBusinessEntity.license || '未录入'}}</span>
        </p>
        <p class="col-p">
          <span class="lable-span">经营时间:</span>
          <span class="content-span">{{loanBusinessEntity.operationTime && loanBusinessEntity.operationTime + '个月' || '未录入'}}</span>
        </p>
        <p class="col-p">
          <span class="lable-span">法律形式:</span>
          <span class="content-span">{{loanBusinessEntity.legalFormText || '未录入'}}</span>
        </p>
        <p class="col-p">
          <span class="lable-span">年收入:</span>
          <span class="content-span">{{loanData.annualIncomeText  || '未录入'}}</span>
        </p>
        <p class="col-p">
          <span class="lable-span">是否工商注册:</span>
          <span class="content-span">{{loanBusinessEntity.isbusiregis == 0 ? '否' : '是'}}</span>
        </p>
        <p class="col-p">
          <span class="lable-span">所属行业:</span>
          <span class="content-span">{{loanBusinessEntity.scopeText || '未录入'}}</span>
        </p>
        <p class="col-p">
          <span class="lable-span">经营场所所有权:</span>
          <span class="content-span">{{loanBusinessEntity.businessPlace || '未录入'}}</span>
        </p>
        <p class="col-p">
          <span class="lable-span">经营场所面积:</span>
          <span class="content-span">{{loanBusinessEntity.operationArea && loanBusinessEntity.operationArea + '平' || '未录入'}}</span>
        </p>
        <p class="col-p">
          <span class="lable-span">工作地址:</span>
          <span class="content-span">{{loanBusinessEntity.address || '未录入'}}</span>
        </p>
      </div>
      <p class="no-data" v-if="!loanBusinessEntity">暂无相关信息</p>
    </div>
    <div class="base-container">
      <p class="p-title" id="testID">经营状况</p>
      <div class="base-content" v-if="loanBusinessInfo">
        <p class="col-p">
          <span class="row-p">
            <span class="lable-span">月销售额:</span>
            <span class="content-span">{{loanBusinessInfo.monthlySale && loanBusinessInfo.monthlySale + '元' || '未录入'}}</span>
          </span>
          <span class="row-p">
            <span class="lable-span">应收账款:</span>
            <span class="content-span">{{loanBusinessInfo.accountsReceivable && loanBusinessInfo.accountsReceivable + '元' || '未录入'}}</span>
          </span>
        </p>
        <p class="col-p">
          <span class="row-p">
            <span class="lable-span">旺季:</span>
            <span class="content-span">{{loanBusinessInfo.busySeason && loanBusinessInfo.busySeason + '月份' || '未录入'}}</span>
          </span>
          <span class="row-p">
            <span class="lable-span">淡季:</span>
            <span class="content-span">{{loanBusinessInfo.slackSeason && loanBusinessInfo.slackSeason + '月份' || '未录入'}}</span>
          </span>
        </p>
        <p class="col-p">
          <span class="row-p">
            <span class="lable-span">毛利润:</span>
            <span class="content-span">{{loanBusinessInfo.grossMargin && loanBusinessInfo.grossMargin + '元' || '未录入'}}</span>
          </span>
          <span class="row-p">
            <span class="lable-span">净利润:</span>
            <span class="content-span">{{loanBusinessInfo.netProfit && loanBusinessInfo.netProfit + '元' || '未录入'}}</span>
          </span>
        </p>
        <p class="col-p">
          <span class="row-p">
            <span class="lable-span">存货:</span>
            <span class="content-span">{{loanBusinessInfo.stock && loanBusinessInfo.stock + '元' || '未录入'}}</span>
          </span>
          <span class="row-p">
            <span class="lable-span">负债:</span>
            <span class="content-span">{{loanBusinessInfo.liabilities && loanBusinessInfo.liabilities + '元' || '未录入'}}</span>
          </span>
        </p>
        <p class="col-p">
          <span class="row-p">
            <span class="lable-span">总资产:</span>
            <span class="content-span">{{loanBusinessInfo.totalAssets && loanBusinessInfo.totalAssets + '元' || '未录入'}}</span>
          </span>
          <span class="row-p">
            <span class="lable-span">经营月份:</span>
            <span class="content-span">{{loanBusinessInfo.operateMonth && loanBusinessInfo.operateMonth + '月' || '未录入'}}</span>
          </span>
        </p>
        <p id='bizInfo' class="col-p">
          <!-- <span class="row-p">
            <span class="lable-span">负债:</span>
            <span class="content-span">{{loanBusinessInfo.liabilities && loanBusinessInfo.liabilities + '元' || '未录入'}}</span>
          </span> -->
          <span class="row-p">
            <span class="lable-span">其他收入:</span>
            <span class="content-span">{{loanBusinessInfo.otherIncome || '未录入'}}</span>
          </span>
        </p>
        <p class="col-p">
          <span class="lable-span">月可支配金额:</span>
          <span class="content-span">{{loanBusinessInfo.disposable && loanBusinessInfo.disposable + '元' || '未录入'}}</span>
        </p>
        <p class="col-p">
          <span class="lable-span">期间内资本注入:</span>
          <span class="content-span">{{loanBusinessInfo.capitalInjection && loanBusinessInfo.capitalInjection + '元' || '未录入'}}</span>
        </p>
        <p class="col-p">
          <span class="lable-span">期间内提取资金:</span>
          <span class="content-span">{{loanBusinessInfo.fundsExtracted && loanBusinessInfo.fundsExtracted + '元' || '未录入'}}</span>
        </p>
        <p class="col-p">
          <span class="lable-span">成本结构及其他:</span>
          <span class="content-span">{{loanBusinessInfo.costStructureOther && loanBusinessInfo.costStructureOther  || '未录入'}}</span>
        </p>
      </div>
       <p class="no-data" v-if="!loanBusinessInfo">暂无相关信息</p>
    </div>
  </div>
</template>

<script>
import Popover from '../../components/popover.vue'
import Utils from '../../config/utils'

export default {
  components: {
    Popover
  },
  props: ['loanData'],
  data () {
    return {
      loanBusinessEntity: this.loanData.loanBusinessEntity,
      loanBusinessInfo: this.loanData.loanBusinessInfo,
      loanBusinessEntityBO: this.loanData.loanBusinessEntityBO
    }
  },
  methods: {
    formatTime (time) {
      return Utils.formatTime(time)
    }
  },
  mounted () {
    console.log(this.loanData, 'this.loanData')
  }
}
</script>

<style lang="less" scoped>
  .base-container{
    width: 10rem;
    margin: 0.26rem auto;
    background: #fff;
    padding-bottom: 0.3rem;
    .no-data{
      text-align: center;
      padding: 0.3rem;
      font-size: 0.36rem;
    }
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
    .title-pic{
      position: absolute;
      width: 0.6rem;
      height: 0.6rem;
      top: 0.34rem;
      right: 0.28rem;
    }
    .content-pic{
      margin-top: 0.15rem;
      width: 0.6rem;
      height: 0.6rem;
      margin-left: 0.2rem;
      float: left;
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
      // overflow: hidden;
    }
    .col-p::after {
      content: '';
      display: table;
      clear: both;
    }
    .row-p{
      display: block;
      float: left;
      width: 4rem;
    }
    .row-p+.row-p{
      margin-left: 0.48rem;
    }
    .lable-span{
      margin-right: 0.1rem;
      display: block;
      float: left;
      max-width: 50%;
    }
    .content-span{
      display: block;
      float: left;
      max-width: 80%;
    }
    .identity-icon{
      width: 0.44rem;
      height: 0.4rem;
      margin-top: 0.2rem;
    }
    .exist-result{
      max-width: 55%;
    }
    .checkout-result-fail{
      color: #8c8888;
      font-size: 0.28rem;
      background: url(../../assets/checkout-fail.png) no-repeat 0 0.25rem;
      background-size: 0.34rem 0.34rem;
      margin-left: 0.28rem;
      display: block;
      float: left;
      padding-left: 0.46rem;
    }
    .identical-result {
      background: url(../../assets/checkout-success.png) no-repeat 0 0.2rem;
    }
    .different-result {
      background: url(../../assets/authentication-fail.png) no-repeat 0 0.2rem;
    }
    .checkout-result-success{
      color: #8c8888;
      font-size: 0.28rem;
      background-size: 0.44rem 0.44rem;
      margin-left: 0.28rem;
      display: block;
      float: left;
      padding-left: 0.46rem;
      position: relative;
    }
    .authentication-fail{
      color: #8c8888;
      font-size: 0.28rem;
      background: url(../../assets/authentication-fail.png) no-repeat 0 0.2rem;
      background-size: 0.44rem 0.44rem;
      margin-left: 0.28rem;
      display: block;
      float: left;
      padding-left: 0.46rem;
    }
    .checkout-result-success:hover .popover-show {
      display: block;
    }
    .checkout-result-success .popover-show {
      display: none;
    }
  }
</style>
