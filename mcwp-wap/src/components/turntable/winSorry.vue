<template>
  <popover-bg class="turntable-win-prize">
    <img class="title" src="../../assets/turntable_win_sorry.png" alt='title' />
    <img class="close" @click="close" src="../../assets/turntable_close_default.png" alt="close" />
    <div class="prize-content">
      <div v-if="todayChance || doStart">
        <p class="content-title">您没有中奖</p>
        <p class="content-title">本日还有{{todayChance}}次中奖机会</p>
        <v-button class="detail-continue" @next="close">再来一次</v-button>
      </div>
      <div v-else>
        <p class="content-title">本日抽奖机会已用完</p>
        <p v-if="partnerStatus" class="content-tip">(进行{{partnerStatus === 1 ? '分享' : '邀请'}}额外获得一次抽奖机会)</p>
        <v-button class="detail-share" @next="share">分享</v-button>
      </div>
    </div>
  </popover-bg>
</template>

<script>
import PopoverBg from './../popoverBg'
import VButton from './../button'

export default {
  props: ['todayChance', 'partnerStatus', 'doStart'],
  components: {
    PopoverBg,
    VButton
  },
  data () {
    return {
    }
  },
  methods: {
    next () {
      this.$emit('next')
    },
    close () {
      this.$emit('close')
    },
    share () {
      this.$emit('close')
      this.$emit('share')
    }
  }
}
</script>

<style lang="less" scoped>
.turntable-win-prize {
  position: relative;
  .title {
    width: 7.24rem;
    height: 2.12rem;
    position: absolute;
    top: 1.68rem;
    left: 1.78rem;
    z-index: 100;
  }
  .prize-content {
    width: 9rem;
    height: auto;
    border-radius: .2rem;
    background: #fff;
    position: absolute;
    top: 3.08rem;
    left: .9rem;
    padding-top: .8rem;
  }
  .content-title {
    font-size: .48rem;
    color: #333;
    text-align: center;
    padding-top: .64rem;
  }
  .content-tip {
    font-size: .36rem;
    color: #666;
    text-align: center;
    padding-top: 1rem;
  }
  .detail-continue {
    background: #fe5559;
    width: 3.44rem;
    height: 1.2rem;
    line-height: 1.2rem;
    border-radius: .6rem;
    font-size: .4rem;
    color: #fff;
    margin-top: 1rem;
    margin-bottom: .8rem;
  }
  .detail-share {
    background: #666af6;
    width: 3.44rem;
    height: 1.2rem;
    line-height: 1.2rem;
    border-radius: .6rem;
    font-size: .4rem;
    color: #fff;
    margin-top: .6rem;
    margin-bottom: .8rem;
  }
  .close {
    position: absolute;
    width: .64rem;
    height: .64rem;
    padding: .4rem;
    right: .24rem;
    top: .24rem;
  }
}
</style>
