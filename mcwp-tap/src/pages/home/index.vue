<template>
  <div class="tabbar-container" v-show="getData">
    <Home v-if="activeTab == 0" :wxMe="wxMe" @login="showLogin=true" ref="home" />
    <Center v-if="activeTab == 1" :wxMe="wxMe" @login="showLogin=true" />
    <tabbar class="tabbar" v-model="activeTab" v-show="!showLogin">
      <tabbar-item>
        <span>首页</span>
        <template slot="icon">
          <img :src="activeTab == 0 ? require('@/assets/icon_home_pressed.png') : require('@/assets/icon_home_default.png')" />
        </template>
      </tabbar-item>
      <tabbar-item>
        <span>个人中心</span>
        <template slot="icon">
          <img :src="activeTab == 1 ? require('@/assets/icon_center_pressed.png') : require('@/assets/icon_center_default.png')" />
        </template>
      </tabbar-item>
    </tabbar>
    <Login v-if="showLogin" @success="loginSuccess" @changeTab="changeTab" showNext="true"/>
    <!--<popup :overlay="false" v-model="showLogin" style="width:100%;height:100%;"><Login v-show="showLogin" @success="loginSuccess" @changeTab="changeTab" /></popup>-->
  </div>
</template>
<script>
import { Tabbar, TabbarItem, Popup } from "vant";
import Router from "@/utils/routerConfig.js";
import Home from "@/components/home/home";
import Center from "@/components/home/center";
import { createNamespacedHelpers } from "vuex";
import Login from "@/components/home/login";
const userModule = createNamespacedHelpers("user");
import { Config, getUrlkey } from "@/utils/";
// import Wxsdk from "@/utils/wxJsSdk";

export default {
  components: {
    Tabbar,
    TabbarItem,
    Home,
    Center,
    Popup,
    Login
  },
  data() {
    return {
      Router,
      showLogin:
        getUrlkey(window.location.search)["type"] == "login" ? true : false,
      getData: false,
      activeTab: +sessionStorage.getItem(Config.constants.activedTabNum) || 0
    };
  },
  computed: {
    ...userModule.mapGetters(["wxMe"])
  },
  created() {
    this.initData();
  },
  watch: {
    activeTab() {
      sessionStorage.setItem(Config.constants.activedTabNum, this.activeTab);
    }
  },
  mounted() {
    window.onorientationchange = () => {
      location.reload();
    };
    // Wxsdk.wxShare();
  },
  destroyed() {
    sessionStorage.setItem(Config.constants.activedTabNum, this.activeTab);
    window.onorientationchange = () => {};
  },
  methods: {
    ...userModule.mapActions(["getWxMe"]),
    // 初始化数据
    async initData() {
      await this.getWxMe();
      // 减少闪烁
      this.getData = true;
      document.title = this.wxMe.enterPriseName;
      if (this.wxMe.telephone) this.showLogin = false;
    },
    async loginSuccess() {
      await this.getWxMe();
      this.$refs.home && this.$refs.home.getActives();
      this.showLogin = false;
    },
    changeTab() {
      this.activeTab = 0;
      this.showLogin = false;
    }
  }
};
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
}
</style>
