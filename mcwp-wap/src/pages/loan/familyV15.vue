<template>
  <div class="loan-family">
    <ul class="contact-ul">
      <li class='contact-detail-content'>
        <popup-picker class="font-32" placeholder='请选择' title="婚姻状况" value-text-align='left' :data="listData" :columns="1" v-model="maritalPicker" show-name></popup-picker>
      </li>
      <li class='contact-detail-content'>
        <popup-picker class="font-32" placeholder='请选择' title="最高学历" value-text-align='left' :data="educationList" :columns="1" v-model="educationPicker" show-name></popup-picker>
      </li>
      <li class='contact-detail-content'>
        <popup-picker class="font-32" placeholder='请选择' title="子女情况" value-text-align='left' :data="znqkList" :columns="1" v-model="znqkPicker" show-name></popup-picker>
      </li>
      <li class='contact-detail-content'>
        <popup-picker class="font-32" placeholder='选择省市区' title="家庭地址" value-text-align='left' :data="ssqList" :columns="1" v-model="familyPicker" show-name></popup-picker>
      </li>
      <li class='contact-detail-content'>
        <input class='contact-detail-input font-32' type="text" placeholder='请输入详细地址' v-model="loanAddress" >
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
import { getDictValue, postLoanFamily, getLoanFamily } from '../../service/getData'
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
      listData: [],
      znqkList: [],
      educationList: [],
      ssqList: [],
      maritalPicker: [],
      znqkPicker: [],
      educationPicker: [],
      familyPicker: [],
      loanAddress: '',
      loanRoutes: [],
      pathIndex: ''
    }
  },
  created () {
    const that = this
    const cookies = Store.get(Config.constants.cookies)
    if (Utils.getQueryParams('code')) {
      cookies.loanCode = Utils.getQueryParams('code')
      that.loanCode = Utils.getQueryParams('code')
      Store.set(Config.constants.cookies, cookies)
    } else {
      that.loanCode = cookies.loanCode
    }
    that.prdType = cookies.prdType
    that.loanRoutes = cookies.loanRoutes
    that.pathIndex = Utils.getIndex(that.loanRoutes, window.location.pathname)
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
    getDictValue({code: 'znqk'}).then(res => {
      if (res.code === Config.resCode.success) {
        if (res.data && res.data.znqk) {
          res.data.znqk.forEach((item, index) => {
            that.znqkList.push({
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
    getLoanFamily({code: that.loanCode}).then(res => {
      that.$vux.loading.hide()
      if (res.code === Config.resCode.success) {
        const data = res.data
        if (data) {
          if (data.maritalStatus) that.maritalPicker = [data.maritalStatus]
          if (data.provinceRegion) that.familyPicker = data.provinceRegion.split('/')
          if (data.topEducation) that.educationPicker = [data.topEducation]
          if (data.childrenInfo) that.znqkPicker = [data.childrenInfo]
          if (data.homeAddr) that.loanAddress = data.homeAddr
          if (data.prdSteps && data.prdSteps.length > 0) {
            let prdSteps = []
            data.prdSteps.forEach((item, index) => {
              prdSteps.push(item.itemIds)
            })
            const cookies = Store.get(Config.constants.cookies)
            that.loanRoutes = cookies.loanRoutes = prdSteps
            that.pathIndex = Utils.getIndex(that.loanRoutes, window.location.pathname)
            Store.set(Config.constants.cookies, cookies)
          }
        }
      } else {
        that.$vux.toast.text(res.msg)
      }
    })
    getDictValue({code: 'education'}).then(res => {
      if (res.code === Config.resCode.success) {
        if (res.data && res.data.education) {
          res.data.education.forEach((item, index) => {
            that.educationList.push({
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
    getDictValue({code: 'ssq'}).then(res => {
      if (res.code === Config.resCode.success) {
        if (res.data && res.data.ssq) {
          res.data.ssq.forEach((item, index) => {
            that.ssqList.push({
              value: item.ddValue,
              name: item.ddText,
              parent: item.parentValue
            })
            if (item.dictDTOS && item.dictDTOS.length > 0) {
              item.dictDTOS.forEach((item, index) => {
                that.ssqList.push({
                  value: item.ddValue,
                  name: item.ddText,
                  parent: item.parentValue
                })
                if (item.dictDTOS && item.dictDTOS.length > 0) {
                  item.dictDTOS.forEach((item, index) => {
                    that.ssqList.push({
                      value: item.ddValue,
                      name: item.ddText,
                      parent: item.parentValue
                    })
                  })
                }
              })
            }
          })
        }
      } else {
        that.$vux.toast.text(res.msg)
      }
    })
  },
  methods: {
    async nextStep () { // 下一步
      const that = this
      const maritalStatus = that.maritalPicker[0]
      if (!maritalStatus) return that.$vux.toast.text(Config.constants.nullMarital)
      const educationStatus = that.educationPicker[0]
      if (!educationStatus) return that.$vux.toast.text(Config.constants.nullEducation)
      const znqkPicker = that.znqkPicker[0]
      if (!znqkPicker) return that.$vux.toast.text(Config.constants.nullCcondition)
      const familyStatus = that.familyPicker.join('/')
      if (!familyStatus) return that.$vux.toast.text(Config.constants.nullFamilyAddr)
      const loanAddress = that.loanAddress
      if (!loanAddress) return that.$vux.toast.text(Config.constants.nullIdcardAddr)
      const loanFamilyParams = {
        reqCode: that.loanCode,
        maritalStatus: maritalStatus,
        topEducation: educationStatus,
        childrenInfo: znqkPicker,
        provinceRegion: familyStatus,
        homeAddr: loanAddress
      }
      that.$vux.loading.show()
      const res = await postLoanFamily(loanFamilyParams)
      that.$vux.loading.hide()
      if (res.code === Config.resCode.success) {
        let loanRoutes = that.loanRoutes
        // let pathIndex = Utils.getIndex(loanRoutes, window.location.pathname)
        that.$router.push(loanRoutes[that.pathIndex + 1])
      } else {
        that.$vux.toast.text(res.msg)
      }
    }
    // nextStep () {
    //   this.$router.push(Config.constants.contactV15Router)
    // }
  }
}
</script>

<style lang="less">
  .loan-family {
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
    .vux-popup-picker-placeholder {
      color: #777;
    }
    .weui-label {
      color: #333;
    }
  }
</style>
