export const platform = window ? 'h5' : 'mp'

function formatNumber (n) {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}

export function formatTime (date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  const t1 = [year, month, day].map(formatNumber).join('/')
  const t2 = [hour, minute, second].map(formatNumber).join(':')

  return `${t1} ${t2}`
}

export const Config = {
  toast: {
    errorImgVerify: '图形验证码错误',
    nullImgVerify: '请输入图形验证码',
    nullPhone: '请输入手机号',
    nullVerificationCode: '请输入验证码',
    errorPhone: '请输入正确的手机号！',
    sendVerifyCode: '验证码发送成功，请注意查收',
    nullPayMoney: '请选择充值金额'
  }
}

/**
 * 判断手机号码
 * @param phone {string} 参数名
 * @return {boolean} result
 */
export const isTelephone = phone => {
  const reg = /^[1][345789]\d{9}$/
  phone = phone.replace(/[\u202D+\u202C\s]/g, '')
  return reg.test(phone)
}

/**
 * 千位分隔符
 */
export const thousandBitSeparator = num => {
  num = num.toString()
  const reg = /\d{1,3}(?=(\d{3})+$)/g
  let integer = ''
  let decimal = ''
  if (num.indexOf('.') > -1) {
    integer = num.split('.')[0]
    decimal = num.split('.')[1]
    return (integer + '').replace(reg, '$&,') + '.' + decimal
  } else {
    integer = num
    return (integer + '').replace(reg, '$&,') + '.' + '00'
  }
}

// 获取不同环境
export const getReferer = () => {
  const currentUrl = window.location.href
  if (currentUrl.indexOf('mp-test.zhudb.com') > -1) {
    return 'pre' // 预生产
  }
  if (currentUrl.indexOf('mp.zhudb.com') > -1) {
    return 'prod' // 生产
  }
  return 'test' // 测试
}

export default {
  formatNumber,
  formatTime
}
