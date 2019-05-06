import fetch from "./";

/**
 * 微信绑定
 * @param
 */
export const wxBinding = param => fetch("POST", "/wx/v1/binding", param);

/**
 * 发送短信验证码
 * @param
 */
export const sendWxVerifyCode = param =>
  fetch("POST", "/wx/v1/verification", param);

/**
 * active-controller : 活动相关共用的接口 / 砍价活动页面 / 首页banner图：3
 * @param
 */
export const getActives = param => fetch("GET", "/wx/v1/active/actives", param);

/**
 * 常见问题、问题中心
 * @param
 */
export const getActiveQuestions = param =>
  fetch("GET", "/wx/v1/active/questions", param);

/**
 * 常见问题详情
 * @param
 */
export const getActiveQuestion = param =>
  fetch("GET", "/wx/v1/active/show/question", param);

/**
 * 图形验证码
 * @param
 */
export const postImgShare = param =>
  fetch("POST", "/wx/v1/share/sendVerifyCode", param);

/**
 * 获取图形验证码
 * @param
 */
export const getImgShare = param => fetch("GET", "/comm/captcha", param);

/**
 * 产品分享接口
 * @param
 */
export const postProdShare = param =>
  fetch("POST", "/wx/v1/binding/share", param);

/**
 * 首页公告
 * @param
 */
export const getNotices = param => fetch("GET", "/wx/v1/active/notices", param);

/**
 * 商家推广二维码
 * @param
 */
export const getGenQRCodes = param =>
  fetch("GET", "/wx/v1/merchant/getQRCode", param);

/**
 * 微信我的借款列表
 * @param
 */
export const getMyBorrowInfos = param =>
  fetch("GET", "/wx/v1/myBorrowInfos", param);

/**
 * 还款计划,潞城银行
 * @param
 */
export const getRepaymentPlanLc = param =>
  fetch("GET", "/wx/v1/repaymentPlan/lc", param);

/**
 * 获取公积金认证状态
 * @returns {Promise<*>}
 */
export const getReservedFundState = () =>
  fetch("GET", "/wx/v1/sys/mx/fund/authentication");

/**
 * 获取魔蝎验证H5页面url
 * @param {number} param.type 1网银 2公积金 3社保 4芝麻分
 * @param {number} param.flag 0验证页面 1结果页面
 * @returns {Promise<*>}
 */
export const getMxPageUrl = param =>
  fetch("GET", `/wx/v1/sys/mx/validate/${param.type}`, param);

/**
 * 公积金授权回调接口
 * @param {string} param.taskId
 * @param {string} param.mxcode
 * @param {string} param.taskType
 * @returns {Promise<*>}
 */
export const reservedFundCallback = param =>
  fetch("POST", "/wx/v1/sys/mx/taskid", param);

/**
 * 我的活动
 * @param {string|number} page 页
 * @param {string|number} rows 每页数量
 * @returns {Promise<*>}
 */
export const myActivityList = (page, rows) =>
  fetch("GET", "/wx/v1/active/myactives", { page: page, rows: rows });

/**
 * 个人中心
 * @param
 */
export const getWxMe = param => fetch("GET", "/wx/v1/me", param);

/**
 * 个人中心个人信息
 * @param
 */
export const getWxMeInfo = param => fetch("GET", "/wx/v1/me/info", param);

/**
 * 个人信息模块
 * @param
 */
export const getWxInfoModule = param => fetch("GET", "/wx/v1/module", param);
