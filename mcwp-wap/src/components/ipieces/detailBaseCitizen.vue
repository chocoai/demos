<template>
  <div>
    <div class="base-container">
      <p id='customer' class="p-title">个人信息<img v-if="personPic && personPic.length" class="title-pic" src="../../assets/base-top-show.png" @click="showPic(Config.bizType.loanPerson, personPic)" /></p>
      <div class="base-content" v-if="loanCustomer">
        <p class="col-p">
          <span class="lable-span">姓名:</span>
          <span class="content-span">{{loanCustomer && loanCustomer.handInputName || '未录入'}}</span>
          <img v-if="namePic && namePic.length" @click="showFace=true" class="content-pic" src="../../assets/tab-menber.png"/>
          <span @click="showFace=true" v-if="basicInfoVerifyDTO.cnameVerifyRet ==3" class="checkout-result-fail">未核实</span>
          <span v-else-if="basicInfoVerifyDTO.cnameVerifyRet == 0" class="checkout-result-success" :class="{'identical-result': basicInfoVerifyDTO.faceVerifyRet==0 || (!basicInfoVerifyDTO.faceVerifyRet && basicInfoVerifyDTO.cnameVerifyRet == 0 ), 'different-result': basicInfoVerifyDTO.faceVerifyRet}">查看结果
            <Popover class="popover-show">{{basicInfoVerifyDTO.faceVerify || basicInfoVerifyDTO.cnameVerify}}</Popover>
          </span>
          <span v-else-if="basicInfoVerifyDTO.cnameVerifyRet == null"></span>
          <span v-else class="checkout-result-success different-result">查看结果
            <Popover class="popover-show">{{basicInfoVerifyDTO.cnameVerify}}</Popover>
          </span>
        </p>
        <p class="col-p">
          <span class="lable-span">婚姻状况:</span>
          <span class="content-span">{{loanCustomer.maritalStatusText || '未录入'}}</span>
        </p>
        <p class="col-p">
          <span class="lable-span">学历:</span>
          <span class="content-span exist-result">{{loanCustomer.education && eduDict && eduDict.filter((item,index)=>(item.ddValue==loanCustomer.education))[0]['ddText'] || '未录入'}}</span>
        </p>
        <p class="col-p">
          <span class="lable-span">身份证号:</span>
          <span class="content-span">{{loanCustomer.idCardNo || '未录入'}}</span>
          <img v-if="idCardPic && idCardPic.length" @click="showIdCard=true" class="content-pic identity-icon" src="../../assets/identity-icon.png"/>
          <span v-if="(!basicInfoVerifyDTO.customerIdCardVerifyRet && basicInfoVerifyDTO.customerIdCardVerifyRet != 0) || basicInfoVerifyDTO.customerIdCardVerifyRet==3" class="checkout-result-fail">未核实</span>
          <span v-else class="checkout-result-success" :class="{'identical-result': basicInfoVerifyDTO.customerIdCardVerifyRet==0, 'different-result': basicInfoVerifyDTO.customerIdCardVerifyRet!=0 }">查看结果
            <Popover class="popover-show">{{basicInfoVerifyDTO.customerIdCardVerify}}</Popover>
          </span>
          <!-- <span v-if="[6, 10, 11, 2, 3, 12].includes(+top.auditStatus)" class="checkout-result-success identical-result">已核实</span> -->
        </p>
        <p class="col-p">
          <span class="lable-span">申请金额:</span>
          <span class="content-span">{{Utils.field(loanCustomer, 'applyBalance', '元', 'commafy')}}</span>
        </p>
        <p class="col-p">
          <span class="lable-span">联系方式:</span>
          <span class="content-span exist-result">{{loanCustomer.telephone || '未录入'}}</span>
          <span v-if="(!basicInfoVerifyDTO.customerTelVerifyRet && basicInfoVerifyDTO.customerTelVerifyRet != 0) || basicInfoVerifyDTO.customerTelVerifyRet==3" class="checkout-result-fail">未核实</span>
          <span v-else class="checkout-result-success" :class="{'identical-result': basicInfoVerifyDTO.customerTelVerifyRet==0, 'different-result': basicInfoVerifyDTO.customerTelVerifyRet!=0 }">查看结果
            <Popover class="popover-show">{{basicInfoVerifyDTO.customerTelVerify}}</Popover>
          </span>
          <!-- <span v-if="[6, 10, 11, 2, 3, 12].includes(+top.auditStatus)" class="checkout-result-success identical-result">已核实</span> -->
        </p>
        <!-- <p class="col-p">
          <span class="lable-span">单位性质:</span>
          <span class="content-span">{{loanCustomer.orgTypeText || '未录入'}}</span>
        </p> -->
        <p class="col-p">
          <span class="lable-span">所属行业:</span>
          <span class="content-span">{{loanCustomer.belongIndustryText || '未录入'}}</span>
        </p>
        <!-- <p class="col-p">
          <span class="lable-span">职务:</span>
          <span class="content-span">{{loanCustomer.jobTitleText || '未录入'}}</span>
        </p> -->
        <p class="col-p">
          <span class="lable-span">月收入:</span>
          <span class="content-span">{{Utils.field(loanCustomer, 'monthIncome', '元')}}</span>
        </p>
        <p class="col-p">
          <span class="lable-span">当前月还贷金额:</span>
          <span class="content-span">{{Utils.field(loanCustomer, 'monthDebt', '元')}}</span>
        </p>
        <p class="col-p">
          <span class="lable-span">信用卡汇总额度:</span>
          <span class="content-span">{{Utils.field(loanCustomer, 'creditcardSumamt', '元')}}</span>
        </p>
        <p class="col-p">
          <span class="lable-span">居住地址:</span>
          <span class="content-span">{{loanCustomer.homeAddr || '未录入'}}</span>
        </p>
        <p class="col-p">
          <span class="lable-span">选择网点:</span>
          <span class="content-span">{{loanCustomer.branchWebsite || '未录入'}}</span>
        </p>
        <p class="col-p">
          <span class="lable-span">客户类型:</span>
          <span class="content-span">{{loanCustomer.customerTypeText || '未录入'}}</span>
        </p>
      </div>
      <p class="no-data" v-if="!loanCustomer">暂无相关信息</p>
    </div>
    <div v-transfer-dom>
      <x-dialog v-model="showFace" hide-on-blur :dialog-style="{'max-width': '80%', width: '80%', height: '70%', padding: '.6rem', overflow: 'scroll'}">
        <p v-if="basicInfoVerifyDTO.faceVerifyRet" class="face-title-fail">{{basicInfoVerifyDTO.faceVerify}}</p>
        <p v-else class="face-title">{{basicInfoVerifyDTO.faceVerify}}</p>
        <p class="face-prob">{{loanData.basicInfoVerifyDTO.faceThresholds}}</p>
        <img class="face-result" v-if="picInfo.LOAN_PERSON_IDENTITY_FACE" :src="picInfo.LOAN_PERSON_IDENTITY_FACE[0].srcUrl" alt="人脸识别" />
        <img class="face-result" v-if="picInfo.LOAN_PERSON_IDENTITY_FRONT" :src="picInfo.LOAN_PERSON_IDENTITY_FRONT[0].srcUrl" alt="人脸识别" />
      </x-dialog>
    </div>
    <div v-transfer-dom>
      <x-dialog v-model="showIdCard" hide-on-blur :dialog-style="{'max-width': '80%', width: '80%', height: '70%', padding: '.6rem', overflow: 'scroll'}">
        <p class="card-title">五类证核实：</p>
        <p class="card-title">{{loanData.basicInfoVerifyDTO.identityIegality}}</p>
        <img class="card-result" v-if="picInfo.LOAN_PERSON_IDENTITY_FRONT" :src="picInfo.LOAN_PERSON_IDENTITY_FRONT[0].srcUrl" alt="人脸识别" />
        <img class="card-result" v-if="picInfo.LOAN_PERSON_IDENTITY_BACK" :src="picInfo.LOAN_PERSON_IDENTITY_BACK[0].srcUrl" alt="人脸识别" />
      </x-dialog>
    </div>
  </div>
</template>

<script>
import { XDialog, TransferDom } from 'vux'
import Popover from '../../components/popover.vue'
import Config from '../../config/index'
import Utils from '../../config/utils'

export default {
  directives: {
    TransferDom
  },
  components: {
    Popover,
    XDialog
  },
  props: ['loanData', 'picInfo', 'popoverShow', 'dictInfo', 'type', 'top'],
  data () {
    return {
      basicInfoVerifyDTO: this.loanData.basicInfoVerifyDTO,
      loanCustomer: this.loanData.loanCustomer,
      loanSpouse: this.loanData.loanSpouse,
      additionalInfo: this.loanData.additionalInfo,
      loanHomeInfo: this.loanData.loanHomeInfo,
      loanPledgeInfos: this.loanData.loanPledgeInfos,
      maritalStatusText: this.loanData.maritalStatusText,
      Config: Config,
      Utils,
      personPic: [...this.picInfo[Config.bizType.loanPerson], ...this.picInfo[Config.bizType.loanCreditFamily] || []],
      namePic: this.picInfo[Config.bizType.loanPersonFront] || this.picInfo[Config.bizType.loanPersonFace],
      idCardPic: this.picInfo[Config.bizType.loanPersonFront] || this.picInfo[Config.bizType.loanPersonBack],
      spousePic: this.picInfo[Config.bizType.loanSpouse],
      familyPic: this.picInfo[Config.bizType.loanFamily],
      citizenPic: this.picInfo[Config.bizType.citizenLoan],
      showFace: false,
      showIdCard: false,
      eduDict: this.dictInfo.education,
      hkqs: this.dictInfo.hkqs,
      bcgx: this.dictInfo.bcgx,
      hkfs: this.dictInfo.hkfs
    }
  },
  methods: {
    showPic (type, PicList) {
      this.$emit('showPic', type, PicList)
    }
  },
  mounted () {
    console.log(this.basicInfoVerifyDTO, 'this.basicInfoVerifyDTO')
    console.log(this.top)
  }
}
</script>

<style lang="less" scoped>
  .base-container{
    width: 10rem;
    margin: 0.26rem auto;
    background: #fff;
    padding-bottom: 0.3rem;
    .p-title{
      border-bottom: 1px solid #e5e5e5;
      height: 1.28rem;
      line-height: 1.28rem;
      font-size: 0.38rem;
      color: #000;
      padding-left: 0.72rem;
      font-weight: bold;
      position: relative;
    }
    .no-data{
      text-align: center;
      padding: 0.3rem;
      font-size: 0.36rem;
    }
    .title-pic{
      position: absolute;
      width: 0.6rem;
      height: 0.6rem;
      top: 0.34rem;
      right: 0.28rem;
    }
    .content-pic{
      margin-top: 0.15rem;
      width: 0.6rem;
      height: 0.6rem;
      margin-left: 0.2rem;
      float: left;
    }
    .p-title::before{
      content: "";
      width: 0.14rem;
      height: 0.42rem;
      background: #369fff;
      border-radius: 8px;
      position: absolute;
      left: 0.4rem;
      top: 0.4rem;
    }
    .base-content{
      padding: 0.6rem 0.7rem;
    }
    .col-p{
      font-size: 0.36rem;
      color: #4f4e4e;
      line-height: 0.86rem;
      // overflow: hidden;
    }
    .col-p::after {
      content: '';
      display: table;
      clear: both;
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
      max-width: 60%;
    }
    .content-span{
      display: block;
      float: left;
      max-width: 80%;
    }
    .identity-icon{
      width: 0.44rem;
      height: 0.4rem;
      margin-top: 0.2rem;
    }
    .exist-result{
      max-width: 59%;
    }
    .checkout-result-fail{
      color: #8c8888;
      font-size: 0.28rem;
      background: url(../../assets/checkout-fail.png) no-repeat 0 0.25rem;
      background-size: 0.34rem 0.34rem;
      margin-left: 0.28rem;
      display: block;
      float: left;
      padding-left: 0.46rem;
    }
    .checkout-result-inconsistent{
      color: #f82335;
      font-size: 0.28rem;
      background: url(../../assets/entrymanagement_icon_difference.png) no-repeat 0 0.2rem;
      background-size: 0.34rem 0.34rem;
      margin-left: 0.28rem;
      display: block;
      float: left;
      padding-left: 0.46rem;
    }
    .identical-result {
      background: url(../../assets/checkout-success.png) no-repeat 0 0.2rem;
    }
    .different-result {
      background: url(../../assets/authentication-fail.png) no-repeat 0 0.2rem;
    }
    .checkout-result-success{
      color: #8c8888;
      font-size: 0.28rem;
      background-size: 0.44rem 0.44rem;
      margin-left: 0.28rem;
      display: block;
      float: left;
      padding-left: 0.46rem;
      position: relative;
    }
    .authentication-fail{
      color: #8c8888;
      font-size: 0.28rem;
      background: url(../../assets/authentication-fail.png) no-repeat 0 0.2rem;
      background-size: 0.44rem 0.44rem;
      margin-left: 0.28rem;
      display: block;
      float: left;
      padding-left: 0.46rem;
    }
  }
  .face-title, .card-title {
    font-size: .5rem;
    line-height: .8rem;
    color: #1d1d1d;
  }
  .face-title-fail {
    font-size: .5rem;
    line-height: .8rem;
    color: #f82335;
  }
  .card-title + .card-title {
    margin-bottom: .3rem;
  }
  .face-prob {
    font-size: .3rem;
    color: #313131;
    line-height: .6rem;
    height: .6rem;
    margin-bottom: .3rem;
  }
  .face-result, .card-result {
    width: 100%;
  }
  .face-result + .face-result, .card-result + .card-result {
    margin-top: .8rem;
  }
  .checkout-result-success:hover .popover-show {
    display: block;
  }
   .checkout-result-success .popover-show {
    display: none;
  }
</style>
