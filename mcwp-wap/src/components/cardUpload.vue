<template>
  <div class="upload">
    <div class="title">
      <p class='title-content'><slot>empty</slot></p>
      <p class='title-num'>{{urlLen > max ? max : urlLen}}/{{max || 10}}</p>
    </div>
    <div class='upload-container'>
      <div class='upload-target'>
        <img class="upload-default" :src='uploadDefault' />
        <img v-if="type != 'borrow'" class="upload-icon" src="./../assets/icon_add_default.png" />
        <actionsheet v-if="open != 'h5' && open != 'WeChat' && urlLen <= max" v-model='isShowSheet' :menus='sheetMenu' @on-click-menu='clickMenu' show-cancel></actionsheet>
        <input v-if="open == 'h5' && open != 'WeChat' && urlLen <= max" class="upload-input" type="file" @change="handleFiles">
        <div v-if="open != 'h5' && open != 'WeChat' && urlLen <= max" class="upload-input" @click="showSheet"></div>
        <div v-if="open == 'WeChat' && urlLen <= max" class="upload-input" @click="callWx"></div>
      </div>
      <!-- 临时处理方案，借款管理、房抵贷中使用 -->
      <div class="img-upload-container" :style="`width:${imgWidth ? imgWidth : '7.1rem'}`">
        <div class="upload-img" v-for="(item , index) in url" :key='index' >
          <img :src='item.srcUrl' />
          <img class="remove-icon" src="./../assets/icon_close_default.png" @click="removeImg(item.code)"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Actionsheet } from 'vux'
export default {
  props: ['url', 'type', 'open', 'max', 'imgWidth'],
  data () {
    return {
      isShowSheet: false,
      sheetMenu: {
        camera: '拍照',
        photo: '相册'
      }
    }
  },
  components: {
    Actionsheet
  },
  methods: {
    showSheet () {
      this.isShowSheet = !this.isShowSheet
    },
    handleFiles (e) {
      const that = this
      that.$emit('upload', e.target.files[0], that.type)
    },
    clickMenu (key) {
      const that = this
      that.$emit('callApp', key, that.type)
    },
    removeImg (code) {
      const that = this
      that.$emit('delFile', code)
    },
    callWx () { // 调用微信拍照或从手机相册中选图接口
      const that = this
      that.$emit('callWx', that.type)
    }
  },
  computed: {
    // 行驶证照片张数
    urlLen () {
      return (this.url && this.url.length) || 0
    },
    uploadDefault () {
      const that = this
      if (that.type === 'hright') return require('./../assets/img_hright.png')
      if (that.type === 'driv') return require('./../assets/img_driv.png')
      if (that.type === 'borrow') return require('./../assets/btn_add_pic.png')
      return require('./../assets/img_policy.png')
    }
  }
}
</script>

<style lang="less" scoped>
.upload {
  .title {
    height: .88rem;
    line-height: .88rem;
    margin: .24rem 0 0;
    text-align: right;
  }
  .title-content {
    font-size: .4rem;
    color: #333;
    float: left;
  }
  .title-num {
    font-size: .36rem;
    color: #666;
  }
  .upload-container {
    padding: .24rem 0 0;
    overflow: hidden;
  }
  .upload-target {
    position: relative;
    float: left;
    margin-right: .08rem;
    width: 2.64rem;
    height: 2.64rem;
  }
  .upload-default {
    width: 100%;
    height: 100%;
  }
  .upload-icon {
    position: absolute;
    left: 50%;
    top: 50%;
    width: .96rem;
    height: .96rem;
    margin-top: -.48rem;
    margin-left: -.48rem;
  }
  .upload-input {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    z-index: 100;
  }
  .img-upload-container {
    float: left;
    // width: 7.1rem;
    height: 2.64rem;
    line-height: 2.64rem;
    white-space: nowrap;
    overflow-x: auto;
    overflow-y: hidden;
  }
  .upload-img {
    position: relative;
    display: inline-block;
    width: 2.64rem;
    height: 2.64rem;
    img {
      width: 100%;
      height: 100%;
      display: block;
    }
    .remove-icon {
      position: absolute;
      top: 0;
      width: .56rem;
      height: .56rem;
      padding: .08rem;
      right: 0;
    }
  }
  .upload-img + .upload-img {
      padding-left: .08rem;
  }
}
</style>
