<template>
  <div class="apply-loan">
    <ul class="apply-ul">
      <li class='apply-detail-content'>
        <popup-picker class="font-32" placeholder='必选项' title="学历" value-text-align='left' :data="xlData" :columns="1" v-model="xlPicker" @on-show="onShow" show-name></popup-picker>
        <img class="icon-choice" src="../../assets/icon_choice.png"/>
      </li>
      <li class='apply-detail-content'>
        <popup-picker class="font-32" placeholder='必选项' title="婚姻状况" value-text-align='left' :data="hyData" :columns="1" v-model="hyPicker" @on-show="onShow" show-name></popup-picker>
        <img class="icon-choice" src="../../assets/icon_choice.png"/>
      </li>
      <div v-if="hyPicker[0] === '1'">
        <li class='apply-detail-content'>
          <p class='apply-detail-item font-32'>配偶姓名</p>
          <input class='apply-detail-input font-32' type="text" placeholder='必填项' v-model="cname" />
        </li>
        <li class='apply-detail-content'>
          <p class='apply-detail-item font-32'>配偶身份证号</p>
          <input class='apply-detail-input font-32' type="text" placeholder='必填项' v-model="idCardNumber" />
        </li>
        <li class='apply-detail-content'>
          <p class='apply-detail-item font-32'>配偶联系方式</p>
          <input class='apply-detail-input font-32' type="tel" placeholder='必填项' v-model="telephone" maxlength="11"/>
        </li>
        <li class='apply-detail-content'>
          <p class='apply-detail-item font-32'>配偶月收入</p>
          <input class='apply-detail-input font-32' type="tel" placeholder='1000-200,000' v-model="monthMoney"/>
          <p class='apply-detail-unit'>元</p>
        </li>
        <li class='apply-detail-content'>
          <popup-picker class="font-32" placeholder='必选项' title="配偶单位性质" value-text-align='left' :data="dwxzData" :columns="1" v-model="dwxzPicker" @on-show="onShow" show-name></popup-picker>
          <img class="icon-choice" src="../../assets/icon_choice.png"/>
        </li>
        <li class='apply-detail-content'>
          <popup-picker class="font-32 belong-industry" placeholder='必选项' title="配偶所属行业" value-text-align='left' :data="sshyData" :columns="1" v-model="sshyPicker" @on-show="onShow" show-name></popup-picker>
          <img class="icon-choice" src="../../assets/icon_choice.png"/>
        </li>
        <li class='apply-detail-content'>
          <popup-picker class="font-32" placeholder='请选择' title="配偶职务" value-text-align='left' :data="zwData" :columns="1" v-model="zwPicker" @on-show="onShow" show-name></popup-picker>
          <img class="icon-choice" src="../../assets/icon_choice.png"/>
        </li>
      </div>
    </ul>
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
import { getDictValueAll, getCitizenSpouse, postCitizenSpouse } from '../../service/getData'
import { PopupPicker, Group, Checker, CheckerItem } from 'vux'
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
      xlData: [],
      xlPicker: [],
      hyData: [],
      hyPicker: [],
      idCardNumber: '',
      cname: '',
      telephone: '',
      monthMoney: '',
      dwxzData: [],
      dwxzPicker: [],
      sshyData: [],
      sshyPicker: [],
      zwData: [],
      zwPicker: [],
      loanRoutes: [],
      pathIndex: '',
      onOff: false,
      type: this.$route.params.type,
      getTime: new Date().getTime()   // 时长统计
    }
  },
  created () {
    const that = this
    const cookies = Store.get(Config.constants.cookies)
    that.isClear = true
    that.loanCode = cookies.loanCode
    that.loanRoutes = cookies.loanRoutes
    that.pathIndex = Utils.getIndex(that.loanRoutes, window.location.pathname)
    Store.set('loan_apply', {})
  },
  mounted () {
    const that = this
    if (!that.loanCode) return
    this.getDict()
    this.getCitizenSpouse()
    Utils.countPlus('基本信息', 'send')
  },
  methods: {
    async getCitizenSpouse () {
      let res = await getCitizenSpouse({reqCode: this.loanCode})
      let that = this
      if (res.code - 0 === 0) {
        if (!res.data) return
        that.xlPicker = [res.data.custEducation]
        that.hyPicker = [res.data.maritalStatus]
        that.cname = res.data.name
        that.idCardNumber = res.data.idCardNo
        that.telephone = res.data.telephone
        that.monthMoney = res.data.monthIncome
        that.dwxzPicker = [res.data.orgType]
        that.sshyPicker = [res.data.belongIndustry]
        that.zwPicker = [res.data.jobTitle]
      }
    },
    async getDict () {
      let dic = getDictValueAll({code: 'education,hyzk,smddwxz,smdzw,smdsshy'})
      let res = await dic
      if (res.code - 0 === 0 && res.data) {
        this.xlData = Array.from(res.data.education, item => { item.name = item.ddText; item.value = item.ddValue; return item })
        this.hyData = Array.from(res.data.hyzk, item => { item.name = item.ddText; item.value = item.ddValue; return item })
        this.dwxzData = Array.from(res.data.smddwxz, item => { item.name = item.ddText; item.value = item.ddValue; return item })
        this.zwData = Array.from(res.data.smdzw, item => { item.name = item.ddText; item.value = item.ddValue; return item })
        this.sshyData = Array.from(res.data.smdsshy, item => { item.name = item.ddText; item.value = item.ddValue; return item })
      } else {
        alert(res.msg)
      }
    },
    onShow () {
      // setTimeout(_ => {
      //   this.listData = [...this.listData]
      // }, 800)
    },
    async nextStep () {
      const that = this
      const xlPicker = that.xlPicker[0]
      if (!xlPicker) return that.$vux.toast.text(Config.constants.nullEducation)
      const hyPicker = that.hyPicker[0]
      if (!hyPicker) return that.$vux.toast.text(Config.constants.nullMarital)
      let cname, idCardNumber, telephone, monthMoney, dwxzPicker, sshyPicker, zwPicker
      if (hyPicker === '1') {
        cname = that.cname
        if (!cname) return that.$vux.toast.text(Config.constants.nullName)
        idCardNumber = that.idCardNumber
        if (!idCardNumber) return that.$vux.toast.text(Config.constants.nullIdcardNo)
        telephone = that.telephone
        if (!telephone) return that.$vux.toast.text(Config.constants.nullTelephone)
        if (!Utils.isTelephone(telephone)) {
          return that.$vux.toast.show({
            type: 'text',
            text: Config.constants.errorMobile,
            width: '6.5rem',
            isShowMask: true
          })
        }
        monthMoney = that.monthMoney
        if (!monthMoney) return that.$vux.toast.text(Config.constants.nullMonthIncome)
        dwxzPicker = that.dwxzPicker[0]
        if (!dwxzPicker) return that.$vux.toast.text(Config.constants.nullDwxzPicker)
        sshyPicker = that.sshyPicker[0]
        if (!sshyPicker) return that.$vux.toast.text(Config.constants.nullSshyPicker)
        zwPicker = that.zwPicker[0]
        if (!zwPicker) return that.$vux.toast.text(Config.constants.nullZwPicker)
      }
      let cookies = Store.get(Config.constants.cookies)
      let spouseParams = {
        prdCode: cookies.proCode || '',
        reqCode: that.loanCode,
        custEducation: xlPicker,
        maritalStatus: hyPicker,
        name: cname || '',
        idCardNo: idCardNumber || '',
        telephone: telephone && Utils.clearSpecChars(telephone) || '',
        monthIncome: monthMoney || '',
        orgType: dwxzPicker || '',
        belongIndustry: sshyPicker || '',
        jobTitle: zwPicker || ''
      }
      // 借款人信息录入,经营贷和车抵贷产品入口
      that.$vux.loading.show({
        text: '请稍候...'
      })
      Utils.countPlus({
        'userName': telephone
      }, 'register')
      const res = await postCitizenSpouse(spouseParams)
      if (res.code === Config.resCode.success) {
        cookies.maritalStatus = hyPicker
        Store.set(Config.constants.cookies, cookies)
        let loanRoutes = that.loanRoutes
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
    width: 3.5rem;
    text-indent: .48rem;
    color: #333;
    height: 1.46rem;
    line-height: 1.46rem;
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
  .apply-detail-unit {
    float: right;
    padding-right: .48rem;
    color: #666;
    height: 1.46rem;
    line-height: 1.46rem;
    font-size: .4rem;
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
  .belong-industry {
    .vux-popup-picker-select {
      height: 1.46rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 6rem;
    }
  }
  .weui-cell {
    display: flex;
    padding: 0;
    height: 1.46rem;
    line-height: 1.46rem;
  }
  .weui-cell__hd {
    width: 3.5rem;
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
}
</style>
