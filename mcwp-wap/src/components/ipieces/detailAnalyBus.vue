<template>
  <div>
      <div>
        <div class="analybus-container">
          <p class="p-title">主营业务平均毛利率分析</p>
          <div class="base-content" >
            <p class="col-p-profit">
              <span class="lable-span">加权利润率:</span>
              {{loanBusinessProfitDto.weighingGrossRate ? loanBusinessProfitDto.weighingGrossRate + '%' : '未录入' }}
            </p>
            <ul v-if='loanBusinessProfitDto.loanBusinessMajorDtos'>
              <li v-for='(item, index) in loanBusinessProfitDto.loanBusinessMajorDtos' class='product-kind' :key="index">
                <p class="col-p">
                  <span class="row-p"><span class="lable-span">产品种类:</span>{{item.prdKind || '未录入'}}</span>
                  <span class="row-p"><span class="lable-span">进价:</span>{{item.cost && item.cost + '元' || '未录入'}}</span>
                </p>
                <p class="col-p">
                  <span class="row-p"><span class="lable-span">利润:</span>{{item.profit && item.profit + '元' || '未录入'}}</span>
                  <span class="row-p"><span class="lable-span">售价:</span>{{item.price && item.price + '元' || '未录入'}}</span>
                </p>
                <p class="col-p">
                  <span class="row-p"><span class="lable-span">毛利率:</span>{{item.grossRate && item.grossRate + '%' || '未录入'}}</span>
                   <span class="row-p"><span class="lable-span">销售比例:</span>{{item.mrate && item.mrate + '%' || '未录入'}}</span>
                </p>
              </li>
            </ul>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['loanData'],
  data () {
    return {
      loanBusinessProfitDto: this.loanData.loanBusinessProfitDto
    }
  },
  mounted () {
    console.log(this.loanData, 'this.loanData')
  }
}
</script>

<style lang="less" scoped>
  .analybus-container{
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
      margin-top:0.35rem;
    }

    .col-p{
      font-size: 0.36rem;
      color: #4f4e4e;
      line-height: 0.76rem;
    }
    .col-p-profit {
      width:100%;
      font-size: 0.36rem;
      color: #4f4e4e;
      line-height: 0.86rem;
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

    .row-p+.row-p{
      margin-left: 0.48rem;
    }
    .lable-span{
      margin-right: 0.1rem;
    }
  }
</style>

