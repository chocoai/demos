<template>
  <div class='result' v-if="success">
    <div v-if="result">
      <div v-if="jumpPage === 'rate'">
        <div class="loan-pass">
          <p class="pass font-28">恭喜您，获得预授信额度</p>
          <p class="number font-90"><span class="font-48">&#165</span>{{amount || 0}}</p>
          <p class="mini-rote">最低年利息共计{{yearInterest}}元</p>
        </div>
        <div class="act-frame">
          <div class="rate-text">您当前的日利率为{{startRate}}‱！邀请好友助力，日利率最低砍至{{minimumRate}}‱！</div>
          <!-- <div class="rate-go">
            <img src="../../assets/img_rate.png" alt="img_rate.png" />
            <span class="text">好友助力 一砍到底</span>
            <span class="btn" @click="goRate">参与活动</span>
          </div> -->
          <div class="follow-lrcb">
            <img class="img-lrcb-qr" v-if="qrCodeUrl" @click.prevent="1" :src="qrCodeUrl" alt="lrcb-qr" />
            <p>扫码关注公众号&#8594点击"{{rateProdName}}"&#8594点击活动宣传图</p>
          </div>
        </div>
        <p class="more-tips">届时请您带齐资料前往银行网点哦~</p>
      </div>
      <NjResult v-if="jumpPage === 'bonus'" :branchList="branchList" :prefixUrl= "prefixUrl"></NjResult>
    </div>
    <div class="loan-refuse" v-else>
      <img class="success-img" src="../../assets/loan-refuse.png" alt="success" />
      <p class="submit font-40">{{error ? '审核验证失败' : '审核拒绝'}}</p>
      <p class="wait font-28">{{ error ? '请稍后重试' : '很抱歉，您的信息未通过我行的审核！'}}</p>
      <p class="wait font-28">可联系下方网点进行咨询</p>
    </div>
    <div v-if="jumpPage === 'rate' || !result" class="borrow-bankDot">
      <div v-if="branchList && branchList.length">
        <div class="bankDot-content" v-for="(item, index) in branchList" :key="index">
          <p class="bankDot-title font-40">{{item.bankName}}</p>
          <p class="bankDot-address font-36">{{item.bankAddress}}</p>
          <a class="bankDot-iphone font-36" :href="`tel:${item.bankPhone}`">{{item.bankPhone}}</a>
          <p class="bankDot-time font-36">{{`${item.startTime}-${item.endTime}`}}</p>
        </div>
      </div>
      <v-blank style="height: 100%" v-else>没有网点</v-blank>
    </div>
    <div class="part-act" v-show="isActImg">
      <img @click="isActImg=false" class="img" src="../../assets/img_part_act.png" alt="img_go_act" />
    </div>
  </div>
</template>

<script>
import { finishLoan, getBranchList } from '../../service/getData'
import {citizenAuditRet} from '../../service/citizen'
import VBlank from './../../components/blank'
import Utils from '../../config/utils'
import Config from '../../config/index'
import Store from 'store'
import NjResult from '../../components/citizen/njResult'
// import lrcbQr from '../../assets/img-lrcb-qr-touch.png'
// import preQr from '../../assets/img-citizen-pre-qr-touch.png'
import prefixUrl from '../../config/mixins/prefixUrl'

export default {
  components: {
    VBlank,
    NjResult
  },
  props: ['city'],
  mixins: [prefixUrl],
  data () {
    return {
      branchList: [
        {
          bltName: '潞城支行',
          bltAddress: '山西省潞城市中华大街潞城农商银行兴隆支行',
          telephone: '6763331',
          bltStarttime: '8:30',
          bltEndtime: '16:30'
        },
        {
          bltName: '潞城支行',
          bltAddress: '山西省长治市潞鼎庄园3号商铺（煤校对面）',
          telephone: '3033303',
          bltStarttime: '8:30',
          bltEndtime: '16:30'
        }
      ],
      result: false,
      success: false,
      error: false,    // 接口异常
      enterpriseCode: '',
      isActImg: false,
      amount: 0,
      minimumRate: 0,
      startRate: 0,
      yearInterest: null,
      qrImg: Utils.getReferer(),
      getTime: new Date().getTime()    // 时长统计
      // lrcbQr,
      // preQr
    }
  },
  created () {
    this.$vux.loading.show({
      text: 'Loading'
    })
    const cookies = Store.get(Config.constants.cookies)
    this.loanCode = cookies.loanCode
    this.enterpriseCode = cookies.enterpriseCode
    this.rateProdName = cookies.rateProdName
    this.qrCodeUrl = cookies.qrCodeUrl
    this.jumpPage = cookies.jumpPage
    this.getBranchList()
    this.signFinish()
  },
  mounted () {
    Utils.countPlus('申请成功', 'send')
  },
  destroyed () {
    // Store.clearAll()
    // 删除未完成组件缓存
    Store.remove(Config.constants.citizenFirstStep())
    Utils.countPlus('页面停留时长', 'send', {'pageName': '申请成功', 'stayTime': new Date().getTime() - this.getTime})
  },
  methods: {
    async getBranchList () {
      const that = this
      const res = await getBranchList({enterpriseCode: that.enterpriseCode})
      if (res.code === Config.resCode.success) {
        this.branchList = res.data
      } else {
        that.$vux.loading.hide()
      }
    },
    async signFinish () {
      const that = this
      // 删除未完成组件缓存
      Store.remove(Config.constants.citizenFirstStep())
      // const accreditSign = await getAccreditSign({loanCode: that.loanCode})
      // if (accreditSign.code === Config.resCode.success) {
      //   // 授权成功，不作处理
      //   // return that.$vux.toast.text('授权成功')
      // } else {
      //   // 授权失败
      //   that.$vux.loading.hide()
      //   return that.$vux.toast.text(accreditSign.msg)
      // }
      const res = await citizenAuditRet({reqCode: that.loanCode}, this.city)
      if (res.code === Config.resCode.success) {
        this.result = +res.data.success
        if (+res.data.success) {
          this.amount = res.data && res.data.amount
          this.startRate = res.data && res.data.startRate
          this.minimumRate = res.data && res.data.minimumRate
          this.weChatCode = res.data && res.data.weChatCode
          this.bankCode = res.data && res.data.bankCode
          let monthRate = this.minimumRate * 30 / 10000
          let yearInterest = ((((this.amount * monthRate * Math.pow(1 + monthRate, 12))) / (Math.pow(1 + monthRate, 12) - 1)) * 12 - this.amount) + ''
          this.yearInterest = yearInterest.match(/\./) === null ? yearInterest : yearInterest.substr(0, yearInterest.match(/\./).index)
        }
      } else {
        that.$vux.loading.hide()
        that.success = true
        that.result = false
        that.error = true
        return that.$vux.toast.text(res.msg)
      }
      const final = await finishLoan({code: that.loanCode})
      that.$vux.loading.hide()
      if (final.code === Config.resCode.success) {
        that.success = true
      } else {
        that.$vux.toast.text(final.msg)
      }
    },
    interest (amount, startRate) {
      let monthRate = startRate * 30 / 10000
      return ((((amount * monthRate * Math.pow(1 + monthRate, 12))) / (Math.pow(1 + monthRate, 12) - 1)) * 12 - this.amount) + ''
    }
    // TODO: 若要启用修改referObj
    // goRate () {
    //   const referObj = {
    //     test: 'http://mcwp.test.zhudb.com/tap/home',
    //     pre: 'https://mp-test.zhudb.com/tap/home',
    //     prod: 'https://mp.zhudb.com/tap/home'
    //   }
    //   const refer = Utils.getReferer()
    //   if (Utils.isWeixin()) {
    //     Utils.countPlus('市民贷申请完毕参与活动', 'send')
    //     // TODO
    //     window.location.href = referObj[refer] + '?code=' + this.weChatCode + '&bankCode=' + this.bankCode
    //   } else {
    //     this.isActImg = true
    //   }
    // }
  }
}
</script>

<style lang="less" scoped>
.result {
  background-color: #F5F5F5;
  min-height: 100%;
  .part-act {
    position: fixed;
    left: 0;
    top: 0;
    overflow: hidden;
    width: 100%;
    height: 100vh;
    z-index: 100;
    .img {
      width: 100%;
      height: 100%;
      display: block;
    }
  }
}
.act-frame {
  width: 9.28rem;
  margin: -2.32rem .36rem .64rem .36rem;
  height: 5.2rem;
  padding: 0.64rem .4rem;
  border-radius: .16rem;
  background-color: #fff;
  .rate-text {
    font-size: .4rem;
    color: #333;
    line-height: .72rem;
  }
  .follow-lrcb {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: .36rem;
    color: #666;
  }
  .img-lrcb-qr {
    width: 6.08rem;
    height: 2.4rem;
    margin: .4rem 0 .48rem;
    pointer-events: auto;
  }
  // .rate-go {
  //   position: relative;
  //   margin-top: .3rem;
  //   height: 1.6rem;
  //   line-height: 1.6rem;
  //   width: 100%;
  //   display: flex;
  //   align-items: center;
  //   img {
  //     width: 1.6rem;
  //     height: 1.6rem;
  //   }
  //   .text {
  //     font-size: .4rem;
  //     color: #666;
  //     margin-left: .24rem;
  //   }
  //   .btn {
  //     position: absolute;
  //     right: 0.64rem;
  //     background-color: #fa494b;
  //     display: inline-block;
  //     width: 2.4rem;
  //     height: .88rem;
  //     line-height: .88rem;
  //     text-align: center;
  //     border-radius: .44rem;
  //     font-size: .4rem;
  //     color: #fff;
  //   }
  // }
}
.loan-pass {
  padding-top: 1.12rem;
  display: flex;
  align-items: center;
  flex-direction: column;
  color: #fff;
  height: 5.48+0.88rem;
  background: url(../../assets/loan-success-bg.png) no-repeat;
  background-size: cover;
  .number {
    margin-top: 0.4rem;
  }
  .mini-rote {
    font-size: 0.40rem;
    color: white;
    padding-top: 0.48rem;
  }
}
.more-tips {
  width: 10.08rem;
  height: 1.2rem;
  background-color: #f2f9ff;
  line-height: 1.2rem;
  font-size: 0.4rem;
  color: #218beb;
  padding-left: 1.2rem;
  position: relative;
  margin: 0 0.36rem;
  border-radius: .2rem;
}
.more-tips::before {
  content: "";
  position: absolute;
  width: 0.48rem;
  height: 0.48rem;
  background: url(../../assets/icon_prompt.png) no-repeat;
  background-size: cover;
  top: 0.36rem;
  left: 0.48rem;
}
.borrow-personal-top {
  background: #369bff;
  position: relative;
  width: 100%;
  padding: 0.4rem 0 0.8rem;
  &.loan-refuse-bg {
    background: url(../../assets/loan-refuse-bg.png) no-repeat;
    // background: #369bff;
    background-size: cover;
  }
}
.loan-refuse {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  padding-top: 0.8rem;
  padding-bottom: 1rem;
  .success-img {
    width: 2rem;
    height: 2rem;
    padding-top: 0.5rem;
  }
  .submit {
    margin-top: 0.64rem;
    line-height: 1;
    color: #333;
  }
  .wait {
    margin-top: 0.4rem;
    line-height: 1;
    color: #888;
  }
  .share-btn {
    margin-bottom: 0.8rem;
  }
  .back {
    // margin-top: .2rem;
    line-height: 1;
    padding: 0.8rem 0.2rem;
    color: #369fff;
  }
}
.borrow-bankDot {
  width: 10.2rem;
  // position: absolute;
  // left: 0;
  // right: 0;
  // top: 0;
  // bottom: 0;
  margin: 0.3rem auto;
}
.bankDot-content + .bankDot-content {
  margin-top: 0.3rem;
}
.bankDot-content {
  width: 9.6rem;
  background: #fff;
  padding-left: 0.6rem;
  padding-bottom: 0.4rem;
  position: relative;
  border-radius: 0.3rem;
  .bankDot-title {
    color: #2f2f2f;
    padding: 0.425rem 0;
    position: relative;
  }
  .bankDot-title:after {
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
    width: 9.6rem;
  }
  .bankDot-iphone {
    background: url(../../assets/account-manager-iphone.png) no-repeat 0 center;
    background-size: 0.34rem 0.34rem;
    display: block;
    padding-left: 0.64rem;
    color: #545454;
    margin-top: 0.5rem;
  }
  .bankDot-address::after {
    content: "";
    position: absolute;
    width: 0.34rem;
    height: 0.34rem;
    background-size: 0.34rem 0.34rem;
    right: 0.54rem;
    top: 0.1rem;
  }
  .bankDot-address {
    background: url(../../assets/account-manager-address.png) no-repeat 0 center;
    background-size: 0.34rem 0.34rem;
    padding-left: 0.64rem;
    color: #545454;
    margin-top: 0.42rem;
    position: relative;
  }
  .bankDot-time {
    background: url(../../assets/account-manager-time.png) no-repeat 0 center;
    background-size: 0.34rem 0.34rem;
    padding-left: 0.64rem;
    color: #545454;
    margin-top: 0.42rem;
  }
}
</style>
