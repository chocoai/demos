<template>
  <div class='valuation-car'>
    <div class="car-content">
      <li class='contact-detail-content'>
        <datetime  class="font-32" placeholder='请选择' title="购买时间" value-text-align='left' :columns="1" v-model="byDate" show-name></datetime>
      </li>
      <li class='contact-detail-content' flex="">
        <p class='contact-detail-item font-32' flex-box="0">购买金额</p>
        <input flex-box="1" class='contact-detail-input font-32' type="text" placeholder='请输入购买金额' v-model="carMoney" ><span class="contact-detail-unit font-28">万元</span>
      </li>
      <!-- <li class='contact-detail-content'>
        <popup-picker class="font-32" placeholder='请选择' title="汽车品牌" value-text-align='left' :data="carList" :columns="1" v-model="carBrand" @on-change="onChangeCar" show-name></popup-picker>
      </li>
      <li class='contact-detail-content'>
        <popup-picker class="font-32" placeholder='请选择' title="汽车型号" value-text-align='left' :data="modelList" :columns="1" v-model="carModel" show-name></popup-picker>
      </li> -->
    </div>
    <v-button key="valuation-car" class="car-btn" @next='nextStep'>下一步</v-button>
    <span class="car-pass" @click="next">跳过</span>
  </div>
</template>

<script>
import Store from 'store'
import { PopupPicker, Datetime } from 'vux'
import VButton from './../../components/button'
import Utils from '../../config/utils'
// import { getDictValue } from '../../service/getData'
import Config from '../../config/index'
import { postValuationCar } from '../../service/valuation'

export default {
  components: {
    PopupPicker,
    VButton,
    Datetime
  },
  data () {
    return {
      byDate: '',
      allCarList: [],
      carBrand: [],
      carList: [],
      carModel: [],
      modelList: [],
      carMoney: '',
      valuationCode: '',
      loanRoutes: null
    }
  },
  created () {
    const that = this
    let valuation = JSON.parse(sessionStorage.getItem(Config.constants.valuation)) || {}
    that.valuationCode = valuation.valuationCode
    that.loanRoutes = valuation.list
  },
  // mounted () {
  //   const that = this
  //   getDictValue({code: 'cars'}).then(res => {
  //     if (res.code === Config.resCode.success) {
  //       if (res.data && res.data.cars) {
  //         that.allCarList = res.data.cars
  //         res.data.cars.forEach((item, index) => {
  //           that.carList.push({
  //             value: item.ddValue,
  //             name: item.ddText,
  //             parent: item.parentValue
  //           })
  //         })
  //       }
  //     } else {
  //       that.$vux.toast.text(res.msg)
  //     }
  //   })
  // },
  methods: {
    // onChangeCar (val) {
    //   let that = this
    //   let dictDTOS = that.allCarList.filter((item, index) => (item.ddValue === val[0]))[0].dictDTOS
    //   dictDTOS.forEach((item, index) => {
    //     that.modelList.push({
    //       value: item.ddValue,
    //       name: item.ddText,
    //       parent: '0'
    //     })
    //   })
    // },
    async nextStep () {
      const that = this
      const valuationCode = that.valuationCode
      const byDate = that.byDate
      if (!byDate) return that.$vux.toast.text(Config.constants.nullByDate)
      const carMoney = that.carMoney
      if (!carMoney) return that.$vux.toast.text(Config.constants.nullCarMoney)
      if (!Utils.checkNumLenFtwo(carMoney)) return that.$vux.toast.text('购买金额最多五位整数小数点后两位')
      // const carBrand = that.carBrand[0]
      // if (!carBrand) return that.$vux.toast.text(Config.constants.nullCarsBrand)
      // const carModel = that.carModel[0]
      // if (!carModel) return that.$vux.toast.text(Config.constants.nullCarModel)
      let params = {
        valuationCode: valuationCode,
        byDate: Date.parse(byDate),
        amount: carMoney
        // carBrand: carBrand,
        // carModel: carModel
      }
      const res = await postValuationCar(params)
      if (res.code === Config.resCode.success) {
        if (res.data) {
          const cookies = Store.get(Config.constants.cookies)
          cookies.valuationMoney = res.data
          Store.set(Config.constants.cookies, cookies)
        }
        let loanRoutes = that.loanRoutes
        let pathIndex = Utils.getIndex(loanRoutes, window.location.pathname)
        that.$router.push(loanRoutes[pathIndex + 1])
      } else {
        that.$vux.loading.hide()
        that.$vux.toast.text(res.msg)
      }
    },
    next () {
      const that = this
      let loanRoutes = that.loanRoutes
      let pathIndex = Utils.getIndex(loanRoutes, window.location.pathname)
      that.$router.push(loanRoutes[pathIndex + 1])
    }
  }
}
</script>

<style lang="less">
.valuation-car {
  background: url('./../../assets/valuation_car_bg.png') no-repeat;
  background-size: 10.8rem 6.6rem;
  width: 100%;
  height: 100vh;
  position: relative;
  .car-content {
    position: absolute;
    width: 10rem;
    height: auto;
    background-color: #fff;
    overflow-x: hidden;
    top: 6rem;
    left: .4rem;
    border-radius: .24rem;
  }
  .contact-detail-content {
      position: relative;
      width: 100%;
      display: flex;
    }
  .car-btn {
    position: absolute;
    top: 12rem;
    left: 2.4rem;
  }
  .car-pass {
    position: absolute;
    top: 16rem;
    left: 5rem;
    font-size: .4rem;
    color: #369fff;
    text-decoration: underline;
  }
  .contact-detail-item {
    width: 130px;
    padding-left: 10px;
    color: #333;
    height: 1.46rem;
    line-height: 1.46rem;
  }
  .contact-detail-input {
    flex: 1;
    border: none;
    outline: none;
    padding-left: .48rem;
    color: #333;
    height: 1.46rem;
    line-height: 1.46rem;
    &.empty {
      color: #777;
    }
  }
  .contact-detail-unit {
    padding-right: .48rem;
    height: 1.46rem;
    line-height: 1.46rem;
    color: #777;
  }
  .weui-cell {
    display: flex;
    padding: 0;
    height: 1.46rem;
    line-height: 1.46rem;
  }
  .weui-cell__hd {
    width: 130px;
    padding-left: 10px;
    text-align: left;
  }
  .vux-cell-box {
    width: 100%;
  }
  .vux-popup-picker-select {
    padding-left: .48rem;
  }
  .vux-cell-box:before {
    border-top: none;
  }
  .weui-cell_access .weui-cell__ft:after {
    display: none;
  }
  .vux-popup-picker-placeholder {
    color: #777;
  }
  .weui-label {
    color: #333;
  }
  .vux-datetime div p{
    padding-left: 10px;
    width: 130px;
    color: #333;
  }
  .vux-datetime-value {
    padding-left: .48rem;
    color: #777;
  }
}
</style>
