<template>
  <div class="loan-company">
    <p class="more-tips font-28">填写更多信息，有助于提高您的贷款通过率</p>
    <ul class="contact-ul">
      <!-- <li class='contact-detail-content'>
        <p class='contact-detail-item font-32'>企业名称</p>
        <input class='contact-detail-input font-32' type="text" placeholder='请输入企业名称' v-model="enterpriseName" >
      </li> -->
      <li class='contact-detail-content'>
        <p class='contact-detail-item font-32'>企业名称</p>
        <div @click='searchOrg' class='contact-detail-input font-32' :class="{'empty': !orgName}">{{orgName || '请搜索企业名称'}}</div>
      </li>
      <li class='contact-detail-content'>
        <popup-picker class="font-32" placeholder='请选择' title="是否工商注册" value-text-align='left' :data="listData" v-model="registerPicker" show-name></popup-picker>
      </li>
      <li class='contact-detail-content'>
        <popup-picker class="font-32" placeholder='请选择' title="所属行业" value-text-align='left' :data="industryList" :columns="1" v-model="industryPicker" show-name></popup-picker>
      </li>
      <li class='contact-detail-content'>
        <popup-picker class="font-32" placeholder='请选择' title="年收入" value-text-align='left' :data="nsrList" :columns="1" v-model="nsrPicker" show-name></popup-picker>
      </li>
      <li class='contact-detail-content'>
        <popup-picker class="font-32" placeholder='请选择' title="工作地址" value-text-align='left' :data="ssqList" :columns="1" v-model="addressPicker" show-name></popup-picker>
      </li>
      <li class='contact-detail-content'>
        <input class='contact-detail-input font-32' type="text" placeholder='请输入详细地址' v-model="loanAddress" >
      </li>
    </ul>
    <v-button @next='nextStep'>下一步</v-button>
    <div class="org-list" :class="{'weui-actionsheet_toggle': isShow}">
      <div class='search-bar'>
        <input class='search-input' type="text" placeholder='请搜索企业名称' v-model="sOrgName">
        <a v-if="sOrgName" href="javascript:" class="weui-icon-clear" @click="clearOrg"></a>
        <p class='search-btn' @click='getEnterPrises'>搜索</p>
        <ul v-if="sOrgName && enterPrises.length == 0" class="complete-ul">
            <li>{{enterPrisesText}}</li>
        </ul>
        <ul v-if="sOrgName && enterPrises.length > 0" class="complete-ul">
            <li v-for="(item, index) in enterPrises" v-html="item.enterPriseName" @click='selectOrgName(item.enterPriseName)' :key="index">{{item.enterPriseName}}</li>
        </ul>
      </div>
      <div v-if="sOrgName && isConfirm" class="confirm-btn" @click="confirmOrg">确定</div>
    </div>
  </div>
</template>

<script>
import Store from 'store'
import Config from '../../config/index'
import VButton from './../../components/button'
import { getDictValue, postLoanBusiness, getLoanBusiness, getEnterPrises, getPrisesinfo } from '../../service/getData'
import { PopupPicker } from 'vux'
import Utils from '../../config/utils'

export default {
  components: {
    VButton,
    PopupPicker
  },
  data () {
    return {
      loanCode: '',
      listData: [[
        {
          name: '否',
          value: '0'
        },
        {
          name: '是',
          value: '1'
        }
      ]],
      industryList: [],
      ssqList: [],
      nsrList: [],
      enterpriseName: '',
      inCome: '',
      loanAddress: '',
      registerPicker: [],
      industryPicker: [],
      nsrPicker: [],
      addressPicker: [],
      loanRoutes: [],
      pathIndex: '',
      isShow: false,
      orgName: '',
      enterPrises: [],
      isConfirm: false,
      enterPrisesText: '暂未搜索企业',
      sOrgName: ''
    }
  },
  created () {
    const that = this
    const cookies = Store.get(Config.constants.cookies)
    that.loanCode = cookies.loanCode
    that.prdType = cookies.prdType
    that.prdType = cookies.prdType
    that.loanRoutes = cookies.loanRoutes
    that.pathIndex = Utils.getIndex(that.loanRoutes, window.location.pathname)
    getDictValue({code: 'jylb'}).then(res => {
      if (res.code === Config.resCode.success) {
        if (res.data && res.data.jylb) {
          res.data.jylb.forEach((item, index) => {
            if (item.ddValue - 0 === -1) {
              item.ddValue = '-10'
              item.dictDTOS.push({ddItem: 'jylb', ddValue: '-1', ddText: '所有行业', index: 1, parentValue: '-10', dictDTOS: []})
            }
            that.industryList.push({
              value: item.ddValue,
              name: item.ddText,
              parent: item.parentValue
            })
            if (item.dictDTOS && item.dictDTOS.length > 0) {
              item.dictDTOS.forEach((item, index) => {
                that.industryList.push({
                  value: item.ddValue,
                  name: item.ddText,
                  parent: item.parentValue
                })
              })
            }
          })
        }
      } else {
        that.$vux.toast.text(res.msg)
      }
    })
  },
  mounted () {
    const that = this
    // if (!that.loanCode) return
    getLoanBusiness({code: that.loanCode}).then(res => {
      that.$vux.loading.hide()
      if (res.code === Config.resCode.success) {
        const data = res.data
        if (data) {
          if (data.orgName) that.orgName = data.orgName
          if (data.annualIncome) that.nsrPicker = [data.annualIncome]
          if (data.address) that.loanAddress = data.address
          if (data.isbusiregis === false) that.registerPicker = ['0']
          if (data.isbusiregis === true) that.registerPicker = ['1']
          if (data.industry) {
            let ruleInfo = that.industryList.filter((item, index) => (item.name === data.industry))
            if (ruleInfo) {
              this.industryPicker = [ruleInfo[0].parent, ruleInfo[0].value]
            }
          }
          if (data.workAddress) that.addressPicker = data.workAddress.split('/')
        }
      } else {
        that.$vux.toast.text(res.msg)
      }
    })
    getDictValue({code: 'nsr'}).then(res => {
      if (res.code === Config.resCode.success) {
        if (res.data && res.data.nsr) {
          res.data.nsr.forEach((item, index) => {
            that.nsrList.push({
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
    // getDictValue({code: 'jylb'}).then(res => {
    //   if (res.code === Config.resCode.success) {
    //     if (res.data && res.data.jylb) {
    //       res.data.jylb.forEach((item, index) => {
    //         if (item.ddValue - 0 === -1) {
    //           item.ddValue = '-10'
    //           item.dictDTOS.push({ddItem: 'jylb', ddValue: '-1', ddText: '所有行业', index: 1, parentValue: '-10', dictDTOS: []})
    //         }
    //         that.industryList.push({
    //           value: item.ddValue,
    //           name: item.ddText,
    //           parent: item.parentValue
    //         })
    //         if (item.dictDTOS && item.dictDTOS.length > 0) {
    //           item.dictDTOS.forEach((item, index) => {
    //             that.industryList.push({
    //               value: item.ddValue,
    //               name: item.ddText,
    //               parent: item.parentValue
    //             })
    //           })
    //         }
    //       })
    //     }
    //     console.table(this.industryList)
    //   } else {
    //     that.$vux.toast.text(res.msg)
    //   }
    // })
    getDictValue({code: 'ssq'}).then(res => {
      if (res.code === Config.resCode.success) {
        if (res.data && res.data.ssq) {
          that.ssqList = Utils.getPickerList(res.data.ssq)
        }
      } else {
        that.$vux.toast.text(res.msg)
      }
    })
  },
  methods: {
    searchOrg () { // 搜索企业
      const that = this
      that.isShow = true
    },
    clearOrg () { // 清除数据
      const that = this
      that.sOrgName = ''
    },
    confirmOrg () { // 确定选择的企业
      const that = this
      that.orgName = that.sOrgName
      that.sOrgName = ''
      that.isShow = false
      if (that.orgName) {
        const params = {
          enterPriseName: that.orgName,
          reqCode: that.loanCode
        }
        getPrisesinfo(params).then(res => {
          if (res.code === Config.resCode.success) {
            if (res.data && res.data.industry) {
              let ruleInfo = that.industryList.filter((item, index) => (item.name === res.data.industry))
              if (ruleInfo && ruleInfo.length > 0) {
                this.industryPicker = [ruleInfo[0].parent, ruleInfo[0].value]
              }
            }
          } else {
            that.$vux.toast.text(res.msg)
          }
        })
      }
    },
    selectOrgName (name) {
      const that = this
      that.sOrgName = name
    },
    getEnterPrises () {
      const that = this
      if (!that.loanCode) return that.$vux.toast.text(Config.constants.errorLoan)
      if (!that.sOrgName) return that.$vux.toast.text(Config.constants.nullOrgName)
      const params = {
        word: that.sOrgName,
        reqCode: that.loanCode
      }
      getEnterPrises(params).then(res => {
        if (res.code === Config.resCode.success) {
          that.enterPrises = res.data || []
          that.enterPrisesText = '暂未搜索到相关匹配企业'
          that.isConfirm = true
        } else {
          that.$vux.toast.text(res.msg)
        }
      })
    },
    async nextStep () { // 下一步
      const that = this
      const orgName = that.orgName
      if (!orgName) return that.$vux.toast.text(Config.constants.nullOrgName)
      const nsrPicker = that.nsrPicker[0]
      if (!nsrPicker) return that.$vux.toast.text(Config.constants.nullIncome)
      const registerPicker = that.registerPicker[0]
      if (!registerPicker) return that.$vux.toast.text(Config.constants.nullRespicker)
      const industryPicker = that.industryList.filter((item, index) => (item.value === that.industryPicker[1]))[0].name
      if (!industryPicker) return that.$vux.toast.text(Config.constants.nullIndpicker)
      const addressPicker = that.addressPicker.join('/')
      if (!addressPicker) return that.$vux.toast.text(Config.constants.nullFamAddr)
      const loanAddress = that.loanAddress
      if (!loanAddress) return that.$vux.toast.text(Config.constants.nullOrgAddr)
      const loanBusinessParams = {
        reqCode: that.loanCode,
        orgName: orgName,
        isbusiregis: registerPicker,
        industry: industryPicker,
        workAddress: addressPicker,
        annualIncome: nsrPicker,
        address: loanAddress
      }
      that.$vux.loading.show()
      const res = await postLoanBusiness(loanBusinessParams)
      that.$vux.loading.hide()
      if (res.code === Config.resCode.success) {
        // this.$router.push(Config.constants.operateFlowV15Router)
        let loanRoutes = that.loanRoutes
        // let pathIndex = Utils.getIndex(loanRoutes, window.location.pathname)
        that.$router.push(loanRoutes[that.pathIndex + 1])
      } else if (res.code === Config.resCode.firstRefuse) {
        that.$router.push(Config.constants.loanRefuseRouter)
      } else {
        that.$vux.toast.text(res.msg)
      }
    }
    // nextStep () {
    //   this.$router.push(Config.constants.operateFlowV15Router)
    // }
  }
}
</script>

<style lang="less">
  .loan-company {
    position: relative;
    width: 10.8rem;
    background-color: #fafafa;
    margin: 0 auto;
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
      overflow: hidden;
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
    .org-list {
      position: fixed;
      height: 100%;
      left: 0;
      top: 0;
      -webkit-transform: translateY(100%);
      transform: translateY(100%);
      -webkit-backface-visibility: hidden;
      backface-visibility: hidden;
      z-index: 5000;
      width: 100%;
      background-color: #fff;
      -webkit-transition: -webkit-transform .3s;
      transition: -webkit-transform .3s;
      transition: transform .3s;
      transition: transform .3s,-webkit-transform .3s;
      &.weui-actionsheet_toggle {
        -webkit-transform: translate(0);
        transform: translate(0);
      }
      .search-bar {
        position: relative;
        display: flex;
        background-color: #EFEFF4;
        padding: .2rem 0px .2rem .3rem;
        .weui-icon-clear {
          position: absolute;
          right: 1.7rem;
          top: .55rem;
          &:before {
            font-size: .5rem !important;
          }
        }
        .search-input {
          flex: 1;
          border: none;
          outline: none;
          padding-left: .48rem;
          font-size: .42rem;
          color: #333;
          height: 1.2rem;
          line-height: 1.2rem;
          border-radius: 5px;
        }
        .search-btn {
          float: right;
          width: 1.6rem;
          text-align: center;
          color: #666;
          height: 1.2rem;
          line-height: 1.2rem;
          font-size: .4rem;
          color: #369fff;
        }
      }
      .complete-ul {
        position: absolute;
        left: 0;
        top: 1.6rem;
        width: 100%;
        background: #f8f8f8;
        z-index: 1;
        padding: 0 .2rem;
        overflow-y: auto;
        max-height: 9.6rem;
        &:before {
          content: "";
          display: block;
          position: absolute;
          height: 0;
          width: 0;
          border: 10px solid transparent;
          border-bottom: 10px solid #f8f8f8;
          left: .3rem;
          top: -20px
        }
        li {
          position: relative;
          color: #333;
          height: 1.2rem;
          line-height: 1.2rem;
          font-weight: bold;
          font-size: .4rem;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          width: 100%;
          &::before {
            content: " ";
            position: absolute;
            left: 0;
            top: 0;
            right: 0;
            height: 1px;
            border-top: 1px solid #D9D9D9;
            color: #D9D9D9;
            -webkit-transform-origin: 0 0;
            transform-origin: 0 0;
            -webkit-transform: scaleY(0.5);
            transform: scaleY(0.5);
          }
        }
      }
      .confirm-btn {
        display: block;
        width: 6rem;
        height: 1.44rem;
        line-height: 1.44rem;
        text-align: center;
        background-color: #369fff;
        border-radius: 0.72rem;
        color: #fff;
        font-size: .5rem;
        margin: 10.6rem auto 1.6rem auto;
      }
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
  }
</style>
