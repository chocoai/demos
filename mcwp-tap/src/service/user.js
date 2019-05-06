import fetch from "./xhr/fetch";

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

/**
 * 获取绑定状态
 * @param
 */
export const getWxLoginStatus = param =>
  fetch("GET", "/wx/v1/binding/status", param);
