import fetch from '../config/fetch'
import Store from 'store'
import Config from '../config'
/**
 * 获取静态资源URL
 */
export const getPrefixUrl = () => fetch('GET', '/wx/static/prefixUrl')

/**
 * 获取分享配置
 */
export const getShareConfig = (param) => fetch('GET', '/wx/v1/active/share/config', param)

/**
 * 获取和银行相关的dict
 * @param {code} 产品code
 */
export const getDictCustom = (param) => {
  let cookies = Store.get(Config.constants.cookies)
  if (!param.prdType && !param.enterpriseCode) {
    param.prdType = cookies.prdType
    param.enterpriseCode = cookies.enterpriseCode
  }
  return fetch('GET', `/comm/sys/dict/items/custom`, param)
}
/**
 * 借款人信息录入时所购车型下拉项
 * @param {code} 进件编码
 */
export const getCarInfo = (param) => {
  return fetch('GET', `/comm/loan/car/brand`, param)
}
/**
 * 借款人信息录入时所购车型详细信息，包括指导价
 * @param {code} 进件编码
 */
export const getCarSpec = (param) => {
  return fetch('GET', `/comm/loan/car/spec`, param)
}
