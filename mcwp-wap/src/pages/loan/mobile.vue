<template>
  <div class="apply-loan">
    <ul class="apply-ul">
      <li class='apply-detail-content'>
        <p class='apply-detail-item font-32'>姓名</p>
        <input class='apply-detail-input font-32' type="text" placeholder='请输入姓名' v-model="cname" />
      </li>
      <li class='apply-detail-content'>
        <p class='apply-detail-item font-32'>联系方式</p>
        <input class='apply-detail-input font-32' type="tel" placeholder='请输入手机号' v-model="telephone" maxlength="11"/>
      </li>
      <li class='apply-detail-content font-32' v-if="type !== '5'">
        <p class='apply-detail-item font-32'>验证码</p>
        <input class='apply-detail-input font-32' type="tel" placeholder='请输入验证码' v-model="verifyCode" maxlength="6" />
        <p v-show="!computedTime" @click.prevent='getVerifyCode' class='apply-detail-verify font-28'>{{codeText}}</p>
        <p v-show="computedTime" @click.prevent class='apply-detail-verify font-28'>{{codeText}}</p>
      </li>
      <li class='apply-detail-content'>
        <popup-picker class="font-32" placeholder='请选择' title="借款用途" value-text-align='left' :data="listData" :columns="1" v-model="loanUsePicker" @on-show="onShow" show-name></popup-picker>
        <img class="icon-choice" src="../../assets/icon_choice.png"/>
      </li>
    </ul>
    <div class="content-container font-32">
      <div class="content-left ipieces-item" :class="{ 'ipieces-item-selected' : checkAuthorize }" @click.prevent='selectAuthorize'>
        确认授权即表示同意
      </div>
      <ul class="content-right">
        <li @click="contractDetail('auth')" v-if="showAuth">《个人授权协议》</li>
        <li @click="contractDetail('privacy')">《用户隐私协议》</li>
      </ul>
    </div>
    <v-button @next='nextStep' style="margin: 2.08rem auto;">下一步</v-button>
  </div>
</template>

<script>
/**
 * 数据服务
 * @Author: 魏昌华
 * @Date:   2017-07-13
 * @Last Modified by:   魏昌华
 * @Last Modified time: 2017-07-13
 */
import Store from 'store'
import VButton from './../../components/button'
import Config from '../../config/index'
import Utils from '../../config/utils'
import { sendVerifyCode, loanCustomer } from '../../service/getData'
import { PopupPicker, Group, Checker, CheckerItem } from 'vux'
import { getDictCustom } from '../../service/common.js'

export default {
  components: {
    VButton,
    PopupPicker,
    Group,
    Checker,
    CheckerItem
  },
  data () {
    return {
      codeText: '获取验证码',
      cname: '',
      telephone: '',
      loanUsePicker: [],
      computedTime: 0, // 倒数记时
      verifyCode: '',
      listData: [],
      loanCode: '',
      checkAuthorize: true,
      loanRoutes: [],
      pathIndex: '',
      onOff: false,
      type: this.$route.params.type,
      showAuth: JSON.parse(sessionStorage.getItem(Config.constants.contractProductAuth)),
      getTime: new Date().getTime()   // 时长统计
    }
  },
  created () {
    const that = this
    const cookies = Store.get(Config.constants.cookies)
    const loanCookies = Store.get('loan_apply')
    if (loanCookies && loanCookies.cname) that.cname = loanCookies.cname
    if (loanCookies && loanCookies.telephone) that.telephone = loanCookies.telephone
    if (loanCookies && loanCookies.verifyCode) that.verifyCode = loanCookies.verifyCode
    if (loanCookies && loanCookies.loanUsePicker) that.loanUsePicker = loanCookies.loanUsePicker
    that.isClear = true
    that.loanCode = cookies.loanCode
    that.loanRoutes = cookies.loanRoutes
    that.pathIndex = Utils.getIndex(that.loanRoutes, window.location.pathname)
    Store.set('loan_apply', {})
  },
  mounted () {
    const that = this
    if (!that.loanCode) return
    getDictCustom({ddItem: 'smdjkyt'}).then(res => {
      that.$vux.loading.hide()
      if (res.code === Config.resCode.success) {
        if (res.data && res.data.smdjkyt) {
          res.data.smdjkyt.forEach((item, index) => {
            that.listData.push({
              value: item.ddValue,
              name: item.ddText,
              parent: item.parentValue
            })
          })
        }
      } else {
        that.$vux.toast.text(res.msg)
      }
    })
    Utils.countPlus('基本信息', 'send')
  },
  beforeDestroy () {
    if (this.timer) clearInterval(this.timer)
    if (this.isClear) {
      Store.set('loan_apply', {})
    }
  },
  methods: {
    selectAuthorize () {
      this.checkAuthorize = !this.checkAuthorize
    },
    onShow () {
      // setTimeout(_ => {
      //   this.listData = [...this.listData]
      // }, 800)
    },
    contractDetail (type) {
      const that = this
      let cname = this.cname
      let telephone = this.telephone
      let verifyCode = this.verifyCode
      let loanUsePicker = this.loanUsePicker
      let cookies = {
        cname: cname,
        telephone: telephone,
        verifyCode: verifyCode,
        loanUsePicker: loanUsePicker
      }
      Store.set('loan_apply', cookies)
      this.isClear = false
      that.$router.push(`${Config.constants.contractRouter}?type=${type}`)
    },
    async nextStep () {
      if (!this.checkAuthorize) {
        this.$vux.toast.text('未选择授权无法进行下一步操作，请确认')
        return
      }
      const that = this
      const cname = that.cname
      if (!cname) return that.$vux.toast.text(Config.constants.nullCname)
      if (cname.length < 2) return that.$vux.toast.text(Config.constants.nameLengthShort)
      const telephone = that.telephone
      if (!telephone) return that.$vux.toast.text(Config.constants.nullTelephone)
      if (!Utils.isTelephone(telephone)) {
        return that.$vux.toast.show({
          type: 'text',
          text: Config.constants.errorMobile,
          width: '6.5rem',
          isShowMask: true
        })
      }
      const verifyCode = that.verifyCode
      if (!verifyCode && this.type !== '5') return that.$vux.toast.text(Config.constants.nullVerifyCode)
      const loanUse = that.loanUsePicker[0]
      if (!loanUse) return that.$vux.toast.text(Config.constants.nullLoanUse)
      let cookies = Store.get(Config.constants.cookies)
      let customerParams = {
        prdCode: cookies.proCode || '',
        managerCode: cookies.managerCode || '',
        cname: cname,
        telephone: Utils.clearSpecChars(telephone),
        loanUse: loanUse,
        verifyCode: verifyCode,
        reqCode: that.loanCode
      }
      if (this.type === '5') {
        delete customerParams.verifyCode
      }
      // 借款人信息录入,经营贷和车抵贷产品入口
      that.$vux.loading.show({
        text: '请稍候...'
      })
      Utils.countPlus({
        'userName': telephone
      }, 'register')
      // 临时注释，等接口调整完毕再打开
      // const accreditSign = await getAccreditSign({loanCode: that.loanCode})
      const res = await loanCustomer(customerParams)
      // if (accreditSign.code === Config.resCode.success) {
      //   // 授权成功，不作处理
      // } else {
      //   // 授权失败
      //   return that.$vux.toast.text(accreditSign.msg)
      // }
      if (res.code === Config.resCode.success) {
        let loanRoutes = that.loanRoutes
        // let pathIndex = Utils.getIndex(loanRoutes, window.location.pathname)
        Utils.countPlus('页面停留时长', 'send', {'pageName': '基本信息', 'stayTime': new Date().getTime() - this.getTime})
        if (that.pathIndex > -1 && that.pathIndex !== loanRoutes.length - 1) {
          that.$router.push(loanRoutes[that.pathIndex + 1])
        } else {
          that.$router.push(Config.constants.confirmRouter)
        }
      } else {
        that.$vux.loading.hide()
        that.$vux.toast.text(res.msg)
      }
    },
    async getVerifyCode () { // 获取验证码
      const that = this
      const cname = that.cname
      if (!cname) return that.$vux.toast.text(Config.constants.nullCname)
      const telephone = that.telephone
      if (!telephone) return that.$vux.toast.text(Config.constants.nullTelephone)
      if (!Utils.isTelephone(telephone)) {
        return that.$vux.toast.show({
          type: 'text',
          text: Config.constants.errorMobile,
          width: '6.5rem',
          isShowMask: true
        })
      }
      if (that.onOff) return false
      that.onOff = true
      // 发送短信验证码
      let res = await sendVerifyCode({telephone: Utils.clearSpecChars(telephone), reqCode: that.loanCode})
      if (res.code === Config.resCode.success) {
        that.$vux.toast.text(Config.constants.sendVerifyCode)
        that.computedTime = 60
        that.timer = setInterval(() => {
          that.codeText = that.computedTime + 's后重新获取'
          that.computedTime --
          if (that.computedTime === -1) {
            that.codeText = '再次重新获取'
            that.computedTime = 0
            that.onOff = false
            clearInterval(that.timer)
          }
        }, 1000)
      } else {
        that.$vux.toast.text(res.msg)
      }
    }
  }
}
</script>

<style lang='less'>
.apply-loan {
  position: relative;
  width: 10.8rem;
  background-color: #fafafa;
  margin: 0 auto;
  height: 100%;
  .apply-ul {
    position: relative;
    width: 100%;
    height: auto;
    background-color: #fff;
    overflow: hidden;
  }
  .apply-detail-content {
    position: relative;
    width: 100%;
    display: flex;
  }
  .apply-detail-item {
    width: 2.5rem;
    // padding-left: .48rem;
    text-indent: .48rem;
    color: #333;
    height: 1.46rem;
    line-height: 1.46rem;
    // font-weight: bold;
  }
  .apply-detail-input {
    flex: 1;
    border: none;
    outline: none;
    text-indent: .48rem;
    color: #333;
    min-width: 5rem;
  }
  .apply-detail-verify {
    padding-right: .48rem;
    box-sizing: border-box;
    height: 1.46rem;
    line-height: 1.46rem;
    color: #369fff;
    text-align: right;
  }
  .icon-choice {
    width: .4rem;
    height: .4rem;
    position: relative;
    top: .5rem;
    right: .68rem;
  }
  .confirm-authorize {
    padding-top: .3rem;
    background-color: #fafafa;
  }
  .vux-tap-active:active {
    background-color: transparent;
  }
  .ipieces-item{
    background: url(../../assets/icon_choice_disable.png) no-repeat .48rem .15rem;
    background-size: .4rem .4rem;
  }
  .ipieces-item-selected{
    background: url(../../assets/icon_choice_pressed.png) no-repeat .48rem .15rem;
    background-size: .4rem .4rem;
  }
  .content-container {
    padding-top: .48rem;
    overflow: hidden;
  }
  .content-left {
    float: left;
    text-indent: 1rem;
  }
  .content-right {
    float: left;
    color: #369fff;
  }
  .weui-cell {
    display: flex;
    padding: 0;
    height: 1.46rem;
    line-height: 1.46rem;
  }
  .weui-cell__hd {
    width: 2.5rem;
    text-indent: .48rem;
    text-align: left;
    // font-weight: bold;
  }
  .vux-cell-box {
    width: 100%;
  }
  .vux-popup-picker-select {
    padding-left: .48rem;
  }
  .vux-cell-box:before {
    border-top: none;
  }
  .weui-cell_access .weui-cell__ft:after {
    display: none;
  }
  .vux-popup-picker-placeholder {
    color: #777;
  }
}
</style>
