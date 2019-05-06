

<template>
  <popover-bg class="turntable-win-cash">
    <img class="title" src="../../assets/turntable_win_title.png" alt='title' />
    <img class="close" @click="close" src="../../assets/turntable_close_default.png" alt="close" />
    <div class="detail" v-if="prizeType=='1'">
      <p class="detail-word">恭喜您获得现金红包</p>
      <p class="detail-num">{{prizeAmount}}<span class="detail-unit">元</span></p>
    </div>
    <div class="detail" v-else>
      <p class="detail-word">恭喜您获得</p>
      <p class="detail-points">{{prizeName}}</p>
    </div>
    <v-button class="detail-check" @next="next" v-if="prizeType=='1'">查看红包</v-button>
    <v-button class="detail-check" @next="next" v-else>查看奖品</v-button>
  </popover-bg>
</template>

<script>
import PopoverBg from './../popoverBg'
import VButton from './../button'

export default {
  props: ['prizeAmount', 'prizeType', 'prizeName'],
  components: {
    PopoverBg,
    VButton
  },
  methods: {
    next () {
      this.$emit('next')
    },
    close () {
      this.$emit('close')
    }
  }
}
</script>

<style lang="less" scoped>
.turntable-win-cash {
  .title {
    width: 100%;
  }
  .detail {
    width: 4.84rem;
    height: 6rem;
    background: url('./../../assets/turntable_win_cash.png');
    background-size: contain;
    margin: .8rem auto;
  }
  .detail-word {
    font-size: .4rem;
    line-height: 1;
    color: #fff;
    padding-top: .8rem;
    text-align: center;
  }
  .detail-num {
    font-size: 1.2rem;
    color: #fffb00;
    text-align: center;
    line-height: 1;
    padding-top: .6rem;
  }
  .detail-points {
    font-size: .56rem;
    color: #fffb00;
    text-align: center;
    line-height: 1;
    padding-top: .6rem;
  }
  .detail-unit {
    font-size: .48rem;
    padding-left: .2rem;
  }
  .detail-check {
    background:linear-gradient(to right,#a121ee,#666af6);
    width: 3.44rem;
    height: 1.2rem;
    line-height: 1.2rem;
    border-radius: .6rem;
    font-size: .4rem;
    color: #fff;
    margin-top: 1rem;
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

