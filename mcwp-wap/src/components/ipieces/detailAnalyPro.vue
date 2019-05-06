<template>
  <div>
      <div>
        <div class="analypro-container">
          <p class="p-title">生产经营法阵趋势</p>

          <div class="base-content" v-if='loanBusinessDevpTrends.length !== 0' >
            <div class='product-year' v-for='item in loanBusinessDevpTrends' :key="item">
              <p class="col-p-year"> {{item.tyear || '未录入'}}</p>

              <p class="col-p">
                <span class="row-p">
                  <span class="lable-span">机器数量:</span>
                  {{item.machineQuantity && item.machineQuantity + '台' || '未录入'}}
                </span>
                <span class="row-p"><span class="lable-span">工资总额:</span>{{item.wagesTotal && item.wagesTotal + '万元' || '未录入'}}</span>
              </p>
              <p class="col-p">
                <span class="row-p"><span class="lable-span">工人人数:</span>{{item.workerQuantity && item.workerQuantity + '人' || '未录入'}}</span>
                <span class="row-p"><span class="lable-span">营业额:</span>{{item.turnover && item.turnover + '万元' || '未录入'}}</span>
              </p>
              <p class="col-p">
                <span class="row-p"><span class="lable-span">开工天数:</span>{{item.days && item.days + '天' || '未录入'}}</span>
                <span class="row-p"><span class="lable-span">利润:</span>{{item.profit && item.profit + '万元' || '未录入'}}</span>
              </p>
              <p class="col-p">
                <span class="row-p"><span class="lable-span">存货:</span>{{item.stock && item.stock + '万元' || '未录入'}}</span>
                <span class="row-p"><span class="lable-span">应付账款:</span>{{item.accountsPayable && item.accountsPayable + '万元' || '未录入'}}</span>
              </p>
              <p class="col-p">
                <span class="row-p"><span class="lable-span">应收账款:</span>{{item.accountsReceivable && item.accountsReceivable + '万元' || '未录入'}}</span>
              </p>
            </div>
          </div>
          <p class="no-data" v-if="loanBusinessDevpTrends.length == 0">暂无相关信息</p>
        </div>

        <div class="analypro-container">
          <p class="p-title">主营产品成本结构分析</p>
          <div class="base-content" v-if='loanBusinessProductDto'>
            <p class="col-p-profit"><span class="lable-span">加权利润率:</span>{{loanBusinessProductDto.weighingGrossRate ? loanBusinessProductDto.weighingGrossRate : '未录入' }}</p>
            <p class="col-p-remarks">
              <span class="row-p"><span class="lable-span">备注:</span>{{loanBusinessProductDto.remark ? loanBusinessProductDto.remark : '未录入' }}</span>
            </p>
            <div v-for='item in loanBusinessProductDto.loanBusinessMajorDtos' class='product-kind' :key="item">
              <p class="col-p-year"> {{item.prdKind || '未录入'}}</p>
              <p class="col-p">
                <span class="row-p"><span class="lable-span">售价:</span>{{item.price && item.price+'元' || '未录入'}}</span>
                <span class="row-p"><span class="lable-span">占比:</span>{{item.mrate && item.mrate+'%'  || '未录入'}}</span>
              </p>
              <p class="col-p">
                <span class="row-p-cost"><span class="lable-span">根据成本结构（或工艺流程）计算的成本:</span>{{item.cost && item.cost+'元' || '未录入'}}</span>
              </p>
            </div>

          </div>
          <p class="no-data " v-if="!loanBusinessProductDto">暂无相关信息</p>
        </div>

    </div>
  </div>
</template>

<script>
export default {
  props: ['loanData'],
  data () {
    return {
      loanBusinessDevpTrends: this.loanData.loanBusinessDevpTrends,
      loanBusinessProductDto: this.loanData.loanBusinessProductDto
    }
  },
  mounted () {
    console.log(this.loanData, 'this.loanData')
    console.log(this.loanBusinessDevpTrends)
  }
}
</script>

<style lang="less" scoped>
  .analypro-container{
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
    .base-top-show{
      position: absolute;
      width: 0.6rem;
      height: 0.6rem;
      top: 0.34rem;
      right: 0.28rem;
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
      padding: 0 0.7rem;

    }
    .product-year {
      margin-top:0.35rem;
    }
    // 年份
    .col-p-year {
      color:#3e3e3e;
      font-size:0.36rem;
      font-weight:600;
      line-height: 0.86rem;
    }
    .col-p{
      font-size: 0.36rem;
      color: #4f4e4e;
      line-height: 0.76rem;
    }
    // 加权利润率 备注
    .col-p-profit , .col-p-remarks  {
      line-height: 0.86rem;
       color: #4f4e4e;
      font-size: 0.36rem;
    }
    // 产品种类
    .product-kind {
      margin-top:0.2rem;
      margin-bottom:0.05rem;
    }
    .row-p{
      display: inline-block;
      width: 4rem;
    }
    // 根据成本结构（或工艺流程）计算的成本
    .row-p-cost {
      width:100%;
    }
    //
    .no-data {
      font-size: 0.36rem;
      color: #4f4e4e;
      line-height: 0.76rem;
      padding: 0 0.7rem;
    }
    .row-p+.row-p{
      margin-left: 0.48rem;
    }
    .lable-span{
      margin-right: 0.1rem;
    }
  }
</style>
