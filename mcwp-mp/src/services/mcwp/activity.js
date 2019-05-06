import request from './'

/**
 * 积分明细
 * @param
 */
export const getScoreDetail = param =>
  request.get('/wx/v1/share/score/detail', param)

/**
 * 积分排行榜
 * @param
 */
export const getScoreRank = param =>
  request.get('/wx/v1/share/score/rank', param)
