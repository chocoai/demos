<template>
    <div class="product-desc" v-if="showPro">
      <div flex="main:center cross:center" class="product-banner">
        <img :src="proInfo.coverUrl" class="product-img" />
        <div v-if="proInfo.prdAd" class="product-ad">{{proInfo.prdAd}}</div>
      </div>
      <h2 class="product-title">{{proInfo.prdName}}</h2>
      <div class="product-loan" flex="box:mean">
          <div class="loan-limit">
              <p class="limit-title">贷款额度</p>
              <p class="limit-max">最高<span>{{proInfo.loanLimit || 0}}</span>万</p>
          </div>
          <div class="day-rate">
              <p class="rate-title">年化利率</p>
              <p class="rate-count"><span>{{(Math.floor(proInfo.loanRate * 10000) * 360 / 10000) || 0}}</span>%</p>
          </div>
          <div class="loan-cycle">
              <p class="cycle-title">授信周期</p>
              <p class="cycle-max">最长<span>{{proInfo.loanAuthDays || 0}}</span>个月</p>
          </div>
      </div>
      <div class="loan-introduce">
          <div class="repay-mode clearfix">
              <p class="repay-icon icon"></p>
              <p class="introduce-title">还款方式：</p>
              <p class="introduce-content">{{proInfo.repaymentText || ""}}</p>
          </div>
          <div class="interest-mode clearfix">
              <p class="interest-icon icon"></p>
              <p class="introduce-title">计息方式：</p>
              <p class="introduce-content">{{proInfo.interestText || ""}}</p>
          </div>
          <div class="credit-type clearfix">
              <p class="credit-icon icon"></p>
              <p class="introduce-title">授信类型：</p>
              <p class="introduce-content">{{proInfo.authText || ""}}</p>
          </div>
      </div>
      <div class="load-lending" data-title="放款方式">
          <div class="lending-content">{{proInfo.loanType || ""}}</div>
      </div>
      <div class="load-qual" data-title="申请资质">
          <div class="qual-content">{{proInfo.reqCondition || ""}}</div>
      </div>
      <div class="load-people" data-title="使用人群">
          <div class="people-content">{{proInfo.audience || ""}}</div>
      </div>
      <div class="load-reminder" data-title="温馨提示">
          <div class="people-content">“{{proInfo.prdName}}”支持城市为{{cityText || ""}}，其他城市暂缓开通</div>
      </div>
      <p class="apply-enterpriseName">本产品出自：{{proInfo.enterpriseName}}</p>
      <div class="apply-btn" @click="goApply">立即申请</div>
    </div>
    <v-blank v-else>很抱歉，该贷款产品已失效！</v-blank>
</template>

<script>
    import defaultImg from '../../assets/default-img.png'
    import VBlank from '../../components/blank'
    export default {
      components: {
        VBlank
      },
      data () {
        return {
          proInfo: '', // 产品信息
          citiesText: '', // 支持的城市列表
          prdType: '', // 产品类型
          showPro: true,     // 停贷产品不显示
          getTime: new Date().getTime(),  // 时长统计
          defaultImg,
          channel: '',
          category: ''
        }
      },
      props: ['proInfoData'],
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
      mounted () {
        this.proInfo = this.proInfoData
        this.citiesText = this.proInfoData.citiesText
        console.log(this.proInfoData)
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
    position: relative;
    width: 10.8rem;
    background-color: #fff;
    margin: 0 auto;
    padding-bottom: 1.20rem;
    .product-banner {
        position: relative;
        width: 10.8rem;
        height: 7.12rem;
        border: 0;
        overflow: hidden;
        .product-img {
          position: absolute;
          left: 0;
          top: 0;
          width: 10.8rem;
          height: 7.12rem;
          display: block;
          border: 0;
        }
        .product-ad {
            position: relative;
            background-color: #02527c;
            color: #fff;
            line-height: 1.5;
            padding: .3rem .32rem;
            text-align: center;
            width: 8.4rem;
            font-size: .8rem;
        }
    }
    .product-title {
        position: relative;
        font-size: .56rem;
        color: #333;
        margin: .3rem 0 0 .64rem;
    }
    .product-loan {
        position: relative;
        margin: .8rem 0 0;
        width: 100%;
        min-height: .8rem;
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
        font-size: .36rem;
        text-align: center;
        .limit-title {
            color: #666;
        }
        .limit-max {
            color: #333;
            margin-top: .24rem;
            line-height: .6rem;
            height: .6rem;
            span {
                color: #f64349;
                font-size: .6rem;
            }
        }
    }
    .day-rate {
        font-size: .36rem;
        text-align: center;
        .rate-title {
            color: #666;
        }
        .rate-count {
            color: #333;
            margin-top: .24rem;
            line-height: .6rem;
            height: .6rem;
            vertical-align: text-bottom;
            span {
                color: #f64349;
                font-size: .6rem;
            }
        }
    }
    .loan-cycle {
        font-size: .36rem;
        text-align: center;
        .cycle-title {
            color: #666;
        }
        .cycle-max {
            color: #333;
            margin-top: .24rem;
            line-height: .6rem;
            height: .6rem;
            span {
                color: #f64349;
                font-size: .6rem;
            }
        }
    }
    .loan-introduce {
        position: relative;
        border: .04rem dashed #b7b7b7;
        border-radius: .4rem;
        margin: 1.20rem .4rem 0 .4rem;
        padding: .8rem .64rem;
        overflow: hidden;
        &:after {
            content: ".";
            height: 0;
            visibility: hidden;
            display: block;
            clear: both;
        }
        .icon {
            float: left;
            width: .4rem;
            height: .4rem;
            margin-top: .1rem;
            vertical-align: bottom;
            &.repay-icon {
                background: url(../../assets/product_icon_repayment.png) no-repeat center center;
                background-size: cover;
            }
            &.interest-icon {
                background: url(../../assets/product_icon_Interest.png) no-repeat center center;
                background-size: cover;
            }
            &.credit-icon {
                background: url(../../assets/product_icon_credittype.png) no-repeat center center;
                background-size: cover;
            }
        }
        .introduce-title {
            float: left;
            margin-left: .16rem;
            font-size: .4rem;
            color: #f64349;
            vertical-align: bottom;
        }
        .introduce-content {
            float: right;
            width: 6rem;
            font-size: .4rem;
            color: #333;
            text-align: left;
        }
        .repay-mode {
            position: relative;
        }
        .interest-mode {
            position: relative;
            margin-top: .8rem;
        }
        .credit-type {
            position: relative;
            margin-top: .8rem;
        }
    }

    .load-lending, .load-qual, .load-people {
        position: relative;
        border: .04rem dashed #b7b7b7;
        border-radius: .4rem;
        margin: 1.12rem .4rem 0 .4rem;
        padding: 0 .8rem .8rem .8rem;
        word-wrap: break-word;
        &:before {
            content: attr(data-title);
            position: absolute;
            top: -.32rem;
            left: .8rem;
            display: block;
            background: url(../../assets/product_bg_title.png) no-repeat center center;
            background-size: cover;
            width: 3.42rem;
            height: .78rem;
            line-height: .78rem;
            text-align: center;
            font-size: .42rem;
            color: #fff;
        }
    }
    .load-reminder {
        position: relative;
        border: .04rem dashed #b7b7b7;
        border-radius: .4rem;
        margin: 1.12rem .4rem 0 .4rem;
        padding: 0 .8rem .8rem .8rem;
        &:before {
            content: attr(data-title);
            position: absolute;
            top: -.32rem;
            left: .8rem;
            display: block;
            background-color: #fff;
            width: 2.2rem;
            height: .6rem;
            line-height: .6rem;
            text-align: center;
            font-size: .4rem;
            font-weight: bold;
            color: #ef5853;
        }
    }
    .lending-content, .qual-content, .people-content {
        margin-top: 1.12rem;
        font-size: .4rem;
        color: #333;
        line-height: 1.8;
        word-wrap: break-word;
    }
    .apply-enterpriseName {
        color: #ef5853;
        font-size: .4rem;
        margin-top: .6rem;
        text-align: center;
    }
    .apply-btn {
        position: relative;
        margin: .8rem auto 0 auto;
        background: url(../../assets/product_btn_application.png) no-repeat center center;
        background-size: cover;
        width: 6.48rem;
        height: 1.52rem;
        font-size: .72rem;
        color: #fff;
        line-height: 1.52rem;
        text-align: center;
        display: block;
    }
}
</style>
