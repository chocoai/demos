<template>
    <div class="fixBox">
      <div class="check-container">
        <img class="img_logo" :src="`${prefixUrl}activity/turntable/img_logo.png`" alt="logo">
        <ul class="check-content">
          <li>
            <img class="img_title" :src="`${prefixUrl}activity/turntable/img_title.png`" alt="title">
          </li>
          <li class="li-content telephone-content">
            <input class='content-input' type="tel" placeholder='请输入手机号'  maxlength="11" v-model='phone' />
          </li>
          <li class="li-content">
            <div class="verifyCode-content">
              <input class='content-input' type="text" placeholder='请输入验证码'  maxlength="6" v-model='verifyCode' />
            </div>
            <div class="verify_code_box">
              <p v-show="!timeShow" @click.prevent='getVerifyCode' class='verifyCode-content-verify'>{{codeText}}</p>
              <p v-show="timeShow" @click.prevent class='verifyCode-content-verify'>{{codeText}}</p>
            </div>
          </li>
          <li @click="checkJoinLimit">
            <img class="check-btn" src="../../assets/btn_check.png" alt="">
          </li>
        </ul>
        <div class="activity_rule">
            <div class="rule_detail">
              <img :src="`${prefixUrl}activity/turntable/img_rule.png`" alt="rule">
            </div>
        </div>
      </div>
    </div>
</template>
<script>
import VButton from './../../components/button'
import Config from '../../config/index'
import Utils from '../../config/utils'
import { sendCheckVerifyCode, checkJoinLimit } from '../../service/getData'
import prefixUrl from '../../config/mixins/prefixUrl'

export default {
  components: {
    VButton
  },
  props: ['activityCode'],
  data () {
    return {
      phone: '',
      verifyCode: '',
      timeShow: 0,
      codeText: '获取验证码',
      onOff: false
    }
  },
  mixins: [prefixUrl],
  destroyed () {
    if (this.timer) clearInterval(this.timer)
  },
  methods: {
    hide () {
      this.$emit('hide')
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
      that.timeShow = 60
      that.timer = setInterval(() => {
        that.codeText = that.timeShow + 's'
        that.timeShow --
        if (that.timeShow === -1) {
          that.codeText = '重新获取'
          that.timeShow = 0
          that.onOff = false
          clearInterval(that.timer)
        }
      }, 1000)

      // 发送短信验证码
      let res = await sendCheckVerifyCode({telephone: Utils.clearSpecChars(phone), activityCode: that.activityCode})
      if (res.code === Config.resCode.success) {
        that.$vux.toast.text(Config.constants.sendVerifyCode)
      } else {
        that.$vux.toast.text(res.msg)
      }
    },
    async checkJoinLimit () {
      const that = this
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
      const verifyCode = that.verifyCode
      const activityCode = that.activityCode
      if (!verifyCode) return that.$vux.toast.text(Config.constants.nullVerifyCode)
      const params = {
        activityCode: activityCode,
        phone: Utils.clearSpecChars(phone),
        smscode: verifyCode
      }
      that.$vux.loading.show({
        text: '请稍候...'
      })
      let res = await checkJoinLimit(params)
      if (res.code === Config.resCode.success) {
        that.$vux.loading.hide()
        if (res.data) {
          that.$emit('render')
          that.hide()
        } else {
          that.$vux.toast.text('很抱歉，您暂时没有参与抽奖活动资格！')
        }
      } else {
        that.$vux.loading.hide()
        that.$vux.toast.text(res.msg)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.fixBox {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 103;
  overflow-y: auto;
  background-color: #fff;
  .check-container {
    width: 10.8rem;
    height: 27.44rem;
    text-align: center;
    background: url("./../../assets/img_checkbg.png") no-repeat center/cover;
    .img_logo {
      width: 1.92rem;
      height: 1.6rem;
      margin: 0 auto;
      margin-top: 0.2rem;
      pointer-events: none;
    }
    .check-content {
      background: #fff;
      width: 9.04rem;
      //   height: 7rem;
      text-align: center;
      padding: 0.56rem 0.64rem 0.64rem;
      box-sizing: border-box;
      margin: 0 auto;
      margin-top: 4.52rem;
      border-radius: 0.32rem;
      box-shadow: 0.08rem 0.04rem 0.16rem 0.08rem rgba(0, 0, 0, 0.2);
      margin-bottom: 1rem;
      .li-content{
        height: 1.24rem;
        display: flex;
        align-content: center;
        margin-bottom: .48rem;
      }
      .telephone-content{
        width: 7.76rem;
        height: 1.24rem;
        border-radius: .32rem;
        background: #f5f5f5;
        position: relative;
      }
      .verifyCode-content{
        width: 4.96rem;
        height: 1.24rem;
        border-radius: .32rem;
        background: #f5f5f5;
        position: relative;
        display: flex;
        align-content: center;
        box-sizing: border-box;
        margin-right: .32rem;
        .content-input{
            width: 3.84rem;
        }
      }
      .telephone-content::before{
        content: "";
        position: absolute;
        width: 0.56rem;
        height: 0.56rem;
        background: url(../../assets/icon_tel_check.png) no-repeat;
        background-size: cover;
        left: 0.4rem;
        top: 0.3rem;
      }
      .verifyCode-content::before{
        content: "";
        position: absolute;
        width: 0.56rem;
        height: 0.56rem;
        background: url(../../assets/icon_verify-check.png) no-repeat;
        background-size: cover;
        left: 0.4rem;
        top: 0.3rem;
      }
      .content-input{
        border: none;
        outline: none;
        border-radius: .32rem;
        padding-left: 1.12rem;
        box-sizing: border-box;
        font-size: .40rem;
        color: #333;
        background: #f5f5f5;
      }
      .verify_code_box{
          width: 2.48rem;
          height: 1.24rem;
          border-radius: .32rem;
          background: url(../../assets/btn_verify_code.png) no-repeat center/cover;
          text-align: center;
          line-height: 1.24rem;
          color: #fff;
          font-size: .36rem;
      }
      .img_title {
        width: 6.96rem;
        height: 0.64rem;
        margin-bottom: 0.48rem;
      }
      .check-btn{
        width: 7.76rem;
        height: 1.24rem;
      }
    }
    .activity_rule{
        // width: 9.04rem;
        // margin: 0 auto;
        // box-sizing: border-box;
        // border-radius: .16rem;
        // background: #de353d;
        // padding: 1rem .64rem .96rem;
        // position: relative;
        // .rule_title{
        //     position: absolute;
        //     left: 50%;
        //     margin-left: -1.85rem;
        //     top:-.36rem;
        //     width: 3.7rem;
        //     height: .72rem;
        // }
        .rule_detail{
          img{
            width: 9.04rem;
            height: 12.28rem;
          }
            // li{
            //     font-size: .32rem;
            //     line-height: .48rem;
            //     color: #fff;
            //     margin-bottom: .24rem;
            //     text-align: left;
            // }
        }
    }
  }
}
</style>
