<template>
  <div class="application-download">
    <img class="download-logo" src="../../assets/img_default_logo_new.png" />
    <img class="download-title" src="../../assets/logo-title_new.png" />
    <div class="download-content">
      <div class="content-container content-left">
        <a v-if='device==2' class="content-p" :href='downloadUrl'>App Store</a>
        <p v-if='device==1' class="content-p">App Store</p>
      </div>
      <div class="content-container content-right">
        <p v-if='device==1 && isWeixin' class="content-p" @click="showTip = true">Android</p>
        <a v-if='device==1 && !isWeixin' class="content-p" :href='downloadUrl'>Android</a>
        <p v-if='device==2' class="content-p">Android</p>
        <!-- <p v-if='device==2 || isWeixin' class="content-p" @click="showAlert">Android</p> -->
      </div>
    </div>
    <img class="download-bg" src="../../assets/download-bg.png" />
    <v-share v-if="showTip" @hide="showTip=false" :type="type"></v-share>
  </div>
</template>

<script>
import { Alert } from 'vux'
import { getVersion } from '../../service/getData'
import utils from '../../config/utils'
import Config from '../../config/index'
import VShare from '../../components/share'

export default {
  components: {
    VShare,
    Alert
  },
  data () {
    return {
      downloadUrl: '',
      device: '',
      isWeixin: '',
      androidLink: '',
      type: 'download',
      showTip: false
    }
  },
  mounted () {
    let params = {
      version: 0
    }
    this.isWeixin = utils.isWeixin()
    console.log(this.isWeixin)
    let u = navigator.userAgent
    if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {
      params.device = 'Android'
      this.device = 1
    } else if (u.indexOf('iPhone') > -1) {
      params.device = 'iOS'
      this.device = 2
    }
    if (this.device === 1) {
      this.getDownLink({version: '1', device: 'Android'})
      // this.downloadUrl = 'http://pfile.zhudb.com/apk/app-1.6.0.apk'
    } else if (this.device === 2) {
      this.getDownLink({version: '1', device: 'iOS'})
      // this.downloadUrl = 'https://itunes.apple.com/cn/app/%E9%92%B1%E8%A2%8B%E9%87%91%E8%9E%8D/id1256303619?l=en&mt=8'
    }
    // getVersion(params).then((res) => {
    //   if (+res.code === 0) {
    //     this.downloadUrl = res.data && res.data.versionUrl
    //   } else {
    //     this.$vux.toast.text(res.msg)
    //   }
    // })
  },
  methods: {
    showAlert () { // 是否弹出提示框
      console.log(this.isWeixin)
      if (this.isWeixin && this.device) {
        this.$vux.alert.show({
          title: '微信暂不支持下载，请在浏览器中打开',
          onShow () {
            console.log('Plugin: I\'m showing')
          },
          onHide () {
            console.log('Plugin: I\'m hiding now')
          }
        })
      }
    },
    async getDownLink (params) {
      const that = this
      const res = await getVersion(params)
      if (res.code === Config.resCode.success) {
        that.downloadUrl = res.data.versionUrl
      } else {
        that.$vux.toast.text(res.msg)
      }
    }
    // showDownTip () {
    //   if (this.isWeixin) {
    //     this.showTip = true
    //   }
    // }
  },
  created () {
  }
}
</script>

<style lang="less" scoped>
  .application-download{
    text-align: center;
    padding: 0.72rem .64rem;
    background: #fafafa;
    .download-logo{
      width: 2.88rem;
      height: 2.88rem;
      display: block;
      margin: 0 auto;
    }
    .download-title{
      // width: 2.7rem;
      height: 0.64rem;
      display: block;
      margin: 0 auto;
      margin-top: .4rem;
    }
    .download-content{
      overflow: hidden;
      margin: 1.2rem 0 1.12rem;
      text-align: left;
    }
    .content-container{
      width: 4.44rem;
      height: 1.44rem;
      border-radius: .72rem;
      float: left;
      line-height: 1.44rem;
    }
    .content-left{
      background: #444;
      .content-p{
        background: url(../../assets/ios_icon.png) no-repeat .5rem .4rem;
        background-size: .54rem .64rem;
        padding-left: 1.46rem;
      }
    }
    .content-left:active{
      background: #363636;
    }
    .content-right{
      background: #368bff;
      margin-left: .64rem;
      .content-p{
        background: url(../../assets/Android_icon.png) no-repeat .76rem .4rem;
        background-size: .60rem .64rem;
        padding-left: 1.68rem;
      }
    }
    .content-right:active{
      background: #308fe5;
    }
    .content-p{
      font-size: .48rem;
      color: #fff;
      font-weight: bold;
      display: block;
    }
    .download-bg{
      width: 9rem;
      height: 8.58rem;
    }
  }
</style>
