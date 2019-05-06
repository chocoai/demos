<template>
  <div class="userinfo" v-if='showWx'>
    <div v-if="prdType !== 8 && prdType !== 5 && prdType !== 6" class="uploader-container">
      <v-upload @upload='upload' :defaultImg='defaultImg' :phototype='"1"' :open='open' @callApp='callApp' @callWx='callWx' ></v-upload>
    </div>
    <div v-if="prdType !== 8 && prdType !== 5 && prdType !== 6" class="userinfo-tip">
      <p>请正对手机，保持光线充足，脸部清晰无遮挡</p>
      <p>请勿逆光和手持身份证拍照</p>
    </div>
    <ul class="userinfo-ul">
      <li class='userinfo-detail-content'>
        <p class='userinfo-detail-item'>姓名</p>
        <input class='userinfo-detail-input' type="text" placeholder='请输入姓名' v-model="cname" />
      </li>
      <li class='userinfo-detail-content'>

      </li>
      <li class='userinfo-detail-content'>
        <p class='userinfo-detail-item'>身份证号</p>
        <input class='userinfo-detail-input' type="text" placeholder='请输入身份证号' v-model="idCardNo" maxlength="18" >
      </li>
      <li class='userinfo-detail-content'>
        <p class='userinfo-detail-item'>住址</p>
        <textarea class='userinfo-detail-textarea' ref="textarea" type="text" placeholder='请输入详细住址' v-model="idCardAddr" @input="calcHeight" />
      </li>
    </ul>
    <v-button @next='nextStep'>下一步</v-button>
  </div>
</template>

<script>
  import EXIF from 'exif-js'
  import Store from 'store'
  import VButton from './../../components/button'
  import Config from '../../config/index'
  import Utils from '../../config/utils'
  import VUpload from './../../components/photoUpload'
  import { getLoanCustomer, putLoanCustomer, wxfilesUpload } from '../../service/getData'
  import Wxsdk from '../../config/wxJsSdk'
  import wx from 'weixin-js-sdk'
  import defaultImg from '../../assets/application-process_photo.png'
  import { PopupPicker, Group } from 'vux'
  export default {
    components: {
      // Actionsheet,
      VButton,
      PopupPicker,
      Group,
      VUpload
    },
    data () {
      return {
        cname: '',
        idCardNo: '',
        idCardAddr: '',
        loanCode: '',
        sexPicker: [],
        loanRoutes: [],
        open: '',
        prdType: '',
        defaultImg,
        listData: [{
          name: '男',
          value: '男',
          parent: 0
        }, {
          name: '女',
          value: '女',
          parent: 0
        }],
        showWx: !Utils.isWeixin(),
        pathIndex: '',
        getTime: new Date().getTime(),   // 时长统计
        type: this.$route.params.type,   // 类型
        // sourceType: Utils.isAndroidWeChat() ? ['album', 'camera'] : ['camera']    // 解决android拍照崩溃
        sourceType: ['camera'] // 测试
      }
    },
    created () {
      const that = this
      that.$vux.loading.show()
      const cookies = Store.get(Config.constants.cookies)
      that.loanCode = cookies.loanCode
      that.open = Utils.isWeixin() ? 'WeChat' : cookies.open
      that.prdType = cookies.prdType
      that.enterpriseCode = cookies.enterpriseCode
      that.loanRoutes = cookies.loanRoutes
      that.pathIndex = Utils.getIndex(that.loanRoutes, window.location.pathname)
      if (Utils.isWeixin()) {
        Wxsdk.wxImage(() => {
          that.showWx = true
          that.$vux.loading.hide()
        })
      }
    },
    mounted () {
      const that = this
      if (!that.loanCode) return
      that.getLCustomer()
      Utils.countPlus('身份核实', 'send')
    },
    methods: {
      async nextStep () { // 下一步
        const that = this
        const cname = Utils.trimSides(that.cname)
        if (that.defaultImg.indexOf('http') === -1 && this.prdType !== 8 && this.prdType !== 5 && this.prdType !== 6) return that.$vux.toast.text('请点击拍照')
        if (!cname) return that.$vux.toast.text(Config.constants.nullCname)
        if (cname.length > 25 || cname.length < 0) return that.$vux.toast.text('姓名个数必须在0和25之间')
        // const sex = that.sexPicker[0]
        // if (!sex) return that.$vux.toast.text(Config.constants.nullSex)
        const idCardNo = that.idCardNo
        if (!idCardNo) return that.$vux.toast.text(Config.constants.nullIdcardNo)
        if (!Utils.isIdCardNo(idCardNo)) return that.$vux.toast.text(Config.constants.errorIdcardNo)
        const idCardAddr = that.idCardAddr
        if (!idCardAddr && that.prdType !== 8) return that.$vux.toast.text(Config.constants.nullIdcardAddr)
        const customerParams = {
          reqCode: that.loanCode,
          cname: cname,
          // sex: sex,
          idCardNo: idCardNo,
          idCardAddr: idCardAddr
        }
        that.$vux.loading.show({
          text: '请稍候...'
        })
        const res = await putLoanCustomer(customerParams)
        that.$vux.loading.hide()
        if (res.code === Config.resCode.success) {
          let loanRoutes = that.loanRoutes
          // let pathIndex = Utils.getIndex(loanRoutes, window.location.pathname)
          Utils.countPlus('页面停留时长', 'send', {'pageName': '身份核实', 'stayTime': new Date().getTime() - this.getTime})
          if (that.pathIndex > -1 && that.pathIndex !== loanRoutes.length - 1) {
            that.$router.push(loanRoutes[that.pathIndex + 1])
          } else {
            that.$vux.toast.text('进件失败')
            that.$router.push(Config.constants.confirmRouter)
          }
        } else if (res.code === Config.resCode.identityRefuse) {
          that.$router.push(Config.constants.loanRefuseRouter)
        } else {
          that.$vux.toast.text(res.msg)
        }
      },
      calcHeight () {
        this.$refs.textarea.style.height = '.46rem'
        this.$refs.textarea.style.height = `${this.$refs.textarea.scrollHeight}px`
      },
      callWx (uploadType) {
        const that = this
        // Wxsdk.wxImage((wx) => {
        wx.chooseImage({
          count: 1, // 默认9
          sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: that.sourceType, // 可以指定来源是相册还是相机，默认二者都有
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
                    mediaId: serverId,
                    bizType: Config.constants.bizTypeFace
                  }
                  wxfilesUpload(wxFilesParams).then((res) => {
                    if (res.code === Config.resCode.success) {
                      that.getLCustomer()
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
        })
        // })
      },
      upload (file, uploadType) { // 上传图片
        this.showActionsheet = true
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
              upload(result, file.type, 'front', file.name)
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
              upload(data, file.type, 'front', file.name)
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
        function upload (basestr, type, idcardType, filename) {
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
          formdata.append('bizType', Config.constants.bizTypeFace)
          xhr.open('post', Config.target + '/comm/files/upload')
          xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
              var jsonData = JSON.parse(xhr.responseText)
              if (jsonData.code === Config.resCode.success) {
                that.getLCustomer()
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
      callApp (type) {
        const that = this
        if (type === 'camera') {
          window.zdb.tCamera(that.loanCode, that.enterpriseCode, Config.constants.bizTypeFace, 1)
          window.tCamera = function (obj) {
            if (obj.code === '0' || obj.code === 0) {
              that.getLCustomer()
            } else {
              alert(obj.msg)
            }
          }
        } else if (type === 'photo') {
          window.zdb.tPhoto(that.loanCode, that.enterpriseCode, Config.constants.bizTypeFace)
          window.tPhoto = function (obj) {
            if (obj.code === '0' || obj.code === 0) {
              that.getLCustomer()
            } else {
              alert(obj.msg)
            }
          }
        }
      },
      getLCustomer () {
        const that = this
        // style: 'image/resize,m_fixed,w_840,h_560'
        getLoanCustomer({code: that.loanCode}).then(res => {
          // 如果不是微信，则隐藏
          if (!Utils.isWeixin()) that.$vux.loading.hide()
          // 微信，延迟消失
          if (Utils.isWeixin() && that.showWx) {
            setTimeout(() => (
              that.$vux.loading.hide()
            ), 500)
          }
          if (res.code === Config.resCode.success) {
            const data = res.data
            if (!data) return
            that.cname = that.cname || data.cname
            if (data.sex) that.sexPicker = [data.sex]
            that.idCardNo = that.idCardNo || data.idCardNo
            that.idCardAddr = that.idCardAddr || data.idCardAddr
            that.defaultImg = data.faceUrl || defaultImg
          } else {
            that.$vux.toast.text(res.msg)
          }
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .userinfo {
    position: relative;
    width: 10.8rem;
    background-color: #fafafa;
    margin: 0 auto;
    height: 100%;
    word-break: break-all;
    .uploader-container {
      background: #fff;
    }
    .userinfo-tip {
      margin: .2rem 0;
      color: #369fff;
      font-size: .4rem;
      text-align: center;
      line-height: 1.6;
    }
    .userinfo-ul {
      position: relative;
      width: 100%;
      // padding-top: .3rem;
      height: auto;
      background-color: #fff;
      overflow: hidden;
    }
    .userinfo-detail-content {
      position: relative;
      width: 100%;
      display: flex;
    }
    .userinfo-detail-item {
      width: 2.3rem;
      padding-left: .48rem;
      color: #333;
      height: 1.46rem;
      line-height: 1.46rem;
      // font-weight: bold;
      font-size: .4rem;
    }
    .userinfo-detail-input {
      flex: 1;
      border: none;
      outline: none;
      padding: 0 .48rem;
      font-size: .42rem;
      color: #333;
    }
    .userinfo-detail-textarea {
      flex: 1;
      border: none;
      outline: none;
      padding: 0 .48rem;
      font-size: .42rem;
      color: #333;
      resize: none;
      padding-top: .46rem;
      line-height: 1.5;
      overflow: hidden;
    }
    .userinfo-detail-verify {
      text-align: center;
      width: 2.96rem;
      height: 1.46rem;
      line-height: 1.46rem;
      color: #369fff;
      font-size: .4rem;
    }

    .weui-cell {
      display: flex;
      padding: 0;
      height: 1.46rem;
      line-height: 1.46rem;
      font-size: .4rem;
    }
    .weui-cell__hd {
      width: 2.3rem;
      padding-left: .48rem;
      text-align: left;
      // font-weight: bold;
    }
    .vux-cell-box {
      width: 100%;
    }
    .vux-popup-picker-select {
      padding-left: .48rem;
    }
    .vux-cell-box:before {
      border-top: none;
    }
    .weui-cell_access .weui-cell__ft:after {
      display: none;
    }
    .vux-popup-picker-placeholder {
      color: #777;
    }
  }
</style>
