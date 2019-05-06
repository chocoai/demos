<template>
  <div>
    <div class="base-container">
      <p id='customer' class="p-title">职业信息</p>
      <div class="base-content" v-if="proInfoData">
        <p class="col-p">
          <span class="row-p">
            <span class="lable-span">企业名称:</span>
            <span class="content-span">{{proInfoData && proInfoData.corpName || '未录入'}}</span>
          </span>
        </p>
        <p class="col-p">
          <span class="lable-span">所属行业:</span>
            <span class="content-span">{{proInfoData && proInfoData.industryText || '未录入'}}</span>
        </p>
        <p class="col-p">
          <span class="lable-span">月收入:</span>
          <span class="content-span">{{proInfoData.salaryMonth && proInfoData.salaryMonth + '元' || '未录入'}}</span>
        </p>
        <p class="col-p">
          <span class="lable-span">联系电话:</span>
          <span class="content-span">{{proInfoData && proInfoData.telephone || '未录入'}}</span>
        </p>
        <p class="col-p">
          <span class="lable-span">经营地址:</span>
          <span class="content-span">{{proInfoData.address  || '未录入'}}</span>
        </p>
        <p class="col-p">
          <span class="lable-span">主营业务或职务:</span>
          <span class="content-span">{{proInfoData.mainBusiness  || '未录入'}}</span>
        </p>
        <p class="col-p">
          <span class="lable-span">收入所得结构:</span>
          <span class="content-span">{{proInfoData.structOfSalary  || '未录入'}}</span>
        </p>
        <p class="col-p">
          <span class="lable-span">备注:</span>
          <span class="content-span">{{proInfoData.remark  || '未录入'}}</span>
        </p>
      </div>
      <p class="no-data" v-if="!proInfoData">暂无相关信息</p>
    </div>
  </div>
</template>

<script>

export default {
  components: {
  },
  props: ['loanData'],
  data () {
    return {
      proInfoData: this.loanData
    }
  },
  methods: {
  },
  mounted () {
    console.log(this.loanData)
  }
}
</script>

<style lang="less" scoped>
  .base-container{
    width: 10rem;
    margin: 0.26rem auto;
    background: #fff;
    padding-bottom: 0.3rem;
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
    .no-data{
      text-align: center;
      padding: 0.3rem;
      font-size: 0.36rem;
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
      max-width: 59%;
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
  }
  .face-title, .card-title {
    font-size: .5rem;
    line-height: .8rem;
    color: #1d1d1d;
  }
  .face-title{
    color: #43b549;
  }
  .face-title-fail {
    font-size: .5rem;
    line-height: .8rem;
    color: #f82335;
  }
  .card-title + .card-title {
    margin-bottom: .3rem;
  }
  .face-prob {
    font-size: .3rem;
    color: #313131;
    line-height: .6rem;
    height: .6rem;
    margin-bottom: .3rem;
  }
  .face-result, .card-result {
    width: 100%;
  }
  .face-result + .face-result, .card-result + .card-result {
    margin-top: .8rem;
  }
  .checkout-result-success:hover .popover-show {
    display: block;
  }
   .checkout-result-success .popover-show {
    display: none;
  }
</style>
