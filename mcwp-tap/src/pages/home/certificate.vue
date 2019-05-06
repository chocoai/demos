<template>
  <div>
      <img v-if="cert" :src="cert" alt="cert" class="cert">
      <h3 class="tip" v-else>暂无相关信息</h3>
  </div>
</template>

<script>
import { getMyCert } from "../../service/home";

export default {
  data() {
    return {
      cert: ""
    };
  },
  async created() {
    let res = await getMyCert();
    this.cert = res.data;
  }
};
</script>

<style lang="less" scoped>
.cert {
  width: 100vw;
}
.tip {
  font-size: 0.8rem;
  margin-top: 20px;
}
</style>
