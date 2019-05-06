import fetch from '../config/fetch'

/**
 * 获取审批校验的提示语
 */
export const getAuditCheck = (param, token) => fetch('POST', '/v1/loan/audit/check', param, token)
