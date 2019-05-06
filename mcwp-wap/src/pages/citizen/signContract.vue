<template>
  <div class="contract-container">
    <div class="loan-contract" v-html="data">
    </div>
    <div class="btn">
      <v-button @next='nextStep' style="margin: 1rem auto; ">手写签名</v-button>
    </div>
  </div>
</template>

<script>
import Store from 'store'
import { getAccredit } from '../../service/getData'
import VButton from './../../components/button'
import Config from '../../config/index'
import Utils from '../../config/utils'

export default {
  components: {
    VButton
  },
  data () {
    return {
      data: '',
      loanRoutes: [],
      getTime: new Date().getTime()   // 时长统计
    }
  },
  created () {
    const that = this
    const cookies = Store.get(Config.constants.cookies)
    // that.open = cookies.open
    that.loanCode = cookies.loanCode
    that.loanRoutes = cookies.loanRoutes
    that.enterpriseCode = cookies.enterpriseCode
  },
  mounted () {
    const that = this
    if (!that.enterpriseCode) return
    getAccredit({enterpriseCode: that.enterpriseCode}).then(res => {
      that.$vux.loading.hide()
      if (res.code === Config.resCode.success) {
        const data = res.data
        that.data = data
      } else {
        that.$vux.toast.text(res.msg)
      }
    })
  },
  beforeDestroy () {
  },
  methods: {
    nextStep () {
      const that = this
      let loanRoutes = that.loanRoutes
      let pathIndex = Utils.getIndex(loanRoutes, window.location.pathname)
      Utils.countPlus('页面停留时长', 'send', {'pageName': '阅读合同', 'stayTime': new Date().getTime() - this.getTime})
      if (pathIndex > -1 && pathIndex !== loanRoutes.length - 1) {
        that.$router.push(loanRoutes[pathIndex + 1])
        that.$vux.loading.hide()
      } else {
        that.$vux.loading.hide()
        that.$router.push(Config.constants.confirmRouter)
      }
    }
  }
}
</script>

<style lang="less">
.contract-container {
  .loan-contract {
    font-size: 16px;
    line-height: 24px;
    background-color: #fff;
    padding-bottom: 3.44rem;
    position: relative;
    width: 100%;
    overflow-x: hidden;
    p {
      margin: 20px;
      overflow: hidden;
    }
  }
  .btn {
    position: fixed;
    background-color: #fff;
    bottom: 0;
    left: 0;
    right: 0;
  }
}

</style>
