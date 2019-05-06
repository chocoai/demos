import fetch from '../config/fetch'

/**
 * 获取选择的省市区
 * @param {code} 产品code
 */
export const getSSQ = (param, type) => fetch('GET', `/comm/citizen${type && '/' + type || ''}/v1/ssq`, param)

/**
 * 提交初审审批
 * @param
 */
export const citizenAuditRet = (param, type) => fetch('POST', `/comm/citizen${type && '/' + type || ''}/v1/firstAudit`, param)

export const getPostCode = (cityValue) => fetch('GET', '/comm/city/postcode', {cityValue: cityValue})
