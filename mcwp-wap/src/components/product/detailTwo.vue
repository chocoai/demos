<template>
    <div class="product-desc">
      <div class="product-banner">
          <p class="product-ad">{{proInfo.prdAd || ''}}</p>
      </div>
      <div class="product-normal-content">
          <div class="product-normal-box">
            <h2 class="product-title">{{proInfo.prdName}}</h2>
            <div class="product-loan" flex="box:mean">
                <div class="loan-limit">
                    <p class="limit-max">最高<span>{{proInfo.loanLimit || 0}}</span>万</p>
                    <p class="limit-title">贷款额度</p>
                </div>
                <div class="day-rate">
                    <p class="rate-count"><span>{{(Math.floor(proInfo.loanRate * 10000) * 360 / 10000) || 0}}</span>%</p>
                    <p class="rate-title">年化利率</p>
                </div>
                <div class="loan-cycle">
                    <p class="cycle-max">最长<span>{{proInfo.loanAuthDays || 0}}</span>个月</p>
                    <p class="cycle-title">授信周期</p>
                </div>
            </div>
            <div class="repayment-methods">
                <p class="repay-icon icon"></p>
                <div class="introduce-title">还款方式</div>
                <div class="introduce-content"> {{proInfo.repaymentText || ""}} </div>
            </div>
            <div class="interest-methods">
                <p class="interest-icon icon"></p>
                <div class="introduce-title">计息方式</div>
                <div class="introduce-content"> {{proInfo.interestText || ""}} </div>
            </div>
            <div class="credit-type">
                <p class="credit-icon icon"></p>
                <div class="introduce-title">授信类型</div>
                <div class="introduce-content">{{proInfo.authText || ""}}</div>
            </div>
          </div>
      </div>
      <div class="explain-content">
            <div class="loanType-methods">
                <div class="explain-title-type"></div>
                <div class="explain-list"> {{proInfo.loanType || ""}} </div>
            </div>
            <div class="reqCondition-methods">
               <div class="explain-title-condition"></div>
                <div class="explain-list"> {{proInfo.reqCondition || ""}} </div>
            </div>
            <div class="audience-type">
                <div class="explain-title-people"></div>
                <div class="explain-list">{{proInfo.audience || ""}}</div>
            </div>
      </div>
      <div class="load-reminder-wrap" >
          <p class="people-content">“{{proInfo.prdName}}”支持城市为{{cityText || ""}}，其他城市暂缓开通</p>
          <p class="product-title">本产品出自：{{proInfo.enterpriseName}}</p>
      </div>
      <p class="product-apply" @click="goApply"></p>
    </div>
</template>
<script>
    export default {
      data () {
        return {
          proInfo: '', // 产品信息
          citiesText: '', // 支持的城市列表
          channel: '',
          category: ''
        }
      },
      props: ['proInfoData'],
      mounted () {
        this.proInfo = this.proInfoData
        this.citiesText = this.proInfoData.citiesText
      },
      computed: {
        cityText () { // 格式化支持的城市列表
          const cities = this.citiesText
          const cityArr = cities.split(',')
          const citiesArr = []
          cityArr.forEach(function (item) {
            if (item) citiesArr.push([...new Set(item.split('/'))].join(''))
          })
          return citiesArr.join(',')
        }
      },
      methods: {
        goApply () { // 立即申请
          this.$emit('goApply')
        }
      }
    }
</script>
<style lang="less" scoped>
.product-desc {
    width: 10.8rem;
    background-color: #fff;
    margin: 0 auto;
    padding-bottom: 1.20rem;
    background-image: url('./../../assets/product-bg-seven.png');
    -moz-user-select: none;
    -khtml-user-select: none;
    user-select: none;
    -webkit-tap-highlight-color:rgba(0,0,0,0);
    .product-banner{
      position: relative;
      width: 10.8rem;
      height: 6.14rem;
      border: 0;
      margin: 0 auto;
      overflow: hidden;
      background-image: url('./../../assets/product-covertpls-7.png');
      background-size:100%;
    }
    .product-ad {
      text-align: center;
      font-size: .72rem;
      font-weight: bold;
      line-height: 1.18rem;
      color: #ff7470;
      width: 6.84rem;
      margin: 0 auto;
      margin-top: 3.04rem;
    }
    .product-normal-content{
      margin: 0 auto;
      width: 9.54rem;
      height: 13.3rem;
      background-image: url('./../../assets/product-detail-bg.png');
      background-size:100%;
      .product-normal-box{
        width:8.28rem;
        padding: 2.28rem .62rem 0 .64rem;
      }
      .product-title{
        text-align: center;
        position: relative;
        font-size: .48rem;
        color: #362e48;
      }
      .product-loan {
        position: relative;
        padding-top: .64rem;
        width: 100%;
        overflow: hidden;
        &:after {
            content: ".";
            height: 0;
            visibility: hidden;
            display: block;
            clear: both;
        }
      }
      .loan-limit {
        font-size: .40rem;
        text-align: center;
        .limit-title {
            margin-top: .4rem;
            color: #323f4a;
        }
        .limit-max {
            color: #323f4a;
            margin-top: .24rem;
            line-height: .6rem;
            height: .6rem;
            span {
                color: #df626a;
                font-size: .56rem;
            }
        }
      }
      .day-rate {
        font-size: .40rem;
        text-align: center;
        .rate-title {
            margin-top: .4rem;
            color: #323f4a;
        }
        .rate-count {
            color: #323f4a;
            margin-top: .24rem;
            line-height: .6rem;
            height: .6rem;
            vertical-align: text-bottom;
            span {
                color: #df626a;
                font-size: .56rem;
            }
        }
      }
      .loan-cycle {
        font-size: .40rem;
        text-align: center;
        .cycle-title {
            margin-top: .4rem;
            color: #323f4a;
        }
        .cycle-max {
            color: #323f4a;
            margin-top: .24rem;
            line-height: .6rem;
            height: .6rem;
            span {
                color: #df626a;
                font-size: .56rem;
            }
        }
      }
      .repayment-methods{
        margin-top: .8rem;
      }
      .introduce-title {
        margin-left: .5rem;
        font-size: .4rem;
        font-weight: bold;
        line-height: .8rem;
        padding-left: .2rem;
        color: #323f4a;
        vertical-align: bottom;
      }
      .introduce-content {
        margin-top: .16rem;
        padding-left: .72rem;
        font-size: .36rem;
        color: #323f4a;
        text-align: left;
      }
      .interest-methods,.credit-type {
        margin-top: .72rem;
      }
      .icon {
        float: left;
        width: .6rem;
        height: .6rem;
        margin-top: .1rem;
        // margin-left: .64rem;
        vertical-align: bottom;
        &.repay-icon {
            background: url(../../assets/product_m7_icon_repayment.png) no-repeat center center;
            background-size: cover;
        }
        &.interest-icon {
            background: url(../../assets/product_m7_icon_Interest.png) no-repeat center center;
            background-size: cover;
        }
        &.credit-icon {
            background: url(../../assets/product_m7_icon_credittype.png) no-repeat center center;
            background-size: cover;
        }
      }
    }
    .explain-content{
      width: 9.54rem;
      height: 23.64rem;
      margin: 0 auto;
      background-image: url('./../../assets/product-type-bg.png');
      background-size:100%;
      position: relative;
      overflow: hidden;
      .explain-title-type {
        width: 4rem;
        height: .96rem;
        background-image: url('./../../assets/product-type-seven.png');
        background-size:100%;
        margin: 0 auto;
        margin-top: 1.82rem;
      }
      .explain-title-condition {
        width: 4rem;
        height: .96rem;
        background-image: url('./../../assets/product-condition-seven.png');
        background-size:100%;
        margin: 0 auto;
        margin-top: 1.42rem;
      }
      .explain-title-people {
        width: 4rem;
        height: .96rem;
        background-image: url('./../../assets/product-people-seven.png');
        background-size:100%;
        margin: 0 auto;
        margin-top: 1.42rem;
      }
      .explain-list {
        padding: .4rem .5rem;
        min-height: 4rem;
      }
    }
    .load-reminder-wrap {
      width: 9.54rem;
      height: 5.54rem;
      margin: 0 auto;
      background-image: url('./../../assets/product-tip-bg.png');
      background-size:100%;
      overflow: hidden;
      position: relative;
      .people-content {
        margin-top: 2.4rem;
        font-size: .4rem;
        padding: 0 .64rem;
        color: #333;
        line-height: .6rem;
        word-wrap: break-word;
        color: #ff7470;
      }
      .product-title {
        position: absolute;
        bottom: .7rem;
        width: 100%;
        text-align: center;
        font-size: .4rem;
        line-height: .6rem;
        color: #362e48;
      }
    }
    .product-apply {
      background: url('./../../assets/product-apply-btn.png') no-repeat;
      background-size: cover;
      width: 6.5rem;
      height: 1.54rem;
      margin: 0 auto;
      margin-top: 2rem;
      margin-bottom: 2.72rem;
    }
}

</style>
