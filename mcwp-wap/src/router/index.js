import Config from '../config/index'
const ProductDetail = r => require.ensure([], () => r(require('../pages/product/detail')), 'ProductDetail') // 产品详情页
// const ProductDetailSeven = r => require.ensure([], () => r(require('../pages/product/detailSeven')), 'ProductDetailSeven') // 产品详情页
// const ProductDetailSix = r => require.ensure([], () => r(require('../pages/product/detailSix')), 'ProductDetailSix') // 产品详情页
const LoanMobile = r => require.ensure([], () => r(require('../pages/loan/mobile')), 'LoanMobile') // 申请贷款--联系方式
const LoanIdCard = r => require.ensure([], () => r(require('../pages/loan/idCard')), 'LoanIdCard') // 申请贷款--身份证核实
const LoanCarModal = r => require.ensure([], () => r(require('../pages/citizen/carSelect')), 'LoanCarModal') // 申请贷款--车型选择
const LoanContact = r => require.ensure([], () => r(require('../pages/loan/contact')), 'LoanContact') // 申请贷款--配偶/亲属信息
const LoanCompany = r => require.ensure([], () => r(require('../pages/loan/company')), 'LoanCompany') // 申请贷款--企业相关信息
const LoanConfirm = r => require.ensure([], () => r(require('../pages/loan/confirm')), 'LoanConfirm') // 申请贷款--确认信息
const LoanCar = r => require.ensure([], () => r(require('../pages/loan/car')), 'LoanCar') // 申请贷款--网贷车抵贷
const LoanHouse = r => require.ensure([], () => r(require('../pages/loan/house')), 'LoanHouse') // 申请贷款--网贷房抵贷
const LoanHouseEvaluation = r => require.ensure([], () => r(require('../pages/loan/houseEvaluation')), 'LoanHouseEvaluation') // 申请贷款--网贷房估值
const LoanUserInfo = r => require.ensure([], () => r(require('../pages/loan/userInfo')), 'LoanUserInfo') // 申请贷款--用户信息核实
const LoanAccredit = r => require.ensure([], () => r(require('../pages/loan/accredit')), 'LoanAccredit') // 申请贷款--服务授权
const LoanAccreditView = r => require.ensure([], () => r(require('../pages/loan/contract')), 'LoanAccreditView') // 申请贷款--服务授权查看
const IpiecesDetail = r => require.ensure([], () => r(require('../pages/ipieces/detail.vue')), 'IpiecesDetail') // 进件详情
const IpiecesRefuse = r => require.ensure([], () => r(require('../pages/ipieces/refuse.vue')), 'IpiecesRefuse') // 进件详情
const TrialReport = r => require.ensure([], () => r(require('../pages/ipieces/trialReport.vue')), 'TrialReport') // 进件 —— 初审报告
const TestApp = r => require.ensure([], () => r(require('../pages/test/testApp')), 'TestApp') // 测试页
const ApplicationDownload = r => require.ensure([], () => r(require('../pages/common/applicationDownload.vue')), 'ApplicationDownload') // 应用下载
// 1.5贷款更新
const FamilyV15 = r => require.ensure([], () => r(require('../pages/loan/familyV15')), 'FamilyV15') // 申请贷款--家庭信息
const ContactV15 = r => require.ensure([], () => r(require('../pages/loan/contactV15')), 'ContactV15') // 申请贷款--家庭信息
const LoanCompanyV15 = r => require.ensure([], () => r(require('../pages/loan/companyV15')), 'LoanCompanyV15') // 申请贷款--企业相关信息
const OperateFlowV15 = r => require.ensure([], () => r(require('../pages/loan/operateFlowV15')), 'OperateFlowV15') // 申请贷款--企业相关信息
const LoanRefuse = r => require.ensure([], () => r(require('../pages/loan/refuse')), 'LoanRefuse') // 拒绝
// 房抵贷
const HouseLoan = r => require.ensure([], () => r(require('../pages/house/house')), 'HouseLoan') // 申请贷款--企业相关信息
const HouseLocation = r => require.ensure([], () => r(require('../pages/house/location')), 'HouseLocation') // 申请贷款--企业相关信息
// const HouseEvaluation = r => require.ensure([], () => r(require('../pages/house/evaluation')), 'HouseEvaluation') // 申请贷款--企业相关信息
const HouseApply = r => require.ensure([], () => r(require('../pages/house/apply')), 'HouseApply') // 申请贷款--企业相关信息
const HouseSuccess = r => require.ensure([], () => r(require('../pages/house/success')), 'HouseSuccess') // 申请贷款--企业相关信息
const HouseCert = r => require.ensure([], () => r(require('../pages/house/cert')), 'HouseCert') // 申请贷款--房产证照片
// 分享有礼
const ShareIntroduce = r => require.ensure([], () => r(require('../pages/share/introduce')), 'ShareIntroduce') // 申请贷款--企业相关信息
const SharePersonal = r => require.ensure([], () => r(require('../pages/share/personal')), 'SharePersonal') // 申请贷款--企业相关信息
const ShareSuccess = r => require.ensure([], () => r(require('../pages/share/success')), 'ShareSuccess') // 申请贷款--企业相关信息
// 活动-抽奖
const ActivityList = r => require.ensure([], () => r(require('../pages/activity/list.vue')), 'ActivityList') // 活动列表
const ActivityTurntable = r => require.ensure([], () => r(require('../pages/activity/turntable')), 'ActivityTurntable') // 抽奖转盘
const ActivityPrize = r => require.ensure([], () => r(require('../pages/activity/prize.vue')), 'ActivityPrize') // 抽奖转盘
const PrizeDetail = r => require.ensure([], () => r(require('../pages/activity/prizeDetail.vue')), 'PrizeDetail') // 奖品详情
const PrizeResult = r => require.ensure([], () => r(require('../pages/activity/result.vue')), 'PrizeResult') // 兑奖结果
// 活动-房屋估值排名
const ActivityValuation = r => require.ensure([], () => r(require('../pages/activity/valuation')), 'ActivityValuation') // 活动估值排名
const ActivityValuationResult = r => require.ensure([], () => r(require('../pages/activity/valuation/result.vue')), 'ActivityValuationResult') // 活动估值排名
// 扫码登录
const QrLogin = r => require.ensure([], () => r(require('../pages/common/qrLogin.vue')), 'QrLogin') // 扫码登录
// 估值工具
const ValuationMarket = r => require.ensure([], () => r(require('../pages/valuation/market.vue')), 'ValuationMarket') // 营销宣传
const ValuationCar = r => require.ensure([], () => r(require('../pages/valuation/car.vue')), 'ValuationCar') // 车辆估值
// const ValuationHouse = r => require.ensure([], () => r(require('../pages/valuation/house.vue')), 'ValuationHouse') // 房屋估值
const ValuationWages = r => require.ensure([], () => r(require('../pages/valuation/wages.vue')), 'ValuationWages') // 工资估值
const ValuationResult = r => require.ensure([], () => r(require('../pages/valuation/result.vue')), 'ValuationResult') // 估值结果
const ValuationSales = r => require.ensure([], () => r(require('../pages/valuation/sales.vue')), 'ValuationSales') // 营销估值
const ValuationSuccess = r => require.ensure([], () => r(require('../pages/valuation/success.vue')), 'ValuationSuccess') // 营销成功

const mentionAmount = r => require.ensure([], () => r(require('../pages/borrow/mentionAmount .vue')), 'mentionAmount') // 微信借贷--提额
const BorrowProduct = r => require.ensure([], () => r(require('../pages/borrow/product.vue')), 'BorrowProduct') // 微信借贷--产品展示
const BorrowLogin = r => require.ensure([], () => r(require('../pages/borrow/login.vue')), 'BorrowLogin') // 微信借贷--用户登录
const BorrowLoanList = r => require.ensure([], () => r(require('../pages/borrow/loanList.vue')), 'BorrowLoanList') // 微信借贷--我的借款
const BorrowPersonal = r => require.ensure([], () => r(require('../pages/borrow/personal.vue')), 'BorrowPersonal') // 微信借贷--个人中心
const BorrowRepayPlan = r => require.ensure([], () => r(require('../pages/borrow/repayPlan.vue')), 'BorrowRepayPlan') // 微信借贷--还款计划
const BorrowAddBankcard = r => require.ensure([], () => r(require('../pages/borrow/addBankcard.vue')), 'BorrowAddBankcard') // 微信借贷--添加银行卡
const BorrowAccountManager = r => require.ensure([], () => r(require('../pages/borrow/accountManager.vue')), 'BorrowAccountManager') // 微信借贷--我的客户经理
const BorrowrBankDot = r => require.ensure([], () => r(require('../pages/borrow/bankDot.vue')), 'BorrowrBankDot') // 微信借贷--网点展示
const BankLocation = r => require.ensure([], () => r(require('../pages/borrow/bankLocation.vue')), 'BankLocation') // 微信借贷--网点位置
const BorrowrLoanSelect = r => require.ensure([], () => r(require('../pages/borrow/loanSelect.vue')), 'BorrowrLoanSelect') // 微信借贷--借款选择
const BorrowrPurpose = r => require.ensure([], () => r(require('../pages/borrow/purpose.vue')), 'BorrowrPurpose') // 微信借贷--借款
const BorrowrLoanDetail = r => require.ensure([], () => r(require('../pages/borrow/loanDetail.vue')), 'BorrowrLoanDetail') // 微信借贷--贷款拒绝
const BorrowrContract = r => require.ensure([], () => r(require('../pages/borrow/contract.vue')), 'BorrowrContract') // 微信借贷--借款合同
const BorrowrSuccess = r => require.ensure([], () => r(require('../pages/borrow/success.vue')), 'BorrowrSuccess') // 微信借贷--借款成功
const WeChatAuth = r => require.ensure([], () => r(require('../pages/common/weChatAuth.vue')), 'WeChatAuth') // 微信授权中间页

// 市民贷
const citizenBase = r => require.ensure([], () => r(require('../pages/citizenExt/base.js')), 'citizenBase') // 市民贷-基本信息
const citizenMarriage = r => require.ensure([], () => r(require('../pages/citizen/marriage.vue')), 'citizenMarriage') // 市民贷-婚姻信息
const citizenPhoto = r => require.ensure([], () => r(require('../pages/citizen/photo.vue')), 'citizenPhoto') // 市民贷-拍照信息
const citizenIncrement = r => require.ensure([], () => r(require('../pages/citizen/increment.vue')), 'citizenIncrement') // 市民贷-增额信息
const citizenResult = r => require.ensure([], () => r(require('../pages/citizen/result.vue')), 'citizenResult') // 市民贷-增额信息
const signature = r => require.ensure([], () => r(require('../pages/citizen/signature')), 'signature')
const signContract = r => require.ensure([], () => r(require('../pages/citizen/signContract.vue')), 'signContract') // 通用-结果

// 通用
const comBase = r => require.ensure([], () => r(require('../pages/ext/base.js')), 'comBase') // 通用-基本信息
const comPhoto = r => require.ensure([], () => r(require('../pages/ext/photo.js')), 'comPhoto') // 通用-照片
const comRes = r => require.ensure([], () => r(require('../pages/ext/res.js')), 'comRes') // 通用-结果

export default [{
  path: '/h5/product/detail', // 产品详情页
  component: ProductDetail,
  meta: {
    title: 'prdDetail',
    shareCountPlus: '贷款产品分享'
  }
}, {
  path: '/h5/loan/mobile/:type?', // 申请贷款--联系方式
  component: LoanMobile,
  meta: {
    title: '申请贷款',
    redirect: 'proDes'
  }
}, {
  path: Config.constants.carSelectRouter, // 申请贷款--身份证核实
  component: LoanCarModal,
  meta: {
    title: '申请贷款',
    redirect: 'proDes'
  }
}, {
  path: '/h5/loan/idcard', // 申请贷款--身份证核实
  component: LoanIdCard,
  meta: {
    title: '身份证核实',
    redirect: 'proDes'
  }
}, {
  path: '/h5/loan/idcard/:type', // 申请贷款--身份证核实
  component: LoanIdCard,
  meta: {
    title: '身份证核实',
    redirect: 'proDes'
  }
}, {
  path: '/h5/loan/userinfo', // 申请贷款--用户信息核实
  component: LoanUserInfo,
  meta: {
    title: '身份核实',
    redirect: 'proDes'
  }
}, {
  path: '/h5/loan/userinfo/:type', // 申请贷款--用户信息核实
  component: LoanUserInfo,
  meta: {
    title: '身份核实',
    redirect: 'proDes'
  }
}, {
  path: Config.constants.familyV15Router, // 申请贷款--家庭信息  v1.5
  name: 'familyV15',
  component: FamilyV15,
  meta: {
    title: '填写家庭情况',
    redirect: 'proDes'
  }
}, {
  path: '/h5/loan/contact', // 申请贷款--配偶/亲属信息
  component: LoanContact,
  meta: {
    title: '申请贷款',
    redirect: 'proDes'
  }
}, {
  path: Config.constants.contactV15Router, // 申请贷款--联系人  v1.5
  name: 'contactV15',
  component: ContactV15,
  meta: {
    title: '填写联系人信息',
    redirect: 'proDes'
  }
}, {
  path: '/h5/loan/company', // 申请贷款--企业相关信息
  component: LoanCompany,
  meta: {
    title: '申请贷款',
    redirect: 'proDes'
  }
}, {
  path: Config.constants.loanCompanyV15Router, // 申请贷款--企业相关信息  v1.5
  name: 'loanCompanyV15',
  component: LoanCompanyV15,
  meta: {
    title: '填写经营信息',
    redirect: 'proDes'
  }
}, {
  path: Config.constants.operateFlowV15Router, // 申请贷款--经营流水  v1.5
  name: 'operateFlowV15',
  component: OperateFlowV15,
  meta: {
    title: '申请贷款',
    redirect: 'proDes'
  }
}, {
  path: '/h5/loan/confirm', // 申请贷款--确认信息
  component: LoanConfirm,
  meta: {
    title: '申请贷款',
    redirect: 'proDes',
    serviceAuth: true
  }
}, {
  path: Config.constants.loanRefuseRouter, // 审核失败
  component: LoanRefuse,
  meta: {
    title: '申请贷款',
    redirect: 'proDes',
    serviceAuth: true
  }
}, {
  path: '/h5/loan/car', // 申请贷款--网贷车抵贷
  name: 'loanCar',
  component: LoanCar,
  meta: {
    title: '申请贷款',
    redirect: 'proDes'
  }
}, {
  path: '/h5/loan/house', // 申请贷款--网贷房抵贷
  name: 'loanHouse',
  component: LoanHouse,
  meta: {
    title: '申请贷款',
    redirect: 'proDes'
  }
}, {
  path: '/h5/loan/house/evaluation', // 申请贷款--网贷房估值
  name: 'loanHouseEvaluation',
  component: LoanHouseEvaluation,
  meta: {
    title: '申请贷款',
    redirect: 'proDes'
  }
}, {
  path: '/h5/loan/accredit', // 申请贷款--服务授权
  name: 'loanAccredit',
  component: LoanAccredit,
  meta: {
    title: '服务授权',
    redirect: 'proDes'
  }
}, {
  path: '/h5/loan/contract', // 申请贷款--服务授权查看
  name: 'loanAccreditView',
  component: LoanAccreditView,
  meta: {
    title: '服务授权'
  }
}, {
  path: '/h5/ipieces/detail', // 进件详情--经营贷网贷
  name: 'ipiecesDetail',
  component: IpiecesDetail,
  meta: {
    title: '进件详情'
  }
}, {
  path: '/h5/ipieces/approve', // 进件审批
  name: 'ipiecesDetail',
  component: IpiecesDetail,
  meta: {
    title: '进件详情'
  }
}, {
  path: '/h5/ipieces/refuse', // 进件审批--审批拒绝
  name: 'ipiecesRefuse',
  component: IpiecesRefuse,
  meta: {
    title: '进件审批拒绝'
  }
}, {
  path: '/h5/trial/report', // 进件 —— 初审报告
  name: 'trialReport',
  component: TrialReport,
  meta: {
    title: '初审报告'
  }
}, {
  path: '/h5/borrow/product', // 微信借贷--产品展示
  name: 'borrowProduct',
  component: BorrowProduct,
  meta: {
    title: '产品列表',
    code: true
  }
}, {
  path: '/h5/borrow/mention', // 微信借贷--产品展示
  name: 'mentionAmount',
  component: mentionAmount,
  meta: {
    title: '提额',
    code: true
  }
}, {
  path: '/h5/borrow/login', // 微信借贷--个人中心--登录
  name: 'borrowLogin',
  component: BorrowLogin,
  meta: {
    title: '用户登录',
    auth: true
  }
}, {
  path: '/h5/borrow/loanList', // 微信借贷--我的借款详情
  name: 'borrowLoanList',
  component: BorrowLoanList,
  meta: {
    title: '我的借款',
    auth: true
  }
}, {
  path: '/h5/borrow/personal', // 微信借贷--个人中心
  name: 'borrowPersonal',
  component: BorrowPersonal,
  meta: {
    title: '个人中心',
    auth: true,
    code: true
  }
}, {
  path: '/h5/borrow/repay/plan/:code', // 微信借贷--还款计划
  name: 'borrowRepayPlan',
  component: BorrowRepayPlan,
  meta: {
    title: '还款计划',
    auth: true,
    code: true
  }
}, {
  path: '/h5/borrow/addBankcard', // 微信借贷--添加银行卡
  name: 'borrowAddBankcard',
  component: BorrowAddBankcard,
  meta: {
    title: '添加银行卡',
    auth: true
  }
}, {
  path: '/h5/borrow/accountManager', // 微信借贷--我的客户经理
  name: 'borrowAccountManager',
  component: BorrowAccountManager,
  meta: {
    title: '我的客户经理',
    auth: true
  }
}, {
  path: '/h5/borrow/bankDot', // 微信借贷--网点展示
  name: 'borrowBankDot',
  component: BorrowrBankDot,
  meta: {
    title: '网点展示',
    auth: true
  }
}, {
  path: '/h5/borrow/bankDot/location', // 微信借贷--网点位置
  name: 'bankLocation',
  component: BankLocation,
  meta: {
    title: '地图展示'
  }
}, {
  path: '/h5/borrow/loanSelect', // 微信借贷--借款选择  个人中心5跳转
  name: 'borrowLoanSelect',
  component: BorrowrLoanSelect,
  meta: {
    title: '借款选择',
    auth: true
  }
}, {
  path: '/h5/borrow/loanDetail/:code', // 微信借贷--借款详情  多种
  name: 'borrowLoanDetail',
  component: BorrowrLoanDetail,
  meta: {
    auth: true,
    title: '借款'              // 动态赋值
  }
}, {
  path: '/h5/borrow/contract', // 微信借贷--借款合同
  name: 'borrowrContract',
  component: BorrowrContract,
  meta: {
    title: '借款合同',
    auth: true
  }
}, {
  path: '/h5/borrow/purpose', // 微信借贷--借款、确认借款
  name: 'borrowPurpose',
  component: BorrowrPurpose,
  meta: {
    title: '借款',
    auth: true
  }
}, {
  path: '/h5/borrow/success', // 微信借贷--借款成功
  name: 'borrowrSuccess',
  component: BorrowrSuccess,
  meta: {
    title: '借款',
    auth: true
  }
}, {
  path: Config.constants.houseLoanRouter, // 经营贷——房抵贷
  name: 'houseLoan',
  component: HouseLoan,
  meta: {
    title: '申请贷款'
  }
}, {
  path: Config.constants.houseLocationRouter, // 房抵贷地点
  name: 'houseLocation',
  component: HouseLocation,
  meta: {
    title: '申请贷款'
  }
}, {
  path: `${Config.constants.houseLocationRouter}/:type`, // 房抵贷地点
  name: 'houseLocation',
  component: HouseLocation,
  meta: {
    title: '申请贷款'
  }
  // }, {
  //   path: Config.constants.houseEvaluationRouter, // 房抵贷估值
  //   name: 'houseEvaluation',
  //   component: HouseEvaluation,
  //   meta: {
  //     title: '申请贷款'
  //   }
}, {
  path: Config.constants.houseApplyRouter, // 房抵贷申请（/h5/house/apply）
  name: 'houseApply',
  component: HouseApply,
  meta: {
    title: '申请贷款'
  }
}, {
  path: Config.constants.houseSuccessRouter, // 房抵贷成功
  name: 'houseSuccess',
  component: HouseSuccess,
  meta: {
    title: '申请贷款'
  }
}, {
  path: Config.constants.houseCertRouter, // 申请贷款--房产证照片
  name: 'houseCert',
  component: HouseCert,
  meta: {
    title: '申请贷款'
  }
}, {
  path: Config.constants.shareIntroduceRouter, // 分享有礼
  name: 'shareIntroduce',
  component: ShareIntroduce,
  meta: {
    title: '分享有礼'
  }
}, {
  path: Config.constants.sharePersonalRouter, // 我的佣金
  name: 'sharePersonal',
  component: SharePersonal,
  meta: {
    title: '我的佣金'
  }
}, {
  path: Config.constants.shareSuccessRouter, // 提现成功
  name: 'shareSuccess',
  component: ShareSuccess,
  meta: {
    title: '分享有礼'
  }
}, {
  path: Config.constants.activityList, // 抽奖转盘
  name: 'activityList',
  component: ActivityList,
  meta: {
    title: '活动列表'
  }
}, {
  path: Config.constants.activityTurntable, // 抽奖转盘
  name: 'activityTurntable',
  component: ActivityTurntable,
  meta: {
    title: '抽奖活动',
    countPlus: '浏览抽奖活动'
  }
}, {
  path: `${Config.constants.activityPrize}/:code/:type`, // 抽奖转盘
  name: 'activityPrize',
  component: ActivityPrize,
  meta: {
    title: '抽奖活动'
  }
}, {
  path: `${Config.constants.prizeDetail}/:code`, // 奖品详情
  name: 'prizeDetail',
  component: PrizeDetail,
  meta: {
    title: '抽奖活动'
  }
}, {
  path: `${Config.constants.prizeResult}/:type`, // 兑换结果
  name: 'prizeResult',
  component: PrizeResult,
  meta: {
    title: '抽奖活动'
  }
}, {
  path: Config.constants.ActivityValuation, // 活动排名估值
  name: 'activityValuation',
  component: ActivityValuation,
  meta: {
    title: '朋友圈排名'
  }
}, {
  path: Config.constants.ActivityValuationResult, // 活动排名估值
  name: 'activityValuationResult',
  component: ActivityValuationResult,
  meta: {
    title: '朋友圈排名'
  }
}, {
  path: Config.constants.qrLogin, // 扫码登录
  name: 'qrlogin',
  component: QrLogin,
  meta: {
    title: '扫码登录'
  }
}, {
  path: Config.constants.ValuationMarket, // 估值工具
  name: 'ValuationMarket',
  component: ValuationMarket,
  meta: {
    title: '估值工具'
  }
}, {
  path: Config.constants.ValuationCar, // 车辆估值
  name: 'ValuationCar',
  component: ValuationCar,
  meta: {
    title: '车辆估值'
  }
}, {
  path: Config.constants.ValuationHouse, // 房屋估值，共用(/h5/house/loan/:type)
  name: 'HouseLoan',
  component: HouseLoan,
  meta: {
    title: '房屋估值'
  }
}, {
  path: Config.constants.ValuationWages, // 工资估值
  name: 'ValuationWages',
  component: ValuationWages,
  meta: {
    title: '工资估值'
  }
}, {
  path: Config.constants.ValuationResult, // 估值结果
  name: 'ValuationResult',
  component: ValuationResult,
  meta: {
    title: '估值结果'
  }
}, {
  path: Config.constants.ValuationSales, // 营销推广页
  name: 'ValuationSales',
  component: ValuationSales,
  meta: {
    title: '贷款申请'
  }
}, {
  path: Config.constants.ValuationSuccess, // 营销推广页
  name: 'ValuationSuccess',
  component: ValuationSuccess,
  meta: {
    title: '贷款申请'
  }
}, {
  path: Config.constants.businessBase, // 市民贷基本信息
  name: 'businessBase',
  component: () => import('../pages/BusinessExt/base.js'),
  props: true,
  meta: {
    title: '基本信息',
    shareCountPlus: '贷款产品分享'
  }
}, {
  path: Config.constants.citizenBaseOptional, // 市民贷基本信息
  name: 'citizenBase',
  component: citizenBase,
  props: true,
  meta: {
    title: '基本信息',
    shareCountPlus: '贷款产品分享'
  }
}, {
  path: Config.constants.baseOptional, // 通用基本信息
  name: 'base',
  component: comBase,
  props: true,
  meta: {
    title: '基本信息',
    shareCountPlus: '贷款产品分享'
  }
}, {
  path: Config.constants.photoOptional, // 通用基本信息
  name: 'photo',
  component: comPhoto,
  props: true,
  meta: {
    title: '拍照信息',
    shareCountPlus: '贷款产品分享'
  }
}, {
  path: Config.constants.contractOptional, // 申请贷款--服务授权查看
  name: 'contract',
  component: signContract,
  meta: {
    title: '服务授权'
  }
}, {
  path: Config.constants.citizenMarriage, // 市民贷婚姻信息
  name: 'citizenMarriage',
  component: citizenMarriage,
  meta: {
    title: '婚姻信息',
    shareCountPlus: '贷款产品分享'
  }
}, {
  path: Config.constants.citizenPhoto, // 市民贷拍照信息
  name: 'citizenPhoto',
  component: citizenPhoto,
  meta: {
    title: '拍照信息',
    shareCountPlus: '贷款产品分享'
  }
}, {
  path: Config.constants.citizenIncrement, // 市民贷增额信息
  name: 'citizenIncrement',
  component: citizenIncrement,
  meta: {
    title: '增额信息',
    shareCountPlus: '贷款产品分享'
  }
}, {
  path: Config.constants.citizenResultOptional, // 市民贷结果页面
  name: 'citizenResult',
  component: citizenResult,
  props: true,
  meta: {
    title: '申请贷款',
    shareCountPlus: '贷款产品分享'
  }
}, {
  path: Config.constants.resultOptional, // 市民贷结果页面
  name: 'result',
  component: comRes,
  props: true,
  meta: {
    title: '申请贷款',
    shareCountPlus: '贷款产品分享'
  }
}, {
  path: Config.constants.signatureOptional,
  name: 'signature',
  component: signature,
  meta: {
    title: '申请贷款'
  }
}, {
  path: '/h5/common/wxAuth', // 微信授权中间页
  name: 'weChatAuth',
  component: WeChatAuth,
  meta: {
    title: '正在授权...'
  }
}, {
  path: '/h5/common/download', // 微信授权中间页
  name: 'ApplicationDownload',
  component: ApplicationDownload,
  meta: {
    title: '应用下载'
  }
}, {
  path: '/h5/test/app',
  component: TestApp,
  meta: {
    title: '测试页面'
  }
}, {
  path: '*',
  redirect: '/h5/borrow/personal',              // '/h5/product/detail', // 不匹配时跳转productDetail页面
  meta: {
    title: 'prdDetail'
  }
}]

