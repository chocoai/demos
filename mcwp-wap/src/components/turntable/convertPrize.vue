

<template>
  <popover-bg class="turntable-win-convert">
    <img class="title" src="../../assets/turntable_win_convert.png" alt='title' />
    <img class="close" @click="close" src="../../assets/turntable_close_default.png" alt="close" />
    <div class="prize-content">
      <div v-if="prizeType === '1'">
        <p class="content-title">现金红包已打入“我的佣金”</p>
        <p class="content-tip">请在“个人中心”-“我的佣金”进行提现</p>
      </div>
      <div v-if="prizeType === '3'">
        <p class="content-title">积分已到账中</p>
        <p class="content-tip">请在“个人中心”-“积分兑换”进行兑换</p>
      </div>
      <div v-else>
        <p class="content-title">请按兑奖说明领取奖品</p>
        <p class="content-tip">兑奖期限：{{`${formatTime(+prizeTime.split(',')[0])}到${formatTime(+prizeTime.split(',')[1])}`}}</p>
      </div>
      <v-button v-if="prizeType === '3'" class="detail-continue" @next="next">领取积分</v-button>
      <v-button v-else class="detail-continue" @next="back">返回</v-button>
    </div>
  </popover-bg>
</template>

<script>
import Utils from '../../config/utils'
import PopoverBg from './../popoverBg'
import VButton from './../button'

export default {
  components: {
    PopoverBg,
    VButton
  },
  props: ['prizeType', 'prizeTime'],
  data () {
    return {
    }
  },
  mounted () {
  },
  methods: {
    next () {
      this.$emit('next')
    },
    close () {
      this.$emit('close')
    },
    back () {
      this.$emit('back')
    },
    formatTime (time) {
      return Utils.formatTime(time)
    }
  }
}
</script>

<style lang="less" scoped>
.turntable-win-convert {
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
    font-size: .4rem;
    color: #333;
    text-align: center;
    padding-top: .64rem;
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

