<template>
  <div class="loan-confirm" v-if='success || type'>
    <div class="confirm-success">
      <img class="success-img" src="../../assets/img_submit-successfully.png" />
      <div class="success-text">申请信息提交成功</div>
      <div class="success-wait">请耐心等待审核！</div>
      <div class="success-back" v-if="!type" @click="goProduct">返回首页</div>
    </div>
    <div v-if='followInfo && followInfo.followurl && isWeixin' class="confirm-follow">
      <p class="follow-tip">关注公众号可查询贷款进度，也可通过公众号申请借款哦！</p>
      <img class="bank-icon" :src='followInfo.headimg'/>
      <p class="bank-title">{{followInfo.nickname}}</p>
      <a class="follow-btn" :href='followInfo.followurl'>关注</a>
    </div>
  </div>
</template>

<script>
  import Store from 'store'
  import Config from '../../config/index'
  import Utils from '../../config/utils'
  import VButton from './../../components/button'
  import { getFollowurl, finishLoan } from '../../service/getData'
  export default {
    components: {
      VButton
    },
    data () {
      return {
        enterpriseIcon: '',
        enterpriseName: '',
        followInfo: '',
        isWeixin: '',
        getTime: new Date().getTime(),   // 时长统计
        success: false,
        proCode: '',
        managerCode: '',
        type: Utils.getUrlkey(window.location.search)['type']
      }
    },
    created () {
      this.isWeixin = Utils.isWeixin()
      const cookies = Store.get(Config.constants.cookies)
      this.proCode = cookies.proCode
      this.managerCode = cookies.managerCode
      this.enterpriseIcon = cookies.enterpriseIcon
      this.enterpriseName = cookies.enterpriseName
      this.loanCode = cookies.loanCode
      if (this.type) return true
      this.signFinish()
    },
    mounted () {
      const that = this
      if (!that.loanCode) return
      const cookies = Store.get(Config.constants.cookies)
      let enterpriseCode = cookies.enterpriseCode
      getFollowurl({enterpCode: enterpriseCode}).then((res) => {
        if (+res.code === 0) {
          that.followInfo = res.data && res.data[0]
          cookies.personalUrl = that.followInfo && that.followInfo.personalCenterurl
          cookies.isIpieces = true
          cookies.proCode = null
          Store.set(Config.constants.cookies, cookies)
        } else {
          that.$vux.toast.text(res.msg)
        }
      })
      Utils.countPlus('申请成功', 'send')
    },
    destroyed () {
      // Store.clearAll()
      // 删除未完成组件缓存
      Store.remove(Config.constants.citizenFirstStep())
      Utils.countPlus('页面停留时长', 'send', {'pageName': '申请成功', 'stayTime': new Date().getTime() - this.getTime})
    },
    methods: {
      async signFinish () {
        const that = this
        that.$vux.loading.show()
        Store.remove(Config.constants.citizenFirstStep())
        // const accreditSign = await getAccreditSign({loanCode: that.loanCode})
        // if (accreditSign.code === Config.resCode.success) {
        //   // 授权成功，不作处理
        //   // return that.$vux.toast.text('授权成功')
        // } else {
        //   // 授权失败
        //   that.$vux.loading.hide()
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
        // Store.remove(Config.constants.citizenFirstStep())
        const personalCenterurl = cookies.personalUrl || (that.followInfo && that.followInfo.personalCenterurl)
        Utils.countPlus('页面停留时长', 'send', {'pageName': '申请成功', 'stayTime': new Date().getTime() - this.getTime})
        // app端直接关闭
        if (window.zdb) window.zdb.tExit()
        if (personalCenterurl && Utils.isWeixin()) {
          that.$router.push(personalCenterurl)
        } else {
          that.$router.push('/h5/product/detail?prdCode=' + this.proCode + '&managerCode=' + this.managerCode + '&openWith=' + cookies.open)
        }
      }
    }
  }
</script>

<style lang="less">
  .loan-confirm {
    position: relative;
    width: 100%;
    margin: 0 auto;
    padding-bottom: 1.2rem;
    // padding-top: .3rem;
    .confirm-content {
      background-color: #fff;
    }
    .apply-title {
        height: 1.2rem;
        line-height: 1.2rem;
        font-size: .4rem;
        color: #333;
        margin: 0 .48rem;
        // font-weight: bold;
    }
    .apply-info {
        position: relative;
        padding: .64rem .96rem;
        font-size: .42rem;
        color: #333;
        .apply-contact {
            position: relative;
            margin-top: .48rem;
            span {
                &:first-child {
                    float: left;
                }
                &:last-child {
                    float: right;
                }
            }
        }
        .apply-pro {
            margin-top: .64rem;
        }
    }
    .confirm-success {
      position: relative;
      text-align: center;
      width: 100%;
      background-color: #fff;
      padding-top: .8rem;
      padding-bottom: 1.2rem;
      .success-img {
        margin: 0 auto;
        width: 2rem;
        height: 2rem;
        display: block;
      }
      .success-text {
        font-size: .5rem;
        color: #333;
        margin-top: .64rem;
        // font-weight: bold;
      }
      .success-wait {
        font-size: .4rem;
        color: #888;
        margin-top: .32rem;
      }
      .success-back {
        width: 4.4rem;
        height: .88rem;
        line-height: .88rem;
        font-size: .42rem;
        color: #369fff;
        text-align: center;
        margin: .6rem auto 0 auto;
      }
    }
    .confirm-follow {
      padding: .64rem .4rem;
      background: #fff;
      width: 9.05rem;
      margin: 0 auto;
      margin-top: .4rem;
      border-radius: .2rem;
      .follow-tip {
        font-size: .4rem;
        color: #888;
        line-height: .72rem;
        margin-bottom: .64rem;
      }
      .follow-content {
        line-height: 1.8rem;
      }
      .bank-title {
        display: inline-block;
        height: 1.8rem;
        line-height:1.8rem;
        margin-left: .24rem;
        font-size: .4rem;
      }
      .bank-icon {
        width: 1.6rem;
        height: 1.6rem;
        display: block;
        float: left;
      }
      .follow-btn{
        display: block;
        width: 1.6rem;
        height: .8rem;
        border-radius: .4rem;
        color: #fff;
        background: #369bff;
        line-height: .8rem;
        font-size: .4rem;
        float: right;
        margin: .4rem .24rem;
        text-align: center;
      }
    }
}
</style>
