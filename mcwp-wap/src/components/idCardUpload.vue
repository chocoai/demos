<template>
  <div class="idcard-upload">
      <img v-if="open != 'h5' && open != 'WeChat'" class="idcard-img" :src="defaultImg" @click="callApp" >
      <img v-if="open == 'h5' && open != 'WeChat'" class="idcard-img" :src="defaultImg" >
      <img v-if="open == 'WeChat'" class="idcard-img" :src="defaultImg" @click.prevent="callWx" >
      <input v-if="open == 'h5' && open != 'WeChat'" class="idcard-file" type="file" @change="upload" multiple>
  </div>
</template>

<script>
export default {
  props: ['defaultImg', 'type', 'open'],
  methods: {
    callApp (e) { // 与app交互
      const that = this
      that.$emit('callApp', that.type)
    },
    callWx () { // 调用微信拍照或从手机相册中选图接口
      const that = this
      that.$emit('callWx', that.type)
    },
    upload (e) {
      const that = this
      that.$emit('upload', e.target.files[0], that.type)
    }
  }
}
</script>

<style lang="less" scoped>
  .idcard-upload {
    position: relative;
    float: left;
    border: none;
    background-color: transparent;
    width: 7.5rem;
    height: 5.12rem;
    .idcard-img {
      position: relative;
      display: block;
      width: 100%;
      height: 100%;
      z-index: 1;
    }

    .idcard-file {
      position: absolute;
      z-index: 10;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    }
  }
</style>
