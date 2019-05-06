<template>
  <div class="prize-container">
    <div class="prize-content">
      <p class="prize-type">{{awardName}}</p>
      <p class="prize-name">{{prizeName}}</p>
      <div class="prize-detail">
        <img class="prize-img" v-if="cashStatus == 2" src="./../../assets/prize_unActive.png"/>
        <img class="prize-img" v-if="cashStatus == 3" src="./../../assets/prize_active.png"/>
        <img class="prize-img" v-if="cashStatus == 4" src="./../../assets/prize_unTime.png"/>
        <div class="prize-term" v-if="cashStatus == 3||cashStatus == 2">
          <p class="prize-tip">姓名</p>
          <p class="prize-time">{{custName}}</p>
        </div>
        <div class="prize-term" v-if="cashStatus == 3||cashStatus == 2">
          <p class="prize-tip">联系方式</p>
          <p class="prize-time">{{prizePhone}}</p>
        </div>
        <div class="prize-term">
          <p class="prize-tip">兑奖期限</p>
          <p class="prize-time">{{`${formatTime(+prizeTime.split(',')[0])}到${formatTime(+prizeTime.split(',')[1])}`}}</p>
        </div>
        <div class="prize-term">
          <p class="prize-tip">兑奖须知</p>
          <p class="prize-time">{{cashDesc}}</p>
        </div>
      </div>
      <div class="prize-footer">
        <div class="footer-link">
          <p class="link-tip">客服电话</p>
          <a class="link-phone" :href="`tel:${custmerServicePhone}`">{{custmerServicePhone}}</a>
        </div>
        <div class="footer-show">
          <img class="show-code" :src="sharePic"/>
          <div class="show-tip">
            <p class="tip-p">长安识别二维码</p>
            <p class="tip-p">关注公众号</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getLotteryPrdetail } from '../../service/getData'
import Config from '../../config/index'
import sharePic from '../../assets/img_QR.png'
import Utils from '../../config/utils'
export default {
  components: {
  },
  data () {
    return {
      awardName: '',
      prizeName: '',
      cashStatus: '',
      custName: '',
      prizePhone: '',
      prizeTime: '',
      cashDesc: '',
      custmerServicePhone: '',
      sharePic: sharePic
    }
  },
  mounted () {
    const that = this
    // getLotteryQrcode({}).then(res => {
    //   if (res.code === Config.resCode.success) {
    //     console.log(res.data)
    //     if (res.data) {
    //       this.sharePic = res.data.Url
    //     }
    //   } else {
    //     that.$vux.toast.text(res.msg)
    //   }
    // })
    let recordCode = this.$route.params.code
    console.log(recordCode)
    let params = {
      prizeCode: sessionStorage.getItem(Config.constants.wxACTIVITYCODE),
      recordCode: recordCode
    }
    getLotteryPrdetail(params).then(res => {
      if (res.code === Config.resCode.success) {
        console.log(res.data)
        if (res.data) {
          that.awardName = res.data.prize.awardName
          that.prizeName = res.data.prize.prizeName
          that.cashStatus = res.data.prizeCashStatus
          that.custName = res.data.record.custName
          that.prizePhone = res.data.record.telephone
          that.prizeTime = res.data.prize.prizeTime
          that.cashDesc = res.data.prize.cashDesc
          that.custmerServicePhone = res.data.info.custmerServicePhone
        }
      } else {
        that.$vux.toast.text(res.msg)
      }
    })
  },
  methods: {
    next () {
    },
    formatTime (time) {
      return Utils.formatTime(time)
    }
  }
}
</script>


<style lang="less" scoped>
  .prize-container {
    width: 10.8rem;
    height: 100%;
    background: url('./../../assets/turntable_bg.png');
    background-size: cover;
    padding: .5rem 0;
    .prize-content {
      width: 9.84rem;
      height: 94%;
      margin: 0 auto;
      position: relative;
      top: 3%;
      background: url('./../../assets/prize-detail-bg.png');
      background-size: cover;
    }
    .prize-detail {
      margin-top: .5rem;
      position: relative;
      margin-bottom: 2.3rem;
    }
    .prize-img {
      width: 2rem;
      height: 2rem;
      position: absolute;
      top: .16rem;
      right: .4rem;
    }
    .prize-type {
      font-size: .4rem;
      color: #888;
      text-align: center;
      padding-top: .48rem;
    }
    .prize-name {
      font-size: .56rem;
      color: #333;
      padding-top: .4rem;
      text-align: center;
    }
    .prize-term {
      padding: .4rem .72rem 0;
    }
    .prize-tip {
      font-size: .36rem;
      color: #888;
    }
    .prize-time {
      font-size: .4rem;
      color: #333;
      padding-top: .24rem;
    }
    .detail-check {
      background: #fe5559;
      width: 3.44rem;
      height: 1.2rem;
      line-height: 1.2rem;
      border-radius: .6rem;
      font-size: .4rem;
      color: #fff;
      margin-top: .64rem;
      margin-bottom: 1.2rem;
    }
    .prize-footer {
      padding: 0 .72rem;
    }
    .footer-link {
      font-size: .4rem;
      color: #333;
      overflow: hidden;
      height: 1.52rem;
      line-height: 1.52rem;
      border-bottom: 2px solid #dcdcdc;
    }
    .link-tip {
      float: left;
    }
    .link-phone {
      float: right;
      background: url('./../../assets/icon_dial.png') right center no-repeat;
      background-size: .56rem .56rem;
      padding-right: 1.16rem;
      margin-right: .2rem;
      color: #333;
    }
    .footer-show {
      overflow: hidden;
      height: 2.8rem;
      align-items:center;//子元素垂直居中
      display:-webkit-flex;
    }
    .show-code {
      width: 1.6rem;
      height: 1.6rem;
      float: left;
    }
    .show-tip {
      float: left;
      padding-left: .4rem;
      color: #333;
    }
  }
</style>

