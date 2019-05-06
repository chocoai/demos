<template>
    <div class="answer-result">
      <transition name="answer-result">
        <div v-show="detail && allImg" class="result-container">
          <img class="result-img" :src="`${allImg[`answer-${score}`]}`" />
          <img @click="resultJump" class="result-btn" :src="`${allImg[`btn-${score}`]}`" />
          <span class="result-name">{{name}}</span>
        </div>
      </transition>
    </div>
</template>

<script>
import Store from "store";
import { Config } from "@/utils/index.js";
import { countPlus } from "../../utils";

export default {
  props: ["score", "detail"],
  data() {
    return {
      asd: true,
      name: "",
      allImg: null
    };
  },
  created() {
    const imgs = require.context("./../../assets/answer/", false, /\.png$/);
    let allImg = {};
    imgs.keys().map(i => {
      allImg[`${/[A-Za-z]+-\d{2}/.exec(i)[0]}`] = imgs(i);
    });
    this.allImg = allImg;

    let wxUserInfo = Store.get(Config.constants.wxUserInfo);
    this.name = wxUserInfo.nickname;
  },
  methods: {
    resultJump() {
      countPlus("点击“领取你的旅行基金”", "send");
      window.location.replace(
        "https://ceshi66-mp-test.zhudb.com/h5/product/detail?prdCode=90b5485a1d5d4bb3bc3d2aa62ecfd8b6&managerCode=5fe8c791a02d43d8b8509bf12b5d4fcd"
      );
    }
  }
};
</script>

<style lang="less" scoped>
.answer-result {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 100;
  // height: 100vh;
  bottom: 0;
  // transform:
  overflow: scroll;
  // background-color: #3a3a3a;
  .result-container {
    height: 19.2rem;
    font-size: 0;
  }
  .result-img {
    width: 10.8rem;
    // height: 100%;
    height: 19.2rem;
  }
  .result-name {
    position: absolute;
    // width: 5.2rem;
    margin: auto;
    left: 0;
    right: 0;
    top: 9.52rem;
    font-size: 0.46rem;
    color: hsl(0, 0%, 23%);
    font-family: "方正兰亭准黑";
  }
  .result-btn {
    position: absolute;
    width: 5.2rem;
    margin: auto;
    left: 0;
    right: 0;
    top: 15.88rem;
    pointer-events: auto;
  }
  .answer-result-enter {
    opacity: 0;
    transform: scale(0);
  }
  .answer-result-enter-active {
    transition: all 2s;
  }
}
</style>
