<template>
  <popover-bg class="turntable-win-cash">
    <img class="close" @click="close" src="../../assets/turntable_close_default.png" alt="close" />
    <div class="prize-tip">
      <p class="tip-title">活动说明</p>
      <p class="time-title">一、活动时间:</p>
      <p class="time-content">{{`${formatTime(+activityTime.split(',')[0])}到${formatTime(+activityTime.split(',')[1])}`}}</p>
      <p class="time-title">二、活动及兑奖说明:</p>
      <p class="time-content" >{{descr}}</p>
      <p class="time-title">三、活动奖品:</p>
      <div v-for='(item, index) in prizes' :key='index'>
        <p class="time-content">{{item.awardName}}:{{item.prizeName}}</p>
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
      descr: this.lotteryInfo.descr,
      activityTime: this.lotteryInfo.activityTime,
      prizes: this.lotteryInfo.prizes
    }
  },
  mounted () {
    console.log(this.lotteryInfo)
  },
  methods: {
    next () {
      this.$emit('next')
    },
    close () {
      this.$emit('close')
    },
    formatTime (time) {
      return Utils.formatTimeToS(time)
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
  }
  .prize-tip {
    padding: .96rem;
  }
  .tip-title {
    font-size: .48rem;
    color: #fff;
    text-align: center;
  }
  .time-title {
    padding: .64rem 0 .4rem;
    font-size: .4rem;
    color: #fff;
  }
  .time-content {
    font-size: .36rem;
    color: #fff;
    line-height: .6rem;
  }
}
</style>

