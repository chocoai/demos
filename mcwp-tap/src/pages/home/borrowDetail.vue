<template>
   <div class="borrow-detail-contanier">
     <div class="borrow-detail-header-contanier">
       <div class="borrow-header-title">贷款余额(元)</div>
       <div class="borrow-header-money">{{this.loanBalance}}</div>
       <div class="borrow-next-pay-title">
         <span>下期还款日</span>
         <span class="borrow-next-pay-right">还款本金(元)</span>
       </div>
       <div class="borrow-date-interest">
         <span>{{this.nextRepaymentDate}}</span>
         <span class="borrow-interest">{{this.totalInterest}}</span>
       </div>
     </div>
     <ul class="borrow-plan-list" v-if="planList.length > 0">
       <li class="borrow-plan-cell" v-for="item in planList" :value="item" :key="item.repaymentDate">
         <div class="borrow-lastdate">最后还款日 : {{item.repaymentDate}} </div>
         <div class="borrow-periods-status">
           <span class="borrow-plan-periods">{{"第"+item.period+"/"+planList.length+"期"}}</span>
           <span :style="{'color': statusColor[item.status]}">{{item.status}}</span>
         </div>
         <span class="borrow-plan-money">{{item.principal}}</span>
         <div class="borrow-plan-line"></div>
       </li>
     </ul>
   </div>
</template>

<script>
import { getRepaymentPlanLc } from "../../service/home.js";
export default {
  name: "borrowDetail",
  data() {
    return {
      code: this.$route.query.merchantCode, //code
      planList: [],
      currentPeriod: null, //当前第几期
      loanBalance: null, //贷款余额
      nextRepaymentDate: null, //下月还款日
      totalInterest: null, //总利息
      repaymentDate: null, //每月还款日
      totalPI: null, //本期状态
      interest: null, //每期利息
      monthTotal: null, //每期本息和
      period: null, //还款期数
      principal: null, //每期应还本金
      principalReturned: null, //每期已还本金
      status: null, // 本期状态
      statusColor: {
        未还款: ["#333"], //未还款
        已逾期: ["#fa494b"], //已逾期
        已还款: ["#888"] //已还款
      }
    };
  },
  mounted() {
    this.getRepaymentPlan();
  },
  methods: {
    async getRepaymentPlan() {
      this.$toast.loading({
        message: "正在加载...",
        mask: true
      });
      const { code } = this;
      let res = await getRepaymentPlanLc({ code: code });
      this.$toast.clear();
      let data = res.data;
      if (data != null) {
        let list = data.list;
        this.planList = list.reverse();
        this.loanBalance = data.loanBalance;
        this.nextRepaymentDate = data.nextRepaymentDate;
        // this.totalInterest = data.totalInterest;
        for (let i = 0; i < this.planList.length; i++) {
          if (this.planList[i].repaymentDate == data.nextRepaymentDate) {
            this.totalInterest = this.planList[i].principal;
          }
        }
      }
    }
  }
};
</script>

<style lang="less" scoped>
.borrow-detail-contanier {
  width: 10.8rem;
  height: 100vh;
  margin: 0 auto;
  position: relative;
  .borrow-detail-header-contanier {
    position: relative;
    background: #fff;
    padding: 0.64rem 0 0 0.8rem;
    height: 4.9rem;
    .borrow-header-title {
      color: #666;
      font-size: 0.36rem;
      text-align: left;
    }
    .borrow-header-money {
      color: #333;
      font: 0.8rem bold;
      text-align: left;
      margin-top: 0.32rem;
    }
    .borrow-next-pay-title {
      position: relative;
      color: #666;
      font-size: 0.36rem;
      text-align: left;
      margin-top: 0.8rem;
      .borrow-next-pay-right {
        position: absolute;
        left: 5.2rem;
      }
    }
    .borrow-date-interest {
      position: relative;
      color: #333;
      font-size: 0.52rem;
      text-align: left;
      margin-top: 0.32rem;
      .borrow-interest {
        position: absolute;
        left: 5.2rem;
      }
    }
  }
  .borrow-plan-list {
    margin-top: 0.32rem;
    background-color: #fff;
    width: 100%;
    .borrow-plan-cell {
      /*width: 100%;*/
      height: 2rem;
      padding: 0.48rem;
      position: relative;
      &:last-child {
        .borrow-plan-line {
          background-color: #fff;
        }
      }
      .borrow-plan-line {
        position: absolute;
        width: 100%;
        background-color: #ddd;
        height: 1px;
        bottom: 0;
      }
      .borrow-lastdate {
        font-size: 0.4rem;
        color: #333;
        text-align: left;
      }
      .borrow-periods-status {
        text-align: left;
        margin-top: 0.32rem;
        font-size: 0.4rem;
        color: #888;
        position: absolute;
        bottom: 0.48rem;
        .borrow-plan-periods {
          width: 1.92rem;
          margin-right: 0.24rem;
        }
      }
      .borrow-plan-money {
        position: absolute;
        color: #333;
        display: flex;
        justify-content: center;
        right: 0.48rem;
        top: 50%;
        transform: translateY(-50%);
        font-size: 0.48rem;
      }
    }
  }
}
</style>
