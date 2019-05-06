<template>
  <div @click="hide" class='share-wrapper'><img class='share-img' :src="`${type === 'download' ? downloadImg : shareImg}`" /></div>
</template>

<script>
import shareImg from "@/assets/share-tip.png";
import downloadImg from "@/assets/download-tip.png";
export default {
  props: ["type"],
  data() {
    return {
      shareImg,
      downloadImg
    };
  },
  methods: {
    hide() {
      this.$emit("hide");
    }
  }
};
</script>


<style lang="less" scoped>
.share-wrapper {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  z-index: 1100;
}
.share-img {
  width: 60%;
  float: right;
  margin-right: 0.6rem;
}
</style>
