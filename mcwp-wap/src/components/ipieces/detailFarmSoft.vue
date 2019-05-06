<template>
  <div class="detail-soft-info">
    <div class="soft-warn">
      <span class="option-describe"></span>
      <span class="soft-warnInfo">乐观</span>
      <span class="soft-warnInfo">关注</span>
      <span class="soft-warnInfo">警惕</span>
    </div>
    <div>
      <div class="soft-choice">
        <span class="option-describe">年龄</span>
        <span :class="{ 'option-describe': active,'soft-span': active, 'checked-happy': index == 0 && data.age == 1, 'checked-focus': index == 1 && data.age == 2, 'checked-warn': index == 2 && data.age == 3 }" v-for="(item,index) in dict.nl" :key="item">{{item.ddText}}</span>
      </div>
      <div class="soft-choice">
        <span class="option-describe">婚姻</span>
        <span v-bind:class="{ 'option-describe': active,'soft-span': active, 'checked-happy': index == 0 && data.marriage == 1, 'checked-focus': index == 1 && data.marriage == 2, 'checked-warn': index == 2 && data.marriage == 3 }" v-for="(item,index) in dict.hy" :key="item">{{item.ddText}}</span>
      </div>
      <div class="soft-choice">
        <span class="option-describe">家庭关系</span>
        <span v-bind:class="{ 'option-describe': active,'soft-span': active, 'checked-happy': index == 0 && data.familyrelationship == 1 ,  'checked-focus': index == 1 && data.familyrelationship == 2, 'checked-warn': index == 2 && data.familyrelationship == 3 }" v-for="(item,index) in dict.jtgx" :key="item">{{item.ddText}}</span>
      </div>
      <div class="soft-choice">
        <span class="option-describe">生意关注度</span>
        <span v-bind:class="{ 'option-describe': active,'soft-span': active, 'checked-happy': index == 0 && data.businessconcerns == 1 ,  'checked-focus': index == 1 && data.businessconcerns == 2, 'checked-warn': index == 2 && data.businessconcerns == 3 }" v-for="(item,index) in dict.sygzd" :key="item">{{item.ddText}}</span>
      </div>
      <div class="soft-choice">
        <span class="option-describe">社会交往</span>
        <span v-bind:class="{ 'option-describe': active,'soft-span': active, 'checked-happy': index == 0 && data.socialcommunication == 1 ,  'checked-focus': index == 1 && data.socialcommunication == 2, 'checked-warn': index == 2 && data.socialcommunication == 3 }" v-for="(item,index) in dict.shjw" :key="item">{{item.ddText}}</span>
      </div>
      <div class="soft-choice">
        <span class="option-describe">资产积累</span>
        <span v-bind:class="{ 'option-describe': active,'soft-span': active, 'checked-happy': index == 0 && data.assetsaccumulation == 1 ,  'checked-focus': index == 1 && data.assetsaccumulation == 2, 'checked-warn': index == 2 && data.assetsaccumulation == 3 }" v-for="(item,index) in dict.zcjl" :key="item">{{item.ddText}}</span>
      </div>
      <div class="soft-choice">
        <span class="option-describe">信用记录</span>
        <span v-bind:class="{ 'option-describe': active,'soft-span': active, 'checked-happy': index == 0 && data.creditrecord == 1 ,  'checked-focus': index == 1 && data.creditrecord == 2, 'checked-warn': index == 2 && data.creditrecord == 3 }" v-for="(item,index) in dict.xyjl" :key="item">{{item.ddText}}</span>
      </div>
      <div class="soft-choice">
        <span class="option-describe">经营情况</span>
        <span v-bind:class="{ 'option-describe': active,'soft-span': active, 'checked-happy': index == 0 && data.operatingcondition == 1 ,  'checked-focus': index == 1 && data.operatingcondition == 2, 'checked-warn': index == 2 && data.operatingcondition == 3 }" v-for="(item,index) in dict.jyqk" :key="item">{{item.ddText}}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['loanData'],
  data () {
    return {
      dict: this.loanData[0],
      data: this.loanData[1],
      active: true
    }
  },
  mounted () {
    console.log(this.data, 'this.data')
    console.log(this.dict, 'this.data')
    console.log(this.dict.nl, 'this.data')
  }
}
</script>

<style lang="less" scoped>
  .detail-soft-info{
    background-color: #fff;
  }
  .soft-warn{
    width: 100%;
    .option-describe{
      display: inline-block;
      width: 16%;
      text-align: center;
    }
    .soft-warnInfo{
      font-size: 0.32rem;
      color: #555555;
      display: inline-block;
      width: 27%;
      height: 0.94rem;
      line-height: 0.94rem;
      text-align: center;
    }
  }
  .soft-choice{
    display: table;
    height: 2rem;
    width: 100%;
    .option-describe{
      display: inline-block;
      width: 16%;
      text-align: center;
      display: table-cell;
      vertical-align: middle;
    }
    .soft-span{
      width: 23%;
      padding: 2%;
    }
    .checked-happy {
      background: #26b14c !important;
      border-radius: 0;
    }
    .checked-focus {
      background: #fdc244 !important;
      border-radius: 0;
    }
    .checked-warn {
      background: #f64444 !important;
      border-radius: 0;
    }
  }
</style>
