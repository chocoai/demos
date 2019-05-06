<template>
  <div class="login-container">
    <van-toast id="van-toast"/>
    <img src="" class="login-img"/>
    <ul class="login-form">
      <li class="input-border">
        <input class="tel-input" v-model="phone" type="text" maxlength="11" placeholder="请输入手机号"/>
        <span @click="clear" class="tel-clear" v-if="phone !== ''"></span>
      </li>
      <li class="input-border">
        <input class="verify-input" v-model="verificationCode" type="text" maxlength="6" placeholder="请输入验证码"/>
        <span v-if="!computedTime" class="verify-send" @click.prevent="getVerifyCode">{{codeText}}</span>
        <span class="verify-send" v-else>{{codeText}}</span>
      </li>
    </ul>
    <button class="login-btn" @click.prevent="login">登录</button>
    <p class="login-skip" @click="$emit('changeTab')">跳过</p>
  </div>
</template>

<script>
import { Config, isTelephone } from '@/utils'
import {sendWxVerifyCode, wxBinding} from '@/services/mcwp/home'

export default {
  data () {
    return {
      phone: '',
      codeText: '获取验证码',
      computedTime: 0,
      verificationCode: '',
      onOff: false
    }
  },
  methods: {
    async getVerifyCode () {
      const that = this
      const phone = that.phone
      if (!phone) return that.$toast(Config.toast.nullPhone)
      if (!isTelephone(phone)) return that.$toast(Config.toast.errorPhone)
      that.computedTime = 60
      that.timer = setInterval(() => {
        that.codeText = that.computedTime + 's'
        that.computedTime--
        if (that.computedTime === -1) {
          that.codeText = '重新获取'
          that.computedTime = 0
          clearInterval(that.timer)
        }
      }, 1000)
      await sendWxVerifyCode({phone: phone})
      that.$toast(Config.toast.sendVerifyCode)
    },
    clear () {
      this.phone = ''
    },
    async login () {
      const that = this
      const {phone, verificationCode} = this
      if (!phone) return that.$toast(Config.toast.nullPhone)
      if (!isTelephone(phone)) return that.$toast(Config.toast.errorPhone)
      if (!verificationCode) return that.$toast(Config.toast.nullVerificationCode)
      await wxBinding({phone, verificationCode})
      that.$emit('success')
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: white;
  z-index: 1000;
  .login-img {
    width: 3.36rem;
    height: 3.36rem;
    margin: 1.04rem auto 0;
    pointer-events: none;
  }
  .login-form {
    margin-top: 0.96rem;
    .input-border {
      border-bottom: 1px solid #e5e5e5;
      margin-left: 1.8rem;
      list-style: none;
      width: 8rem;
      position: relative;
      .tel-input,
      .verify-input {
        margin-left: -0.9rem;
        padding: 0.52rem 1.8rem 0.5rem 1rem;
        display: inline-block;
        width: 4rem;
        height: 0.44rem;
        border: 0;
      }
      .tel-input {
        font-size: 0.4rem;
        color: #333;
        width: 4rem;
        background: url(../../assets/icon_phonenumber.png) no-repeat 0 0.6rem;
        background-size: 0.3rem 0.44rem;
      }
      .verify-input {
        font-size: 0.4rem;
        color: #333;
        width: 4rem;
        background: url(../../assets/verify-icon-input.png) no-repeat 0 0.6rem;
        background-size: 0.4rem 0.4rem;
      }
      .tel-clear {
        position: absolute;
        display: block;
        height: 0.8rem;
        width: 0.8rem;
        background: url(../../assets/icon_close.png) no-repeat 0.2rem 0.1rem;
        background-size: 50% 50%;
        right: 0.1rem;
        bottom: 0.2rem;
      }
      .verify-send {
        position: absolute;
        right: -0.2rem;
        display: inline-block;
        height: 0.8rem;
        width: 2.4rem;
        color: #f00;
        font-size: 0.32rem;
        /*padding-top: 0.48rem;*/
        transform: translateY(-50%);
        top: 50%;
      }
    }
  }
  .login-btn {
    color: #fff;
    font-size: 0.5rem;
    width: 9rem;
    height: 1.44rem;
    border-radius: 0.72rem;
    background-color: #fb2a35;
    margin: 1.2rem auto 0;
  }
  .login-skip {
    width: 2rem;
    text-align: center;
    height: 1.04rem;
    line-height: 1.04rem;
    color: #666;
    font-size: 0.4rem;
    margin: 0.48rem auto 0;
  }
}
</style>
