import fetch from '../config/fetch'

/**
 * 估值code获取
 */
export const getActivityValuationCode = (param) => fetch('POST', '/wx/v1/valuation/info', param)

/**
 * 获取估值结果和朋友圈排名情况
 */
export const getActivityValuationResult = (param) => fetch('GET', '/wx/v1/valuation/result', param)
