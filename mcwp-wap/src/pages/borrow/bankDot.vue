<template>
  <div class="borrow-bankDot">
    <div v-if="list && list.length">
      <div class="bankDot-content" v-for="(item, index) in list" :key="index">
        <p class="bankDot-title font-40">{{item.bltName}}</p>
        <p class="bankDot-address font-36">{{item.bltAddress}}</p>
        <p class="bankDot-iphone font-36">{{item.telephone }}</p>
        <p class="bankDot-time font-36">{{`${item.bltStarttime}-${item.bltEndtime}`}}</p>
      </div>
    </div>
    <v-blank v-else>没有网点</v-blank>
  </div>
</template>

<script>
import { bankoutList } from '../../service/getData'
import VBlank from './../../components/blank'

export default {
  components: {
    VBlank
  },
  data () {
    return {
      list: []
    }
  },
  methods: {
    async getList () {
      let res = await bankoutList()
      if (res.code - 0 === 0) {
        this.list = res.data
        // console.log(res.data)
      } else {
        alert(res.msg)
      }
    }
  },
  created () {
    this.getList()
  }
}
</script>

<style lang="less">
  .borrow-bankDot{
    width: 10.2rem;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: .3rem auto;
  }
  .bankDot-content + .bankDot-content{
    margin-top: .3rem;
  }
  .bankDot-content{
    width:9.6rem;
    background: #fff;
    padding-left: .6rem;
    padding-bottom: .4rem;
    position: relative;
    border-radius: .3rem;
    .bankDot-title{
      color: #2f2f2f;
      padding: .425rem 0;
      position: relative;
    }
    .bankDot-title:after{
      content: " ";
      position: absolute;
      left: 0;
      bottom: 0;
      right: 0;
      height: 1px;
      border-bottom: 1px solid #e5e5e5;
      color: #e5e5e5;
      -webkit-transform-origin: 0 100%;
      transform-origin: 0 100%;
      -webkit-transform: scaleY(0.5);
      transform: scaleY(0.5);
      width:9.6rem;
    }
    .bankDot-iphone{
      background: url(../../assets/account-manager-iphone.png) no-repeat 0 center;
      background-size: .34rem .34rem;
      padding-left: .64rem;
      color: #545454;
      margin-top: .5rem;
    }
    .bankDot-address::after{
      content: "";
      position: absolute;
      width: .34rem;
      height: .34rem;
      // background: url(../../assets/account-manager-view.png) no-repeat 0 center;
      background-size: .34rem .34rem;
      right: .54rem;
      top: .1rem;
    }
    .bankDot-address{
      background: url(../../assets/account-manager-address.png) no-repeat 0 center;
      background-size: .34rem .34rem;
      padding-left: .64rem;
      color: #545454;
      margin-top: .42rem;
      position:relative;
    }
    .bankDot-time{
      background: url(../../assets/account-manager-time.png) no-repeat 0 center;
      background-size: .34rem .34rem;
      padding-left: .64rem;
      color: #545454;
      margin-top: .42rem;
    }
  }
</style>
