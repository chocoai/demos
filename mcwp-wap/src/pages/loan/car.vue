<template>
  <div class='car-container'>
    <v-upload :url = 'drivingLicenseUrl' :type='"driv"' @upload='upload' :phototype='"2"' :open='open' @callApp='callApp' @delFile='delFile' @callWx='callWx'>行驶证</v-upload>
    <v-upload :url = 'warrantyUrl' :type='"policy"' @upload='upload' :phototype='"2"' :open='open' @callApp='callApp' @delFile='delFile' @callWx='callWx'>最近保单</v-upload>
    <div class='car-select'>
      <group>
        <popup-picker placeholder='请选择' title="车辆品牌/款型" :data="carList" :columns="2" v-model="selectValue" ref="picker" show-name></popup-picker>
      </group>
    </div>
    <v-button url='/loan/contact' @next='next'>下一步</v-button>
  </div>
</template>

<script>
import EXIF from 'exif-js'
import Store from 'store'
import VUpload from './../../components/cardUpload'
import VButton from './../../components/button'
import Config from '../../config/index'
import Utils from '../../config/utils'
import { getCarInfo, postCarInfo, getDictValueAll, delFile, wxfilesUpload } from '../../service/getData'
import Wxsdk from '../../config/wxJsSdk'
import { PopupPicker, Group, Toast } from 'vux'
export default {
  components: {
    Toast,
    VButton,
    VUpload,
    PopupPicker,
    Group
  },
  data () {
    return {
      drivingLicenseUrl: [],
      warrantyUrl: [],
      carData: '',
      selectValue: [],
      carList: [],
      loanCode: '',
      open: '',
      enterpriseCode: '',
      loanRoutes: [],
      getTime: new Date().getTime()   // 时长统计
    }
  },
  computed: {
    brandText () {
      return this.carList.filter((item, index) => (item.value === this.selectValue[0]))[0]
    },
    carModalText () {
      return this.carList.filter((item, index) => (item.value === this.selectValue[1]))[0]
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
    if (!that.loanCode) return
    Promise.all([
      getCarInfo(params),
      getDictValueAll({code: 'cars'})
    ]).then(res => {
      that.$vux.loading.hide()
      if (res[0].code === Config.resCode.success) {
        res[0].data && res[0].data.drivingLicenseUrl && res[0].data.drivingLicenseUrl.length ? that.drivingLicenseUrl = res[0].data.drivingLicenseUrl : that.drivingLicenseUrl = []
        res[0].data && res[0].data.warrantyUrl && res[0].data.warrantyUrl.length ? that.warrantyUrl = res[0].data.warrantyUrl : that.warrantyUrl = []
      }
      if (res[1].code === Config.resCode.success) {
        if (res[1].data && res[1].data.cars) {
          let midCars = []
          res[1].data.cars.forEach((item, index) => {
            that.carList.push({
              value: item.ddValue,
              name: item.ddText,
              parent: item.parentValue
            })
            if (res[0].data && item.ddText === res[0].data.brand) midCars[0] = item.ddValue
            if (res[0].data && item.ddText === res[0].data.carModel) midCars[1] = item.ddValue
          })
          that.selectValue = midCars
        }
      }
    })
    Utils.countPlus('车辆信息', 'send')
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
          that.goCarInfo()
        } else {
          that.$vux.loading.hide()
          that.$vux.toast.text(res.msg)
        }
      })
    },
    goCarInfo () {
      const that = this
      const params = {
        code: that.loanCode
      }
      getCarInfo(params).then(res => {
        that.$vux.loading.hide()
        if (res.code === Config.resCode.success) {
          res.data && res.data.drivingLicenseUrl && res.data.drivingLicenseUrl.length ? that.drivingLicenseUrl = res.data.drivingLicenseUrl : that.drivingLicenseUrl = []
          res.data && res.data.warrantyUrl && res.data.warrantyUrl.length ? that.warrantyUrl = res.data.warrantyUrl : that.warrantyUrl = []
        } else {
          that.$vux.toast.text(res.msg)
        }
      })
    },
    callApp (type, uploadType) {
      const that = this
      let bizType = null
      if (uploadType === 'driv') {
        bizType = Config.constants.carDrivinglic
      } else if (uploadType === 'policy') {
        bizType = Config.constants.carPolicy
      }
      if (type === 'camera') {
        window.zdb.tCamera(that.loanCode, that.enterpriseCode, bizType, 0)
        window.tCamera = function (obj) {
          if (obj.code === '0' || obj.code === 0) {
            that.$vux.loading.show({
              text: '正在加载'
            })
            that.goCarInfo()
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
            that.goCarInfo()
          } else {
            alert(obj.msg)
          }
        }
      }
    },
    next () {
      const that = this
      if (that.drivingLicenseUrl.length === 0) {
        return that.$vux.toast.text('车贷必须上传一张行驶证')
      }
      if (!that.brandText || !that.carModalText) {
        return that.$vux.toast.text(Config.constants.nullCarBrand)
      }
      let params = {
        reqCode: that.loanCode,
        brand: that.brandText.name,
        carModel: that.carModalText.name
      }
      that.$vux.loading.show({
        text: '正在加载'
      })
      postCarInfo(params).then(res => {
        if (res.code === Config.resCode.success) {
          let loanRoutes = that.loanRoutes
          let pathIndex = Utils.getIndex(loanRoutes, window.location.pathname)
          Utils.countPlus('页面停留时长', 'send', {'pageName': '车辆信息', 'stayTime': new Date().getTime() - this.getTime})
          if (pathIndex > -1 && pathIndex !== loanRoutes.length - 1) {
            that.$router.push(loanRoutes[pathIndex + 1])
          } else {
            that.$router.push(Config.constants.confirmRouter)
          }
        } else {
          that.$vux.loading.hide()
          that.$vux.toast.text(res.msg)
        }
      })
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
                if (uploadType === 'driv') {
                  wxFilesParams.bizType = Config.constants.carDrivinglic
                } else if (uploadType === 'policy') {
                  wxFilesParams.bizType = Config.constants.carPolicy
                }
                wxfilesUpload(wxFilesParams).then((result) => {
                  if (result.code === Config.resCode.success) {
                    const params = {
                      code: that.loanCode
                    }
                    getCarInfo(params).then(res => {
                      that.$vux.loading.hide()
                      if (res.code === Config.resCode.success) {
                        res.data && res.data.drivingLicenseUrl && res.data.drivingLicenseUrl.length ? that.drivingLicenseUrl = res.data.drivingLicenseUrl : null
                        res.data && res.data.warrantyUrl && res.data.warrantyUrl.length ? that.warrantyUrl = res.data.warrantyUrl : null
                      } else {
                        that.$vux.toast.text(res.msg)
                      }
                    })
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
        if (uploadType === 'driv') {
          formdata.append('bizType', Config.constants.carDrivinglic)
        } else if (uploadType === 'policy') {
          formdata.append('bizType', Config.constants.carPolicy)
        }
        xhr.open('post', Config.target + '/comm/files/upload')
        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4 && xhr.status === 200) {
            var jsonData = JSON.parse(xhr.responseText)
            if (jsonData.code === Config.resCode.success) {
              const params = {
                code: that.loanCode
              }
              getCarInfo(params).then(res => {
                that.$vux.loading.hide()
                if (res.code === Config.resCode.success) {
                  res.data && res.data.drivingLicenseUrl && res.data.drivingLicenseUrl.length ? that.drivingLicenseUrl = res.data.drivingLicenseUrl : null
                  res.data && res.data.warrantyUrl && res.data.warrantyUrl.length ? that.warrantyUrl = res.data.warrantyUrl : null
                } else {
                  that.$vux.toast.text(res.msg)
                }
              })
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
.car-container {
  background-color: #fff;
  padding-bottom: 1rem;
  &::before {
    content: '';
    display: table;
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
