<template>
  <div class="success-container">
    <div class="success">
      <div class="success-content">
        <img class="success-img" src="../../assets/img_submit-successfully.png" alt="success" />
        <p class="submit font-44">您的贷款申请已成功提交</p>
        <p class="wait font-32">我们的客户经理会尽快与您联系，尽请留意!</p>
        <p class="back font-32"><span class="padding-p">点击<span @click="back" class="apply-most">提交更多信息</span>，缩短等待时间</span></p>
      </div>
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
import Config from '../../config/index'
import Store from 'store'
import Utils from '../../config/utils'
import { getFollowurl } from '../../service/getData'
import { getValuationProdStep } from '../../service/valuation'
export default {
  data () {
    return {
      isWeixin: '',
      followInfo: ''
    }
  },
  created () {
    this.isWeixin = Utils.isWeixin()
    console.log(this.isWeixin)
  },
  mounted () {
    const that = this
    const cookies = Store.get(Config.constants.cookies)
    let enterpriseCode = cookies.enterpriseCode
    getFollowurl({enterpCode: enterpriseCode}).then((res) => {
      if (+res.code === 0) {
        that.followInfo = res.data && res.data[0]
        console.log(that.followInfo)
        // cookies.personalUrl = that.followInfo && that.followInfo.personalCenterurl
        // cookies.isIpieces = true
        // Store.set(Config.constants.cookies, cookies)
      } else {
        that.$vux.toast.text(res.msg)
      }
    })
  },
  methods: {
    back () {
      const that = this
      // const cookies = Store.get(Config.constants.cookies)
      Utils.countPlus({
        'userName': '营销成功'
      }, 'register')
      let params = {}
      let tplType = Store.get('tplType')
      let enterpriseCode = Store.get('enterpriseCode')
      console.log(tplType)
      if (tplType) {
        params.tplType = tplType
      }
      if (enterpriseCode) {
        params.enterpriseCode = enterpriseCode
      }
      if (sessionStorage.getItem('YX_CHANNEL')) params.channel = sessionStorage.getItem('YX_CHANNEL')
      if (sessionStorage.getItem('YX_CATEGORY')) params.category = sessionStorage.getItem('YX_CATEGORY')
      getValuationProdStep(params).then((res) => {
        if (+res.code === 0) {
          Utils.countPlus('营销成功', 'send', {'pageName': '营销成功', 'stayTime': new Date().getTime() - this.getTime})
          let data = res.data
          if (data.jumpType === '1') {
            that.$router.push(Config.constants.ValuationMarket + '?enterpriseCode=' + enterpriseCode)
          } else {
            if (data.jumpPage === '1') {
              that.$router.push('/h5/product/detail' + '?prdCode=' + data.prodCode + '&enterpriseCode=' + enterpriseCode)
            } else {
              that.$router.push('/h5/product/detail' + '?prdCode=' + data.prodCode + '&enterpriseCode=' + enterpriseCode + '&stay=1')
            }
          }
          // let loanRoutes = []
          // res.data.prdStep.forEach((item, index) => {
          //   loanRoutes.push(item.itemIds)
          // })
          // let route = loanRoutes[0]
          // console.log(route)
          // cookies.loanRoutes = loanRoutes
          // cookies.loanCode = res.data.reqCode
          // Store.set(Config.constants.cookies, cookies)
          // that.$router.push(route)
        } else {
          that.$vux.toast.text(res.msg)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.success-container {
  .success {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #fff;
    padding-top: .8rem;
    padding-bottom: 1rem;
    .success-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      background-color: #fff;
      padding-top: .8rem;
      padding-bottom: 1rem;
      .success-img {
        width: 2rem;
        height: 2rem;
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
      .back {
        margin-top: .5rem;
        line-height: 1;
        padding: .2rem;
        color: #888;
        position: relative;
        .padding-p {
          padding-left: .8rem;
        }
        .apply-most {
          color: #369fff;
        }
        &::before {
          content: '';
          background: url('./../../assets/icon_tip.png') no-repeat;
          background-size: .56rem .56rem;
          width: .72rem;
          height: .56rem;
          position: absolute;
          z-index: 100;
          top: 3px;
        }
      }
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
