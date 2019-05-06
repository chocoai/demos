<template>
  <div class="home-question-container" v-html="activityQuestion.answer">
  </div>
</template>
<script>
import { getActiveQuestion } from "../../service/home.js";

export default {
  props: ["code"],
  data() {
    return {
      activityQuestion: {}
    };
  },
  created() {},
  mounted() {
    this.getActiveQuestion();
  },
  methods: {
    // 问题详情
    async getActiveQuestion() {
      let res = await getActiveQuestion({ code: this.code });
      this.activityQuestion = res.data;
      document.title = res.data.title.split("<br/>").join("");
    }
  }
};
</script>
<style lang="less">
.home-question-container {
  .question-container {
    width: 10.8rem;
    margin: 0 auto;
    padding-bottom: 1.2rem;
    background: #fff;
    .question-title {
      width: 9.84rem;
      margin: 0 auto;
      text-align: left;
      font-size: 0.48rem;
      color: #333;
      height: 1.44rem;
      line-height: 1.44rem;
      border-bottom: #ddd 0.02rem solid;
    }
    .question-content {
      width: 9.84rem;
      margin: 0.48rem auto 0.4rem;
      text-align: left;
      font-size: 0.4rem;
      color: #333;
      line-height: 0.72rem;
    }
    .question-img {
      // width: 9.84rem;
      // margin: 0 auto 0.24rem;
      width: 10.8rem;
    }
    .question-img-click {
      pointer-events: auto;
    }
    .condition {
      width: 9.84rem;
      margin: 0.4rem auto 0;
      text-align: left;
      font-size: 0.4rem;
      color: #333;
      line-height: 0.72rem;
    }
    .condition-content {
      width: 9.84rem;
      margin: 0 auto;
      text-align: left;
      font-size: 0.4rem;
      color: #333;
      line-height: 0.72rem;
      padding-bottom: 1.2rem;
    }
  }
}
</style>
