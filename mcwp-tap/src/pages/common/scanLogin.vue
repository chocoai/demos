<template>
  <div class="scan-container" v-if="!scanStatus">
    <img class="logo" src="../../assets/scan-login-logo.png" alt="logo">
    <input class="command" v-model="command" type="text" placeholder="请输入授权口令">
    <Button class="btn" @click="confirm" type="primary">确认授权</Button>
  </div>
  <div class="scan-container" v-else>
      <img class="logo" src="../../assets/scan-login-logo.png" alt="logo">
      <p class="success">登录成功</p>
  </div>
</template>

<script>
import { Button } from "vant";
import { postScanCheck } from "@/service/common";
import Store from "store";
import { Config } from "@/utils";

export default {
  components: {
    Button
  },
  data() {
    return {
      command: null,
      scanStatus: false
    };
  },
  mounted() {
    let wxUserInfo = Store.get(Config.constants.wxUserInfo);
    this.scanStatus = wxUserInfo.scanStatus;
    this.scanNonceStr = wxUserInfo.scanNonceStr;
  },
  methods: {
    async confirm() {
      await postScanCheck({
        nonceStr: this.scanNonceStr,
        str: encodeURIComponent(this.command)
      });
      this.scanStatus = true;
    }
  }
};
</script>

<style lang="less" scoped>
.scan-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 0.48rem;
  background-color: #fff;
  height: 100vh;
  .logo {
    width: 3.6rem;
    height: 3.6rem;
    margin-top: 2.8rem;
  }
  .command {
    margin-top: 1.2rem;
    width: 8.4rem;
    line-height: 1.6rem;
    border-radius: 0.8rem;
    background-color: #f3f3f3;
    color: #333;
    text-align: center;
  }
  .btn {
    margin-top: 0.96rem;
    width: 4rem;
    height: 1.44rem;
    line-height: 1.44rem;
    border-radius: 0.72rem;
    background-color: #369fff;
    color: #fff;
    border: none;
  }
  .success {
    margin-top: 0.6rem;
  }
}
</style>
