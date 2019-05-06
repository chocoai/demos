<template>
<div class="rank-container">
  <div class="rank-title">
    <span class="title-left">排行</span>
    <span class="title-center">用户名</span>
    <span class="title-right">总积分</span>
  </div>
  <ul class="rank-list">
    <li class="rank-li line-1px-b" v-for="(item, index) in rankList.ranks" :key="index">
      <span v-if="item.rank == 1" class="list-left rank-img-01"></span>
      <span v-if="item.rank == 2" class="list-left rank-img-02"></span>
      <span v-if="item.rank == 3" class="list-left rank-img-03"></span>
      <span v-if="item.rank > 3" class="list-left">{{item.rank}}</span>
      <span class="list-center">{{item.name}}</span>
      <span class="list-right">{{item.score}}</span>
    </li>
  </ul>
  <div class="my-score">
    <span class="my-left">{{rankList.myRank}}</span>
    <span class="my-center">{{rankList.myName}}</span>
    <span class="my-right">{{rankList.myScore}}</span>
  </div>
</div>
</template>

<script>
import {getScoreRank} from '@/services/mcwp/activity'
export default {
  name: 'scoreRank',
  data () {
    return {
      rankList: []
    }
  },
  mounted () {
    this.getScoreRank()
  },
  methods: {
    async getScoreRank () {
      let res = await getScoreRank()
      this.rankList = res.data
    }
  }
}
</script>

<style lang="less" scoped>
.rank-container {
  width: 10.8rem;
  margin: 0 auto;
  text-align: left;
  background: #fafafa;
  font-size: 0.36rem;
  color: #666;
  .rank-title {
    width: 10.8rem;
    margin: 0 auto;
    height: 1.28rem;
    line-height: 1.28rem;
    background: #fafafa;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
    .title-left {
      margin: 0.48rem 0.64rem 0 0.48rem;
    }
    .title-center {
      margin-left: 1.52rem;
    }
    .title-right {
      position: absolute;
      right: 0.48rem;
      top: 0;
      bottom: 0;
      margin: auto;
    }
  }
  .rank-list {
    width: 10.8rem;
    margin: auto;
    background: #fff;
    padding: 1.28rem 0 2rem;
    .rank-li {
      vertical-align: center;
      height: 2rem;
      width: 10.4rem;
      line-height: 2rem;
      padding-left: 0.4rem;
      position: relative;
    }
    .list-left {
      text-align: center;
      display: block;
      width: 0.88rem;
      height: 0.88rem;
      color: #999;
      font-size: 0.4rem;
      line-height: 0.88rem;
      position: absolute;
      left: 0.4rem;
      top: 0;
      bottom: 0;
      margin: auto;
    }
    .list-center {
      margin-left: 1.52rem;
      font-size: 0.4rem;
      color: #333;
    }
    .list-right {
      font-size: 0.4rem;
      color: #333;
      position: absolute;
      right: 0.48rem;
      top: 0;
      bottom: 0;
      margin: auto;
    }
    .rank-img-01 {
      background: url(../../assets/rank_icon_01.png) 0 0 no-repeat;
      background-size: 100% 100%;
    }
    .rank-img-02 {
       background: url(../../assets/rank_icon_02.png) 0 0 no-repeat;
       background-size: 100% 100%;
     }
    .rank-img-03 {
      background: url(../../assets/rank_icon_03.png) 0 0 no-repeat;
      background-size: 100% 100%;
    }
  }
  .my-score {
    vertical-align: center;
    height: 2rem;
    width: 10.4rem;
    line-height: 2rem;
    padding-left: 0.4rem;
    position: fixed;
    bottom: 0;
    background: #fff;
    box-shadow: 0 0 0.04rem 0.1rem rgba(0,0,0,0.05);
    .my-left {
      text-align: center;
      display: block;
      width: 0.88rem;
      height: 0.88rem;
      color: #999;
      font-size: 0.4rem;
      line-height: 0.88rem;
      position: absolute;
      left: 0.4rem;
      top: 0;
      bottom: 0;
      margin: auto;
    }
    .my-center {
      margin-left: 1.52rem;
      font-size: 0.4rem;
      color: #333;
    }
    .my-right {
      font-size: 0.4rem;
      color: #333;
      position: absolute;
      right: 0.48rem;
      top: 0;
      bottom: 0;
      margin: auto;
    }
  }
}
</style>
