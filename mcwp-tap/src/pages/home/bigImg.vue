<template>
 <!-- <transition name="fade"> -->
  <div class="img-view" @click="bigImg">
  <!-- 遮罩层 -->
  <div class="img-layer">
      <img :src="'data:image/png;base64,'+ prdurl" @click.stop="clickQRImg">
  </div>
  </div>
<!-- </transition> -->
</template>

<script>
export default {
  name: "bigImg",
  props: ["prdurl"],
  methods: {
    bigImg() {
      this.$emit("clickit");
    },
    clickQRImg() {}
  }
};
</script>

<style  lang="less" scoped>
/*动画*/
// .fade-enter-active,
// .fade-leave-active {
//   transition: .2s all linear;
//   transform: translate3D(0, 0, 0);
// }

// .fade-enter,
// .fade-leave-active {
//   transform: translate3D(100%, 0, 0);
// }
/* bigimg */
.img-view {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  .img-layer {
    position: fixed;
    z-index: 999;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.75);
    width: 100%;
    height: 100%;
    overflow: hidden;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      z-index: 1000;
      height: 7rem;
      width: 7rem;
      pointer-events: auto;
    }
  }
}

/*遮罩层样式*/

/*不限制图片大小，实现居中*/
// .img-view .img img {
//     max-width: 100%;
//     display: block;
//     position: absolute;
//     left: 0;
//     right: 0;
//     margin: auto;
//     z-index: 1000;
//    background-color: cyan;
// }
</style>
