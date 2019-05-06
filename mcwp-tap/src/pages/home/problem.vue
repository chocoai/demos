<template>
    <div class="problem-container">
        <p class="problem-title">常见问题</p>
        <collapse v-model="activeName" accordion>
            <collapse-item v-for="(item, index) in activityQuestionsList" :key="index" class="problem-detail" :title="item.title" :name="index">
                <div v-html="item.answer"></div>
            </collapse-item>
        </collapse>
    </div>
</template>
<script>
import { Collapse, CollapseItem } from "vant";
import { getActiveQuestions } from "../../service/home.js";

export default {
  components: {
    CollapseItem,
    Collapse
  },
  data() {
    return {
      activeName: 0,
      activityQuestionsList: []
    };
  },
  mounted() {
    this.getActiveQuestions();
  },
  methods: {
    // 问题列表
    async getActiveQuestions() {
      let res = await getActiveQuestions({ type: 2 });
      this.activityQuestionsList = res.data;
    }
  }
};
</script>
<style lang="less">
.problem-container {
  display: flex;
  width: 10.8rem;
  margin: 0 auto;
  height: 100vh;
  flex-direction: column;
  background: #fafafa;
  .problem-title {
    height: 1.28rem;
    line-height: 1.28rem;
    text-align: left;
    margin-left: 0.48rem;
    color: #666;
    font-size: 0.36rem;
  }
  .problem-detail {
    color: #666;
    font-size: 0.4rem;
    line-height: 0.72rem;
    background: #fafafa;
    text-align: left;
  }
  .van-cell:not(:last-child)::after {
    border-bottom-width: 0;
  }
  [class*="van-hairline"]::after {
    border-style: ridge;
  }
}
</style>
