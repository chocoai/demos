<template>
  <div class="tabbar-container">
    <Home v-if="activeTab == 0"></Home>
    <Center v-if="activeTab == 1" baseInfo=""></Center>
    <tabbar class="tabbar" :active="activeTab" v-show="!showLogin" @change="onChange">
      <tabbar-item>
        <span>首页</span>
        <image slot="icon" :src="icon1.normal" mode="aspectFit"></image>
        <image slot="icon-active" :src="icon1.active" mode="aspectFit"></image>
        <!--<template slot="icon">-->
          <!--<img :src="activeTab == 0 ? require('@/assets/icon_home_pressed.png') : require('@/assets/icon_home_default.png')" />-->
        <!--</template>-->
      </tabbar-item>
      <tabbar-item>
        <span>个人中心</span>
        <image slot="icon" :src="icon2.normal" mode="aspectFit"></image>
        <image slot="icon-active" :src="icon2.active" mode="aspectFit"></image>
        <!--<template slot="icon">-->
          <!--<img :src="activeTab == 1 ? require('@/assets/icon_center_pressed.png') : require('@/assets/icon_center_default.png')" />-->
        <!--</template>-->
      </tabbar-item>
    </tabbar>
    <Login v-if="showLogin" @changeTab="changeTab"></Login>
  </div>
</template>
<script>
import Home from '@/components/home/home'
import Center from '@/components/home/center'
import Login from '@/components/home/login'
export default {
  components: {
    Home,
    Center,
    Login
  },
  data () {
    return {
      activeTab: 0,
      icon1: {
        normal: require('@/assets/icon_home_default.png'),
        active: require('@/assets/icon_home_pressed.png')
      },
      icon2: {
        normal: require('@/assets/icon_center_default.png'),
        active: require('@/assets/icon_center_pressed.png')
      },
      showLogin: false
    }
  },
  methods: {
    onChange (event) {
      this.activeTab = event.mp.detail
    },
    changeTab () {
      this.showLogin = false
      this.activeTab = 0
    }
  }
}
</script>
<style lang="less">
.tabbar-container {
  .van-tabbar--fixed {
    width: 10.8rem;
    left: 0;
    right: 0;
    margin: auto;
    z-index: 999;
  }
  .tabbar {
    left: 50%;
    width: 10.8rem;
    margin-left: -5.4rem;
    z-index: 100;
    .van-tabbar-item--active {
      color: #fa494b;
    }
  }
  .btn {
    /*position: absolute;*/
    /*margin-top: 20rem;*/
    /*margin-left: 20rem;*/
    background-color: yellow;
    width: 50rem;
    height: 40rem;
  }
}
.login-back {
  position: fixed;
  top: 0;
  left: 0;
  /*width: 100vw;*/
  /*height: 100vh;*/
  right: 0;
  bottom: 0;
}
</style>
