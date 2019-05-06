<template>
  <div>
    <div v-for="value in moduleConfig" :key="value.formEnName">
      <div class="base-container" v-if="value.formEnName == 'loanAdvice' && loanData.moduleName.loanAdvice">
        <p id='customer' class="p-title">{{loanData.moduleName.loanAdvice}}</p>
        <div class="base-content" v-if="loanData.loanAdvice">
          <common-detail :fieldConfig='BaseInfoConfig.loanAdvice' :detailData='loanData.loanAdvice' />
        </div>
        <p class="no-data" v-if="!loanData.loanAdvice">暂无相关信息</p>
      </div>

      <div class="base-container" v-else-if="value.formEnName == 'loanCustomer' && loanData.moduleName.loanCustomer">
        <p id='customer' class="p-title">{{loanData.moduleName.loanCustomer}}<img v-if="personPic && personPic.length" class="title-pic" src="../../assets/base-top-show.png" @click="showPic(Config.bizType.loanPerson, personPic)" /></p>
        <div class="base-content" v-if="loanCustomer">
          <common-detail :fieldConfig='BaseInfoConfig.loanCustomer' :detailData='loanData.loanCustomer' >
            <template scope="{i}">
              <!-- 姓名 -->
              <div v-if="i.detailName == 'cname'">
                <img v-if="type != 8" @click="showFace=true" class="content-pic" src="../../assets/tab-menber.png"/>
                <!-- 房抵贷暂时没有 -->
                <!-- <span @click="showFace=true" v-if="basicInfoVerifyDTO.cnameVerifyRet == null  || basicInfoVerifyDTO.cnameVerifyRet ==3" class="checkout-result-fail">未核实</span>
                <span v-else-if="basicInfoVerifyDTO.cnameVerifyRet == 0" class="checkout-result-success" :class="{'identical-result': basicInfoVerifyDTO.faceVerifyRet==0 || (!basicInfoVerifyDTO.faceVerifyRet && basicInfoVerifyDTO.cnameVerifyRet == 0 ), 'different-result': basicInfoVerifyDTO.faceVerifyRet}">查看结果
                  <Popover class="popover-show">{{basicInfoVerifyDTO.faceVerify || basicInfoVerifyDTO.cnameVerify}}</Popover>
                </span>
                <span v-else class="checkout-result-success different-result">查看结果
                  <Popover class="popover-show">{{basicInfoVerifyDTO.cnameVerify}}</Popover>
                </span> -->
              </div>
              <!-- 身份证号 -->
              <div v-if="i.detailName == 'idCardNo'">
                <img v-if="picInfo.LOAN_PERSON_IDENTITY_FRONT || picInfo.LOAN_PERSON_IDENTITY_BACK" @click="showIdCard=true" class="content-pic identity-icon" src="../../assets/identity-icon.png"/>
                <div v-if="basicInfoVerifyDTO.customerIdCardVerifyRet != null">
                  <!-- <span v-if="(basicInfoVerifyDTO.customerIdCardVerifyRet != 0) || basicInfoVerifyDTO.customerIdCardVerifyRet==3" class="checkout-result-fail">未核实</span>
                  <span v-else class="checkout-result-success" :class="{'identical-result': basicInfoVerifyDTO.customerIdCardVerifyRet==0, 'different-result': basicInfoVerifyDTO.customerIdCardVerifyRet!=0 }">查看结果
                    <Popover class="popover-show">{{basicInfoVerifyDTO.customerIdCardVerify}}</Popover>
                  </span> -->
                  <span v-if="(!basicInfoVerifyDTO.customerIdCardVerifyRet && basicInfoVerifyDTO.customerIdCardVerifyRet != 0) || basicInfoVerifyDTO.customerIdCardVerifyRet==3" class="checkout-result-fail">未核实</span>
                  <span v-else class="checkout-result-success" :class="{'identical-result': basicInfoVerifyDTO.customerIdCardVerifyRet==0, 'different-result': basicInfoVerifyDTO.customerIdCardVerifyRet!=0 }">查看结果
                    <Popover class="popover-show">{{basicInfoVerifyDTO.customerIdCardVerify}}</Popover>
                  </span>
                </div>
              </div>
              <!-- 联系方式 -->
              <div v-if="i.detailName == 'telephone'">
                <!-- <div v-if="basicInfoVerifyDTO.customerTelVerifyRet != null">
                  <span v-if="(basicInfoVerifyDTO.customerTelVerifyRet != 0) || basicInfoVerifyDTO.customerTelVerifyRet==3" class="checkout-result-fail">未核实</span>
                  <span v-else class="checkout-result-success" :class="{'identical-result': basicInfoVerifyDTO.customerTelVerifyRet==0, 'different-result': basicInfoVerifyDTO.customerTelVerifyRet!=0 }">查看结果
                    <Popover class="popover-show">{{basicInfoVerifyDTO.customerTelVerify}}</Popover>
                  </span>
                </div> -->
                <span v-if="(!basicInfoVerifyDTO.customerTelVerifyRet && basicInfoVerifyDTO.customerTelVerifyRet != 0) || basicInfoVerifyDTO.customerTelVerifyRet==3" class="checkout-result-fail">未核实</span>
                <span v-else class="checkout-result-success" :class="{'identical-result': basicInfoVerifyDTO.customerTelVerifyRet==0, 'different-result': basicInfoVerifyDTO.customerTelVerifyRet!=0 }">查看结果
                  <Popover class="popover-show">{{basicInfoVerifyDTO.customerTelVerify}}</Popover>
                </span>
              </div>
            </template>
          </common-detail>
        </div>
        <p class="no-data" v-if="!loanCustomer">暂无相关信息</p>
      </div>
      <!-- 亲属 -->
      <div class="base-container" v-if="value.formEnName == 'relativeInfo' && loanData.moduleName.relativeInfo">
        <p id='customer' class="p-title">{{loanData.moduleName.relativeInfo}}<img v-if="spousePic && spousePic.length" class="title-pic" src="../../assets/base-top-show.png" @click="showPic(Config.bizType.loanSpouse, spousePic)" /></p>
        <div class="base-content" v-if="loanData.loanSpouse">
          <common-detail :fieldConfig='BaseInfoConfig.relativeInfo' :detailData='loanData.loanSpouse'>
            <template scope="{i}">
              <!-- 身份证号 -->
              <div v-if="i.detailName == 'idCardNo'">
                <span v-if="(!basicInfoVerifyDTO.spouseIdCardVerifyRet && basicInfoVerifyDTO.spouseIdCardVerifyRet != 0) || basicInfoVerifyDTO.spouseIdCardVerifyRet==3" class="checkout-result-fail">未核实</span>
                <span v-else class="checkout-result-success" :class="{'identical-result': basicInfoVerifyDTO.spouseIdCardVerifyRet==0, 'different-result': basicInfoVerifyDTO.spouseIdCardVerifyRet!=0 }">查看结果
                  <Popover class="popover-show">{{basicInfoVerifyDTO.spouseIdCardVerify}}</Popover>
                </span>
              </div>
              <!-- 联系方式 -->
              <div v-if="i.detailName == 'telephone'">
                <span v-if="(!basicInfoVerifyDTO.spouseTelVerifyRet && basicInfoVerifyDTO.spouseTelVerifyRet != 0) || basicInfoVerifyDTO.spouseTelVerifyRet==3" class="checkout-result-fail">未核实</span>
                <span v-else class="checkout-result-success" :class="{'identical-result': basicInfoVerifyDTO.spouseTelVerifyRet==0, 'different-result': basicInfoVerifyDTO.spouseTelVerifyRet!=0 }">查看结果
                  <Popover class="popover-show">{{basicInfoVerifyDTO.spouseTelVerify}}</Popover>
                </span>
              </div>
            </template>>
          </common-detail>
        </div>
        <p class="no-data" v-if="!loanData.loanSpouse">暂无相关信息</p>
      </div>

      <div class="base-container" v-else-if="value.formEnName == 'emergencyContactInfo' && loanData.moduleName.emergencyContactInfo">
        <div v-if='loanData.emergencyContract && loanData.emergencyContract.length' v-for='(item, index) in loanData.emergencyContract' :key='index'>
          <p class="p-title">{{loanData.moduleName.emergencyContactInfo}}{{index + 1}}<img v-if="emergencyPic && emergencyPic.length" class="title-pic" src="../../assets/base-top-show.png" @click="showPic(Config.bizType.loanEmergency, emergencyPic)" /></p>
          <div class="base-content">
            <common-detail :fieldConfig='BaseInfoConfig.emergencyContactInfo' :detailData ='item' />
          </div>
        </div>
        <div v-if="!(loanData.emergencyContract && loanData.emergencyContract.length)">
          <p class="p-title">{{loanData.moduleName.emergencyContactInfo}}</p>
          <p class="no-data">暂无相关信息</p>
        </div>
      </div>

      <div class="base-container" v-else-if="value.formEnName == 'pledgeInfo' && loanData.moduleName.pledgeInfo">
        <div v-if='loanPledgeInfos && loanPledgeInfos.length' v-for='(item, index) in loanPledgeInfos' :key='index'>
          <p class="p-title">{{loanData.moduleName.pledgeInfo}}{{index + 1}}<img v-if="pledgePic && pledgePic.length" class="title-pic" src="../../assets/base-top-show.png" @click="showPic(Config.showType.loanPledgeAll, pledgePic)" /></p>
          <div class="base-content">
            <common-detail :fieldConfig='BaseInfoConfig.pledgeInfo' :detailData ='item' />
          </div>
        </div>
        <div v-if="!(loanPledgeInfos && loanPledgeInfos.length)">
          <p class="p-title">{{loanData.moduleName.pledgeInfo}}</p>
          <p class="no-data">暂无相关信息</p>
        </div>
      </div>
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
import BaseInfo from '../../config/Ipieces/BasicInfo'
import Utils from '../../config/utils'
import Config from '../../config/index'
import CommonDetail from './commonDetail'

export default {
  directives: {
    TransferDom
  },
  components: {
    Popover,
    XDialog,
    CommonDetail
  },
  props: ['loanData', 'picInfo', 'popoverShow', 'dictInfo', 'type'],
  data () {
    return {
      basicInfoVerifyDTO: this.loanData.basicInfoVerifyDTO,
      loanCustomer: this.loanData.loanCustomer,
      loanSpouse: this.loanData.loanSpouse,
      loanHomeInfo: this.loanData.loanHomeInfo,
      loanPledgeInfos: this.loanData.loanPledgeInfos,
      maritalStatusText: this.loanData.maritalStatusText,
      Config: Config,
      personPic: this.picInfo[Config.bizType.loanPerson],
      spousePic: this.picInfo[Config.bizType.loanSpouse],
      emergencyPic: this.picInfo[Config.bizType.loanEmergency],
      pledgePic: this.picInfo[Config.showType.loanPledgeAll],
      familyPic: this.picInfo[Config.bizType.loanFamily],
      showFace: false,
      showIdCard: false,
      showIdCardImg: this.picInfo.LOAN_PERSON_IDENTITY_BACK && this.picInfo.LOAN_PERSON_IDENTITY_FRONT,  // 是否显示身份证图标
      eduDict: this.dictInfo.education,
      hkqs: this.dictInfo.hkqs,
      bcgx: this.dictInfo.bcgx,
      hkfs: this.dictInfo.hkfs,
      BaseInfoConfig: Utils.deepMerge(BaseInfo, this.loanData.fieldConfig),
      moduleConfig: this.loanData.moduleConfig.sort((i1, i2) => i1.position - i2.position)
    }
  },
  methods: {
    showPic (type, PicList) {
      this.$emit('showPic', type, PicList)
    }
  },
  mounted () {
    console.log(this.basicInfoVerifyDTO, this.picInfo, 'this.basicInfoVerifyDTO')
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
    // web端已24为1行，h5采用12为1行，和web局部共用详情detailWidth参数
    .col-p-12 {
      font-size: 0.36rem;
      color: #4f4e4e;
      line-height: 0.86rem;
      // overflow: hidden;
    }
    .col-p-12::after {
      content: '';
      display: table;
      clear: both;
    }

    .col-p-6 {
      display: inline-block;
      font-size: 0.36rem;
      color: #4f4e4e;
      line-height: 0.86rem;
      width: 4.24rem;
    }
    // .col-p-6 + .col-p-6 {
      // margin-left: 0.48rem;
    // }
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
    .row-p + .row-p{
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
