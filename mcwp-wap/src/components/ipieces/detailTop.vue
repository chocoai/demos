<template>
  <div class="detail-top">
    <div class="detail-news" v-if="topInfo.custType == 2 || topInfo.hasCarrierRecode">
      <p class="ipieces-cust-type" v-if="topInfo.custType == 2">该客户已被标识为黑名单用户</p>
      <p class="ipieces-cust-type" v-if="topInfo.hasCarrierRecode">已通过查询密码获取主营借记卡流水信息</p>
    </div>
    <div class="detail-news" v-if="topInfo.auditStatusText" >
      <p class="col-p">
        <span class="lable-span">审批状态:</span>
        <span class="content-span auditStatus-false" v-if="topInfo.auditStatusText == '核身审核拒绝' || topInfo.auditStatusText == '初审审核拒绝' || topInfo.auditStatusText == '征信审核拒绝' || topInfo.auditStatusText == '综合授信审核拒绝' || topInfo.auditStatusText == '人工审批拒绝' || topInfo.auditStatusText == '人工初审拒绝'">{{topInfo.auditStatusText || '未录入'}}</span>
        <span class="content-span auditStatus-true" v-if="topInfo.auditStatusText == '征信审核通过' || topInfo.auditStatusText == '综合授信审核通过' || topInfo.auditStatusText == '初审审核通过' || topInfo.auditStatusText == '人工审批通过'">{{topInfo.auditStatusText || '未录入'}}</span>
      </p>
      <p class="col-popover" v-if="topInfo.auditStatusText == '征信审核通过'">
        <span class="lable-span">评分:</span>
        <span class="content-span">{{topInfo.pbocStore && topInfo.pbocStore || '未录入'}}</span>
        <!-- <span v-if="!TODO.includes(+type)">({{topInfo.pbocScore < 490 ? '征信较差' : 490 <= topInfo.pbocScore && topInfo.pbocScore < 510 ? '征信一般' : 510 <= topInfo.pbocScore && topInfo.pbocScore < 530 ? '征信良好' : '征信优秀'}})</span>
        <span class="checkout-result-success" v-if="!TODO.includes(+type)">
          <img class="icon-explain" src="../../assets/icon_explain.png"/>
          <Popover class="popover-show">
            <div class="creContent-container">
                <p className="creContent-p">征信较差:分值范围[-,490]</p>
                <p className="creContent-p">征信一般:分值范围[490,510]</p>
                <p className="creContent-p">征信良好:分值范围[510,530]</p>
                <p className="creContent-p">征信优秀:分值范围[530,+]</p>
            </div>
          </Popover>
        </span> -->
      </p>
      <p class="col-p" v-if="ipiecesShow.detailTopOrgAuthMoney.includes(+type) &&　topInfo.auditStatusText == '初审审核通过'">
        <span class="lable-span">授信金额:</span>
        <span class="content-span">{{topInfo.authMoney || 0}}元</span>
      </p>
      <div class="col-popover" v-if="topInfo.auditStatusText == '初审审核通过' && ipiecesShow.detailTopOrgScore.includes(+type)">
        <span class="lable-span">评分:</span>
        <span class="content-span">{{topInfo.orgCreditScore && topInfo.orgCreditScore || '未录入'}}</span>
        <!-- <span v-if="!TODO.includes(+type)">({{topInfo.orgCreditScore < 490 ? '征信较差' : 490 <= topInfo.pbocScore && topInfo.pbocScore < 510 ? '征信一般' : 510 <= topInfo.pbocScore && topInfo.pbocScore < 530 ? '征信良好' : '征信优秀'}})</span> -->
        <!-- todo 征信说明暂无 -->
      </div>
      <p class="col-p" v-if="ipiecesShow.detailTopOrgRank.includes(+type) && topInfo.auditStatusText == '初审审核通过'">
        <span class="lable-span">评级:</span>
        <span class="content-span">{{topInfo.rank || '未录入'}}</span>
      </p>
      <p class="col-p" v-if="topInfo.auditStatusText == '核身审核拒绝' || topInfo.auditStatusText == '初审审核拒绝' || topInfo.auditStatusText == '征信审核拒绝' || topInfo.auditStatusText == '综合授信审核拒绝' || topInfo.auditStatusText == '人工审批拒绝' || topInfo.auditStatusText == '人工初审拒绝'">
        <span class="lable-span">拒绝原因:</span>
        <span class="content-span auditStatus-false">{{topInfo.rejectReasonOther || topInfo.rejectReason || '未录入'}}</span>
      </p>
      <p class="col-p" v-if="topInfo.auditStatusText == '已驳回'">
        <span class="lable-span">打回原因:</span>
        <span class="content-span auditStatus-false">{{topInfo.rejectReasonOther || topInfo.rejectReason || '未录入'}}</span>
      </p>
      <p class="col-p" v-if="topInfo.auditStatusText == '综合授信审核通过' || topInfo.auditStatusText == '人工审批通过'">
        <span class="lable-span">授信金额:</span>
        <span class="content-span">{{topInfo.authMoney && topInfo.authMoney  + '元' || '未录入'}}</span>
        <span class="view-comment" @click="showComment=true" v-if="topInfo.comment">查看备注</span>
      </p>
      <p class="col-p" v-if="topInfo.auditStatusText == '综合授信审核通过'">
        <span class="lable-span">借款日利率:</span>
        <span class="content-span">{{topInfo.dailyRate && topInfo.dailyRate  + '%' || '未录入'}}</span>
      </p>
      <!-- 统一移除倒计时 -->
      <!-- 市民贷经营贷需求已混乱 -->
      <p class="col-popover" v-if="topInfo.auditStatusText == '综合授信审核通过' && ipiecesShow.detailTopFnlScore.includes(+type)">
        <span class="lable-span">评分:</span>
        <span class="content-span">{{topInfo.fnlStore && topInfo.fnlStore || '未录入'}}</span>
        <!-- <span v-if="!TODO.includes(+type)">({{topInfo.fnlStore < 350 ? '风险极高' : 350 <= topInfo.fnlStore && topInfo.fnlStore < 500 ? '风险较高' : 500 <= topInfo.fnlStore && topInfo.fnlStore < 650 ? '风险一般' : 650 <= topInfo.fnlStore && topInfo.fnlStore < 800 ? '风险较低' : '风险极低'}})</span> -->
        <!-- <span class="checkout-result-success" v-if="!TODO.includes(+type)">
          <img class="icon-explain" src="../../assets/icon_explain.png"/>
          <Popover class="popover-show">
            <div class="creContent-container">
                <p className="creContent-p">风险极高:分值范围[-,350]</p>
                <p className="creContent-p">风险较高:分值范围[350,500]</p>
                <p className="creContent-p">风险一般:分值范围[500,650]</p>
                <p className="creContent-p">风险较低:分值范围[650,800]</p>
                <p className="creContent-p">风险极低:分值范围[800,+]</p>
            </div>
          </Popover>
        </span> -->
      </p>
      <p class="col-p" v-if="ipiecesShow.detailTopFnlRank.includes(+type) && topInfo.auditStatusText == '综合授信审核通过'">
        <span class="lable-span">评级:</span>
        <span class="content-span">{{topInfo.rank || '未录入'}}</span>
      </p>
    </div>
    <div class="detail-news" v-if="mismatchInfoShow.length">
      <p class="news-list" v-for="(item, index) in mismatchInfoShow" v-if="item" :key="index" @click="$emit('autoNav', item)">{{item}} <img class="approval-warn" src="../../assets/approval-warn.png"/></p>
      <!--<p class="news-list">借款记录有三天逾期记录 <img class="approval-warn" src="../../assets/approval-warn.png"/></p>-->
    </div>
    <div class="detail-news" v-if="busiCheck && busiCheck.length">
      <p class="busiCheck-list" v-for="(item, index) in busiCheck" v-if="item" :key="index" @click="busiCheckDetail" >{{item}}</p>
    </div>
    <div class="detail-news">
      <p class="col-p">
        <span class="lable-span">申请贷款:</span>
        <span class="content-span">{{topInfo.prdName || '未录入'}}</span>
      </p>
      <p class="col-p">
        <span class="lable-span">借款用途:</span>
        <span class="content-span">{{topInfo.loanUseText || '未录入'}}</span>
      </p>
    </div>
    <div class="detail-news" v-if="type !=1">
      <p class="detail-title detail-risk">风险点</p>
      <div v-if="topInfo && topInfo.loanRiskPoints && topInfo.loanRiskPoints.length">
        <p class="detail-p" v-for="(item, index) in topInfo.loanRiskPoints" :key="index">{{item.riskInfo}}</p>
      </div>
      <p class="no-data" v-if="!topInfo || !topInfo.loanRiskPoints || !topInfo.loanRiskPoints.length">暂无相关信息</p>
    </div>
    <div class="detail-news" v-if="type != 6">
      <p class="detail-title detail-black">黑名单</p>
      <div v-if="topInfo && topInfo.blackLists && topInfo.blackLists.length">
        <p class="detail-p" v-for="(item, index) in topInfo.blackLists" :key="index">{{item.riskInfo}}</p>
      </div>
      <p class="no-data" v-if="!topInfo || !topInfo.blackLists || !topInfo.blackLists.length">暂无相关信息</p>
    </div>
    <div v-transfer-dom>
      <x-dialog v-model="showComment" hide-on-blur :dialog-style="{'max-width': '80%', width: '80%', height: '60%', padding: '.6rem', overflow: 'scroll'}">
        <p class="audit-title">查看备注</p>
        <p class="comment-p"><pre>{{topInfo.comment}}</pre></p>
      </x-dialog>
    </div>
  </div>
</template>

<script>
import { XDialog, TransferDomDirective as TransferDom } from 'vux'
import Popover from '../../components/popover.vue'
import Config from '../../config/index'
export default {
  directives: {
    TransferDom
  },
  components: {
    XDialog,
    Popover
  },
  props: ['loanData', 'mismatchInfo', 'type', 'busiCheck', 'code'],
  data () {
    return {
      topInfo: this.loanData,
      showComment: false,
      ipiecesShow: Config.ipiecesShow,
      mismatchInfoShow: [].concat(...Object.values(this.mismatchInfo)).filter(item => item)
      // newBusiCheck: []
    }
  },
  mounted () {
    console.log(this.code, 'this.code')
    // this.newBusiCheck = this.getNewArr(this.mismatchInfoShow)
  },
  methods: {
    busiCheckDetail () {
      window.zdb.tBusiCheckShow(this.code)
    },
    getNewArr (array) {
      let newArr = []
      for (let i = 0; i < array.length; i++) {
        if (array[i] instanceof Array) {
          for (let j = 0; j < array[i].length; j++) {
            newArr.push(array[i][j])
          }
        } else {
          newArr.push(array[i])
        }
      }
      return newArr
    }
  }
}
</script>

<style lang="less">
.detail-top{
  background: #F7F7FA;
  padding: .4rem 0;
  .detail-news{
    width: 9.2rem;
    background: #fff;
    padding: .4rem;
    margin: 0 auto;
  }
  .detail-news + .detail-news {
    margin-top: .3rem;
  }
  .ipieces-cust-type{
    background: url(../../assets/icon_prompt.png) no-repeat;
    background-size: 0.48rem 0.48rem;
    padding-left: .64rem;
    font-size: 0.36rem;
    margin-top: .3rem;
    display: inline-block;
  }
  .no-data{
    text-align: center;
    padding: 0.3rem;
    font-size: 0.36rem;
  }
  .news-list{
    color: #fe9732;
    font-size: 0.36rem;
    line-height: .7rem;
  }
  .busiCheck-list {
    color: #333;
    font-size: 0.36rem;
    line-height: .7rem;
  }
  .approval-warn{
    display: inline-block;
    width: 0.5rem;
    height: 0.5rem;
    position: relative;
    top: 0.1rem;
    left: 0.12rem;
    margin: 0.2rem 0 0 0.12rem;
  }
  .col-p{
    font-size: 0.36rem;
    color: #4f4e4e;
    line-height: 0.86rem;
    overflow: hidden;
  }
  .col-popover {
    font-size: 0.36rem;
    color: #4f4e4e;
    line-height: 0.86rem;
    &:after {
      content: '';
      display: table;
      clear: both;
    }
  }
  .row-p{
    display: block;
    float: left;
    width: 4rem;
  }
  .row-p+.row-p{
    margin-left: 0.48rem;
  }
  .lable-span{
    margin-right: 0.1rem;
    display: block;
    float: left;
    max-width: 50%;
  }
  .content-span{
    display: block;
    float: left;
    max-width: 80%;
  }
  .detail-title{
    color: #000;
    font-size: 0.42rem;
    padding-left: 0.56rem;
    line-height: 0.86rem;
  }
  .detail-risk{
    background: url(../../assets/approval-risk.png) no-repeat 0 0.2rem;
    background-size: 0.36rem 0.36rem;
  }
  .detail-black{
    background: url(../../assets/approval-black.png) no-repeat 0 0.2rem;
    background-size: 0.36rem 0.36rem;
  }
  .detail-p{
    padding-left: 0.56rem;
    position: relative;
    line-height: 0.86rem;
    color: #3e3e3e;
    font-size: 0.36rem;
  }
  .detail-p::before{
    content:"";
    position: absolute;
    top: 0.3rem;
    left: 0.05rem;
    width: 0.16rem;
    height: 0.16rem;
    border-radius: 50%;
    background: #a4d4ff;
  }
  .auditStatus-true {
    color: #43b549;
  }
  .auditStatus-false {
    color: #f82335;
  }
  .view-comment {
    color: #369bff;
    margin-left: .5rem;
  }
  .checkout-result-success {
    position: relative;
  }
  .checkout-result-success:hover .popover-show {
    display: block;
  }
  .checkout-result-success .popover-show {
    display: none;
  }
  .creContent-container {
    width: 5.5rem;
    font-size: .26rem;
    line-height: .6rem;
  }
  .popover {
    width: 5rem!important;
  }
  .icon-explain {
    width: .4rem;
    height: .4rem;
    position: relative;
    top: .05rem;
  }
}
.audit-title {
  font-size: .42rem;
  color: #000;
  padding-bottom: .68rem;
}
.comment-p {
  text-align: left;
  font-size: .36rem;
  line-height: .5rem;
  pre {
    white-space: pre-wrap;
    word-wrap: break-word;
  }
}
</style>
