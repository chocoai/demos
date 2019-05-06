<template>
  <div class='house-container'>
    <v-upload :url = 'houseRightsUrl' :type='"hright"' @upload='upload' :phototype='"2"' :open='open' @callApp='callApp' @delFile='delFile' @callWx='callWx'>房产证</v-upload>
    <div class='house-detail'>
    <p class='house-location'>{{houseInfo && houseInfo.houseAddress}}</p>
    <p class='house-worth'>房屋估值<span class='house-value'>{{(houseInfo && houseInfo.houseTotal) || 0}}万元</span></p>
    <p class='house-worth'>最高贷款额度<span class='house-value'>{{(houseInfo && houseInfo.topLoanAmount) || 0}}万元</span></p>
    </div>
    <v-button url='/loan/contact' @next='next'>我要贷款</v-button>
  </div>
</template>

<script>
import EXIF from 'exif-js'
import Store from 'store'
import VUpload from './../../components/cardUpload'
import VButton from './../../components/button'
import Config from '../../config/index'
import Utils from '../../config/utils'
import { getAssetHouse, delFile, wxfilesUpload } from '../../service/getData'
import Wxsdk from '../../config/wxJsSdk'
import { Toast } from 'vux'
export default {
  components: {
    Toast,
    VButton,
    VUpload
  },
  data () {
    return {
      houseRightsUrl: [],
      houseInfo: '',
      loanCode: '',
      enterpriseCode: '',
      loanRoutes: [],
      getTime: new Date().getTime()   // 时长统计
    }
  },
  created () {
    const that = this
    const cookies = Store.get(Config.constants.cookies)
    that.loanCode = cookies.loanCode
    that.open = Utils.isWeixin() ? 'WeChat' : cookies.open
    that.loanRoutes = cookies.loanRoutes
    that.enterpriseCode = cookies.enterpriseCode
  },
  mounted () {
    const that = this
    const params = {
      code: that.loanCode
    }
    that.$vux.loading.show({
      text: '正在加载'
    })
    if (!that.loanCode) return
    that.goAssetHouse(params)
    Utils.countPlus('房屋信息', 'send')
  },
  methods: {
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
          that.goAssetHouse({code: that.loanCode})
        } else {
          that.$vux.loading.hide()
          that.$vux.toast.text(res.msg)
        }
      })
    },
    callApp (type, uploadType) {
      const that = this
      let bizType = null
      if (uploadType === 'hright') {
        bizType = Config.constants.houseRight
      }
      if (type === 'camera') {
        window.zdb.tCamera(that.loanCode, that.enterpriseCode, bizType, 0)
        window.tCamera = function (obj) {
          if (obj.code === '0' || obj.code === 0) {
            that.$vux.loading.show({
              text: '正在加载'
            })
            that.goAssetHouse({code: that.loanCode})
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
            that.goAssetHouse({code: that.loanCode})
          } else {
            alert(obj.msg)
          }
        }
      }
    },
    next () {
      const that = this
      if (that.houseRightsUrl.length === 0) {
        return that.$vux.toast.text('房贷必须上传一张房产证')
      }
      let loanRoutes = that.loanRoutes
      let pathIndex = Utils.getIndex(loanRoutes, Config.constants.houseEvaRouter)
      Utils.countPlus('页面停留时长', 'send', {'pageName': '房屋信息', 'stayTime': new Date().getTime() - this.getTime})
      if (pathIndex > -1 && pathIndex !== loanRoutes.length - 1) {
        that.$router.push(loanRoutes[pathIndex + 1])
      } else {
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
                if (uploadType === 'hright') {
                  wxFilesParams.bizType = Config.constants.houseRight
                }
                wxfilesUpload(wxFilesParams).then((result) => {
                  if (result.code === Config.resCode.success) {
                    const params = {
                      code: that.loanCode
                    }
                    that.goAssetHouse(params)
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
        if (uploadType === 'hright') {
          formdata.append('bizType', Config.constants.houseRight)
        }
        xhr.open('post', Config.target + '/comm/files/upload')
        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4 && xhr.status === 200) {
            var jsonData = JSON.parse(xhr.responseText)
            const params = {
              code: that.loanCode
            }
            if (jsonData.code === Config.resCode.success) {
              that.goAssetHouse(params)
            } else if (jsonData.code === 'HOUSE_NO_VALUE') {
              that.goAssetHouse(params)
              that.$vux.loading.hide()
              that.$vux.toast.text(jsonData.msg)
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
    goAssetHouse (params) {
      const that = this
      getAssetHouse(params).then(res => {
        that.$vux.loading.hide()
        if (res.code === Config.resCode.success) {
          that.houseInfo = res.data
          res.data && res.data.houseRightsUrl && res.data.houseRightsUrl.length ? that.houseRightsUrl = res.data.houseRightsUrl : that.houseRightsUrl = []
        } else {
          that.$vux.toast.text(res.msg)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.tangram-suggestion-main {
  display: block !important;
}
.house-container {
  background-color: #fff;
  padding-bottom: 1rem;
  height: 100%;
  color: #333;
  &::before {
    content: '';
    display: table;
  }
  .house-detail {
    padding-left: .48rem;
  }
  .house-location {
    height: 1.24rem;
    line-height: 1.24rem;
    font-size: .44rem;
  }
  .house-worth {
    width: 5rem;
    height: .88rem;
    line-height: .88rem;
    font-size: .4rem;
  }
  .house-value {
    float: right;
    color: #ff9a4a;
  }
}
</style>
