<template>
  <div :class="['puzzle-winner-container', {'shake-winner-container': isShake}]">
    <div :class="['wrapper', {'shake-wrapper': isShake}]">
      <div :class="['inner', {'shake-inner': isShake}]">
        <p class="prize">{{prize.prizeName}}</p>
        <field v-model="userName" label="姓名" placeholder="请输入姓名"/>
        <div class="phone-back">
          <field v-model="userPhone" label="联系方式" placeholder="请输入手机号" />
          <div class="phone-mask" v-if="userPhone" @click="click"></div>
        </div>
        <field v-model="userAddress" label="联系地址" placeholder="请输入地址" />
        <p class="deadline">兑奖期限</p>
        <p class="date">{{date}}</p>
        <img class="get-prize" @click.prevent="receive" :src="isShake ? require('../../../assets/activity/tiger/btn_onceget.png') : require('../../../assets/puzzle-get-prize.png')" alt="get-prize" />
        <div>
          <img class="qr-code" @click.prevent="1" :src="qrCode" alt="qrCode">
        </div>
        <p class="qr-content">长按识别二维码</p>
        <p class="qr-content">关注公众号</p>
      </div>
    </div>
    <winner-res v-if="showRes && isShake != true" @showReceived="$emit('takeSuccess')" @clickExchange="$emit(exchange)" :prize-type="prize.prizeType"></winner-res>
    <tiger-result v-if="showRes && isShake" shake-type="3" @clickConfirm="$emit('takeSuccess')" @clickExchange="$emit('exchange')" :prize-type="prize.prizeType"></tiger-result>
  </div>
</template>

<script>
import { Field, CellGroup } from "vant";
import { isTelephone } from "@/utils";
import { postPuzzleWinner } from "@/service/activity/puzzle";
import { postShakeWinner } from "../../../service/activity/tiger/tiger";
import CryptoJS from "crypto-js";
import { countPlus, formatDateTime } from "../../../utils";
import WinnerRes from "./winnerRes";
import TigerResult from "../tiger/tigerResult";
import { getWxLoginStatus } from "../../../service/user";

export default {
  components: {
    Field,
    CellGroup,
    WinnerRes,
    TigerResult
  },
  props: [
    "activityCode",
    "prizeId",
    "prize",
    "qrCode",
    "isShake"
    // "userPhone",
    // "name"
  ],
  data() {
    return {
      userName: "",
      userPhone: "",
      userAddress: "",
      date:
        this.prize.prizeTime &&
        `${formatDateTime(
          this.prize.prizeTime.split(",")[0] - 0
        )}至${formatDateTime(this.prize.prizeTime.split(",")[1] - 0)}`,
      showRes: false
    };
  },
  mounted() {
    // this.userName = this.name;
    this.getWxLoginStatus();
  },
  methods: {
    async getWxLoginStatus() {
      let res = await getWxLoginStatus();
      if (res.data) {
        if (res.data.telephone) {
          this.userPhone = res.data.telephone;
        }
        if (res.data.userName) {
          this.userName = res.data.userName;
        }
      }
    },
    async receive() {
      const that = this;
      // if (!that.name) {
      if (!that.userName) return that.$toast("请输入用户名");
      // }
      if (!that.userPhone) return that.$toast("请输入联系方式");
      if (!isTelephone(that.userPhone))
        return that.$toast("请输入正确的联系方式");
      if (!that.userAddress) return that.$toast("请输入联系地址");
      let keyHex = CryptoJS.enc.Utf8.parse(this.activityCode.slice(0, 16));
      // direct decrypt ciphertext
      let cipherid = CryptoJS.AES.encrypt(that.prizeId + "", keyHex, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      });
      let param = {
        userName: that.userName,
        userPhone: that.userPhone,
        userAddress: that.userAddress,
        activityCode: that.activityCode,
        competeness: cipherid.toString()
      };
      if (that.isShake) {
        await postShakeWinner(param);
        countPlus("摇一摇游戏点击“立即兑奖”", "send");
      } else {
        await postPuzzleWinner(param);
      }
      this.showRes = true;
    },
    click() {}
  }
};
</script>

<style lang="less">
.puzzle-winner-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  // bottom: 0;
  min-height: 100vh;
  z-index: 1200;
  /*height: 100vh;*/
  background: url(../../../assets/puzzle_bg.png) no-repeat top left;
  background-size: 100%;
  .wrapper {
    margin: 0.48rem auto;
    width: 9.84rem;
    box-sizing: border-box;
    // height: 10rem;
    padding: 0.24rem;
    background-color: #f4cf06;
    border: 0.06rem solid #1a0009;
  }
  .inner {
    background-color: #fff;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 0.8rem 0.52rem 0.56rem;
    border: 0.06rem solid #1a0009;
    .phone-back {
      position: relative;
      .phone-mask {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
    }
  }
  .prize {
    margin-bottom: 0.8rem;
    font-size: 0.56rem;
    color: #441314;
  }
  .van-cell {
    padding: 0 0 0.4rem;
  }
  .van-cell__title,
  .van-cell__value {
    height: 1.04rem;
    line-height: 1.04rem;
    font-size: 0.4rem;
  }
  .van-cell__title {
    text-align: left;
    font-weight: bold;
  }
  .van-field .van-cell__title {
    max-width: 70px;
  }
  .van-cell__value {
    border-bottom: 0.06rem solid #1a0009;
    box-sizing: border-box;
  }
  .van-hairline::after {
    border: none;
  }
  .deadline {
    text-align: left;
    font-size: 0.36rem;
    line-height: 0.48rem;
    font-weight: bold;
    color: #888;
  }
  .date {
    text-align: left;
    font-size: 0.4rem;
    line-height: 0.64rem;
    color: #441314;
  }
  .get-prize {
    margin-top: 0.76rem;
    width: 3.12rem;
    height: 1.2rem;
    pointer-events: auto;
  }
  .qr-code {
    width: 1.6rem;
    height: 1.6rem;
    margin-top: 1.2rem;
    pointer-events: auto;
  }
  .qr-content {
    margin-top: 0.16rem;
    font-size: 0.36rem;
    line-height: 0.48rem;
  }
}
.shake-winner-container {
  background: url(../../../assets/activity/tiger/img-bg.png) no-repeat top left !important;
  background-size: cover !important;
}
.shake-wrapper {
  background-color: #bae0fd !important;
  border: 0.1rem solid #1a0009 !important;
  padding: 0.28rem !important;
  border-radius: 0.08rem;
}
.shake-inner {
  border: 0.1rem solid #1a0009 !important;
  border-radius: 0.08rem;
}
</style>
