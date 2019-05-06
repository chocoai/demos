<template>
  <div class='valuation-market'>
    <ul class="contact-detail-ul">
      <li class='contact-detail-content'>
        <input flex-box="1" class='contact-detail-input font-32' type="text" placeholder='您的姓名' v-model="salesName">
      </li>
      <li class='contact-detail-content'>
        <input flex-box="1" class='contact-detail-input font-32' type="text" placeholder='您的手机号' v-model="salesPhone">
      </li>
      <li class='contact-detail-content'>
        <input flex-box="1" class='contact-detail-input font-32' type="text" placeholder='验证码' v-model="salesCode">
        <p v-show="!computedTime" @click.prevent='getVerifyCode' class='apply-detail-verify font-32'>{{codeText}}</p>
        <p v-show="computedTime" @click.prevent class='apply-detail-verify font-32'>{{codeText}}</p>
      </li>
      <li class='contact-detail-content'>
        <button class="market-btn" @click="nextStep"></button>
      </li>
    </ul>
    <div class="company-tip">
      <p class="tip-code">长按识别二维码</p>
      <p class="tip-public">关注公众号</p>
    </div>
    <img class="commpeny-code" src="./../../assets/company_code.png"/>
  </div>
</template>

<script>
import { getValuationSales, getValuationVerification } from '../../service/valuation'
import Config from '../../config/index'
import Store from 'store'
import Utils from '../../config/utils'

export default {
  components: {
  },
  data () {
    return {
      enterpriseCode: Utils.getQueryParams('enterpriseCode') || Store.get(Config.constants.enterpriseCode),
      salesName: '',
      salesPhone: '',
      salesCode: '',
      codeText: '获取验证码',
      computedTime: false
    }
  },
  methods: {
    async getVerifyCode () { // 获取验证码
      const that = this
      const salesPhone = that.salesPhone
      if (!salesPhone) return that.$vux.toast.text(Config.constants.nullTelephone)
      if (!Utils.isTelephone(salesPhone)) {
        return that.$vux.toast.show({
          type: 'text',
          text: Config.constants.errorMobile,
          width: '6.5rem',
          isShowMask: true
        })
      }
      if (that.switch) return null
      that.switch = true
      // 发送短信验证码
      let res = await getValuationVerification({phone: salesPhone, enterpriseCode: that.enterpriseCode, type: 1})
      if (res.code === Config.resCode.success) {
        that.$vux.toast.text(Config.constants.sendVerifyCode)
        that.computedTime = 60
        that.timer = setInterval(() => {
          that.codeText = that.computedTime + 's后重新获取'
          that.computedTime --
          if (that.computedTime === -1) {
            that.codeText = '再次重新获取'
            that.computedTime = 0
            that.switch = false
            clearInterval(that.timer)
          }
        }, 1000)
      } else {
        that.$vux.toast.text(res.msg)
      }
    },
    async nextStep () {
      const that = this
      const salesName = that.salesName
      if (!salesName) return that.$vux.toast.text(Config.constants.nullCname)
      const salesPhone = that.salesPhone
      if (!salesPhone) return that.$vux.toast.text(Config.constants.nullTelephone)
      const salesCode = that.salesCode
      if (!salesCode) return that.$vux.toast.text(Config.constants.nullVerifyCode)
      if (!Utils.isTelephone(salesPhone)) {
        return that.$vux.toast.show({
          type: 'text',
          text: Config.constants.errorMobile,
          width: '6.5rem',
          isShowMask: true
        })
      }
      if (Config.test && !that.enterpriseCode) {
        that.enterpriseCode = Store.get(Config.constants.enterpriseCode) || 10001
      }
      that.channel = Utils.getQueryParams('channel')
      that.category = Utils.getQueryParams('category')
      that.tplType = Utils.getQueryParams('tplType')
      if (that.tplType) Store.set('tplType', that.tplType)
      if (that.channel) sessionStorage.setItem('YX_CHANNEL', that.channel)
      if (that.category) sessionStorage.setItem('YX_CATEGORY', that.category)
      let params = {
        enterpriseCode: that.enterpriseCode,
        name: salesName,
        telephone: salesPhone,
        channel: that.channel,
        category: that.category,
        verificationCode: that.salesCode,
        type: 1
      }
      if (!params.channel) delete params.channel
      if (!params.category) delete params.category
      Utils.countPlus({
        'userName': salesPhone,
        'enterCode': that.enterpriseCode
      }, 'register')
      let res = await getValuationSales(params)
      if (res.code === Config.resCode.success) {
        Utils.countPlus('估值工具入口', 'send', {'pageName': '估值工具', 'stayTime': new Date().getTime() - this.getTime})
        sessionStorage.clear()
        res.data.list = Array.from(res.data.list, i => i.stepUrl)
        sessionStorage.setItem(Config.constants.valuation, JSON.stringify(res.data))
        let routes = res.data.list
        Store.set(Config.constants.enterpriseCode, params.enterpriseCode)
        let cookies = Store.get(Config.constants.cookies) || {}
        cookies.enterpriseCode = params.enterpriseCode
        Store.set(Config.constants.cookies, cookies)
        that.$router.push(routes[0])
        // console.log(routes)
      } else {
        that.$vux.toast.text(res.msg)
      }
      // this.$router.push(Config.constants.sharePersonalRouter)
    }
  }
}
</script>

<style lang="less" scoped>
.valuation-market {
  position: relative;
  background: url('./../../assets/valuation_market_bg.png') no-repeat;
  background-size: cover;
  width: 100%;
  height: 100%;
  min-height: 17.04rem;
  margin: 0 auto;
  overflow: hidden;
  .contact-detail-ul {
    position: relative;
    top: 6.82rem;
  }
  .contact-detail-content{
    width: 100%;
    height: 1.46rem;
    position: relative;
  }
  .contact-detail-content + .contact-detail-content {
    margin-top: .4rem;
  }
  .contact-detail-input {
    flex: 1;
    outline: none;
    padding-left: .48rem;
    color: #333;
    width: 8.4rem;
    height: 1.46rem;
    line-height: 1.46rem;
    border-radius: 1.46rem;
    position: absolute;
    left: 1.2rem;
    border: 2px solid #aaa;
    background: #fff;
    &.empty {
      color: #888;
    }
  }
  .apply-detail-verify {
    position: absolute;
    right: 1.2rem;
    top: .5rem;
    color: #039fff;
  }
  .company-tip {
    position: absolute;
    top: 15.3rem;
    right: 2.24rem;
    font-size: .36rem;
    text-align: right;
  }
  .commpeny-code {
    width: 1.6rem;
    height: 1.6rem;
    position: absolute;
    top: 15rem;
    right: .4rem;
  }
  .tip-code {
    color: #333;
  }
  .tip-public {
    color: #039fff;
  }
  .market-btn {
    background: url('./../../assets/valuation_market_btn.png') no-repeat;
    background-size: cover;
    width: 5.4rem;
    height: 1.64rem;
    position: absolute;
    top: .4rem;
    left: 2.7rem;
  }
}
</style>
