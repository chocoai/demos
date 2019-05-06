<template>
    <div class="prize-result">
      <received :user-prize="userPrize" :is-tiger="true">
        <img class="logo" :src="logoUrl" alt="logo">
        <img class="puzzle-rule btn" @click="showRule = true" src="../../../assets/activity/tiger/btn-activity-rules.png" alt="" />
        <div class="news">
          <swipe class="news-content" v-if="news&&news.length" :autoplay="1500" :show-indicators="false" vertical>
            <swipe-item  v-for="(text,index) in news" :key="index">
              <span class="news-text">{{text}}</span>
            </swipe-item>
          </swipe>
        </div>
        <p class="participate-num" v-if="userPrize.showCount">已有{{userPrize.personCount}}人参与</p>
      </received>
      <shake-declare
        v-if="showRule"
        :rule="rules"
        @clickBackground="showRule = false"
      ></shake-declare>
    </div>
</template>

<script>
import { Swipe, SwipeItem } from "vant";
import received from "../../../components/activity/puzzle/received";
import shakeDeclare from "../../../components/activity/tiger/tigerDeclare";
export default {
  name: "prize-result",
  data() {
    return {
      showRule: false,
      userPrize: this.$route.query,
      logoUrl: this.$route.query.logoUrl,
      rules: JSON.parse(this.$route.query.rules),
      news: this.$route.query.news
    };
  },
  components: {
    received,
    Swipe,
    SwipeItem,
    shakeDeclare
  }
};
</script>

<style lang="less" scoped>
.prize-result {
  .news {
    width: 8.84rem;
    height: 2.04rem;
    border: 0.1rem #161235 solid;
    background-color: #bae0fd;
    border-radius: 0.08rem;
    margin: 0 auto;
    top: 0.4rem;
    position: relative;

    .news-content {
      width: 8.2rem;
      height: 1.4rem;
      border: 0.1rem #161235 solid;
      background-color: #1582d5;
      margin: auto;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);

      .news-text {
        font-size: 0.4rem;
        color: white;
        font-weight: bold;
        text-align: center;
        position: absolute;
        width: 8.2rem;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }
  .logo {
    position: absolute;
    left: 0.4rem;
    top: 0.16rem;
    width: 1.5rem;
    height: 1.5rem;
  }
  .puzzle-rule {
    position: absolute;
    top: 0.6rem;
    right: 0;
    width: 1.92rem;
    height: 0.8rem;
    pointer-events: auto;
  }
  .participate-num {
    margin-top: 0.4rem;
    font-size: 0.36rem;
    top: 0.4rem;
    position: relative;
    color: #441314;
  }
}
</style>
