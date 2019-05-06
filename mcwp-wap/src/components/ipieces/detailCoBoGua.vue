<template>
  <div>

    <div v-for="value in moduleConfig" :key="value.formEnName">

      <div class="common-container" v-if="value.formEnName == 'coBorrowerInfo' && loanData.moduleName.coBorrowerInfo">
        <div class="common-container" v-if='loanCoBorrower && loanCoBorrower.length' v-for='(item, index) in loanCoBorrower' :key='index'>
          <p class="p-title">{{loanData.moduleName.coBorrowerInfo}}{{index + 1}}<img v-if="coPic && coPic.length" class="title-pic" src="../../assets/base-top-show.png" @click="showPic(Config.bizType.loanCoborrower, coPic)" /></p>
          <div class="base-content">
            <div v-if="type === '6'">
              <div v-if="item.identityResult ">
                <p class="col-p">
                  <span class="lable-span lable-title">核身模型验证结果</span>
                </p>
                <p class="col-p">
                  <span class="lable-span">身份证与姓名是否一致:</span> <span className="verify-true" v-if="item.identityResult.idNameCheckResult">是</span><span className="verify-false" v-else>否</span>
                </p>
                <p class="col-p">
                  <span class="lable-span">手机号是否实名认证:</span>  <span className="verify-true" v-if="item.identityResult.idNameCheckResult">是</span><span className="verify-false" v-else>否</span>
                </p>
              </div>
              <p class="col-p" v-else>
                <span class="row-p">核身模型暂未验证</span>
              </p>
              <div v-if="item.creditQueryResult">
                <p class="col-p">
                  <span class="lable-span lable-title">征信模型验证结果</span>
                </p>
                <p class="col-p" v-if="item.creditQueryResult.pbocScore">
                  <span class="lable-span">央行授信评分:</span> <span className="verify-true">{{item.creditQueryResult.pbocScore}}{{item.creditQueryResult.pbocScore < 490 ? '征信较差' : 490 < item.creditQueryResult.pbocScore && item.creditQueryResult.pbocScore < 510 ? '征信一般' : 510 < item.creditQueryResult.pbocScore && item.creditQueryResult.pbocScore < 530 ? '征信良好' : '征信优秀'}}</span>
                  <span class="checkout-creContent-success">
                    <img class="icon-explain" src="../../assets/icon_explain.png"/>
                    <Popover :placement='true' class="popover-show">
                      <div class="creContent-container">
                        <p className="creContent-p">征信较差:分值范围[-,490]</p>
                        <p className="creContent-p">征信一般:分值范围[490,510]</p>
                        <p className="creContent-p">征信良好:分值范围[510,530]</p>
                        <p className="creContent-p">征信优秀:分值范围[530,+]</p>
                      </div>
                    </Popover>
                  </span>
                </p>
                <p class="col-p" v-else>
                  <span class="lable-span">央行拒绝原因:</span> <span className="verify-true">{{item.creditQueryResult.message}}</span>
                </p>
              </div>
              <p class="col-p" v-else>
                <span class="row-p">征信模型暂未验证</span>
              </p>
            </div>
            <common-detail :fieldConfig='fieldConfig.coBorrowerInfo' :detailData='item'>
              <template scope="{i}">
                <!-- <div v-if="i.name == 'idCardNo'">
                  <span v-if="item.cIdCardVerifyRet == null || item.cIdCardVerifyRet==3" class="checkout-result-fail">未核实</span>
                  <span v-else class="checkout-result-success" :class="{'identical-result': item.cIdCardVerifyRet==0, 'different-result': item.cIdCardVerifyRet!=0 }">查看结果
                    <Popover class="popover-show">{{item.cIdCardVerify || '未录入'}}</Popover>
                  </span>
                </div>
                <div v-if="i.name == 'telephone'">
                  <span v-if="item.cTelVerifyRet == null || item.cTelVerifyRet==3" class="checkout-result-fail">未核实</span>
                  <span v-else class="checkout-result-success" :class="{'identical-result': item.cTelVerifyRet==0, 'different-result': item.cTelVerifyRet!=0 }">查看结果
                    <Popover class="popover-show">{{item.cTelVerify || '未录入'}}</Popover>
                  </span>
                </div> -->
              </template>
            </common-detail>
          </div>
        </div>
        <div v-if='!(loanCoBorrower && loanCoBorrower.length)'>
          <p class="p-title">{{loanData.moduleName.coBorrowerInfo}}<img v-if="coPic && coPic.length" class="title-pic" src="../../assets/base-top-show.png" @click="showPic(Config.bizType.loanCoborrower, coPic)" /></p>
          <p class="no-data">暂无相关信息</p>
        </div>
      </div>

      <div class="common-container" v-else-if="value.formEnName == 'guarantorInfo' && loanData.moduleName.guarantorInfo">
        <div class="common-container" v-if='loanGuarantee && loanGuarantee.length' v-for='(item, index) in loanGuarantee' :key='index'>
          <p class="p-title">{{loanData.moduleName.guarantorInfo}}{{index + 1}}<img v-if="guPic && guPic.length" class="title-pic" src="../../assets/base-top-show.png" @click="showPic(Config.bizType.loanGuarantee, guPic)" /></p>
          <div class="main-content">
            <div class="base-content">
              <div v-if="type === '6'">
                <div v-if="item.identityResult">
                  <p class="col-p">
                    <span class="lable-span">身份证与姓名是否一致:</span> <span className="verify-true" v-if="item.identityResult.idNameCheckResult">是</span><span className="verify-false" v-else>否</span>
                  </p>
                  <p class="col-p">
                    <span class="lable-span">手机号是否实名认证:</span>  <span className="verify-true" v-if="item.identityResult.idNameCheckResult">是</span><span className="verify-false" v-else>否</span>
                  </p>
                </div>
                <p class="col-p" v-else>
                  <span class="row-p">核身模型暂未验证</span>
                </p>
                <div v-if="item.creditQueryResult">
                  <p class="col-p" v-if="item.creditQueryResult.pbocScore">
                    <span class="lable-span">央行授信评分:</span> <span className="verify-true">{{item.creditQueryResult.pbocScore}}{{item.creditQueryResult.pbocScore < 490 ? '征信较差' : 490 < item.creditQueryResult.pbocScore && item.creditQueryResult.pbocScore < 510 ? '征信一般' : 510 < item.creditQueryResult.pbocScore && item.creditQueryResult.pbocScore < 530 ? '征信良好' : '征信优秀'}}</span>
                    <span class="checkout-creContent-success">
                      <img class="icon-explain" src="../../assets/icon_explain.png"/>
                      <Popover :placement='true' class="popover-show">
                        <div class="creContent-container">
                            <p className="creContent-p">征信较差:分值范围[-,490]</p>
                            <p className="creContent-p">征信一般:分值范围[490,510]</p>
                            <p className="creContent-p">征信良好:分值范围[510,530]</p>
                            <p className="creContent-p">征信优秀:分值范围[530,+]</p>
                        </div>
                      </Popover>
                    </span>
                  </p>
                  <p class="col-p" v-else>
                    <span class="lable-span">央行拒绝原因:</span> <span className="verify-true">{{item.creditQueryResult.message}}</span>
                  </p>
                </div>
                <p class="col-p" v-else>
                  <span class="row-p">征信模型暂未验证</span>
                </p>
              </div>
              <common-detail :fieldConfig='fieldConfig.guarantorInfo' :detailData='item'>
                <template scope="{i}">
                  <!-- <div v-if="i.name == 'idCardNo'">
                    <span v-if="item.gIdCardVerifyRet == null || item.gIdCardVerifyRet==3" class="checkout-result-fail">未核实</span>
                    <span v-else class="checkout-result-success" :class="{'identical-result': item.gIdCardVerifyRet==0, 'different-result': item.gIdCardVerifyRet!=0 }">查看结果
                      <Popover class="popover-show">{{item.gIdCardVerify || '未录入'}}</Popover>
                    </span>
                  </div>
                  <div v-if="i.name == 'telephone'">
                    <span v-if="item.gTelVerifyRet == null || item.gTelVerifyRet==3" class="checkout-result-fail">未核实</span>
                    <span v-else class="checkout-result-success" :class="{'identical-result': item.gTelVerifyRet==0, 'different-result': item.gTelVerifyRet!=0 }">查看结果
                      <Popover class="popover-show">{{item.gTelVerify || '未录入'}}</Popover>
                    </span>
                  </div> -->
                </template>
              </common-detail>
            </div>
          </div>
        </div>
        <div v-if="!(loanGuarantee && loanGuarantee.length)">
          <p class="p-title">{{loanData.moduleName.guarantorInfo}}<img v-if="guPic && guPic.length" class="title-pic" src="../../assets/base-top-show.png" @click="showPic(Config.bizType.loanGuarantee, guPic)" /></p>
          <p class="no-data">暂无相关信息</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Popover from '../../components/popover.vue'
import Utils from '../../config/utils'
import ComBoGuaFieldConfig from '../../config/Ipieces/ComBoGua'
import CommonDetail from './commonDetail'
import Config from '../../config/index'

export default {
  components: {
    Popover,
    CommonDetail
  },
  props: ['type', 'loanData', 'picInfo'],
  data () {
    return {
      // 征信状况暂时没有，需要补充进模板
      loanCoBorrower: this.loanData.loanCoBorrower,
      loanGuarantee: this.loanData.loanGuarantee,
      Config: Config,
      coPic: this.picInfo[Config.bizType.loanCoborrower],
      guPic: this.picInfo[Config.bizType.loanGuarantee],
      fieldConfig: Utils.deepMerge(ComBoGuaFieldConfig, this.loanData.fieldConfig),
      moduleConfig: this.loanData.moduleConfig.sort((i1, i2) => i1.position - i2.position)
    }
  },
  methods: {
    showPic (type, PicList) {
      this.$emit('showPic', type, PicList)
    }
  },
  mounted () {
    console.log(this.guPic, this.loanData, 'this.guPic')
  }
}
</script>

<style lang="less" scoped>
.common-container{
    width: 10rem;
    margin: 0.26rem auto;
    background: #fff;
    padding-bottom: .2rem;
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
    .title-pic{
      position: absolute;
      width: 0.6rem;
      height: 0.6rem;
      top: 0.34rem;
      right: 0.28rem;
    }
    .base-top-show{
      position: absolute;
      width: 0.6rem;
      height: 0.6rem;
      top: 0.34rem;
      right: 0.28rem;
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
      padding: 0 0.7rem;
      margin-top:0.35rem;
    }

    .col-p{
      font-size: 0.36rem;
      color: #4f4e4e;
      line-height: 0.76rem;
    }
    .row-p{
      display: inline-block;
      width: 4rem;
    }

    // 检验名字
    .verify-name {

      font-size: 0.36rem;
      // background: url(../../assets/verify-face.png) no-repeat right 0.15rem;
      background-size: 0.44rem 0.44rem;
      margin-left: 0.28rem;
      display: inline-block;

      padding-right: 0.58rem;
    }
    // 检验身份证号 电话号码
    .verify-idnum,.verify-tel {
      color: #8c8888;
      font-size: 0.28rem;
      background: url(../../assets/checked.png) no-repeat 0 0.15rem;
      background-size: 0.44rem 0.44rem;
      margin-left: 0.28rem;
      display: inline-block;

      padding-left: 0.58rem;
    }
    // 引入身份证图片
    .idcard-pic {
      width:0.5rem;
      height:0.5rem;
      vertical-align:text-bottom;
    }
    .row-p+.row-p{
      margin-left: 0.48rem;
    }
    .lable-span{
      margin-right: 0.1rem;
    }
    .lable-title {
      color: #333;
      font-weight: bold;
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
      display: inline-block;
      // float: left;
      padding-left: 0.46rem;
      position: relative;
    }
    .checkout-result-fail{
      color: #8c8888;
      font-size: 0.28rem;
      background: url(../../assets/checkout-fail.png) no-repeat 0 0.25rem;
      background-size: 0.34rem 0.34rem;
      margin-left: 0.28rem;
      display: inline-block;
      // float: left;
      padding-left: 0.46rem;
    }
    .checkout-result-success:hover .popover-show {
      display: block;
    }
    .checkout-result-success .popover-show {
      display: none;
    }
    .checkout-creContent-success {
      position: relative;
    }
    .checkout-creContent-success:hover .popover-show {
      display: block;
    }
    .checkout-creContent-success .popover-show {
      display: none;
    }
    .creContent-container {
      width: 5.5rem;
      font-size: .26rem;
      line-height: .8rem;
    }
    // .popover,.active {
    //   width: 5rem!important;
    // }
    .icon-explain {
      width: .4rem;
      height: .4rem;
      position: relative;
      top: .05rem;
    }
    .no-data{
      text-align: center;
      padding: 0.3rem;
      font-size: 0.36rem;
    }
  }
</style>
