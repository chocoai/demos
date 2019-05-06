<template>
  <div class="loanDetail-container">
    <div class="loanPass-content" v-if="detail.loanStatus && detail.loanStatus != 3">
      <ul class="loanRefuse-ul">
        <li class='loanRefuse-detail-content content-top'>
          <div class="loanRefuse-left font-32">贷款进度：<span class="apply-adopt" :class="{'apply-wait':detail.loanStatus == 1, 'apply-pass':detail.loanStatus == 2, 'apply-other':detail.loanStatus == 4 || detail.loanStatus == 5}">{{detail.loanStatusText}}</span></div>
          <div class="loanRefuse-right font-32">{{formatTime(detail.createDate)}}</div>
        </li>
        <li class='loanRefuse-detail-content content-val'>
          <p class="content-title font-44">借款金额（元）</p>
          <p class="content-num font-90">{{detail.borrowMoney}}</p>
          <p class="content-action font-36">该笔额度分{{detail.repaymentPeriod}}期还款</p>
        </li>
        <li class='loanRefuse-detail-content content-middle' @click="next('repay')">
          <p class="content-title font-36">还款计划<span class="title-val">{{detail.repaymentPeriod}}期</span></p>
        </li>
        <li class='content-bottom font-32'>
          <flexbox orient="vertical">
            <flexbox-item>
              <div class="flex-demo">
                <flexbox>
                  <flexbox-item :span="3"><div class="purpose-title content-title">借款明细</div></flexbox-item>
                </flexbox>
              </div>
            </flexbox-item>
            <flexbox-item>
              <div class="flex-demo">
                <flexbox>
                  <flexbox-item :span="3"><div class="purpose-title">借款金额</div></flexbox-item>
                  <flexbox-item><div class="purpose-val">{{detail.borrowMoney}}元</div></flexbox-item>
                </flexbox>
              </div>
            </flexbox-item>
            <flexbox-item>
              <div class="flex-demo">
                <flexbox>
                  <flexbox-item :span="3"><div class="purpose-title">合同期限</div></flexbox-item>
                  <flexbox-item><div class="purpose-val">{{detail.contractPeriod || '--'}}</div></flexbox-item>
                </flexbox>
              </div>
            </flexbox-item>
            <flexbox-item>
              <div class="flex-demo">
                <flexbox>
                  <flexbox-item :span="3"><div class="purpose-title">还款方式</div></flexbox-item>
                  <flexbox-item><div class="purpose-val">{{detail.repaymentKindText}}</div></flexbox-item>
                </flexbox>
              </div>
            </flexbox-item>
            <flexbox-item v-if="showLoanContract">
              <div class="flex-demo">
                <flexbox>
                  <flexbox-item :span="3"><div class="purpose-title">借款合同</div></flexbox-item>
                  <flexbox-item><div class="purpose-val purpose-view" @click="contract">查看</div></flexbox-item>
                </flexbox>
              </div>
            </flexbox-item>
          </flexbox>
        </li>
      </ul>
    </div>
    <div class="product-loanDetail" v-if="detail.loanStatus == 3">
      <div class="loanDetail-list loanDetail-refuse-list">
        <flexbox orient="vertical" :gutter="0" @click.native="next(item.code)">
          <flexbox-item>
            <div class="flex-refuse">
              <div class="loanDetail-list-top">
                <flexbox :gutter="0">
                  <flexbox-item>
                    <div class="loanDetail-list-content content-left">
                      <flexbox orient="vertical">
                        <flexbox-item>
                          <div class="loanDetail-list-num">{{detail.borrowMoney}}元</div>
                        </flexbox-item>
                        <flexbox-item>
                          <div class="loanDetail-list-tip">还款期数</div>
                        </flexbox-item>
                      </flexbox>
                    </div>
                  </flexbox-item>
                  <flexbox-item>
                    <div class="loanDetail-list-content content-middle-refuse">
                      <flexbox orient="vertical">
                        <flexbox-item>
                          <div class="loanDetail-list-num">{{detail.repaymentKindText}}</div>
                        </flexbox-item>
                        <flexbox-item>
                          <div class="loanDetail-list-tip">还款方式</div>
                        </flexbox-item>
                      </flexbox>
                    </div>
                  </flexbox-item>
                  <flexbox-item>
                  <div class="loanDetail-list-content content-right">
                    <flexbox orient="vertical">
                    <flexbox-item>
                      <div class="loanDetail-list-num">{{detail.repaymentPeriod}}期</div>
                    </flexbox-item>
                    <flexbox-item>
                      <div class="loanDetail-list-tip">还款期数</div>
                    </flexbox-item>
                    </flexbox>
                  </div>
                  </flexbox-item>
                </flexbox>
                </div>
            </div>
          </flexbox-item>
          <flexbox-item>
            <div class="loanDetail-result">
              <p>贷款进度：<span class="loanDetail-result-word">{{detail.loanStatusText}}</span><span class="loanDetail-result-time">{{formatTime(detail.createDate)}}</span></p>
            </div>
          </flexbox-item>
        </flexbox>
      </div>
      <div class="loanDetail-refuse">
        <div class="refuse-content">
          <p class="loanDetail-refuse-title">拒绝理由</p>
          <p class="loanDetail-refuse-p">{{detail.rejectReason}}</p>
        </div>
      </div>
      </div>
    </div>
</template>

<script>
import VButton from './../../components/button'
import { PopupPicker, Flexbox, FlexboxItem, Divider } from 'vux'
import Utils from '../../config/utils'
import Config from '../../config/index'
import { loanDetail, getDictValueAll } from '../../service/getData'
import Sto from 'store'

export default {
  components: {
    VButton,
    PopupPicker,
    Flexbox,
    FlexboxItem,
    Divider
  },
  data () {
    return {
      detail: {}
    }
  },
  methods: {
    async getInfo () {
      Sto.remove('MCWP_LOAN_SELECT')
      let dic = await getDictValueAll({code: 'hkqs'})
      let res = await loanDetail({code: this.$route.params.code})
      if (+dic.code === 0) {
        dic = dic.data.hkqs
      }
      if (+res.code === 0) {
        this.detail = res.data
        this.showLoanContract = res.data.auth
        // document.title = '成功'
        let params = {
          borrowMoney: res.data.borrowMoney,
          repaymentKind: res.data.repaymentKind,
          repaymentPeriod: dic.filter((item) => (item.ddText) === res.data.repaymentPeriod)[0]['ddValue'],
          borrowUse: res.data.borrowUse,
          bankName: res.data.bankName,
          bankNo: res.data.bankNo,
          borrowCode: this.$route.params.code
        }
        Sto.set('MCWP_LOAN_SELECT', params)
      } else {
        alert(res.msg)
      }
    },
    formatTime (createDate) {
      return Utils.formatTime(createDate)
    },
    next (type) {
      const that = this
      if (type === 'repay') {
        that.$router.push(Config.constants.repayPlanRouter + that.$route.params.code)
      }
    },
    contract () {
      this.$router.push(Config.constants.boContractRouter)
    }
  },
  created () {
    this.getInfo()
  }
}
</script>

<style lang="less" scoped>
.loanDetail-container{
  width: 10.2rem;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: .3rem auto;
  .loanPass-content{
    width: 9rem;
    font-size: .44rem;
    background: #fff;
    padding: 0 .6rem;
    border-radius: .3rem;
    height:100%;
  }
  .content-top{
    display: flex;
    justify-content: space-between;
    padding: .2rem 0;
    height: 1.36rem;
    line-height: 1.36rem;
    color: #7b7b7b;
  }
  .apply-pass {
    color: #0ea51f;
  }
  .apply-wait {
    color: #369bff;
  }
  .content-val{
    text-align: center;
    padding: .6rem 0;
    .content-title{
      color: #010101;
    }
    .content-num{
      color: #222;
      padding-top: .2rem;
    }
    .content-action{
      color: #999;
      padding-top: .2rem;
    }
  }
  .content-bottom{
    padding-top: .2rem;
    border-bottom: none;
    .purpose-title{
      color: #4c4c4c;
    }
    .content-title{
      color: #010101;
    }
    .purpose-val{
      color: #0a0a0a;
      text-align: right;
    }
    .purpose-view{
      color: #369bff;
    }
    .loanRefuse-right{
      text-align: right;
      padding-right: .6rem;
    }
    .vux-flexbox-item{
      margin-top: .2rem !important;
    }
  }
  .content-middle{
    height: 1.6rem;
    line-height: 1.6rem;
    color: #010101;
    position: relative;
    .content-title::after{
      content: "";
      position: absolute;
      width: .34rem;
      height: .34rem;
      background: url(../../assets/account-manager-view.png) no-repeat;
      background-size: cover;
      right: 0;
      top: .62rem;
    }
    .title-val{
      color: #7b7b7b;
      // display: inline-block;
      float: right;
      margin-right: .84rem;
    }
  }
  .content-middle-refuse {
    height: 1.6rem;
    color: #010101;
    font-size: .4rem;
    position: relative;
    .loanDetail-list-num {
      text-align: center;
    }
    .loanDetail-list-tip {
      text-align: center;
    }
    .content-title::after{
      content: "";
      position: absolute;
      width: .34rem;
      height: .34rem;
      background: url(../../assets/account-manager-view.png) no-repeat;
      background-size: cover;
      right: .54rem;
      top: .62rem;
    }
    .title-val{
      color: #7b7b7b;
      // display: inline-block;
      float: right;
      margin-right: 1.38rem;
    }
  }
  .loanRefuse-detail-content:after{
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
  .loanRefuse-detail-content{
    position: relative;
    .apply-wait {
      color: #369bff;
    }
    .apply-pass {
      color: 0ea51f;
    }
    .apply-other {
      color: #8a8a8a;
    }
    .purpose-title{
      color: #4c4c4c;
    }
    .purpose-val{
      font-size: .36rem;
      color: #0a0a0a;
      text-align: right;
    }
    .purpose-view{
      font-size: .36rem;
      color: #369bff;
    }
    .loanRefuse-right{
      text-align: right;
      // padding-right: .6rem;
    }
  }
  .loanDetail-list{
    // width:10.12rem;
    height: 4.16rem;
    background: #fff;
    padding: 0.3rem 0;
    margin: 0 auto;
    .loanDetail-list-top{
      height: 1.46rem;
      width: 8.92rem;
      // position: relative;
      // float: right;
      // border-bottom: 1px solid #dcdcdc;
      // padding-top: .6rem;
      // padding-bottom: .6rem;
      // padding-right: .6rem;
      padding: .6rem .6rem .6rem 0;
      .loanDetail-list-num{
        font-size: 0.56rem;
        color: #010101;
      }
      .loanDetail-list-tip{
        font-size: 0.44rem;
        color: #000;
        margin-top: .3rem;
      }
      .content-left{
        .loanDetail-list-num,.loanDetail-list-tip{
          text-align: left;
        }
      }
      .content-middle{
        .loanDetail-list-num,.loanDetail-list-tip{
          text-align: center;
        }
      }
      .content-right{
        .loanDetail-list-num,.loanDetail-list-tip{
          text-align: right;
        }
      }
    }
    .flex-refuse {
      position: relative;
    }
    .flex-refuse::after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      border-bottom: 1px solid #e5e5e5;
      transform: scaleY(.5);
    }
    .vux-flexbox-item{
      margin-top: 0!important;
    }
    .loanDetail-result{
      height: 1.4rem;
      line-height: 1.4rem;
      // padding: 0 .6rem;
      margin: 0 auto;
      font-size: 0.38rem;
      color: #8a8a8a;
      .loanDetail-result-word{
        color: #ff3636;
      }
      .loanDetail-result-time{
        font-size: 0.36rem;
        color: #8a8a8a;
        display: block;
        float: right;
      }
    }
  }

    .loanDetail-refuse{
    // height: 4.7rem;
    padding: .4rem .6rem;
    border-radius: .3rem;
    // width:10.12rem;
    background: #fff;
    margin: 0.3rem auto;
    // .refuse-content{
    //   // padding: .8rem 0 0 .6rem;
    // }
    .loanDetail-refuse-title{
      font-size: 0.4rem;
      color: #010101;
      line-height: 1rem;
    }
    .loanDetail-refuse-p{
      font-size: 0.38rem;
      color: #676767;
      line-height: 0.8rem;
    }
  }
  .loanDetail-refuse-list {
    padding: 0rem .6rem;
    border-radius: .3rem;
  }
}
</style>
