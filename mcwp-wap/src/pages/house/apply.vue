<template>
  <div class="house-apply">
    <ul class="contact-ul">
      <li class='contact-detail-content' v-if="houseAdress">
        <p class='contact-detail-left font-32'>房屋位置</p>
        <p class='contact-detail-right font-32'>{{houseAdress}}</p>
      </li>
      <li class='contact-detail-content' v-else>
        <p class='contact-detail-left contact-detail-item font-32'>房屋位置</p>
        <p class='contact-detail-right contact-detail-input font-32'>未获取详细地址</p>
      </li>
      <li class='contact-detail-content'>
        <p class='contact-detail-left font-32'>房屋单价</p>
        <p class='contact-detail-right font-32'>{{houseUnitPrice ? `${houseUnitPrice}元/平` : '暂无信息'}}</p>
      </li>
      <li class='contact-detail-content'>
        <p class='contact-detail-item font-32'>房屋估值</p>
        <p class='contact-detail-input font-32' :style="`color: ${ houseTotal ? '#ff9a4a' : '#333'};`">{{houseTotal ? `${houseTotal}万元` : '暂无信息'}}</p>
      </li>
      <li class='contact-detail-content'>
        <p class='contact-detail-item font-32'>最高可贷额度</p>
        <p class='contact-detail-input font-32' :style="`color: ${ topLoanAmount ? '#ff9a4a' : '#333'};`">{{topLoanAmount ? `${topLoanAmount}万元` : '暂无信息'}}</p>
      </li>
      <li class='purpose-detail-content content-middle'>
        <popup-picker class="font-32"  placeholder='请选择' title="借款用途" v-model="jkytValue" :data="jkytList" value-text-align='left'  :columns="1"  show-name></popup-picker>
      </li>
      <li class='contact-detail-content' v-if="data.telephone">
        <p class='contact-detail-item font-32'>联系方式</p>
        <p class='contact-detail-input font-32'>{{applyContact}}</p>
        <!-- <input class='contact-detail-input font-32' type="text" placeholder='请输入手机号' v-model="applyContact" > -->
      </li>
      <li class='contact-detail-content' v-else>
        <p class='contact-detail-item font-32'>联系方式</p>
        <input class='contact-detail-input font-32' type="text" placeholder='请输入手机号' v-model="applyContact" >
      </li>
      <!-- <li class='apply-detail-content' flex="dir:left box:last" v-if="!data.telephone">
        <p class='apply-detail-item font-32'>验证码</p>
        <input class='apply-detail-input font-32' type="tel" placeholder='请输入验证码' v-model="verifyCode" maxlength="6" />
        <p v-show="!computedTime" @click.prevent='getVerifyCode' class='apply-detail-verify font-32'>{{codeText}}</p>
        <p v-show="computedTime" @click.prevent class='apply-detail-verify font-32'>{{codeText}}</p>
      </li> -->
      <!-- <li class='contact-detail-content'>
        <p class='contact-detail-item font-32'>身份证号</p>
        <input class='contact-detail-input font-32' type="text" placeholder='请输入身份证号' v-model="applyIdCard" >
      </li>
      <li class='contact-detail-content'>
        <p class='contact-detail-item font-32'>姓名</p>
        <input class='contact-detail-input font-32' type="text" placeholder='请输入姓名' v-model="applyName" >
      </li> -->
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
    <v-button @next='nextStep' style="margin: 2rem auto;">下一步</v-button>
  </div>
</template>

<script>
import Store from 'store'
import Config from '../../config/index'
import Utils from '../../config/utils'
import VButton from './../../components/button'
import { Checker, CheckerItem, PopupPicker } from 'vux'
import { getLoanRoomInfo, postLoanRoomInfo } from '../../service/getData'
import { getDictCustom } from '../../service/common.js'

export default {
  components: {
    VButton,
    Checker,
    CheckerItem,
    PopupPicker
  },
  data () {
    return {
      loanCode: '',
      openId: '',
      houseAdress: '',
      houseUnitPrice: 0,
      houseTotal: '',
      topLoanAmount: '',
      applyContact: '',
      // applyIdCard: '',
      // applyName: '',
      // codeText: '获取验证码',
      checkAuthorize: true,
      computedTime: false,
      verifyCode: '',
      loanRoutes: '',
      isClear: true,
      jkytValue: [],
      jkytList: [],
      data: '',
      showAuth: JSON.parse(sessionStorage.getItem(Config.constants.contractProductAuth)),
      switch: false
    }
  },
  created () {
    const that = this
    const cookies = Store.get(Config.constants.cookies)
    const applyCookies = Store.get('house_apply')
    // if (applyCookies && applyCookies.applyName) that.applyName = applyCookies.applyName
    if (applyCookies && applyCookies.applyContact) that.applyContact = applyCookies.applyContact
    // if (applyCookies && applyCookies.applyIdCard) that.applyIdCard = applyCookies.applyIdCard
    if (applyCookies && applyCookies.jkytValue) that.jkytValue = applyCookies.jkytValue
    if (applyCookies && applyCookies.verifyCode) that.verifyCode = applyCookies.verifyCode
    that.loanCode = cookies.loanCode
    that.openId = cookies.openId || ''
    that.isClear = true
    // window.alert(that.openId)
    that.loanRoutes = cookies.loanRoutes
    Store.set('house_apply', {})
  },
  mounted () {
    const that = this
    that.getInfo()
    getDictCustom({ddItem: 'smdjkyt'}).then(res => {
      that.$vux.loading.hide()
      if (res.code === Config.resCode.success) {
        if (res.data && res.data.smdjkyt) {
          res.data.smdjkyt.forEach((item, index) => {
            that.jkytList.push({
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
  },
  beforeDestroy () {
    if (this.isClear) {
      Store.set('house_apply', {})
    }
  },
  methods: {
    selectAuthorize () {
      this.checkAuthorize = !this.checkAuthorize
    },
    contractDetail (type) {
      const that = this
      // let applyName = this.applyName
      let applyContact = this.applyContact
      // let applyIdCard = this.applyIdCard
      let verifyCode = this.verifyCode
      let jkytValue = this.jkytValue
      let cookies = {
        // applyName: applyName,
        applyContact: applyContact,
        jkytValue: jkytValue,
        // applyIdCard: applyIdCard,
        verifyCode: verifyCode
      }
      Store.set('house_apply', cookies)
      this.isClear = false
      that.$router.push(`${Config.constants.contractRouter}?type=${type}`)
    },
    // async getVerifyCode () { // 获取验证码
    //   const that = this
    //   // const applyName = that.applyName
    //   // if (!applyName) return that.$vux.toast.text(Config.constants.nullCname)
    //   const applyContact = that.applyContact
    //   if (!applyContact) return that.$vux.toast.text(Config.constants.nullTelephone)
    //   if (!Utils.isTelephone(applyContact)) {
    //     return that.$vux.toast.show({
    //       type: 'text',
    //       text: Config.constants.errorMobile,
    //       width: '6.5rem',
    //       isShowMask: true
    //     })
    //   }
    //   if (that.switch) return null
    //   that.switch = true
    //   // 发送短信验证码
    //   let res = await sendVerifyCode({telephone: applyContact, reqCode: that.loanCode})
    //   if (res.code === Config.resCode.success) {
    //     that.$vux.toast.text(Config.constants.sendVerifyCode)
    //     that.computedTime = 60
    //     that.timer = setInterval(() => {
    //       that.codeText = that.computedTime + 's后重新获取'
    //       that.computedTime --
    //       if (that.computedTime === -1) {
    //         that.codeText = '再次重新获取'
    //         that.computedTime = 0
    //         that.switch = false
    //         clearInterval(that.timer)
    //       }
    //     }, 1000)
    //   } else {
    //     that.$vux.toast.text(res.msg)
    //   }
    // },
    async getInfo () {
      const that = this
      const res = await getLoanRoomInfo({reqCode: that.loanCode, openId: that.openId})
      if (res.code === Config.resCode.success) {
        const data = res.data
        if (data) {
          that.data = data
          if (data.houseAddress) that.houseAdress = data.houseAddress
          if (data.houseUnitPrice) that.houseUnitPrice = data.houseUnitPrice
          if (data.houseTotal) that.houseTotal = data.houseTotal
          if (data.topLoanAmount) that.topLoanAmount = data.topLoanAmount
          if (data.telephone) that.applyContact = data.telephone
          // if (data.idCardNo) that.applyIdCard = data.idCardNo
          // if (data.cname) that.applyName = data.cname
        }
      } else {
        that.$vux.toast.text(res.msg)
      }
    },
    async nextStep () { // 下一步
      if (!this.checkAuthorize) {
        this.$vux.toast.text('未选择授权无法进行下一步操作，请确认')
        return
      }
      const that = this
      const jkytValue = that.jkytValue[0]
      if (!jkytValue) return that.$vux.toast.text(Config.constants.nullLoanUse)
      const applyContact = that.applyContact
      if (!applyContact) return that.$vux.toast.text(Config.constants.nullTelephone)
      if (!Utils.isTelephone(applyContact)) {
        return that.$vux.toast.show({
          type: 'text',
          text: Config.constants.errorMobile,
          width: '6.5rem',
          isShowMask: true
        })
      }
      if (!that.data.telephone) {
        // const verifyCode = that.verifyCode
        // if (!verifyCode) return that.$vux.toast.text(Config.constants.nullVerifyCode)
        // const applyIdCard = that.applyIdCard
        // if (!applyIdCard) return that.$vux.toast.text(Config.constants.nullIdcardNo)
        // if (!Utils.isIdCardNo(applyIdCard)) return that.$vux.toast.text(Config.constants.errorIdcardNo)
        // const applyName = that.applyName
        // if (!applyName) return that.$vux.toast.text(Config.constants.nullCname)
        const customerParams = {
          reqCode: that.loanCode || '',
          openId: that.openId || '',
          // cname: applyName,
          telephone: Utils.clearSpecChars(applyContact),
          loanUse: jkytValue
          // idCardNo: applyIdCard,
          // verifyCode: verifyCode
        }
        // 借款人信息录入,经营贷和车抵贷产品入口
        // that.$vux.loading.show({
        //   text: '请稍候...'
        // })
        // 临时注释，等接口调整完毕再打开
        // const accreditSign = await getAccreditSign({loanCode: that.loanCode})
        const res = await postLoanRoomInfo(customerParams)
        if (res.code === Config.resCode.success) {
          Store.set('house_apply', {})
          let loanRoutes = that.loanRoutes
          let pathIndex = Utils.getIndex(loanRoutes, window.location.pathname)
          that.$router.push(loanRoutes[pathIndex + 1])
        } else {
          that.$vux.loading.hide()
          that.$vux.toast.text(res.msg)
        }
      } else {
        const customerParams = {
          reqCode: that.loanCode || '',
          openId: that.openId || '',
          // cname: applyName,
          telephone: applyContact,
          loanUse: jkytValue
        }
        // 借款人信息录入,经营贷和车抵贷产品入口
        // that.$vux.loading.show({
        //   text: '请稍候...'
        // })
        // 临时注释，等接口调整完毕再打开
        // const accreditSign = await getAccreditSign({loanCode: that.loanCode})
        const res = await postLoanRoomInfo(customerParams)
        if (res.code === Config.resCode.success) {
          Store.set('house_apply', {})
          let loanRoutes = that.loanRoutes
          let pathIndex = Utils.getIndex(loanRoutes, window.location.pathname)
          that.$router.push(loanRoutes[pathIndex + 1])
        } else {
          that.$vux.loading.hide()
          that.$vux.toast.text(res.msg)
        }
      }
    }
  }
}
</script>

<style lang="less">
  .house-apply {
    position: relative;
    width: 10.8rem;
    background-color: #fafafa;
    margin: 0 auto;
    overflow: hidden;
    .contact-ul {
      position: relative;
      width: 100%;
      height: auto;
      background-color: #fff;
      overflow-x: hidden;
    }
    .confirm-authorize {
      padding-top: .3rem;
      background-color: #fafafa;
    }
    .vux-tap-active:active {
      background-color: transparent;
    }
    .ipieces-item{
      background: url(../../assets/icon_choice_disable.png) no-repeat .48rem .1rem;
      background-size: .4rem .4rem;
    }
    .ipieces-item-selected{
      background: url(../../assets/icon_choice_pressed.png) no-repeat .48rem .1rem;
      background-size: .4rem .4rem;
    }
    .content-container {
      padding-top: .2rem;
    }
    .content-left {
      float: left;
      text-indent: 1rem;
    }
    .content-right {
      float: left;
      color: #369fff;
    }
    .contact-detail-content {
      position: relative;
      width: 100%;
      display: flex;
    }
    .apply-detail-item {
      // width: 3rem;
      flex: 0 0 3rem;
      // padding-left: .48rem;
      text-indent: .48rem;
      color: #333;
      height: 1.46rem;
      line-height: 1.46rem;
    }
    .apply-detail-input {
      flex: 1;
      border: none;
      outline: none;
      text-indent: .96rem;
      color: #333;
    }
    .apply-detail-verify {
      // padding-right: .48rem;
      box-sizing: border-box;
      height: 1.46rem;
      line-height: 1.46rem;
      color: #369fff;
      text-align: center;
    }
    .contact-detail-item {
      width: 3rem;
      padding-left: .48rem;
      color: #333;
      height: 1.46rem;
      line-height: 1.46rem;
    }
    .contact-detail-input {
      flex: 1;
      border: none;
      outline: none;
      padding-left: .48rem;
      color: #333;
      height: 1.46rem;
      line-height: 1.46rem;
      &.empty {
        color: #777;
      }
    }
    .contact-detail-left {
      width: 3rem;
      padding: .3rem 0 0 .48rem;
      color: #333;
      min-height: .86rem;
    }
    .contact-detail-right {
      padding: .3rem 0 0 .48rem;
      width: 6rem;
      color: #333;
    }
    .contact-detail-unit {
      float: right;
      padding-right: .48rem;
      color: #666;
      height: 1.46rem;
      line-height: 1.46rem;
    }
    .weui-cell {
      display: flex;
      padding: 0;
      height: 1.46rem;
      line-height: 1.46rem;
    }
    .weui-cell__hd {
      width: 3rem;
      padding-left: .48rem;
      text-align: left;
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
    .weui-label {
      color: #333;
    }
  }
</style>
