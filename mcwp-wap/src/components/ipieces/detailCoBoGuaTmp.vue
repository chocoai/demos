<template>
  <div>
     <div class="common-container" v-if='loanCoBorrower && loanCoBorrower.length'>
        <div class="common-container" v-for='(item, index) in loanCoBorrower' :key='index'>
          <p class="p-title">共同借款人{{index + 1}}信息<img v-if="coPic && coPic.length" class="title-pic" src="../../assets/base-top-show.png" @click="showPic(Config.bizType.loanCoborrower, coPic)" /></p>
          <div class="base-content">
              <!-- <div v-if="type === '6'">
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
              </div> -->
              <p class="col-p">
                <span class="row-p"><span class="lable-span">姓名:</span> <span class='verify-name'>{{item.name || '未录入'}}</span> </span>
                <span class="row-p"><span class="lable-span">性别:</span>{{item.sex || '未录入'}}</span>
              </p>
              <p class="col-p">
                <span class="row-p"><span class="lable-span">月收入:</span>{{item.income && item.income+'元' || '未录入'}}</span>
                <span class="row-p"><span class="lable-span">年龄:</span>{{item.age && item.age + '岁' || '未录入'}}</span>
              </p>
              <p class="col-p">
                <span class="row-p-common"><span class="lable-span">与申请人关系:</span>{{item.cRelationshipText || '未录入'}}</span>
              </p>
              <p class="col-p">
                <span class="row-p-common"><span class="lable-span">单位名称:</span>{{item.orgName || '未录入'}}</span>
              </p>
              <!-- <p class="col-p">
                <span class="row-p-common"><span class="lable-span">征信状况:</span>征信良好，无逾期记录</span>
              </p> -->
              <p class="col-p">
                <span class="row-p-common"><span class="lable-span">主营业务或职务:</span>{{item.mainBusiness || '未录入'}}</span>
              </p>
              <p class="col-p">
                <span class="row-p-common">
                  <span class="lable-span">身份证号:</span>{{item.idCardNo || '未录入'}}
                  <!--<img class='idcard-pic' src='../../assets/idcard.png'/>-->
                  <!-- <span v-if="!loanData.cIdCardVerifyRet || loanData.cIdCardVerifyRet==3" class="checkout-result-fail">未核实</span>
                  <span v-else class="checkout-result-success" :class="{'identical-result': loanData.cIdCardVerifyRet==0, 'different-result': loanData.cIdCardVerifyRet!=0 }">查看结果
                    <Popover class="popover-show">{{loanData.cIdCardVerify || '未录入'}}</Popover>
                  </span> -->
                </span>
              </p>
              <p class="col-p">
                <span class="row-p-common"><span class="lable-span">联系方式:</span>{{item.telephone || '未录入'}}
                  <!-- <span v-if="!loanData.cTelVerifyRet || loanData.cTelVerifyRet==3" class="checkout-result-fail">未核实</span>
                  <span v-else class="checkout-result-success" :class="{'identical-result': loanData.cTelVerifyRet==0, 'different-result': loanData.cTelVerifyRet!=0 }">查看结果
                    <Popover class="popover-show">{{loanData.cTelVerify || '未录入'}}</Popover>
                  </span> -->
                </span>
              </p>
              <p class="col-p">
                <span class="row-p-common"><span class="lable-span">单位地址:</span>{{item.orgAddr || '未录入'}}</span>
              </p>
              <p class="col-p">
                <span class="row-p-common"><span class="lable-span">其他信息:</span>{{item.otherMessage || '未录入'}}</span>
              </p>
          </div>
        </div>
      </div>
      <div class="common-container" v-if='loanGuarantee && loanGuarantee.length'>
        <div class="common-container" v-for='(item, index) in loanGuarantee' :key='index'>
          <p class="p-title">担保人{{index + 1}}信息<img v-if="guPic && guPic.length" class="title-pic" src="../../assets/base-top-show.png" @click="showPic(Config.bizType.loanGuarantee, guPic)" /></p>
          <div class="main-content">
            <div class="base-content">
              <!-- <div v-if="type === '6'">
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
              </div> -->
              <p class="col-p">
                <span class="row-p"><span class="lable-span">姓名:</span> <span class='verify-name'>{{item.name || '未录入'}}</span> </span>
                <span class="row-p"><span class="lable-span">性别:</span>{{item.sex || '未录入'}}</span>
              </p>
              <p class="col-p">
                <span class="row-p"><span class="lable-span">月收入:</span>{{item.income && item.income+'元' || '未录入'}}</span>
                <span class="row-p"><span class="lable-span">年龄:</span>{{item.age && item.age + '岁' || '未录入'}}</span>
              </p>
              <!-- <p class="col-p">
                <span class="row-p-common"><span class="lable-span">与申请人关系:</span>{{item.gRelationshipText || '未录入'}}</span>
              </p> -->
              <p class="col-p">
                <span class="row-p-common"><span class="lable-span">单位名称:</span>{{item.orgName || '未录入'}}</span>
              </p>
              <!-- <p class="col-p">
                <span class="row-p-common"><span class="lable-span">征信状况:</span>征信良好，无逾期记录</span>
              </p> -->
              <p class="col-p">
                <span class="row-p-common"><span class="lable-span">主营业务或职务:</span>{{item.mainBusiness || '未录入'}}</span>
              </p>
              <!-- <p class="col-p">
                <span class="row-p-common"><span class="lable-span">单位住址:</span>{{item.orgAddr || '未录入'}}</span>
              </p> -->
              <p class="col-p">
                <span class="row-p-common"><span class="lable-span">身份证号:</span>{{item.idCardNo || '未录入'}}
                  <!-- <span v-if="!loanData.gIdCardVerifyRet || loanData.gIdCardVerifyRet==3" class="checkout-result-fail">未核实</span>
                  <span v-else class="checkout-result-success" :class="{'identical-result': loanData.gIdCardVerifyRet==0, 'different-result': loanData.gIdCardVerifyRet!=0 }">查看结果
                    <Popover class="popover-show">{{loanData.gIdCardVerify || '未录入'}}</Popover>
                  </span> -->
                </span>
              </p>
              <p class="col-p">
                <span class="row-p-common"><span class="lable-span">联系方式:</span>{{item.telephone || '未录入'}}
                  <!-- <span v-if="!loanData.gTelVerifyRet || loanData.gTelVerifyRet==3" class="checkout-result-fail">未核实</span>
                  <span v-else class="checkout-result-success" :class="{'identical-result': loanData.gTelVerifyRet==0, 'different-result': loanData.gTelVerifyRet!=0 }">查看结果
                    <Popover class="popover-show">{{loanData.gTelVerify || '未录入'}}</Popover>
                  </span> -->
                </span>
              </p>
              <p class="col-p">
                <span class="row-p-common"><span class="lable-span">单位地址:</span>{{item.orgAddr || '未录入'}}</span>
              </p>
              <p class="col-p">
                <span class="row-p-common"><span class="lable-span">其他信息:</span>{{item.otherMessage || '未录入'}}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
import Popover from '../../components/popover.vue'
import Config from '../../config/index'

export default {
  components: {
    Popover
  },
  props: ['type', 'loanData', 'picInfo'],
  data () {
    return {
      // 征信状况暂时没有，需要补充进模板
      loanCoBorrower: this.loanData.loanCoBorrower,
      loanGuarantee: this.loanData.loanGuarantee,
      Config: Config,
      coPic: this.picInfo[Config.bizType.loanCoborrower],
      guPic: this.picInfo[Config.bizType.loanGuarantee]
    }
  },
  methods: {
    showPic (type, PicList) {
      this.$emit('showPic', type, PicList)
    }
  },
  mounted () {
    console.log(this.guPic, 'this.guPic')
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
    .popover,.active {
      width: 5rem!important;
    }
    .icon-explain {
      width: .4rem;
      height: .4rem;
      position: relative;
      top: .05rem;
    }
  }
</style>
