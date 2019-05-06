import Store from 'store'
import Config from './index'
import wxAuth from './wxAuth'
import Utils from './utils'
import Vue from 'vue'
import {Promise} from 'es6-promise'

const baseUrl = Config.target
let enterpriseCode = null
if (Utils.getUrlkey(window.location.search)['enterpriseCode']) enterpriseCode = Utils.getUrlkey(window.location.search)['enterpriseCode']
if (window.zdb) {
  enterpriseCode = window.zdb.tGetEnterpriseCode()
}
window.tGetEnterpriseCode = function (code) {
  enterpriseCode = code
}

export default async(type = 'GET', url = '', data = {}, token = '', method = 'fetch') => {
  type = type.toUpperCase()
  url = baseUrl + url
  let postTimer
  // 避免重复POST请求
  if (type === 'POST' || type === 'PUT') {
    // 此处对连续请求有限制，可通过在配置中增加url限制
    let result = Utils.repeatReq('save', url)
    if (result !== 0) {
      if (result === 3) return result
      postTimer = setTimeout(_ => Utils.repeatReq('clear', url), 3000)
    }
  }
  let aData = [] // 存储数据
  let sData = '' // 拼接数据
  for (let attr in data) {
    aData.push(attr + '=' + data[attr])
  }
  sData = aData.join('&')
  if (type === 'GET') {
    if (sData) url = url + '?' + sData
  }
  let cookies = Store.get(Config.constants.cookies)
  if (window.zdb && !enterpriseCode) {
    enterpriseCode = window.zdb.tGetEnterpriseCode()
  }
  let tmpEnterpriseCode = Store.get(Config.constants.enterpriseCode)
  if (tmpEnterpriseCode && !enterpriseCode) enterpriseCode = tmpEnterpriseCode
  if (cookies && cookies.wxToken && !token) token = cookies.wxToken
  if (window.fetch && method === 'fetch') {
    let requestConfig = {
      // credentials: 'include', Fetch 请求默认是不带 cookie 的，需要设置 fetch(url, {credentials: 'include'})
      method: type,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': token,    // 无token则存在空字段
        'EnterpriseCode': enterpriseCode
      },
      mode: 'cors'
      // cache: 'force-cache' 表示fetch请求不顾一切的依赖缓存, 即使缓存过期了, 它依然从缓存中读取. 除非没有任何缓存, 那么它将发送一个正常的request.
    }
    if (type === 'POST' || type === 'PUT') {
      // url = url + '?v=' + new Date().getTime() + Math.random().toString(36).substr(2)
      Object.defineProperty(requestConfig, 'body', {
        value: sData
      })
    }
    // 请求时长过长处理,3min
    let timer = setTimeout(() => {
      // window.alert('请求超时，重新刷新页面')
      Vue.$vux.loading.hide()
      Vue.$vux.alert.show({
        content: '请求超时，重新刷新页面',
        onHide () {
          if (window.location.href.includes('?')) {
            window.location.href = `${window.location.href}&${new Date().getTime()}`
          } else {
            window.location.href = `${window.location.href}?${new Date().getTime()}`
          }
        }
      })
    }, 180000)
    try {
      var response = await fetch(url, requestConfig)
      var responseJson = await response.json()
      clearTimeout(timer)
    } catch (error) {
      throw new Error(error)
    }
    // 清除请求完成的POST
    if (type === 'POST' || type === 'PUT') {
      Utils.repeatReq('clear', url)
      clearTimeout(postTimer)
    }
    if (responseJson.code === 'TOKEN_EXPIRE') { // TOKEN失效！
      // prefixUrl 特殊处理
      if (url.includes('static/prefixUrl')) return responseJson
      if (cookies && cookies.wxToken) delete cookies.wxToken
      Store.set(Config.constants.cookies, cookies)
      if (Utils.isWeixin()) wxAuth()
    } else {
      return responseJson
    }
  } else {
    return new Promise((resolve, reject) => {
      let requestObj
      if (window.XMLHttpRequest) {
        requestObj = new XMLHttpRequest()
      } else if (window.ActiveXObject) {
        // requestObj = new ActiveXObject
      }
      requestObj.open(type, url, true)
      requestObj.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
      requestObj.setRequestHeader('Authorization', token)
      requestObj.setRequestHeader('EnterpriseCode', enterpriseCode)
      requestObj.send(sData)
      requestObj.onreadystatechange = () => {
        if (requestObj.readyState === 4) {
          if (requestObj.status === 200) {
            let obj = requestObj.response
            if (typeof obj !== 'object') {
              obj = JSON.parse(obj)
            }
            // 清除请求完成的POST
            if (type === 'POST' || type === 'PUT') {
              Utils.repeatReq('clear', url)
              clearTimeout(postTimer)
            }
            if (obj.code === 'TOKEN_EXPIRE') { // TOKEN失效！
              // prefixUrl 特殊处理
              if (url.includes('static/prefixUrl')) resolve(obj)
              if (cookies && cookies.wxToken) delete cookies.wxToken
              Store.set(Config.constants.cookies, cookies)
              if (Utils.isWeixin()) wxAuth()
            } else {
              resolve(obj)
            }
          } else {
            reject(requestObj)
          }
        }
      }
    })
  }
}
