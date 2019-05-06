<template>
  <div class="blank">
    <img class="no-info" src="../assets/img_noinfo.png" alt="no-info" />
    <slot>我是空白页</slot>
  </div>
</template>

<script>
export default {
}
</script>

<style lang="less" scoped>
.blank {
  width: 100%;
  height: 100vh;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: .4rem;
  color: #666;
  .no-info {
    width: 7.6rem;
    height: 5.6rem;
    margin: 2.4rem 0 .8rem;
  }

}
</style>
