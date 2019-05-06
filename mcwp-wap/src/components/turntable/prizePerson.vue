<template>
  <popover-bg class="turntable-win-cash">
    <img class="close" @click="close" src="../../assets/turntable_close_default.png" alt="close" />
    <div class="prize-person">
      <p class="person-title">我的奖品</p>
      <div class="person-container" v-if="myPrizes && myPrizes.length > 0">
        <div class="person-list-wrapper">
          <div class="person-list" v-for='(item, index) in myPrizes' :key='index'>
            <div class="list-left">
              <p class="prize-type">{{item.awardName}}</p>
            </div>
            <div class="list-right">
              <p class="prize-name">{{item.prizeName}}</p>
              <p class="time-title">兑换期限</p>
              <p class="prize-time">{{`${formatTime(+item.cashTime.split(',')[0])}到${formatTime(+item.cashTime.split(',')[1])}`}}</p>
            </div>
            <button class="prize-botton" v-bind:class="{ 'prize-overtime': item.cashStatus  === '0' }" @click="next(item.cashStatus,item.recordCode)">{{item.cashStatus  === '0' ? '兑奖' : item.cashStatus  === '2' ? '未领取' : item.cashStatus  === '3' ? '已领取' : '已过期'}}</button>
          </div>
        </div>
      </div>
      <div v-else>
        <img class="no-data" src="../../assets/no-data-prize.png" alt="data" />
        <p class="no-prize">暂无中奖纪录</p>
      </div>
    </div>
  </popover-bg>
</template>

<script>
import PopoverBg from './../popoverBg'
import Utils from '../../config/utils'

export default {
  components: {
    PopoverBg
  },
  props: ['lotteryInfo'],
  data () {
    return {
      myPrizes: this.lotteryInfo.myPrizes
    }
  },
  methods: {
    next (cashStatus, recordCode) {
      this.$emit('next', cashStatus, recordCode)
    },
    close () {
      this.$emit('close')
    },
    formatTime (time) {
      return Utils.formatTime(time)
    }
  }
}
</script>

<style lang="less" scoped>
.turntable-win-cash {
  .title {
    width: 100%;
  }
  .close {
    position: absolute;
    width: .64rem;
    height: .64rem;
    padding: .4rem;
    right: .24rem;
    top: .24rem;
    z-index: 100;
  }
  // .prize-person {
  //   width: 100%;
  //   height: 100%;
  // }
  .person-container {
    // position: absolute;
    // top: 2.08rem;
    // left: 0;
    // right: 0;
    height: 100vh;
    padding-top: 2.2rem;
    box-sizing: border-box;
  }
  .person-list-wrapper {
    height: 100%;
    overflow-y: scroll;
  }
  .person-title {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    font-size: .48rem;
    color: #fff;
    text-align: center;
    padding: .96rem 0 .64rem;
  }
  .person-list {
    width: 9.04rem;
    height: 2.52rem;
    background: url('./../../assets/prize-list-bg.png') right center no-repeat;
    background-size: cover;
    margin: 0 auto;
    position: relative;
  }
  .person-list + .person-list {
    margin-top: .4rem;
  }
  .list-left {
    float: left;
    width: 2.48rem;
  }
  .list-right {
    float: left;
    padding-left: .4rem;
  }
  .prize-type {
    font-size: .4rem;
    color: #333;
    font-weight: bold;
    line-height: 2.52rem;
    text-align: center;
  }
  .prize-name {
    color: #333;
    font-size: .48rem;
    padding-top: .4rem;
  }
  .time-title {
    color: #888;
    font-size: .28rem;
    padding-top: .4rem;
  }
  .prize-time {
    color: #888;
    font-size: .28rem;
    padding-top: .12rem;
  }
  .prize-botton {
    width: 1.8rem;
    height: .72rem;
    border-radius: .36rem;
    border: 1px solid #fe5559;
    position: absolute;
    top: .9rem;
    right: .48rem;
    color: #fe5559;
    font-size: .24rem;
    background: #fff;
  }
  .prize-overtime {
    background: #fe5559;
    color: #fff;
  }
  .no-data{
    width: 2rem;
    height: 2rem;
    position: absolute;
    top: 3rem;
    left: 4.4rem;
  }
  .no-prize {
    position: absolute;
    top: 6rem;
    left: 0;
    right: 0;
    font-size: .48rem;
    color: #fff;
    text-align: center;
  }
}
</style>

