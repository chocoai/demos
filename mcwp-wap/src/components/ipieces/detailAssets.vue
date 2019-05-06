<template>
  <div>
    <div class="assets-container" >
      <p class="p-title">房产信息</p>
      <div class="base-content" v-if='houses && houses.length'>
        <div class="house-list" v-for='(item, index) in houses' :key="index" >
          <div v-if="type==1">
            <p class="col-p">
                <span class="lable-span">房屋面积:</span>
                {{item.houseSize && item.houseSize + '平' || '未录入'}}
            </p>
            <p class="col-p">
                <span class="lable-span">房屋地址:</span>
                {{item.address || '未录入'}}
            </p>
            <p class="col-p">
                <span class="lable-span">房屋估值:</span>
                {{item.houseTotal  && item.houseTotal + '万元 ' || '未录入'}}
            </p>
            <p class="col-p">
                <span class="lable-span">最高可贷额度:</span>
                {{item.topLoanAmount && item.topLoanAmount + '万元' || '未录入'}}
            </p>
          </div>
          <div v-else>
            <p class="col-p">
              <span class="row-p">
                <span class="lable-span">购买时间:</span>
                {{ item.buyDate && formatTime(item.buyDate) || '未录入' }}
              </span>
              <span class="row-p">
                <span class="lable-span">面积:</span>
                {{item.houseSize && item.houseSize + '平' || '未录入' }}
              </span>
            </p>
            <p class="col-p">
              <span class="row-p">
                <span class="lable-span">价格:</span>
                {{item.houseTotal && item.houseTotal+ '万元' || '未录入' }}
              </span>
              <span class="row-p">
                <span class="lable-span">是否按揭:</span>
                {{ item.isMortgage && item.isMortgage ? '是': '否' }}
              </span>
            </p>
            <p class="col-p">
              <span class='row-p-house'>
                <span class="lable-span">按揭金额:</span>
                {{item.mortgageTotal && item.mortgageTotal + '万元' || '未录入' }}
              </span>
            </p>
            <p class="col-p">
              <span class='row-p-house'>
                <span class="lable-span">家庭住址是否自有房产:</span>
                {{item.isowner && item.isowner ? item.isowner == 0 ? '否' : '是' : '未录入' }}
              </span>
            </p>
            <p class="col-p" v-if="type == '6'">
              <span class='row-p-house'>
                <span class="lable-span">省市区:</span>
                {{item.provinceRegionText || '未录入' }}
              </span>
            </p>
            <p class="col-p">
              <span class='row-p-house'>
                <span class="lable-span">房屋住址:</span>
                {{item.address || '未录入' }}
              </span>
            </p>
            <p class="col-p">
              <span class='row-p-house'>
                <span class="lable-span">备注信息:</span>
                {{item.remark || '未录入' }}
              </span>
            </p>
          </div>
        </div>
      </div>
      <div class="base-content" v-else>暂无信息</div>
    </div>

    <div class="assets-container" v-if="type === '6' || type === '7'">
      <p class="p-title">车辆信息</p>
      <div class="base-content" v-if='cars && cars.length'>
        <div class="house-list" v-for='(item, index) in cars' :key="index" >
          <div v-if="type==1">
            <p class="col-p">
                <span class="lable-span">车辆品牌:</span>
                {{item.brand || '未录入'}}
            </p>
            <p class="col-p">
                <span class="lable-span">车辆款型:</span>
                {{item.carModel || '未录入'}}
            </p>
          </div>
          <div v-else>
            <p class="col-p">
              <span class="row-p">
                <span class="lable-span">购买时间:</span>
                {{item.buyDate && formatTime(item.buyDate) || '未录入' }}
              </span>
              <span class="row-p">
                <span class="lable-span">品牌:</span>
                {{item.brand || '未录入'  }}
              </span>
            </p>
            <p class="col-p">
              <span class="row-p">
                <span class="lable-span">价格:</span>
                {{item.carTotal && item.carTotal+ '万元' || '未录入' }}
              </span>
              <span class="row-p">
                <span class="lable-span">是否按揭:</span>
                {{  item.isMortgage ? '是': '否' }}
              </span>
            </p>
            <p class="col-p">
              <span class='row-p-house'>
                <span class="lable-span">按揭金额:</span>
                {{item.mortgageTotal && item.mortgageTotal + '万元' || '未录入' }}
              </span>
            </p>
            <p class="col-p">
              <span class='row-p-house'>
                <span class="lable-span">车辆状况:</span>
                {{item.vehicleCondition || '未录入' }}
              </span>
            </p>
            <p class="col-p">
              <span class='row-p-house'>
                <span class="lable-span">车牌:</span>
                {{item.plateNumber || '未录入' }}
              </span>
            </p>
            <p class="col-p">
              <span class='row-p-house'>
                <span class="lable-span">车架号:</span>
                {{item.vinNo || '未录入' }}
              </span>
            </p>
            <p class="col-p">
              <span class='row-p-house'>
                <span class="lable-span">是否属于公司:</span>
                {{item.isCompany ? '是' : '否' }}
              </span>
            </p>
            <p class="col-p">
              <span class='row-p-house'>
                <span class="lable-span">备注:</span>
                {{item.remark || '未录入'}}
              </span>
            </p>
          </div>
        </div>
      </div>
      <div class="base-content" v-else>暂无信息</div>
    </div>

    <div class="assets-container" v-if="type === '6' || type === '7'">
      <p class="p-title">机器设备</p>
      <div class="base-content" v-if='machines && machines.length'>
        <div class="house-list" v-for='(item, index) in machines' :key="index" >
          <div>
            <p class="col-p">
              <span class='row-p-house'>
                <span class="lable-span">名称:</span>
                {{item.name || '未录入' }}
              </span>
            </p>
            <p class="col-p">
              <span class="row-p">
                <span class="lable-span">购买时间:</span>
                {{ item.buyDate && formatTime(item.buyDate) || '未录入' }}
              </span>
              <span class="row-p">
                <span class="lable-span">金额:</span>
                {{item.balance && item.balance+ '万元' || '未录入' }}
              </span>
            </p>
          </div>
        </div>
      </div>
      <div class="base-content" v-else>暂无信息</div>
    </div>
  </div>
</template>

<script>
import Utils from '../../config/utils'
export default {
  props: ['loanData', 'type'],
  data () {
    return {
      houses: this.loanData.loanAssetHouses,
      cars: this.loanData.loanAssetCars,
      machines: this.loanData.loanAssetMachines
    }
  },
  mounted () {
    console.log(this.loanData, 'this.loanData')
  },
  methods: {
    formatTime (time) {
      return Utils.formatTime(time)
    }
  }
}
</script>

<style lang="less" scoped>
   .assets-container{
    width: 10rem;
    margin: 0.26rem auto;
    background: #fff;
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
      padding: 0.6rem 0.7rem;

    }
    .col-p{
      font-size: 0.36rem;
      color: #4f4e4e;
      line-height: 0.86rem;
    }

    .row-p{
      display: inline-block;
      width: 4rem;
    }
    // 房屋信息下 备注 地址 按揭金额 独占一行
    .row-p-house,.row-p-car {
      width:100%;
    }
    .car-list+.car-list,.house-list+.house-list {
      margin-top:0.4rem;
    }
    .row-p+.row-p{
      margin-left: 0.48rem;
    }
    .lable-span{
      margin-right: 0.1rem;
    }
  }
</style>
