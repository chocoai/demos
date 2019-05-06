<template>
  <div class="activity-turntable">
    <p class="today-chance">本日可抽奖 <span class="chance-num">{{todayChance}}</span> 次</p>
    <p class="total-chance" :style="`opacity: ${partnerStatus? 1 : 0}`"><span>{{partnerStatus === 1 ? '分享' : '邀请'}}活动每日最多增加{{partnerTimes}}次机会</span></p>
    <!-- 您共有{{totalChance}}次抽奖机会， -->
    <p class="participate-num">已有{{participateNum}}人参与</p>
    <div class="turntable-main">
      <div class="prize-list" :style="{transform:`rotate(${rotateAngle}deg)`,transition:rotateTransition}">
        <div class="prize-item" v-for="(_ , index) in imgUrlList" :key="index" :style="`transform: rotate(${- 360/turntableNum*index}deg) skew(${Math.abs(90 - 360/turntableNum)}deg);`" >
          <p class="prize-desc" :style="`transform: skew(${-Math.abs(90 - 360/turntableNum)}deg) rotate(${180/turntableNum - 90}deg);`">
            <img :class="`prize-detail-${turntableNum}`" :src = "imgUrlList[index]" alt="award" />
          </p>
        </div>
      </div>
      <img class="turntable-bottom" src='./../../assets/turntable-bottom.png' :style="{transform:`rotate(${sameDir ? rotateAngle : -rotateAngle}deg)`,transition:rotateTransition}" alt='bottom' />
      <div class="button-wrapper">
        <img @click='turntableStart' class="start-button" src='./../../assets/turntable-button.png' alt='start' />
      </div>
    </div>
    <div class="turntable-slider">
      <div v-if="sliderList.length && noticeStatus">
        <tiny-slider :mouse-drag="false" :touch="false" :items="1" :controls = 'false' :autoplayButtonOutput='false' :autoplay='true' :axis='`vertical`'>
          <div v-for = "(item, index) in sliderList" :key = "index">{{item}}</div>
        </tiny-slider>
      </div>
    </div>
    <ul class="detail-wrapper">
      <li class="detail-rule" @click="showPrizeList('tip')">活动说明</li>
      <li class="detail-share" v-if="showShare" @click="showShareTip = true"><img class="share-img" src='./../../assets/turntable_share.png' alt='share' />分享给好友</li>
      <li class="detail-award" @click="showPrizeList('prize')">我的奖品</li>
    </ul>
    <win-cash v-if="showWinCash" @close="reset" @next= "next" :prizeAmount="prizeAmount" :prizeName="prizeName" :prizeType="prizeType"></win-cash>
    <win-prize v-if="showWinPrize" @close="reset" @next= "next" :prizeRecord="prizeRecord"></win-prize>
    <win-sorry v-if="showWinSorry" @close="reset" @share="showShareTip=true" :partnerStatus="partnerStatus" :todayChance="todayChance" :doStart="doStart" @next= "next"></win-sorry>
    <!-- <convert-prize v-if="showWinCash" @close="showWinCash = false" @next= "next"></convert-prize> -->
    <prize-tip v-if="showPrizeTip" @close="showPrizeTip = false" :lotteryInfo="lotteryInfo"></prize-tip>
    <prize-person v-if="showPrizePerson" @close="showPrizePerson = false" @next= "next" :lotteryInfo="lotteryInfo"></prize-person>
    <v-share v-if="showShareTip" @hide="showShareTip=false" :showShareTip="showShareTip"></v-share>
    <check-page v-if="showCheckPage" @hide="showCheckPage=false" :activityCode='code' @render="render"></check-page>
    <Login v-if="showLogin" @success="loginSuccess" @changeTab="changeTab"></Login>
  </div>
</template>

<script>
import awardImg from './../../assets/turntable_award.png'
import cashImg from './../../assets/turntable_cash.png'
import thankyouImg from './../../assets/turntable_thankyou.png'
import WinCash from './../../components/turntable/winCash'
import winPrize from './../../components/turntable/winPrize'
import winSorry from './../../components/turntable/winSorry'
import convertPrize from './../../components/turntable/convertPrize'
import PrizeTip from './../../components/turntable/prizeTip'
import prizePerson from './../../components/turntable/prizePerson'
import TinySlider from '../../components/tinySlider'
import VShare from '../../components/share'
import CheckPage from '../../components/activity/checkPage'
import Config from '../../config/index'
import { postShareTimes, getTurntableDetail, getTurntableDraw, getTurntableSlider, getTurntablePerson, getTurntablePrize, getTurntableDes, getTurntableLimit } from '../../service/getData'
import Utils from '../../config/utils'
import Wxsdk from '../../config/wxJsSdk'
import Store from 'store'
import {getWxLoginStatus} from '../../service/home'
import Login from '../../components/login'

export default {
  components: {
    WinCash,
    winPrize,
    winSorry,
    convertPrize,
    PrizeTip,
    prizePerson,
    TinySlider,
    VShare,
    CheckPage,
    Login
  },
  data () {
    return {
      sameDir: false,       // 外层和内层旋转方向是否相同
      todayChance: null,       // 抽奖机会
      totalChance: null,       // 总共抽奖机会
      participateNum: 1000,  // 参与人数
      startTime: 3,       // 开始时间s
      startNum: 2,        // 开始圈数
      durationTime: 1.4,    // 每次持续时间，建议2s内
      durationNum: 2,     // 每次延长旋转角度
      overTime: 3,       // 结束时间s
      overtNum: 2,        // 结束圈数
      rotateTime: 5,           // 转盘时间s
      turntableNum: 4,    // 转盘扇形数目
      prizeIndex: 2,      // 奖品下标
      prizeType: null,    // 奖品类型
      imgUrlList: [],     // 奖品图片列表
      prizeList: [],      // 奖品列表
      rotateAngle: 0,        // 旋转角度
      rotateNum: 4,           // 默认旋转圈数
      rotateTransition: '',
      flag: false,      // 避免连续点击
      onOff: false,       // 关闭转盘
      sliderList: [],
      showWinCash: false,
      showWinSorry: false,
      doStart: true,        // 能否点击开始
      showWinPrize: false,
      showPrizeTip: false,
      showPrizePerson: false,
      code: Utils.getUrlkey(window.location.search)['activityCode'],
      prizeAmount: 0,
      lotteryInfo: '',
      prizeRecord: null,    // 中奖奖品记录
      // shareStatus: 0,        // 分享是否获得机会
      showShareTip: false,
      showShare: Utils.isWeixin(),
      activeName: null,      // 活动名称
      operateDesc: null,      // 营销描述
      noticeStatus: true,      // 是否开启中奖公告
      shareOpenId: Utils.getUrlkey(window.location.search)['openId'],
      partnerStatus: 0,        // 好友助力状态
      pictureUrl: null,
      partnerTimes: null,        // 助力次数
      timer: null,               // 定时器
      showCheckPage: false,       // 是否展示check页
      joinLimit: false,
      shareUrl: '',      // 分享url
      showLogin: false   // 是否需要登录
    }
  },
  async created () {
    const that = this
    sessionStorage.setItem(Config.constants.wxACTIVITYCODE, that.code)
    const turntableLimit = await getTurntableLimit({activityCode: that.code})
    // 参与资格限制
    if (turntableLimit.code === Config.resCode.success) {
      that.showCheckPage = turntableLimit.data
      that.joinLimit = turntableLimit.data
      if (!that.showCheckPage) that.render()
    }
    // 分享初始化
    const turntableDetailRes = await getTurntableDetail({activityCode: that.code})
    if (turntableDetailRes.code === Config.resCode.success) {
      that.activeName = turntableDetailRes.data.activeName
      document.title = turntableDetailRes.data.activeName
      that.operateDesc = turntableDetailRes.data.operateDesc
      that.pictureUrl = turntableDetailRes.data.pictureUrl
      let cookies = Store.get(Config.constants.cookies)
      // let params = {
      //   title: that.activeName || 'noname',
      //   summary: that.operateDesc || 'notitle',
      //   imgUrl: that.pictureUrl
      // }
      that.shareUrl = `${window.location.origin}${window.location.pathname}?code=${cookies.wxCode}&activityCode=${that.code}&enterpriseCode=${cookies.enterpriseCode}&bankCode=${cookies.bankCode}`
      Wxsdk.wxShareCommon(() => {
        that.showShareTip = false
      }, {
        type: 4,
        activityCode: that.code
      }, that.shareUrl)
    } else {
      that.$vux.toast.text(turntableDetailRes.msg)
    }
  },
  methods: {
    async render () {
      const that = this
       // 请求获取
      const personRes = await getTurntablePerson({activityCode: that.code})
      const sliderListRes = await getTurntableSlider({activityCode: that.code})
      const turntableDetailRes = await getTurntableDetail({activityCode: that.code})
      const PrizeListRes = await getTurntablePrize({activityCode: that.code})

      // 抽奖机会
      if (personRes.code === Config.resCode.success) {
        that.todayChance = personRes.data.todayLeftCount - 0
        that.totalChance = personRes.data.totalLeftCount
        that.participateNum = personRes.data.peopleNum
        that.partnerStatus = personRes.data.partnerStatus - 0
        that.activityStatus = personRes.data.activityStatus - 0
        that.pictureUrl = personRes.data.pictureUrl
        that.partnerTimes = personRes.data.partnerTimes
      } else {
        that.$vux.toast.text(personRes.msg)
      }
      if (PrizeListRes.code === Config.resCode.success) {
        // 转盘奖品
        if (PrizeListRes.data && PrizeListRes.data.length < 2) {
          that.imgUrlList = [awardImg, thankyouImg, cashImg, thankyouImg, cashImg, thankyouImg]
          that.turntableNum = 6
          that.$vux.toast.text('活动存在问题')
        } else {
          let arr = []
          that.prizeList = PrizeListRes.data
          PrizeListRes.data.map(i => {
            // 1为红包，2为礼品，3为积分
            i.prizeType + '' === '1' || i.prizeType + '' === '3' ? arr.push(cashImg) : arr.push(awardImg)
            arr.push(thankyouImg)
          })
          that.imgUrlList = arr
          that.turntableNum = arr.length
        }
      } else {
        that.$vux.toast.text(PrizeListRes.msg)
      }
      // 抽奖列表
      if (sliderListRes.code === Config.resCode.success) {
        sliderListRes.data && sliderListRes.data.map(item => {
          that.sliderList.push(`恭喜${item.custName}抽中${item.prizeName}`)
        })
      } else {
        that.$vux.toast.text(sliderListRes.msg)
      }
      // 活动详情
      if (turntableDetailRes.code === Config.resCode.success) {
        that.activeName = turntableDetailRes.data.activeName
        document.title = turntableDetailRes.data.activeName
        that.operateDesc = turntableDetailRes.data.operateDesc
        that.noticeStatus = turntableDetailRes.data.noticeStatus
        let cookies = Store.get(Config.constants.cookies)
        // let params = {
        //   title: that.activeName || 'noname',
        //   summary: that.operateDesc || 'notitle',
        //   imgUrl: that.pictureUrl
        // }
        if (cookies && cookies.openId) {
          that.shareUrl = `${window.location.origin}${window.location.pathname}?code=${cookies.wxCode}&bankCode=${cookies.bankCode}&authType=${cookies.authType}&activityCode=${that.code}&enterpriseCode=${cookies.enterpriseCode}&openId=${cookies.openId}`
        } else {
          that.shareUrl = `${window.location.origin}${window.location.pathname}?code=${cookies.wxCode}&bankCode=${cookies.bankCode}&authType=${cookies.authType}&activityCode=${that.code}&enterpriseCode=${cookies.enterpriseCode}`
        }
        Wxsdk.wxShareCommon(() => {
          that.showShareTip = false
          // 分享获得机会
          // if (that.shareOpenId) {
            // window.alert(that.shareOpenId)
          postShareTimes({activityCode: that.code}).then(res => {
            if (res.code === Config.resCode.success) {
              that.updateInfo()
            } else {
              that.$vux.toast.text(res.msg)
            }
          })
            // const shareTimesRes = await postShareTimes({activityCode: that.code, openId: that.shareOpenId})
          // }
        }, {
          type: 4,
          activityCode: that.code
        }, that.shareUrl)
      } else {
        that.$vux.toast.text(turntableDetailRes.msg)
      }
    },
    // 获取请求结果
    async getResult () {
      const that = this
      let params = {activityCode: that.code}
      if (that.shareOpenId) params.inviteOpenId = that.shareOpenId
      const drawRes = await getTurntableDraw(params)
      if (drawRes.code === Config.resCode.success) {
        if (drawRes.data) {
          // 中奖
          if (drawRes.data.lotteryStatus + '' === '3') {
            that.onOff = true
            // 奖品列表
            that.prizeList.map((item, index) => {
              if (item.code === drawRes.data.prize.code) that.prizeIndex = index * 2
            })
            that.prizeType = drawRes.data.prize.prizeType

            // to do 礼品
            if (drawRes.data.prize.prizeType === '2') {
              // that.prizeAmount = drawRes.data.prize.prizeAmount
              that.prizeRecord = drawRes.data.record
              that.winPrizeCode = drawRes.data.record.code
            }
            // to do 积分
            if (drawRes.data.prize.prizeType === '3') {
              that.prizeAmount = drawRes.data.prize.prizeAmount
              that.prizeName = drawRes.data.prize.prizeName
              that.winPrizeCode = drawRes.data.record.code
            }
            // 红包
            if (drawRes.data.prize.prizeType === '1') {
              that.prizeAmount = drawRes.data.prize.prizeAmount
              that.winPrizeCode = drawRes.data.record.code
            }
          } else {
            // 除了中奖全是未中奖
            that.onOff = true
            that.prizeIndex = Math.ceil(Math.random(that.turntableNum / 2)) * 2 - 1
            that.prizeType = null
          }
          // 未中奖，随机挑选未中奖
          // if (drawRes.data.lotteryStatus + '' === '4') {
          //   that.onOff = true
          //   that.prizeIndex = Math.ceil(Math.random(that.turntableNum / 2)) * 2 - 1
          //   that.prizeType = null
          //   // that.shareStatus = drawRes.data.shareStatus
          // }
        }
      } else {
        that.onOff = true
        that.prizeIndex = Math.ceil(Math.random(that.turntableNum / 2)) * 2 - 1
        that.prizeType = null
        that.$vux.toast.text(drawRes.msg)
      }
      // 获取最新数据
      that.updateInfo()
      // const personRes = await getTurntablePerson({activityCode: that.code})
      // if (personRes.code === Config.resCode.success) {
      //   that.todayChance = personRes.data.todayLeftCount - 0
      //   that.totalChance = personRes.data.totalLeftCount
      //   that.participateNum = personRes.data.peopleNum
      // } else {
      //   that.$vux.toast.text(personRes.msg)
      // }
      // setTimeout(() => {
      //   // 要设置项
      //   that.onOff = true
      //   that.prizeIndex = 4
      // }, 2000)
    },
    // 获取最新数据
    async updateInfo () {
      const that = this
      // 获取最新数据
      const personRes = await getTurntablePerson({activityCode: that.code})
      if (personRes.code === Config.resCode.success) {
        that.todayChance = personRes.data.todayLeftCount - 0
        that.totalChance = personRes.data.totalLeftCount
        that.participateNum = personRes.data.peopleNum
        that.partnerStatus = personRes.data.partnerStatus - 0
        that.activityStatus = personRes.data.activityStatus - 0
        that.pictureUrl = personRes.data.pictureUrl
        that.partnerTimes = personRes.data.partnerTimes
      } else {
        that.$vux.toast.text(personRes.msg)
      }
    },
    // 开始
    turntableStart () {
      const that = this
      if (that.activityStatus === 3) return that.$vux.toast.text('活动已结束')
      if (that.flag) return true
      // 没有抽奖次数无法点击
      if (!that.todayChance) {
        that.showWinSorry = true
        that.doStart = false
        return true
      }
      that.flag = true
      that.getResult()
      that.rotateTransition = `transform ${that.startTime}s ease-in`
      that.rotateAngle = that.startNum * 360
      Utils.countPlus('点击“点击抽奖”', 'send')
      setTimeout(() => {
        that.turntableDuration()
      }, that.startTime * 1000)
    },
    // 持续
    turntableDuration () {
      const that = this
      that.rotateTransition = `transform ${that.durationTime}s linear`
      that.rotateAngle = that.durationNum * 360 + that.rotateAngle
      that.timer = setInterval(() => {
        if (that.onOff) {
          clearInterval(that.timer)
          that.turntableOver()
          return
        }
        that.rotateAngle = that.durationNum * 360 + that.rotateAngle
      }, that.durationTime * 1000)
    },
    // 结束
    turntableOver () {
      const that = this
      let time
      if (that.prizeIndex * 360 / that.turntableNum > 180) {
        time = that.overTime - 1 + that.prizeIndex / that.turntableNum
        that.rotateTransition = `transform ${time}s ease-out`
        that.rotateAngle = that.rotateAngle + (that.overtNum * 360 - 360) + (90 - 180 / that.turntableNum) + that.prizeIndex * 360 / that.turntableNum
      } else {
        time = that.overTime + that.prizeIndex / that.turntableNum
        that.rotateTransition = `transform ${time}s ease-out`
        that.rotateAngle = that.rotateAngle + that.overtNum * 360 + (90 - 180 / that.turntableNum) + that.prizeIndex * 360 / that.turntableNum
      }
      setTimeout(() => {
        // 这里设置出现奖项
        if (that.prizeType === '1') that.showWinCash = true
        if (that.prizeType === '3') that.showWinCash = true
        if (that.prizeType === '2') that.showWinPrize = true
        if (!that.prizeType) that.showWinSorry = true
      }, time * 1000)
    },
    // to do 重置
    reset () {
      const that = this

      that.rotateAngle = 0
      that.rotateTransition = ''
      that.flag = false
      that.onOff = false
      that.prizeIndex = ''
      that.prizeAmount = 0
      that.showWinCash = false
      that.showWinSorry = false
      that.showWinPrize = false
    },
    async next (cashStatus, recordCode) {
      const that = this
      let res = await getWxLoginStatus()
      if ((!res.data || !res.data.telephone) && (that.showWinCash || that.showWinPrize)) {
        this.showLogin = true
      } else {
        if (cashStatus === '0' || !cashStatus) {
          Utils.countPlus('抽奖活动点击“领取奖品”', 'send')
          if (recordCode) {
            if (that.joinLimit) {
              that.$router.push(`${Config.constants.activityPrize}/${recordCode}/limit?activityCode=${this.code}`)
            } else {
              that.$router.push(`${Config.constants.activityPrize}/${recordCode}/cash`)
            }
          } else {
            if (that.joinLimit) {
              that.$router.push(`${Config.constants.activityPrize}/${that.winPrizeCode}/limit?activityCode=${this.code}`)
            } else {
              that.$router.push(`${Config.constants.activityPrize}/${that.winPrizeCode}/cash`)
            }
          }
        } else {
          that.$router.push(`${Config.constants.prizeDetail}/${recordCode}`)
        }
      }
    },
    async showPrizeList (type) {
      const that = this
      const turntableDes = await getTurntableDes({activityCode: that.code})
      if (turntableDes.code === Config.resCode.success) {
        that.lotteryInfo = turntableDes.data
        if (type === 'prize') that.showPrizePerson = true
        if (type === 'tip') that.showPrizeTip = true
      } else {
        that.$vux.toast.text(turntableDes.msg)
      }
    },
    loginSuccess () {
      this.showLogin = false
      this.next()
    },
    changeTab () {
      this.showLogin = false
    }
  }
}
</script>

<style lang="less" scoped>
.activity-turntable {
  display: flex;
  position: relative;
  flex-direction: column;
  align-items: center;
  width: 10.8rem;
  /*height: 100vh;*/
  min-height: 100vh;
  background: url('./../../assets/turntable_bg.png');
  background-size: 100%;
  font-family: YouYuan;
  color: #fff;
  /*overflow: hidden;*/
  .today-chance {
    line-height: 1;
    padding-top: 0.6rem;
    font-size: 0.48rem;
  }
  .chance-num {
    font-size: 0.64rem;
    color: #13ffa9;
  }
  .total-chance {
    line-height: 0.8rem;
    height: 0.8rem;
    font-size: 0.32rem;
    padding: 0 0.48rem;
    margin-top: 0.48rem;
    border-radius: 0.4rem;
    background: rgba(255, 255, 255, 0.2);
  }
  .participate-num {
    padding-top: 0.44rem;
    font-size: 0.36rem;
  }
  .turntable-main {
    position: absolute;
    left: 0;
    right: 0;
    top: 5.2rem;
    width: 8.08rem;
    height: 8.08rem;
    // border: .2rem solid #FF4500;
    border-radius: 50%;
    margin: auto;
  }
  .prize-list {
    position: absolute;
    left: 0;
    right: 0;
    width: 8.08rem;
    height: 8.08rem;
    border-radius: 50%;
    overflow: hidden;
    z-index: 100;
    // background: #FFD700;
  }
  .prize-item {
    position: absolute;
    top: 0;
    left: 0;
    width: 50%;
    height: 50%;
    transform: skew(30deg);
    transform-origin: 100% 100%;
    border: 1px solid #ff6349;
    box-sizing: border-box;
  }
  .prize-item:nth-of-type(odd) {
    background-color: #fbe9c5;
  }
  .prize-item:nth-of-type(even) {
    background-color: #f3c7a4;
  }
  .prize-desc {
    position: absolute;
    // left: 4rem;
    left: 0;
    right: 0;
    // top: 4rem;
    padding-top: 0.24rem;
    width: 8.08rem;
    height: 8.08rem;
    text-align: center;
    box-sizing: border-box;
    transform: skew(-30deg) rotate(-60deg);
  }
  // .prize-item::before {
  //   content: '';
  //   position: absolute;
  //   right: 0;
  //   top: -2rem;
  //   margin: auto;
  //   width: 1px;
  //   height: 10rem;
  //   background-color: #7B68EE;
  // }
  .prize-detail-4 {
    width: 2.2rem;
    height: 2.2rem;
  }
  .prize-detail-6 {
    width: 1.8rem;
    height: 1.8rem;
  }
  .prize-detail-8 {
    width: 1.6rem;
    height: 1.6rem;
  }
  .prize-detail-10 {
    width: 1.4rem;
    height: 1.4rem;
  }
  .turntable-bottom {
    position: absolute;
    left: -1.36rem;
    top: -1.36rem;
    width: 10.8rem;
    height: 10.8rem;
  }
  .button-wrapper {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background: url("./../../assets/turntable-pointer.png") center center;
    background-size: 5.52rem;
    width: 5.52rem;
    height: 5.52rem;
    z-index: 101;
  }
  .start-button {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 2.44rem;
    height: 2.44rem;
    z-index: 101;
    pointer-events: auto;
  }
  .turntable-slider {
    margin-top: 11.2rem;
    font-size: 0.32rem;
    overflow: hidden;
  }
  .detail-wrapper {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-top: 0.3rem;
    font-size: 0.32rem;
  }
  .detail-rule,
  .detail-award {
    margin-top: 0.07rem;
    width: 1.94rem;
    height: 0.82rem;
    line-height: 0.82rem;
    text-align: center;
    color: #6c5ef8;
    background-color: #fff;
    pointer-events: auto;
  }
  .detail-share {
    width: 3.2rem;
    height: 0.96rem;
    line-height: 0.96rem;
    text-align: center;
    /*pointer-events: auto;*/
  }
  .share-img {
    width: 0.48rem;
    height: 0.48rem;
    vertical-align: middle;
    padding-right: 0.24rem;
    /*pointer-events: auto;*/
  }
  .detail-rule {
    padding-right: 0.16rem;
    border-top-right-radius: 0.41rem;
    border-bottom-right-radius: 0.41rem;
    /*pointer-events: auto;*/
  }
  .detail-award {
    padding-left: 0.16rem;
    border-top-left-radius: 0.41rem;
    border-bottom-left-radius: 0.41rem;
    /*pointer-events: auto;*/
  }
}
</style>
