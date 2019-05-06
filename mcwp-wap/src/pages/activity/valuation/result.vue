<template>
  <div class="activity-valuationResult-container">
    <div class="content">
      <p class="house">你的房屋估值为</p>
      <p class="price"><span class="number">{{houseTotal}}</span>万元</p>
      <p class="compare-left" v-if="!growthRate">在过去的两年，暂无增长率</p>
      <p class="compare-left" v-if="growthRate">在过去的两年，{{growthRate >= 0 ? '上涨' : '下跌'}}<span class="number">{{growthRate}}</span>%</p>
      <p class="compare-right">打败朋友圈好友<span class="number">{{num}}</span>个</p>
      <p class="compare-right-right" v-if="risk == '暂无排名'">排名暂无排名</p>
      <p class="compare-right-right" v-if="risk != '暂无排名'">排名第<span class="number">{{risk}}</span>位</p>
      <img class="qr-img" src='../../../assets/activity-valuation-qr.png' alt='qr' />
      <div class="title">
        <img class="title-img" src='../../../assets/img_moments.png' alt='moments' />
        <p class="title-rank">朋友圈房地产增值排行榜</p>
      </div>
      <ul class="moments" v-if="list">
        <li class="moments-item" v-for="(i, index) in list" :key="index" :style="`background-color: ${!(index%2)? '#fff' : '#fafafa'}`">
          <div class="moments-wrap">
            <img v-if="index == 0" class="medal" src='../../../assets/icon_gold.png' alt="gold" />
            <img v-if="index == 1" class="medal" src='../../../assets/icon_silver.png' alt="silver" />
            <img v-if="index == 2" class="medal" src='../../../assets/icon_copper.png' alt="copper" />
            <p v-if="index > 2" class="number">{{index + 1}}</p>
            <img class="head" :src='i.headimgUrl' alt="head" />
            <p class="name">{{i.nickName}}</p>
          </div>
          <p class="percent">{{i.growthRate}}%</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { getActivityValuationResult } from '../../../service/activityValuation'
import Config from '../../../config/index'
import Wxsdk from '../../../config/wxJsSdk'

export default {
  data () {
    return {
      list: '',
      num: '',
      risk: '',
      growthRate: '',
      houseTotal: ''
    }
  },
  created () {
    this.getInfo()
    Wxsdk.wxShare(() => {
    }, {}, 'activityValuation')
  },
  methods: {
    async getInfo () {
      let valuationCode = sessionStorage.getItem(Config.constants.activityValuation)
      let res = await getActivityValuationResult({valuationCode})
      this.list = res.data.list
      this.num = res.data.num
      this.growthRate = res.data.growthRate
      this.risk = res.data.risk
      this.houseTotal = res.data.houseTotal
      if (res.data.growthRate) sessionStorage.setItem(Config.constants.activityValuationGrowthRate, res.data.growthRate)
    }
  }
}
</script>

<style lang="less" scoped>
.activity-valuationResult-container {
  position: relative;
  width: 10.8rem;
  // height: 50rem;
  background-color: #fff;
  // background: url('./../../../assets/bg_activity-valuation-result.png') no-repeat;
  // background-size: 10.8rem 10rem;
  &::before {
    content: '';
    position: absolute;
    top: -1rem;
    width: 10.8rem;
    height: 15rem;
    background: url('./../../../assets/bg_activity-valuation-result.png') no-repeat;
    background-size: 10.8rem;
  }
  .content {
    position: absolute;
    z-index: 100;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    color: #25396b;
    font-family: "lanLantinghei SC";
    .house {
      padding-top: 1.2rem;
      font-size: .64rem;
      font-weight: bold;
      line-height: 1;
    }
    .price {
      font-weight: bold;
      font-size: .48rem;
      padding-top: .4rem;
      line-height: 1;
      .number {
        font-size: 1.12rem;
        color: #f1605a;
      }
    }
    .compare-left, .compare-right, .compare-right-right {
      font-size: .44rem;
      padding-top: .64rem;
      line-height: 1;
      .number {
        font-weight: bold;
        font-size: .68rem;
        color: #f1605a;
      }
    }
    .compare-left {
      margin-left: -1.2rem;
    }
    .compare-right {
      margin-right: -2rem;
    }
    .compare-right-right {
      margin-right: -4.2rem;
    }
    .qr-img {
      width: 3.08rem;
      height: 3.48rem;
      padding-top: 1rem;
    }
    .title {
      display: flex;
      align-items: center;
      // justify-content: flex-start;
      width: 100%;
      padding-top: 1rem;
    }
    .title-img {
      width: .4rem;
      height: .4rem;
      margin-left: .56rem;
      animation: rotating 1.2s linear infinite;
    }
    .title-rank {
      margin-left: .24rem;
      font-size: .4rem;
      color: #666;
    }
    .moments {
      padding-top: .4rem;
      width: 10.8rem;
    }
    .moments-item {
      height: 2rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background-color: #fff;
      // width: 10.8rem;
      .moments-wrap {
        display: flex;
        align-items: center;
      }
      .medal {
        width: .88rem;
        height: .88rem;
        padding-left: .32rem;
      }
      .number {
        color: #999;
        width: .88rem;
        height: .88rem;
        line-height: .88rem;
        text-align: center;
        padding-left: .32rem;
      }
      .head {
        width: 1.2rem;
        height: 1.2rem;
        padding-left: .28rem;
      }
      .name {
        padding-left: .36rem;
        color: #333;
        font-size: .4rem;
      }
      .percent {
        color: #333;
        font-size: .4rem;
        padding-right: .48rem;
      }
    }
  }
}

@keyframes rotating{
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
