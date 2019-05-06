<template>
  <div class="loan-contact">
    <ul class="contact-ul">
      <li class='contact-detail-content'>
        <popup-picker placeholder='请选择' title="婚姻状况" value-text-align='left' :data="listData" :columns="1" v-model="maritalPicker" show-name></popup-picker>
      </li>
      <li class='contact-detail-content'>
        <p class='contact-detail-item'>{{maritalText && (maritalText.name === "未婚" || maritalText.name === "离异") ? "亲属" : "配偶"}}姓名</p>
        <input class='contact-detail-input' type="text" placeholder='请输入姓名' v-model="name" />
      </li>
      <li class='contact-detail-content'>
        <p class='contact-detail-item'>{{maritalText && (maritalText.name === "未婚" || maritalText.name === "离异") ? "亲属" : "配偶"}}身份证号</p>
        <input class='contact-detail-input' type="text" placeholder='请输入身份证号' v-model="idCardNo" maxlength="18" >
      </li>
      <li class='contact-detail-content'>
        <p class='contact-detail-item'>{{maritalText && (maritalText.name === "未婚" || maritalText.name === "离异") ? "亲属" : "配偶"}}联系方式</p>
        <input class='contact-detail-input' type="text" placeholder='请输入手机号' v-model="telephone" maxlength="11" >
      </li>
      <li class='contact-detail-content'>
        <p class='contact-detail-item'>{{maritalText && (maritalText.name === "未婚" || maritalText.name === "离异") ? "亲属" : "配偶"}}单位名称</p>
        <input class='contact-detail-input' type="text" placeholder='请输入单位名称' v-model="orgName">
      </li>
      <li class='contact-detail-content'>
        <p class='contact-detail-item'>{{maritalText && (maritalText.name === "未婚" || maritalText.name === "离异") ? "亲属" : "配偶"}}单位地址</p>
        <input class='contact-detail-input' type="text" placeholder='请输入单位地址' v-model="orgAddr">
      </li>
    </ul>
    <v-button @next='nextStep'>下一步</v-button>
  </div>
</template>

<script>
  import Store from 'store'
  import Config from '../../config/index'
  import Utils from '../../config/utils'
  import VButton from './../../components/button'
  import { getDictValue, getLoanSpouse, postLoanSpouse } from '../../service/getData'
  import { PopupPicker, Group } from 'vux'
  export default {
    components: {
      VButton,
      PopupPicker,
      Group
    },
    data () {
      return {
        loanCode: '',
        name: '',
        idCardNo: '',
        telephone: '',
        orgName: '',
        orgAddr: '',
        prdType: '',
        maritalPicker: [],
        listData: [],
        loanRoutes: [],
        getTime: new Date().getTime()   // 时长统计
      }
    },
    computed: {
      maritalText () {
        return this.listData.filter((item, index) => (item.value === this.maritalPicker[0]))[0]
      }
    },
    created () {
      const that = this
      const cookies = Store.get(Config.constants.cookies)
      that.loanCode = cookies.loanCode
      that.prdType = cookies.prdType
      that.loanRoutes = cookies.loanRoutes
    },
    mounted () {
      const that = this
      if (!that.loanCode) return
      getDictValue({code: 'hyzk'}).then(res => {
        if (res.code === Config.resCode.success) {
          if (res.data && res.data.hyzk) {
            res.data.hyzk.forEach((item, index) => {
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
      getLoanSpouse({code: that.loanCode}).then(res => {
        that.$vux.loading.hide()
        if (res.code === Config.resCode.success) {
          const data = res.data
          if (data) {
            if (data.maritalStatus) that.maritalPicker = [data.maritalStatus]
            that.name = data.name
            that.idCardNo = data.idCardNo
            that.telephone = data.telephone
            that.orgName = data.orgName
            that.orgAddr = data.orgAddr
          }
        } else {
          that.$vux.toast.text(res.msg)
        }
      })
      Utils.countPlus('其他信息', 'send')
    },
    methods: {
      async nextStep () { // 下一步
        const that = this
        const maritalStatus = that.maritalPicker[0]
        if (!maritalStatus) return that.$vux.toast.text(Config.constants.nullMarital)
        const name = that.name
        if (!name) return that.$vux.toast.text(Config.constants.nullCname)
        const idCardNo = that.idCardNo
        if (!Utils.isIdCardNo(idCardNo)) return that.$vux.toast.text(Config.constants.errorIdcardNo)
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
        const orgName = that.orgName
        if (!orgName) return that.$vux.toast.text(Config.constants.nullOrgName)
        if (orgName.length > 25) return that.$vux.toast.text(Config.constants.wordlen25OrgName)
        const orgAddr = that.orgAddr
        if (!orgAddr) return that.$vux.toast.text(Config.constants.nullOrgAddr)
        if (orgAddr.length > 64) return that.$vux.toast.text(Config.constants.wordlen64OrgAddr)
        const loanSpouseParams = {
          reqCode: that.loanCode,
          maritalStatus: maritalStatus,
          name: name,
          idCardNo: idCardNo,
          telephone: Utils.clearSpecChars(telephone),
          orgName: orgName,
          orgAddr: orgAddr
        }
        that.$vux.loading.show({
          text: '请稍候...'
        })
        const res = await postLoanSpouse(loanSpouseParams)
        if (res.code === Config.resCode.success) {
          Utils.countPlus('页面停留时长', 'send', {'pageName': '其他信息', 'stayTime': new Date().getTime() - this.getTime})
          const loanType = Utils.getQueryParams('type')
          if (loanType === 'busiloan') { // 经营贷
            that.$router.push(Config.constants.companyRouter)
          } else {
            let loanRoutes = that.loanRoutes
            let pathIndex = Utils.getIndex(loanRoutes, window.location.pathname)
            if (pathIndex > -1 && pathIndex !== loanRoutes.length - 1) {
              that.$router.push(loanRoutes[pathIndex + 1])
            } else {
              that.$router.push(Config.constants.confirmRouter)
            }
          }
        } else {
          that.$vux.loading.hide()
          that.$vux.toast.text(res.msg)
        }
      }
    }
  }
</script>

<style lang="less">
  .loan-contact {
    position: relative;
    width: 10.8rem;
    background-color: #fafafa;
    margin: 0 auto;
    height: 100%;
    .contact-ul {
      position: relative;
      width: 100%;
      height: auto;
      background-color: #fff;
      overflow: hidden;
    }
    .contact-detail-content {
      position: relative;
      width: 100%;
      display: flex;
    }
    .contact-detail-item {
      width: 3rem;
      padding-left: .48rem;
      color: #333;
      height: 1.46rem;
      line-height: 1.46rem;
      font-weight: bold;
      font-size: .4rem;
    }
    .contact-detail-input {
      flex: 1;
      border: none;
      outline: none;
      padding-left: .48rem;
      font-size: .42rem;
      color: #333;
    }
    .contact-detail-verify {
      text-align: center;
      width: 2.96rem;
      height: 1.46rem;
      line-height: 1.46rem;
      color: #369fff;
      font-size: .4rem;
    }

    .weui-cell {
      display: flex;
      padding: 0;
      height: 1.46rem;
      line-height: 1.46rem;
      font-size: .4rem;
    }
    .weui-cell__hd {
      width: 3rem;
      padding-left: .48rem;
      text-align: left;
      font-weight: bold;
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
