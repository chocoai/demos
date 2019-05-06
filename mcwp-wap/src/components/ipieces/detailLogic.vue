<template>
  <div>
    <div class="logic-container">
          <p class="p-title">权益逻辑校验</p>
          <div class="base-content" >
            <p class="col-p" v-if='logicData[0] && (logicData[0].deviationRate || logicData[0].deviationRate == 0 || logicData[0].result)'>
              <span class='row-p-verify'>
              <span class="lable-span">权益逻辑校验偏差率:</span>
              {{logicData[0].deviationRate || logicData[0].deviationRate == 0?logicData[0].deviationRate + '%': null}}
              <span class='exceed-threshold' v-if='(logicData[0].deviationRate || logicData[0].deviationRate == 0) && logicData[0].result'>{{logicData[0].result}}</span>
              <span v-else class='beyond-computation'>{{logicData[0].result}}</span>
              </span>
            </p>
            <p class="col-p" v-else>
              <span class='row-p-verify'><span class="lable-span">权益逻辑校验偏差率:</span>未录入</span>
            </p>

          </div>
    </div>
    <div class="logic-container">
          <p class="p-title">毛利率逻辑校验</p>
          <div class="base-content" >
          <p class="col-p" v-if='logicData[1] && (logicData[1].deviationRate || logicData[1].deviationRate == 0 || logicData[1].result)'>
              <span class='row-p-verify'>
              <span class="lable-span">主要产品加权毛利率偏差率:</span>
              {{logicData[1].deviationRate || logicData[1].deviationRate == 0?logicData[1].deviationRate + '%': null}}

              <span class='exceed-threshold' v-if='(logicData[1].deviationRate || logicData[1].deviationRate == 0) && logicData[1].result'>{{logicData[1].result}}</span>
              <span v-else class='beyond-computation'>{{logicData[1].result}}</span>
              </span>
            </p>
            <p class="col-p" v-else>
              <span class='row-p-verify'><span class="lable-span">主要产品加权毛利率偏差率:</span>未录入</span>
            </p>

            <p class="col-p" v-if='logicData[2] && (logicData[2].deviationRate || logicData[2].deviationRate == 0 || logicData[2].result)'>
              <span class='row-p-verify'>
              <span class="lable-span">营业额与采购额计算毛利率偏差率:</span>
              {{logicData[2].deviationRate || logicData[2].deviationRate == 0?logicData[2].deviationRate + '%': null}}
              <span class='exceed-threshold' v-if='(logicData[2].deviationRate || logicData[2].deviationRate == 0) && logicData[2].result'>{{logicData[2].result}}</span>
              <span v-else class='beyond-computation'>{{logicData[2].result}}</span>
              </span>
            </p>
            <p class="col-p" v-else>
              <span class='row-p-verify'><span class="lable-span">营业额与采购额计算毛利率偏差率:</span>未录入</span>
            </p>

            <p class="col-p" v-if='logicData[3] && (logicData[3].deviationRate || logicData[3].deviationRate == 0 || logicData[3].result)'>
              <span class='row-p-verify'>
              <span class="lable-span">行业平均毛利率偏差率:</span>
              {{logicData[3].deviationRate || logicData[3].deviationRate == 0?logicData[3].deviationRate + '%': null}}
              <span class='exceed-threshold' v-if='(logicData[3].deviationRate || logicData[3].deviationRate == 0) && logicData[3].result'>{{logicData[3].result}}</span>
              <span v-else class='beyond-computation'>{{logicData[3].result}}</span>
              </span>
            </p>
            <p class="col-p" v-else>
              <span class='row-p-verify'><span class="lable-span">行业平均毛利率偏差率:</span>未录入</span>
            </p>
          </div>
    </div>
    <div class="logic-container">
          <p class="p-title">销售额逻辑校验</p>
          <div class="base-content" >

            <p class="col-p" v-if='logicData[4] && (logicData[4].deviationRate || logicData[4].deviationRate == 0 || logicData[4].result)'>
              <span class='row-p-verify'>
              <span class="lable-span">按计件工资计算的销售额偏差率:</span>
              {{logicData[4].deviationRate || logicData[4].deviationRate == 0?logicData[4].deviationRate + '%': null}}

              <span class='exceed-threshold' v-if='(logicData[4].deviationRate || logicData[4].deviationRate == 0) && logicData[4].result'>{{logicData[4].result}}</span>
              <span v-else class='beyond-computation'>{{logicData[4].result}}</span>
              </span>
            </p>
            <p class="col-p" v-else>
              <span class='row-p-verify'><span class="lable-span">按计件工资计算的销售额偏差率:</span>未录入</span>
            </p>

            <p class="col-p" v-if='logicData[5] && (logicData[5].deviationRate || logicData[5].deviationRate == 0 || logicData[5].result)'>
              <span class='row-p-verify'>
              <span class="lable-span">按天计算的销售额偏差率:</span>
              {{logicData[5].deviationRate || logicData[5].deviationRate == 0?logicData[5].deviationRate + '%': null}}

              <span class='exceed-threshold' v-if='(logicData[5].deviationRate || logicData[5].deviationRate == 0) && logicData[5].result'>{{logicData[5].result}}</span>
              <span v-else class='beyond-computation'>{{logicData[5].result}}</span>
              </span>
            </p>
            <p class="col-p" v-else>
              <span class='row-p-verify'><span class="lable-span">按天计算的销售额偏差率:</span>未录入</span>
            </p>
            <p class="col-p" v-if='logicData[6] && (logicData[6].deviationRate || logicData[6].deviationRate == 0 || logicData[6].result)'>
              <span class='row-p-verify'>
              <span class="lable-span">按月计算的销售额偏差率:</span>
              {{logicData[6].deviationRate || logicData[6].deviationRate == 0?logicData[6].deviationRate + '%': null}}

              <span class='exceed-threshold' v-if='(logicData[6].deviationRate || logicData[6].deviationRate == 0) && logicData[6].result'>{{logicData[6].result}}</span>
              <span v-else class='beyond-computation'>{{logicData[6].result}}</span>
              </span>
            </p>
            <p class="col-p" v-else>
              <span class='row-p-verify'><span class="lable-span">按月计算的销售额偏差率:</span>未录入</span>
            </p>

            <p class="col-p" v-if='logicData[7] && (logicData[7].deviationRate || logicData[7].deviationRate == 0 || logicData[7].result)'>
              <span class='row-p-verify'>
              <span class="lable-span">按客户账本计算的销售额偏差率:</span>
              {{logicData[7].deviationRate || logicData[7].deviationRate == 0?logicData[7].deviationRate + '%': null}}

              <span class='exceed-threshold' v-if='(logicData[7].deviationRate || logicData[7].deviationRate == 0) && logicData[7].result'>{{logicData[7].result}}</span>
              <span v-else class='beyond-computation'>{{logicData[7].result}}</span>
              </span>
            </p>
            <p class="col-p" v-else>
              <span class='row-p-verify'><span class="lable-span">按客户账本计算的销售额偏差率:</span>未录入</span>
            </p>

            <p class="col-p" v-if='logicData[8] && (logicData[8].deviationRate || logicData[8].deviationRate == 0 || logicData[8].result)'>
              <span class='row-p-verify'>
              <span class="lable-span">按存折（银行流水）的销售额偏差率:</span>
              {{logicData[8].deviationRate || logicData[8].deviationRate == 0?logicData[8].deviationRate + '%': null}}

              <span class='exceed-threshold' v-if='(logicData[8].deviationRate || logicData[8].deviationRate == 0) && logicData[8].result'>{{logicData[8].result}}</span>
              <span v-else class='beyond-computation'>{{logicData[8].result}}</span>
              </span>
            </p>
            <p class="col-p" v-else>
              <span class='row-p-verify'><span class="lable-span">按存折（银行流水）的销售额偏差率:</span>未录入</span>
            </p>

            <p class="col-p" v-if='logicData[9] && (logicData[9].deviationRate || logicData[9].deviationRate == 0 || logicData[9].result)'>
              <span class='row-p-verify'>
              <span class="lable-span">按提成计算工资的销售额偏差率:</span>
              {{logicData[9].deviationRate || logicData[9].deviationRate == 0?logicData[9].deviationRate + '%': null}}

              <span class='exceed-threshold' v-if='(logicData[9].deviationRate || logicData[9].deviationRate == 0) && logicData[9].result'>{{logicData[9].result}}</span>
              <span v-else class='beyond-computation'>{{logicData[9].result}}</span>
              </span>
            </p>
            <p class="col-p" v-else>
              <span class='row-p-verify'><span class="lable-span">按提成计算工资的销售额偏差率:</span>未录入</span>
            </p>

            <p class="col-p" v-if='logicData[10] && (logicData[10].deviationRate || logicData[10].deviationRate == 0 || logicData[10].result)'>
              <span class='row-p-verify'>
              <span class="lable-span">按客户手头现金计算的营业额偏差率:</span>
              {{logicData[10].deviationRate || logicData[10].deviationRate == 0?logicData[10].deviationRate + '%': null}}

              <span class='exceed-threshold' v-if='(logicData[10].deviationRate || logicData[10].deviationRate == 0) && logicData[10].result'>{{logicData[10].result}}</span>
              <span v-else class='beyond-computation'>{{logicData[10].result}}</span>
              </span>
            </p>
            <p class="col-p" v-else>
              <span class='row-p-verify'><span class="lable-span">按客户手头现金计算的营业额偏差率:</span>未录入</span>
            </p>

           <p class="col-p" v-if='logicData[11] && (logicData[11].deviationRate || logicData[11].deviationRate == 0 || logicData[11].result)'>
              <span class='row-p-verify'>
              <span class="lable-span">按电脑销售记录的营业额偏差率:</span>
              {{logicData[11].deviationRate || logicData[11].deviationRate == 0?logicData[11].deviationRate + '%': null}}

              <span class='exceed-threshold' v-if='(logicData[11].deviationRate || logicData[11].deviationRate == 0) && logicData[11].result'>{{logicData[11].result}}</span>
              <span v-else class='beyond-computation'>{{logicData[11].result}}</span>
              </span>
            </p>
            <p class="col-p" v-else>
              <span class='row-p-verify'><span class="lable-span">按电脑销售记录的营业额偏差率:</span>未录入</span>
            </p>

            <p class="col-p" v-if='logicData[12] && (logicData[12].deviationRate || logicData[12].deviationRate == 0  || logicData[12].result)'>
              <span class='row-p-verify'>
              <span class="lable-span">按进货周期、进货量、毛利率推算的营业额偏差率:</span>
              {{logicData[12].deviationRate || logicData[12].deviationRate == 0?logicData[12].deviationRate + '%': null}}

              <span class='exceed-threshold' v-if='(logicData[12].deviationRate || logicData[12].deviationRate == 0) && logicData[12].result'>{{logicData[12].result}}</span>
              <span v-else class='beyond-computation'>{{logicData[12].result}}</span>
              </span>
            </p>
            <p class="col-p" v-else>
              <span class='row-p-verify'><span class="lable-span">按进货周期、进货量、毛利率推算的营业额偏差率:</span>未录入</span>
            </p>

          </div>
    </div>
    <div class="logic-container">
          <p class="p-title">采购逻辑校验</p>
          <div class="base-content" >

          <p class="col-p" v-if='logicData[13] && (logicData[13].deviationRate || logicData[13].deviationRate == 0 || logicData[13].result)'>
              <span class='row-p-verify'>
              <span class="lable-span">按汇款金额和汇款频率偏差率:</span>
              {{logicData[13].deviationRate || logicData[13].deviationRate == 0?logicData[13].deviationRate + '%': null}}

              <span class='exceed-threshold' v-if='(logicData[13].deviationRate || logicData[13].deviationRate == 0) && logicData[13].result'>{{logicData[13].result}}</span>
              <span v-else class='beyond-computation'>{{logicData[13].result}}</span>
              </span>
            </p>
            <p class="col-p" v-else>
              <span class='row-p-verify'><span class="lable-span">按汇款金额和汇款频率偏差率:</span>未录入</span>
            </p>

            <p class="col-p" v-if='logicData[14] && (logicData[14].deviationRate || logicData[14].deviationRate == 0 || logicData[14].result)'>
              <span class='row-p-verify'>
              <span class="lable-span">按进货金额和进货频率偏差率:</span>
              {{logicData[14].deviationRate || logicData[14].deviationRate == 0?logicData[14].deviationRate + '%': null}}

              <span class='exceed-threshold' v-if='(logicData[14].deviationRate || logicData[14].deviationRate == 0) && logicData[14].result'>{{logicData[14].result}}</span>
              <span v-else class='beyond-computation'>{{logicData[14].result}}</span>
              </span>
            </p>
            <p class="col-p" v-else>
              <span class='row-p-verify'><span class="lable-span">按进货金额和进货频率偏差率:</span>未录入</span>
            </p>

          </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['loanData'],
  data () {
    return {
      logicData: this.loanData
    }
  },
  mounted () {
    console.log(this.loanData, 'this.loanData')
  }
}
</script>

<style lang="less" scoped>
.logic-container{
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
      padding: 0.6rem 0.1rem;

    }
    .col-p{
      font-size: 0.36rem;
      color: #4f4e4e;
      line-height: 0.86rem;
    }
    .right-logic {
      font-size: 0.36rem;
      color: #4f4e4e;
    }

    .row-p{
      display: inline-block;
      width: 4rem;
    }
    // 逻辑校验 独占一行
    .row-p-verify {
      width:100%;
    }
    //  无法计算样式
    .uncount {
      color:#ff0000;
    }
    // 超过设定阈值
    .exceed-threshold {
      color: #ff9b42;
      font-size: 0.28rem;
      background: url(../../assets/logic-verify.png) no-repeat 0 0.2rem;
      background-size: 0.44rem 0.44rem;
      margin-left: 0.28rem;
      display: inline-block;

      padding-left: 0.58rem;
    }
    .beyond-computation {
      color: #FF0000;
    }
    .car-list+.car-list {
      margin-top:0.4rem;
    }
    .row-p+.row-p{
      margin-left: 0.48rem;
    }
    .lable-span{
      margin-right: 0.1rem;
    }
  }
</style>
