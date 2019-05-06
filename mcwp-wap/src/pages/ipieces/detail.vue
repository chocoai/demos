<template>
  <div class="ipieces-detail">
    <view-box v-if="auditInfo" ref="viewBox">
      <detail-audit :auditInfo="auditInfo" :loanAuditVOList="loanAuditVOList" :loanOperatorVO="loanOperatorVO" :showTop="showTop" @topChange='topChange' :top="top" />
      <detail-top v-if="showTop && mismatchInfo" ref="topContent" :loanData="top" @autoNav='autoNav' :mismatchInfo="mismatchInfo" :type="type" :busiCheck="top.duplicateBusiCheck" :code="list[0].data.loanCustomer.idCardNo" />
      <div style="height:1.42rem;">
        <sticky scroll-box="vux_view_box_body" ref="sticky" :check-sticky-support="false">
          <div ref="tabWrapper" class="tab-container" style="width: 100%;overflow:scroll;-webkit-overflow-scrolling:touch;">
            <tab ref="tab" class="ipieces-detail-tab" :scroll-threshold='100' :style="`width:${tabWidth}; display:${tabDisplay}`" active-color="#369fff" defaultColor="#6f6f6f" bar-active-color="transparent" :line-width="1" v-model="index">
              <tab-item :selected="select === item" v-for="(item, index) in list" @click="select = item" @on-item-click="onItemClick" :key="index">{{item.name}}</tab-item>
            </tab>
          </div>
        </sticky>
      </div>
     <swiper ref="swiper" v-model="index" @on-index-change = "onItemClick" :show-dots="false" :threshold="120">
        <swiper-item  v-for="(item, i) in list" :key="i" ref="componentSwiper">
          <keep-alive>
            <component class="swiper-height" v-if="list[i].data || list[i].completed" :is="list[i].component" ref="component" @heightChange="heightChange" :loanData="list[i].data" :children="list[i].children" :picInfo="picInfo" :dictInfo="dictInfo" :type="type" @showPic="showPic" :top="top" />
          </keep-alive>
        </swiper-item>
      </swiper>
    </view-box>
    <div v-transfer-dom>
      <previewer :list="nowList" ref="previewer" @on-index-change='changePicTitle' @on-close='closePic'></previewer>
      <p class="pic-title">{{PicTitle}}</p>
    </div>
    <a v-if="top && top.operateButton && top.operateButton.includes('download_report')" @click="downloadReport" class="download-report" />
    <detail-approve v-if="/approve|intervene|check|cancelLoan/.test(approveStatus) && top" :approveStatus="approveStatus" :surveyStatus="surveyStatus" :auditStatus="auditStatus" :dictInfo="dictInfo" @pass="pass" @reback="reback" @intervene="intervene" :token="token" :credit="credit" :baseInfo="list[0].data" :code="code" :type="type" :basic="basic" />
  </div>
</template>

<script>
import { Tab, TabItem, Sticky, ViewBox, Swiper, SwiperItem, Previewer, TransferDom } from 'vux'
import Utils from '../../config/utils'
import Config from '../../config/index'
import TabsConfig from '../../config/Ipieces/TabConfig'
import { detailLoan, passLoan, detailLogin, rebackLoan, interveneLoan, passCheck } from '../../service/getData'
import DetailAudit from './../../components/ipieces/detailAudit'
import DetailTop from './../../components/ipieces/detailTop'
import DetailBaseInfo from './../../components/ipieces/detailBaseInfo'
import DetailBaseCitizen from './../../components/ipieces/detailBaseCitizen'
import DetailBaseCar from './../../components/ipieces/detailBaseCar'
import DetailNJBase from './../../components/ipieces/detailNJBase'
import DetailBusInfo from './../../components/ipieces/detailBusInfo'
import DetailBusOther from './../../components/ipieces/detailBusOther'
import DetailAnalyBus from './../../components/ipieces/detailAnalyBus'
import DetailAnalyPro from './../../components/ipieces/detailAnalyPro'
import DetailCreditHis from './../../components/ipieces/detailCreditHis'
import DetailCreditHisPerson from './../../components/ipieces/detailCreditHisPerson'
import DetailCoBoGua from './../../components/ipieces/detailCoBoGua'
import DetailFinance from './../../components/ipieces/detailFinance'
import DetailLogic from './../../components/ipieces/detailLogic'
import DetailAssets from './../../components/ipieces/detailAssets'
import DetailSoftInfo from './../../components/ipieces/detailSoftInfo'
import DetailApprove from './../../components/ipieces/detailApprove'
import DetailFarmSoft from './../../components/ipieces/detailFarmSoft'
import DetailManageStr from './../../components/ipieces/detailManageStr'
import DetailManageFarm from './../../components/ipieces/detailManageFarm'
import DetailLoanBase from './../../components/ipieces/detailLoanBase'
import DetaiProInfo from './../../components/ipieces/detaiProInfo'
import DetailBaseInfoTmp from './../../components/ipieces/detailBaseInfoTmp'
import DetailCoBoGuaTmp from './../../components/ipieces/detailCoBoGuaTmp'
import DetailCreditHisTmp from './../../components/ipieces/detailCreditHisTmp'
export default {
  directives: {
    TransferDom
  },
  components: {
    Tab,
    TabItem,
    Sticky,
    ViewBox,
    Swiper,
    Previewer,
    SwiperItem,
    DetailAudit,
    DetailTop,
    DetailBaseInfo,      // 基本信息
    DetailBaseCitizen,  // 市民贷基本信息
    DetailBaseCar,  // 车贷基本信息
    DetailNJBase,       // 南郊基本信息
    DetailLoanBase,      // 网贷基本信息
    DetailBusInfo,       // 经营基本信息
    DetailBusOther,      // 其他经营信息
    DetailAnalyBus,      // 主营业务分析
    DetailAnalyPro,      // 生产情况分析
    DetailCreditHis,     // 信贷历史
    DetailCreditHisPerson,     // 信贷历史
    DetailCoBoGua,       // 共同借款人和担保人
    DetailFinance,       // 财务情况
    DetailLogic,         // 逻辑校验
    DetailAssets,        // 资产信息
    DetailSoftInfo,      // 软信息
    DetailApprove,       // 审批
    DetailFarmSoft,      // 农贷软信息
    DetailManageStr,     // 农贷上下游
    DetailManageFarm,    // 农贷经营信息
    DetaiProInfo,        // 职业信息
    DetailBaseInfoTmp,    // 临时
    DetailCoBoGuaTmp,     // 临时
    DetailCreditHisTmp    // 临时
  },
  data () {
    return {
      list: Config.list,
      select: '',
      index: 0,
      showTop: true,
      disHeight: 0,     // 暂时不用
      topHeight: 0,
      tabWidth: '10000px',   // 初始化要足够，否则组件第一次宽度自动平均分配
      tabDisplay: 'block',   // tab页布局
      token: Utils.getUrlkey(window.location.search)['token'],
      code: Utils.getUrlkey(window.location.search)['code'] || Config.ipiecesConfig.ipiecesCode,
      top: null,
      basic: null,
      auditInfo: null,
      loanAuditVOList: null,
      loanOperatorVO: null,
      picInfo: {},
      type: Utils.getUrlkey(window.location.search)['prdType'] || Config.ipiecesConfig.ipiecesType,     // 进件类型
      approveStatus: Utils.getUrlkey(window.location.search)['status'] || Config.ipiecesConfig.ipiecesStatus,
      dictInfo: null,    // 字典值，目前就是学历
      mismatchInfo: {},
      // busiCheck: [],
      credit: null,
      markedIndex: null,
      surveyStatus: null,
      auditStatus: null,
      nowList: [],  // 当前展示list
      showPicTitle: true,
      PicTitle: '',
      PicType: ''
    }
  },
  methods: {
    topChange () {
      this.showTop = !this.showTop
      this.$nextTick(() => {
        this.$refs.sticky.bindSticky()
      })
    },
    scrollDis () {
      if (this.topHeight && this.topHeight < this.$refs.viewBox.getScrollTop()) {
        if (!this.showTop) return
        this.showTop = false
        this.$refs.viewBox.scrollTo(top)
        this.$refs.sticky.bindSticky()
        this.$nextTick(() => {
          this.$refs.sticky.bindSticky()
        })
      }
    },
    async onItemClick (index) {
      if (this.markedIndex === index) return
      this.markedIndex = index
      // 获取数据
      if (!this.list[index].data || Object.keys(this.list[index].data).length === 0) {
        let list = this.list
        let tmp = ''
        if (typeof (this.list[index].url) === 'object') {
          tmp = []
          // for (let i = 0, len = this.list[index].url.length; i < len; i++) {
          //   tmp[i] = (await detailLoan({code: this.code}, this.list[index].url[i], this.token)).data
          // }
          let promises = this.list[index].url.map((item) => (
            detailLoan({code: this.code}, item, this.token)
          ))
          let results = await Promise.all(promises)
          tmp = Array.from(results, (result) => result.data)
        } else {
          tmp = (await detailLoan({code: this.code}, this.list[index].url, this.token)).data
        }
        if (tmp && tmp.moduleConfig) {
          tmp.moduleName = {}
          tmp.moduleConfig.map(i => { tmp.moduleName[i.formEnName] = i.formChName })
        }
        list[index].data = tmp
        // 避免返回为空而无法进入组件
        if (!tmp) list[index].completed = true
        this.list = list
      }
      // 收起头部内容
      this.showTop = false
      this.$refs.viewBox.scrollTo(top)
      // 此处有动画
      this.$nextTick(() => {
        // alert(this.$refs.componentSwiper[this.index].$children[0].$el.getBoundingClientRect().height)
        this.$refs.swiper.xheight = `${this.$refs.componentSwiper[this.index].$children[0].$el.getBoundingClientRect().height}px`
        this.$refs.tabWrapper.scrollLeft = this.$refs.tab.$el.getBoundingClientRect().width * parseFloat(this.$refs.tab.barLeft) / 100 - this.$refs.tabWrapper.getBoundingClientRect().width / 3
      })
    },
    heightChange () {
      this.$nextTick(() => {
        this.$refs.swiper.xheight = `${this.$refs.componentSwiper[this.index].$children[0].$el.getBoundingClientRect().height}px`
      })
    },
    async getInfo () {
      if (Config.test) {
        // 临时登录
        let login = await detailLogin({userName: Config.ipiecesConfig.userName, password: Config.ipiecesConfig.password, smsVerifyCode: Config.ipiecesConfig.smsVerifyCode})
        this.token = login.data.token
      }
      // 头部数据
      let top = detailLoan({code: this.code}, '/v1/loan/top', this.token)
      // 头部数据
      let basic = detailLoan({code: this.code}, '/v1/loan/basic', this.token)
      // 获取审批信息
      let auditInfo = detailLoan({code: this.code}, '/v1/loan/loanAudit', this.token)
      // 照片信息
      let picInfo = detailLoan({code: this.code}, `/v1/oss/${this.code}/${Object.values(Config.bizType).join(',')}/picture`, this.token)
      // 获取字典值
      let dictInfo = detailLoan({code: 'education,jsfs,gdlx,bcgx,hkfs,znqk,jjzt'}, '/comm/sys/dict/items/all', this.token)
      // 获取还款期数
      let dictInfoPrd = detailLoan({ddItem: 'hkqs', prdType: this.type}, '/comm/sys/dict/items/custom', this.token)
      // 获取不匹配项
      let mismatchInfo = detailLoan({code: this.code}, '/v1/loan/verifyResult/mismatch', this.token)
      // 获取老客户信息
      // let duplicateBusiCheck = detailLoan({code: this.code}, '/v1/loan/basic', this.token)
      // 获取审批通过授权信息
      if (this.approveStatus === 'approve') {
        let credit = detailLoan({code: this.code}, '/v1/loan/audit/credit', this.token)
        this.credit = (await credit).data
      }
      if (this.approveStatus === 'check') {
        let credit = detailLoan({code: this.code}, '/v1/loan/examine/credit', this.token)
        this.credit = (await credit).data || {}
      }
      this.picInfo = (await picInfo).data
      // 添加自制类型，根据需求定制
      this.picInfo[Config.showType.loanPersonSpouse] = [...this.picInfo[Config.bizType.loanPerson] || [], ...this.picInfo[Config.bizType.loanSpouse] || []]
      this.picInfo[Config.showType.loanPledgeAll] = [...this.picInfo[Config.bizType.loanPledge] || [], ...this.picInfo[Config.bizType.loanPledgehouse] || []]
      this.dictInfo = (await dictInfo).data
      this.dictInfoPrd = (await dictInfoPrd).data
      if (this.dictInfoPrd.hkqs) this.dictInfo.hkqs = this.dictInfoPrd.hkqs
      this.mismatchInfo = (await mismatchInfo).data
      // this.busiCheck = (await duplicateBusiCheck).data.duplicateBusiCheck
      this.top = (await top).data
      this.auditStatus = this.top.auditStatus
      this.surveyStatus = this.top.surveyStatus
      this.basic = (await basic).data
      // 从基本信息移到top中
      this.loanAuditVOList = this.top.loanAuditVOList
      this.loanOperatorVO = this.top.loanOperatorVO
      let list = this.list
      let tabShow = this.top.tabShow
      let tabConfig = this.top.tabConfig
      if (!tabConfig) {
        tabConfig = TabsConfig.filter(i => tabShow.includes(i.formChName)).map(i => {
          i.position = tabShow.findIndex(value => value === i.formChName)
          return i
        })
      } else {
        tabConfig.sort((i1, i2) => i1.position - i2.position)
      }
      // tab页处理
      let tabEnName = []
      let tabName = {}
      tabConfig.map(i => {
        tabName[i.formEnName] = i.formChName
        tabEnName.push(i.formEnName)
      })
      // tab页命名加排序
      this.list = list.filter(item => {
        item.name = tabName[item.formEnName]
        item.position = tabEnName.findIndex(value => value === item.formEnName)
        return tabEnName.includes(item.formEnName) && item.type.includes(this.type)
      }).sort((i1, i2) => i1.position - i2.position)
      // this.list = list.filter(item => (
      //   tabShow.includes(item.name) && item.type.includes(this.type)
      // ))
      if (!this.list[this.index].data) {
        let list = this.list
        list[this.index].data = (await detailLoan({code: this.code}, this.list[this.index].url, this.token)).data
        if (list[this.index].data && list[this.index].data.moduleConfig) {
          list[this.index].data.moduleName = {}
          list[this.index].data.moduleConfig.map(i => { list[this.index].data.moduleName[i.formEnName] = i.formChName })
        }
        this.list = list
      }
      this.auditInfo = (await auditInfo).data
      // this.disHeight = this.$refs.topBtn.getBoundingClientRect().height
      // this.topHeight = this.$refs.topContent.$el.getBoundingClientRect().height
      // this.box = document.querySelector('#vux_view_box_body')
      // this.box.addEventListener('scroll', this.scrollDis)
      // tab高度
      this.$nextTick(() => {
        this.topHeight = this.$refs.topContent.$el.getBoundingClientRect().height
        this.box = document.querySelector('#vux_view_box_body')
        this.box.addEventListener('scroll', this.scrollDis)
        this.$nextTick(() => {
          this.$refs.swiper.xheight = `${this.$refs.componentSwiper[this.index].$children[0].$el.getBoundingClientRect().height}px`
        })
        // tab宽度，经营贷和网贷区别
        let temWidth = 0
        if (tabShow.length > 3) {
          this.$refs.tab.$children.map((item, index) => {
            temWidth += item.$el.getBoundingClientRect().width
          })
          this.tabWidth = `${temWidth}px`
        } else {
          this.tabWidth = '100%'
          this.tabDisplay = 'flex'
        }
      })
    },
    // 跳转
    autoNav (i) {
      this.showTop = false
      let choseKey
      if (this.mismatchInfo) {
        Object.keys(this.mismatchInfo).forEach(key => {
          this.mismatchInfo[key] && (this.mismatchInfo[key] === i || this.mismatchInfo[key].includes(i)) ? choseKey = key : null
        })
      }
      this.list.map((item, index) => {
        item.mismatch && item.mismatch.includes(choseKey) ? this.index = index : null
      })
      // 实现方式有待优化，存在网络延时
      // setTimeout(() => (
      //   document.getElementById('bizInfo').scrollIntoView()
      // ), 400)
      this.$nextTick(() => {
        this.$refs.sticky.bindSticky()
      })
    },
    // 审批审查通过
    async pass (authMoney, dailyRate, repaymentPeriod, period, kind, comment) {
      // 审查
      if (this.approveStatus === 'check') {
        let params = {
          reqCode: this.code,
          authMoney: authMoney,
          dailyRate: dailyRate
        }
        let result = await passCheck(params, this.token)
        if (+result.code === 0) {
          this.$vux.toast.text('审查通过')
          window.zdb.tToast('审查通过')
          window.zdb.tExit()
        } else {
          alert(result.msg)
          window.zdb.tExit()
        }
      } else {
          // 审批
        if (repaymentPeriod) {
          let params = {
            reqCode: this.code,
            authMoney: authMoney,
            dailyRate: dailyRate,
            repaymentPeriod: repaymentPeriod,
            comment: comment
          }
          let result = await passLoan(params, this.token)
          if (+result.code === 0) {
            this.$vux.toast.text('审批通过')
            window.zdb.tToast('审批通过')
            window.zdb.tExit()
          } else {
            alert(result.msg)
            window.zdb.tExit()
          }
        } else {
          let params = {
            reqCode: this.code,
            authMoney: authMoney,
            dailyRate: dailyRate,
            period: period,
            kind: kind,
            comment: comment
          }
          let result = await passLoan(params, this.token)
          if (+result.code === 0) {
            this.$vux.toast.text('审批通过')
            window.zdb.tToast('审批通过')
            window.zdb.tExit()
          } else if (result.code === 'REPAYMENTKIND_NOT_RIGHT') {
            this.$vux.toast.text(result.msg)
          } else {
            alert(result.msg)
            window.zdb.tExit()
          }
        }
      }
    },
    // 打回提交
    async reback (rebackReason) {
      let params = {
        code: this.code,
        repulseReason: rebackReason
      }
      let result = await rebackLoan(params, this.token)
      if (+result.code === 0) {
        this.$vux.toast.text('打回成功')
        window.zdb.tToast('打回成功')
        window.zdb.tExit()
      } else {
        alert(result.msg)
        // todo
        window.zdb.tToast(result.msg)
        window.zdb.tExit()
      }
    },
    // 打回提交
    async intervene (interveneReason) {
      let params = {
        code: this.code,
        reason: interveneReason
      }
      let result = await interveneLoan(params, this.token)
      if (+result.code === 0) {
        this.$vux.toast.text('干预成功')
        window.zdb.tToast('干预成功')
        window.zdb.tExit()
      } else {
        alert(result.msg)
        window.zdb.tExit()
      }
    },
    // 下载报告
    downloadReport (e) {
      // e.target.href = Config.target + '/comm/export/down/excel?code=' + this.code
      window.zdb.tDownload(Config.target + '/comm/export/down/excel?code=' + this.code, `${this.basic.loanCustomer.cname}-${this.basic.loanCustomer.telephone}-${this.dictInfo.jjzt.filter(i => i.ddValue === this.top.auditStatus)[0].ddText}-${Utils.formatTime().split('-').join('')}.xlsx`)
    },
    // 显示照片
    showPic (type, PicList) {
      this.PicType = type
      this.nowList = Array.from(PicList, item => { item.src = item.srcUrl; return item })
      this.$nextTick(() => {
        this.$refs.previewer.show(0)
        this.PicTitle = this.picInfo[type][0].fileName
      })
    },
    // 修改照片标题
    changePicTitle (index) {
      this.PicTitle = this.picInfo[this.PicType][index.currentIndex].fileName
    },
    // 关闭照片时候触发
    closePic () {
      this.PicTitle = ''
    }
  },
  created () {
    if (this.approveStatus === 'approve') {
      document.title = '进件审批'
    }
    if (this.approveStatus === 'check') {
      document.title = '进件审查'
    }
    this.getInfo()
    // alert(window.location)
    // alert(window.location.pathname)
  }
}
</script>

<style lang="less" scoped>
.ipieces-detail {
  height: 100%;
  background-color: #fff;
  .vux-slider {
    padding-bottom: .5rem;
  }
  .vux-tab {
    // display: block;
    // width: 34.5rem;
    height: 1.42rem;
    // display: flex;
  }
  .vux-tab-item {
    display: inline-block;
    line-height: 1.42rem;
    font-size: .4rem;
    padding: 0 .5rem;
    width: auto;
    transition: all .3s ease;
  }
  .download-report {
    position: fixed;
    right: .44rem;
    bottom: 2.84rem;
    width: 1.84rem;
    height: 1.84rem;
    background: url('../../assets/icon_download_report_default.png') no-repeat;
    background-size: cover;
  }
}
.swiper-height {
  min-height: 100vh;
  margin-top: .26rem;
}
.pic-title {
  position: absolute;
  left: 50%;
  top: 0;
  transform: translateX(-50%);
  display: inline-block;
  margin: 0 auto;
  height: 44px;
  line-height: 44px;
  z-index: 2000;
  color: #fff;
}
</style>
