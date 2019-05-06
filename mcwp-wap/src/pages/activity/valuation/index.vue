<template>
  <div class="activity-valuation-container">
    <i @click="next" class="button"></i>
  </div>
</template>

<script>
import { getActivityValuationCode } from '../../../service/activityValuation'
import Config from '../../../config/index'
import Wxsdk from '../../../config/wxJsSdk'

export default {
  data () {
    return {
      code: null,
      shareOpenId: sessionStorage.getItem(Config.constants.activityShareOpenId),
      shareStartOpenId: sessionStorage.getItem(Config.constants.activityshareStartOpenId)
    }
  },
  created () {
    this.getCode()
  },
  methods: {
    async getCode () {
      let shareOpenId = sessionStorage.getItem(Config.constants.activityShareOpenId)
      let shareStartOpenId = sessionStorage.getItem(Config.constants.activityshareStartOpenId)
      let params = {}
      // 获取分享人openId
      if (shareOpenId && shareOpenId !== 'null' && shareOpenId !== 'undefined') params.shareOpenId = shareOpenId
      if (shareStartOpenId && shareStartOpenId !== 'null' && shareStartOpenId !== 'undefined') params.shareStartOpenId = shareStartOpenId
      let res = await getActivityValuationCode(params)
      this.code = res.data.operateCode
      sessionStorage.setItem(Config.constants.activityValuationImg, res.data.pictureUrl)
      sessionStorage.setItem(Config.constants.wxNickName, res.data.nickName)
      if (res.data.growthRate) sessionStorage.setItem(Config.constants.activityValuationGrowthRate, res.data.growthRate)
      Wxsdk.wxShare(() => {
      }, {}, 'activityValuation')
    },
    next () {
      if (this.code) {
        sessionStorage.setItem(Config.constants.activityValuation, this.code)
        this.$router.push(`${Config.constants.houseLoanRouter}/activity`)
      } else {
        this.getCode()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.activity-valuation-container {
  position: relative;
  width: 10.8rem;
  height: 100vh;
  background: url('./../../../assets/bg_activity-valuation.png') no-repeat;
  background-size: 10.8rem;
  .button {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 1rem;
    margin: auto;
    width: 5.92rem;
    height: 1.76rem;
    background: url('./../../../assets/btn_activity-valuation_default.png') no-repeat;
    background-size: cover;
    z-index: 100;
  }
  .button:hover {
    background: url('./../../../assets/btn_activity-valuation_pressed.png') no-repeat;
    background-size: cover;
  }
}
</style>

