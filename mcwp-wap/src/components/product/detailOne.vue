<template>
    <div class="product-desc">
      <p class="product-ad">{{proInfo.prdAd || ''}}</p>
      <carousel-3d class="carousel-container" @before-slide-change="onAfterSlideChange" :autoplay-timeout="8000">
        <slide :index="0">
          <div class="content-first">
            <p class="product-name">{{proInfo.prdName}}</p>
            <div class="product-num">
              <div class="num-container">
                <p class="num-rate"><span class="rate-span">{{(Math.floor(proInfo.loanRate * 10000) * 360 / 10000) || 0}}</span>%</p>
                <p class="num-right">
                  <span class="num-title">贷款额度</span>
                  <span class="num-quota">最高<span class="quota-num">{{proInfo.loanLimit || 0}}</span>万</span>
                </p>
              </div>
              <div class="num-container">
                <p class="rate-title">年化利率</p>
                <p class="num-right">
                  <span class="num-title">授信周期</span>
                  <span class="num-quota">最长<span class="quota-num">{{proInfo.loanAuthDays || 0}}</span>个月</span>
                </p>
              </div>
              <div class="content-list"><p class="list-title mode-title">还款方式</p><p class="list-content">{{proInfo.repaymentText || ""}}</p></div>
              <div class="content-list"><p class="list-title interest-title">计息方式</p><p class="list-content">{{proInfo.interestText || ""}}</p></div>
              <div class="content-list"><p class="list-title interest-title">授信类型</p><p class="list-content">{{proInfo.authText || ""}}</p></div>
            </div>
          </div>
          <p class="product-title">本产品出自：{{proInfo.enterpriseName}}</p>
        </slide>
        <slide :index="1" class="content-second">
          <span class="product-type product-type-second"></span>
          <p class="product-content">{{proInfo.loanType || ""}}</p>
          <p class="product-title">本产品出自：{{proInfo.enterpriseName}}</p>
        </slide>
        <slide :index="2" class="content-second">
          <span class="product-type product-type-three"></span>
          <p class="product-content">{{proInfo.reqCondition || ""}}</p>
          <p class="product-title">本产品出自：{{proInfo.enterpriseName}}</p>
        </slide>
        <slide :index="3" class="content-second">
          <span class="product-type product-type-four"></span>
          <p class="product-content">{{proInfo.audience || ""}}</p>
          <p class="product-title">本产品出自：{{proInfo.enterpriseName}}</p>
        </slide>
        <slide :index="4" class="content-second">
          <span class="product-type product-type-five"></span>
          <p class="product-content">{{proInfo.prdName}}”支持城市为{{cityText || ""}},其他城市暂未开通</p>
          <p class="product-title">本产品出自：{{proInfo.enterpriseName}}</p>
        </slide>
      </carousel-3d>
      <ul class="dot-list">
        <li class="normal-dot" :class="{'current-dot': curIndex === 0 }"></li>
        <li class="normal-dot" :class="{'current-dot': curIndex === 1 }"></li>
        <li class="normal-dot" :class="{'current-dot': curIndex === 2 }"></li>
        <li class="normal-dot" :class="{'current-dot': curIndex === 3 }"></li>
        <li class="normal-dot" :class="{'current-dot': curIndex === 4 }"></li>
      </ul>
      <div class="product-apply" @click="goApply"></div>
    </div>
</template>
<script>
    import { Carousel3d, Slide } from 'vue-carousel-3d'
    export default {
      data () {
        return {
          proInfo: '', // 产品信息
          citiesText: '', // 支持的城市列表
          curIndex: 0,
          channel: '',
          category: ''
        }
      },
      components: {
        Carousel3d,
        Slide
      },
      props: ['proInfoData'],
      computed: {
        cityText () { // 格式化支持的城市列表
          const cities = this.citiesText
          if (cities) {
            const cityArr = cities.split(',')
            const citiesArr = []
            cityArr.forEach(function (item) {
              if (item) citiesArr.push([...new Set(item.split('/'))].join(''))
            })
            return citiesArr.join(',')
          }
        }
      },
      created () {
        this.proInfo = this.proInfoData
        this.citiesText = this.proInfoData.citiesText
        console.log(this.proInfo)
      },
      methods: {
        onAfterSlideChange (index) {
          this.curIndex = index
        },
        goApply () { // 立即申请
          this.$emit('goApply')
        }
      }
    }
</script>
<style lang="less">
.product-desc {
  width: 10.8rem;
  height: 100%;
  background-color: #fff;
  margin: 0 auto;
  background-image: url('./../../assets/product-bg-six.png');
  background-size: cover;
  -moz-user-select: none;
  -khtml-user-select: none;
  user-select: none;
  -webkit-tap-highlight-color:rgba(0,0,0,0);
  .product-ad {
    padding-top: .8rem;
    font-size:.56rem;
    line-height: .84rem;
    color: #fff;
    text-align: center;
    font-weight: bold;
    max-width: 6.8rem;
    word-wrap: break-word;
    margin: 0 auto;
  }
  .carousel-container {
    height: 11.34rem!important;
  }
  .carousel-3d-container {
    margin: 0 auto;
    padding-top: .8rem;
  }
  .carousel-3d-slider {
    height: 100%!important;
    width: 7.44rem!important;
  }
  .carousel-3d-slide {
    height: 100%!important;
    width: 7.44rem!important;
    background: #fff;
    border: none;
    border-radius: .24rem .24rem 50% 50%;
  }
  .content-first {
    padding: .64rem .64rem 0;
    .product-name {
      color: #6c5ef8;
      text-align: center;
      font-size: .44rem;
    }
    .num-container {
      overflow: hidden;
      line-height: .7rem;
    }
    .product-num {
      overflow: hidden;
      padding-top: .48rem;
      line-height: .5rem;
      font-size: .36rem;
      height: 10rem; // 设置高度，解决白色遮挡问题，暂无法预测有无其他影响
    }
    .num-rate {
      color: #ff5855;
      float: left;
      font-size: .36rem;
      float: left;
    }
    .rate-span {
      font-size: .52rem;
    }
    .rate-title {
      color: #666;
      float: left;
      font-size: .36rem;
    }
    .num-title {
      float: left;
      font-size: .32rem;
    }
    .num-right {
      float: right;
      width: 70%;
    }
    .num-quota {
      color: #333;
      float: right;
      margin-left: .5rem;
    }
    .quota-num {
      color: #ff5855;
      font-size: .48rem;
    }
    .content-list {
      margin-top: .4rem;
    }
    .list-title {
      padding-left: .64rem;
      font-size: .36rem;
      color: #666;
    }
    .list-content {
      padding: .2rem 0 0 .64rem;
      font-size: .32rem;
      color: #333;
    }
    .mode-title {
      background: url('./../../assets/product-mode.png') no-repeat 0 center;
      background-size: .48rem .48rem;
    }
    .interest-title {
      background: url('./../../assets/product-interest.png') no-repeat 0 center;
      background-size: .48rem .48rem;
    }
    .credit-title {
      background: url('./../../assets/product-credit.png') no-repeat 0 center;
      background-size: .48rem .48rem;
    }
    .product-city {
      position: absolute;
      bottom: .88rem;
      left: .9rem;
      color: #ff7470;
      text-align: center;
      width: 5.5rem;
      font-size: .28rem;
    }
  }
  .product-title {
    position: absolute;
    bottom: .88rem;
    color: #ff7470;
    text-align: center;
    width: 100%;
    font-size: .28rem;
  }
  .content-second {
    .product-type {
      background-size: cover;
      width: 2rem;
      height: .64rem;
      position: absolute;
      top: .48rem;
      left: .48rem;
    }
    .product-type-second {
      background-image: url('./../../assets/product-type-cover.png');
    }
    .product-type-three {
      background-image: url('./../../assets/product-condition.png');
    }
    .product-type-four {
      background-image: url('./../../assets/product-people.png');
    }
    .product-type-five {
      background-image: url('./../../assets/product-type-tip.png');
    }
    .product-content {
      padding: 0 .64rem;
      margin-top: 1.52rem;
      line-height: .48rem;
    }
  }
  .dot-list {
    width: 2.5rem;
    margin: 0 auto;
    overflow: hidden;
    margin-top: .48rem;
  }
  .normal-dot {
    width: .24rem;
    height: .24rem;
    background: #fff;
    float: left;
    border-radius: 50%;
    opacity: .6;
  }
  .normal-dot + .normal-dot {
    margin-left: .32rem;
  }
  .current-dot {
    opacity: 1;
  }
  .product-apply {
    background: url('./../../assets/product-apply-big.png') no-repeat;
    background-size: cover;
    width: 3.6rem;
    height: 1.2rem;
    position: relative;
    left: 3.6rem;
    top: .64rem;
    color: #fff;
    font-size: .48rem;
  }
}

</style>
