<template>
  <div>
    <div class="apply-loan">
      <ul class="apply-ul">
        <li class='apply-detail-content' v-if="cnameShow">
          <p class='apply-detail-item font-32'>姓名</p>
          <input class='apply-detail-input font-32' type="text" placeholder='必填项' v-model="cname" />
        </li>
        <li class='apply-detail-content' v-if="telephoneShow">
          <p class='apply-detail-item font-32'>手机号码</p>
          <input class='apply-detail-input font-32' type="tel" placeholder='请输入本人实名制手机号码' v-model="telephone" maxlength="11" @blur="inputBlur" />
        </li>
        <li class='apply-detail-content' v-if="educationShow">
          <popup-picker class="font-32" placeholder='必选项' title="学历" value-text-align='left' :data="xlData" :columns="1" @on-hide="(closeType) => onHide(closeType, 'xl')" v-model="xlPicker" show-name></popup-picker>
          <img class="icon-choice" src="../../assets/icon_choice.png"/>
        </li>
        <li class='apply-detail-content' v-if="maritalStatusShow">
          <popup-picker class="font-32" placeholder='必选项' title="婚姻状况" value-text-align='left' :data="hyData" :columns="1" @on-hide="(closeType) => onHide(closeType, 'hy')" v-model="hyPicker" show-name></popup-picker>
          <img class="icon-choice" src="../../assets/icon_choice.png"/>
        </li>
        <li class='apply-detail-content' v-if="applyBalanceShow">
          <p class='apply-detail-item font-32'>申请金额</p>
          <input class='apply-detail-input font-32' type="tel" :placeholder='applyNumText' v-model="applyBalance" @blur="redirectApply" />
          <p class='apply-detail-unit'>元</p>
        </li>
        <li class='apply-detail-content' v-if="repaymentPeriodShow">
          <popup-picker class="font-32" placeholder='必选项' title="还款期数" value-text-align='left' :data="hkqsData" :columns="1" @on-hide="(closeType) => onHide(closeType, 'hkqs')" v-model="hkqsPicker" show-name></popup-picker>
          <img class="icon-choice" src="../../assets/icon_choice.png"/>
        </li>
        <li class='apply-detail-content' v-if="carModelShow" @click="carSelect">
          <p class='apply-detail-item font-32'>所购车型</p>
          <div :class="['apply-detail-div','font-32',!carModel?'color-select':'']">{{carModel || '必选项'}}</div>
          <!-- <input class='apply-detail-input font-32' placeholder='必选项' v-model="carModel" readonly/> -->
          <img class="icon-choice" src="../../assets/icon_choice.png"/>
        </li>
        <li class='apply-detail-content' v-if="carModel && carGuidePriceShow">
          <p class='apply-detail-item font-32'>车辆指导价</p>
          <div :class="['apply-detail-div','font-32','color-selected']">{{carGuidePrice}}</div>
          <!-- <input class='apply-detail-input font-32' v-model="carGuidePrice" readonly/> -->
        </li>
        <li class='apply-detail-content' v-if="loanUseShow">
          <popup-picker class="font-32" placeholder='必选项' title="借款用途" value-text-align='left' :data="loanUseData" :columns="1" @on-hide="(closeType) => onHide(closeType, 'loanUse')" v-model="loanUsePicker" show-name></popup-picker>
          <img class="icon-choice" src="../../assets/icon_choice.png"/>
        </li>
        <li class='apply-detail-content' v-if="monthIncomeShow">
          <p class='apply-detail-item font-32'>月收入</p>
          <input class='apply-detail-input font-32' type="tel" placeholder='1,000-200,000' v-model="monthIncome" :value="monthIncome+1" @blur="inputBlur" />
          <p class='apply-detail-unit'>元</p>
        </li>
        <li class='apply-detail-content' v-if="monthDebtShow">
          <p class='apply-detail-item font-32'>当前月还贷金额</p>
          <input class='apply-detail-input font-32' type="tel" placeholder='0-500,000' v-model="monthDebt" @blur="inputBlur" />
          <p class='apply-detail-unit'>元</p>
        </li>
        <li class='apply-detail-note' v-if="monthDebtShow">注：指当前已有贷款每月应还款金额</li>
        <li class='apply-detail-content' v-if="creditcardSumamtShow">
          <p class='apply-detail-item font-32'>信用卡汇总额度</p>
          <input class='apply-detail-input font-32' type="tel" placeholder='0-10,000,000' v-model="creditcardSumamt" @blur="inputBlur" />
          <p class='apply-detail-unit'>元</p>
        </li>
        <!-- <li class='apply-detail-content' v-if="city != 'nj'">
          <popup-picker class="font-32" placeholder='必选项' title="单位性质" value-text-align='left' :data="dwxzData" :columns="1" @on-hide="(closeType) => onHide(closeType, 'dwxz')" v-model="dwxzPicker" show-name></popup-picker>
          <img class="icon-choice" src="../../assets/icon_choice.png"/>
        </li> -->
        <li class='apply-detail-content' v-if="belongIndustryShow">
          <popup-picker class="font-32" placeholder='必选项' title="所属行业" value-text-align='left' :data="sshyData" :columns="1" @on-hide="(closeType) => onHide(closeType, 'sshy')" v-model="sshyPicker" show-name></popup-picker>
          <img class="icon-choice" src="../../assets/icon_choice.png"/>
        </li>
        <!-- <li class='apply-detail-content' v-if="city != 'nj'">
          <popup-picker class="font-32" placeholder='必选项' title="职务" value-text-align='left' :data="zwData" :columns="1" @on-hide="(closeType) => onHide(closeType, 'zw')" v-model="zwPicker" show-name></popup-picker>
          <img class="icon-choice" src="../../assets/icon_choice.png"/>
        </li> -->
        <!-- todo 等后端接口，添加个动画 -->
        <li class='apply-detail-content' v-if="branchCodeShow">
          <popup-picker class="font-32" placeholder='必选项' title="选择网点" value-text-align='left' :data="branchWebsites" :columns="1" @on-hide="(closeType) => onHide(closeType, null, 'branchCode', 'branchWebsites')" v-model="branchCode" show-name></popup-picker>
          <img class="icon-choice" src="../../assets/icon_choice.png"/>
        </li>
        <li class='apply-detail-content' v-if="websiteDetail">
          <p class='detail-item font-32'>
            <span class="detail-item-title">{{bankDotDetail}}</span>
            <span class="detail-item-map" @click="showBankDot">查看地图</span>
            </p>
        </li>
        <li class='apply-detail-content' v-if="provinceRegionShow">
          <popup-picker class="font-32" placeholder='必选项' title="居住地址" value-text-align='left' :data="ssqData" :columns="1" @on-show="onShow" @on-hide="(closeType) => onHide(closeType, 'ssq')" v-model="ssqPicker" show-name></popup-picker>
          <img class="icon-choice" src="../../assets/icon_choice.png"/>
        </li>
        <!-- <li class='apply-detail-note' v-if="city == 'nj' && provinceRegionShow">注：居住地址必须为内蒙古包头区域</li> -->
        <li class='apply-detail-note' v-if="provinceRegionShow">注：居住地址必须为{{addressText}}</li>
        <li class='apply-detail-content' v-if="homeAddrShow">
          <input class='apply-detail-text font-32' type="text" placeholder='详细地址' v-model="loanAddress" @blur="inputBlur" >
        </li>
        <li class='apply-detail-content' v-if="postCodeShow">
          <p class='apply-detail-item font-32'>邮编</p>
          <input class='apply-detail-input font-32' type="tel" placeholder=必填项 v-model="postCode" maxlength="11" @blur="inputBlur" />
        </li>
        <!-- <li class='apply-detail-content font-32' v-if="type !== '5'" v-show="!isPhoneAuth">
          <p class='apply-detail-item font-32'>验证码</p>
          <input class='apply-detail-input font-32' type="tel" placeholder='输入验证码' v-model="verifyCode" maxlength="6" />
          <p v-show="!computedTime" @click.prevent='getVerifyCode' class='apply-detail-verify font-28'>{{codeText}}</p>
          <p v-show="computedTime" @click.prevent class='apply-detail-verify font-28'>{{codeText}}</p>
        </li> -->
      </ul>
      <div class="content-container font-32">
        <Popover type='authorize' v-if="authorizeShow && authorizeTip">请先阅读并同意协议</Popover>
        <div class="content-left ipieces-item" :class="{ 'ipieces-item-selected' : checkAuthorize }" @click.prevent='selectAuthorize'>
          我已阅读并同意
        </div>
        <ul class="content-right">
          <li @click="contractDetail('auth')" v-if="showAuth">《个人授权协议》</li>
          <li @click="contractDetail('privacy')">《用户隐私协议》</li>
        </ul>
      </div>
      <v-button @next='nextStep' class="base-btn">下一步</v-button>
    </div>
    <div v-transfer-dom>
      <x-dialog class="map-dialog" v-model="showMap" hide-on-blur :dialog-style="{width: '80%', height: '60%'}">
        <img @click.prevent="showMap = false" class="map-close" src="../../assets/map_close_default.png" alt="map-close" />
        <div id="allmap" class="bank-dot-map"></div>
      </x-dialog>
    </div>
    <div v-transfer-dom>
      <x-dialog class="verify-code-dialog" v-model="showVerifyCode" hide-on-blur :dialog-style="{width: '8.8rem', height: '5.84rem'}">
        <div class="verify-code-title">
          输入手机验证码
          <!-- <img class="verify-code-close" @click.prevent="showVerifyCode=false" src='../../assets/verify-code-close.png' alt='close' /> -->
        </div>
        <div class="verify-code-content">
          <p class="verify-code-phone">{{computedTime ? `已发送至${telephone}` : ''}}</p>
          <p class="verify-code-send" v-show="!computedTime" @click.prevent='getVerifyCode'>重新发送</p>
          <p class="verify-code-sended" v-show="computedTime">重新发送（{{computedTime}}s）</p>
        </div>
        <label class="verify-code-input" for="verify-code-enter">
          <span class="verify-code-num" v-for="(item, index) in Array.from(verifyCodeArr, (item, index) => verifyCode[index])" :key='index'>{{item}}</span>
          <input id="verify-code-enter" class="verify-code-enter" type="tel" v-model="verifyCode" maxlength="6" @blur="inputBlur" />
        </label >
        <div class="verify-code-operate">
          <span class="verify-code-cancel" @click.prevent="showVerifyCode=false">取消</span>
          <span class="verify-code-confirm" @click.prevent="submit">确定</span>
        </div>
      </x-dialog>
    </div>
    <div v-transfer-dom>
      <x-dialog class="verify-code-dialog" v-model="showPicVerifyCode" hide-on-blur :dialog-style="{width: '8.8rem', height: '5.84rem'}">
        <div class="verify-code-title">
          输入图形验证码
        </div>
        <div class="verify-pic-content">
          <input class="verify-pic-input" placeholder="输入图形验证码" v-model="captchaCode" />
          <img v-if="picVerifyImg" @click="getPicVerifyImg()" class="verify-pic" :src="picVerifyImg">
        </div>
        <div class="verify-code-operate">
          <span class="verify-code-cancel" @click.prevent="showPicVerifyCode=false">取消</span>
          <span class="verify-code-confirm" @click.prevent="submit">确定</span>
        </div>
      </x-dialog>
    </div>
    <!-- <div v-transfer-dom>
      <div class="car-select" v-show="carSelectShow">
        <car-select :carData="carData&&carData.length>0&&carData" @back='back' @carSystemSelect='carSystemSelects'/>
      </div>
    </div> -->
  </div>
</template>

<script>
import Store from 'store'
import VButton from './../../components/button'
// import carSelect from './../../components/carSelect'
import Config from '../../config/index'
import Utils from '../../config/utils'
import Popover from '../../components/popover'
import { sendVerifyCode, loanCustomer, getDictValueAll, getLoanCustomer } from '../../service/getData'
import { getSSQ, getPostCode } from '../../service/citizen.js'
import { getDictCustom } from '../../service/common.js'
import { PopupPicker, Group, XDialog, TransferDomDirective as TransferDom } from 'vux'
export default {
  directives: {
    TransferDom
  },
  components: {
    VButton,
    PopupPicker,
    Group,
    XDialog,
    Popover
    // carSelect,
  },
  props: ['city'],
  data () {
    return {
      cnameShow: true,
      telephoneShow: true,
      educationShow: true,
      maritalStatusShow: true,
      applyBalanceShow: true,
      loanUseShow: true,
      repaymentPeriodShow: false,  // 还款期数
      carModelShow: false, // 车型
      carGuidePriceShow: false, // 车辆指导价
      monthIncomeShow: true,
      monthDebtShow: true,
      creditcardSumamtShow: true,
      belongIndustryShow: true,
      branchCodeShow: true,
      provinceRegionShow: true,
      postCodeShow: true,
      homeAddrShow: true,
      authorizeShow: true,
      telephoneAuthShow: true,
      picVerifyAuthShow: false,
      showPicVerifyCode: false,
      showConfirm: false,
      isSave: false,
      fromPhone: Utils.getQueryParams('phone') && decodeURIComponent(escape(window.atob(Utils.getQueryParams('phone')))),
      codeText: '获取验证码',
      cname: '',
      telephone: Utils.getQueryParams('phone') && decodeURIComponent(escape(window.atob(Utils.getQueryParams('phone')))),
      computedTime: 0, // 倒数记时
      verifyCode: '',
      monthIncome: '',
      monthDebt: '',
      creditcardSumamt: '',
      loanUseData: [],
      hkqsData: [],
      loanUsePicker: [],
      hkqsPicker: [],
      xlData: [],
      xlPicker: [],
      hyData: [],
      hyPicker: [],
      dwxzData: [],
      // dwxzPicker: [],
      sshyData: [],
      sshyPicker: [],
      zwData: [],
      // zwPicker: [],
      ssqData: [],
      ssqPicker: [],
      branchCode: [],
      branchWebsites: [],
      verifyCodeArr: ['', '', '', '', '', ''],
      postCode: '',
      applyBalance: '',
      checkAuthorize: true,
      authorizeTip: false,
      loanAddress: '',
      loanCode: '',
      loanRoutes: [],
      pathIndex: '',
      onOff: false,
      map: '',      // 地图
      myGeo: '',
      showMap: false,
      env: Utils.getReferer(),
      // bankDotDetail: '山西省潞城市中华大街潞城农商银行兴隆支行',
      showVerifyCode: false,
      type: this.$route.params.type,
      confirmSwitch: false,
      showAuth: JSON.parse(sessionStorage.getItem(Config.constants.contractProductAuth)),
      getTime: new Date().getTime(),   // 时长统计
      addressText: '山西省长治区域',
      applyNumText: '10万以下贷款“秒”批',
      captchaCode: '',
      picVerifyImg: '',
      carModel: '',
      carGuidePrice: '',
      getCarInfoAjax: false // 是否获取车辆信息
    }
  },
  mounted () {
    const that = this
    // 监听刷新，可能存在兼容性问题，待测试
    window.addEventListener('unload', (e) => {
      that.saveBase && that.saveBase('localStorage')
    })
    // 解决ios，android不回到顶部
    document.body.scrollTop = 0
    document.documentElement.scrollTop = 0
    window.scrollTop = 0
    const cookies = Store.get(Config.constants.cookies)
    that.loanCode = cookies.loanCode
    that.loanRoutes = cookies.loanRoutes
    that.pathIndex = Utils.getIndex(that.loanRoutes, window.location.pathname)
    if (!that.loanCode) return
    that.getDict()
    that.getSsq()
    // if (that.getCarInfoAjax) that.getCarInfo()
    that.getDictCustom()
    that.getLoanCustomer()
    Utils.countPlus('基本信息', 'send')
    that.$nextTick(
      that.createMap(window.BMap)
    )
  },
  computed: {
    // 是否查看地图
    websiteDetail () {
      if (this.branchCode && this.branchCode.length) return true
      return false
    },
    // 地图地址
    bankDotDetail () {
      if (this.websiteDetail && this.branchWebsites.length) {
        return this.branchWebsites.filter(i => i.code === this.branchCode[0])[0].bankAddress
      } else {
        return ''
      }
    },
    isPhoneAuth () { // true 不用验证 false 要验证 是否开启验证码
      return this.fromPhone && this.telephone === this.fromPhone
    }
  },
  destroyed () {
    this.saveBase('localStorage')
    if (this.timer) clearInterval(this.timer)
    if (!this.isSave) sessionStorage.removeItem('citizen_base')
    // window.onbeforeunload = ''
  },
  methods: {
    carSelect () {
      const that = this
      this.isSave = true
      that.saveBase('sessionStorage')
      this.$router.push(`${Config.constants.carSelectRouter}?code=${this.loanCode}`)
    },
    // IOS 12 底部空白 BUG
    inputBlur () {
      if (Utils.isIOSWeChat()) {
        setTimeout(function () {
          let currentPosition = document.documentElement.scrollTop || document.body.scrollTop
          currentPosition -= 1
          window.scrollTo(0, currentPosition) // 页面向上滚动
          currentPosition += 1
          window.scrollTo(0, currentPosition) // 页面向下滚动
        }, 100)
      }
    },
    // 跳转至潞盈微贷，以后提取出
    redirectApply () {
      let that = this
      that.inputBlur()
      if (that.confirmSwitch) return
      if (this.applyBalance > 100000) {
        that.confirmSwitch = true
        // 加定时器防止与click冲突
        setTimeout(() => {
          this.$vux.confirm.show({
            content: '您的申请金额已超出10万元，请前往申请“潞盈微贷”产品',
            confirmText: '我要前往',
            // 组件除show外的属性
            onCancel () {
              that.confirmSwitch = false
            },
            onConfirm () {
              that.confirmSwitch = false
              window.location.replace('https://www.lcnsyhwd.com/micro/loan/mobileApplyLoan.html?autoLogin=true')
            },
            closeOnConfirm: false
          })
        }, 300)
      }
    },
    selectAuthorize () {
      this.checkAuthorize = !this.checkAuthorize
      if (this.checkAuthorize) this.authorizeTip = false
    },
    contractDetail (type) {
      const that = this
      this.isSave = true
      that.saveBase('sessionStorage')
      that.$router.push(`${Config.constants.contractRouter}?type=${type}`)
    },
    // 创建地图
    createMap (BMap) {
      // const that = this
      this.map = new BMap.Map('allmap')
      // let point = new BMap.Point(120.127401, 30.288469)
      // this.map.centerAndZoom(point, 12)
      this.map.enableScrollWheelZoom(true)
      // 2D图，卫星图
      this.map.addControl(new BMap.MapTypeControl({mapTypes: [window.BMAP_NORMAL_MAP, window.BMAP_HYBRID_MAP]}))
      // 左上角，默认地图控件
      // this.map.addControl(new BMap.MapTypeControl({anchor: window.BMAP_ANCHOR_TOP_LEFT}))
      // 添加默认缩略地图控件
      // map.addControl(new BMap.OverviewMapControl())
      // 禁止双指缩放
      this.map.disablePinchToZoom()
      // 左上角，添加默认缩放平移控件
      this.map.addControl(new BMap.NavigationControl())
      this.myGeo = new BMap.Geocoder()
    },
    // 定位到网点
    showBankDot () {
      const that = this
      let BMap = window.BMap
      this.showMap = true
      this.myGeo.getPoint(that.bankDotDetail, function (point) {
        if (point) {
          that.map.centerAndZoom(point, 16)
          that.map.addOverlay(new BMap.Marker(point))
        } else {
          // todo未定位到情况
          // 处理1：定位到默认地点 处理2：显示无定位
          console.log('您选择地址没有解析到结果!')
        }
      }, '')
    },
    saveBase (type) {
      let that = this
      let cookies = {
        cname: that.cname,
        carModel: that.carModel,
        carGuidePrice: that.carGuidePrice,
        telephone: that.telephone,
        verifyCode: that.verifyCode,
        applyBalance: that.applyBalance,
        loanUsePicker: that.loanUsePicker,
        monthIncome: that.monthIncome,
        monthDebt: that.monthDebt,
        creditcardSumamt: that.creditcardSumamt,
        xlPicker: that.xlPicker,
        hyPicker: that.hyPicker,
        hkqsPicker: that.hkqsPicker,
        // dwxzPicker: that.dwxzPicker,
        sshyPicker: that.sshyPicker,
        ssqPicker: that.ssqPicker,
        // zwPicker: that.zwPicker,
        postCode: that.postCode,
        loanAddress: that.loanAddress,
        branchCode: that.branchCode
      }
      if (type === 'sessionStorage') {
        // 协议跳转缓存
        sessionStorage.setItem('citizen_base', JSON.stringify(cookies))
      } else {
        // 未完成进件缓存，完成时删除
        delete cookies.verifyCode
        // 添加时间戳，便于删除
        cookies.timeStamp = new Date().getTime()
        Store.set(Config.constants.citizenFirstStep(), cookies)
      }
    },
    // 点开默认选中第一行第一列
    onShow () {
      // if (this.ssqPicker.length === 0) {
      //   this.ssqPicker = [this.ssqData[0].value, this.ssqData[1].value, this.ssqData[1].value === this.ssqData[2].parent ? this.ssqData[2].value : null]
      //   return
      // }
    },
    onHide (closeType, pick, pickerName, pickerData) {
      this.$nextTick(() => {
        // 点击完成进入
        if (!closeType) return
        // 不同默认命名方式的选择
        if (pickerName) {
          if (this[`${pickerName}`].length === 0) this[pickerName] = [this[pickerData][0].value]
          return
        }
        // 省市区特殊处理
        if (pick === 'ssq') {
          // 考虑存在省市，不存在区的情况
          if (this[`${pick}Picker`].length === 0) this[`${pick}Picker`] = [this[`${pick}Data`][0].value, this[`${pick}Data`][1].value, this[`${pick}Data`][1].value === this[`${pick}Data`][2].parent ? this[`${pick}Data`][2].value : null]
          // 选中不显示全的问题 todo
          // if (this[`${pick}Picker`].length !== 3) {
          let districtValue = this[`${pick}Picker`].slice(-1)[0]
          let cityValue = this[`${pick}Data`].filter(i => i.value === districtValue + '')[0].parent
          let provinceValue = this[`${pick}Data`].filter(i => i.value === cityValue + '')[0].parent
          this[`${pick}Picker`] = [provinceValue, cityValue, districtValue]
          this.requestPostCode(cityValue)
          // }
          return
        }
        // 默认选择
        if (this[`${pick}Picker`].length === 0) this[`${pick}Picker`] = [this[`${pick}Data`][0].value]
      })
    },
    async requestPostCode (cityValue) {
      let res = await getPostCode(cityValue)
      this.postCode = res.data
    },
    async getLoanCustomer () {
      let that = this
      let res = await getLoanCustomer({code: this.loanCode, style: null})
      if (+res.code === 0) {
        // if (!res.data || sessionStorage.getItem('citizen_base')) return
        that.cname = res.data.handInputName
        that.carModel = res.data.carModel
        that.carGuidePrice = res.data.carGuidePrice
        that.telephone = that.isPhoneAuth ? that.telephone : res.data.telephone
        that.applyBalance = res.data.applyBalance
        that.loanUsePicker = res.data.loanUse && [res.data.loanUse && res.data.loanUse.toString()] || []
        that.hkqsPicker = res.data.repaymentPeriod && [res.data.repaymentPeriod && res.data.repaymentPeriod.toString()] || []
        that.monthIncome = res.data.monthIncome
        that.monthDebt = res.data.monthDebt
        that.creditcardSumamt = res.data.creditcardSumamt
        that.xlPicker = res.data.education && [res.data.education] || []
        that.hyPicker = res.data.maritalStatus && [res.data.maritalStatus] || []
        // that.dwxzPicker = res.data.orgType && [res.data.orgType] || []
        that.sshyPicker = res.data.belongIndustry && [res.data.belongIndustry] || []
        that.ssqPicker = res.data.provinceRegion && res.data.provinceRegion.split('/') || that.ssqPicker
        // that.zwPicker = res.data.jobTitle && [res.data.jobTitle] || []
        // that.postCode = res.data.postCode
        that.loanAddress = res.data.homeAddr
        that.branchCode = res.data.branchCode && [res.data.branchCode] || []
        that.branchWebsites = Array.from(res.data.branchWebsites, item => { item.name = item.bankName; item.value = item.code; return item })
        // 如果存在缓存就使用缓存数据
        let loanCookies = JSON.parse(sessionStorage.getItem('citizen_base'))
        // 不存在的时候查看是否存在未完成进件数据
        if (!loanCookies) {
          loanCookies = Store.get(Config.constants.citizenFirstStep())
          let clearTime = 24 * 3 * 60 * 60 * 1000
          if (that.env === 'test') clearTime = 10 * 60 * 1000
          if (that.env === 'pre') clearTime = 20 * 60 * 1000
          // 测开发10分钟，预发20分钟，生产3天，超过时间删除
          if ((new Date().getTime() - loanCookies && loanCookies.timeStamp || 0) > clearTime) {
            loanCookies = null
            Store.remove(Config.constants.citizenFirstStep())
          }
        }
        if (loanCookies) {
          that.cname = loanCookies.cname || that.cname
          that.carModel = loanCookies.carModel || that.carModel
          that.carGuidePrice = loanCookies.carGuidePrice || that.carGuidePrice
          that.telephone = that.isPhoneAuth ? that.telephone : loanCookies.telephone || that.telephone
          that.applyBalance = loanCookies.applyBalance || that.applyBalance
          that.loanUsePicker = loanCookies.loanUsePicker || that.loanUsePicker
          that.monthIncome = loanCookies.monthIncome || that.monthIncome
          that.monthDebt = loanCookies.monthDebt || that.monthDebt
          that.creditcardSumamt = loanCookies.creditcardSumamt || that.creditcardSumamt
          that.xlPicker = loanCookies.xlPicker || that.xlPicker
          that.hyPicker = loanCookies.hyPicker || that.hyPicker
          that.hkqsPicker = loanCookies.hkqsPicker || that.hkqsPicker
          // that.dwxzPicker = loanCookies.dwxzPicker || that.dwxzPicker
          that.sshyPicker = loanCookies.sshyPicker || that.sshyPicker
          that.ssqPicker = loanCookies.ssqPicker || that.ssqPicker
          // that.zwPicker = loanCookies.zwPicker || that.zwPicker
          that.postCode = loanCookies.postCode || that.postCode
          that.loanAddress = loanCookies.loanAddress || that.loanAddress
          that.branchCode = loanCookies.branchCode || that.branchCode
        }
      } else {
        alert(res.msg)
      }
    },
    async getDict () {
      let dic = getDictValueAll({code: 'education,hyzk,smdjkyt,smddwxz,smdsshy,smdzw,ssq'})
      let res = await dic
      if (+res.code === 0) {
        this.xlData = Array.from(res.data.education, item => { item.name = item.ddText; item.value = item.ddValue; return item })
        this.hyData = Array.from(res.data.hyzk, item => { item.name = item.ddText; item.value = item.ddValue; return item })
        // this.loanUseData = Array.from(res.data.smdjkyt, item => { item.name = item.ddText; item.value = item.ddValue; return item })
        this.dwxzData = Array.from(res.data.smddwxz, item => { item.name = item.ddText; item.value = item.ddValue; return item })
        // this.sshyData = Array.from(res.data.smdsshy, item => { item.name = item.ddText; item.value = item.ddValue; return item })
        this.zwData = Array.from(res.data.smdzw, item => { item.name = item.ddText; item.value = item.ddValue; return item })
        // this.ssqData = Utils.getPickerList(res.data.ssq)
      } else {
        alert(res.msg)
      }
    },
    async getDictCustom () {
      let cookies = Store.get(Config.constants.cookies)
      let res = await getDictCustom({ddItem: 'smdsshy,smdjkyt,hkqs', prdType: cookies.prdType, enterpriseCode: cookies.enterpriseCode})
      this.sshyData = Array.from(res.data.smdsshy, item => { item.name = item.ddText; item.value = item.ddValue; return item })
      this.loanUseData = Array.from(res.data.smdjkyt, item => { item.name = item.ddText; item.value = item.ddValue; return item })
      this.hkqsData = Array.from(res.data.hkqs, item => { item.name = item.ddText; item.value = item.ddValue; return item })
    },
    // TODO: 定义删除
    async getSsq () {
      let ssq
      // TODO: DELETE
      if (this.city === 'nj') {
        ssq = getSSQ({code: this.loanCode}, this.city)
      } else {
        ssq = getSSQ({code: this.loanCode})
      }
      let res = await ssq
      if (+res.code === 0) {
        this.ssqData = Utils.getPickerList(res.data)
      } else {
        alert(res.msg)
      }
    },
    cnameVerify () {
      const that = this
      if (that.cnameShow) {
        const cname = that.cname
        if (!cname) {
          that.$vux.toast.text(Config.constants.nullCname)
          return true
        }
        if (cname.length < 2) {
          that.$vux.toast.text(Config.constants.nameLengthShort)
          return true
        }
      }
      return false
    },
    telephoneVerify () {
      const that = this
      if (that.telephoneShow) {
        const telephone = that.telephone
        if (!telephone) {
          that.$vux.toast.text(Config.constants.nullTelephone)
          return true
        }
        if (!Utils.isTelephone(telephone)) {
          that.$vux.toast.show({
            type: 'text',
            text: Config.constants.errorMobile,
            width: '6.5rem',
            isShowMask: true
          })
          return true
        }
      }
      return false
    },
    educationVerify () {
      const that = this
      if (that.educationShow) {
        const xlPicker = that.xlPicker[0]
        if (!xlPicker) {
          that.$vux.toast.text(Config.constants.nullEducation)
          return true
        }
      }
      return false
    },
    maritalStatusVerify () {
      const that = this
      if (that.maritalStatusShow) {
        const hyPicker = that.hyPicker[0]
        if (!hyPicker) {
          that.$vux.toast.text(Config.constants.nullMarital)
          return true
        }
      }
      return false
    },
    repaymentPeriodVerify () {
      const that = this
      if (that.repaymentPeriodShow) {
        const hkqsPicker = that.hkqsPicker[0]
        if (!hkqsPicker) {
          that.$vux.toast.text(Config.constants.nullrepaymentPeriod)
          return true
        }
      }
      return false
    },
    applyBalanceVerify () {
      const that = this
      if (that.applyBalanceShow) {
        const applyBalance = that.applyBalance
        if (!applyBalance) {
          that.$vux.toast.text(Config.constants.nullLoanAmount)
          return true
        }
        if (!(this.applyBalance >= 5000 && this.applyBalance <= 100000)) {
          this.$vux.toast.text(Config.constants.loanAmountRange)
          return true
        }
        if (this.applyBalance > 100000) {
          that.confirmSwitch = true
          // 加定时器防止与click冲突
          setTimeout(() => {
            this.$vux.confirm.show({
              content: '您的申请金额已超出10万元，请前往申请“潞盈微贷”产品',
              confirmText: '我要前往',
              // 组件除show外的属性
              onCancel () {
                that.confirmSwitch = false
              },
              onConfirm () {
                that.confirmSwitch = false
                window.location.replace('https://www.lcnsyhwd.com/micro/loan/mobileApplyLoan.html?autoLogin=true')
              },
              closeOnConfirm: false
            })
          }, 300)
          return true
        }
      }
      return false
    },
    loanUseVerify () {
      const that = this
      if (that.loanUseShow) {
        const loanUsePicker = that.loanUsePicker[0]
        if (!loanUsePicker) {
          that.$vux.toast.text(Config.constants.nullLoanUse)
          return true
        }
      }
      return false
    },
    monthIncomeVerify () {
      const that = this
      if (that.monthIncomeShow) {
        const monthIncome = that.monthIncome
        if (!monthIncome) {
          that.$vux.toast.text(Config.constants.nullMonthIncome)
          return true
        }
        if (!(monthIncome >= 1000 && monthIncome <= 200000)) {
          that.$vux.toast.text(Config.constants.monthIncomeRange)
          return true
        }
      }
      return false
    },
    monthDebtVerify () {
      const that = this
      if (that.monthDebtShow) {
        const monthDebt = that.monthDebt
        if (!monthDebt) {
          that.$vux.toast.text(Config.constants.nullMonthDebt)
          return true
        }
        if (!(monthDebt >= 0 && monthDebt <= 500000)) {
          that.$vux.toast.text(Config.constants.monthDebtRange)
          return true
        }
      }
      return false
    },
    creditcardSumamtVerify () {
      const that = this
      if (that.creditcardSumamtShow) {
        const creditcardSumamt = that.creditcardSumamt
        if (!creditcardSumamt) {
          that.$vux.toast.text(Config.constants.nullCreditcardSumamt)
          return true
        }
        if (!(creditcardSumamt >= 0 && creditcardSumamt <= 10000000)) {
          that.$vux.toast.text(Config.constants.CreditcardSumamtRange)
          return true
        }
      }
      return false
    },
    belongIndustryVerify () {
      const that = this
      if (that.belongIndustryShow) {
        const sshyPicker = that.sshyPicker[0]
        if (!sshyPicker) {
          that.$vux.toast.text(Config.constants.nullSshyPicker)
          return true
        }
      }
      return false
    },
    branchCodeVerify () {
      const that = this
      if (that.branchCodeShow) {
        const branchCode = that.branchCode[0]
        if (!branchCode) {
          that.$vux.toast.text(Config.constants.nullBranchWebsite)
          return true
        }
      }
      return false
    },
    provinceRegionVerify () {
      const that = this
      if (that.provinceRegionShow) {
        const ssqPicker = that.ssqPicker.join('/')
        if (!ssqPicker) {
          that.$vux.toast.text(Config.constants.nullSsqPicker)
          return true
        }
      }
      return false
    },
    homeAddrVerify () {
      const that = this
      if (that.homeAddrShow) {
        if (!that.loanAddress) {
          that.$vux.toast.text(Config.constants.nullLoanAddress)
          return true
        }
      }
      return false
    },
    carSelectVerify () {
      const that = this
      if (that.carModelShow) {
        if (!that.carModel) {
          that.$vux.toast.text(Config.constants.nullLoanCar)
          return true
        }
      }
      return false
    },
    async nextStep () {
      const that = this
      if (!this.checkAuthorize) {
        if (this.authorizeShow) {
          this.authorizeTip = true
        } else {
          this.$vux.toast.text('未选择授权无法进行下一步操作，请确认')
        }
        return
      }
      if (that.cnameVerify()) return
      if (that.telephoneVerify()) return
      if (that.educationVerify()) return
      if (that.maritalStatusVerify()) return
      if (that.repaymentPeriodVerify()) return
      if (that.applyBalanceVerify()) return
      if (that.loanUseVerify()) return
      if (that.monthIncomeVerify()) return
      if (that.monthDebtVerify()) return
      if (that.creditcardSumamtVerify()) return
      if (that.belongIndustryVerify()) return
      if (that.branchCodeVerify()) return
      if (that.provinceRegionVerify()) return
      if (that.homeAddrVerify()) return
      if (that.carSelectVerify()) return
      // const verifyCode = that.verifyCode
      // if (!that.isPhoneAuth && !verifyCode) return that.$vux.toast.text(Config.constants.nullVerifyCode)
      // const dwxzPicker = that.dwxzPicker[0]
      // if (!dwxzPicker) return that.$vux.toast.text(Config.constants.nullDwxzPicker)
      // const zwPicker = that.zwPicker[0]
      // if (!zwPicker) return that.$vux.toast.text(Config.constants.nullZwPicker)
      // 获取验证码，从领取额度过来未改手机号可以直接进入下一步
      if (!that.isPhoneAuth && that.telephoneAuthShow) {
        that.getVerifyCode(that.env)
      } else if (that.picVerifyAuthShow) {
        that.getPicVerifyImg()
        that.showPicVerifyCode = true
      } else {
        that.submit()
      }
    },
    async submit () {
      const that = this
      if (!that.isPhoneAuth && !that.verifyCode && that.telephoneAuthShow) return that.$vux.toast.text(Config.constants.nullVerifyCode)
      if (!that.captchaCode && that.picVerifyAuthShow) return that.$vux.toast.text(Config.constants.nullVerifyCode)
      let cookies = Store.get(Config.constants.cookies)
      let customerParams = {
        prdCode: cookies.proCode || '',
        prdType: cookies.prdType || '',
        managerCode: cookies.managerCode || '',
        // cname: that.cname,
        // telephone: Utils.clearSpecChars(that.telephone),
        // verifyCode: that.verifyCode,
        // education: that.xlPicker[0],
        // maritalStatus: that.hyPicker[0],
        reqCode: that.loanCode
        // monthIncome: that.monthIncome,
        // monthDebt: that.monthDebt,
        // creditcardSumamt: that.creditcardSumamt,
        // orgType: that.dwxzPicker[0],
        // belongIndustry: that.sshyPicker[0],
        // jobTitle: that.zwPicker[0],
        // loanUse: that.loanUsePicker[0],
        // applyBalance: that.applyBalance,
        // postCode: that.postCode,
        // provinceRegion: that.ssqPicker.join('/'),
        // homeAddr: that.loanAddress,
        // branchCode: that.branchCode[0]
      }
      if (that.cnameShow) customerParams.cname = that.cname
      if (that.telephoneShow) customerParams.telephone = Utils.clearSpecChars(that.telephone)
      if (that.telephoneAuthShow) customerParams.verifyCode = that.verifyCode
      if (that.educationShow) customerParams.education = that.xlPicker[0]
      if (that.maritalStatusShow) customerParams.maritalStatus = that.hyPicker[0]
      if (that.applyBalanceShow) customerParams.applyBalance = that.applyBalance
      if (that.loanUseShow) customerParams.loanUse = that.loanUsePicker[0]
      if (that.repaymentPeriodShow) customerParams.repaymentPeriod = that.hkqsPicker[0]
      if (that.monthIncomeShow) customerParams.monthIncome = that.monthIncome
      if (that.monthDebtShow) customerParams.monthDebt = that.monthDebt
      if (that.creditcardSumamtShow) customerParams.creditcardSumamt = that.creditcardSumamt
      if (that.belongIndustryShow) customerParams.belongIndustry = that.sshyPicker[0]
      if (that.branchCodeShow) customerParams.branchCode = that.branchCode[0]
      if (that.provinceRegionShow) customerParams.provinceRegion = that.ssqPicker.join('/')
      if (that.postCodeShow) customerParams.postCode = that.postCode
      if (that.homeAddrShow) customerParams.homeAddr = that.loanAddress
      if (that.picVerifyAuthShow) customerParams.captchaCode = that.captchaCode
      if (that.carModel) customerParams.carModel = that.carModel
      if (that.carGuidePrice) customerParams.carGuidePrice = that.carGuidePrice.split('万')[0]
      // 借款人信息录入,经营贷和车抵贷产品入口
      that.$vux.loading.show({
        text: '请稍候...'
      })
      Utils.countPlus({
        'userName': that.telephone
      }, 'register')
      const res = await loanCustomer(customerParams)
      if (res.code === Config.resCode.success) {
        that.saveBase('sessionStorage')
        let loanRoutes = that.loanRoutes
        Utils.countPlus('页面停留时长', 'send', {'pageName': '基本信息', 'stayTime': new Date().getTime() - this.getTime})
        if (that.pathIndex > -1 && that.pathIndex !== loanRoutes.length - 1) {
          // that.isSave = true
          sessionStorage.removeItem('citizen_base')
          that.$router.push(loanRoutes[that.pathIndex + 1])
        } else {
          that.$router.push(Config.constants.confirmRouter)
        }
      } else {
        that.$vux.toast.text(res.msg)
      }
      that.$vux.loading.hide()
    },
    async getVerifyCode (env) { // 获取验证码
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
      if (that.onOff) {
        // 定时器存在的时候打开验证码
        that.showVerifyCode = true
        return false
      }
      that.onOff = true
      // 开发预发第一次验证码不发送
      if (env === 'test' || env === 'pre') {
        // 成功的时候显示验证码
        that.showVerifyCode = true
        // that.$vux.toast.text(Config.constants.sendVerifyCode)
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
      } else {
        // 发送短信验证码
        let res = await sendVerifyCode({telephone: Utils.clearSpecChars(telephone), reqCode: that.loanCode})
        if (res.code === Config.resCode.success) {
          // 成功的时候显示验证码
          that.showVerifyCode = true
          // that.$vux.toast.text(Config.constants.sendVerifyCode)
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
        } else {
          that.$vux.toast.text(res.msg)
          that.onOff = false
        }
      }
    },
    // 获取图形验证码
    getPicVerifyImg () {
      this.picVerifyImg = `${
        Config.target
      }/comm/captcha?width=98&height=40&scene=4&v=${Math.random()}`
    }
  }
}
</script>

<style lang='less'>
.verify-code-dialog {
  .weui-dialog {
    max-width: 10.8rem;
    top: 6.2rem;
  }
  .verify-code-title {
    position: relative;
    font-size: .48rem;
    color: #000;
    height: 1.44rem;
    line-height: 1.44rem;
  }
  .verify-code-close {
    position: absolute;
    right: 0;
    top: 0;
    padding: .52rem .48rem;
    width: .4rem;
    height: .4rem;
  }
  .verify-code-content {
    display: flex;
    line-height: 1.16rem;
    height: 1.16rem;
    color: #999;
    font-size: .36rem;
    .verify-code-phone {
      width: 4.4rem;
    }
    .verify-code-send {
      width: 4.4rem;
      color:#333;
    }
    .verify-code-sended {
      width: 4.4rem;
    }
  }
  .verify-code-input {
    font-size: 0;
    margin: .2rem .6rem 0;
    display: block;
    position: relative;
    .verify-code-num {
      display: inline-block;
      width: 1.2rem;
      height: 1.2rem;
      line-height: 1.2rem;
      font-size: .72rem;
      color: #333;
      border: 1px solid #c5c5c5;
      box-sizing: border-box;
      vertical-align: middle;
    }
    .verify-code-num + .verify-code-num {
      margin-left: .08rem;
    }
    .verify-code-enter {
      position: absolute;
      color: transparent;
      left: 0;
      top: 0;
      bottom: 0;
      width: 1px;
      margin-left: -100%;
      opacity: 0;
    }
  }
  .verify-code-operate {
    margin-top: .4rem;
    height: 1.44rem;
    line-height: 1.44rem;
    font-size: .44rem;
    display: flex;
    .verify-code-cancel {
      color: #666;
      flex: 1;
    }
    .verify-code-confirm {
      color: #369fff;
      flex: 1;
    }
  }
  .verify-pic-content {
    position: relative;
  }
  .verify-pic-input {
    width: 7rem;
    height: 1rem;
    line-height: 1rem;
    font-size: .5rem;
    margin: .76rem 0;
    border: 1px solid #c5c5c5;
    border-radius: 5px;
    padding: 0 5px;
  }
  .verify-pic {
    position: absolute;
    width: 2rem;
    height: 1rem;
    right: .8rem;
    top: .76rem;
  }
}
.map-dialog {
  .weui-dialog {
    overflow: initial;
  }
  .map-close {
    width: .72rem;
    height: .72rem;
    position: absolute;
    right: -.7rem;
    top: -1.2rem;
  }
}
.bank-dot-map {
  width: 100%;
  height: 100%;
}
.anchorBL {
  display: none;
}
.apply-loan {
  position: relative;
  width: 10.8rem;
  background-color: #fafafa;
  margin: 0 auto;
  // height: 100%;
  padding-bottom: 1.6rem;
  box-sizing: border-box;
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
    width: 4rem;
    text-indent: .48rem;
    color: #333;
    height: 1.46rem;
    line-height: 1.46rem;
  }
  .detail-item {
    // text-indent: .48rem;
    padding: 0 .48rem;
    display: flex;
    color: #333;
    // height: 1.46rem;
    line-height: 1rem;
    .detail-item-title {
      display: inline-block;
      width: 7.8rem;
      text-align: justify;
    }
    &-map {
      width: 2.04rem;
      color: #369fff;
      text-align: right;
      height: 1rem;
    }
  }
  .apply-detail-input {
    flex: 1;
    border: none;
    outline: none;
    text-indent: .48rem;
    color: #333;
    min-width: 4rem;
  }
  .apply-detail-div {
    flex: 1;
    padding-left: .48rem;
    padding-right: .48rem;
    color: #333;
    min-width: 4rem;
    line-height: 1rem;
  }
  .color-select{
    line-height: 1.46rem;
    color: #777;
  }
  .color-selected{
     line-height: 1.46rem;
  }
  .apply-detail-note {
    text-indent: .48rem;
    color: #666;
  }
  .apply-detail-verify {
    padding-right: .48rem;
    box-sizing: border-box;
    height: 1.46rem;
    line-height: 1.46rem;
    color: #369fff;
    text-align: right;
  }
  .apply-detail-unit {
    float: right;
    padding-right: .48rem;
    color: #666;
    height: 1.46rem;
    line-height: 1.46rem;
    font-size: .4rem;
  }
  .apply-detail-text {
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
  .icon-choice {
    width: .4rem;
    height: .4rem;
    position: relative;
    top: .5rem;
    right: .48rem;
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
    padding: .48rem 0;
    position: relative;
    // overflow: hidden;
  }
  .content-left {
    float: left;
    text-indent: 1rem;
  }
  .content-right {
    float: left;
    color: #369fff;
  }
  // .belong-industry {
  //   .vux-popup-picker-select {
  //     height: 1.46rem;
  //     overflow: hidden;
  //     text-overflow: ellipsis;
  //     white-space: nowrap;
  //     width: 7rem;
  //   }
  // }
  .base-btn {
    margin-bottom: 1.6rem!important;
  }
  .weui-cell {
    display: flex;
    padding: 0;
    height: 1.46rem;
    line-height: 1.46rem;
  }
  .weui-cell__hd {
    width: 4rem;
    text-indent: .48rem;
    text-align: left;
    color: #333;
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
  // 选择行业超出省略
  .vux-popup-picker-value {
    text-overflow: ellipsis;
    display: inline-block;
    width: 5.6rem;
    overflow: hidden;
    white-space: nowrap;
  }
}
.vux-popup-header {
  user-select: text;
  .vux-popup-header-left, .vux-popup-header-right {
    user-select: text;
  }
}
// .car-select{
//   position: absolute;
//   min-height: 100%;
//   background: #fff;
//   left: 0;
//   top: 0;
//   right: 0;
// }
</style>
