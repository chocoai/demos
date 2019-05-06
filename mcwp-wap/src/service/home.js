import fetch from '../config/fetch'

/**
 * 微信绑定
 * @param
 */
export const wxBinding = param => fetch('POST', '/wx/v1/binding', param)

/**
 * 发送短信验证码
 * @param
 */
export const sendWxVerifyCode = param => fetch('POST', '/wx/v1/verification', param)

/**
 * 个人中心个人信息
 * @param
 */
export const getWxMeInfo = param => fetch('GET', '/wx/v1/me/info', param)

/**
 * 获取绑定状态
 * @param
 */
export const getWxLoginStatus = param => fetch('GET', '/wx/v1/binding/status', param)
