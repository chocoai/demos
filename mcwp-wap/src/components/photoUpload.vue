<template>
  <div class="uploader">
    <div class="clearfix photo-uploader" :style="{backgroundImage: 'url(' + defaultImg + ')', backgroundRepeat: 'no-repeat', backgroundPosition: 'center center', backgroundSize: 'contain'}">
      <div class="uploader-img">点击拍摄人脸</div>
      <div v-if="open == 'WeChat'" class="idcard-file" @click="callWx"></div>
      <div v-if="open != 'h5' && open != 'WeChat'" class="idcard-file" @click="showSheet"></div>
      <actionsheet v-if="open != 'h5' && open != 'WeChat'" v-model='isShowSheet' :menus='sheetMenu' @on-click-menu='clickMenu' show-cancel></actionsheet>
      <actionsheet v-if="open != 'h5' && open != 'WeChat'" v-model='isShowSheet1' :menus='sheetMenu1' @on-click-menu='clickMenu' show-cancel></actionsheet>
      <input v-if="open == 'h5' && open != 'WeChat'" class="idcard-file" type="file" capture="camera" @change="upload">
    </div>
  </div>
</template>

<script>
import { Actionsheet } from 'vux'
export default {
  props: ['defaultImg', 'open', 'type', 'phototype'],
  data () {
    return {
      isShowSheet: false,
      sheetMenu: {
        camera: '拍照',
        photo: '相册'
      },
      isShowSheet1: false,
      sheetMenu1: {
        camera: '拍照'
      }
    }
  },
  components: {
    Actionsheet
  },
  methods: {
    upload (e) {
      const that = this
      that.$emit('upload', e.target.files[0])
    },
    showSheet () {
      const that = this
      if (that.phototype === '1' || that.phototype === 1) {
        that.isShowSheet1 = !that.isShowSheet1
      } else {
        that.isShowSheet = !that.isShowSheet
      }
    },
    clickMenu (key) {
      this.$emit('callApp', key)
    },
    callWx () { // 调用微信拍照或从手机相册中选图接口
      const that = this
      that.$emit('callWx', that.type)
    }
  }
}
</script>

<style lang="less" scoped>
  .uploader {
    position: relative;
    height: 6.08rem;
    padding-top: .48rem;
    width: 8.4rem;
  }
  .photo-uploader {
    position: relative;
    width: 8.4rem;
    height: 6.08rem;
    margin: 0 1.2rem;
    overflow: hidden;
    border-radius: 8px;
    .uploader-img {
      position: absolute;
      bottom: 0;
      width: 8.4rem;
      height: .96rem;
      line-height: .96rem;
      background-color: rgba(0, 0, 0, 0.3);
      text-align: center;
      color: #fff;
      font-size: .44rem;
    }
    .idcard-file {
      position: absolute;
      z-index: 1;
      top: 0;
      left: 0;
      width: 100%;
      height: 5.68rem;
      opacity: 0;
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    }
  }
</style>
