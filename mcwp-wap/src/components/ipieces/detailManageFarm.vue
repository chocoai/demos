<template>
  <div>
    <div class="base-container">
      <p class="p-title">耕地信息</p>
      <div class="base-content" v-if="businessLandList.length || businessLandList.length">
        <div class="base-supplier" v-for="(item, index) in businessLandList" :key="index">
          <p class="col-p">
            <span class="lable-span bold-lable">耕地类型:</span>
            <span class="content-span">{{item.ltype && cultiLand && cultiLand.filter((result,index)=>(result.ddValue==item.ltype))[0]['ddText'] || '未录入'}}</span>
          </p>
          <p class="col-p">
            <span class="lable-span">上一周期租赁耕地:</span>
              <span class="content-span">{{item.previousLland && item.previousLland + '亩' || '未录入'}}</span>
          </p>
          <p class="col-p">
            <span class="lable-span">上一周期自有耕地:</span>
            <span class="content-span">{{item.previousHaveland && item.previousHaveland + '亩' || '未录入'}}</span>
          </p>
          <p class="col-p">
            <span class="lable-span">下一周期租赁耕地:</span>
            <span class="content-span">{{item.nextLland && item.nextLland + '亩' || '未录入'}}</span>
          </p>
          <p class="col-p">
            <span class="lable-span">下一周期自有耕地:</span>
            <span class="content-span">{{item.nextHaveland && item.nextHaveland + '亩'|| '未录入'}}</span>
          </p>
        </div>
      </div>
      <p class="no-data" v-else>暂无相关信息</p>
    </div>
    <div class="base-container">
      <p class="p-title">种植结构</p>
      <div class="base-content" v-if="businessPlantList.length || businessPlantList.length">
        <div class="base-supplier" v-for="(item, index) in businessPlantList" :key="index">
          <p class="col-p">
            <span class="lable-span bold-lable">农作物名称:</span>
            <span class="content-span">{{item.pname || '未录入'}}</span>
          </p>
          <p class="col-p">
            <span class="lable-span">上一周种植面积:</span>
            <span class="content-span">{{item.previousPlant && item.previousPlant + '亩' || '未录入'}}</span>
          </p>
          <p class="col-p">
            <span class="lable-span">上一周平均产值:</span>
            <span class="content-span">{{item.previousAvgyield && item.previousAvgyield + '吨/亩' || '未录入'}}</span>
          </p>
          <p class="col-p">
            <span class="lable-span">下一周种植面积:</span>
            <span class="content-span">{{item.nextPlant && item.nextPlant + '亩' || '未录入'}}</span>
          </p>
        </div>
      </div>
      <p class="no-data" v-else>暂无相关信息</p>
    </div>
    <div class="base-container">
      <p class="p-title">养殖结构</p>
      <div class="base-content" v-if="businessBreedList.length || businessBreedList.length">
        <div class="base-supplier" v-for="(item, index) in businessBreedList" :key="index">
          <p class="col-p">
            <span class="row-p">
              <span class="lable-span bold-lable">牲畜名称:</span>
              <span class="content-span">{{item.bname || '未录入'}}</span>
            </span>
            <span class="row-p">
              <span class="lable-span">数量:</span>
              <span class="content-span">{{item.btotal && item.btotal + '头' || '未录入'}}</span>
            </span>
          </p>
          <p class="col-p">
            <span class="row-p">
              <span class="lable-span">年龄:</span>
              <span class="content-span">{{item.age && item.age + '岁' || '未录入'}}</span>
            </span>
            <span class="row-p">
              <span class="lable-span">市场价值:</span>
              <span class="content-span">{{item.marketvalue && item.marketvalue + '元' || '未录入'}}</span>
            </span>
          </p>
        </div>
      </div>
      <p class="no-data" v-else>暂无相关信息</p>
    </div>
  </div>
</template>

<script>
import Utils from '../../config/utils'

export default {
  props: ['loanData', 'dictInfo'],
  data () {
    return {
      businessLandList: this.loanData.businessLandList,
      businessPlantList: this.loanData.businessPlantList,
      businessBreedList: this.loanData.businessBreedList,
      cultiLand: this.dictInfo.gdlx
    }
  },
  methods: {
    formatTime (time) {
      return Utils.formatTime(time)
    }
  },
  mounted () {
    console.log(this.loanData, 'this.loanData')
    console.log(this.businessLandList, this.businessPlantList, this.businessBreedList, 'this.loanData')
  }
}
</script>

<style lang="less" scoped>
  .base-container{
    width: 10rem;
    margin: 0.26rem auto 0;
    background: #fff;
    .no-data{
      text-align: center;
      padding: 0.3rem;
      font-size: 0.36rem;
    }
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
      overflow: hidden;
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
    .identity-icon{
      width: 0.44rem;
      height: 0.4rem;
      margin-top: 0.2rem;
    }
    .bold-lable{
      font-weight: bold;
      color: #3f3f3f;
    }
  }
</style>

