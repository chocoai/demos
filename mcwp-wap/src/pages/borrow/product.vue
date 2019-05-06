<template>
  <div class="product-container" v-if='showList || isMcp'>
    <div v-if="(data && data.length) || isMcp">
      <div class="product-list" v-for="(item, index) in data" :key="index" @click='prodInfo(item.code)'>
        <flexbox :gutter="0">
          <flexbox-item :span="372/1012"><div class="product-list-left"><img class="product-cover" :src='item.coverUrl' /></div></flexbox-item>
          <flexbox-item>
            <div class="product-list-right">
              <span class="share-img" v-if="showShare" @click="sharePro(item)"></span>
              <flexbox orient="vertical">
                <flexbox-item style="flex-direction: column"><div class="product-list-title">{{item.prdName}}</div></flexbox-item>
                <flexbox-item>
                    <flexbox :gutter="0">
                      <flexbox-item>
                          <flexbox orient="vertical">
                            <flexbox-item><div class="product-list-num">{{item.loanLimit}}万</div></flexbox-item>
                            <flexbox-item><div class="product-list-tip">最高额度</div></flexbox-item>
                          </flexbox>
                      </flexbox-item>
                      <flexbox-item>
                          <flexbox orient="vertical">
                            <!-- <flexbox-item><div class="product-list-num">{{(Math.floor(item.loanRate * 10000) * 360 / 10000)}}%</div></flexbox-item> -->
                            <flexbox-item><div class="product-list-num">{{item.loanRate}}%</div></flexbox-item>
                            <flexbox-item><div class="product-list-tip">日化利率</div></flexbox-item>
                          </flexbox>
                      </flexbox-item>
                      <flexbox-item>
                          <flexbox orient="vertical">
                            <flexbox-item><div class="product-list-num">{{item.loanAuthDays}}个月</div></flexbox-item>
                            <flexbox-item><div class="product-list-tip">授信周期</div></flexbox-item>
                          </flexbox>
                      </flexbox-item>
                    </flexbox>
                </flexbox-item>
              </flexbox>
            </div>
          </flexbox-item>
        </flexbox>
      </div>
      <a v-if="isMcp" class="product-list" href="https://www.lcnsyhwd.com/micro/loan/mobileApplyLoan.html?autoLogin=true">
        <flexbox :gutter="0">
          <flexbox-item :span="372/1012"><div class="product-list-left"><img class="product-cover" src='../../assets/img_MCP_list.png' /></div></flexbox-item>
          <flexbox-item>
            <div class="product-list-right">
              <flexbox orient="vertical">
                <flexbox-item style="flex-direction: column"><div class="product-list-title">潞盈微贷</div></flexbox-item>
                <flexbox-item>
                    <flexbox :gutter="0">
                      <flexbox-item>
                          <flexbox orient="vertical">
                            <flexbox-item><div class="product-list-num">10万以上</div></flexbox-item>
                            <flexbox-item><div class="product-list-tip">最高额度</div></flexbox-item>
                          </flexbox>
                      </flexbox-item>
                      <flexbox-item>
                          <flexbox orient="vertical">
                            <flexbox-item><div class="product-list-num">视产品而定</div></flexbox-item>
                            <flexbox-item><div class="product-list-tip">日化利率</div></flexbox-item>
                          </flexbox>
                      </flexbox-item>
                      <flexbox-item>
                            <flexbox orient="vertical">
                              <flexbox-item><div class="product-list-num">视产品而定</div></flexbox-item>
                              <flexbox-item><div class="product-list-tip">授信周期</div></flexbox-item>
                            </flexbox>
                        </flexbox-item>
                    </flexbox>
                </flexbox-item>
              </flexbox>
            </div>
          </flexbox-item>
        </flexbox>
      </a>
    </div>
    <v-blank v-else>还没有产品</v-blank>
    <div v-if='showShareTip' @click="showShareTip=false" class='share-wrapper'><img class='share-img' src='./../../assets/share-tip.png' /></div>
  </div>
</template>

<script>
import { Flexbox, FlexboxItem, Divider } from 'vux'
import Config from '../../config'
import Sto from 'store'
import { getProList } from '../../service/getData'
import VBlank from './../../components/blank'
import Wxsdk from './../../config/wxJsSdk'
import Utils from './../../config/utils'

export default {
  components: {
    Flexbox,
    FlexboxItem,
    Divider,
    VBlank
  },
  data () {
    return {
      state: Sto.get(Config.constants.cookies)['enterpriseCode'] || Sto.get(Config.constants.enterpriseCode) || 10001,
      data: '',
      showShare: Utils.isWeixin() && Utils.getQueryParams('type') === 'share',
      showShareTip: false,
      showList: false,
      isMcp: Utils.getQueryParams('type') === 'mcp'
    }
  },
  methods: {
    async getInfo () {
      this.$vux.loading.show()
      let enterprCode = this.state
      if (this.isMcp) enterprCode = Utils.getQueryParams('enterprCode')
      let res = await getProList({enterprCode: enterprCode})
      this.$vux.loading.hide()
      if (res.code === Config.resCode.success) {
        this.showList = true
        this.data = res.data
      } else {
        if (!this.isMcp) this.$vux.toast.text(res.msg)
      }
    },
    prodInfo (code) {
      this.$router.push(`${Config.constants.proDetailRouter}?prdCode=${code}`)
    },
    sharePro (item) {
      const that = this
      that.showShareTip = true
      let cookies = Sto.get(Config.constants.cookies)
      let shareUrl = `${window.location.origin + Config.constants.proDetailRouter}?prdCode=${item.code}${cookies.userCode ? '&userCode=' + cookies.userCode : ''}`
      cookies = Object.assign(cookies, {
        prdTitle: item.prdName,
        prdSummary: `${item.prdAd || '畅想生活 随心所贷'}\n本产品出自：${item.enterpriseName}`,
        prdUrl: shareUrl,
        prdImgUrl: item.enterpriseIcon
      })
      Sto.set(Config.constants.cookies, cookies)
      event.stopPropagation()
      Wxsdk.wxShare(() => { that.showShareTip = false })
    }
  },
  created () {
    this.getInfo()
    console.log(this.data)
  }
}
</script>

<style lang="less" scoped>
.product-container{
  background: url(../../assets/bg_prodlist.png) 0 0 no-repeat;
  background-size: 100% auto;
  padding-top: 3rem;
  .product-list{
    display: block;
    width: 10.12rem;
    height: 3.36rem;
    background: #fff;
    border-radius: .3rem;
    margin: .3rem;
    position: relative;
    .vux-flexbox-item{
      margin-top: 0!important;
    }
    .share-img {
      position: absolute;
      width: 0.4rem;
      height: 0.4rem;
      background: url(../../assets/icon_share.png) no-repeat;
      background-size: cover;
      right: .4rem;
      top: 0;
    }
    .product-cover{
      width: 2.56rem;
      height: 2.56rem;
      margin: 0.4rem 0.58rem;
      border-radius: 0.16rem;
    }
    .product-list-right{
      height: 2rem;
      position: relative;
      .product-list-title{
        font-size: 0.44rem;
        color: #010101;
        margin-bottom: 0.28rem;
        word-wrap: break-word;
        width: 85%;
      }
      .product-list-num{
        font-size: 0.4rem;
        color: #3a3a3a;
        margin-bottom: 0.05rem;
      }
      .product-list-tip{
        font-size: 0.32rem;
        color: #3a3a3a;
      }
    }
  }
  .share-wrapper {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, .4);
    -webkit-tap-highlight-color: rgba(0,0,0,0);
  }
  .share-img {
    width: 60%;
    float: right;
  }
}
</style>
