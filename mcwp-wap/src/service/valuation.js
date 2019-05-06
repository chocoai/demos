import fetch from '../config/fetch'

/**
 * 估值code获取
 */
export const getValuationCode = (param) => fetch('POST', '/comm/v1/valuation/info', param)

/**
 * 估值页面 工资估值
 * @param
 */
export const postValuationWage = (param) => fetch('POST', '/comm/v1/valuation/wage', param)

/**
 * 估值页面 车辆估值
 * @param
 */
export const postValuationCar = (param) => fetch('POST', '/comm/v1/valuation/car', param)

/**
 * 估值页面 估值结果
 * @param
 */
export const postValuationLoan = (param) => fetch('POST', '/comm/v1/valuation/loan', param)

/**
 * 估值页面 发送验证码
 * @param
 */
export const postValuationVerification = (param) => fetch('POST', '/comm/v1/valuation/verification', param)

/**
* 估值结果
* @param
*/
export const getValuationResult = (param) => fetch('GET', '/comm/v1/valuation/result', param)

/**
* 估值验证码
* @param
*/
export const getValuationVerification = (param) => fetch('POST', '/comm/v1/valuation/verification', param)

/**
* 营销估值
* @param
*/
export const getValuationSales = (param) => fetch('POST', '/comm/v1/valuation/info', param)

/**
* 获取进件code,和申请流程
* @param
*/
export const getValuationProdStep = (param) => fetch('GET', '/comm/v1/loan/code/prodStep', param)

/**
* 获取营销活动状态
* @param
*/
export const getValuationMarketIsexpire = (param) => fetch('GET', '/comm/v1/loan/market/isExpire', param)
