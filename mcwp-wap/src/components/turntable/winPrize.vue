

<template>
  <popover-bg class="turntable-win-cash">
    <img class="title" src="../../assets/turntable_win_title.png" alt='title' />
    <img class="close" @click="close" src="../../assets/turntable_close_default.png" alt="close" />
    <div class="detail">
      <p class="detail-word">恭喜您获得{{prizeRecord.awardName}}</p>
      <img class="content-img" src="../../assets/turntable_award.png" alt='content' />
      <p class="detail-word">{{prizeRecord.prizeName}}</p>
      <v-button class="detail-check" @next="next">查看奖品</v-button>
    </div>
  </popover-bg>
</template>

<script>
import PopoverBg from './../popoverBg'
import VButton from './../button'

export default {
  props: ['prizeRecord'],
  components: {
    PopoverBg,
    VButton
  },
  data () {
    return {
      // cashNum: 2.33
    }
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
    margin: .8rem auto;
    text-align: center;
  }
  .detail-word {
    font-size: .48rem;
    color: #fff;
  }
  .content-img {
    width: 2.8rem;
    height: 2.8rem;
    margin: .56rem 0 .72rem;

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

