<template>
  <div>
    <div class="base-container">
      <p class="p-title">主要供货商和服务商</p>
      <div class="base-content" v-if="supplyBusinessList.length || supplyBusinessList.length">
        <div class="base-supplier" v-for="(item, index) in supplyBusinessList" :key="index">
          <p class="col-p">
            <span class="lable-span bold-lable">主要客户:</span>
            <span class="content-span">{{item.bname || '未录入'}}</span>
          </p>
          <p class="col-p">
            <span class="lable-span">地点:</span>
            <span class="content-span">{{item.address || '未录入'}}</span>
          </p>
          <p class="col-p">
            <span class="lable-span">合作年限:</span>
            <span class="content-span">{{item.startyear ? `${formatTime(+item.startyear.split(',')[0])}到${formatTime(+item.startyear.split(',')[1])}` : '未录入'}}</span>
          </p>
          <p class="col-p">
            <span class="lable-span">货物:</span>
            <span class="content-span">{{item.goods || '未录入'}}</span>
          </p>
          <p class="col-p">
            <span class="lable-span">结算方式:</span>
            <span class="content-span">{{item.settlementMethod && setMethod && setMethod.filter((result,index)=>(result.ddValue==item.settlementMethod))[0]['ddText'] || '未录入'}}</span>
          </p>
        </div>
      </div>
      <p class="no-data" v-else>暂无相关信息</p>
    </div>
    <div class="base-container">
      <p class="p-title">主要销货商和服务商</p>
      <div class="base-content" v-if="salesBusinessList.length || salesBusinessList.length">
        <div class="base-supplier" v-for="(item, index) in salesBusinessList" :key="index">
          <p class="col-p">
            <span class="lable-span bold-lable">主要客户:</span>
            <span class="content-span">{{item.bname || '未录入'}}</span>
          </p>
          <p class="col-p">
            <span class="lable-span">地点:</span>
            <span class="content-span">{{item.address || '未录入'}}</span>
          </p>
          <p class="col-p">
            <span class="lable-span">合作年限:</span>
            <span class="content-span">{{item.startyear ? `${formatTime(+item.startyear.split(',')[0])}到${formatTime(+item.startyear.split(',')[1])}` : '未录入'}}</span>
          </p>
          <p class="col-p">
            <span class="lable-span">货物:</span>
            <span class="content-span">{{item.goods || '未录入'}}</span>
          </p>
          <p class="col-p">
            <span class="lable-span">结算方式:</span>
            <span class="content-span">{{item.settlementMethod && setMethod && setMethod.filter((result,index)=>(result.ddValue==item.settlementMethod))[0]['ddText'] || '未录入'}}</span>
          </p>
        </div>
      </div>
      <p class="no-data" v-else>暂无相关信息</p>
    </div>
  </div>
</template>

<script>
import Utils from '../../config/utils'

export default {
  props: ['loanData', 'dictInfo'],
  data () {
    return {
      supplyBusinessList: this.loanData.supplyBusinessList,
      salesBusinessList: this.loanData.salesBusinessList,
      setMethod: this.dictInfo.jsfs
    }
  },
  methods: {
    formatTime (time) {
      return Utils.formatTime(time)
    }
  },
  mounted () {
    console.log(this.setMethod, 'this.loanData')
    console.log(this.supplyBusinessList, this.salesBusinessList, 'this.loanData')
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
      min-width: 20%;
    }
    .content-span{
      display: block;
      float: left;
      max-width: 70%;
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

