<template>
  <div class='valuation-market'>
    <ul class="contact-detail-ul">
      <li class='contact-detail-menu'>
        <div class="input-border">
          <input flex-box="1" class='contact-detail-input font-32' type="text" placeholder='您的姓名' v-model="salesName">
        </div>
        <input flex-box="1" class='contact-detail-input font-32' type="text" placeholder='您的手机号' v-model="salesPhone">
      </li>
      <li class='contact-detail-verify'>
        <input flex-box="1" class='contact-detail-input font-32' type="text" placeholder='验证码' v-model="salesCode">
        <p v-show="!computedTime" @click.prevent='getVerifyCode' class='apply-detail-verify font-32'>{{codeText}}</p>
        <p v-show="computedTime" @click.prevent class='apply-detail-verify font-32'>{{codeText}}</p>
      </li>
      <li class='contact-detail-content'>
        <button class="market-btn" @click="nextStep">立即申请</button>
        <!-- <p class="apply-tip">点击获取更多利率优惠</p> -->
      </li>
    </ul>
    <div class="company-tip">
      <p class="tip-code">长按识别二维码</p>
      <p class="tip-public">关注公众号</p>
    </div>
    <img class="commpeny-code" src="./../../assets/company_code.png" />
  </div>
</template>

<script>
import { getValuationSales, getValuationVerification, getValuationMarketIsexpire } from '../../service/valuation'
import Config from '../../config/index'
import Store from 'store'
import Utils from '../../config/utils'

export default {
  components: {
  },
  data () {
    return {
      enterpriseCode: Utils.getQueryParams('enterpriseCode') || Store.get(Config.constants.enterpriseCode),
      tplType: Utils.getQueryParams('tplType') || Store.get('tplType'),
      salesName: '',
      salesPhone: '',
      salesCode: '',
      codeText: '获取验证码',
      computedTime: false,
      isExpire: true
    }
  },
  mounted () {
    const that = this
    // const cookies = Store.get(Config.constants.cookies)
    let enterpriseCode = that.enterpriseCode
    let tplType = that.tplType
    getValuationMarketIsexpire({enterpriseCode: enterpriseCode, tplType: tplType}).then((res) => {
      if (+res.code === 0) {
      } else {
        that.isExpire = false
        that.$vux.toast.text('该营销活动已结束')
      }
    })
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
      let res = await getValuationVerification({phone: salesPhone, enterpriseCode: that.enterpriseCode, type: 2})
      if (res.code === Config.resCode.success) {
        that.$vux.toast.text(Config.constants.sendVerifyCode)
        that.computedTime = 60
        that.timer = setInterval(() => {
          that.codeText = that.computedTime + 's重新获取'
          that.computedTime --
          if (that.computedTime === -1) {
            that.codeText = '重新获取'
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
      if (!that.isExpire) return that.$vux.toast.text('该营销活动已结束')
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
      if (that.tplType) Store.set('tplType', that.tplType)
      if (that.enterpriseCode) Store.set('enterpriseCode', that.enterpriseCode)
      if (that.channel) sessionStorage.setItem('YX_CHANNEL', that.channel)
      if (that.category) sessionStorage.setItem('YX_CATEGORY', that.category)
      let params = {
        enterpriseCode: that.enterpriseCode,
        name: salesName,
        telephone: salesPhone,
        channel: that.channel,
        category: that.category,
        verificationCode: that.salesCode,
        type: 2
      }
      Utils.countPlus({
        'userName': salesPhone,
        'enterCode': that.enterpriseCode
      }, 'register')
      if (!params.channel) delete params.channel
      if (!params.category) delete params.category
      let res = await getValuationSales(params)
      if (res.code === Config.resCode.success) {
        Utils.countPlus('营销推广', 'send', {'pageName': '营销推广', 'stayTime': new Date().getTime() - this.getTime})
        this.$router.push(Config.constants.ValuationSuccess)
        // sessionStorage.clear()推广
        // res.data.list = Array.from(res.data.list, i => i.stepUrl)
        // sessionStorage.setItem(Config.constants.valuation, JSON.stringify(res.data))
        // let routes = res.data.list
        // that.$router.push(routes[0])
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
  background: url('./../../assets/valuation_sales_bg.png') no-repeat;
  background-size: cover;
  width: 100%;
  height: 100%;
  min-height: 17.04rem;
  margin: 0 auto;
  overflow: hidden;
  .contact-detail-ul {
    position: relative;
    top: 7.78rem;
    height: 10rem;
  }
  .contact-detail-menu {
    width: 8.32rem;
    height: 2.4rem;
    background: #fff;
    position: relative;
    left: 1.24rem;
    border-radius: .32rem;
    .input-border {
      border-bottom: 2px solid #eee;
    }
  }
  .contact-detail-content{
    width: 100%;
    height: 1.46rem;
    position: relative;
  }
  .contact-detail-content + .contact-detail-content {
    margin-top: .4rem;
  }
  .contact-detail-verify {
    width: 8.32rem;
    height: 1.2rem;
    position: relative;
    left: 1.24rem;
    top: .4rem;
  }
  .contact-detail-input {
    flex: 1;
    outline: none;
    padding-left: .48rem;
    color: #333;
    width: 7.84rem;
    height: 1.2rem;
    line-height: 1.2rem;
    border-radius: .32rem;
    &.empty {
      color: #888;
    }
  }
  .apply-detail-verify {
    width: 2.8rem;
    height: 1.2rem;
    background: #feb646;
    color: #fff;
    text-align: center;
    position: absolute;
    right: 0;
    top: 0;
    line-height: 1.2rem;
    border-top-right-radius: .7em;
    border-bottom-right-radius: .7em;
  }
  .market-btn {
    background: #feb646;
    background-size: cover;
    width: 5.4rem;
    height: 1.36rem;
    position: absolute;
    color: #fff;
    border-radius: 1.36rem;
    font-size: .56rem;
    font-weight: bold;
    top: 1.2rem;
    left: 2.72rem;
  }
  // .apply-tip {
  //   position: absolute;
  //   top: 2.8rem;
  //   width: 100%;
  //   color: #f8efef;
  //   text-align: center;
  // }
}
.company-tip {
  position: absolute;
  top: 15.3rem;
  right: 2.24rem;
  font-size: .36rem;
  text-align: right;
  color: #fff;
}
.commpeny-code {
  width: 1.6rem;
  height: 1.6rem;
  position: absolute;
  top: 15rem;
  right: .4rem;
  display: block;
}
</style>
