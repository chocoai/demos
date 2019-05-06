<template>
  <div>
    <div class="base-container">
      <p class="p-title">其他经营信息</p>
      <div class="base-content" v-if="loanBusinessOth">
        <p class="col-p">
          <span class="bold-lable">经营历史与资本积累:</span>
          <span>{{loanBusinessOth.busiMarket || '未录入'}}</span>
        </p>
        <p class="col-p">
          <span class="bold-lable">对经营者组织和市场情况现状的评价:</span>
          <span>{{loanBusinessOth.hisAccrue || '未录入'}}</span>
        </p>
        <p class="col-p">
          <span class="bold-lable">对财务信息现状的评价:</span>
          <span>{{loanBusinessOth.financialInformation || '未录入'}}</span>
        </p>
      </div>
      <p class="no-data" v-if="!loanBusinessOth">暂无相关信息</p>
    </div>
    <div class="base-container">
      <p class="p-title">主要供应商和客户</p>
      <div class="base-content" v-if="loanBusinessSuppliers.length || loanBusinessCustomers.length">
        <div class="base-supplier" v-for="(item, index) in loanBusinessSuppliers" :key="index">
          <p class="col-p">
            <span class="lable-span">主要供应商:</span>
            <span class="content-span">{{item.cname || '未录入'}}</span>
          </p>
          <p class="col-p">
            <span class="row-p">
              <span class="lable-span">采购比例:</span>
              <span class="content-span">{{item.weigthRate && item.weigthRate + '%' || '未录入'}}</span>
            </span>
            <span class="row-p">
              <span class="lable-span">付款条件:</span>
              <span class="content-span">{{item.payTerm || '未录入'}}</span>
            </span>
          </p>
          <p class="col-p">
            <span class="lable-span">往来时间:</span>
            <span class="content-span">{{item.payDate ? `${formatTime(+item.payDate.split(',')[0])}到${formatTime(+item.payDate.split(',')[1])}` : '未录入'}}</span>
          </p>
        </div>
        <div class="base-customer" v-for="(item, index) in loanBusinessCustomers" :key="index">
          <p class="col-p">
            <span class="lable-span">主要客户:</span>
            <span class="content-span">{{item.cname || '未录入'}}</span>
          </p>
          <p class="col-p">
            <span class="row-p">
              <span class="lable-span">采购比例:</span>
              <span class="content-span">{{item.weigthRate && item.weigthRate + '%' || '未录入'}}</span>
            </span>
            <span class="row-p">
              <span class="lable-span">付款条件:</span>
              <span class="content-span">{{item.payTerm}}</span>
            </span>
          </p>
          <p class="col-p">
            <span class="lable-span">往来时间:</span>
            <span class="content-span">{{item.payDate ?  `${formatTime(+item.payDate.split(',')[0])}到${formatTime(+item.payDate.split(',')[1])}` : '未录入'}}</span>
          </p>
        </div>
      </div>
      <p class="no-data" v-else>暂无相关信息</p>
    </div>
    <div class="base-container">
      <p class="p-title">投资与开支情况</p>
      <div class="base-content" v-if="loanBusinessYearFins && loanBusinessYearFins.length">
        <div class="base-yearFins" v-for="item in loanBusinessYearFins" :key="item">
          <p class="col-p" v-if="item.ftype == 1">过去12个月的投资</p>
          <p class="col-p" v-if="item.ftype == 2">过去12个月的支出</p>
          <p class="col-p" v-if="item.ftype == 3">未来12个月计划的投资</p>
          <p class="col-p" v-if="item.ftype == 4">未来12个月计划的支出</p>
          <p class="col-p">
            <span class="lable-span">业务方面:</span>
            <span class="content-span">{{item.business || '未录入'}}</span>
          </p>
          <p class="col-p">
            <span class="lable-span">私人方面:</span>
            <span class="content-span">{{item.person || '未录入'}}</span>
          </p>
        </div>
      </div>
      <p class="no-data" v-if="!(loanBusinessYearFins && loanBusinessYearFins.length)">暂无相关信息</p>
    </div>
  </div>
</template>

<script>
import Utils from '../../config/utils'

export default {
  props: ['loanData'],
  data () {
    return {
      loanBusinessOth: this.loanData.loanBusinessOth,
      loanBusinessSuppliers: this.loanData.loanBusinessSuppliers,
      loanBusinessCustomers: this.loanData.loanBusinessCustomers,
      loanBusinessYearFins: this.loanData.loanBusinessYearFins
    }
  },
  methods: {
    formatTime (time) {
      return Utils.formatTime(time)
    }
  },
  mounted () {
    console.log(this.loanData, 'this.loanData')
    console.log(this.loanBusinessSuppliers, this.loanBusinessCustomers, 'this.loanData')
  }
}
</script>

<style lang="less" scoped>
  .base-container{
    width: 10rem;
    margin: 0.26rem auto 0;
    background: #fff;
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
      overflow: hidden;
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
    .bold-lable{
      font-weight: bold;
      color: #3f3f3f;
    }
  }
</style>

