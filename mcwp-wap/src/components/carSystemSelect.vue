<template>
    <div :style="{background:'#fff'}">
        <div class="car-select-top">
            <div class="car-select-back" @click="back"><img class="back" src="../assets/icon_back.png" alt="back" /></div>
            选择车系
        </div>
        <div class="car-select-list">
            <div class="car-select-order" v-if="carSystemData.length>0">
                <div v-for="( item, index ) in carSystemData" :key='index'>
                    <div class="car-select-order-title">{{item.secondBrand}}</div>
                    <div class="car-selelct-order-items" v-for="( v, i ) in item.typeNames" :key='i' @click="carTypeSelects(v,item.secondBrand)">
                        {{v}}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  props: ['carSystemData'],
  data () {
    return {
    }
  },
  methods: {
    back () {
      this.$emit('carSystemback')
    },
    carTypeSelects (id, secondBrand) {
      this.$emit('carTypeSelects', id, secondBrand)
    }
  }
}
</script>

<style lang="less" scoped>
.car-select-top{
    // position: fixed;
    // top:0;
    // left: 0;
    // z-index: 200;
    width: 100%;
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
           margin-top: 0.4rem;
       }
    }
}
.car-select-list{
    // padding-top: 1.24rem;
    background: #fff;
    width:100%;
    height:auto;
    position:absolute;
    overflow-y:scroll;
    -webkit-overflow-scrolling: touch;  //解决ios下滚动不流畅的问题
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
            padding-left: .48rem;
            font-size: .44rem;
            color: #333;
            line-height: 1.68rem;
        }
    }
}
</style>
