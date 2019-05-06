<template>
  <div class="loan-contact">
    <ul class="contact-ul">
      <li class='contact-detail-content' flex="">
        <p class='contact-detail-item font-32' flex-box="0">直系亲属姓名</p>
        <input flex-box="1" class='contact-detail-input font-32' type="text" placeholder='请输入直系亲属姓名' v-model="directName" >
      </li>
      <li class='contact-detail-content' flex="">
        <p class='contact-detail-item font-32' flex-box="0">直系亲属手机号</p>
        <input flex-box="1" class='contact-detail-input font-32' type="tel" placeholder='请输入直系亲属手机号' v-model="directPhone" >
      </li>
      <li class='contact-detail-content' flex="">
        <p class='contact-detail-item font-32' flex-box="0">直系亲属身份证号</p>
        <input flex-box="1" class='contact-detail-input font-32' type="text" placeholder='请输入直系亲属身份证号' v-model="directIdCardNo" maxlength="18" >
      </li>
      <li class='contact-detail-content'>
        <popup-picker class="font-32" placeholder='请选择' title="与申请人关系" value-text-align='left' :data="dirList" :columns="1" v-model="directPicker" show-name></popup-picker>
      </li>
      <li class='contact-detail-content' flex="">
        <p flex-box="0" class='contact-detail-item font-32'>紧急联系人姓名</p>
        <input flex-box="1" class='contact-detail-input font-32' type="text" placeholder='请输入紧急联系人姓名' v-model="emergentName" >
      </li>
      <li class='contact-detail-content' flex="">
        <p flex-box="0" class='contact-detail-item font-32'>紧急联系人手机号</p>
        <input flex-box="1" class='contact-detail-input font-32' type="tel" placeholder='请输入紧急联系人手机号' v-model="emergentPhone" >
      </li>
      <li class='contact-detail-content'>
        <popup-picker class="font-32" placeholder='请选择' title="与申请人关系" value-text-align='left' :data="listData" :columns="1" v-model="emergentPicker" show-name></popup-picker>
      </li>
    </ul>
    <v-button @next='nextStep'>下一步</v-button>
  </div>
</template>

<script>
import Store from 'store'
import Config from '../../config/index'
import VButton from './../../components/button'
import Utils from '../../config/utils'
import { getDictValue, postLoanLinkman, getLoanLinkman } from '../../service/getData'
import { PopupPicker } from 'vux'
export default {
  components: {
    VButton,
    PopupPicker
  },
  data () {
    return {
      loanCode: '',
      dirList: [],
      listData: [],
      directName: '',
      directPhone: '',
      emergentName: '',
      directIdCardNo: '',
      emergentPhone: '',
      directPicker: [],
      emergentPicker: [],
      loanRoutes: '',
      pathIndex: ''
    }
  },
  created () {
    const that = this
    const cookies = Store.get(Config.constants.cookies)
    that.loanCode = cookies.loanCode
    that.prdType = cookies.prdType
    that.loanRoutes = cookies.loanRoutes
    that.pathIndex = Utils.getIndex(that.loanRoutes, window.location.pathname)
  },
  mounted () {
    const that = this
    if (!that.loanCode) return
    getDictValue({code: 'bcgx'}).then(res => {
      if (res.code === Config.resCode.success) {
        if (res.data && res.data.bcgx) {
          res.data.bcgx.forEach((item, index) => {
            that.listData.push({
              value: item.ddValue,
              name: item.ddText,
              parent: item.parentValue
            })
          })
        }
        that.dirList = that.listData.filter((item, index) => (item.value === '1' || item.value === '2' || item.value === '3' || item.value === '4'))
      } else {
        that.$vux.toast.text(res.msg)
      }
    })

    getLoanLinkman({code: that.loanCode}).then(res => {
      that.$vux.loading.hide()
      if (res.code === Config.resCode.success) {
        const data = res.data
        if (data) {
          if (data.name) that.directName = data.name
          if (data.telephone) that.directPhone = data.telephone
          if (data.idCardNo) that.directIdCardNo = data.idCardNo
          if (data.relationship) that.directPicker = [data.relationship]
          if (data.maritalStatus === '1') that.directPicker = ['3']
          if (data.maritalStatus === '1') that.dirList = that.listData.filter((item, index) => (item.value === '3'))
          if (data.emergencyContactName) that.emergentName = data.emergencyContactName
          if (data.emergencyContactTelephone) that.emergentPhone = data.emergencyContactTelephone
          if (data.emergencyContactFriendship) that.emergentPicker = [data.emergencyContactFriendship]
        }
      } else {
        that.$vux.toast.text(res.msg)
      }
    })
  },
  methods: {
    async nextStep () { // 下一步
      const that = this
      const directName = that.directName
      if (!directName) return that.$vux.toast.text(Config.constants.nullDirname)
      const directPhone = that.directPhone
      if (!directPhone) return that.$vux.toast.text(Config.constants.nullDirphone)
      if (!Utils.isTelephone(directPhone)) return that.$vux.toast.text(Config.constants.errDirphone)
      const directIdCardNo = that.directIdCardNo
      if (!directIdCardNo) return that.$vux.toast.text(Config.constants.nullDiridCard)
      if (!Utils.isIdCardNo(directIdCardNo)) return that.$vux.toast.text(Config.constants.errDiridCard)
      const directPicker = that.directPicker[0]
      if (!directPicker) return that.$vux.toast.text(Config.constants.nullDirpicker)
      const emergentName = that.emergentName
      if (!emergentName) return that.$vux.toast.text(Config.constants.nullEmename)
      const emergentPhone = that.emergentPhone
      if (!emergentPhone) return that.$vux.toast.text(Config.constants.nullEmephone)
      if (!Utils.isTelephone(emergentPhone)) return that.$vux.toast.text(Config.constants.errEmephone)
      const emergentPicker = that.emergentPicker[0]
      if (!emergentPicker) return that.$vux.toast.text(Config.constants.nullEmepicker)
      const loanLinkmanParams = {
        reqCode: that.loanCode,
        name: directName,
        telephone: Utils.clearSpecChars(directPhone),
        idCardNo: directIdCardNo,
        relationship: directPicker,
        emergencyContactName: emergentName,
        emergencyContactTelephone: Utils.clearSpecChars(emergentPhone),
        emergencyContactFriendship: emergentPicker
      }
      that.$vux.loading.show()
      const res = await postLoanLinkman(loanLinkmanParams)
      that.$vux.loading.hide()
      if (res.code === Config.resCode.success) {
        let loanRoutes = that.loanRoutes
        // this.$router.push(Config.constants.loanCompanyV15Router)
        that.$router.push(loanRoutes[that.pathIndex + 1])
      } else {
        that.$vux.toast.text(res.msg)
      }
      console.log(res)
    }
    // nextStep () {
    //   this.$router.push(Config.constants.loanCompanyV15Router)
    // }
  }
}
</script>

<style lang="less">
  .loan-contact{
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
    .contact-detail-content {
      position: relative;
      width: 100%;
      display: flex;
    }
    .contact-detail-item {
      width: 130px;
      padding-left: 10px;
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
      width: 130px;
      padding-left: 10px;
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
  }
</style>
