<template>
  <div>
    <input type="text" class="form-control" v-model="text" placeholder="v-model" />
    <van-button type="primary">主要按钮</van-button>
  </div>
</template>

<script>
export default {
  props: ['text']
}
</script>

<style>
.form-control {
  display: block;
  text-align: center
}
</style>
