<template>
  <div class="product-mention">
    <p class="more-tips font-28">补全信息，以便更全面的评估信用额度</p>
    <!-- <tab :line-width="1" custom-bar-width="80px" bar-active-color="#369fff">
      <tab-item :selected="curPage === 0" @on-item-click="onItemClick">银行流水认定</tab-item>
      <tab-item :selected="curPage === 1" @on-item-click="onItemClick">运营商信息</tab-item>
    </tab> -->
    <swiper v-model="curPage" :show-dots="false">
        <swiper-item key="0">
          <div class="tab-swiper vux-center">
            <ul class="apply-ul">
              <li class='apply-detail-content'>
                <popup-picker class="font-32" placeholder='请选择' title="主营借记卡" value-text-align='left' :columns="1" :data="bankData" @on-change="selectBank" v-model="bankPicker" show-name></popup-picker>
              </li>
              <li class='apply-detail-content'>
                <popup-picker class="font-32" placeholder='请选择' title="登录方式" value-text-align='left' :columns="1" :data="loginData" @on-change="selectLoginMethod" v-model="loginPicker" show-name></popup-picker>
              </li>
              <li class='apply-detail-content'>
                <p class='apply-detail-item font-32'>{{usernameDesc}}</p>
                <input class='apply-detail-input font-32' type="text" :placeholder="`请输入${usernameDesc}`" v-model='account' />
              </li>
              <li v-if='CIBBank' class='apply-detail-content'>
                <p class='apply-detail-item font-32'>借记卡卡号</p>
                <input class='apply-detail-input font-32' type="text" placeholder="请输入借记卡卡号" v-model='CIBCard' />
              </li>
              <li class='apply-detail-content'>
                <p class='apply-detail-item font-32'>{{passwordDesc}}</p>
                <input class='apply-detail-input font-32' type="password" :placeholder="`请输入${passwordDesc}`"  maxlength="12" v-model='passWord' />
              </li>
              <li class='apply-detail-content view-detail'>
                <span class="view-span" @click="showTip=true">说明</span>
              </li>
            </ul>
            <v-button class="login-btn" @next='getVerifyCode'>保存</v-button>
          </div>
        </swiper-item>
        <!-- <swiper-item key="1">
          <div class="tab-swiper vux-center">
            <ul class="apply-ul">
              <li class='apply-detail-content'>
                <p class='apply-detail-item font-32'>手机号</p>
                <input class='apply-detail-input font-32' type="text" placeholder='请输入手机号'  maxlength="11" v-model='servicePhone' />
              </li>
              <li class='apply-detail-content'>
                <p class='apply-detail-item font-32'>查询密码</p>
                <input class='apply-detail-input font-32' type="password" placeholder='请输入查询密码'  maxlength="11" v-model='servicePsw' />
              </li>
              <li class='apply-detail-content view-detail'>
                <span class="view-span" @click="showTip=true">说明</span>
              </li>
            </ul>
            <v-button class="login-btn" @next='nextStep'>保存</v-button>
          </div>
        </swiper-item> -->
      </swiper>
    <div class="mode-container" v-if="showConfirm">
      <ul class="apply-ul mode-ul">
        <li class='apply-detail-content'>
          <p class='apply-detail-item font-32'>验证码</p>
          <input class='apply-detail-input font-32' type="text" placeholder='请输入验证码'  maxlength="11" v-model='serviceCode' />
        </li>
        <li class="btn-list">
          <span class="mode-concle font-40" @click='onCancel'>取消</span>
          <span class="mode-comfirm font-40" @click='onConfirm'>确认</span>
        </li>
      </ul>
    </div>
    <div v-transfer-dom class="tip-container">
      <x-dialog v-model="showTip" hide-on-blur :dialog-style="{'max-width': '80%', width: '80%', height: '70%', padding: '.6rem', overflow: 'scroll'}">
        <p style="padding-bottom:1rem;color: #1d1d1d;" class="font-40">说明</p>
        <div style="text-align:left;line-height:.8rem;color:#333" class="font-32">
          <p>1. 主营借记卡的查询密码非必填项，可选择线下向客户经理提交纸质的银行流水</p>
          <p>2. 输入查询密码，线上提供银行流水，可以更方便、快捷的完善您的信用信息</p>
          <p>3. 输入的查询密码一次有效，后台不做记录，保证您的密码安全</p>
          <!-- <p>4. 添加运营商查询密码，通过了解您的入网时长，从而提升您的额度</p> -->
          <span style="color:#369fff;position:absolute;bottom:.8rem;left:4.2rem;" @click="showTip=false">知道了</span>
        </div>
      </x-dialog>
    </div>
  </div>
</template>

<script>
import VButton from './../../components/button'
import Config from '../../config/index'
import Utils from '../../config/utils'
import { Tab, TabItem, Swiper, SwiperItem, PopupPicker, Confirm, XDialog, TransferDomDirective as TransferDom } from 'vux'
import { postBankMobileCode, getBankTaskStatus, postTaskMobile, getTaskStatus, postMobileCode, getBankList, getLoginMethod, getLoginTaskId } from '../../service/getData'

export default {
  directives: {
    TransferDom
  },
  components: {
    VButton,
    Tab,
    TabItem,
    Swiper,
    SwiperItem,
    PopupPicker,
    Confirm,
    XDialog
  },
  data () {
    return {
      curPage: 0,
      codeText: '获取验证码',
      bankData: [],
      bank: '',
      bankDes: '',
      cardType: '',
      loginData: [],
      loginType: '',
      usernameDesc: '身份证',
      passwordDesc: '登录密码',
      passwordRegex: '',
      usernameRegex: '',
      account: '',
      passWord: '',
      verifyCode: '',
      bankTaskId: '',
      computedTime: '',
      bankPicker: [],
      loginPicker: [],
      serviceData: [],
      servicePhone: '',
      servicePsw: '',
      servicePicker: [],
      showConfirm: false,
      taskId: '',
      serviceCode: '',
      showTip: false,
      timer: '',
      CIBCard: '',
      CIBBank: false
    }
  },
  mounted () {
    const that = this
    getBankList({}).then(res => {
      that.$vux.loading.hide()
      if (res.code === Config.resCode.success) {
        let data = JSON.parse(res.data.data)
        data = data.filter(item => item.card_type === 'DEBITCARD')
        if (data && data[0] && data[0].bank_list) {
          that.cardType = data[0].card_type
          data[0].bank_list.forEach((item, index) => {
            that.bankData.push({
              value: JSON.stringify({
                value: item.abbr,
                name: item.name
              }),
              name: item.name
            })
          })
        }
      } else {
        that.$vux.toast.text(res.msg)
      }
    })
  },
  methods: {
    onItemClick (index) {
      this.curPage = index
    },
    // 选择银行
    selectBank (val) {
      const that = this
      let value = JSON.parse(val[0])
      that.bank = value.value
      that.bankDes = value.name
      const params = {
        abbr: value.value,
        cardType: that.cardType
      }
      this.changeLoginMethod(params)
    },
    // 选择登录方式
    selectLoginMethod (value) {
      const that = this
      let choseValue = JSON.parse(value)
      that.loginType = choseValue.loginType
      that.usernameDesc = choseValue.usernameDesc
      // 有待优化
      that.passwordDesc = choseValue.passwordDesc
      that.passwordRegex = choseValue.passwordRegex
      that.usernameRegex = choseValue.usernameRegex
      // 清空
      that.account = ''
      that.passWord = ''
      that.CIBCard = ''
      // 兴业银行
      if (that.bank === 'CIB') {
        that.CIBBank = true
      }
    },
    // 获取验证码
    async getVerifyCode () {
      const that = this
      const bank = that.bank
      if (!bank) return that.$vux.toast.text(Config.constants.nullBank)
      const loginType = that.loginType
      if (!loginType) return that.$vux.toast.text(Config.constants.nullLoginType)
      const account = that.account
      if (!account) return that.$vux.toast.text(Config.constants.nullIdcardNo)
      const passWord = that.passWord
      if (!passWord) return that.$vux.toast.text(Config.constants.nullPassWord)
      // let usernameR = new RegExp(that.usernameRegex)
      // let passwordR = new RegExp(that.passwordRegex)
      if (!that.account) return that.$vux.toast.text(`${that.usernameDesc}不能为空`)
      if (that.bank === 'CIB' && !that.CIBCard) return that.$vux.toast.text('借记卡卡号不能为空')
      if (!that.passWord) return that.$vux.toast.text(`${that.passwordDesc}不能为空`)
      // if (!usernameR.test(that.account)) return that.$vux.toast.text(`请输入正确的${that.usernameDesc}`)
      // if (!passwordR.test(that.passWord)) return that.$vux.toast.text(`请输入正确的${that.passwordDesc}`)
      let params = {
        bank: that.bank,
        account: that.account,
        password: that.passWord,
        loginTarget: that.cardType,
        loginType: that.loginType
      }
      if (that.bank === 'CIB') {
        params.account = `${that.account},${that.CIBCard}`
      }
      let res = await getLoginTaskId(params)
      if (res.code === Config.resCode.success) {
        that.$vux.loading.show({
          text: '正在进行账号密码确认'
        })
        res = JSON.parse(res.data.data)
        that.bankTaskId = res.task_id
        if (that.timer) {
          clearInterval(that.timer)
          that.timer = ''
        }
        that.timer = setInterval(() => {
          that.getBankStatus()
        }, 10000)
      } else {
        that.$vux.toast.text(res.msg)
      }
    },
    // 查询银行状态
    async getBankStatus (check) {
      const that = this
      let params = {
        taskId: that.bankTaskId,
        bank: that.bankDes,
        bankAbbr: that.bank,
        account: that.account,
        loginType: that.loginType,
        cardType: that.cardType
      }
      if (that.bank === 'CIB') {
        params.account = `${that.account},${that.CIBCard}`
      }
      const res = await getBankTaskStatus(params)
      if (res.code === Config.resCode.success) {
        // 有待优化
        res.data = JSON.parse(res.data.data)
        if (res.data.phase_status === 'WAIT_CODE') {
          that.$vux.loading.hide()
          clearInterval(that.timer)
          that.timer = ''
          that.showConfirm = true
          if (check === 'check') that.$vux.toast.text(res.data.description)
        } else if (res.data.phase_status === 'DONE_FAIL' || res.data.phase_status === 'DONE_TIMEOUT') {
          that.$vux.loading.hide()
          clearInterval(that.timer)
          that.timer = ''
          that.$vux.toast.text(res.data.description)
        } else if (res.data.phase_status === 'DONE_SUCC') {
          that.$vux.toast.text('保存成功')
          that.$vux.loading.hide()
          clearInterval(that.timer)
          that.timer = ''
          that.showConfirm = false
          setTimeout(() => {
            that.$router.push(Config.constants.personalRouter)
          }, 2000)
        }
      } else {
        that.$vux.toast.text(res.msg)
      }
    },
    // 获取登录方式
    async changeLoginMethod (params) {
      const that = this
      const res = await getLoginMethod(params)
      if (res.code === Config.resCode.success) {
        let data = JSON.parse(res.data.data)
        if (data && data.logins) {
          // 清空
          that.loginData = []
          that.loginType = ''
          that.loginPicker = []
          that.account = ''
          that.passWord = ''
          that.CIBBank = false
          data.logins.forEach((item, index) => {
            that.loginData.push({
              value: JSON.stringify({
                loginType: item.login_type,
                passwordDesc: item.password_desc,
                passwordRegex: item.password_regex,
                usernameDesc: item.username_desc,
                usernameRegex: item.username_regex
              }),
              name: item.username_desc
            })
          })
        }
      } else {
        that.$vux.toast.text(res.msg)
      }
    },
    onCancel () {
      this.showConfirm = false
    },
    async checkBankMobileCode () {
      const that = this
      const serviceCode = that.serviceCode
      if (!serviceCode) return that.$vux.toast.text(Config.constants.nullServiceCode)
      const bankParams = {
        taskId: that.bankTaskId,
        verifyCode: serviceCode
      }
      const res = await postBankMobileCode(bankParams)
      if (res.code === Config.resCode.success) {
        that.$vux.loading.show({
          text: '正在验证'
        })
        if (that.timer) {
          clearInterval(that.timer)
          that.timer = ''
        }
        that.timer = setInterval(() => {
          that.getBankStatus('check')
        }, 10000)
      } else {
        that.$vux.toast.text(res.msg)
      }
    },
    async onConfirm () {
      let that = this
      const taskId = that.taskId
      if (that.curPage === 0) {
        that.checkBankMobileCode()
      } else if (that.curPage === 1) {
        const serviceCode = that.serviceCode
        if (!serviceCode) return that.$vux.toast.text(Config.constants.nullServiceCode)
        const taskParams = {
          taskId: taskId,
          verifyCode: serviceCode
        }
        const res = await postMobileCode(taskParams)
        if (res.code === Config.resCode.success) {
          that.$vux.loading.show({
            text: '正在验证'
          })
          const statusParams = {
            taskId: that.taskId,
            account: that.servicePhone
          }
          if (that.timer) {
            clearInterval(that.timer)
            that.timer = ''
          }
          that.serviceCode = ''
          that.timer = setInterval(() => {
            getTaskStatus(statusParams).then(res => {
              if (res.data.phase_status === 'WAIT_CODE') {
                that.$vux.loading.hide()
                clearInterval(that.timer)
                that.timer = ''
                that.$vux.toast.text(res.data.description)
              } else if (res.data.phase_status === 'DOING' && res.data.phase === 'RECEIVE') {
                that.$vux.loading.hide()
                clearInterval(that.timer)
                that.$vux.toast.text('保存成功')
                setTimeout(() => {
                  that.$router.push(Config.constants.personalRouter)
                }, 2000)
              } else if (res.data.phase_status === 'DONE_FAIL') {
                that.$vux.loading.hide()
                clearInterval(that.timer)
                that.showConfirm = false
                that.$vux.toast.text(res.data.description)
              }
            })
          }, 10000)
        } else {
          that.$vux.toast.text(res.msg)
        }
      }
    },
    async nextStep () {
      let that = this
      const servicePhone = that.servicePhone
      if (!servicePhone) return that.$vux.toast.text(Config.constants.nullPhone)
      if (!Utils.isTelephone(servicePhone)) return that.$vux.toast.text(Config.constants.errorMobile)
      const servicePsw = that.servicePsw
      if (!servicePsw) return that.$vux.toast.text(Config.constants.nullServicePsw)
      const taskParams = {
        account: Utils.clearSpecChars(servicePhone),
        password: servicePsw
      }
      const res = await postTaskMobile(taskParams)
      if (res.code === Config.resCode.success) {
        that.$vux.loading.show({
          text: '正在进行账号密码确认'
        })
        that.taskId = res.data.task_id
        that.computedTime = 60
        const statusParams = {
          taskId: that.taskId,
          account: servicePhone
        }
        if (that.timer) {
          clearInterval(that.timer)
          that.timer = ''
        }
        that.timer = setInterval(() => {
          getTaskStatus(statusParams).then(res => {
            if (res.data.phase_status === 'WAIT_CODE') {
              that.$vux.loading.hide()
              clearInterval(that.timer)
              that.timer = ''
              that.showConfirm = true
            } else if (res.data.phase_status === 'DONE_FAIL') {
              that.$vux.loading.hide()
              clearInterval(that.timer)
              that.timer = ''
              that.$vux.toast.text(res.data.description)
            }
          })
        }, 5000)
      } else {
        that.$vux.toast.text(res.msg)
      }
    }
  }
}
</script>

<style lang="less">
  .product-mention{
    position: relative;
    width: 10.8rem;
    background-color: #fff;
    margin: 0 auto;
    height: 100%;
    overflow: hidden;
    .more-tips{
      width: 10.8rem;
      height: 1.04rem;
      background: #f2f9ff;
      line-height: 1.04rem;
      color: #218beb;
      padding-left: 1.36rem;
      position: relative;
    }
    .more-tips::before{
      content: "";
      position: absolute;
      width: .48rem;
      height: .48rem;
      background: url(../../assets/icon_prompt.png) no-repeat;
      background-size: cover;
      top: .22rem;
      left: .64rem;
    }
    .card-title {
      display: none;
    }
    .vux-tab-item {
      background: #fff!important;
    }
    .vux-swiper {
      height: 400px!important;
    }
    .apply-ul {
      position: relative;
      width: 100%;
      height: auto;
      background-color: #fff;
      overflow: hidden;
      padding-top: .5rem;
    }
    .apply-detail-content {
      position: relative;
      width: 100%;
      display: flex;
    }
    .apply-detail-item {
      // width: 2.3rem;
      flex: 0 0 3rem;
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
      text-indent: .96rem;
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
    .confirm-authorize {
      padding-top: .3rem;
      background-color: #fafafa;
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
    .vux-popup-picker-placeholder {
      color: #777;
    }
    .weui-label {
      color: #333;
    }
    .vux-popup-picker-value {
      display: inline-block;
      width: 6rem;
      height: 50px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .vux-tab-item.vux-tab-selected {
      color: #333!important;
      border: none;
    }
    .weui-dialog {
      .tip-p {
        text-align: left;
      }
    }
    .mode-container {
      background: rgba(0, 0, 0, 0.6);
      width: 100%;
      height: 100%;
      position: fixed;
      top: 0;
      left: 0;
    }
    .mode-ul {
      z-index: 5000;
      width: 80%;
      max-width: 300px;
      top: 50%;
      left: 50%;
      -webkit-transform: translate(-50%, -50%);
      transform: translate(-50%, -50%);
      background-color: #FFFFFF;
      text-align: center;
      border-radius: 3px;
      overflow: hidden;
    }
    .btn-list {
      margin-top: 50px;
    }
    .mode-concle, .mode-confirm {
      float: left;
      width: 50%;
      height: 40px;
      color: #3CC51F;
      text-decoration: none;
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
      position: relative;
    }
    .view-detail {
      background: url(../../assets/icon_explain.png) no-repeat .48rem center;
      background-size: .4rem .4rem;
    }
    .view-span {
      padding-left: 1rem;
      color: #999;
    }
  }

</style>
