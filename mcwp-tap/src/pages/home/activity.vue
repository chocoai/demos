<template>
  <div class="activity-container">
    <div v-if="activityList && activityList.length">
      <list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        :immediate-check="false"
      >
        <div v-for="(item, index) in activityList" :key="index" @click="goTo(item)" >
          <div class="activity-item">
            <div class="activity-img-container">
              <img class="activity-img" :src="item.imgUrl" alt="">
            </div>
            <p class="activity-name">{{item.activityName}}</p>
            <div class="activity-bottom">
              <span class="join-time">参与时间：{{new Date(item.activityTime).format("yyyy.MM.dd")}}</span>
              <span class="activity-state">{{item.activityStatusText}}</span>
            </div>
          </div>
        </div>
      </list>
    </div>
    <div v-else>
      <p class="activity-no">暂无活动</p>
    </div>
  </div>
</template>

<script>
import { myActivityList } from "../../service/home";
import { getWxUserInfo } from "../../service/common";
import { List } from "vant";
import Store from "store";
import prefixUrl from "@/utils/mixins/prefixUrl";

import { Config } from "../../utils";
export default {
  mixins: [prefixUrl],
  data() {
    return {
      url: window.location.origin.toString(),
      loading: false,
      finished: false,
      activityList: [],
      rows: 10
    };
  },
  components: { List },
  mounted() {
    this.getInfo();
  },
  methods: {
    onLoad() {
      this.getActivity(this.activityList.length / this.rows + 1);
    },
    goTo(item) {
      if (item.activityStatusText == "进行中") {
        let wxUserInfo = Store.get(Config.constants.wxUserInfo);
        if (wxUserInfo !== null) {
          wxUserInfo.status = "open";
          Store.set(Config.constants.wxUserInfo, wxUserInfo);
        }
        location.href = this.url + item.activityUrl;
      } else {
        this.$toast("活动已结束");
      }
    },
    async getActivity(page) {
      let res = await myActivityList(page, this.rows);
      this.loading = false;
      if (res && res.code == 0) {
        this.finished = res.data == null || res.data.length < this.rows;
        if (page == 1) {
          this.activityList = res.data;
        } else {
          this.activityList.push(...res.data);
        }
      }
    },
    async getInfo() {
      let res = await getWxUserInfo({});
      let wxUserInfo = res && res.data;
      Store.set(Config.constants.wxUserInfo, wxUserInfo);
      this.getActivity(1);
    }
  }
};
</script>
<style lang="less" scoped>
.activity-container {
  width: 10.8rem;
  padding: 0.32rem 0 0 0;
  background: #fafafa;
  .activity-item {
    position: relative;
    width: 9.12rem;
    font-size: 0;
    margin: 0.32rem auto 0.32rem;
    padding: 0.32rem 0.4rem 0.4rem 0.4rem;
    border-radius: 0.16rem;
    background: white;
    &:first-child {
      margin-top: 0;
    }
    .activity-img-container {
      width: 9.12rem;
      height: 376 / 912 * 9.12rem;
      border-radius: 0.16rem;
      overflow: hidden;
      .activity-img {
        width: 100%;
        top: 50%;
        position: relative;
        transform: translateY(-50%);
      }
    }
    .activity-name {
      color: #333333;
      margin: 0.36rem 0 0.32rem 0;
      font-size: 0.44rem;
      text-align: left;
    }
    .activity-bottom {
      height: 0.36rem;
      margin-top: 0.32rem;
      font-size: 0;
      .activity-bottom-font-base {
        font-size: 0.36rem;
        color: #666666;
      }
      .join-time {
        .activity-bottom-font-base;
        float: left;
      }
      .activity-state {
        .activity-bottom-font-base;
        float: right;
      }
    }
  }
  div .activity-no {
    font-size: 0.8rem;
    font-weight: 600;
    padding: 1rem 0;
  }
}
</style>
