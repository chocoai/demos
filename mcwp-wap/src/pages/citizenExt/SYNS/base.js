import { getSSQ } from '../../../service/citizen.js'
import Utils from '../../../config/utils'
import Config from '../../../config/index'

export default {
  data () {
    return {
      educationShow: false,
      monthIncomeShow: false,
      monthDebtShow: false,
      creditcardSumamtShow: false,
      provinceRegionShow: false,
      postCodeShow: false,
      homeAddrShow: false,
      checkAuthorize: false,
      addressText: '内蒙古包头市区域',  // 无该字段
      applyNumText: '0-300,000'
    }
  },
  methods: {
    // 跳转取消
    redirectApply () {
      if (this.applyBalance > 100000) {
        this.$vux.toast.text('前往公众号个人中心授权公积金，可提高审批额度')
      }
    },
    applyBalanceVerify () {
      const that = this
      if (that.applyBalanceShow) {
        const applyBalance = that.applyBalance
        if (!applyBalance) {
          that.$vux.toast.text(Config.constants.nullLoanAmount)
          return true
        }
        if (!(this.applyBalance >= 1 && this.applyBalance <= 300000)) {
          this.$vux.toast.text('申请金额请在0-300000范围内输入！')
          return true
        }
      }
      return false
    },
    // TODO：下一个银行确定，将双签列为特殊
    async getSsq () {
      let ssq = getSSQ({code: this.loanCode})
      let res = await ssq
      if (+res.code === 0) {
        this.ssqData = Utils.getPickerList(res.data)
      } else {
        alert(res.msg)
      }
    }
  }
}
