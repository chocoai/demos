<template>
  <div class="home-container">
    <div>
      <div class="top">
        <div class="header">
          <img v-if="prefixUrl" class="header-img" :src="`${prefixUrl}home/img_home_logo.png`" alt="home-logo">
          <span v-if="!wxMe.telephone" class="login" @click="$emit('login')">请登录</span>
          <span v-else class="login">{{wxMe.userName || wxMe.telephone.substr(0, 3) + '****' + wxMe.telephone.substr(7)}}</span>
        </div>
        <swiper v-if="bannerList.length" :options="swiperOptionBanner" class="swiper-box">
          <swiper-slide class="swiper-item" v-for="(ImgItem, ImgIndex) in bannerList" :key="ImgIndex">
            <img class="person-img" :src="ImgItem.imgUrl" @click="bannerListDtail(ImgItem.activeUrl)"/>
          </swiper-slide>
        </swiper>
        <swiper v-if="noticesList.length" :options="swiperOptionNotice" class="swiper-box swiper-notice swiper-no-swiping">
          <swiper-slide class="swiper-item" v-for="(item,index) in noticesList" :key="index">
            <div class="notice">{{item}}</div>
          </swiper-slide>
        </swiper>
        <p class="line"> </p>
        <p class="title">热门活动</p>
        <swiper :options="swiperOptionShare" class="swiper-box" v-if="activityList.length">
          <swiper-slide class="active-item" v-for="item in activityList" :key="item.imgUrl">
            <p class="active-img" @click="activityListDetail(item.activeUrl, item.status)">
              <img class="active-bg" :src="item.imgUrl" >
              <!-- <img class="active-bg" v-if="item.activeType == 'share'" src="@/assets/img_home_sharebanner.png" > -->
              <span v-if="item.attributeData" class="min-knife">日利率最低砍至万分之{{item.attributeData.minimumRate}}&nbsp;&nbsp;刀刀都是钱</span>
            </p>
          </swiper-slide>
          <swiper-slide class="active-item">
            <p class="active-img">
              <img class="active-bg" src="../../assets/more_activity.png" alt="more-activity" >
            </p>
          </swiper-slide>
        </swiper>
      </div>
      <div class="center" >
        <p class="title">常见问题</p>
        <swiper :options="swiperOptionQues" class="swiper-box" v-if="activityQuestionsList.length">
          <swiper-slide class="problem-item" v-for="item in activityQuestionsList" :key="item.img">
            <router-link :to="`${Router.question.name}/${item.code}`" class="flowpath">
              <img class="center-icon" :src="item.img" alt="">
              <h3 :class="`${item.title.includes('<br')? 'stitle-newline' : 'stitle'}`" v-html="item.title"></h3>
              <span class="sdetail">查看详情>></span>
            </router-link>
          </swiper-slide>
          <!-- <swiper-slide class="problem-item">
            <router-link :to="Router.flowpath.path" class="flowpath">
              <img class="center-icon" src="@/assets/img_flowpath.png" alt="">
              <h3 class="stitle-newline">如何获得<br />10万信用额度</h3>
              <span class="sdetail">查看详情>></span>
            </router-link>
          </swiper-slide>
          <swiper-slide class="problem-item">
            <router-link :to="Router.purpose.path" class="purpose">
              <img class="center-icon" src="@/assets/img_purpose.png" alt="center-icon" />
              <h3 class="stitle">借款用途</h3>
              <span class="sdetail">查看详情>></span>
            </router-link>
          </swiper-slide>
          <swiper-slide class="problem-item">
            <router-link :to="Router.homeKnifeExplain.path" class="purpose">
              <img class="center-icon" src="@/assets/img_knifeExplain.png" alt="center-icon" />
              <h3 class="stitle-newline">如何获得<br />利率优惠</h3>
              <span class="sdetail">查看详情>></span>
            </router-link>
          </swiper-slide>
          <swiper-slide class="problem-item">
            <router-link :to="Router.homeFAQShare.path" class="purpose">
              <img class="center-icon" src="@/assets/img_share.png" alt="center-icon" />
              <h3 class="stitle">积分兑好礼</h3>
              <span class="sdetail">查看详情>></span>
            </router-link>
          </swiper-slide> -->
        </swiper>
      </div>
    </div>
  </div>
</template>

<script>
import { Button, NoticeBar } from "vant";
// import { createNamespacedHelpers } from "vuex";
import Router from "@/utils/routerConfig.js";
import "swiper/dist/css/swiper.css";
import { swiper, swiperSlide } from "vue-awesome-swiper";
import {
  getActives,
  getNotices,
  getActiveQuestions
} from "../../service/home.js";
import Store from "store";
import prefixUrl from "@/utils/mixins/prefixUrl";
import { Config } from "../../utils";
import { countPlus } from "@/utils";
// const homeModule = createNamespacedHelpers("home");

export default {
  name: "home",
  props: ["wxMe"],
  components: {
    Button,
    swiper,
    swiperSlide,
    NoticeBar
  },
  mixins: [prefixUrl],
  data() {
    return {
      Router,
      swiperOptionBanner: {
        spaceBetween: 30,
        slidesPerView: 1,
        pagination: {
          el: ".swiper-pagination",
          clickable: true
        },
        initialSlide: 0
      },
      swiperOptionNotice: {
        direction: "vertical",
        autoplay: {
          delay: 5000,
          stopOnLastSlide: false,
          disableOnInteraction: true
        },
        loop: true
      },
      swiperOptionShare: {
        spaceBetween: 10,
        slidesPerView: "auto",
        initialSlide: 0
      },
      swiperOptionQues: {
        spaceBetween: 10,
        slidesPerView: "auto",
        initialSlide: 0
      },
      activityList: [],
      bannerList: [],
      noticesList: [],
      activityQuestionsList: []
    };
  },
  computed: {
    // ...homeModule.mapGetters(["adsList", "menuList"])
  },
  created() {
    countPlus("浏览“首页”", "send");
  },
  mounted() {
    this.getActives();
    this.getActiveQuestions();
    this.getBanners();
    this.getNotices();
  },
  methods: {
    //活动公告
    async getNotices() {
      let res = await getNotices();
      this.noticesList = res.data;
    },
    // ...homeModule.mapActions(["getAdsList", "getMenuList"]),
    //最低日利率
    async getActives() {
      let res = await getActives({ type: 1 });
      this.activityList = res.data;
    },
    // 问题列表
    async getActiveQuestions() {
      let res = await getActiveQuestions({ type: 1 });
      this.activityQuestionsList = res.data;
    },
    activityListDetail(url, status) {
      if (this.wxMe && this.wxMe.telephone) {
        if (status == "open") {
          let wxUserInfo = Store.get(Config.constants.wxUserInfo) || {};
          // let cookies = Store.get(Config.constants.cookies) || {};
          // wxUserInfo = Object.assign(cookies, wxUserInfo);
          wxUserInfo.status = status;
          wxUserInfo.telephone = this.wxMe.telephone;
          Store.set(Config.constants.wxUserInfo, wxUserInfo);
          window.location.href = url;
        } else {
          this.$toast("活动已结束");
        }
      } else {
        this.$emit("login");
      }
    },
    //banners
    async getBanners() {
      let res = await getActives({ type: 3 });
      this.bannerList = res.data;
    },
    bannerListDtail(url) {
      window.location.href = url;
    }
  }
};
</script>

<style lang="less">
.home-container {
  display: flex;
  flex-direction: column;
  width: 10.8rem;
  margin: 0 auto;
  margin-bottom: 1.6rem;
  height: 100%;
  background: #fafafa;
  .top {
    background: #fff;
    margin-bottom: 0.24rem;
    .header {
      width: 100%;
      display: flex;
      justify-content: space-between;
      height: 1.2rem;
      .header-img {
        height: 1.2rem;
        // width: 1.2rem;
        margin-left: 0.32rem;
      }
      .login {
        display: inline-block;
        height: 1.2rem;
        line-height: 1.2rem;
        padding-left: 0.72rem;
        padding-right: 0.48rem;
        background: url(../../assets/icon.png) 0 0.3rem no-repeat;
        background-size: 0.56rem 0.56rem;
        font-size: 0.36rem;
        color: #fa494b;
      }
    }
    .person-img {
      width: 10.8rem;
      height: 4.64rem;
      pointer-events: auto;
    }
    .swiper-notice {
      height: 1.12rem;
      padding-left: 1.32rem;
      background: url(../../assets/img_gg.png) 0.4rem 0.34rem no-repeat;
      background-size: 0.8rem 0.4rem;
      .notice {
        text-align: left;
        height: 100%;
        line-height: 1.12rem;
        background: #fff;
        font-size: 0.36rem;
        color: #333;
      }
    }
    .line {
      margin: 0;
      height: 0.24rem;
      background: #f5f5f5;
      width: 100%;
    }
    // .friend-help {
    //   display: inline-block;
    //   position: relative;
    //   margin: 0 auto 0.48rem;
    //   height: 3.76rem;
    //   width: 10rem;
    //   // pointer-events: none;
    //   border-radius: 0.16rem;
    //   background: url(../../assets/banner_one.png) 0 0 no-repeat;
    //   background-size: 100% 100%;
    //   .min-knife {
    //     font-size: 0.44rem;
    //     color: #fff;
    //     position: absolute;
    //     bottom: 0.5rem;
    //     left: 0;
    //     right: 0;
    //     margin: auto;
    //   }
    // }
    .active-item.active-item:first-child {
      margin: 0 0.2rem 0.48rem 0.4rem;
    }
    .active-item {
      margin: 0 auto 0.48rem;
      height: 3.76rem;
      width: 7.76rem;
      border-radius: 0.16rem;
    }
    .active-item:first-child {
      margin: 0 0.2rem 0.48rem 0.4rem;
    }
    .active-item:last-child {
      margin: 0 0.4rem 0.48rem auto;
    }
    .active-img {
      position: relative;
      pointer-events: auto;
      height: 3.76rem;
      width: 7.76rem;
      .active-bg {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        right: 0;
      }
      .min-knife {
        font-size: 0.38rem;
        color: #fff;
        position: absolute;
        bottom: 0.64rem;
        left: 0;
        right: 0;
        margin: auto;
      }
    }
  }
  .center {
    background: #fff;
    text-align: left;
    padding-bottom: 0.36rem;
    .problem-item {
      width: 4.4rem;
      height: 2.4rem;
    }
    .purpose,
    .flowpath {
      position: relative;
      display: inline-block;
      width: 2.88rem;
      height: 2.4rem;
      padding-left: 1.52rem;
      background: #fafafa;
      border-radius: 0.16rem;
      margin-left: 0.4rem;
      .center-icon {
        top: 0.72rem;
        left: 0.32rem;
        position: absolute;
        width: 1rem;
        height: 1rem;
      }
      .stitle-newline {
        font-size: 0.36rem;
        padding: 0.4rem 0 0.28rem 0;
        color: #333;
      }
      .stitle {
        // height: 0.36rem;
        font-size: 0.36rem;
        // transform: scale(1);
        // -webkit-transform: scale(1);
        padding: 0.72rem 0 0.28rem 0;
        color: #333;
      }
      .sdetail {
        display: inline-block;
        height: 0.26rem;
        font-size: 0.26rem;
        // transform: scale(0.8);
        // -webkit-transform: scale(0.8);
        // margin-left: -0.18rem;
        color: #999;
      }
    }
  }
  .title {
    margin: 0;
    height: 1.48rem;
    line-height: 1.48rem;
    text-align: left;
    font-size: 0.44rem;
    color: #333;
    padding-left: 0.4rem;
  }
}
</style>
