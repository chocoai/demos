<template>
  <div>
    <div class="base-container">
      <p id='customer' class="p-title">个人信息<img v-if="personPic && personPic.length" class="title-pic" src="../../assets/base-top-show.png" @click="showPic(Config.bizType.loanPerson, personPic)" /></p>
      <div class="base-content" v-if="loanCustomer">
        <p class="col-p">
          <span class="lable-span">姓名:</span>
          <span class="content-span">{{loanCustomer && loanCustomer.handInputName || '未录入'}}</span>
          <!-- <img v-if="type != 8" @click="showFace=true" class="content-pic" src="../../assets/tab-menber.png"/> -->
          <!-- <span @click="showFace=true" v-if="basicInfoVerifyDTO.cnameVerifyRet == null  || basicInfoVerifyDTO.cnameVerifyRet ==3" class="checkout-result-fail">未核实</span>
          <span v-else-if="basicInfoVerifyDTO.cnameVerifyRet == 0" class="checkout-result-success" :class="{'identical-result': basicInfoVerifyDTO.faceVerifyRet==0 || (!basicInfoVerifyDTO.faceVerifyRet && basicInfoVerifyDTO.cnameVerifyRet == 0 ), 'different-result': basicInfoVerifyDTO.faceVerifyRet}">查看结果
            <Popover class="popover-show">{{basicInfoVerifyDTO.faceVerify || basicInfoVerifyDTO.cnameVerify}}</Popover>
          </span>
          <span v-else class="checkout-result-success different-result">查看结果
            <Popover class="popover-show">{{basicInfoVerifyDTO.cnameVerify}}</Popover>
          </span> -->
        </p>
        <p class="col-p">
          <span class="row-p">
            <span class="lable-span">婚姻状况:</span>
            <span class="content-span">{{loanCustomer.maritalStatusText || '未录入'}}</span>
          </span>
          <span class="row-p">
            <span class="lable-span">年龄:</span>
            <span class="content-span">{{loanCustomer.age && loanCustomer.age + '岁' || '未录入'}}</span>
          </span>
        </p>
        <p class="col-p">
          <!-- <span class="row-p">
            <span class="lable-span">学历:</span>
            <span class="content-span exist-result">{{loanCustomer.education && eduDict && eduDict.filter((item,index)=>(item.ddValue==loanCustomer.education))[0]['ddText'] || '未录入'}}</span>
          </span> -->
          <span class="row-p">
            <span class="lable-span">性别:</span>
            <span class="content-span">{{loanCustomer.sex || '未录入'}}</span>
          </span>
          <span class="row-p">
            <span class="lable-span">学历:</span>
            <span class="content-span exist-result">{{loanCustomer.education && eduDict && eduDict.filter((item,index)=>(item.ddValue==loanCustomer.education))[0]['ddText'] || '未录入'}}</span>
          </span>
        </p>
        <p class="col-p">
          <span class="lable-span">户籍:</span>
          <span class="content-span">{{loanCustomer.censusRegister || '未录入'}}</span>
        </p>
        <p class="col-p">
          <span class="lable-span">身份证号:</span>
          <span class="content-span">{{loanCustomer.idCardNo || '未录入'}}</span>
          <img @click="showIdCard=true" class="content-pic identity-icon" src="../../assets/identity-icon.png"/>
          <!-- <span v-if="(!basicInfoVerifyDTO.customerIdCardVerifyRet && basicInfoVerifyDTO.customerIdCardVerifyRet != 0) || basicInfoVerifyDTO.customerIdCardVerifyRet==3" class="checkout-result-fail">未核实</span>
          <span v-else class="checkout-result-success" :class="{'identical-result': basicInfoVerifyDTO.customerIdCardVerifyRet==0, 'different-result': basicInfoVerifyDTO.customerIdCardVerifyRet!=0 }">查看结果
            <Popover class="popover-show">{{basicInfoVerifyDTO.customerIdCardVerify}}</Popover>
          </span> -->
        </p>
        <p class="col-p">
          <span class="row-p">
            <span class="lable-span">总项目资金:</span>
            <span class="content-span">{{loanCustomer && loanCustomer.allBalance && loanCustomer.allBalance + '万元' || '未录入'}}</span>
          </span>
          <span class="row-p">
            <span class="lable-span">还款期数:</span>
            <span class="content-span">{{loanCustomer && loanCustomer.repaymentPeriod && hkqs && hkqs.filter((item,index)=>(item.ddValue==loanCustomer.repaymentPeriod))[0]['ddText'] + '期' || '未录入'}}</span>
          </span>
        </p>
        <p class="col-p">
          <span class="lable-span">客户经理预估金额:</span>
          <span class="content-span">{{loanCustomer && loanCustomer.estimateAmount && loanCustomer.estimateAmount + '万元' || '未录入'}}</span>
        </p>
        <p class="col-p">
          <span class="row-p">
            <span class="lable-span">申请金额:</span>
            <span class="content-span">{{loanCustomer && loanCustomer.applyBalance && loanCustomer.applyBalance + '元' || '未录入'}}</span>
          </span>
          <span class="row-p">
            <span class="lable-span">还款方式:</span>
            <span class="content-span">{{loanCustomer && loanCustomer.repaymentKind && hkfs && hkfs.filter((item,index)=>(item.ddValue==loanCustomer.repaymentKind))[0]['ddText'] || '未录入'}}</span>
          </span>
        </p>
        <p class="col-p">
          <span class="lable-span">联系方式:</span>
          <span class="content-span exist-result">{{loanCustomer.telephone || '未录入'}}</span>
          <!-- <span v-if="(!basicInfoVerifyDTO.customerTelVerifyRet && basicInfoVerifyDTO.customerTelVerifyRet != 0) || basicInfoVerifyDTO.customerTelVerifyRet==3" class="checkout-result-fail">未核实</span>
          <span v-else class="checkout-result-success" :class="{'identical-result': basicInfoVerifyDTO.customerTelVerifyRet==0, 'different-result': basicInfoVerifyDTO.customerTelVerifyRet!=0 }">查看结果
            <Popover class="popover-show">{{basicInfoVerifyDTO.customerTelVerify}}</Popover>
          </span> -->
        </p>
        <p class="col-p">
          <span class="lable-span">户籍住址:</span>
          <span class="content-span">{{loanCustomer.idCardAddr || '未录入'}}</span>
        </p>
        <p class="col-p">
          <span class="lable-span">家庭地址:</span>
          <span class="content-span">{{loanCustomer.homeAddr || '未录入'}}</span>
          <!-- <span v-if="(!basicInfoVerifyDTO.addrVerifyRet && basicInfoVerifyDTO.addrVerifyRet != 0) || basicInfoVerifyDTO.addrVerifyRet==3" class="checkout-result-fail">未核实</span>
          <span v-else class="checkout-result-success" :class="{'identical-result': basicInfoVerifyDTO.addrVerifyRet==0, 'different-result': basicInfoVerifyDTO.addrVerifyRet!=0 }">查看结果
            <Popover class="popover-show">{{basicInfoVerifyDTO.addrVerify}}</Popover>
          </span> -->
        </p>
      </div>
      <p class="no-data" v-if="!loanCustomer">暂无相关信息</p>
    </div>
    <div class="base-container">
      <p class="p-title">直系亲属信息<img v-if="spousePic && spousePic.length" class="title-pic" src="../../assets/base-top-show.png" @click="showPic(Config.bizType.loanSpouse, spousePic)" /></p>
      <div class="base-content" v-if="loanSpouse">
        <p class="col-p">
          <span class="lable-span">姓名:</span>
          <span class="content-span">{{loanSpouse.name || '未录入'}}</span>
        </p>
        <p class="col-p">
          <span class="row-p">
            <span class="lable-span">月收入:</span>
            <span class="content-span">{{loanSpouse.income && loanSpouse.income + '元' || '未录入'}}</span>
          </span>
          <span class="row-p">
            <span class="lable-span">性别:</span>
            <span class="content-span">{{loanSpouse.sex || '未录入'}}</span>
          </span>
        </p>
        <p class="col-p">
          <span class="row-p">
            <span class="lable-span">学历:</span>
            <span class="content-span">{{loanSpouse.education && eduDict && eduDict.filter((item,index)=>(item.ddValue==loanSpouse.education))[0]['ddText'] || '未录入'}}</span>
          </span>
          <!-- <span class="row-p">
            <span class="lable-span">年龄:</span>
            <span class="content-span">{{loanSpouse.age && loanSpouse.age + '岁' || '未录入'}}</span>
          </span> -->
        </p>
        <p class="col-p">
          <span class="lable-span">与申请人关系:</span>
          <span class="content-span">{{loanSpouse.relationship   && bcgx && bcgx.filter((item,index)=>(item.ddValue==loanSpouse.relationship ))[0]['ddText'] || '未录入'}}</span>
        </p>
        <!-- <p class="col-p">
          <span class="lable-span">单位名称:</span>
          <span class="content-span">{{loanSpouse.orgName || '未录入'}}</span>
        </p>
        <p class="col-p">
          <span class="lable-span">单位地址:</span>
          <span class="content-span">{{loanSpouse.orgAddr || '未录入'}}</span>
        </p> -->
        <p class="col-p">
          <span class="lable-span">身份证号:</span>
          <span class="content-span exist-result">{{loanSpouse.idCardNo || '未录入'}}</span>
          <!-- <span v-if="(!basicInfoVerifyDTO.spouseIdCardVerifyRet && basicInfoVerifyDTO.spouseIdCardVerifyRet != 0) || basicInfoVerifyDTO.spouseIdCardVerifyRet==3" class="checkout-result-fail">未核实</span>
          <span v-else class="checkout-result-success" :class="{'identical-result': basicInfoVerifyDTO.spouseIdCardVerifyRet==0, 'different-result': basicInfoVerifyDTO.spouseIdCardVerifyRet!=0 }">查看结果
            <Popover class="popover-show">{{basicInfoVerifyDTO.spouseIdCardVerify}}</Popover>
          </span> -->
        </p>
        <p class="col-p">
          <span class="lable-span">联系方式:</span>
          <span class="content-span exist-result">{{loanSpouse.telephone || '未录入'}}</span>
          <!-- <span v-if="(!basicInfoVerifyDTO.spouseTelVerifyRet && basicInfoVerifyDTO.spouseTelVerifyRet != 0) || basicInfoVerifyDTO.spouseTelVerifyRet==3" class="checkout-result-fail">未核实</span>
          <span v-else class="checkout-result-success" :class="{'identical-result': basicInfoVerifyDTO.spouseTelVerifyRet==0, 'different-result': basicInfoVerifyDTO.spouseTelVerifyRet!=0 }">查看结果
            <Popover class="popover-show">{{basicInfoVerifyDTO.spouseTelVerify}}</Popover>
          </span> -->
        </p>
      </div>
      <p class="no-data" v-if="!loanSpouse">暂无相关信息</p>
    </div>
    <div class="base-container">
      <p class="p-title">紧急联系人信息<img v-if="spousePic && spousePic.length" class="title-pic" src="../../assets/base-top-show.png" @click="showPic(Config.bizType.loanSpouse, spousePic)" /></p>
      <div class="base-content" v-if="loanSpouse">
        <p class="col-p">
          <span class="lable-span">姓名:</span>
          <span class="content-span">{{loanSpouse.emergencyContactName  || '未录入'}}</span>
        </p>
        <p class="col-p">
          <span class="lable-span">联系方式:</span>
          <span class="content-span">{{loanSpouse.emergencyContactTelephone  || '未录入'}}</span>
        </p>
        <p class="col-p">
          <span class="lable-span">与申请人关系:</span>
          <span class="content-span">{{loanSpouse.emergencyContactFriendship   && bcgx && bcgx.filter((item,index)=>(item.ddValue==loanSpouse.emergencyContactFriendship ))[0]['ddText'] || '未录入'}}</span>
        </p>
      </div>
      <p class="no-data" v-if="!loanSpouse">暂无相关信息</p>
    </div>
    <div class="base-container">
      <p class="p-title">家庭情况信息<img v-if="familyPic &&　familyPic.length" class="title-pic" src="../../assets/base-top-show.png" @click="showPic(Config.bizType.loanFamily, familyPic)" /></p>
      <div class="base-content" v-if="loanHomeInfo">
        <p class="col-p">
          <span class="lable-span">家庭每月总收入:</span>
          <span class="content-span">{{loanHomeInfo.income && '每月' + loanHomeInfo.income + '元' || '未录入'}}</span>
        </p>
        <p class="col-p">
          <span class="lable-span">家庭每月总花销:</span>
          <span class="content-span">{{loanHomeInfo.totalcost && '每月' + loanHomeInfo.totalcost + '元' || '未录入'}}</span>
        </p>
        <p class="col-p">
          <span class="row-p">
            <span class="lable-span">家庭成员:</span>
            <span class="content-span">{{loanHomeInfo.memberNum && loanHomeInfo.memberNum + '个' || '未录入'}}</span>
          </span>
          <span class="row-p">
            <span class="lable-span">供养人数:</span>
            <span class="content-span">{{loanHomeInfo.supportNum && loanHomeInfo.supportNum + '个' || '未录入'}}</span>
          </span>
        </p>
        <p class="col-p">
          <span class="lable-span">子女情况:</span>
          <span class="content-span">{{loanData.childrenInfoText || '未录入'}}</span>
        </p>
        <p class="col-p">
          <span class="lable-span">父母情况:</span>
          <span class="content-span">{{loanHomeInfo.parentInfo && loanHomeInfo.parentInfo || '未录入'}}</span>
        </p>
        <p class="col-p">
          <span class="lable-span">备注:</span>
          <span class="content-span">{{loanHomeInfo.remark && loanHomeInfo.remark || '未录入'}}</span>
        </p>
      </div>
      <p class="no-data" v-if="!loanHomeInfo">暂无相关信息</p>
    </div>
    <div class="base-container" v-if='loanPledgeInfos && loanPledgeInfos.length'>
      <div v-for='(item, index) in loanPledgeInfos' :key='index'>
        <p class="p-title">抵质押{{index + 1}}信息</p>
        <div class="base-content">
          <p class="col-p">
            <span class="lable-span">抵质押物名称:</span>
            <span class="content-span">{{item.pledgeName || '未录入'}}</span>
          </p>
          <p class="col-p">
            <span class="lable-span">类型:</span>
            <span class="content-span">{{item.pledgeType ? item.pledgeType === 1 ? '抵押物' : '质押物' : '未录入'}}</span>
          </p>
          <p class="col-p">
            <span class="lable-span">抵押人姓名:</span>
            <span class="content-span">{{item.name || '未录入'}}</span>
          </p>
          <p class="col-p">
            <span class="lable-span">与申请人关系:</span>
            <span class="content-span">{{item.relationshipText || '未录入'}}</span>
          </p>
          <p class="col-p">
            <span class="row-p">
              <span class="lable-span">评估价值:</span>
              <span class="content-span">{{item.houseTotal && item.houseTotal + '万元' || '未录入'}}</span>
            </span>
          </p>
          <p class="col-p">
            <span class="row-p">
              <span class="lable-span">面积:</span>
              <span class="content-span">{{item.houseSize && item.houseSize + '㎡' || '未录入'}}</span>
            </span>
            <span class="row-p">
              <span class="lable-span">房龄:</span>
              <span class="content-span">{{item.houseAge && item.houseAge + '年' || '未录入'}}</span>
            </span>
          </p>
          <p class="col-p">
            <span class="lable-span">房屋位置:</span>
            <span class="content-span">{{item.address || '未录入'}}</span>
          </p>
          <p class="col-p">
            <span class="lable-span">权证号:</span>
            <span class="content-span">{{item.warrentNumber || '未录入'}}</span>
          </p>
          <p class="col-p">
            房屋是否已抵押给其他银行或个人:{{item.pledgeStatus ? '是' : '否'}}
          </p>
          <p class="col-p">
            <span class="lable-span">备注:</span>
            <span class="content-span">{{item.remark || '未录入'}}</span>
          </p>
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
import Config from '../../config/index'

export default {
  directives: {
    TransferDom
  },
  components: {
    Popover,
    XDialog
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
      familyPic: this.picInfo[Config.bizType.loanFamily],
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
    console.log(this.loanData, this.picInfo)
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
