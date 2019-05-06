<template>
  <div class="flowpath-container">
    <!-- <h2 class="flowpath-title">潞盈人人贷业务办理流程</h2>
    <p class="flowpath-content">1、点击产品链接，了解产品基本信息。点击立即申请，进入产品申请界面</p>
    <img class="flowpath-img" src="@/assets/flowpath_01.png">
    <p class="flowpath-content">2、填写包括姓名、联系方式、学历、申请金额、职业信息等内容，确认无误后，点击下一步。请注意，填写的相关信息将成为给出额度的参考，与您的信用相关，请如实填写信息</p>
    <img class="flowpath-img" src="@/assets/flowpath_02.png">
    <p class="flowpath-content">3、拍摄或者上传身份证正反面照片，并上传请注意画面的清晰完整</p>
    <img class="flowpath-img" src="@/assets/flowpath_03.png">
    <p class="flowpath-content">4、点击拍照进行人脸识别，并核实身份证信息，确认无误之后点击下一步</p>
    <img class="flowpath-img" src="@/assets/flowpath_04.png">
    <p class="flowpath-content">5、恭喜您，成为获得预授信额度。请携带身份证前往银行网点签字确认并提款~~</p>
    <img class="flowpath-img" src="@/assets/flowpath_05.png"> -->
    <img class="flowpath-img flowpath-img-click" src="@/assets/flowpath_new_01.png" @click.prevent="1">
    <img class="flowpath-img flowpath-img-click" src="@/assets/flowpath_new_02.png" @click.prevent="1">
    <img class="flowpath-img" src="@/assets/flowpath_new_03.png">
    <img class="flowpath-img" src="@/assets/flowpath_new_04.png">
    <img class="flowpath-img" src="@/assets/flowpath_new_05.png">
    <img class="flowpath-img" src="@/assets/flowpath_new_06.png">
  </div>
</template>
<script>
export default {};
</script>
<style lang="less" scoped>
.flowpath-container {
  width: 10.8rem;
  margin: 0 auto;
  padding-bottom: 1.2rem;
  background: #fff;
  .flowpath-title {
    width: 9.84rem;
    margin: 0 auto;
    text-align: left;
    font-size: 0.48rem;
    color: #333;
    height: 1.44rem;
    line-height: 1.44rem;
    border-bottom: #ddd 0.02rem solid;
  }
  .flowpath-content {
    width: 9.84rem;
    margin: 0.48rem auto 0.4rem;
    text-align: left;
    font-size: 0.4rem;
    color: #333;
    line-height: 0.72rem;
  }
  .flowpath-img {
    // width: 9.84rem;
    // margin: 0 auto 0.24rem;
    width: 10.8rem;
  }
  .flowpath-img-click {
    pointer-events: auto;
  }
  .condition {
    width: 9.84rem;
    margin: 0.4rem auto 0;
    text-align: left;
    font-size: 0.4rem;
    color: #333;
    line-height: 0.72rem;
  }
  .condition-content {
    width: 9.84rem;
    margin: 0 auto;
    text-align: left;
    font-size: 0.4rem;
    color: #333;
    line-height: 0.72rem;
    padding-bottom: 1.2rem;
  }
}
</style>
