import fetch from "../../xhr/fetch";
import Store from "store";
import { Config } from "../../../utils";
import CryptoJS from "crypto-js";

/**
 * 获取拼图活动配置
 * @param
 */
export const getPuzzleInfo = param =>
  fetch("GET", "/wx/v1/op/jigsaw/jigsaw", param);

/**
 * 获取奖品
 * @param
 */
export const getPuzzlePrize = param => {
  let token = "";
  let cookies = Store.get(Config.constants.cookies);
  if (cookies && cookies.wxToken && !token) token = cookies.wxToken;
  let keyHex = CryptoJS.enc.Utf8.parse(token.slice(0, 16));
  let cipherid = CryptoJS.AES.encrypt(param.competeness, keyHex, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });
  param.competeness = encodeURIComponent(cipherid.toString());
  return fetch("GET", "/wx/v1/op/jigsaw/get/prize", param);
};

/**
 * 保存中奖人员信息
 * @param
 */
export const postPuzzleWinner = param => {
  let token = "";
  let cookies = Store.get(Config.constants.cookies);
  if (cookies && cookies.wxToken && !token) token = cookies.wxToken;
  let keyHex = CryptoJS.enc.Utf8.parse(token.slice(0, 16));
  let cipherid = CryptoJS.AES.encrypt(param.competeness, keyHex, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });
  param.competeness = encodeURIComponent(cipherid.toString());
  return fetch("POST", "/wx/v1/op/jigsaw/winner", param);
};

/**
 * 失败
 * @param
 */
export const putPuzzleFailure = param =>
  fetch("PUT", "/wx/v1/op/jigsaw/failure", param);

/**
 * 分享获得次数
 * @param
 */
export const postPuzzleShare = param =>
  fetch("POST", "/wx/v1/op/jigsaw/help/num", param);
