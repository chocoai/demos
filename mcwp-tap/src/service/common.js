import fetch from "./xhr/fetch";

/**
 * 扫码确定登录
 * @param
 */
export const postQrLogin = param =>
  fetch("POST", "/comm/v1/scan/user/login", param);

/**
 * 版本信息
 * @param
 */
export const getVersion = param => fetch("GET", "/comm/version", param);

/**
 * 获取公众号信息
 * @param
 */
export const getWxAuthParams = param =>
  fetch("GET", "/comm/v1/wx/weixinInfo", param);

/**
 * 获取微信用户信息
 * @param
 */
export const getWxUserInfo = param => fetch("GET", "/wx/v1/info", param);

/**
 * 获取微信用户绑定信息
 * @param
 */
export const getBindingUserInfo = param =>
  fetch("GET", "/wx/v1/binding/status", param);

/**
 * 网页授权
 * @param {enterpriseCode} 企业编码
 * @param {code} 授权编码
 * @param {appId} 公众号APPID
 */
export const wxWebAuth = param => fetch("POST", "/comm/v1/wx/webAuth", param);

/**
 * 获取微信签名
 * @param
 */
export const getWxSign = param => fetch("POST", "/comm/wechat/sdk/sign", param);

/**
 * @returns Promise<*> UUID
 */
export const getUUID = () => fetch("GET", "/comm/uuid");

/**
 * 微信文件上传
 * @param {string} param.bizCode 业务编号
 * @param {string} param.mediaId 图片文件mediaId
 * @param {string} param.enterpriseCode 企业Code
 * @param {string} param.bizType 业务类型
 */
export const wxfilesUpload = param =>
  fetch("POST", "/comm/wxfiles/upload/v1", param);

/**
 * 获取 OSS 文件列表
 * @param {string} bizCode 业务Code
 * @param {string} bizType 业务Type
 * @param {string} fileType 文件类型
 * @returns {Promise<*>}
 */
export const getFileList = (bizCode, bizType, fileType = "*") =>
  fetch("GET", `/comm/v1/oss/${bizCode}/${bizType}/${fileType}`);

/**
 * 删除 OSS 文件
 * @param {string} code 文件code
 * @returns {Promise<*>}
 */
export const deleteFile = code => fetch("DELETE", `/comm/v1/oss/del/${code}/0`);

/**
 * 获取静态资源URL
 */
export const getPrefixUrl = () => fetch("GET", "/wx/static/prefixUrl");

/**
 * 获取分享配置
 */
export const getShareConfig = param =>
  fetch("GET", "/wx/v1/active/share/config", param);

/**
 * 校验口令
 */
export const postScanCheck = param => fetch("POST", "/wx/v1/scan/check", param);
