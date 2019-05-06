<template>
  <div class="prize-result">
    <div class="result-cash" v-if="type === 'cash'">
      <p class="result-title">“现金红包”兑换成功!</p>
      <p class="result-tip">现金红包已打入“我的佣金”中</p>
      <p class="result-tip">请在个人中心“我的佣金”进行体现</p>
    </div>
    <div class="result-prize" v-else>
      <p class="result-title">“礼品”兑换成功!</p>
      <p class="result-tip">请按兑奖须知中方法领取奖品</p>
    </div>
    <v-button class="detail-check" @next="next">返回</v-button>
  </div>
</template>

<script>
import Config from '../../config/index'
import VButton from './../../components/button'
export default {
  components: {
    VButton
  },
  data () {
    return {
      type: '',
      activityCode: ''
    }
  },
  mounted () {
    this.type = this.$route.params.type
    this.activityCode = sessionStorage.getItem(Config.constants.wxACTIVITYCODE)
  },
  methods: {
    next () {
      this.$router.push(`${Config.constants.activityTurntable}?activityCode=${this.activityCode}`)
    }
  }
}
</script>


<style lang="less" scoped>
  .prize-result {
    width: 10.8rem;
    height: 100%;
    background: #fff;
    text-align: center;
    .result-title {
      font-size: .6rem;
      padding: 1rem 0;
      color: #333;
    }
    .result-tip {
      font-size: .4rem;
      color: #666;
      line-height: .8rem;
    }
  }
</style>

