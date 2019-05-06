<template>
<div class="score-container">
  <tabs class="score-tab" color="#fa494b" line-width="30" >
    <tab title="获取记录">
      <ul class="get" v-if="rewardList.length">
        <li class="get-li line-1px-b" v-for="(item, index) in rewardList" :key="index">
          <h2 class="get-title">{{item.scoreDetail}}</h2>
          <span class="get-date">{{item.time}}</span>
          <h2 class="get-score">+{{item.score}}</h2>
        </li>
      </ul>
      <div class="no-detail" v-else>暂无记录</div>
    </tab>
    <tab title="兑换记录">
      <ul class="get" v-if="consumerList.length">
        <li class="get-li line-1px-b" v-for="(item, index) in consumerList" :key="index">
          <h2 class="get-title">{{item.scoreDetail}}</h2>
          <span class="get-date">{{item.time}}</span>
          <h2 class="get-score">-{{item.score}}</h2>
        </li>
      </ul>
      <div class="no-detail" v-else>暂无记录</div>
    </tab>
  </tabs>
</div>
</template>

<script>
import {getScoreDetail} from '@/services/mcwp/activity'

export default {
  name: 'scoreDetail',
  data () {
    return {
      rewardList: [],
      consumerList: []
    }
  },
  mounted () {
    this.getScoreDetail()
  },
  methods: {
    time (time) {
      if (time < 10) {
        return '0' + time
      } else {
        return time
      }
    },
    async getScoreDetail () {
      const that = this
      let res = await getScoreDetail()
      let data = res.data
      data.rewardDetails &&
      data.rewardDetails.map(item => {
        let now = new Date(item.time)
        item.time =
          that.time(now.getFullYear()) +
          '.' +
          that.time(now.getMonth() + 1) +
          '.' +
          that.time(now.getDate()) +
          '  ' +
          that.time(now.getHours()) +
          ':' +
          that.time(now.getMinutes()) +
          ':' +
          that.time(now.getSeconds())
      })
      data.consumerDetails &&
      data.consumerDetails.map(item => {
        let now = new Date(item.time)
        item.time =
          that.time(now.getFullYear()) +
          '.' +
          that.time(now.getMonth() + 1) +
          '.' +
          that.time(now.getDate()) +
          '  ' +
          that.time(now.getHours()) +
          ':' +
          that.time(now.getMinutes()) +
          ':' +
          that.time(now.getSeconds())
      })
      this.rewardList = data.rewardDetails
      this.consumerList = data.consumerDetails
    }
  }
}
</script>

<style lang="less" scoped>
.score-container {
  width: 10.8rem;
  margin: 0 auto;
  .score-tab {
    height: 1.32rem;
    padding-top: 1.32rem;
  }
  .get {
    background: #fff;
    .get-li {
      text-align: left;
      height: 2rem;
      margin-left: 0.48rem;
      position: relative;
      .get-title {
        font-size: 0.4rem;
        color: #333;
        font-weight: 200;
        padding: 0.48rem 0 0.28rem;
      }
      .get-date {
        font-size: 0.32rem;
        color: #888;
      }
      .get-score {
        font-weight: normal;
        font-size: 0.48rem;
        color: #333;
        height: 1rem;
        line-height: 1rem;
        position: absolute;
        right: 0.48rem;
        top: 0;
        bottom: 0;
        margin: auto;
      }
    }
  }
  .no-detail {
    padding-top: 3.6rem;
    text-align: center;
    font-size: 0.64rem;
    font-weight: normal;
    color: #333333;
  }
}
</style>
