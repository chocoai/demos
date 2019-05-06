<template>
  <div class="red-packet-container">
    <Login v-if="showLogin" @success="loginSuccess" />
    <div :class="[ 'main-container',{'disable-scroll':showRedPacket} ]" v-if="bgImg" :style="{background: 'url(\''+bgImg+'\') 0 0 / 100% auto no-repeat #f95e52'}">
      <div class="content">
        <div class="button-group">
          <img src="../../../assets/activity/redPacket/btn_share.png" @click="showShare=true" alt="" class="button share">
          <img src="../../../assets/activity/redPacket/btn_my_red_packet.png" @click="redPacketShow" alt="" class="button my-red-packet">
        </div>
        <div class="rules">
          <p class="rules-title">活动规则</p>
          <p class="rules-item">{{description}}</p>
          <p class="rules-title">抵息红包使用规则</p>
          <p class="rules-item">{{useDescription}}</p>
        </div>
      </div>
      <div v-if="showRedPacket" class="red-packet-list-container">
        <div class="red-packet-list-content">
          <div class="red-packet-list">
            <div class="red-packet-item" v-for="redPacket in redPacketList" :key="redPacket.getDate">
              <div class="text-content">
                <span class="num">{{redPacket.deductionMoney}}</span>
                <span class="unit">元</span>
              </div>
              <p class="date">使用期限: {{new Date(redPacket.getDate).format("yyyy.MM.dd")}}-{{new Date(redPacket.overDate).format("yyyy.MM.dd")}}</p>
            </div>
          </div>
          <img src="../../../assets/activity/redPacket/icon_close.png" @click="showRedPacket=false" alt="" class="button close">
        </div>
      </div>
      <share-view v-if="showShare" @hide="showShare=false"></share-view>
    </div>
  </div>
</template>

<script>
import {
  getMyRedPacket,
  getRedPacketContent,
  share
} from "../../../service/activity/redPacket";
import wxSdk from "@/utils/wxJsSdk";
import shareView from "@/components/share";
import { Config } from "@/utils/index.js";
import { countPlus } from "../../../utils";
import Store from "store";
import Login from "../../../components/home/login";
import { getWxLoginStatus } from "../../../service/user";

export default {
  name: "RedPacket",
  data() {
    return {
      showRedPacket: false,
      showShare: false,
      bgImg: "",
      description: "",
      useDescription: "",
      redPacketList: [
        // { deductionMoney: 30, getDate: 1545617960000, overDate: 1545618960000 },
        // { deductionMoney: 30, getDate: 1545617920000, overDate: 1545618930000 },
        // { deductionMoney: 30, getDate: 1545617940000, overDate: 1545618950000 }
      ],
      showLogin: false
      // userPhone: null,
      // userName: null
    };
  },
  mounted() {
    this.getWxLoginStatus();
  },
  components: {
    shareView,
    Login
  },
  methods: {
    async getWxLoginStatus() {
      let res = await getWxLoginStatus();
      if (res.data) {
        if (res.data.loginStatus) {
          this.showLogin = false;
          this.initInfo();
          this.initShare();
        } else {
          this.showLogin = true;
        }
      }
    },
    async initInfo() {
      this.$toast.loading("请稍后...");
      let listRes = await getMyRedPacket();
      const redPackData = await getRedPacketContent();
      this.redPacketList = listRes.data || [];
      this.$toast.clear();
      const redPackContent = redPackData.data;
      this.bgImg = redPackContent.bgImg;
      this.description = redPackContent.description;
      this.useDescription = redPackContent.useDescription;
    },
    async initShare() {
      let that = this;
      let wxUserInfo = Store.get(Config.constants.wxUserInfo);
      let cookies = Store.get(Config.constants.cookies);
      // let cookies = Store.get(Config.constants.cookies);
      // alert(objToStr(wxUserInfo));
      // TODO: 3.1 重构
      let shareUrl = `${
        window.location.origin
      }/backend/comm/v1/wx/authorize?url=${encodeURIComponent(
        `/tap/activity/redPacket/share?telephone=${wxUserInfo.telephone ||
          cookies.telephone}`
      )}&bankCode=${cookies.bankCode}&activityType=bonus`;
      wxSdk.wxShareCommon(
        () => {
          that.showShare = false;
          countPlus("抵息红包分享", "send");
          share();
        },
        {
          type: 7,
          activityCode: ""
        },
        shareUrl
      );
    },
    redPacketShow() {
      if (!this.redPacketList.length) return this.$toast("没有红包");
      countPlus("点击“我的红包”", "send");
      this.showRedPacket = true;
    },
    loginSuccess() {
      this.showLogin = false;
      // this.userPhone = data.telephone;
      // if (data.name) {
      //   this.userName = data.name;
      // }
      this.initInfo();
      this.initShare();
    }
  }
};
</script>

<style lang="less" scoped>
.red-packet-container {
  min-height: 100vh;
}
.button {
  pointer-events: auto;
}
.disable-scroll {
  max-height: 100vh;
  overflow: hidden;
}
.main-container {
  background: url("../../../assets/activity/redPacket/bg_red_packet.png") 0 0 /
    100% auto no-repeat #f95e52;
  min-height: 100vh;
  padding-bottom: 0.1px;
  .content {
    padding-top: 7.44rem;
    .button-group {
      padding: 0 0.72rem;
      .share {
        width: 4.4rem;
        height: 1.28rem;
        margin-right: 0.56rem;
      }
      .my-red-packet {
        width: 4.4rem;
        height: 1.28rem;
      }
    }
    .rules {
      background-color: #fff0d9;
      border-radius: 0.24rem;
      padding: 0.001rem 0.8rem 0.96rem;
      margin: 0.56rem 0.56rem 0.96rem;
      .rules-title {
        text-align: left;
        color: #f85851;
        font-size: 0.36rem;
        font-weight: 900;
        margin-top: 0.72rem;
        margin-bottom: 0.48rem;
      }
      .rules-item {
        text-align: left;
        color: #555;
        font-size: 0.36rem;
        margin-top: 0.32rem;
        line-height: 0.48rem;
        font-weight: 900;
        white-space: pre-wrap;
        word-wrap: break-word;
      }
    }
  }
  .red-packet-list-container {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 80%);

    .red-packet-list-content {
      position: relative;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      .red-packet-list {
        max-height: 70vh;
        overflow: scroll;
        .red-packet-item {
          background: url("../../../assets/activity/redPacket/img_red_packet.png");
          background-size: cover;
          width: 3.84rem;
          height: 1.36rem;
          margin: 0.48rem auto;
          padding: 0.36rem 0 0.32rem 1.2rem;
          .text-content {
            margin-left: 0.94rem;
            height: 0.96rem;
            line-height: 0.96rem;
            font-size: 0;
            text-align: left;
            overflow: hidden;
            .num {
              width: 2.26rem;
              height: 0.96rem;
              font-size: 0.96rem;
              line-height: 0.96rem;
              color: #feff8b;
              font-weight: 900;
              margin-right: 0.2rem;
            }
            .unit {
              font-size: 0.24rem;
              color: #feff8b;
              font-weight: 900;
            }
          }
          .date {
            font-size: 0.22rem;
            margin-top: 0.2rem;
            white-space: nowrap;
            color: white;
            text-align: left;
          }
        }
      }
      .close {
        width: 1.2rem;
        height: 1.2rem;
        margin-top: 0.96rem;
      }
    }
  }
}
</style>
