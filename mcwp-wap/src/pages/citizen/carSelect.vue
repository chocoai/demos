<template>
    <div>
        <div :style="{background:'#fff'}" v-if='carSelectShow'>
            <div class="car-select-top">
                <div class="car-select-back" @click="back"><img class="back" src="../../assets/icon_back.png" alt="back" /></div>
                选择品牌
            </div>
            <!-- <div class="padding-box"></div> -->
            <div class="car-select-list">
                <div class="car-select-hot">
                    <div class="car-select-hot-title">热门品牌</div>
                    <div class="car-selelct-hot-items" v-if="carData">
                        <div class="car-select-hot-item"  v-for="(item, index) in carData[0].brandVOList" :key="index" @click="carSystemSelect(item.carSecondVOS,item.id)">
                            <img :src="item.imgUrl" alt="">
                            <div class="car-select-hot-font">{{item.brandName}}</div>
                        </div>
                    </div>
                </div>
                <div class="car-select-order" v-if="carData">
                    <div v-for="(item, index) in carData.filter((item,index)=>index!=0)" :key="index">
                        <div :id='item.letter'></div>
                        <div class="car-select-order-title">{{item.letter}}</div>
                        <div class="car-selelct-order-items">
                            <div class="car-select-order-item" v-for="(v, i) in carData.filter((item,index)=>index!=0)[index].brandVOList" :key="i" @click="carSystemSelect(v.carSecondVOS,v.id)">
                                <img :src="v.imgUrl" alt="">
                                <div class="car-select-order-font">{{v.brandName}}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="letter">
                <a @click="toLetter(item)" class="letter-item" v-for="(item,index) in letters" :key="index">{{item}}</a>
            </div>
        </div>
        <div class="car-select" v-show="carSystemSelectShow">
            <car-system-select :carSystemData="carSystemData&&carSystemData.length>0&&carSystemData" @carSystemback='carSystemback' @carTypeSelects='carTypeSelects'/>
        </div>
        <div class="car-select" v-show="carTypeSelectShow">
            <car-type-select :carTypeData="carTypeData&&carTypeData.length>0&&carTypeData" @carTypeback='carTypeback' @selectSure='selectSure'/>
        </div>
    </div>
</template>

<script>
import Config from '../../config/index'
import Store from 'store'
import carSystemSelect from './../../components/carSystemSelect'
import carTypeSelect from './../../components/carTypeSelect'
import { getCarInfo, getCarSpec } from '../../service/common.js'
export default {
  data () {
    return {
      letters: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'G', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'W', 'X', 'Y', 'Z'],
      loanCode: '',
      carData: null,
      carSelectShow: true,
      carSystemSelectShow: false,
      carTypeSelectShow: false,
    //   carModel: '',
      carSystemData: [],
      carTypeData: [],
      selectId: '',
      secondBrand: '',
      typeName: '',
      carGuidePrice: ''
    }
  },
  components: {
    carSystemSelect,
    carTypeSelect
  },
  mounted () {
    const cookies = Store.get(Config.constants.cookies)
    this.loanCode = cookies.loanCode
    this.getCarInfo()
  },
  methods: {
    toLetter (id) {
      document.getElementById(id).scrollIntoView()
    },
    async getCarInfo () {
      let res = await getCarInfo({code: this.loanCode})
      this.carData = res.data || []
    },
    async carTypeSelects (typeName, secondBrand) {
      let params = {
        brandId: this.selectId,
        secondBrand: secondBrand,
        typeName: typeName
      }
      this.secondBrand = secondBrand
      this.typeName = typeName
      let res = await getCarSpec(params)
      this.carTypeData = res.data
      this.carSystemSelectShow = false
      this.carTypeSelectShow = true
    },
    back () {
      this.$router.go(-1)
    },
    carSystemSelect (item, id) {
      this.carSystemData = item
      this.selectId = id
      this.carSystemSelectShow = true
      this.carSelectShow = false
    },
    selectSure (item) {
    //   this.carSystemSelectShow = false
    //   this.carTypeSelectShow = false
    //   this.carSelectShow = false
    //   this.carModel = this.secondBrand + this.typeName + item.specName
    //   this.carGuidePrice = item.guidePrice + '万'
      let loanCookies = JSON.parse(sessionStorage.getItem('citizen_base'))
      loanCookies.carModel = this.secondBrand + this.typeName + item.specName
      loanCookies.carGuidePrice = item.guidePrice + '万'
      sessionStorage.setItem('citizen_base', JSON.stringify(loanCookies))
      this.$router.go(-1)
    },
    carSystemback () {
      this.carSystemSelectShow = false
      this.carSelectShow = true
    },
    carTypeback () {
      this.carSystemSelectShow = true
      this.carTypeSelectShow = false
    }
  }
}
</script>

<style lang="less" scoped>
.car-select-top{
    // position: fixed;
    // top:0;
    // left: 0;
    width: 100%;
    // z-index: 200;
    height: 1.24rem;
    background: #369fff;
    text-align: center;
    line-height: 1.24rem;
    color: #fff;
    font-size: .44rem;
    .car-select-back{
        width: 1.32rem;
        height: 1.24rem;
        text-align: center;
       position: absolute;
       left: 0;
       top: 0;
       img{
           width: .48rem;
           height: .48rem;
           margin-top: .4rem;
       }
    }
}
.padding-box{
    padding-top: 1.24rem;
}
.car-select-list{
    // padding-top: 1.24rem;
    background: #fff;
    width:100%;
    // height:auto;
    // position:absolute;
    // overflow-y:scroll;
    // -webkit-overflow-scrolling: touch;  //解决ios下滚动不流畅的问题
    .car-select-hot{
        padding: .44rem 0 0 .48rem;
    }
    .car-select-hot-title{
        font-size: .36rem;
        color: #666;
        margin-bottom: .48rem;
    }
    .car-selelct-hot-items{
        display: flex;
        flex-wrap: wrap;
        .car-select-hot-item{
            margin-right: .72rem;
            text-align: center;
            margin-bottom: .64rem;
            img{
                width: 1.2rem;
                height: 1.2rem;
            }
            .car-select-hot-font{
                font-size: .32rem;
                color: #333;
            }
        }
    }
    .car-select-order{
        .car-select-order-title{
            // width: 100%;
            height: .8rem;
            background: #f5f5f5;
            padding-left: .48rem;
            line-height: .8rem;
            font-size: .4rem;
            color: #666;
        }
        .car-selelct-order-items{
            padding: .24rem 0 .24rem .48rem;
            .car-select-order-item{
                display: flex;
                margin-bottom: .48rem;
                &:nth-last-child(1){
                    margin-bottom: 0;
                }
                img{
                    width: 1.2rem;
                    height: 1.2rem;   
                    margin-right: .48rem;   
                }
                .car-select-order-font{
                    font-size: .44rem;
                    color: #333;
                    line-height: 1.2rem;
                }
            }
        }
    }
}
.letter{
    position: fixed;
    top: 1.78rem;
    right: .16rem;
    .letter-item{
        display: block;
        color: #666;
        width: .64rem;
        height: .64rem;
        text-align: center;
        line-height: .64rem;
    }
}
</style>
