import Base from './../citizen/base.vue'

// 经营默认配置
// SXDT
let config = {
  data () {
    return {
      cnameShow: true,
      telephoneShow: true,
      educationShow: false,
      maritalStatusShow: true,
      applyBalanceShow: false,
      loanUseShow: true,
      monthIncomeShow: false,
      monthDebtShow: false,
      creditcardSumamtShow: false,
      belongIndustryShow: false,
      branchCodeShow: false,
      provinceRegionShow: false,
      postCodeShow: false,
      homeAddrShow: false,
      telephoneAuthShow: false,
      picVerifyAuthShow: true
    }
  }

}

// TODO：等下一个银行确定，进行进一步提取，提取LC分支，基础组件特殊处理全置空
export default {
  extends: Base,
  ...config
}
