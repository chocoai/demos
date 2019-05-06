<template>
  <div>
    <div class="credit-container" >
          <p class="p-title">个人央行征信情况</p>
          <div class="base-content" v-if='creditHisCustomer' >
              <p class="col-p">
                <span class="row-p-problem" v-if='creditHisCustomer'>
                  {{proValueText}}
                </span>
                <span class="row-p-problem"  v-if='!creditHisCustomer'>
                  暂无征信分析情况
                </span>
              </p>
              <ul v-if='creditHisCustomer.loanCreditTaints'>
                <li class="col-p" v-for='item in creditHisCustomer.loanCreditTaints' :key="item">
                  <span class="problem-icon"></span>
                  <span class="row-p-problem problem-content">{{item.remark}}</span>
                </li>
              </ul>
          </div>
          <p class="no-data" v-if='!creditHisCustomer' > 暂无征信情况 </p>
    </div>
    <div v-if='creditHisCoBorrower && creditHisCoBorrower.length'>
      <div class="credit-container" v-for="(i, index) in creditHisCoBorrower" :key="index">
            <p class="p-title" v-if="i && (i.guproValueText || i.guarantorCode)">共同借款人{{i.coBorrowerName}}央行征信情况</p>
            <div class="base-content" v-if="i && (i.guproValueText || i.coBorrowerCode)">
                <p class="col-p">
                <span class="row-p-problem" v-if='i.guproValueText'>
                    {{i.guproValueText}}
                  </span>
                  <span class="row-p-problem"  v-if='!i.guproValueText'>
                    暂无征信分析情况
                  </span>
                </p>
                <ul >
                  <li class="col-p" v-for='item in i.loanCreditTaints' :key="item"  >
                    <span class="problem-icon"></span>
                    <span class="row-p-problem problem-content">{{item.remark}}</span>
                  </li>
                </ul>
            </div>
      </div>
    </div>
    <div v-if='creditHisGuarantee && creditHisGuarantee.length'>
      <div class="credit-container" v-for="(i, index) in creditHisGuarantee" :key="index">
            <p class="p-title" v-if="i && (i.guproValueText || i.guarantorCode)">共同担保人{{i.guarantorName}}央行征信情况</p>
            <div class="base-content" v-if="i && (i.guproValueText || i.guarantorCode)">
                <p class="col-p">
                <span class="row-p-problem" v-if='i.guproValueText'>
                    {{i.guproValueText}}
                  </span>
                  <span class="row-p-problem"  v-if='!i.guproValueText'>
                    暂无征信分析情况
                  </span>
                </p>
                <ul >
                  <li class="col-p" v-for='item in i.loanCreditTaints' :key="item"  >
                    <span class="problem-icon"></span>
                    <span class="row-p-problem problem-content">{{item.remark}}</span>
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
      creditHisCustomer: this.loanData.creditHisCustomer,
      creditCentralBankInfo: this.loanData.creditCentralBankInfo,
      creditHisCoBorrower: this.loanData.creditHisCoBorrower,
      creditHisGuarantee: this.loanData.creditHisGuarantee,
      proValueText: this.loanData.proValueText,
      coproValueText: this.loanData.coproValueText,
      guproValueText: this.loanData.guproValueText
    }
  },
  mounted () {
    console.log(this.loanData, 'this.loanData')
  }
}
</script>

<style lang="less" scoped>
 .credit-container{
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
      position:relative;
    }

    .row-p{
      display: inline-block;
      width: 4rem;
    }
    // 根据央行个人征信系统同报告，存在以下征信问题
    .row-p-problem {
      width:100%;
    }
    .problem-icon {
      position:absolute;
      top:0.3rem;
      width:0.16rem;
      height:0.16rem;
      border-radius:0.08rem;
      background:#a7d5ff;
    }
    // 征信问题具体问题
    .problem-content {
      margin-left:0.4rem;
    }
   .no-data {
      font-size: 0.36rem;
      color: #4f4e4e;
      line-height: 0.76rem;
      padding: 0 0.7rem;
    }

  }
</style>
