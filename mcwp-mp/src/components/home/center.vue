<template>
  <div class="center-container">
    <div class="limit" v-if="baseInfo.creditAmount && baseInfo.dailyRate">
      <span class="limit-text">授信额度 (元) </span>
      <p class="limit-num">{{thousandBitSeparator(baseInfo.creditAmount)}}</p>
      <span class="limit-text">日利率万分之{{parseInt(baseInfo.dailyRate*100000000) /1000000}}</span>
    </div>
    <div class="limit" v-else>
      <span class="limit-text">授信额度 (元) </span>
      <p class="limit-num">暂无额度</p>
    </div>
    <div class="score">
      <div class="score-position">
        <div class="score-t">
          当前积分
          <span class="score-num">{{baseInfo.score}}</span>
        </div>
        <div>
          <span class="score-li score-li-01" @click="score('1')">积分明细</span>
          <span class="score-li score-li-02" @click="score('2')">积分排行榜</span>
          <span class="score-li score-li-03" @click="score('3')">积分兑换</span>
        </div>
      </div>
    </div>
    <ul class="list">
      <div class="li-bg">
        <li class="list-bg" v-if="!didContainModule('wdjk')">
          <div class="list-click touched-bg border-bottom" @click="moduleAction('1')">
            <span class="left icon-01">我的借款</span>
          </div>
        </li>
        <li class="list-bg border-bottom" v-if="!didContainModule('wyte')">
          <div class="list-click touched-bg" @click="moduleAction('2')">
            <span class="right icon-02">我要提额</span>
          </div>
        </li>
        <li class="list-bg" v-if="!didContainModule('grxx')">
          <div class="list-click touched-bg" @click="moduleAction('3')">
            <span class="right icon-04">个人信息</span>
          </div>
        </li>
      </div>
      <div class="li-bg">
        <li class="list-bg border-bottom list-margin-top">
          <div class="list-click touched-bg border-bottom" @click="moduleAction('4')">
            <span class="left icon-05">我的活动</span>
          </div>
          <div class="list-click touched-bg border-bottom" @click="moduleAction('5')">
            <span class="right icon-06">问题中心</span>
          </div>
        </li>
        <li class="list-bg list-margin-bottom" v-if="didContainModule('sjrz') || didContainModule('tgewm') ">
          <div class="list-click touched-bg" v-if="baseInfo.merchantStatus != 99 && didContainModule('sjrz')">
            <div class="icon-07 high" @click="moduleAction('6')">
              <span class="right">商家入驻</span>
              <span class="hint">{{sjrzStatus}}</span>
            </div>
          </div>
          <div class="list-click touched-bg" v-if="baseInfo.merchantStatus == 99 && didContainModule('sjrz')">
            <div class="icon-07 high" @click="moduleAction('7')">
              <span class="right">商家入驻</span>
            </div>
          </div>
          <div class="list-click touched-bg" v-if="baseInfo.merchantStatus == 2 && didContainModule('tgewm')" @click="moduleAction('8')">
            <span class="right icon-08">推广二维码</span>
          </div>
        </li>
      </div>
    </ul>
    <div class="service">
      <h2 class="service-title">我的专属客服</h2>
      <ul class="service-list" v-if="baseInfo.managerName && baseInfo.managerPhone">
        <li class="service-li">
          <p class="service-stitle">{{baseInfo.managerName}}</p>
          <a class="service-phone" :href="getFullPhone(baseInfo.managerPhone)">{{baseInfo.managerPhone}}</a>
          <a class="icon-phone" :href="getFullPhone(baseInfo.managerPhone)"></a>
        </li>
      </ul>
      <ul class="service-list" v-else>
        <li v-for="branch in baseInfo.branchWebsites" :key="branch.code" class="service-li">
          <p class="service-stitle">{{branch.bankName}}</p>
          <a class="service-phone" :href="getFullPhone(branch.bankPhone)">{{branch.bankPhone}}</a>
          <a class="icon-phone" :href="getFullPhone(branch.bankPhone)"></a>
        </li>
      </ul>
    </div>
    <p class="change-user">切换账号</p>
  </div>
</template>

<script>
import { thousandBitSeparator } from '@/utils/'
import { getWxInfoModule } from '@/services/mcwp/user'

export default {
  props: ['baseInfo'],
  data () {
    return {
      thousandBitSeparator,
      mkLists: [],
      scdj: 0, // 数仓对接  1 未对接  2 对接
      sjrzStatus: '' // 商家入驻状态
    }
  },
  created () {
    if (!this.baseInfo || !this.baseInfo.telephone) this.$emit('login')
    this.getBaseInfoModule()
  },
  mounted () {
    let sjrzList = ['已解除合作', '审核中', '已入驻', '入驻失败']
    if (!this.baseInfo && !this.baseInfo.merchantStatus) {
      this.sjrzStatus = sjrzList[this.baseInfo.merchantStatus]
    }
  },
  methods: {
    async getBaseInfoModule () {
      let res = await getWxInfoModule()
      let scdjList = res.data.scdj
      this.scdj = scdjList[0].ddValue
      this.mkLists = res.data.wxmk
    },
    didContainModule (str) {
      if (str != null) {
        for (let i = 0; i < this.mkLists.length; i++) {
          let text = this.mkLists[i].ddValue
          if (text === str) {
            return true
          }
        }
        return false
      } else {
        return false
      }
    },
    getFullPhone (str) {
      return 'tel' + str
    },
    score (scoreType) {
      if (scoreType === '1') {
        this.$router.push('/pages/score/scoreDetail')
      } else if (scoreType === '2') {
        this.$router.push('/pages/score/scoreRank')
      }
    },
    moduleAction (moduleType) {
      if (moduleType === '3') {
        this.$router.push('/pages/home/myInfo')
      }
      if (moduleType === '5') {
        this.$router.push('/pages/home/problem')
      }
    }
  }
}
</script>

<style lang="less">
  .center-container{
    display: flex;
    flex-direction: column;
    width: 10.8rem;
    margin: 0 auto 1.4rem;
    background: #fafafa;
    padding-bottom: 0.96rem;
    .limit {
      width: 100%;
      height: 4.64rem;
      background: #fa494b;
      padding-bottom: 0.6rem;
      color: #fff;
      text-align: center;
      .limit-num {
        height: 1.28rem;
        font-size: 1.28rem;
        margin: 0;
      }
      .limit-text{
        display: block;
        height: 0.4rem;
        font-size: 0.4rem;
        padding: 0.6rem 0;
      }
    }
    .score {
      width: 10.8rem;
      height: 3.2rem;
      margin: 0 auto;
      position: relative;
      .score-position {
        width: 10rem;
        border-radius: 0.16rem;
        background: #fff;
        padding-bottom: 0.32rem;
        position: absolute;
        margin: 0 auto;
        left: 0;
        right: 0;
        top: -0.8rem;
        text-align: center;
        .score-t {
          font-size: 0.44rem;
          color: #333;
          margin-top: 0.72rem;
          .score-num {
            font-size: 0.64rem;
            color: #fa494b;
          }
        }
        .score-li {
          margin: 0.4rem 0.76rem 0 0;
          display: inline-block;
          width: 2.56rem;
          font-size: 0.44rem;
          color: #666;
          padding: 0.96rem 0 0.24rem;
        }
        .score-li-01 {
          position: relative;
          background: url(../../assets/icon_detail.png) 1rem 0.24rem no-repeat;
          background-size: 0.56rem 0.56rem;
        }
        .score-li-02 {
          position: relative;
          background: url(../../assets/icon_rank.png) 1rem 0.24rem no-repeat;
          background-size: 0.56rem 0.56rem;
        }
        .score-li-03 {
          position: relative;
          background: url(../../assets/icon_center_dui.png) 1rem 0.24rem no-repeat;
          background-size: 0.56rem 0.56rem;
          margin-right: 0;
        }
      }
    }
    .list {
      margin-top: 0.32rem;
      overflow-x: auto;
      .border-bottom {
        position: relative;
      }
      .border-bottom:after {
        height: 1px;
        content: '';
        width: 100%;
        border-bottom: 1px solid #eee;
        position: absolute;
        bottom: 0;
        right: 0;
        transform: scaleY(0.5);
        -webkit-transform: scaleY(0.5);
      }
      .li-bg {
        background: #fff;
        overflow: hidden;
        margin-top: 0.32rem;
      }
      .list-bg {
        display: flex;
        background: #fff;
        height: 2.08rem;
        line-height: 2.08rem;
        float: left;
        .list-click {
          position: relative;
          display: inline-block;
          padding: 0.52rem 0;
        }
        .left,
        .right {
          display: block;
          width: 4.1rem;
          height: 1.04rem;
          line-height: 1.04rem;
          text-align: left;
          padding-left: 1.28rem;
          color: #333;
          font-size: 0.48rem;
          font-weight: 600;
        }
        .high {
          height: 1.34rem !important;
          line-height: 0 !important;
          width: 4rem;
          padding-left: 1.28rem;
          border-right: 0.02rem #eee solid;
          text-align: left;
          .right {
            text-align: left;
            padding-left: 0;
            color: #333;
            font-size: 0.48rem;
            font-weight: 600;
          }
          .hint {
            text-align: left;
            font-size: 0.38rem;
            color: #999;
          }
        }
        .left {
          border-right: 0.02rem #eee solid;
        }
        .icon-01 {
          background: url(../../assets/icon_jiekuan.png) 0.48rem 0.26rem no-repeat;
          background-size: 0.48rem 0.48rem;
        }
        .icon-02 {
          background: url(../../assets/icon_increase.png) 0.48rem 0.26rem no-repeat;
          background-size: 0.48rem 0.48rem;
        }
        .icon-03 {
          background: url(../../assets/icon_zijin.png) 0.48rem 0.26rem no-repeat;
          background-size: 0.48rem 0.48rem;
        }
        .icon-04 {
          background: url(../../assets/icon_mycenter.png) 0.48rem 0.26rem no-repeat;
          background-size: 0.48rem 0.48rem;
        }
        .icon-05 {
          background: url(../../assets/icon_huodong.png) 0.48rem 0.26rem no-repeat;
          background-size: 0.48rem 0.48rem;
        }
        .icon-06 {
          background: url(../../assets/icon_problem.png) 0.48rem 0.26rem no-repeat;
          background-size: 0.48rem 0.48rem;
        }
        .icon-07 {
          background: url(../../assets/icon_merchant.png) 0.48rem 0.26rem no-repeat;
          background-size: 0.48rem 0.48rem;
        }
        .icon-08 {
          background: url(../../assets/icon_center_qr.png) 0.48rem 0.26rem no-repeat;
          background-size: 0.48rem 0.48rem;
        }
      }
      .list-margin-top {
        margin: 0.32rem 0 0;
      }
      .list-margin-bottom {
        margin: 0 0 0.32rem;
      }
    }
    .service {
      background: #fff;
      text-align: center;
      padding-bottom: 0.36rem;
      margin-top: 0.32rem;
      .service-title {
        font-size: 0.44rem;
        color: #333;
        margin: 0.5rem 0.4rem;
        text-align: left;
        font-weight: 600;
      }
      .service-list {
        overflow: auto;
        white-space: nowrap;
        display: flex;
        .service-li {
          display: inline-block;
          text-align: left;
          min-width: 4.8rem;
          height: 2.12rem;
          background: #fafafa;
          border-radius: 0.16rem;
          margin-left: 0.24rem;
          .service-stitle {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 0.4rem;
            color: #333;
            margin: 0.48rem 0.4rem 0.2rem 0.4rem;
          }
          .service-phone {
            display: inline-block;
            height: 0.4rem;
            font-size: 0.36rem;
            color: #666;
            padding: 0 0.2rem 0.02rem 0.32rem;
            vertical-align: bottom;
          }
          .icon-phone {
            display: inline-block;
            vertical-align: bottom;
            width: 0.4rem;
            height: 0.4rem;
            background: url(../../assets/icon_phone.png) 0 0 no-repeat;
            background-size: 0.4rem 0.4rem;
          }
        }
      }
    }
    .change-user {
      width: 10.8rem;
      height: 1.44rem;
      line-height: 1.44rem;
      color: #fa494b;
      font-size: 0.4rem;
      background: #fff;
      margin-top: 0.32rem;
      text-align: center;
    }
  }
</style>
