<style lang="less">
  .more-tips{
    width: 10.8rem;
    height: 1.04rem;
    background: #f2f9ff;
    line-height: 1.04rem;
    font-size: .36rem;
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

  .loan-contact {
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

<template>
  <div class="loan-contact">
    <p class="more-tips">填写更多信息，有助于提高您的贷款通过率</p>
    <ul class="contact-ul">
      <li class='contact-detail-content'>
        <p class='contact-detail-item'>企业名称</p>
        <div @click='searchOrg' class='contact-detail-input' :class="{'empty': !orgName}">{{orgName || '请搜索企业名称'}}</div>
      </li>
      <li class='contact-detail-content'>
        <p class='contact-detail-item'>雇佣人数</p>
        <input class='contact-detail-input' type="text" placeholder='请输入雇佣人数' v-model="loanNumber" >
        <p class='contact-detail-unit'>人</p>
      </li>
      <li class='contact-detail-content'>
        <p class='contact-detail-item'>经营地址</p>
        <input class='contact-detail-input' type="text" placeholder='请输入经营地址' v-model="loanAddress" >
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
  import Utils from '../../config/utils'
  import VButton from './../../components/button'
  import { getLoanAdditional, postLoanAdditional, getEnterPrises } from '../../service/getData'
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
        orgName: '',
        loanNumber: '',
        loanAddress: '',
        repayPicker: [],
        enterPrises: [],
        loanRoutes: [],
        sOrgName: '',
        isShow: false,
        isConfirm: false,
        enterPrisesText: '暂未搜索企业',
        getTime: new Date().getTime()   // 时长统计
      }
    },
    created () {
      const that = this
      const cookies = Store.get(Config.constants.cookies)
      that.loanCode = cookies.loanCode
      that.loanRoutes = cookies.loanRoutes
    },
    mounted () {
      const that = this
      if (!that.loanCode) return
      getLoanAdditional({code: that.loanCode}).then(res => {
        that.$vux.loading.hide()
        if (res.code === Config.resCode.success) {
          const data = res.data
          if (data) {
            that.orgName = data.orgName
            that.loanNumber = data.employeeNumber
            that.loanAddress = data.address
          }
        } else {
          that.$vux.toast.text(res.msg)
        }
      })
      Utils.countPlus('企业信息', 'send')
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
        const loanNumber = that.loanNumber
        if (!loanNumber) return that.$vux.toast.text(Config.constants.nullOrgNumber)
        if (!Utils.isPInt(loanNumber)) return that.$vux.toast.text('雇佣人数只能为大于0的整数')
        if (loanNumber > 10000000) return that.$vux.toast.text('雇佣人数不能为大于10000000的整数')
        const loanAddress = that.loanAddress
        if (!loanAddress) return that.$vux.toast.text(Config.constants.loanAddress)
        if (loanAddress.length > 64) return that.$vux.toast.text('经营地址最长不能超过64位')
        const loanAdditionalParams = {
          reqCode: that.loanCode,
          orgName: orgName,
          employeeNumber: loanNumber,
          address: loanAddress
        }
        that.$vux.loading.show({
          text: '请稍候...'
        })
        const res = await postLoanAdditional(loanAdditionalParams)
        if (res.code === Config.resCode.success) {
          let loanRoutes = that.loanRoutes
          let pathIndex = Utils.getIndex(loanRoutes, window.location.pathname)
          Utils.countPlus('页面停留时长', 'send', {'pageName': '企业信息', 'stayTime': new Date().getTime() - this.getTime})
          if (pathIndex > -1 && pathIndex !== loanRoutes.length - 1) {
            that.$router.push(loanRoutes[pathIndex + 1])
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
