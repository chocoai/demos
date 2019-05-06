<template>
  <div class='share-introduce'>
    <div v-if="hasShare">
      <p class="share-title">分享赚钱流程</p>
      <img class='share-steps-bg' src='../../assets/img_share-steps.png' alt='steps' />
    </div>
    <div v-if="!hasShare">
      <p class="share-stop">分享活动已结束</p>
    </div>
    <img class='share-introduce-bg' src='./../../assets/bg_share_blank.png' />
    <v-button class="share-btn" @next='goShare' v-if="hasShare">分享赚钱</v-button>
    <v-button class="money-btn" @next='nextStep'>我的佣金</v-button>
  </div>
</template>

<script>
import Store from 'store'
import Config from '../../config/index'
import VButton from './../../components/button'
import wxAuth from '../../config/wxAuth'
import { getLoanshare } from '../../service/getData'
export default {
  components: {
    VButton
  },
  data () {
    return {
      hasShare: true
    }
  },
  created () {
    const that = this
    const cookies = Store.get(Config.constants.cookies)
    that.loanCode = cookies.userCode
  },
  mounted () {
    const that = this
    // if (!that.loanCode) return
    getLoanshare({code: that.loanCode}).then(res => {
      that.$vux.loading.hide()
      if (res.code === Config.resCode.success) {
        if (res.data) {
          that.hasShare = res.data.open
        }
      }
    })
  },
  methods: {
    goShare () {
      this.$router.push({path: Config.constants.productRouter, query: { type: 'share' }})
    },
    nextStep () {
      // 开启授权
      wxAuth('snsapi_base', Config.constants.sharePersonalRouter)
      this.$router.push(Config.constants.sharePersonalRouter)
    }
  }
}
</script>

<style lang="less" scoped>
.share-introduce {
  position: relative;
  .share-title {
    position: absolute;
    left: 0;
    right: 0;
    top: 5.2rem;
    font-size: .46rem;
    text-align: center;
    color: #369fff;
  }
  .share-stop {
    position: absolute;
    left: 0;
    right: 0;
    top: 6.4rem;
    text-align: center;
    color: #f64349;
    font-size: .64rem;
  }
  .share-introduce-bg {
    width: 100%;
  }
  .share-steps-bg {
    position: absolute;
    left: 0;
    right: 0;
    width: 80%;
    top: 7rem;
    margin: auto;
  }
  .share-btn {
    margin-top: 1.2rem;
    margin-bottom: 0;
  }
  .money-btn {
    background: #fff;
    color: #1c7bef;
    margin-top: .96rem;
  }
}
</style>
