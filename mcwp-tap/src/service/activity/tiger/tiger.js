import fetch from "../../xhr/fetch";
import Store from "store";
import { Config } from "../../../utils";
import CryptoJS from "crypto-js";

/**
 * 保存中奖人员信息
 * @param
 */
export const postShakeWinner = param => {
  let token = "";
  let cookies = Store.get(Config.constants.cookies);
  if (cookies && cookies.wxToken && !token) token = cookies.wxToken;
  let keyHex = CryptoJS.enc.Utf8.parse(token.slice(0, 16));
  let cipherid = CryptoJS.AES.encrypt(param.competeness, keyHex, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });
  param.competeness = encodeURIComponent(cipherid.toString());
  return fetch("POST", "/wx/v1/op/shake/winner", param);
};

/**
 * 分享获得次数
 * @param {string} param.activityCode activityCode
 * @param {string} param.openId openId
 */
export const postShakeShare = param =>
  fetch("POST", "/wx/v1/op/shake/help/num", param);

/**
 * 获取活动配置
 * @param {string} activityCode activityCode
 * @returns {Promise<*>}
 */
const activityConfig = activityCode =>
  fetch("GET", "/wx/v1/op/shake/jigsaw", { activityCode });

/**
 * 活动分享助力
 * @param {string} activityCode
 * @returns {Promise<*>}
 */
const wxShareConfig = activityCode =>
  fetch("GET", "/wx/v1/active/share/config", { activityCode, type: 5 });

/**
 * 抽奖
 * @param {string} activityCode
 * @returns {Promise<*>}
 */
const wxPrize = activityCode =>
  fetch("GET", "/wx/v1/op/shake/get/prize", { activityCode });

export { activityConfig, wxShareConfig, wxPrize };
