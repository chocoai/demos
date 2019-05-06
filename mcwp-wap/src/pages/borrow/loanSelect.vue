<template>
  <div class="borrow-loanSelect">
    <div class="content-top">
      <p class="top-title font-40">借款金额（元）</p>
      <input class="top-num font-90" :placeholder="meRes.creditBalance" v-model="borrowMoney" @input="calcValue" @keyup="calcInter"  />
      <p class="top-tip font-34">可借0~{{meRes.creditBalance}}元&nbsp&nbsp日利率{{meRes.dailyRate}}%<span class="tip-span font-34" @click="borrowAll">全部借出</span></p>
    </div>
    <div class="content-bottom">
        <ul class="apply-ul">
          <li>
            <popup-picker class="font-32" placeholder='请选择' title="还款期数" v-model="hkqsValue" :data="hkqs" @on-change="calcInter" value-text-align='right' :columns="1" show-name />
          </li>
          <li>
            <popup-picker class="font-32" placeholder='请选择' title="还款方式" v-model="hkfsValue" :data="hkfs" @on-change="calcInter" value-text-align='right' :columns="1" show-name />
          </li>
          <li class='apply-detail-content font-32'>
            <p class='apply-detail-item'>总利息</p>
            <p class='apply-detail-input'>{{interest}}元</p>
          </li>
        </ul>
    </div>
    <v-upload :url = 'picList' :type='"borrow"' @upload='upload' :phototype='"2"' :open='open' @callApp='callApp' @delFile='delFile' @callWx='callWx' :max='10' imgWidth='6.2rem'>最多上传10张照片</v-upload>
    <v-button style="width: 9rem; margin-top: 1.1rem" @next='next'>下一步</v-button>
  </div>
</template>

<script>
import VButton from './../../components/button'
import VUpload from './../../components/cardUpload'
import { getOSSPic, getBorrowCode, getDictValueAll, wxMe, calcInterest, getPeriodLimit, wxfilesUpload, delFile } from '../../service/getData'
import Config from '../../config/index'
import Utils from '../../config/utils'
import Sto from 'store'
import { PopupPicker } from 'vux'
import Wxsdk from '../../config/wxJsSdk'

export default {
  components: {
    VButton,
    PopupPicker,
    VUpload
  },
  data () {
    return {
      hkfs: [],
      hkqs: [],
      borrowMoney: '',
      hkqsValue: [],
      hkfsValue: [],
      meRes: {},
      interest: '0.00',
      temBorrowMoney: '',
      picList: [],     // 照片列表
      open: Utils.isWeixin() ? 'WeChat' : ''
    }
  },
  computed: {
  },
  methods: {
    async getDict () {
      let dic = getDictValueAll({code: 'hkfs'})
      let limit = getPeriodLimit()
      let me = wxMe()
      let limitRes = await limit
      let res = await dic
      let meRes = await me
      if (+limitRes.code === 0) {
        this.hkqs = Array.from(limitRes.data.hkqs, item => { item.name = item.ddText + '个月'; item.value = item.ddValue; return item })
      } else {
        alert(limitRes.msg)
      }
      if (+res.code === 0) {
        this.hkfs = Array.from(res.data.hkfs, item => { item.name = item.ddText; item.value = item.ddValue; return item })
      } else {
        alert(res.msg)
      }
      if (+meRes.code === 0) {
        this.meRes = meRes.data
      } else {
        alert(meRes.msg)
      }
    },
    async getCode () {
      let res = await getBorrowCode({})
      if (+res.code === 0) {
        this.borrowCode = res.data
      } else {
        alert(res.msg)
      }
    },
    next () {
      let that = this
      if (!that.borrowMoney) return that.$vux.toast.text('请输入借款金额')
      if (!that.hkqsValue[0]) return that.$vux.toast.text('请选择还款期数')
      if (!that.hkfsValue[0]) return that.$vux.toast.text('请选择还款方式')
      let params = {
        code: that.borrowCode,
        repaymentKind: that.hkfsValue[0],
        repaymentPeriod: that.hkqsValue[0],
        borrowMoney: that.borrowMoney,
        dailyRate: that.meRes.dailyRate,
        interest: that.interest,
        repaymentPeriodText: that.hkqs.filter((item) => (item.ddValue === that.hkqsValue[0]))[0].ddText
      }
      Sto.set('MCWP_LOAN_SELECT', params)
      this.$router.push(Config.constants.purposeRouter)
    },
    async calcInter () {
      let that = this
      // if (!that.borrowMoney || that.borrowMoney === that.temBorrowMoney) return
      that.temBorrowMoney = that.borrowMoney
      if (!(that.borrowMoney && that.hkqsValue[0] && that.hkfsValue[0])) return
      let params = {
        repaymentKind: that.hkfsValue[0],
        repaymentPeriod: that.hkqsValue[0],
        borrowMoney: that.borrowMoney,
        dailyRate: that.meRes.dailyRate
      }
      let res = await calcInterest(params)
      if (res.code - 0 === 0) {
        that.interest = res.data
      } else {
        alert(res.msg)
      }
    },
    calcValue () {
      let that = this
      if (that.meRes.creditBalance) {
        if (isNaN(parseInt(that.borrowMoney))) {
          that.borrowMoney = ''
          that.interest = '0.00'
        } else {
          that.borrowMoney = (parseInt(that.borrowMoney) <= that.meRes.creditBalance ? parseInt(that.borrowMoney) : that.meRes.creditBalance)
        }
      } else {
        that.borrowMoney = parseInt(that.borrowMoney)
      }
    },
    borrowAll () {
      this.borrowMoney = this.meRes.creditBalance
      this.calcInter()
    },
    // App端
    callApp () {
    },
    // 浏览器
    upload () {
    },
    delFile (code) {
      const that = this
      const param = {
        loanCode: that.borrowCode,
        codes: code
      }
      that.$vux.loading.show({
        text: '请稍候...'
      })
      delFile(param).then(res => {
        if (res.code === Config.resCode.success) {
          let picParam = {
            bizCode: that.borrowCode,
            bizTypes: Config.constants.borrowPic,
            fileTypes: '*'
          }
          that.getBorrowPic(picParam)
        } else {
          that.$vux.loading.hide()
          that.$vux.toast.text(res.msg)
        }
      })
    },
    callWx (uploadType) {
      const that = this
      if (that.picList.length === 10) return that.$vux.toast.text('最多上传10张照片，请先删除')
      let num = 10 - that.picList.length
      if (num === 10) num = 9
      Wxsdk.wxImage((wx) => {
        wx.chooseImage({
          count: num, // 默认9
          sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
          success: function (res) {
            let localIds = res.localIds // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
            that.$vux.loading.show({
              text: '上传中'
            })
            that.picUpload(wx, localIds, uploadType)
          }
        })
      })
    },
    // 多张图片上传
    picUpload (wx, localIds, uploadType) {
      const that = this
      let localId = localIds.pop()
      wx.uploadImage({
        localId: '' + localId, // 需要上传的图片的本地ID，由chooseImage接口获得
        isShowProgressTips: 0, // 默认为1，显示进度提示
        success: function (res) {
          let serverId = res.serverId // 返回图片的服务器端ID
          let wxFilesParams = {
            bizCode: that.borrowCode,
            mediaId: serverId
          }
          if (uploadType === 'borrow') {
            wxFilesParams.bizType = Config.constants.borrowPic
          }
          wxfilesUpload(wxFilesParams).then((result) => {
            if (result.code === Config.resCode.success) {
              const params = {
                bizCode: that.borrowCode,
                bizTypes: Config.constants.borrowPic,
                fileTypes: '*'
              }
              if (localIds.length) {
                that.picUpload(wx, localIds, uploadType)
              } else {
                that.getBorrowPic(params)
              }
            } else {
              const params = {
                bizCode: that.borrowCode,
                bizTypes: Config.constants.borrowPic,
                fileTypes: '*'
              }
              that.getBorrowPic(params)
              that.$vux.loading.hide()
              that.$vux.toast.text(result.msg)
            }
          })
        },
        fail: function (res) {
          Wxsdk.wxImage(() => {
            that.$vux.loading.hide()
            that.$vux.toast.text('上传失败，请重试')
          })
        }
      })
    },
    getBorrowPic (params) {
      const that = this
      getOSSPic(params).then(res => {
        that.$vux.loading.hide()
        if (res.code === Config.resCode.success) {
          if (res.data.BORROW_PIC) {
            that.picList = res.data.BORROW_PIC
          } else {
            that.picList = []
          }
        } else {
          that.$vux.toast.text(res.msg)
        }
      })
    }
  },
  created () {
    let originData = Sto.get('MCWP_LOAN_SELECT')
    if (originData) {
      this.hkfsValue[0] = originData.repaymentKind
      this.hkqsValue[0] = originData.repaymentPeriod
      this.borrowMoney = originData.borrowMoney
      this.meRes.dailyRate = originData.dailyRate
      this.interest = originData.interest
    }
    this.getDict()
    this.getCode()
  }
}
</script>

<style lang="less">
.borrow-loanSelect{
    width: 9rem;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: #fff;
    margin: .3rem auto;
    font-size: .44rem;
    padding: .6rem;
    border-radius: .3rem;
  .content-top{
    position: relative;
    text-align: center;
    .top-title{
      color: #010101;
      padding-top: .15rem;
    }
    .top-num{
      // color: #dedede;
      color: #010101;
      padding-top: .5rem;
      text-align: center;
      width: 100%;
      height:1.2rem;
    }
    .top-num::-webkit-input-placeholder {
      color: #dedede;
    }
    .top-tip{
      text-align: left;
      color: #7b7b7b;
      height:.6rem;
      line-height: .6rem;
      padding: .5rem 0;
    }
    .tip-span{
      // display: inline-block;
      float: right;
      // margin-right: .6rem;
      // font-size: .34rem;
      color: #0b86ff;
    }
  }
  .content-top:after{
    content: " ";
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    height: 1px;
    border-bottom: 1px solid #e5e5e5;
    color: #e5e5e5;
    -webkit-transform-origin: 0 100%;
    transform-origin: 0 100%;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
    width:9.6rem;
  }
  .content-bottom:after{
    content: " ";
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    height: 1px;
    border-bottom: 1px solid #e5e5e5;
    color: #e5e5e5;
    -webkit-transform-origin: 0 100%;
    transform-origin: 0 100%;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
    width:9.6rem;
  }
  .content-bottom{
    padding: .48rem 0;
    position: relative;
    .weui-cell {
      display: flex;
      padding: 0;
      // justify-content: space-between;
      // height: 1.46rem;
      // line-height: 1.46rem;
      height:1rem;
      line-height:1rem;
    }
    .weui-cell__hd {
      width: 3.3rem;
      text-align: left;
      color:#010101;
    }
    .vux-cell-primary{
      width: 6.3rem;
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
    .weui-cell__ft {
      padding-right: 0;
    }
    .weui-cell_access .weui-cell__ft:after {
      display: none;
    }
    .vux-popup-picker-placeholder {
      color: #7b7b7b;
    }
    .vux-popup-picker-select {
      padding-left: 0;
    }
    .apply-detail-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .apply-detail-item {
      width: 3.3rem;
      height:1rem;
      line-height:1rem;
      color:#010101;
      display: inline-block;
    }
    .apply-detail-input {
      flex: 1;
      border: none;
      outline: none;
      color: #7b7b7b;
      display: inline-block;
      width:5.7rem;
      // width: 5.8rem;
      text-align: right;
      // padding-right: 1.2rem;
    }
  }
}
</style>
