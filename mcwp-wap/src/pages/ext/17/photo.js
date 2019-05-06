import Config from '../../../config/index'

export default {
  data () {
    return {
      config: [
        {
          type: 'loanCarDrivinglic',
          bizType: Config.constants.loanCarDrivinglic,
          url: '',
          text: '驾驶证（必拍）',
          required: true,
          warn: '请上传驾驶证'
        },
        {
          type: 'loanCarInsuranceCert',
          bizType: Config.constants.loanCarInsuranceCert,
          url: '',
          text: '车辆投保凭证（必拍）',
          required: true,
          warn: '请上传车辆投保凭证'
        },
        {
          type: 'loanCarPrepaidVoucher',
          bizType: Config.constants.loanCarPrepaidVoucher,
          url: '',
          text: '首付预付凭证'
        },
        {
          type: 'loanCarGuarantee',
          bizType: Config.constants.loanCarGuarantee,
          url: '',
          text: '担保函'
        },
        {
          type: 'loanCarOth',
          bizType: Config.constants.loanCarOth,
          url: '',
          text: '其它'
        }
      ]
    }
  },
  methods: {
  }
}
