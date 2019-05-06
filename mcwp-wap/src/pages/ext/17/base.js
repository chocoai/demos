import { getSSQ } from '../../../service/citizen.js'
import Utils from '../../../config/utils'
import Config from '../../../config/index'

export default {
  data () {
    return {
      loanUseShow: false,
      monthIncomeShow: false,
      monthDebtShow: false,
      creditcardSumamtShow: false,
      postCodeShow: false,
      belongIndustryShow: false,
      branchCodeShow: false,
      homeAddrShow: true,
      repaymentPeriodShow: true,  // 还款期数
      carModelShow: true, // 车型
      carGuidePriceShow: true, // 车辆指导价
      getCarInfoAjax: true, // 是否获取车辆信息
      addressText: '内蒙古包头市区域',
      applyNumText: '10,000-300,000'
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
        if (!(this.applyBalance >= 10000 && this.applyBalance <= 300000)) {
          this.$vux.toast.text('申请金额为10000-300000元')
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
