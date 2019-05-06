<template>
  <div class="shops-join-container">
    <ul class="shops-join-ul">
      <li class="shops-join-li">
        <label>
          <span class="text-describe">店铺名称</span>
          <input type="text" placeholder="请输入店铺名称" v-model="merchantName" :disabled="!isEdit" maxlength="30"/>
        </label>
        <div class="line"></div>
      </li>
      <li class="shops-join-li">
        <label>
          <span class="text-describe">负责人</span>
          <input type="text" placeholder="请输入店铺负责人" v-model="merchantPerson" :disabled="!isEdit" maxlength="15"/>
        </label>
        <div class="line"></div>
      </li>
      <li class="shops-join-li">
        <label>
          <span class="text-describe">联系方式</span>
          <input type="tel" placeholder="请输入联系方式" v-model="merchantPhone" :disabled="!isEdit" maxlength="20"/>
        </label>
        <div class="line"></div>
      </li>
      <li class="shops-join-li">
        <label>
          <span class="text-describe">店铺地址</span>
          <input type="text" placeholder="请输入店铺详细地址" v-model="merchantAddress" :disabled="!isEdit" maxlength="60"/>
        </label>
        <div class="line"></div>
      </li>
      <li class="photo-root shops-join-li">
        <div class="photo-title-group">
          <span class="text-describe">店铺照片</span>
          <span class="photo-describe" v-if="merchantStatus !== '2'">拍摄带店铺名称的门面照片</span>
          <span class="photo-number" v-if="merchantStatus !== '2'">{{files.length}}/10</span>
        </div>
        <div class="photo-group">
          <div v-for="img in files" :key="img.srcUrl" class="photo-div">
            <img :src="img.srcUrl" class="photo-shops">
            <img src="../../assets/icon_close_default.png" class="del-photo" @click="deleteImg(img)" v-if="isEdit"/>
          </div>
          <img src="../../assets/btn_add_pic.png" v-if="isWx&&files.length<10&&isEdit" @click="wxChoiceImg" class="photo-shops"/>
          <uploader :after-read="choiceImg" v-else-if="files.length<10&&isEdit" class="photo-shops" >
            <img src="../../assets/btn_add_pic.png" class="photo-shops"/>
          </uploader>
        </div>
      </li>
      <li class="shops-join-li">
        <label>
          <span class="text-describe">推荐人</span>
          <input type="text" placeholder="请输入银行客户经理姓名(选填)" v-model="merchantReferee" :disabled="!isEdit" maxlength="15"/>
        </label>
      </li>
    </ul>
    <button id="request-join" @click="requestJoin" v-if="isEdit">申请入驻</button>
  </div>
</template>

<script>
import { Uploader } from "vant";
import {
  isWeixin,
  Config as GlobalConfig,
  isPhoneNumber
} from "../../utils/index";
import EXIF from "exif-js";
import WxSdk from "../../utils/wxJsSdk";
import ImageUtils from "../../utils/ImageUtils";
import {
  getUUID,
  wxfilesUpload,
  getFileList,
  deleteFile
} from "../../service/common";
import { shopsEdit, shopsInfos } from "../../service/shops-join";
import { Dialog } from "vant";
import { Config } from "../../utils";
import Store from "store";

export default {
  data() {
    return {
      files: [],
      isEdit: null,
      isCreated: null,
      bizCode: "",
      isWx: isWeixin(),
      merchantStatus: "",
      enterpriseCode: "",
      merchantName: "",
      merchantPerson: "",
      merchantPhone: "",
      merchantAddress: "",
      merchantReferee: ""
    };
  },
  components: { Uploader },
  mounted() {
    const cookie = Store.get(Config.constants.cookies);
    this.enterpriseCode = cookie.enterpriseCode;
    this.bizCode = this.$route.query.merchantCode;
    this.merchantPhone = (this.$route.query.telephone || "").replace(
      "null",
      ""
    );
    this.merchantStatus = this.$route.query.merchantStatus || "";
    this.isEdit =
      this.merchantStatus + "" !== "0" &&
      this.merchantStatus + "" !== "1" &&
      this.merchantStatus + "" !== "2";
    this.isCreated = this.$route.query.merchantCode == null;
    if (
      this.bizCode === "" ||
      this.bizCode === "null" ||
      this.bizCode === null ||
      this.bizCode === undefined
    ) {
      this.getUUIDStr();
    } else {
      this.getMerchantInfo();
      this.refreshPhoto();
    }
  },
  methods: {
    choiceImg(file) {
      const that = this;
      this.$toast.loading({
        mask: true,
        message: "上传中..."
      });
      let orientation;
      EXIF.getData(file.file, function() {
        orientation = EXIF.getTag(this, "Orientation");
      });
      let reader = new FileReader();
      reader.onload = function() {
        ImageUtils.getImgData(this.result, orientation, function(result) {
          let img = new Image();
          img.src = result;
          let uploadCallback = response => {
            if (response === null) {
              that.$toast.fail("网络连接失败");
            } else if (response.code === (0 || "0")) {
              that.$toast.clear();
              that.refreshPhoto();
            } else {
              that.$toast.fail(response.msg);
            }
          };
          // 如果图片大小小于200kb，则直接上传
          if (result.length <= 200 * 1024) {
            ImageUtils.upload(
              result,
              file.file.type,
              file.file.name,
              GlobalConfig.bizType.operateMerchantInfoFileWx,
              that.bizCode,
              that.enterpriseCode,
              uploadCallback
            );
            img = null;
            return;
          }
          // 图片加载完毕之后进行压缩，然后上传
          if (img.complete) {
            callback();
          } else {
            img.onload = callback;
          }
          function callback() {
            let data = ImageUtils.compress(img);
            // 文件上传
            ImageUtils.upload(
              data,
              file.file.type,
              file.file.name,
              GlobalConfig.bizType.operateMerchantInfoFileWx,
              that.bizCode,
              that.enterpriseCode,
              uploadCallback
            );
            img = null;
          }
        });
      };
      reader.readAsDataURL(file.file);
    },
    wxChoiceImg() {
      const that = this;
      WxSdk.wxImage(wx => {
        wx.chooseImage({
          count: 1, // 默认9
          sizeType: ["original", "compressed"], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ["album", "camera"], // 可以指定来源是相册还是相机，默认二者都有
          success: res => {
            let localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
            wx.uploadImage({
              localId: "" + localIds, // 需要上传的图片的本地ID，由chooseImage接口获得
              isShowProgressTips: 1, // 默认为1，显示进度提示
              success: function(res) {
                let serverId = res.serverId; // 返回图片的服务器端ID
                let wxFilesParams = {
                  bizCode: that.bizCode,
                  mediaId: serverId,
                  enterpriseCode: that.enterpriseCode,
                  bizType: GlobalConfig.bizType.operateMerchantInfoFileWx
                };
                wxfilesUpload(wxFilesParams)
                  .then(result => {
                    if (result.code === ("0" || 0)) {
                      that.refreshPhoto();
                    } else {
                      that.$toast(result.msg);
                    }
                  })
                  .catch(reason => {
                    alert(`上传图片ID失败 : ${reason}`);
                  });
              }
            });
          }
        });
      });
    },
    async deleteImg(img) {
      this.$toast.loading({
        make: true,
        message: "正在删除"
      });
      let resp = await deleteFile(img.code);
      if (resp.code === (0 || "0")) {
        this.$toast.clear();
        this.refreshPhoto();
      } else {
        this.$toast.fail(resp.msg);
      }
    },
    async refreshPhoto() {
      this.$toast.loading({
        mask: true,
        message: "正在加载..."
      });
      let files = await getFileList(
        this.bizCode,
        GlobalConfig.bizType.operateMerchantInfoFileWx,
        "picture"
      );
      this.$toast.clear();
      let photos =
        files["data"][GlobalConfig.bizType.operateMerchantInfoFileWx];
      this.files = photos || [];
    },
    async requestJoin() {
      if (this.merchantName.length < 2) {
        this.$toast("店铺名称不能低于2个字符");
      } else if (this.merchantPerson.length < 2) {
        this.$toast("负责人姓名不能低于2个字符");
      } else if (
        this.merchantPhone.length < 1 ||
        !isPhoneNumber(this.merchantPhone)
      ) {
        this.$toast("联系方式不合法");
      } else if (this.merchantAddress.length < 2) {
        this.$toast("店铺地址不能低于2个字符");
      } else if (this.files.length < 1) {
        this.$toast("至少需要上传一张照片");
      } else {
        let param = {
          code: this.bizCode,
          merchantName: this.merchantName,
          merchantPhone: this.merchantPhone,
          merchantPerson: this.merchantPerson,
          merchantAddress: this.merchantAddress,
          merchantReferee: this.merchantReferee,
          isEdit: this.isCreated ? 0 : 1
        };
        let resp = await shopsEdit(param);
        if (resp.code === (0 || "0")) {
          this.$toast("添加成功");
          this.$router.push({
            path: "/home",
            name: "home"
          });
        } else {
          this.$toast.fail(resp.msg);
        }
      }
    },
    async getUUIDStr() {
      this.$toast.loading({
        mask: true,
        message: "请稍后..."
      });
      const resp = await getUUID();
      this.$toast.clear();
      if (resp.code === (0 || "0") && typeof resp.data === "string") {
        this.bizCode = resp.data;
      } else {
        Dialog.confirm({
          title: "获取商户信息失败",
          message: `获取商户信息失败,${resp.msg},是否重新获取`
        })
          .then(() => {
            this.$dialog.close();
            this.getUUIDStr();
          })
          .catch(() => {
            this.$dialog.close();
          });
      }
    },
    async getMerchantInfo() {
      this.$toast.loading({
        make: true,
        message: "正在删除"
      });
      let resp = await shopsInfos(this.bizCode);
      this.merchantName = resp.data.merchantName;
      this.merchantPhone = resp.data.merchantPhone;
      this.merchantPerson = resp.data.merchantPerson;
      this.merchantAddress = resp.data.merchantAddress;
      let merchantReferee = resp.data.merchantReferee;
      this.merchantReferee = this.isEdit
        ? merchantReferee
        : merchantReferee || "无";
    }
  }
};
</script>

<style lang="less" scoped>
div.shops-join-container {
  padding-top: 0.32rem;
  .shops-join-ul {
    .shops-join-li {
      background-color: white;
      text-align: left;
      position: relative;
      padding: 0.4rem 0 0.4rem 0.48rem !important;
      .line {
        border-bottom: 0.01rem #eee solid;
        position: absolute;
        width: 100%;
        bottom: 0;
      }
      .text-describe {
        font-size: 0.44rem;
        width: 0.44rem * 4;
        display: inline-block;
        color: #333;
        word-break: normal;
        white-space: nowrap;
        word-wrap: break-word;
        overflow: hidden;
        align-items: center;
        margin-right: 0.6rem;
      }
      label {
        width: 100%;
        display: flex;
        margin-right: 0.72rem;
        align-items: center;
        input[type="text"],
        input[type="tel"] {
          font-size: 0.4rem;
          width: 7.24rem;
          color: #333;
          &::-webkit-input-placeholder {
            color: #888;
          }
          &[disabled] {
            background-color: transparent;
            color: #666 !important;
            text-align: right !important;
            -webkit-text-fill-color: #666;
            -webkit-opacity: 1;
            opacity: 1;
            &::-webkit-input-placeholder {
              color: transparent;
            }
          }
        }
      }
      &.photo-root {
        margin-bottom: 0.32rem !important;
        padding-right: 0.48 - 0.12rem !important;
        .photo-title-group {
          display: flex;
          position: relative;
          align-items: center;
          .photo-describe {
            font-size: 0.36rem;
            color: #666;
          }
          .photo-number {
            position: absolute;
            right: 0;
            float: right;
          }
        }
        .photo-group {
          margin-top: 0.16rem;
          .photo-shops {
            pointer-events: auto;
            width: 2.28rem;
            height: 2.28rem;
          }
          div.photo-div {
            display: inline-block;
            position: relative;
            margin: 0.12rem 0.12rem 0 0;
            .del-photo {
              pointer-events: auto;
              width: 0.8rem;
              height: 0.8rem;
              position: absolute;
              padding: 0.16rem;
              top: 0;
              right: 0;
              z-index: 10;
            }
          }
        }
      }
    }
  }
  button#request-join {
    margin-top: 1.2rem;
    width: 8.4rem;
    height: 1.44rem;
    border-radius: 1.44rem / 2;
    background-color: #fa494b;
    font-size: 0.48rem;
    color: white;
    &:active {
      background-color: #e14243;
    }
  }
}
</style>
