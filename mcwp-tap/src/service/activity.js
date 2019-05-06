import fetch from "./xhr/fetch";

/**
 * 砍价活动分享页面
 * @param
 */
export const getActiveKnife = param =>
  fetch("GET", "/wx/v1/rate/helpPage", param);

/**
 * 增加砍刀次数
 * @param
 */
export const postKnifeNum = param => fetch("POST", "/wx/v1/rate/help", param);

/**
 * 砍价活动页面
 * @param
 */
export const getKnifePage = param =>
  fetch("GET", "/wx/v1/rate/knifePage", param);

/**
 * 砍价
 * @param
 */
export const postKnife = param => fetch("POST", "/wx/v1/rate/knife", param);

/**
 * 分享活动:积分兑换（手机充值）
 * @param
 */
export const postConsumer = param =>
  fetch("POST", "/wx/v1/share/consumer", param);

/**
 * 兑换页面的数据
 * @param
 */
export const getConsumerPage = param =>
  fetch("GET", "/wx/v1/share/consumerPage", param);

/**
 * 活动页面要展示的数据
 * @param
 */
export const getSharePage = param =>
  fetch("GET", "/wx/v1/share/sharePage", param);

/**
 * 分享活动
 * @param
 */
export const postShare = param => fetch("POST", "/wx/v1/share/share", param);

/**
 * 积分排行榜
 * @param
 */
export const getScoreRank = param =>
  fetch("GET", "/wx/v1/share/score/rank", param);

/**
 * 积分明细
 * @param
 */
export const getScoreDetail = param =>
  fetch("GET", "/wx/v1/share/score/detail", param);

/**
 * 参加活动
 */
export const joinActivity = param =>
  fetch("POST", "/wx/v1/active/answer", param);
