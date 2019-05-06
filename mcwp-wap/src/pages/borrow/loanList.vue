<template>
  <div class="product-loanDetail">
    <div v-if="list && list.length">
      <div class="loanDetail-list" v-for="(item, index) in list" :key="index">
        <flexbox orient="vertical" :gutter="0" @click.native="next(item.code)">
          <flexbox-item>
            <div class="flex-demo">
              <div class="loanDetail-list-top">
                <flexbox :gutter="0">
                  <flexbox-item>
                  <div class="loanDetail-list-content content-left">
                    <flexbox orient="vertical">
                    <flexbox-item>
                      <div class="loanDetail-list-num font-40">{{item.borrowMoney}}元</div>
                    </flexbox-item>
                    <flexbox-item>
                      <div class="loanDetail-list-tip font-32">申请金额</div>
                    </flexbox-item>
                    </flexbox>
                  </div>
                  </flexbox-item>
                  <flexbox-item>
                  <div class="loanDetail-list-content content-middle">
                    <flexbox orient="vertical">
                    <flexbox-item>
                      <div class="loanDetail-list-num font-40">{{item.repaymentKindText}}</div>
                    </flexbox-item>
                    <flexbox-item>
                      <div class="loanDetail-list-tip font-32">还款方式</div>
                    </flexbox-item>
                    </flexbox>
                  </div>
                  </flexbox-item>
                  <flexbox-item>
                  <div class="loanDetail-list-content content-right">
                    <flexbox orient="vertical">
                    <flexbox-item>
                      <div class="loanDetail-list-num font-40">{{item.repaymentPeriod}}期</div>
                    </flexbox-item>
                    <flexbox-item>
                      <div class="loanDetail-list-tip font-32">还款期数</div>
                    </flexbox-item>
                    </flexbox>
                  </div>
                  </flexbox-item>
                </flexbox>
                </div>
            </div>
          </flexbox-item>
          <flexbox-item>
            <div class="loanDetail-result font-32">
              <p>贷款进度：<span class="loanDetail-result-word" :class="{'apply-wait':item.loanStatus == 1 || item.loanStatus == 2, 'apply-refuse':item.loanStatus == 3, 'apply-other':item.loanStatus == 4 || item.loanStatus == 5}">{{item.loanStatusText}}</span><span class="loanDetail-result-time font-34">{{formatTime(item.createDate)}}</span></p>
            </div>
          </flexbox-item>
        </flexbox>
      </div>
    </div>
    <v-blank v-else>你还没有借款</v-blank>
  </div>
</template>

<script>
import { Flexbox, FlexboxItem, Divider } from 'vux'
import { loanList } from '../../service/getData'
import VBlank from './../../components/blank'
import Utils from '../../config/utils'
import Config from '../../config/index'

export default {
  components: {
    Flexbox,
    FlexboxItem,
    Divider,
    VBlank
  },
  data () {
    return {
      list: []
    }
  },
  methods: {
    async getList () {
      let res = await loanList()
      if (+res.code === 0) {
        this.list = res.data
      } else if (res.code === 'TOKEN_EXPIRE' || res.code === 'DATA_NOT_EXIST') {
        this.$router.push(Config.constants.personalRouter)
      } else {
        alert(res.msg)
      }
    },
    formatTime (createDate) {
      return Utils.formatTime(createDate)
    },
    next (code) {
      this.$router.push(Config.constants.loanDetailRouter + code)
    }
  },
  created () {
    this.getList()
  }
}
</script>

<style lang="less" scoped>
  .product-loanDetail{
    width: 10.2rem;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: 0.3rem auto;
  }
  .loanDetail-list + .loanDetail-list{
    margin-top: .3rem;
  }
  .loanDetail-list{
    width:10.2rem;
    background: #fff;
    border-radius: .3rem;
    .loanDetail-list-top{
      width: 9rem;
      float: right;
      position:relative;
      padding: .6rem .6rem .6rem 0;
      .loanDetail-list-num{
        color: #010101;
      }
      .loanDetail-list-tip{
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
    .loanDetail-list-top::after{
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
    .vux-flexbox-item{
      margin-top: 0!important;
    }
    .loanDetail-result{
      height: 1.4rem;
      line-height: 1.4rem;
      padding: 0 .6rem;
      color: #8a8a8a;
      // .loanDetail-result-word{
      //   color: #ff9696;
      // }
      .apply-wait {
        color: #369bff;
      }
      .apply-refuse {
        color: #ff3636;
      }
      .apply-other {
        color: #8a8a8a;
      }
      .loanDetail-result-time{
        color: #8a8a8a;
        display: block;
        float: right;
      }
    }
  }
  // .loanDetail-refuse{
  //   height: 4.7rem;
  //   width:10.12rem;
  //   background: #fff;
  //   margin: 0.3rem auto;
  //   .refuse-content{
  //     padding: .8rem 0 0 .6rem;
  //   }
  //   .loanDetail-refuse-title{
  //     font-size: 0.4rem;
  //     color: #010101;
  //     line-height: 1rem;
  //   }
  //   .loanDetail-refuse-p{
  //     font-size: 0.38rem;
  //     color: #676767;
  //     line-height: 0.8rem;
  //   }
  // }
</style>
