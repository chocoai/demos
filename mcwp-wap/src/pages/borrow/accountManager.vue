<template>
  <div class="borrow-accountManager">
    <div class="account-content" v-if='managerInfo'>
      <p class="content-title"><img class="bank-icon" :src="managerInfo.bankLogo" alt="logo" /><span class="title-name font-44">{{managerInfo.name}}</span><span class="title-type font-34">客户经理</span></p>
      <p class="content-iphone font-36">{{managerInfo.telephone}}</span></p>
      <p class="content-address font-36">{{managerInfo.enterpriseName}}</span></p>
    </div>
    <v-blank v-else>你还没有客户经理</v-blank>
  </div>
</template>

<script>
import { meManager } from '../../service/getData'
import Config from '../../config/index'
import VBlank from './../../components/blank'

export default {
  components: {
    VBlank
  },
  data () {
    return {
      managerInfo: ''
    }
  },
  mounted () {
    const that = this
    that.$vux.loading.show()
    meManager({}).then(res => {
      that.$vux.loading.hide()
      if (res.code === Config.resCode.success) {
        that.managerInfo = res.data
        console.log(that.managerInfo)
      } else {
        that.$vux.toast.text(res.msg)
      }
    })
  },
  methods: {
  }
}
</script>

<style lang="less">
  .borrow-accountManager{
    width: 10.2rem;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: .3rem auto;
  }
  .account-content{
    width:9rem;
    background: #fff;
    padding: .5rem .6rem;
    border-radius: .3rem;
    .bank-icon {
      width: .92rem;
      height: .92rem;
      vertical-align: middle;
      margin-right: .4rem;
    }
    .content-title{
      width: 100%;
      height: .92rem;
      // background: url(../../assets/account-manager-icon.png) no-repeat no-repeat;
      // background-size: .92rem .92rem;
      line-height: .92rem;
      // padding-left: 1.32rem;
      font-size: .44rem;
      color: #010101;
      .title-type{
        padding-left: .4rem;
        font-size: .36rem;
        color: #727272;
        vertical-align: middle;
      }
    }
    .content-iphone{
      background: url(../../assets/account-manager-iphone.png) no-repeat 0 center;
      background-size: .34rem .34rem;
      padding-left: .68rem;
      color: #3a3a3a;
      margin-top: .5rem;
    }
    .content-address{
      background: url(../../assets/account-manager-address.png) no-repeat 0 center;
      background-size: .34rem .34rem;
      padding-left: .68rem;
      color: #3a3a3a;
      margin-top: .4rem;
    }
  }
</style>
