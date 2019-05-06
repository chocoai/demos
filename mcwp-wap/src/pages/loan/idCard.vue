<template>
  <div class="idcard-verify">
    <div class="clearfix upload-clear" v-if='showWx'>
      <!-- 身份证正面  -->
      <v-upload :defaultImg='frontImg' :type='"front"' :open='open' class="idcard-front" @upload='upload' @callApp='callApp' @callWx='callWx'></v-upload>
      <v-upload :defaultImg='backImg' :type='"back"' :open='open' class="idcard-back" @upload='upload' @callApp='callApp'  @callWx='callWx'></v-upload>
    </div>
    <v-button v-if='showWx' @next='nextStep'>下一步</v-button>
    <div v-if="type == 8 || type == 5" class="skip" @click="skip">跳过</div>
  </div>
</template>

<script>
  import Store from 'store'
  import EXIF from 'exif-js'
  import Config from '../../config/index'
  import VButton from './../../components/button'
  import Utils from '../../config/utils'
  import { getFiles, loanOcr, wxfilesUpload } from '../../service/getData'
  import Wxsdk from '../../config/wxJsSdk'
  import VUpload from './../../components/idCardUpload'
  import defaultFront from '../../assets/application-process_img_ID2.png'
  import defaultBack from '../../assets/application-process_img_ID1.png'
  import wx from 'weixin-js-sdk'
  export default {
    data () {
      return {
        defaultFront,
        defaultBack,
        minSize: 200 * 1024,
        loanCode: '',
        open: '',
        enterpriseCode: '',
        files: [],
        loanRoutes: [],
        pathIndex: '',
        initWx: false,
        showWx: !Utils.isWeixin(),
        getTime: new Date().getTime(),   // 时长统计
        type: this.$route.params.type   // 类型
      }
    },
    computed: {
      frontImg () {
        const that = this
        return that.files.length > 0 ? (that.files.filter((item, index) => (item.bizType === Config.constants.bizTypeFront)).length > 0 ? that.files.filter((item, index) => (item.bizType === Config.constants.bizTypeFront))[0].srcUrl : defaultFront) : defaultFront
      },
      backImg () {
        const that = this
        return that.files.length > 0 ? (that.files.filter((item, index) => (item.bizType === Config.constants.bizTypeBack)).length > 0 ? that.files.filter((item, index) => (item.bizType === Config.constants.bizTypeBack))[0].srcUrl : defaultBack) : defaultBack
      }
    },
    created () {
      const that = this
      that.$vux.loading.show()
      const cookies = Store.get(Config.constants.cookies)
      that.loanCode = cookies.loanCode
      that.open = Utils.isWeixin() ? 'WeChat' : cookies.open
      that.enterpriseCode = cookies.enterpriseCode
      that.loanRoutes = cookies.loanRoutes
      that.pathIndex = Utils.getIndex(that.loanRoutes, window.location.pathname)
      if (Utils.isWeixin()) {
        Wxsdk.wxImage(() => {
          that.showWx = true
          that.$vux.loading.hide()
          Wxsdk.wxImage(() => {})
        })
      }
    },
    mounted () {
      this.initData()
      Utils.countPlus('身份证OCR', 'send')
      if (Utils.isWeixin()) {
        Wxsdk.wxImage(() => {})
      }
    },
    methods: {
      async initData () {
        const that = this
        if (!that.loanCode) return
        that.getUploadFiles()
      },
      async nextStep () { // 下一步
        const that = this
        // 确保两张都上传
        if (that.files.length < 2) {
          return that.$vux.toast.text('请上传身份证')
        }
        that.$vux.loading.show({
          text: '正在进行OCR识别'
        })
        const res = await loanOcr({code: that.loanCode})
        if (res.code === Config.resCode.success) {
          that.skip()
        } else {
          that.$vux.loading.hide()
          that.$vux.toast.text(res.msg)
        }
      },
      skip () { // 跳过
        const that = this
        let loanRoutes = that.loanRoutes
        // let pathIndex = Utils.getIndex(loanRoutes, window.location.pathname)
        Utils.countPlus('页面停留时长', 'send', {'pageName': '身份证OCR', 'stayTime': new Date().getTime() - this.getTime})
        if (that.pathIndex > -1 && that.pathIndex !== loanRoutes.length - 1) {
          that.$router.push(loanRoutes[that.pathIndex + 1])
        } else {
          that.$vux.toast.text('进件失败')
          that.$router.push(Config.constants.confirmRouter)
        }
      },
      callApp (uploadType) {
        const that = this
        let bizType = null
        if (uploadType === 'front') {
          bizType = Config.constants.bizTypeFront
        } else if (uploadType === 'back') {
          bizType = Config.constants.bizTypeBack
        }
        window.zdb.tIDCard(that.loanCode, that.enterpriseCode, bizType)
        // APP回调
        window.tIDCard = function (obj) {
          if (obj.code === '0' || obj.code === 0) {
            that.$vux.loading.show({
              text: '正在加载'
            })
            that.getUploadFiles()
            // window.alert(JSON.stringify(obj))
          } else {
            alert(obj.msg)
          }
        }
      },
      callWx (uploadType) {
        const that = this
        // Wxsdk.wxImage((wx) => {
        wx.chooseImage({
          count: 1, // 默认9;
          sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
          success: function (res) {
            let localIds = res.localIds // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
            that.$vux.loading.show({
              text: '上传中'
            })
            setTimeout(() => (
              wx.uploadImage({
                localId: '' + localIds, // 需要上传的图片的本地ID，由chooseImage接口获得
                isShowProgressTips: 0, // 默认为1，显示进度提示
                success: function (res) {
                  let serverId = res.serverId // 返回图片的服务器端ID
                  let wxFilesParams = {
                    bizCode: that.loanCode,
                    mediaId: serverId
                  }
                  if (uploadType === 'front') {
                    wxFilesParams.bizType = Config.constants.bizTypeFront
                  } else if (uploadType === 'back') {
                    wxFilesParams.bizType = Config.constants.bizTypeBack
                  }
                  wxfilesUpload(wxFilesParams).then((res) => {
                    if (res.code === Config.resCode.success) {
                      that.getUploadFiles()
                    } else {
                      that.$vux.loading.hide()
                      that.$vux.toast.text(res.msg)
                    }
                  })
                },
                fail: function (res) {
                  Wxsdk.wxImage(() => {
                    that.$vux.loading.hide()
                    that.$vux.toast.text('上传失败，请重试')
                  })
                }
              })
            ), 100)
          },
          fail: function (res) {
            Wxsdk.wxImage(() => {
              that.$vux.loading.hide()
              that.$vux.toast.text('无法选择图片，请重试')
            })
          }
          // cancel: function (res) {
            // document.documentElement.scrollTop = document.body.scrollTop = 0
          // }
        })
        // })
      },
      upload (file, uploadType) { // 上传图片
        const that = this
        if (!file) return
        that.$vux.loading.show({
          text: '正在上传'
        })
        let orientation
        EXIF.getData(file, function () {
          orientation = EXIF.getTag(this, 'Orientation')
        })
        let reader = new FileReader()
        reader.onload = function () {
          Utils.getImgData(this.result, orientation, function (result) {
            let img = new Image()
            img.src = result
            // 如果图片大小小于200kb，则直接上传
            if (result.length <= that.minSize) {
              upload(result, file.type, file.name, 'front')
              img = null
              return
            }
            // 图片加载完毕之后进行压缩，然后上传
            if (img.complete) {
              callback()
            } else {
              img.onload = callback
            }
            function callback () {
              var data = Utils.compress(img)
              // 文件上传
              upload(data, file.type, file.name, 'front')
              img = null
            }
          })
        }
        reader.readAsDataURL(file)
        /**
         * 图片上传，将base64的图片转成二进制对象，塞进formdata上传
         * @param {*} basestr
         * @param {*} type
         */
        function upload (basestr, type, name, idcardType) {
          var text = window.atob(basestr.split(',')[1])
          var buffer = new Uint8Array(text.length)
          for (var i = 0; i < text.length; i++) {
            buffer[i] = text.charCodeAt(i)
          }
          var blob = Utils.getBlob([buffer], type)
          var xhr = new XMLHttpRequest()
          var formdata = Utils.getFormData()
          formdata.append('multipartFile', blob, name)
          formdata.append('loanCode', that.loanCode)
          if (uploadType === 'front') {
            formdata.append('bizType', Config.constants.bizTypeFront)
          } else if (uploadType === 'back') {
            formdata.append('bizType', Config.constants.bizTypeBack)
          }
          xhr.open('post', Config.target + '/comm/files/upload')
          xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
              var jsonData = JSON.parse(xhr.responseText)
              if (jsonData.code === Config.resCode.success) {
                that.getUploadFiles()
              } else {
                that.$vux.loading.hide()
                that.$vux.toast.text(jsonData.msg)
              }
            }

            if (xhr.status !== 200) {
              that.$vux.toast.text(Config.constants.systemError)
            }
          }
          xhr.send(formdata)
        }
      },
      getUploadFiles () {
        const that = this
        getFiles({bizCode: that.loanCode}).then(res => {
          // 如果不是微信，则隐藏
          if (!Utils.isWeixin()) that.$vux.loading.hide()
          // 微信，延迟消失
          if (Utils.isWeixin() && that.showWx) {
            setTimeout(() => (
              that.$vux.loading.hide()
            ), 500)
          }
          if (res.code === Config.resCode.success) {
            that.files = res.data
            // window.alert(JSON.stringify(res))
          } else {
            that.$vux.toast.text(res.msg)
          }
        })
      }
    },
    components: {
      VUpload,
      VButton
    }
  }
</script>

<style lang="less">
  .idcard-verify {
    background-color: #f5f5f5;
    position: relative;
    width: 10.8rem;
    margin: 0 auto;
    height: 100%;
    .idcard-front {
      margin: 0 1.65rem 0 1.65rem;
    }
    .idcard-back {
      margin: 1.6rem 1.65rem 0 1.65rem;
    }
    .upload-clear {
      padding-top: .8rem;
    }
    .skip {
      position: relative;
      margin: .7rem auto;
      font-size: .4rem;
      color: #369fff;
      overflow: hidden;
      width: 2rem;
      height: 1rem;
      line-height: 1rem;
      text-align: center;
      text-decoration: underline;
    }
}
</style>
