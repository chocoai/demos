<template>
  <div class="share-FAQ-container">
    <img class="share-img share-img-click" @click.prevent="1" src="@/assets/share_FAQ_01.png">
    <img class="share-img" src="@/assets/share_FAQ_02.png">
    <img class="share-img" src="@/assets/share_FAQ_03.png">
    <img class="share-img" src="@/assets/share_FAQ_04.png">
    <img class="share-img" src="@/assets/share_FAQ_05.png">
    <img class="share-img" src="@/assets/share_FAQ_06.png">
  </div>
</template>
<script>
export default {};
</script>
<style lang="less" scoped>
.share-FAQ-container {
  width: 10.8rem;
  background: #fff;
  .share-img {
    width: 10.8rem;
  }
  .share-img-click {
    pointer-events: auto;
  }
}
</style>
