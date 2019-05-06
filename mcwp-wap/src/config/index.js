import Store from 'store'

let Config = {
  target: process.env.NODE_ENV === 'development' ? '/api' : (process.env.NODE_ENV === 'test' ? 'https://mcwp.test.zhudb.com/backend' : (process.env.NODE_ENV === 'advance' ? window.location.protocol + '//' + window.location.host + '/backend' : window.location.protocol + '//' + window.location.host + '/backend')), // 接口配置
  refererUrl: 'https://mcwp.test.zhudb.com',
  test: process.env.NODE_ENV === 'development' ? 1 : 0,
  wxToken: 'eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJqd3QiLCJpYXQiOjE1NDU0NDY0ODIsInN1YiI6IntcInVzZXJOYW1lXCI6bnVsbCxcInVzZXJJZFwiOm51bGwsXCJ1dWlkXCI6bnVsbCxcIm5pY2tOYW1lXCI6bnVsbCxcInJvbGVzXCI6W10sXCJ0b2tlblwiOm51bGwsXCJlbnRlcnBDb2RlXCI6XCIxMDAwMVwiLFwiYXBwSWRcIjpcInd4OGY4MWI3YmY3ZGM5ZTM0OFwiLFwiY29kZVwiOm51bGwsXCJvcGVuSWRcIjpcIm9Ocmg4MXBZSUxQMzlEc05KanhzdXFfTktvQW9cIixcInNjb3BlXCI6XCJzbnNhcGlfYmFzZVwiLFwibG9nb1wiOm51bGx9IiwiZXhwIjoxNTQ1NTMyODgyfQ.RE9T34YZvI_8GBnXeQL3NKd3kk4QHS7PD18fkbOgaQ0',
  domain: window.location.protocol + '//' + window.location.host,
  constants: {
    defaultImg: '@/assets/default-img.png',
    cookies: `MCWP_COOKIES_${process.env.NODE_ENV}`,
    wxAuthClose: `WX_AUTH_CLOSE_${process.env.NODE_ENV}`,
    enterpriseCode: `MCWP_ENTERPRISECODE_${process.env.NODE_ENV}`,
    wxAuthCloseWindow: `WX_AUTH_CLOSE_WINDOW_${process.env.NODE_ENV}`,
    wxACTIVITYCODE: `WX_ACTIVITY_CODE_${process.env.NODE_ENV}`,
    valuation: `MCWP_VALUATION_${process.env.NODE_ENV}`,
    activityValuation: `MCWP_ACTIVITY_VALUATION_${process.env.NODE_ENV}`,
    activityOpenId: `MCWP_ACTIVITY_OPENID_${process.env.NODE_ENV}`,
    activityShareOpenId: `MCWP_ACTIVITY_SHAREOPENID_${process.env.NODE_ENV}`,
    activityshareStartOpenId: `MCWP_ACTIVITY_SHARESTARTOPENID_${process.env.NODE_ENV}`,
    activityValuationImg: `MCWP_ACTIVITY_VALUATION_IMG_${process.env.NODE_ENV}`,
    activityValuationGrowthRate: `MCWP_ACTIVITY_VALUATION_GROWTHRATE_${process.env.NODE_ENV}`,
    contractProductAuth: `MCWP_CONTRACT_PRODUCT_AUTH_${process.env.NODE_ENV}`,
    loanContractAuth: `MCWP_LOAN_CONTRACT_AUTH_${process.env.NODE_ENV}`,
    wxNickName: `MCWP_WX_NICKNAME_${process.env.NODE_ENV}`,
    wxWebAuthType: `MCWP_WX_WEBAUTHTYPE_${process.env.NODE_ENV}`,
    // citizenFirstStep: `MCWP_CITIZEN_FIRST_STEP_${process.env.NODE_ENV}`,
    noRepeatPost: 'NO_REPEAT_POST',
    cityChose: 'CITY_CHOSE',
    mobileReg: /^1[3|4|5|7|8]\d{9}$/,
    nullCname: '请输入姓名！',
    errorPhone: '请输入正确的手机号！',
    nullverificationCode: '请输入验证码',
    nullWagesMonth: '请输入月度工资',
    nullWagesReward: '请输入年度奖金',
    nullByDate: '请选择购买时间',
    nullCarsBrand: '请选择汽车品牌',
    nullCarModel: '请选择汽车型号',
    nullBank: '请选择银行名称',
    nullTelephone: '请输入联系方式！',
    nullPhone: '请输入手机号',
    nullServicePsw: '请输入服务密码',
    nullPassWord: '请输入登录密码',
    nullName: '请输入姓名',
    nameLengthShort: '姓名不能少于两个字',
    nullLoginType: '请选择登录方式',
    errorMobile: '请输入正确的手机号！',
    nullVerifyCode: '请输入验证码',
    nullMonthIncome: '请输入月收入',
    nullMonthDebt: '请输入当前月还贷金额',
    nullCreditcardSumamt: '请输入信用卡汇总额度',
    nullDwxzPicker: '请选择单位性质',
    nullZwPicker: '请选择职务',
    nullSsqPicker: '请选择省市区',
    nullBranchWebsite: '请选择网点',
    nullLoanAddress: '请输入详细地址',
    nullLoanCar: '请选择所购车型',
    nullSshyPicker: '请选择所属行业',
    nullDebtMoney: '请输入负债月还款',
    nullAssetMoney: '请输入银行资产',
    nullDylxPicker: '请选择抵押类型',
    nullDyzlPicker: '请选择抵押种类',
    nullGuarantyMoney: '请输入抵押价值',
    nullHouseLoanPicker: '请选择有无房贷历史',
    nullHouseConditionPicker: '请选择住房情况',
    nullLiveYear: '请输入居住年数',
    nullWorkYear: '请输入就职年数',
    nullActiveMoney: '请输入活跃贷款余额',
    nullCarMoney: '请输入购买金额',
    nullCarBrand: '请选择车辆品牌和款型',
    nullLoanUse: '请选择借款用途',
    nullSex: '请选择性别',
    nullIdcardNo: '请输入身份证号',
    nullServiceCode: '请输入验证码',
    errorIdcardNo: '请输入正确的身份证号',
    nullIdcardAddr: '请输入详细地址',
    nullMarital: '请选择婚姻状况',
    nullrepaymentPeriod: '请选择还款期数',
    nullEducation: '请选择最高学历',
    nullDirname: '请输入直系亲属姓名',
    errDirphone: '直系亲属手机号格式不正确',
    nullDirphone: '请输入直系亲属手机号',
    nullDiridCard: '请输入直系亲属身份证号',
    loanAmountRange: '申请金额请在5000-100000范围内输入！',
    monthIncomeRange: '月收入请在1000-200000范围内输入！',
    monthDebtRange: '当前月还贷金额请在0-500000范围内输入！',
    CreditcardSumamtRange: '信用卡汇总额度请在0-10000000范围内输入！',
    debtMoneyRange: '负债月还款请在100-200,000范围内输入！',
    assetMoneyRange: '银行资产请在1000-5,000,000范围内输入！',
    guarantyMoneyRange: '抵押价值请在1000-5,000,000范围内输入！',
    activeMoneyRange: '活跃贷款余额请在1000-5,000,000范围内输入！',
    liveYearRange: '居住年数请在0—100范围内输入！',
    workYearRange: '就职年数请在0—50范围内输入！',
    errDiridCard: '直系亲属身份证号格式不正确',
    nullDirpicker: '请选择直系亲属与申请人关系',
    nullEmename: '请输入紧急联系人姓名',
    nullEmephone: '请输入紧急联系人手机号',
    errEmephone: '紧急联系人手机号格式不正确',
    nullEmepicker: '请选择紧急联系人与申请人关系',
    nullRespicker: '请选择是否工商注册',
    nullIndpicker: '请选择行业',
    nullFamilyAddr: '请输入家庭地址',
    nullFamAddr: '请输入工作地址',
    nullCcondition: '请输入子女情况',
    nullOrgName: '请输入企业名称',
    nullOrgAddr: '请输入单位地址',
    nullTotalNum: '可提现金额不足',
    nullIncome: '请输入收入',
    nullLoanAmount: '请输入申请金额',
    nullOrgNumber: '请输入雇佣人数',
    nullHouseType: '请选择房产类型',
    wordlen25OrgName: '单位名称最长25个字',
    wordlen64OrgAddr: '单位地址最长64个字',
    loanAddress: '请输入经营地址',
    errorLoanAmount: '申请金额最多3位小数',
    nullRepaymentPeriod: '请输入申请期限',
    errorRepaymentPeriod: '申请期限只能为整数且大于0',
    nullRepaymentKind: '请选择还款方式',
    sendVerifyCode: '验证码发送成功，请注意查收',
    systemError: '后台系统异常',
    nullCode: '进件code已丢失，请重新申请',
    nullProptype: '请选择房屋用途',
    nullBldgarea: '请输入房屋面积',
    nullFloor: '请输入房屋所在楼层',
    nullHeight: '请输入房屋楼座楼层',
    nullListAddr: '请选择房屋详细地址',
    errorLoan: '进件CODE不存在',
    bizTypeFront: 'LOAN_PERSON_IDENTITY_FRONT',
    bizTypeBack: 'LOAN_PERSON_IDENTITY_BACK',
    bizTypeFace: 'LOAN_PERSON_IDENTITY_FACE',
    borrowPic: 'BORROW_PIC',
    houseRight: 'LOAN_HOUSE_HOUSERIGHT', // 进件.房产.房屋产权证
    carDrivinglic: 'LOAN_CAR_DRIVINGLIC', // 进件.车辆类.行驶证
    carPolicy: 'LOAN_CAR_POLICY', // 进件.车辆类.车辆保单
    loanCarDrivinglic: 'LOAN_CAR_DRIVINGLIC', // 驾驶证
    loanCarInsuranceCert: 'LOAN_CAR_INSURANCE_CERT', // 车辆投保凭证
    loanCarPrepaidVoucher: 'LOAN_CAR_PREPAID_VOUCHER', // 首付预付凭证
    loanCarGuarantee: 'LOAN_CAR_GUARANTEE', // 担保函
    loanCarOth: 'LOAN_CAR_OTH', // 其它
    citizenIncome: 'CITIZEN_LOAN_PERSON_INCOME', // 主借人收入证明
    citizenWage: 'CITIZEN_LOAN_PERSON_WAGE', // 主借人工资流水
    citizenSocial: 'CITIZEN_LOAN_PERSON_SOCIAL', // 主借人社保证明
    citizenAcc: 'CITIZEN_LOAN_PERSON_ACC', // 主借人公积金证明
    citizenSpouse: 'CITIZEN_LOAN_SPOUSE', // 主借人配偶信息
    citizenSpouseIncome: 'CITIZEN_LOAN_SPOUSE_INCOME', // 主借人配偶信息收入证明
    citizenSpouseWage: 'CITIZEN_LOAN_SPOUSE_WAGE', // 主借人配偶信息工资流水
    citizenSpouseSocial: 'CITIZEN_LOAN_SPOUSE_SOCIAL', // 主借人配偶信息社保证明
    citizenSpouseAcc: 'CITIZEN_LOAN_SPOUSE_ACC', // 主借人配偶信息公积金
    citizenHouse: 'CITIZEN_LOAN_HOUSE', // 主借人房产信息
    citizenCar: 'CITIZEN_LOAN_CAR', // 主借人车辆信息
    citizenDeposit: 'CITIZEN_LOAN_DEPOSIT', // 主借人存款证明
    citizenCapital: 'CITIZEN_LOAN_OTHER_CAPITAL', // 主借人其他资产
    citizenLive: 'CITIZEN_LOAN_LIVE_EVN', // 主借人居住环境
    housePaper: 'LOAN_PLEDGEHOUSE_PAPER', // 房产证号页
    houseLocated: 'LOAN_PLEDGEHOUSE_LOCATED', // 坐落页
    houseRegister: 'LOAN_PLEDGEHOUSE_REGISTER', // 房产登记表页
    idCardRouter: '/h5/loan/idcard', // OCR识别路由
    confirmRouter: '/h5/loan/confirm', // 确认订单页面
    userinfoRouter: '/h5/loan/userinfo', // 用户拍照页面
    companyRouter: '/h5/loan/company', // 企业信息页面
    houseEvaRouter: '/h5/loan/house', // 房贷估值信息
    houseRouter: '/h5/loan/house', // 房贷信息
    loginRouter: '/h5/borrow/login', // 微信借贷--个人中心--登录
    personalRouter: '/h5/borrow/personal', // 微信借贷--个人中心
    productRouter: '/h5/borrow/product', // 微信借贷--产品展示
    proDetailRouter: '/h5/product/detail', // 产品详情
    accManager: '/h5/borrow/accountManager', // 微信借贷--我的客户经理
    loanSelectRouter: '/h5/borrow/loanSelect',  // 微信借贷--借款选择  个人中心5跳转
    purposeRouter: '/h5/borrow/purpose',      // 借款用途，确定借款
    loanListRouter: '/h5/borrow/loanList',   // 借款列表
    loanDetailRouter: '/h5/borrow/loanDetail/',   // 借款详情
    repayPlanRouter: '/h5/borrow/repay/plan/',      // 还款计划
    addBankcardRouter: '/h5/borrow/addBankcard',     // 新增银行卡
    boSuccessRouter: '/h5/borrow/success',    // 借款成功
    contractRouter: '/h5/loan/contract', // 申请贷款--服务授权查看
    carSelectRouter: '/h5/loan/carmodal', // 申请贷款--车型选择
    accreditRouter: '/h5/loan/accredit', // 申请贷款--服务授权
    refuseRouter: '/h5/ipieces/refuse',    // 审批拒绝
    boContractRouter: '/h5/borrow/contract',   // 借款合同
    // 此为1.5版本更新
    familyV15Router: '/h5/v15/ipieces/family',    // 申请贷款--家庭信息  v1.5
    contactV15Router: '/h5/v15/ipieces/contact',     // 申请贷款--联系人  v1.5
    loanCompanyV15Router: '/h5/v15/ipieces/company',  // 申请贷款--企业相关信息  v1.5
    operateFlowV15Router: '/h5/v15/ipieces/operate/flow', // 申请贷款--经营流水  v1.5
    loanRefuseRouter: '/h5/loan/refuse',            // 审核失败
    // 经营贷——房抵贷,以子类型来定义路由
    houseLoanRouter: '/h5/house/loan',      // 房抵贷
    houseLocationRouter: '/h5/house/location',  // 房抵贷地点
    houseEvaluationRouter: '/h5/house/evaluation',  // 房抵贷估值
    houseApplyRouter: '/h5/house/apply',          // 房抵贷申请
    houseSuccessRouter: '/h5/house/success',    // 房抵贷成功
    houseCertRouter: '/h5/house/cert',   // 申请贷款--房产证照片
    // 分享中心
    shareIntroduceRouter: '/h5/share/introduce',     // 流程介绍页面
    sharePersonalRouter: '/h5/share/personal',     // 我的佣金
    shareSuccessRouter: '/h5/share/success',         // 提现成功页面
    // 提额
    mentionRouter: '/h5/borrow/mention',    // 提额
    // 活动-抽奖
    activityList: '/h5/activity/list',                // 活动列表
    activityTurntable: '/h5/activity/turntable',     // 抽奖转盘
    activityPrize: '/h5/activity/prize',    // 兑奖
    prizeDetail: '/h5/activity/detail',    // 奖品详情
    prizeResult: '/h5/activity/result',    // 奖品详情
    // 活动-估值排名
    ActivityValuation: '/h5/activity/valuation',                // 活动估值排名
    ActivityValuationResult: '/h5/activity/valuation/result',     // 活动估值排名结果
    // 扫码
    qrLogin: '/h5/common/qrlogin',         // 扫码登录
    downloadApp: '/h5/common/download',     // 下载
    // 估值工具
    ValuationMarket: '/h5/valuation/market',         // 营销宣传
    ValuationHouse: '/h5/house/loan/:type?',         // 房屋估值
    ValuationCar: '/h5/valuation/car',              // 车辆估值
    ValuationWages: '/h5/valuation/wages',         // 工资估值
    ValuationResult: '/h5/valuation/result',         // 估值结果
    ValuationSales: '/h5/valuation/sales',         // 营销估值
    ValuationSuccess: '/h5/valuation/success',         // 营销结果
    // 市民贷
    citizenBase: '/h5/citizen/base',         // 基本信息
    citizenMarriage: '/h5/citizen/marriage',     // 婚姻信息
    citizenPhoto: '/h5/citizen/photo',        // 拍照信息
    citizenIncrement: '/h5/citizen/increment',     // 增额信息
    citizenResult: '/h5/citizen/result',       // 审批结果
    citizenBaseOptional: '/h5/citizen/:city?/base',
    citizenResultOptional: '/h5/citizen/:city?/result',   // 审批结果
    // 经营贷
    businessBase: '/h5/business/:city?/base',
    // 通用基本信息
    baseOptional: '/h5/loan/base/:type?',
    photoOptional: '/h5/loan/photo/:type?', // 拍照信息
    contractOptional: '/h5/loan/contract/:type?', // 合同
    signatureOptional: '/h5/loan/signature/:type?', // 签名
    resultOptional: '/h5/loan/result/:type?' // 结果页
  },
  // 自制类型
  showType: {
    loanPersonSpouse: 'LOAN_PERSON_SPOUSE',
    loanPledgeAll: 'LOAN_PLEDGE_ALL'
  },
  // oss类型
  bizType: {
    loanPerson: 'LOAN_PERSON',      // 个人信息
    loanCreditFamily: 'LOAN_CREDIT_FAMILY', // 信用家庭证书
    loanSpouse: 'LOAN_SPOUSE',      // 配偶信息
    loanEmergency: 'LOAN_EMERGENCY_CONTRACT', // 紧急联系人
    loanPledge: 'LOAN_PLEDGE',         // 抵质押
    loanPledgehouse: 'LOAN_PLEDGEHOUSE',    // 抵质押房产
    loanFamily: 'LOAN_FAMILY',      // 家庭信息
    loanBusiBase: 'LOAN_BUSIBASE',  // 经营基本
    loanBusiInfo: 'LOAN_BUSIINFO',  // 经营信息
    loanCoborrower: 'LOAN_COBORROWER',      // 共同借款人
    loanGuarantee: 'LOAN_GUARANTEE',        // 共同担保人
    loanHouse: 'LOAN_HOUSE',                // 房产
    loanCar: 'LOAN_CAR',                    // 车辆
    loanCarinfo: 'LOAN_CARINFO',                    // 车辆信息
    loanMachine: 'LOAN_MACHINE_INFO',       // 机械设备
    loanPersonOth: 'LOAN_PERSON_OTH',      // 个人信息其他
    loanSpouseOth: 'LOAN_SPOUSE_OTH',      // 配偶信息其他
    loanEmergencyOth: 'LOAN_EMERGENCY_CONTRACT_OTH', // 紧急联系人
    loanFamilyOth: 'LOAN_FAMILY_OTH',      // 家庭信息
    loanBusiBaseOth: 'LOAN_BUSIBASE_OTH',  // 经营基本
    loanBusiInfoOth: 'LOAN_BUSIINFO_OTH',  // 经营信息
    loanCoborrowerOth: 'LOAN_COBORROWER_OTH',      // 共同借款人
    loanGuaranteeOth: 'LOAN_GUARANTEE_OTH',        // 共同担保人
    loanHouseOth: 'LOAN_HOUSE_OTH',                // 房产
    loanCarOth: 'LOAN_CAR_OTH',                    // 车辆
    loanMachineOth: 'LOAN_MACHINE_INFO_OTH',       // 机械设备
    loanPersonCredit: 'LOAN_PERSON_CREDIT', // 进件.个人信息.征信报告
    loanCoborrowerCredit: 'LOAN_COBORROWER_CREDIT', // 进件.共同借款人.征信报告
    loanGuaranteeCredit: 'LOAN_GUARANTEE_CREDIT', // 进件.担保人.征信报告
    borrow: 'BORROW', // 借款管理.查看文件
    borrowPic: 'BORROW_PIC', // 借款管理.微信文件
    borrowAccessory: 'BORROW_ACCESSORY', // 借款管理.文件上传
    loanCreditPerson: 'LOAN_CREDIT_PERSON',  // 征信情况.借款人征信
    loanCreditSpouse: 'LOAN_CREDIT_SPOUSE',  // 征信情况.配偶征信
    loanCreditCoborrower: 'LOAN_CREDIT_COBORROWER', // 征信情况.共同借款人征信
    loanCreditGuarantee: 'LOAN_CREDIT_GUARANTEE', // 征信情况.担保人征信
    loanCreditPledge: 'LOAN_CREDIT_PLEDGE',  // 征信情况.抵押人征信
    loanPersonFront: 'LOAN_PERSON_IDENTITY_FRONT',
    loanPersonBack: 'LOAN_PERSON_IDENTITY_BACK',
    loanPersonFace: 'LOAN_PERSON_IDENTITY_FACE',
    citizenLoan: 'CITIZEN_LOAN'             // 市民贷
  },
  env: {
    development: 'test',
    test: 'test',
    advance: 'pre',
    production: 'prod'
  }[process.env.NODE_ENV],
  resCode: {
    success: 0 || '0',
    identityRefuse: 'IDENTITY_MODEL_REFUSED',
    firstRefuse: 'FIRST_AUDIT_MODEL_REFUSED'
  },
  // url请求限制，同一时间不能请求多个
  // 例如：'/comm/wechat/sdk/sign'
  limitUrl: [],
  // 进件调试配置选项
  ipiecesConfig: {
    ipiecesCode: '6b035517640a45b9b808c6aceadc314a',
    ipiecesType: '14',      // 原来经营贷2，网贷1 ，现将改为1,6,7，组件中利用此来判断处都要修改
    ipiecesStatus: 'check',      // 审批为approve，审查为check，查看为detail，人工干预为intervene，撤销贷款为cancelLoan
    userName: '18627175986',
    password: 'xyh123456@',
    smsVerifyCode: '123456'
  },
  activityCode: 'acd30c7dfb184e90b5385dea4dbd8ed0',
  // 13 双签移除、市民贷 15 syns、市民贷 14 btnj、市民贷 12 lc、市民贷 16 sxdt、车贷 17btnj
  // 进件配置选项
  ipiecesShow: {
    detailTopOrgAuthMoney: [12], // 初审授信金额,
    detailTopOrgScore: [12], // 初审评分
    detailTopOrgRank: [12], // 初审评级
    detailTopFnlScore: [12, 13, 14, 15, 17], // 综合授信审核通过评分
    detailTopFnlRank: [12, 13, 14, 15, 17], // 综合授信审核通过评级
    detailApproveReBackApprove: [12, 13, 14, 15, 16],  // 审批时无打回
    detailApproveReBackCheck: [12, 13, 14, 15, 16, 17],  // 审查时无打回
    detailApproveApproveModify: [12, 13, 14, 15, 16, 17], // 审批审查直接进入编辑状态
    detailApproveApproveTip: [12, 13, 14, 15, 16], // 审批编辑头部 tip
    detailApproveApproveDailyRate: [12, 13, 14, 15, 16], // 审批审查借款日利率回显
    detailApproveApprovePeriod: [12, 13, 14, 15, 16, 17], // 审批还款期数，全可选
    detailApproveApproveKind: [12, 13, 14, 15, 16], // 审批还款方式，全可选
    detailApproveReBackTip: [17] // 打回时无提示
  },
  list: [{
    name: '基本信息',
    formEnName: 'basicInfo',
    type: ['5'],
    component: 'DetailLoanBase',
    url: '/v1/loan/basic',
    data: '',
    mismatch: 'customerMismatch,spouseMismatch'
  },
  {
    name: '基本信息',
    formEnName: 'basicInfo',
    type: ['8'],
    component: 'DetailBaseInfo',
    url: '/v1/loan/basic',
    data: '',
    mismatch: 'customerMismatch,spouseMismatch'
  },
  {
    name: '基本信息',
    formEnName: 'basicInfo',
    type: ['6', '7'],
    component: 'DetailBaseInfoTmp',
    url: '/v1/loan/basic',
    data: '',
    mismatch: 'customerMismatch,spouseMismatch'
  },
  {
    name: '基本信息',
    formEnName: 'basicInfo',
    type: ['12', '14', '15', '16'],
    component: 'DetailBaseCitizen',
    url: '/v1/loan/basic',
    data: '',
    mismatch: 'customerMismatch,spouseMismatch'
  },
  {
    name: '基本信息',
    formEnName: 'basicInfo',
    type: ['17'],
    component: 'DetailBaseCar',
    url: '/v1/loan/basic',
    data: '',
    mismatch: 'customerMismatch,spouseMismatch'
  },
  {
    name: '基本信息',
    formEnName: 'basicInfo',
    type: ['13'],
    component: 'DetailNJBase',
    url: '/v1/loan/basic',
    data: '',
    mismatch: 'customerMismatch,spouseMismatch'
  },
  {
    name: '经营基本信息',
    formEnName: 'businessEntity',
    type: ['6', '8'],
    component: 'DetailBusInfo',
    url: '/v1/loan/business/info',
    data: '',
    mismatch: 'bizInfoMismatch'
  },
  {
    name: '其他经营信息',
    formEnName: 'businessOth',
    type: ['6', '8'],
    component: 'DetailBusOther',
    url: '/v1/loan/business/other',
    data: ''
  },
  {
    name: '经营信息',
    formEnName: 'agriManageInfo',
    type: ['7'],
    component: 'DetailManageFarm',
    url: '/v1/loan/business/agricultural',
    data: ''
  },
  {
    name: '职业信息',
    formEnName: 'proInfo',
    type: ['8'],
    component: 'DetaiProInfo',
    url: '/v1/loan/proInfo',
    data: ''
  },
  {
    name: '上下游单位信息',
    formEnName: 'upDownStreamInfo',
    type: ['7'],
    component: 'DetailManageStr',
    url: '/v1/loan/business/agricultural/updowninfo',
    data: ''
  },
  {
    name: '主营业务分析',
    formEnName: 'mainBusiAna',
    type: ['6', '7', '8'],
    component: 'DetailAnalyBus',
    url: '/v1/loan/business/analysis',
    data: ''
  },
  {
    name: '生产情况分析',
    formEnName: 'prdStatusAna',
    type: ['6', '7', '8'],
    component: 'DetailAnalyPro',
    url: '/v1/loan/business/analysis',
    data: ''
  },
  {
    name: '征信信息',
    formEnName: 'creditQueryInfo',
    type: ['8'],
    component: 'DetailCreditHis',
    url: '/v1/loan/creditHis',
    data: '',
    mismatch: 'creditHisMismatch'
  },
  {
    name: '信贷历史',
    formEnName: 'creditHis',
    type: ['7', '8'],
    component: 'DetailCreditHisTmp',
    url: '/v1/loan/creditHis',
    data: '',
    mismatch: 'creditHisMismatch'
  },
  {
    name: '信贷历史',
    formEnName: 'creditHis',
    type: ['6'],
    component: 'DetailCreditHisPerson',
    url: '/v1/loan/creditHis/customer',
    data: '',
    mismatch: 'creditHisMismatch'
  },
  {
    name: '共同借款人及担保人信息',
    formEnName: 'coBorrowAndGuarantorInfo',
    type: ['8'],
    component: 'DetailCoBoGua',
    url: '/v1/loan/guarantee',
    data: '',
    mismatch: 'coborrowerMismatch,guarantorMismatch'
  },
  {
    name: '共同借款人及担保人信息',
    formEnName: 'coBorrowAndGuarantorInfo',
    type: ['6', '7'],
    component: 'DetailCoBoGuaTmp',
    url: '/v1/loan/guarantee',
    data: '',
    mismatch: 'coborrowerMismatch,guarantorMismatch'
  },
  {
    name: '财务情况',
    formEnName: 'financeInfo',
    type: ['6', '8'],
    component: 'DetailFinance',
    children: [{ name: '资产负债表', component: 'FinanceBalance' }, { name: '损益表', component: 'FinanceIncome' }, { name: '现金流量表', component: 'FinanceCash' }],
    url: ['/v1/loan/assets/info', '/v1/loan/assets/incstat', '/v1/loan/assets/cash/flow'],
    data: null
  },
  {
    name: '财务情况',
    formEnName: 'financeInfo',
    type: ['7'],
    component: 'DetailFinance',     // 财务情况此组件不改变，修改子组件即可
    children: [{ name: '资产负债表', component: 'FarmBalance' }, { name: '损益表', component: 'FarmIncome' }, { name: '现金流量表', component: 'FarmCash' }],
    url: ['/v1/loan/agro/assets', '/v1/loan/agro/assets/incstat', '/v1/loan/agro/assets/cash/flow'],
    data: null
  },
  {
    name: '逻辑校验',
    formEnName: 'logicVerify',
    type: ['6', '8'],
    component: 'DetailLogic',
    url: '/v1/loan/logicVerify/dr',
    data: '',
    mismatch: 'logicDrMismatch'
  },
  {
    name: '资产信息',
    formEnName: 'assetInfo',
    type: ['6', '7', '8'],
    component: 'DetailAssets',
    url: '/v1/loan/assets',
    data: ''
  },
  {
    name: '软信息',
    formEnName: 'softInfo',
    type: ['6', '8'],
    component: 'DetailSoftInfo',
    url: ['/v1/survey/softLisy', '/v1/survey/softInfo'],
    data: null
  },
  {
    name: '软信息',
    formEnName: 'softInfo',
    type: ['7'],
    component: 'DetailFarmSoft',
    url: ['/v1/survey/softLisy', '/v1/survey/softInfo'],
    data: null
  }]
}
// 目前已产品详情中的prdType为动态进行区分
Config.constants.citizenFirstStep = () => {
  let cookies = Store.get(Config.constants.cookies)
  return `MCWP_CITIZEN_FIRST_STEP_${process.env.NODE_ENV}_${cookies.prdType}`
}

export default Config
