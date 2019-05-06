<template>
  <div class="success">
    <p class="submit font-44">恭喜您！</p>
    <p class="wait font-32">获得预授信额度<span>240</span>万</p>
    <img class="success-img" src="../../assets/house-succeed.png" alt="success" />
    <v-button class="share-btn" @next='back'>分享赚钱</v-button>
    <p class="back font-32" @click="back">返回首页</p>
  </div>
</template>

<script>
import Store from 'store'
import Config from '../../config/index'
import Utils from '../../config/utils'
import VButton from './../../components/button'
import { finishLoan } from '../../service/getData'

export default {
  components: {
    VButton
  },
  methods: {
    back () {
      this.$router.push(Config.constants.productRouter)
    },
    async signFinish () {
      const that = this
      that.$vux.loading.show()
      // const accreditSign = await getAccreditSign({loanCode: that.loanCode})
      // if (accreditSign.code === Config.resCode.success) {
      //   // 授权成功，不作处理
      //   // return that.$vux.toast.text('授权成功')
      // } else {
      //   // 授权失败
      //   return that.$vux.toast.text(accreditSign.msg)
      // }
      const final = await finishLoan({code: that.loanCode})
      that.$vux.loading.hide()
      if (final.code === Config.resCode.success) {
        that.success = true
      } else {
        that.$vux.toast.text(final.msg)
      }
    },
    goProduct () { // 返回产品
      const that = this
      that.$vux.loading.show({
        text: '请稍候...'
      })
      const cookies = Store.get(Config.constants.cookies)
      Store.clearAll()
      const personalCenterurl = cookies.personalUrl || (that.followInfo && that.followInfo.personalCenterurl)
      if (personalCenterurl && Utils.isWeixin()) {
        that.$router.push(personalCenterurl)
      } else {
        that.$router.push('/h5/product/detail?prdCode=' + cookies.proCode + '&managerCode=' + cookies.managerCode + '&openWith=' + cookies.open)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.success {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  padding-top: .8rem;
  padding-bottom: 1rem;
  .success-img {
    width: 6rem;
    height: 6.06rem;
    padding-top: .5rem;
  }
  .submit {
    margin-top: .64rem;
    line-height: 1;
    color: #333;
  }
  .wait {
    margin-top: .4rem;
    line-height: 1;
    color: #888;
  }
  .share-btn {
    margin-bottom: .8rem;
  }
  .back {
    // margin-top: .2rem;
    line-height: 1;
    padding: .2rem;
    color: #369fff;
  }
}
</style>
