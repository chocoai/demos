<template>
  <div class="product-login">
    <img class="login-icon" :src="enterpSymbol"/>
    <ul class="apply-ul">
      <li class='apply-detail-content name-content'>
        <input class='apply-detail-input' type="text" placeholder='请输入姓名'  maxlength="11" v-model='name' />
      </li>
      <li class='apply-detail-content telephone-content'>
        <input class='apply-detail-input' type="tel" placeholder='请输入手机号'  maxlength="11" v-model='phone' />
      </li>
      <li class='apply-detail-content verifyCode-content'>
        <input class='apply-detail-input' type="text" placeholder='请输入验证码'  maxlength="6" v-model='verificationCode' />
        <p v-show="!computedTime" @click.prevent='getVerifyCode' class='apply-detail-verify'>{{codeText}}</p>
        <p v-show="computedTime" @click.prevent class='apply-detail-verify'>{{codeText}}</p>
      </li>
    </ul>
    <v-button class="login-btn" @next='login'>登录</v-button>
  </div>
</template>

<script>
import VButton from './../../components/button'
import Config from '../../config/index'
import Utils from '../../config/utils'
import { wxBinding, sendWxVerifyCode } from '../../service/getData'
import Sto from 'store'

export default {
  components: {
    VButton
  },
  data () {
    return {
      codeText: '获取验证码',
      name: '',
      phone: '',
      computedTime: 0, // 倒数记时
      verificationCode: '',
      enterpSymbol: Sto.get(Config.constants.cookies).enterpSymbol,
      onOff: false
    }
  },
  destroyed () {
    if (this.timer) clearInterval(this.timer)
  },
  methods: {
    async login () {
      const that = this
      const name = that.name
      if (!name) return that.$vux.toast.text(Config.constants.nullName)
      const phone = that.phone
      if (!phone) return that.$vux.toast.text(Config.constants.nullPhone)
      if (!Utils.isTelephone(phone)) {
        return that.$vux.toast.show({
          type: 'text',
          text: Config.constants.errorMobile,
          width: '6.5rem',
          isShowMask: true
        })
      }
      const verificationCode = that.verificationCode
      if (!verificationCode) return that.$vux.toast.text(Config.constants.nullVerifyCode)
      const loginParams = {
        phone: Utils.clearSpecChars(phone),
        name: name,
        verificationCode: verificationCode
      }
      that.$vux.loading.show({
        text: '请稍候...'
      })
      // 微信绑定
      let res = await wxBinding(loginParams)
      if (res.code === Config.resCode.success) {
        that.$router.push(Config.constants.personalRouter)
      } else {
        that.$vux.loading.hide()
        that.$vux.toast.text(res.msg)
      }
    },
    async getVerifyCode () { // 获取验证码
      const that = this
      if (that.onOff) return false
      const phone = that.phone
      if (!phone) return that.$vux.toast.text(Config.constants.nullPhone)
      if (!Utils.isTelephone(phone)) {
        return that.$vux.toast.show({
          type: 'text',
          text: Config.constants.errorMobile,
          width: '6.5rem',
          isShowMask: true
        })
      }
      that.onOff = true
      that.computedTime = 60
      that.timer = setInterval(() => {
        that.codeText = that.computedTime + 's'
        that.computedTime --
        if (that.computedTime === -1) {
          that.codeText = '重新获取'
          that.computedTime = 0
          that.onOff = false
          clearInterval(that.timer)
        }
      }, 1000)

      // 发送短信验证码
      let res = await sendWxVerifyCode({phone: Utils.clearSpecChars(phone)})
      if (res.code === Config.resCode.success) {
        that.$vux.toast.text(Config.constants.sendVerifyCode)
      } else {
        that.$vux.toast.text(res.msg)
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .product-login{
    background: #fff;
    height: 100%;
    .login-btn{
      width: 9rem!important;
      height: 1.44rem!important;
      color: #fff!important;
      font-size: 0.5rem!important;
      margin-top: 1.1rem!important;
    }
    .login-icon{
      width: 2.2rem;
      height: 2.2rem;
      margin: 0 auto;
      padding-top: 1.26rem;
      margin-bottom: 1.36rem;
      display: block;
    }
    .apply-ul {
      position: relative;
      width: 100%;
      height: auto;
      background-color: #fff;
      overflow: hidden;
    }
    .apply-detail-content {
      position: relative;
      width: 10.5rem;
      display: flex;
      float: right;
      border-bottom: .02rem solid #dcdcdc;
      height: 1.44rem;
      position: relative;
    }
    .apply-detail-input {
      flex: 1;
      border: none;
      outline: none;
      padding-left: 1.86rem;
      font-size: .42rem;
      color: #333;
    }
    .name-content::before {
      content: "";
      position: absolute;
      width: 0.4rem;
      height: 0.4rem;
      background: url(../../assets/login-icon-input.png) no-repeat;
      background-size: cover;
      left: 0.66rem;
      top: 0.5rem;
    }
    .telephone-content::before{
      content: "";
      position: absolute;
      width: 0.3rem;
      height: 0.48rem;
      background: url(../../assets/icon_phonenumber.png) no-repeat;
      background-size: cover;
      left: 0.66rem;
      top: 0.5rem;
    }
    .verifyCode-content::before{
      content: "";
      position: absolute;
      width: 0.4rem;
      height: 0.4rem;
      background: url(../../assets/verify-icon-input.png) no-repeat;
      background-size: cover;
      left: 0.66rem;
      top: 0.5rem;
    }
    .apply-detail-verify {
      text-align: center;
      width: 2.4rem;
      height: 0.8rem;
      color: #369fff;
      font-size: .32rem;
      line-height: 0.8rem;
      border: 1px solid #369fff;
      border-radius: 0.4rem;
      position: absolute;
      top: .3rem;
      right: .9rem;
    }
  }

</style>
