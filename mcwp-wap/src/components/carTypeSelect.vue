<template>
    <div :style="{background:'#fff'}">
        <div class="car-select-top">
            <div class="car-select-back" @click="back"><img class="back" src="../assets/icon_back.png" alt="back" /></div>
            选择车型
        </div>
        <div class="car-select-list">
            <div class="car-select-order" v-if="carTypeData.length>0">
                    <div class="car-selelct-order-items" v-for="( v, i ) in carTypeData" :key='i' @click="select(v)">
                        {{v.specName}}
                    </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  props: ['carTypeData'],
  data () {
    return {
    }
  },
  methods: {
    back () {
      this.$emit('carTypeback')
    },
    select (v) {
      this.$emit('selectSure', v)
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
    //  z-index: 200;
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
        .car-selelct-order-items{
            padding-left: .48rem;
            font-size: .44rem;
            color: #333;
            line-height: 1.68rem;
        }
    }
}
</style>
