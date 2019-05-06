import fetch from "./xhr/fetch";

/**
 * 新增/编辑 商家
 * @param { string } param.code 商户Code
 * @param { string } param.merchantName 商户Name
 * @param { string } param.merchantPerson 商户Name
 * @param { string } param.merchantPhone 商户联系方式
 * @param { string } param.merchantAddress 商户地址
 * @param { string } param.merchantReferee 推荐人
 * @param { number } param.isEdit 0 新增 1 编辑
 * @returns {Promise<*>}
 */
const shopsEdit = param => fetch("POST", "/wx/v1/merchant/save", param);

/**
 * 获取商家信息
 * @merchantCode {string} param
 * @returns {Promise<*>}
 */
const shopsInfos = merchantCode =>
  fetch("GET", "/wx/v1/merchant/info", { merchantCode: merchantCode });

export { shopsEdit, shopsInfos };
