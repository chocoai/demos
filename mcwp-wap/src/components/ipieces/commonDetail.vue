<template>
  <div>
    <div v-for="(i, index) in fieldConfig" :key="index" :class="`col-p-${i.h5Width || i.detailWidth}`" v-if="i.isshow && !(i.detailRely && detailData[i.detailRely.target] === i.detailRely.result)">
      <span class="lable-span">{{i.fieldChName}}:</span>
      <span v-if="i.detailType == 'whether'" class="content-span">{{detailData[i.detailName] == null ? '暂无信息' : detailData[i.detailName] ? '是' : '否'}}</span>
      <span v-else class="content-span">{{detailData[i.detailName] && `${detailData[i.detailName]}${i.unit || ''}` || '暂无信息'}}</span>
      <slot :i="i"></slot>
      <div v-if="i.detailType == 'verify'">
        <span v-if="detailData[i.detailVerifyRet] == null || detailData[i.detailVerifyRet]==3" class="checkout-result-fail">未核实</span>
        <span v-else class="checkout-result-success" :class="{'identical-result': detailData[i.detailVerifyRet]==0, 'different-result': detailData[i.detailVerifyRet]!=0 }">查看结果
          <Popover class="popover-show">{{detailData[i.detailVerify] || '未录入'}}</Popover>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import Popover from '../../components/popover.vue'

export default {
  props: ['fieldConfig', 'detailData'],
  components: {
    Popover
  }
}
</script>

<style lang="less" scoped>
// web端已24为1行，h5采用12为1行，和web局部共用详情detailWidth参数
.col-p-12 {
  font-size: 0.36rem;
  color: #4f4e4e;
  line-height: 0.86rem;
  // overflow: hidden;
}
.col-p-12::after {
  content: "";
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
.lable-span {
  margin-right: 0.1rem;
  display: block;
  float: left;
  // max-width: 60%;
}
.content-span {
  display: block;
  float: left;
  max-width: 80%;
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
</style>

