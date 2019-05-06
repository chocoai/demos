<template>
  <div class="loan-contract" v-html="data">
  </div>
</template>

<script>
import Store from 'store'
import { getAccredit, getPrivacy } from '../../service/getData'
import Config from '../../config/index'
import Utils from '../../config/utils'

export default {
  components: {
  },
  data () {
    return {
      data: '',
      type: Utils.getUrlkey(window.location.search)['type']
    }
  },
  created () {
    const that = this
    const cookies = Store.get(Config.constants.cookies)
    // that.loanCode = cookies.loanCode
    // that.open = cookies.open
    // that.loanRoutes = cookies.loanRoutes
    that.enterpriseCode = cookies.enterpriseCode
  },
  mounted () {
    const that = this
    if (!that.enterpriseCode) return
    if (that.type === 'privacy') {
      getPrivacy({}).then(res => {
        that.$vux.loading.hide()
        if (res.code === Config.resCode.success) {
          const data = res.data
          that.data = data
        } else {
          that.$vux.toast.text(res.msg)
        }
      })
    } else {
      getAccredit({enterpriseCode: that.enterpriseCode}).then(res => {
        that.$vux.loading.hide()
        if (res.code === Config.resCode.success) {
          const data = res.data
          that.data = data
        } else {
          that.$vux.toast.text(res.msg)
        }
      })
    }
  },
  beforeDestroy () {
  },
  methods: {
  }
}
</script>

<style lang="less">
  .loan-contract {
    font-size: 16px;
    line-height: 24px;
    position: relative;
    width: 100%;
    overflow-x: hidden;
    p {
      margin: 20px;
      overflow: hidden;
    }
  }
</style>
