import request from './'

/**
 * 个人中心
 */
export const getWxMe = param => request.get('/wx/v1/me', param)

/**
 * 个人中心个人信息
 */
export const getWxMeInfo = param => request.get('/wx/v1/me/info', param)

/**
 * 个人信息模块
 */
export const getWxInfoModule = param => request.get('/wx/v1/module', param)
