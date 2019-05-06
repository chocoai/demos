<template>
  <div class="prize-container">
    <div class="prize-content">
      <p class="prize-type">{{awardName}}</p>
      <p class="prize-name">{{prizeName}}</p>
      <ul class="contact-ul">
        <li class='contact-detail-content'>
          <p class='contact-detail-item'>姓名</p>
          <div class="contact-detail-span" v-if="name">{{name}}</div>
          <input v-else class='contact-detail-input' type="text" placeholder='请输入姓名' v-model="custName" >
        </li>
        <li class='contact-detail-content'>
          <p class='contact-detail-item'>联系方式</p>
          <div class="contact-detail-span" v-if="phone">{{phone}}</div>
          <input v-else class='contact-detail-input' type="text" placeholder='请输入手机号' v-model="prizePhone" >
        </li>
        <li v-show="type=='cash'" class='contact-detail-content'>
          <p class='contact-detail-item'>验证码</p>
          <input class='contact-detail-input verify-input' type="tel" placeholder='请输入验证码' v-model="verifyCode" maxlength="6" />
          <p v-show="!computedTime" @click.prevent='getVerifyCode' class='apply-detail-verify'>{{codeText}}</p>
          <p v-show="computedTime" @click.prevent class='apply-detail-verify'>{{codeText}}</p>
        </li>
      </ul>
      <div class="prize-term">
        <p class="prize-tip">兑奖期限</p>
        <p class="prize-time">{{`${formatTime(+prizeTime.split(',')[0])}到${formatTime(+prizeTime.split(',')[1])}`}}</p>
      </div>
      <div class="prize-term">
        <p class="prize-tip">兑奖须知</p>
        <p class="prize-time">{{cashDesc}}</p>
      </div>
      <v-button class="detail-check" @next="nextStep" v-if="prizeTimeStatus === '1'">立即兑奖</v-button>
      <v-button class="detail-check check-fail" v-else>立即兑奖</v-button>
      <div class="prize-footer">
        <div class="footer-link">
          <p class="link-tip">客服电话</p>
          <a class="link-phone" :href="`tel:${custmerServicePhone}`">{{custmerServicePhone}}</a>
        </div>
        <div class="footer-show">
          <img class="show-code" :src="sharePic"/>
          <div class="show-tip">
            <p class="tip-p">长按识别二维码</p>
            <p class="tip-p">关注公众号</p>
          </div>
        </div>
      </div>
    </div>
    <convert-prize v-if="showConvert" @close="close" @next= "next" @back="back" :prizeType="prizeType" :prizeTime="prizeTime"></convert-prize>
  </div>
</template>

<script>
import Config from '../../config/index'
import Utils from '../../config/utils'
import VButton from './../../components/button'
import convertPrize from './../../components/turntable/convertPrize'
import sharePic from '../../assets/img_QR.png'
import {postLotteryTelephone, getLotteryPrdetail, putLotteryBindinfo, putLotteryBindinfoLimit} from '../../service/getData'
import {getWxLoginStatus} from '../../service/home'

export default {
  components: {
    VButton,
    convertPrize
  },
  data () {
    return {
      sharePic: sharePic,
      awardName: '',
      prizeName: '',
      custName: '', // 后台验资保留的姓名
      prizePhone: '',
      prizeTime: '',
      cashDesc: '',
      custmerServicePhone: '',
      codeText: '获取验证码',
      verifyCode: '',
      computedTime: false,
      activityCode: '',
      prizeTimeStatus: '',
      showConvert: false,
      prizeType: '',
      type: this.$route.params.type,
      name: '',
      phone: '',
      code: Utils.getUrlkey(window.location.search)['activityCode'],
      tempPhone: '',
      tempName: ''
    }
  },
  mounted () {
    const that = this
    let recordCode = this.$route.params.code
    this.activityCode = sessionStorage.getItem(Config.constants.wxACTIVITYCODE)
    // console.log(this.activityCode)
    let params = {
      recordCode: recordCode
    }
    // if (that.type === 'limit') {
    //   let params = {
    //     activityCode: this.code
    //   }
    //   getPersonDetail(params).then(res => {
    //     if (res.code === Config.resCode.success) {
    //       if (res.data) {
    //         this.name = res.data.name
    //         this.phone = res.data.telephone
    //       }
    //     } else {
    //       that.$vux.toast.text(res.msg)
    //     }
    //   })
    // }
    getWxLoginStatus().then(res => {
      if (res.code === Config.resCode.success) {
        if (res.data) {
          this.name = res.data.userName
          this.phone = res.data.telephone
        }
      } else {
        // that.$vux.toast.text(res.msg)
      }
    })
    // alert(this.phone)
    // let res = getWxMeInfo()
    // if (res.data) {
    //   this.name = res.data.name
    //   this.phone = res.data.telephone
    // }

    // getLotteryQrcode({}).then(res => {
    //   if (res.code === Config.resCode.success) {
    //     console.log(res.data)
    //     if (res.data) {
    //       this.sharePic = res.data.Url
    //     }
    //   } else {
    //     that.$vux.toast.text(res.msg)
    //   }
    // })
    getLotteryPrdetail(params).then(res => {
      if (res.code === Config.resCode.success) {
        if (res.data) {
          that.awardName = res.data.prize.awardName
          that.prizeName = res.data.prize.prizeName
          that.custName = res.data.record.custName
          that.prizePhone = res.data.record.telephone
          that.prizeTime = res.data.prize.prizeTime
          that.cashDesc = res.data.prize.cashDesc
          that.custmerServicePhone = res.data.info.custmerServicePhone
          that.prizeTimeStatus = res.data.prizeTimeStatus
          this.prizeType = res.data.prize.prizeType
        }
      } else {
        that.$vux.toast.text(res.msg)
      }
    })
  },
  methods: {
    async getVerifyCode () { // 获取验证码
      const that = this
      const prizeName = that.prizeName
      if (!prizeName) return that.$vux.toast.text(Config.constants.nullCname)
      if (that.phone) {
        this.tempPhone = this.phone
      } else {
        this.tempPhone = this.prizePhone
      }
      if (!this.tempPhone) return that.$vux.toast.text(Config.constants.nullTelephone)
      if (!Utils.isTelephone(this.tempPhone)) {
        return that.$vux.toast.show({
          type: 'text',
          text: Config.constants.errorMobile,
          width: '6.5rem',
          isShowMask: true
        })
      }

      // 发送短信验证码
      let res = await postLotteryTelephone({telephone: Utils.clearSpecChars(this.tempPhone), activityCode: that.activityCode})
      if (res.code === Config.resCode.success) {
        that.$vux.toast.text(Config.constants.sendVerifyCode)
        that.computedTime = 60
        that.timer = setInterval(() => {
          that.codeText = that.computedTime + 's后重新获取'
          that.computedTime --
          if (that.computedTime === -1) {
            that.codeText = '再次重新获取'
            that.computedTime = 0
            clearInterval(that.timer)
          }
        }, 1000)
      } else {
        that.$vux.toast.text(res.msg)
      }
    },
    async nextStep () {
      const that = this
      const activityCode = that.activityCode
      const recordCode = that.$route.params.code
      let params
      let res
      if (that.type === 'limit') {
        params = {
          activityCode: activityCode,
          recordCode: recordCode
        }
        res = await putLotteryBindinfoLimit(params)
      } else {
        if (this.name) {
          this.tempName = this.name
        } else {
          this.tempName = this.custName
        }
        const custName = this.tempName
        if (!custName) return that.$vux.toast.text(Config.constants.nullName)
        if (that.phone) {
          this.tempPhone = this.phone
        } else {
          this.tempPhone = this.prizePhone
        }
        const prizePhone = that.tempPhone
        if (!prizePhone) return that.$vux.toast.text(Config.constants.nullTelephone)
        const verifyCode = that.verifyCode
        if (!verifyCode) return that.$vux.toast.text(Config.constants.nullVerifyCode)
        params = {
          activityCode: activityCode,
          name: custName,
          telephone: prizePhone,
          code: verifyCode,
          recordCode: recordCode
        }
        Utils.countPlus('抽奖活动点击“立即兑奖”', 'send')
        res = await putLotteryBindinfo(params)
      }
      if (res.code === Config.resCode.success) {
        // that.$vux.toast.text('兑奖成功')
        this.showConvert = true
      } else {
        that.$vux.loading.hide()
        that.$vux.toast.text(res.msg)
      }
    },
    formatTime (time) {
      return Utils.formatTimeToS(time)
    },
    next () {
      window.location.href = '/tap/score/scoreExchange'
    },
    back () {
      this.$router.push(`${Config.constants.activityTurntable}?activityCode=${this.activityCode}`)
    },
    close () {
      this.$router.push(`${Config.constants.activityTurntable}?activityCode=${this.activityCode}`)
      // this.showConvert = false
    }
  }
}
</script>


<style lang="less" scoped>
  .prize-container {
    width: 10.8rem;
    height: 100%;
    background: url('./../../assets/turntable_bg.png');
    background-size: cover;
    padding: .5rem 0;
    .prize-content {
      width: 9.84rem;
      height: 94%;
      margin: 0 auto;
      position: relative;
      top: 3%;
      background: url('./../../assets/prize-content.png') no-repeat center/cover;
      background-size: cover;
      overflow-y: scroll;
    }
    .prize-type {
      font-size: .4rem;
      color: #888;
      text-align: center;
      padding-top: .48rem;
    }
    .prize-name {
      font-size: .56rem;
      color: #333;
      padding-top: .4rem;
      text-align: center;
    }
    .contact-ul {
      position: relative;
      width: 100%;
      height: auto;
      background-color: #fff;
      overflow-x: hidden;
      margin-top: 1.12rem;
    }
    .contact-detail-content {
      position: relative;
      width: 8.4rem;
      padding: 0 .72rem;
    }
    .contact-detail-span{
      width: 6.4rem;
      height: 1rem;
      color: #333;
      font-size: .4rem;
      line-height: 1rem;
    }
    .contact-detail-content + .contact-detail-content {
      margin-top: .4rem;
    }
    .contact-detail-item {
      flex: 0 0 3rem;
      font-size: .4rem;
      width: 1.9rem;
      color: #333;
      float: left;
      line-height: 1rem;
    }
    .contact-detail-input {
      width: 6.4rem;
      height: 1rem;
      border: 1px solid #ccc;
      border-radius: .48rem;
      text-indent: .48rem;
      outline: none;
      color: #333;
      font-size: .4rem;
    }
    .verify-input {
      width: 3.8rem;
      margin-bottom: .2rem;
    }
    .apply-detail-verify {
      font-size: .36rem;
      box-sizing: border-box;
      height: 1rem;
      line-height: 1rem;
      color: #369fff;
      text-align: center;
      float: right;
    }
    .prize-term {
      padding: 0 .72rem;
      margin-top: .4rem;
    }
    .prize-tip {
      font-size: .36rem;
      color: #888;
    }
    .prize-time {
      font-size: .4rem;
      color: #333;
      padding-top: .24rem;
    }
    .detail-check {
      background: #fe5559;
      width: 3.44rem;
      height: 1.2rem;
      line-height: 1.2rem;
      border-radius: .6rem;
      font-size: .4rem;
      color: #fff;
      margin-top: .64rem;
      margin-bottom: 1.2rem;
    }
    .prize-footer {
      padding: 0 .72rem;
    }
    .footer-link {
      font-size: .4rem;
      color: #333;
      overflow: hidden;
      height: 1.52rem;
      line-height: 1.52rem;
      border-bottom: 2px solid #dcdcdc;
    }
    .link-tip {
      float: left;
    }
    .link-phone {
      float: right;
      background: url('./../../assets/icon_dial.png') right center no-repeat;
      background-size: .56rem .56rem;
      padding-right: 1.16rem;
      margin-right: .2rem;
      color: #333;
    }
    .footer-show {
      overflow: hidden;
      height: 2.8rem;
      align-items:center;//子元素垂直居中
      display:-webkit-flex;
    }
    .show-code {
      width: 1.6rem;
      height: 1.6rem;
      float: left;
    }
    .show-tip {
      float: left;
      padding-left: .4rem;
      color: #333;
    }
    .check-fail {
      background: #ccc;
    }
  }
</style>

