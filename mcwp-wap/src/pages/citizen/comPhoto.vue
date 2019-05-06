<template>
  <div class='cert-container'>
    <p class="more-tips">填写更多信息，有助于提高您的贷款通过率</p>
    <v-upload v-for="(item, index) in config" :key="index" :url="item.url" :type="item.type" @upload='upload' :phototype='"2"' :open='open' :max='"5"' @callApp='callApp' @delFile='delFile' @callWx='callWx'>{{item.text}}</v-upload>
    <v-button url='/loan/contact' @next='next'>下一步</v-button>
    <!-- <div class="skip" @click="skip">跳过</div> -->
  </div>
</template>

<script>
import EXIF from 'exif-js'
import Store from 'store'
import VUpload from './../../components/cardUpload'
import VButton from './../../components/button'
import Config from '../../config/index'
import Utils from '../../config/utils'
import { delFile, wxfilesUpload, getLoanFiles } from '../../service/getData'
import Wxsdk from '../../config/wxJsSdk'
import { Group, Toast } from 'vux'
export default {
  components: {
    Toast,
    VButton,
    VUpload,
    Group
  },
  data () {
    return {
      config: [],
      loanCode: '',
      open: '',
      maritalStatus: '',
      enterpriseCode: '',
      loanRoutes: [],
      // loanType: this.$route.params.type,
      getTime: new Date().getTime()   // 时长统计
    }
  },
  computed: { },
  created () {
    const that = this
    const cookies = Store.get(Config.constants.cookies)
    that.loanCode = cookies.loanCode
    that.open = Utils.isWeixin() ? 'WeChat' : cookies.open
    that.loanRoutes = cookies.loanRoutes
    that.pathIndex = Utils.getIndex(that.loanRoutes, window.location.pathname)
    that.enterpriseCode = cookies.enterpriseCode
    that.maritalStatus = cookies.maritalStatus
    // if (Utils.isWeixin()) {
    //   Wxsdk.wxImage(() => {
    //     // that.showWx = true
    //     // that.$vux.loading.hide()
    //   })
    // }
  },
  mounted () {
    const that = this
    const params = {
      reqCode: that.loanCode
    }
    if (!that.loanCode) return
    that.getLoanFiles(params)
    Utils.countPlus('房抵贷照片信息', 'send')
  },
  methods: {
    async getLoanFiles () {
      const that = this
      let params = {reqCode: that.loanCode, fileType: Array.from(that.config, i => i.bizType)}
      const res = await getLoanFiles(params)
      that.$vux.loading.hide()
      if (res.code === Config.resCode.success) {
        that.config.map(i => {
          i.url = (res.data && res.data[i.bizType] && [].concat(res.data[i.bizType])) || []
          return i
        })
      } else {
        that.$vux.toast.text(res.msg)
      }
    },
    delFile (code) {
      const that = this
      const param = {
        loanCode: that.loanCode,
        codes: code
      }
      that.$vux.loading.show({
        text: '请稍候...'
      })
      delFile(param).then(res => {
        if (res.code === Config.resCode.success) {
          that.getLoanFiles()
        } else {
          that.$vux.loading.hide()
          that.$vux.toast.text(res.msg)
        }
      })
    },
    callApp (type, uploadType) {
      const that = this
      let bizType = null
      that.config.map(i => {
        if (i.type === uploadType) {
          bizType = i.bizType
        }
        return i
      })
      if (type === 'camera') {
        window.zdb.tCamera(that.loanCode, that.enterpriseCode, bizType, 0)
        window.tCamera = function (obj) {
          if (obj.code === '0' || obj.code === 0) {
            that.$vux.loading.show({
              text: '正在加载'
            })
            that.getLoanFiles()
          } else {
            alert(obj.msg)
          }
        }
      } else if (type === 'photo') {
        window.zdb.tPhoto(that.loanCode, that.enterpriseCode, bizType)
        window.tPhoto = function (obj) {
          if (obj.code === '0' || obj.code === 0) {
            that.$vux.loading.show({
              text: '正在加载'
            })
            that.getLoanFiles()
          } else {
            alert(obj.msg)
          }
        }
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
        // 此处暂无其他页面跳转
        // that.$router.push(Config.constants.confirmRouter)
      }
    },
    next () {
      const that = this
      for (let i = 0; i < that.config.length; i++) {
        if (that.config[i].required && that.config[i].url.length === 0) return that.$vux.toast.text(that.config[i].warn)
      }
      // if (that.paperUrl.length === 0) return that.$vux.toast.text('请上传房产证号页')
      // if (that.locatedUrl.length === 0) return that.$vux.toast.text('请上传坐落页')
      // if (that.registerUrl.length === 0) return that.$vux.toast.text('请上传房产登记表页')
      that.$vux.loading.show({
        text: '正在加载'
      })
      let loanRoutes = that.loanRoutes
      let pathIndex = Utils.getIndex(loanRoutes, window.location.pathname)
      Utils.countPlus('页面停留时长', 'send', {'pageName': '房抵贷照片信息', 'stayTime': new Date().getTime() - this.getTime})
      if (pathIndex > -1 && pathIndex !== loanRoutes.length - 1) {
        that.$router.push(loanRoutes[pathIndex + 1])
        that.$vux.loading.hide()
      } else {
        that.$vux.loading.hide()
        that.$router.push(Config.constants.confirmRouter)
      }
    },
    callWx (uploadType) {
      const that = this
      Wxsdk.wxImage((wx) => {
        wx.chooseImage({
          count: 1, // 默认9
          sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
          success: function (res) {
            let localIds = res.localIds // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
            wx.uploadImage({
              localId: '' + localIds, // 需要上传的图片的本地ID，由chooseImage接口获得
              isShowProgressTips: 1, // 默认为1，显示进度提示
              success: function (res) {
                let serverId = res.serverId // 返回图片的服务器端ID
                let wxFilesParams = {
                  bizCode: that.loanCode,
                  mediaId: serverId
                }
                that.config.map(i => {
                  if (i.type === uploadType) {
                    wxFilesParams.bizType = i.bizType
                  }
                  return i
                })
                wxfilesUpload(wxFilesParams).then((result) => {
                  if (result.code === Config.resCode.success) {
                    that.getLoanFiles()
                  } else {
                    that.$vux.toast.text(result.msg)
                  }
                })
              }
            })
          }
        })
      })
    },
    upload (file, uploadType) { // 上传图片
      const that = this
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
            upload(result, file.type, file.name)
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
            upload(data, file.type, file.name)
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
      function upload (basestr, type, filename) {
        var text = window.atob(basestr.split(',')[1])
        var buffer = new Uint8Array(text.length)
        for (var i = 0; i < text.length; i++) {
          buffer[i] = text.charCodeAt(i)
        }
        var blob = Utils.getBlob([buffer], type)
        var xhr = new XMLHttpRequest()
        var formdata = Utils.getFormData()
        formdata.append('multipartFile', blob, filename)
        formdata.append('loanCode', that.loanCode)
        that.config.map(i => {
          if (i.type === uploadType) {
            formdata.append('bizType', i.bizType)
          }
          return i
        })
        xhr.open('post', Config.target + '/comm/files/upload')
        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4 && xhr.status === 200) {
            var jsonData = JSON.parse(xhr.responseText)
            if (jsonData.code === Config.resCode.success) {
              that.getLoanFiles()
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
    }
  }
}
</script>

<style lang="less">
.cert-container {
  background-color: #fff;
  padding: 0 .48rem;
  min-height: 100vh;
  &::before {
    content: '';
    display: table;
  }
  .more-tips{
    width: 10.8rem;
    height: 1.04rem;
    background: #f2f9ff;
    line-height: 1.04rem;
    font-size: .36rem;
    color: #218beb;
    padding-left: 1.36rem;
    position: relative;
    left: -.48rem;
  }
  .more-tips::before{
    content: "";
    position: absolute;
    width: .48rem;
    height: .48rem;
    background: url(../../assets/icon_prompt.png) no-repeat;
    background-size: cover;
    top: .22rem;
    left: .64rem;
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
  //vux选择器样式修改
  .weui-cells {
    font-size: .42rem;
  }
  .weui-cells:before {
    border-top: none;
  }
  .weui-cells:after {
    border-bottom: none;
  }
  .vux-cell-box:before {
    border-top: none;
  }
}
</style>
