import fetch from '../config/fetch'

import config from '../config/index'

/**
 * 获取config接口注入权限验证配置
 * @param {url} 分享的链接
 */
const wechatConfig = () => fetch('GET', '/comm/wechat/sdk/sign', {
  url: config.domain + '/setPwd'
})

/**
 * 获取产品详情
 * @param {code} 产品code
 * @param {style} oss行为
 */
const getProdDesc = (param) => fetch('GET', '/comm/prod/info', param)

/**
 * 借款人信息录入时发送验证码
 * @param {telephone} 手机号
 */
const sendVerifyCode = (param) => fetch('POST', '/comm/loan/customer/telephone', param)

/**
 * 借款人信息录入,经营贷和车抵贷产品入口
 * @param {prdCode} 产品编码
 * @param {managerCode} 客户经理编码
 * @param {cname} 借款人姓名
 * @param {telephone} 联系方式
 * @param {loanUse} 借款用途
 * @param {verifyCode} 验证码
 */
const loanCustomer = (param) => fetch('POST', '/comm/loan/customer', param)

/**
 * 获取车辆详情
 * @param {code} 产品code
 */
const getCarInfo = (param) => fetch('GET', '/comm/loan/asset/car', param)

/**
 * 上传车辆详情
 * @param {code} 产品code
 */
const postCarInfo = (param) => fetch('POST', '/comm/loan/asset/car', param)

/**
 * 获取字典值
 * @param {code} 产品code
 */
const getDictValue = (param) => fetch('GET', '/comm/sys/dict/items', param)

/**
 * 获取字典值
 * @param {code} 产品code
 */
const getDictValueAll = (param) => fetch('GET', '/comm/sys/dict/items/all', param)

/**
 * 客户借款最长返款期数限制
 * @param {code} 产品code
 */
const getPeriodLimit = (param) => fetch('GET', '/wx/v1/repaymentPeriod', param)

/**
 * 获取文件列表
 * @param {bizCode} 进件code
 */
const getFiles = (param) => fetch('GET', '/comm/files/' + param.bizCode, param)

/**
 * 进件OCR
 * @param {code} 进件code
 */
const loanOcr = (param) => fetch('PUT', '/comm/loan/ocr', param)

/**
 * 借款人信息查询
 * @param {code} 进件code
 * @param {style} 图片样式
 */
const getLoanCustomer = (param) => fetch('GET', '/comm/loan/customer', param)

/**
 * 借款人PUT信息
 * @param {code} 进件code
 * @param {cname} 姓名
 * @param {sex} 性别
 * @param {idCardNo} 身份证号
 * @param {idCardAddr} 地址
 */
const putLoanCustomer = (param) => fetch('PUT', '/comm/loan/customer', param)

/**
 * 配偶/亲属信息查询
 * @param {code} 进件code
 */
const getLoanSpouse = (param) => fetch('GET', '/comm/loan/spouse', param)

/**
 * 配偶/亲属信息查询
 * @param {code} 进件code
 */
const postLoanSpouse = (param) => fetch('POST', '/comm/loan/spouse', param)

/**
 * 家庭信息查询
 * @param {code} 进件code
 */
const getLoanFamily = (param) => fetch('GET', '/comm/loan/homeInfo', param)

/**
 * 家庭信息修改
 * @param {code} 进件code
 */
const postLoanFamily = (param) => fetch('POST', '/comm/loan/homeInfo', param)

/**
 * 联系人信息查询
 * @param {code} 进件code
 */
const getLoanLinkman = (param) => fetch('GET', '/comm/loan/linkman', param)

/**
 * 联系人信息修改
 * @param {code} 进件code
 */
const postLoanLinkman = (param) => fetch('POST', '/comm/loan/linkman', param)

/**
 * 公司信息查询
 * @param {code} 进件code
 */
const getLoanBusiness = (param) => fetch('GET', '/comm/v1/loan/businessEntity', param)

/**
 * 公司信息修改
 * @param {code} 进件code
 */
const postLoanBusiness = (param) => fetch('POST', '/comm/v1/loan/businessEntity', param)

/**
 * 企业信息查询
 * @param {code} 进件code
 */
const getLoanAdditional = (param) => fetch('GET', '/comm/loan/additional', param)

/**
 * 企业信息查询
 * @param {code} 进件code
 */
const postLoanAdditional = (param) => fetch('POST', '/comm/loan/additional', param)

/**
 * 获取待提交进件信息
 * @param {code} 进件code
 */
const getLoanConfirm = (param) => fetch('GET', '/comm/loan/req/confirm', param)

/**
 * 房屋评估
 * @param
 */
const hourseEstimate = (param) => fetch('POST', '/comm/v1/hourseEstimate', param)

/**
 * 获取房屋估值信息
 * @param
 */
const getAssetHouse = (param) => fetch('GET', '/comm/loan/asset/house', param)

/**
 * 完成进件
 * @param
 */
const finishLoan = (param) => fetch('PUT', '/comm/loan/req/finish', param)

/**
 * 进件临时登录
 * @param
 */
const detailLogin = (param) => fetch('POST', '/comm/v1/user/login', param)

/**
 * 进件详情
 * @param
 */
const detailLoan = (param, url, token) => fetch('GET', url, param, token)

/**
 * 审批通过
 * @param
 */
const passLoan = (param, token) => fetch('PUT', '/v1/loan/audit/pass', param, token)

/**
 * 审查通过
 * @param
 */
const passCheck = (param, token) => fetch('PUT', '/v1/loan/examine/pass', param, token)

/**
 * 打回提交
 * @param
 */
const rebackLoan = (param, token) => fetch('PUT', '/v1/loan/audit/repulse', param, token)

/**
 * 人工干预
 * @param
 */
const interveneLoan = (param, token) => fetch('post', '/v1/loan/intervene', param, token)

/**
* 审批拒绝
* @param
*/
const auditReject = (param, token) => fetch('PUT', '/v1/loan/audit/reject', param, token)

/**
* 审查拒绝
* @param
*/
const checkReject = (param, token) => fetch('PUT', '/v1/loan/examine/reject', param, token)

/**
* 撤销贷款
* @param
*/
export const loanCancel = (param, token) => fetch('POST', '/v1/loan/cancel', param, token)

/**
 * 获取签名
 * @param
 */
const wechatSign = (param) => fetch('GET', '/comm/wechat/sdk/sign', param)

/**
 * 获取进件CODE
 * @param
 */
const getLoanCode = (param) => fetch('GET', '/comm/loan/code', param)

/**
 * 关键字获取企业列表
 * @param
 */
const getEnterPrises = (param) => fetch('GET', '/comm/enterPrise/list', param)

/**
 * 关键字获取企业信息
 * @param
 */
const getPrisesinfo = (param) => fetch('GET', '/comm/enterPrise/info', param)

/**
 * 关键字获取企业列表
 * @param
 */
const getListProdStep = (param) => fetch('GET', '/comm/v1/listProdStep/' + param.proCode, param)

/**
 * 删除文件
 * @param
 */
const delFile = (param) => fetch('DELETE', '/comm/v1/oss/del/' + param.codes + '/' + param.loanCode, param)

/**
 * 获取微信签名
 * @param
 */
const getWxSign = (param) => fetch('POST', '/comm/wechat/sdk/sign', param)

/**
 * 网页授权
 * @param {enterpriseCode} 企业编码
 * @param {code} 授权编码
 * @param {appId} 公众号APPID
 */
const wxWebAuth = (param) => fetch('POST', '/comm/v1/wx/webAuth', param)

/**
 * 个人中心
 * @param
 */
const wxMe = (param) => fetch('GET', '/wx/v1/me', param)

/**
 * 获取产品列表
 * @param
 */
const getProList = (param) => fetch('GET', '/comm/prod/list/' + param.enterprCode, param)

/**
 * 微信绑定
 * @param
 */
const wxBinding = (param) => fetch('POST', '/wx/v1/binding', param)

/**
 * 获取微信登录验证码
 * @param
 */
const sendWxVerifyCode = (param) => fetch('POST', '/wx/v1/verification', param)

/**
 * 个人中心我的客户经理
 * @param
 */
const meManager = (param) => fetch('GET', '/wx/v1/me/manager', param)

/**
 * 借款计算利息
 * @param
 */
const calcInterest = (param) => fetch('GET', '/wx/v1/calculateInterest', param)

/**
 * 借款还款计划预览
 * @param
 */
const repayPlan = (param) => fetch('GET', '/wx/v1/repaymentPlan/preview', param)

/**
 * 借款还款计划，微信token
 * @param
 */
const repayPlanAct = (param) => fetch('GET', '/wx/v1/repaymentPlan/actual', param)

/**
 * 借款还款计划，非微信token
 * @param
 */
const repayPlanActToken = (param, token) => fetch('GET', '/v1/loan/collection/repaymentPlan', param, token)

/**
 * 银行列表
 * @param
 */
const bankList = (param) => fetch('GET', '/wx/v1/bankcard/bank', param)

/**
 * 借款列表
 * @param
 */
const loanList = (param) => fetch('GET', '/wx/v1/myBorrowInfos', param)

/**
 * 借款详情
 * @param
 */
const loanDetail = (param) => fetch('GET', '/wx/v1/myBorrowInfo', param)

/**
 * 获取微信授权参数
 * @param
 */
const getWxAuthParams = (param) => fetch('GET', '/comm/v1/wx/weixinInfo', param)

/**
 * 个人银行卡
 * @param
 */
const perBankcard = (param) => fetch('GET', '/wx/v1/bankcard/list', param)

/**
 * 借款code
 * @param
 */
const getBorrowCode = (param) => fetch('GET', '/wx/v1/borrowMoney/code', param)

/**
 * 确认借款
 * @param
 */
const borrowMoney = (param) => fetch('POST', '/wx/v1/borrowMoney', param)

/**
* 借款合同
* @param
*/
const getBoContract = (param) => fetch('GET', '/wx/v1/contract', param)

/**
* 借款合同
* @param
*/
const getFinContract = (param) => fetch('GET', '/wx/v1/contract/info/' + param.borrowCode, param)

/**
 * 新增银行卡
 * @param
 */
const addBankcard = (param) => fetch('POST', '/wx/v1/bankcard/add', param)

/**
 * 网点详情
 * @param
 */
const bankoutList = (param) => fetch('GET', '/wx/v1/bankout/list', param)

/**
* 授权合同获取
* @param
*/
const getAccredit = (param) => fetch('GET', '/comm/tpl/authSample/' + param.enterpriseCode)

/**
* 隐私协议获取
* @param
*/
const getPrivacy = (param) => fetch('GET', '/comm/tpl/authSample/privacy', param)

/**
* 授权合同签署
* @param
*/
const getAccreditSign = (param) => fetch('POST', '/comm/contract/authSign', param)

/**
* 网点列表
* @param
*/
export const getBranchList = (param) => fetch('GET', '/comm/bw/v1/branch/list', param)

/**
* 版本信息
* @param
*/
const getVersion = (param) => fetch('GET', '/comm/version', param)

/**
* 获取公众号一键关注地址
* @param
*/
const getFollowurl = (param) => fetch('GET', '/comm/v1/wx/followurl', param)

/**
* 微信文件上传
* @param {bizCode} 业务编号
* @param {mediaId} 图片文件mediaId
* @param {bizType} 业务类型
*/
const wxfilesUpload = (param) => fetch('POST', '/comm/wxfiles/upload', param)

/**
 * 获取小区
 * @param
 */
const getHouseSearch = (param, type) => fetch('GET', type ? '/comm/v1/valuation/search' : '/comm/houseEva/search', param)

/**
 * 获取小区楼栋信息
 * @param
 */
const getHouseBuild = (param, type) => fetch('GET', type ? '/comm/v1/valuation/build' : '/comm/houseEva/build', param)

/**
 * 获取小区单元信息
 * @param
 */
const getHouseUnit = (param, type) => fetch('GET', type ? '/comm/v1/valuation/unit' : '/comm/houseEva/unit', param)

/**
 * 获取小区房号信息
 * @param
 */
const getHouseRoom = (param, type) => fetch('GET', type ? '/comm/v1/valuation/room' : '/comm/houseEva/room', param)

/**
 * 小区估值
 * @param
 */
const getEvaluateRoom = (param, type) => fetch('POST', type ? '/comm/v1/valuation/house' : '/comm/houseEva/evaluate', param)

/**
 * 获取房屋信息
 * @param
 */
const getLoanRoomInfo = (param) => fetch('GET', '/comm/loan/house', param)

/**
 * 编辑房屋信息
 * @param
 */
const postLoanRoomInfo = (param) => fetch('POST', '/comm/loan/house', param)

/**
 * 获取分享有礼信息
 * @param
 */
const getLoanshare = (param) => fetch('GET', '/wx/v1/share', param)

/**
* 分享金额体现
* @param
*/
const postShareDeposit = (param) => fetch('POST', '/wx/v1/share/deposit', param)

/**
* 发送生成任务
* @param
*/
const postTaskMobile = (param) => fetch('POST', '/wx/v1/carrier/create', param)

/**
* 获取任务状态
* @param
*/
const getTaskStatus = (param) => fetch('GET', '/wx/v1/carrier/status', param)

/**
* 验证短信验证码
* @param
*/
const postMobileCode = (param) => fetch('POST', '/wx/v1/carrier/check', param)

/**
* 验证银行短信验证码
* @param
*/
const postBankMobileCode = (param) => fetch('GET', '/wx/za/bank/inputCode', param)

/**
* 获取所有银行列表
* @param
*/
const getBankList = (param) => fetch('GET', '/wx/za/bank/bankList', param)

/**
* 获取所有银行登录方式
* @param
*/
const getLoginMethod = (param) => fetch('GET', '/wx/za/bank/loginMethod', param)

/**
* 输入账号密码登录，获得taskId
* @param
*/
const getLoginTaskId = (param) => fetch('GET', '/wx/za/bank/createTask', param)

/**
* 获取银行卡绑定状态
* @param
*/
const getBankTaskStatus = (param) => fetch('POST', '/wx/za/bank/taskStatus', param)

/**
* 扫码确定登录
* @param
*/
const postQrLogin = (param) => fetch('POST', '/comm/v1/scan/user/login', param)

/**
 * 抽奖机会和参与人数
 * @param
 */
const getActivityList = (param) => fetch('GET', '/wx/v1/op/lottery/aclist', param)
/**
 * 抽奖参与资格
 * @param
 */
export const getTurntableLimit = (param) => fetch('GET', '/wx/v1/op/join/limit', param)
/**
 * 抽奖参与资格验证
 * @param
 */
export const checkJoinLimit = (param) => fetch('GET', '/wx/v1/op/check/join/limit', param)
/**
 * 抽奖参与资格发送验证码
 * @param
 */
const sendCheckVerifyCode = (param) => fetch('POST', '/wx/v1/op/lottery/telephone', param)

/**
 * 抽奖机会和参与人数
 * @param
 */
const getTurntablePerson = (param) => fetch('GET', '/wx/v1/op/lottery/basic', param)

/**
 * 奖品列表
 * @param
 */
const getTurntablePrize = (param) => fetch('GET', '/wx/v1/op/lottery/list', param)

/**
 * 中奖轮播
 * @param
 */
const getTurntableSlider = (param) => fetch('GET', '/wx/v1/op/lottery/notice', param)

/**
 * 抽奖
 * @param
 */
const getTurntableDraw = (param) => fetch('GET', '/wx/v1/op/lottery/drawprize', param)

/**
 * 活动说明 我的奖品
 * @param
 */
const getTurntableDes = (param) => fetch('GET', '/wx/v1/op/lottery/info', param)

/**
 * 活动说明 我的奖品详情
 * @param
 */
const getLotteryPrdetail = (param) => fetch('GET', '/wx/v1/op/lottery/prdetail', param)

/**
* 兑奖绑定发送验证码
* @param
*/
const postLotteryTelephone = (param) => fetch('POST', '/wx/v1/op/lottery/telephone', param)

/**
* 兑换奖品
* @param
*/
const putLotteryBindinfo = (param) => fetch('PUT', '/wx/v1/op/lottery/bindinfo', param)
/**
* 兑换奖品（有资格限制）
* @param
*/
export const putLotteryBindinfoLimit = (param) => fetch('PUT', '/wx/v1/op/lottery/bindinfo/joinlimit', param)
/**
* 获取用户信息
* @param
*/
export const getPersonDetail = (param) => fetch('GET', '/wx/v1/op/user/info', param)

/**
* 活动状态
* @param
*/
const getTurntableDetail = (param) => fetch('GET', '/wx/v1/op/lottery/ACdetail', param)

/**
* 分享得机会
* @param
*/
const postShareTimes = (param) => fetch('POST', '/wx/v1/op/lottery/share', param)

/**
* 获取产品二维码
* @param
*/
const getLotteryQrcode = (param) => fetch('GET', '/wx/v1/op/lottery/qrcode', param)

/**
* 获取图片列表 OSS 无TOKEN
* @param
*/
const getOSSPic = (param) => fetch('GET', `/comm/v1/oss/${param.bizCode}/${param.bizTypes}/${param.fileTypes}`, param)

/**
* 获取图片列表 OSS 需要TOKEN
* @param
*/
const getOSSPicToken = (param, token) => fetch('GET', `/v1/oss/${param.bizCode}/${param.bizTypes}/${param.fileTypes}`, param, token)

/**
* 房抵贷进件图片获取
* @param {reqCode} 进件编码
*/
const getHouseFiles = (param) => fetch('GET', '/comm/loan/house/files', param)

/**
 * 获取进件调查初审信息
 */
const getFirstAudit = (param, token) => fetch('GET', '/v1/house/survey/firstAudit', param, token)

/**
 * 市民贷配偶信息获取
 */
const getCitizenSpouse = (param, token) => fetch('get', '/comm/citizen/v1/spouse', param, token)

/**
 * 市民贷配偶信息录入
 */
const postCitizenSpouse = (param, token) => fetch('post', '/comm/citizen/v1/spouse', param, token)

/**
 * 市民贷增额信息获取
 */
const getCitizenAdditional = (param, token) => fetch('get', '/comm/citizen/v1/additional', param, token)

/**
 * 市民贷增额信息录入
 */
const postCitizenAdditional = (param, token) => fetch('post', '/comm/citizen/v1/additional', param, token)

/**
 * 市民贷获取照片信息
 */
const getCitizenFiles = (param, token) => fetch('get', '/comm/citizen/v1/files', param, token)

/**
 * 通用获取照片信息
 */
export const getLoanFiles = (param, token) => fetch('get', '/comm/loan/files', param, token)

/**
 * 进件签名
 */
export const postSignature = (param, token) => fetch('post', '/comm/v1/loan/signature', param, token)

/**
 * 提交初审审批
 * @param
 */
export const postFirstAudit = (param, url) => fetch('POST', url, param)

export { getOSSPic, getOSSPicToken, getBorrowCode, checkReject, passCheck, getPrivacy, getActivityList, postShareTimes, getTurntableDetail, getTurntableDes, getTurntableDraw, getTurntableSlider, getTurntablePrize, getTurntablePerson, postQrLogin, postBankMobileCode, getBankTaskStatus, getLoginTaskId, getLoanRoomInfo, getEvaluateRoom, getHouseSearch, getHouseBuild, getHouseUnit, getHouseRoom, wechatConfig, getProdDesc, getCarInfo, postCarInfo, getDictValue, getDictValueAll, sendVerifyCode, loanCustomer, getFiles, loanOcr, getLoanCustomer, putLoanCustomer, getLoanSpouse, postLoanSpouse, getLoanAdditional, postLoanAdditional, getLoanConfirm, hourseEstimate, getAssetHouse, finishLoan, wechatSign, getLoanCode, getEnterPrises, getListProdStep, delFile, getWxSign, detailLoan, detailLogin, passLoan, wxWebAuth, wxMe, wxBinding, sendWxVerifyCode, meManager, getProList, calcInterest, repayPlan, bankList, loanList, loanDetail, repayPlanAct, perBankcard, borrowMoney, addBankcard, bankoutList, getWxAuthParams, getAccredit, getAccreditSign, auditReject, getBoContract, getPeriodLimit, getVersion, getFollowurl, getFinContract, wxfilesUpload, repayPlanActToken, postLoanFamily, getLoanFamily, postLoanLinkman, getLoanLinkman, getLoanBusiness, postLoanBusiness, getLoanshare, postShareDeposit, postLoanRoomInfo, rebackLoan, getPrisesinfo, postTaskMobile, getTaskStatus, postMobileCode, getBankList, getLoginMethod, interveneLoan, getLotteryPrdetail, postLotteryTelephone, putLotteryBindinfo, getLotteryQrcode, getHouseFiles, getFirstAudit, postCitizenSpouse, getCitizenSpouse, getCitizenAdditional, postCitizenAdditional, getCitizenFiles, sendCheckVerifyCode }
