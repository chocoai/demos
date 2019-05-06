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
      addressText: '内蒙古包头市区域',  // 不显示
      applyNumText: '0-100,000'
    }
  },
  methods: {
    // 跳转取消
    redirectApply () {},
    applyBalanceVerify () {
      const that = this
      if (that.applyBalanceShow) {
        const applyBalance = that.applyBalance
        if (!applyBalance) {
          that.$vux.toast.text(Config.constants.nullLoanAmount)
          return true
        }
        if (!(this.applyBalance >= 1 && this.applyBalance <= 100000)) {
          this.$vux.toast.text('申请金额请在0-100000范围内输入！')
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
