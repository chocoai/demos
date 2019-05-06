<template>
  <div class="increase-container">
      <div class="increase-tip">授权过程不记录用户的密码，保障用户账户安全！</div>
    <div class="increase-content" @click="reservedFundAuthorize">
      <div class="increase-box">
        <img class="authorize-img" src="@/assets/icon_fund.png">
        <div class="increase-warp">
             <span class="increase-title">公积金授权</span>
            <span class="increase-detail">{{lastReservedFundDate}}</span>
        </div>
      </div>
      <div class="increase-tolink">
           <img src="@/assets/icon_choice.png">
      </div>
    </div>
    <div class="increase-content" @click="bankAuthorize" v-if="false">
      <div class="increase-box">
        <img class="authorize-img" src="@/assets/icon_net.png">
        <div class="increase-warp">
             <span class="increase-title">网银流水授权</span>
            <!--<span class="increase-detail">最后授权时间:2018年10月8号</span>-->
        </div>
      </div>
      <div class="increase-tolink">
           <img src="@/assets/icon_choice.png">
      </div>
    </div>
  </div>
</template>
<script>
import {
  getReservedFundState,
  getMxPageUrl,
  reservedFundCallback
} from "../../service/home.js";
import { objToStr } from "../../utils/index.js";
const TYPE_RESERVED_FUND = 2; //公积金
// const TYPE_BANK_CARD = 1;     //银行流水
export default {
  data() {
    return {
      reservedFundState: null,
      reservedFundDate: null,
      lastReservedFundDate: "未授权"
    };
  },
  mounted() {
    if (this.$route.query.isCallback) {
      this.callback();
    } else {
      this.getAuthorizeState();
    }
  },
  methods: {
    reservedFundAuthorize() {
      this.authorize(TYPE_RESERVED_FUND);
    },
    bankAuthorize() {
      // TODO 待定
      // this.authorize(1);
      this.$toast("coming soon");
    },
    async getAuthorizeState() {
      this.$toast.loading({
        message: "正在加载...",
        mask: true
      });
      let result = await getReservedFundState();
      console.log(objToStr(result));
      this.$toast.clear();
      this.reservedFundState = result.data.isAuthentication;
      this.reservedFundDate = result.data.authenDate;
      if (this.reservedFundState == 2) {
        this.lastReservedFundDate = `最后授权时间：${new Date(
          this.reservedFundDate
        ).format("yyyy年MM月dd日")}`;
      } else {
        switch (this.reservedFundState) {
          case 0:
            this.lastReservedFundDate = "未授权";
            break;
          case 1:
            this.lastReservedFundDate = "查询中";
            break;
          case 3:
            this.lastReservedFundDate = "授权失败";
            break;
          case 4:
            this.lastReservedFundDate = "授权过期";
            break;
          default:
            this.lastReservedFundDate = "未知状态";
            break;
        }
      }
      if (this.$route.query.isCallback) {
        let str;
        if (this.reservedFundState == 2) {
          str = "授权成功";
        } else {
          str = this.lastReservedFundDate;
        }
        this.$toast.success({
          message: str,
          mask: true
        });
      }
    },
    async authorize(type) {
      if (this.reservedFundState != 2) {
        this.$toast.loading({
          message: "请稍后",
          mask: true
        });
        let result = await getMxPageUrl({
          type: type,
          flag: 0
        });
        this.$toast.clear();
        let url = window.location.href;
        url = url.split("?")[0];
        window.location.href = `${result.data}&backUrl=${url}?isCallback=true`;
      } else {
        this.$toast("30天内您已进行授权，请勿重复操作");
      }
    },
    async callback() {
      await reservedFundCallback({
        taskId: this.$route.query.taskId,
        mxcode: this.$route.query.mxcode,
        taskType: this.$route.query.taskType
      });
      this.getAuthorizeState();
    }
  }
};
</script>
<style lang="less" scoped>
.increase-container {
  width: 10.8rem;
  margin: 0 auto;
  height: 100vh;
  .increase-tip {
    padding: 0.48rem;
    color: #333;
    font-size: 0.36rem;
    background: #fff;
    text-align: left;
    margin-bottom: 0.4rem;
  }
  .increase-content {
    margin: 0.32rem 0.64rem;
    padding: 0.8rem;
    background: #fff;
    border-radius: 0.24rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    pointer-events: auto;
    box-shadow: 0 0 0.04rem 0.08rem rgba(0, 0, 0, 0.02);
    .increase-box {
      display: flex;
      align-items: center;
      .authorize-img {
        height: 1.6rem;
        width: 1.6rem;
        padding-right: 0.4rem;
      }
      .increase-warp {
        text-align: left;
      }
      .increase-title {
        display: block;
        color: #333;
        font-size: 0.48rem;
        font-weight: bold;
        /*padding-bottom: 0.3rem;*/
      }
      .increase-detail {
        display: block;
        font-size: 0.36rem;
        color: #666;
      }
    }
    .increase-tolink {
      img {
        width: 0.4rem;
        height: 0.4rem;
      }
    }
  }
}
</style>
