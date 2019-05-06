<template>
  <div class="qr-login" v-if="show">
    <div class="qr-content">
      <img class="logo" :src="imgUrl" alt="logo" />
      <p class="title">助贷宝微贷作业管理平台登录确认</p>
    </div>
    <div>
      <v-button class="login" @next='nextStep'>登录</v-button>
      <span class="cancel-login" @click='cancel'>取消登录</span>
    </div>
  </div>
</template>

<script>
import VButton from './../../components/button'
import Utils from '../../config/utils'
import { postQrLogin } from '../../service/getData'
import Config from '../../config/index'
import defaultImg from '../../assets/img_default_logo_new.png'

export default {
  components: {
    VButton
  },
  data () {
    return {
      nonceStr: Utils.getUrlkey(window.location.search)['nonceStr'],
      token: Utils.getUrlkey(window.location.search)['token'],
      imgUrl: Utils.getUrlkey(window.location.search)['logo'] || '',
      show: true
    }
  },
  created () {
    const that = this
    if (!that.nonceStr || !that.token) {
      that.show = false
      that.$router.push(Config.constants.downloadApp)
    }
    if (that.imgUrl)that.imgUrl = window.decodeURIComponent(that.imgUrl)
    if (window.zdb && !that.imgUrl) that.imgUrl = window.zdb.tGetEnterpriseLogo()
    if (!that.imgUrl) that.imgUrl = defaultImg
  },
  methods: {
    nextStep () {
      const that = this
      const {nonceStr, token} = that
      that.$vux.loading.show()
      postQrLogin({nonceStr, token}).then(res => {
        that.$vux.loading.hide()
        if (res.code === Config.resCode.success) {
          window.zdb.tExit()
        } else {
          that.$vux.toast.text(res.msg)
        }
      })
    },
    cancel () {
      window.zdb.tExit()
    }
  }
}
</script>

<style lang="less" scoped>
.qr-login {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #fff;
  .qr-content {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .logo {
    display: inline-block;
    width: 3.6rem;
    height: 3.6rem;
    margin-top: 2.8rem;
  }
  .title {
    line-height: 1;
    font-size: .48rem;
    text-align: center;
    margin-top: .64rem;
    color: #333;
  }
  .login {
    width: 4.8rem;
    height: 1.2rem;
    line-height: 1.2rem;
    border-radius: .6rem;
    font-size: .48rem;
    margin: .6rem auto .8rem;
  }
  .cancel-login {
    display: block;
    width: 4.8rem;
    height: 1.2rem;
    line-height: 1.2rem;
    font-size: .44rem;
    color: #888;
    margin: 0 auto .8rem;
    cursor: pointer;
    text-align: center;
  }
}
</style>

