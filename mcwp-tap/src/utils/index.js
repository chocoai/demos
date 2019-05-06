import Store from "store";

const API_ENV = process.env.VUE_APP_API;
const localDev = "/api";
// const devApi = "https://mcwp.test.zhudb.com/backend";
const devApi =
  window.location.protocol + "//" + window.location.host + "/backend";
const preApi =
  window.location.protocol + "//" + window.location.host + "/backend";
const proApi =
  window.location.protocol + "//" + window.location.host + "/backend";
const api = {
  local: localDev,
  dev: devApi,
  pre: preApi,
  prod: proApi
};

// 基本配置
let Config = {
  api: {
    url: api[API_ENV],
    success: 0 || "0"
  },
  baseRouter: "/tap",
  refererUrl: "https://mcwp.test.zhudb.com",
  test: process.env.NODE_ENV === "development" ? 1 : 0,
  wxToken:
    "eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJqd3QiLCJpYXQiOjE1NTExNzIyMzQsInN1YiI6IntcInVzZXJOYW1lXCI6bnVsbCxcInVzZXJJZFwiOm51bGwsXCJ1dWlkXCI6bnVsbCxcIm5pY2tOYW1lXCI6bnVsbCxcInJvbGVzXCI6W10sXCJ0b2tlblwiOm51bGwsXCJlbnRlcnBDb2RlXCI6XCIxMDAwMVwiLFwiYXBwSWRcIjpcInd4OGY4MWI3YmY3ZGM5ZTM0OFwiLFwiY29kZVwiOm51bGwsXCJvcGVuSWRcIjpcIm9Ocmg4MXBZSUxQMzlEc05KanhzdXFfTktvQW9cIixcInNjb3BlXCI6XCJzbnNhcGlfYmFzZVwiLFwibG9nb1wiOm51bGx9IiwiZXhwIjoxNTUxMjU4NjM0fQ.L4QTYTelzBW3Cik1tEFktwggLOxSp1XGQgneanoB7Xg",
  store: {
    token: `USER_TOKEN_${API_ENV}`,
    userInfo: `USER_INFO_${API_ENV}`,
    enterpCode: `ENTERP_CODE_${API_ENV}`,
    account: `REMEMBER_ACCOUNT_${API_ENV}`,
    activedTab: `ACTIVED_TAB_${API_ENV}`
  },
  constants: {
    cookies: `MCWP_COOKIES_${process.env.NODE_ENV}`,
    wxUserInfo: `MCWP_WX_USER_${process.env.NODE_ENV}`,
    wxAuthClose: `WX_AUTH_CLOSE_${process.env.NODE_ENV}`,
    enterpriseCode: `MCWP_ENTERPRISECODE_${process.env.NODE_ENV}`,
    wxAuthCloseWindow: `WX_AUTH_CLOSE_WINDOW_${process.env.NODE_ENV}`,
    activityOpenId: `MCWP_ACTIVITY_OPENID_${process.env.NODE_ENV}`,
    activityKnifeImg: `MCWP_ACTIVITY_KNIFE_IMG_${process.env.NODE_ENV}`,
    activityKnifeTitle: `MCWP_ACTIVITY_KNIFE_TITLE_${process.env.NODE_ENV}`,
    activityKnifeSummary: `MCWP_ACTIVITY_KNIFE_SUMMARY_${process.env.NODE_ENV}`,
    activityKnifeCode: `MCWP_ACTIVITY_KNIFE_CODE_${process.env.NODE_ENV}`,
    activedTabNum: `MCWP_ACTIVED_TAB_NUM_${process.env.NODE_ENV}`,
    activityInviteImg: `MCWP_ACTIVITY_INVITE_IMG_${process.env.NODE_ENV}`,
    activityInviteTitle: `MCWP_ACTIVITY_INVITE_TITLE_${process.env.NODE_ENV}`,
    activityInviteSummary: `MCWP_ACTIVITY_INVITE_SUMMARY_${
      process.env.NODE_ENV
    }`,
    activityShareUser: `MCWP_ACTIVITY_SHARE_USER_${process.env.NODE_ENV}`,
    backCode: `BANK_CODE_${process.env.NODE_ENV}`
  },
  toast: {
    errorImgVerify: "图形验证码错误",
    nullImgVerify: "请输入图形验证码",
    nullPhone: "请输入手机号",
    nullverificationCode: "请输入验证码",
    errorPhone: "请输入正确的手机号！",
    sendVerifyCode: "验证码发送成功，请注意查收",
    nullPayMoney: "请选择充值金额"
  },
  bizType: {
    operateMerchantInfoFileWx: "OPERATE_MERCHANT_INFO_FILE_WX"
  }
};

// 设置页面Title
export const setPageTitle = title => {
  document.title = title;
  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  // 替换成站标favicon路径或者任意存在的较小的图片即可
  // iframe.setAttribute('src', favicon)
  const iframeCallback = function() {
    setTimeout(function() {
      iframe.removeEventListener("load", iframeCallback);
      document.body.removeChild(iframe);
    }, 0);
  };
  iframe.addEventListener("load", iframeCallback);
  document.body.appendChild(iframe);
};

export const getUrlkey = url => {
  let params = {};
  let arr = url.split("?");
  if (arr.length <= 1) return params;
  arr = arr[1].split("&");
  for (let i = 0, l = arr.length; i < l; i++) {
    let a = arr[i].split("=");
    params[a[0]] = a[1];
  }
  return params;
};
export const formatDateTime = inputTime => {
  var date = new Date(inputTime);
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  m = m < 10 ? "0" + m : m;
  var d = date.getDate();
  d = d < 10 ? "0" + d : d;
  var h = date.getHours();
  h = h < 10 ? "0" + h : h;
  var minute = date.getMinutes();
  var second = date.getSeconds();
  minute = minute < 10 ? "0" + minute : minute;
  second = second < 10 ? "0" + second : second;
  return y + "-" + m + "-" + d + " " + h + ":" + minute + ":" + second;
};

export const isWeixin = () => {
  const ua = window.navigator.userAgent.toLowerCase();
  return (
    ua.match(/MicroMessenger/i) &&
    ua.match(/MicroMessenger/i).toString() === "micromessenger"
  );
};

export const isAndroidWeChat = () => {
  const ua = window.navigator.userAgent.toLowerCase();
  return (
    ua.match(/MicroMessenger/i) &&
    ua.match(/MicroMessenger/i).toString() === "micromessenger" &&
    (ua.indexOf("android") > -1 || ua.indexOf("adr") > -1)
  );
};

/**
 * 深拷贝
 *
 * @param {*} obj
 * @param {Array<Object>} cache
 * @return {*}
 */
export const deepCopy = (obj, cache = []) => {
  // 不存在或非对象
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  const hit = find(cache, c => c.original === obj);
  if (hit) {
    return hit.copy;
  }

  const copy = Array.isArray(obj) ? [] : {};
  // 放入缓存中
  cache.push({
    original: obj,
    copy
  });

  Object.keys(obj).forEach(key => {
    copy[key] = deepCopy(obj[key], cache);
  });

  return copy;
};

/**
 * 获取地址栏url后面的参数
 * @param {name} 参数名
 * @return {参数值}
 */
export const getQueryParams = name => {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
};

/**
 * 获取随机字符串
 * @param 随机字符串
 */
export const randomStr = size => {
  const chars = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z"
  ];
  let state = "";
  for (let i = 0; i < size; i++) {
    let id = Math.ceil(Math.random() * 35);
    state += chars[id];
  }
  return state;
};

/**
 * 判断手机号码
 * @param phone {string} 参数名
 * @return {boolean} result
 */
export const isTelephone = phone => {
  const reg = /^[1][345789]\d{9}$/;
  phone = phone.replace(/[\u202D+\u202C\s]/g, "");
  return reg.test(phone);
};

/**
 * 判断手机号码或固话
 * @param phone {string} phone
 * @return {boolean} result
 */
export const isPhoneNumber = phone => {
  const reg = /^((0?\d{2,3}[-_－—]?)?\d{3,8}([-_－—]?\d{3,8})?)$|^(0?1[35789]\d{9})$/;
  phone = phone.replace(/[\u202D+\u202C\s]/g, "");
  return reg.test(phone);
};
/**
 * 加载Loading
 * @param self {Vue} 调用组件
 * @param show {boolean} 显示或隐藏
 * @param message {string} 显示文案
 */
export const doLoading = (self, show, message = "加载中...") => {
  if (!show) return self.$toast.clear();
  self.$toast.loading({
    duration: 0, // 持续展示 toast
    loadingType: "spinner",
    message: message
  });
};

export const getCookie = name => {
  let reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
  let arr = decodeURIComponent(document.cookie).match(reg);
  if (arr) {
    return unescape(arr[2]);
  } else {
    return null;
  }
};

/**
 * 千位分隔符
 */
export const thousandBitSeparator = num => {
  num = num.toString();
  const reg = /\d{1,3}(?=(\d{3})+$)/g;
  let integer = "";
  let decimal = "";
  if (num.indexOf(".") > -1) {
    integer = num.split(".")[0];
    decimal = num.split(".")[1];
    return (integer + "").replace(reg, "$&,") + "." + decimal;
  } else {
    integer = num;
    return (integer + "").replace(reg, "$&,") + "." + "00";
  }
};

// 获取不同环境
export const getReferer = () => {
  const currentUrl = window.location.href;
  if (currentUrl.indexOf("mp-test.zhudb.com") > -1) {
    return "pre"; // 预生产
  }
  if (currentUrl.indexOf("mp.zhudb.com") > -1) {
    return "prod"; // 生产
  }
  return "test"; // 测试
};

// 埋点
export const countPlus = (data, type, duration) => {
  // 默认全局注册环境
  window.dplus.register({ env: getReferer() });
  // 全局注册 enterCode userName env
  if (type === "register") {
    for (let key in data) {
      if (data[key] === undefined || data[key] === null || data[key] === "") {
        data[key] = "-1";
      }
      data[key] = data[key].toString();
    }
    window.dplus.register(data);
  }
  // 单个页面注册
  if (type === "save") {
    for (let key in data) {
      if (data[key] === undefined || data[key] === null || data[key] === "") {
        data[key] = "-1";
      }
      data[key] = data[key].toString();
    }
    let storeData = {};
    if (Store.get("COUNT_PLUS")) storeData = Store.get("COUNT_PLUS");
    let newDate = Object.assign({}, storeData, data);
    Store.set("COUNT_PLUS", newDate);
  }
  // 发送
  if (type === "send") {
    // todo 传递字段未定，微信缓存有问题，如果授权相同则缓存共用冲突
    // let sendData = Object.assign(
    //   {
    //     prodName: "-1",
    //     prodCode: "-1",
    //     prodType: "-1",
    //     managerCode: "-1",
    //     loanCode: "-1"
    //   },
    //   Store.get("COUNT_PLUS")
    // );
    let sendData = {
      prodName: "-1",
      prodCode: "-1",
      prodType: "-1",
      managerCode: "-1",
      loanCode: "-1"
    };
    // 目前暂时不记录userName、enterCode
    let registerData = Object.assign({
      // userName: window.dplus.get_property("userName") || "-1",
      userName: -1,
      env: window.dplus.get_property("env") || getReferer(),
      enterCode: window.dplus.get_property("enterCode") || "-1"
      // enterCode: -1
    });
    window.dplus.unregister([
      "userName",
      "env",
      "enterCode",
      "prodName",
      "prodCode",
      "prodType",
      "managerCode"
    ]);
    if (duration) {
      sendData.pageName = duration.pageName.toString();
      sendData.stayTime = ((duration.stayTime / 1000) | 0).toString();
    }
    window.dplus.register(registerData);
    // if (registerData.env == "test" || registerData.env == "pre") return;
    window.dplus.track(data, sendData, () => console.log(data + "success"));
  }
};

export const objToStr = obj => {
  let des = "";
  for (let name in obj) {
    let value = obj[name];
    if (
      value !== null &&
      value !== undefined &&
      typeof value !== "string" &&
      typeof value !== "number" &&
      typeof value !== "boolean" &&
      typeof value !== "symbol"
    ) {
      des += `\n${name}:[\n${objToStr(value)}\n]\n`;
    }
    des += name + ":" + obj[name] + ";\n";
  }
  return des;
};

Date.prototype.format = function(fmt) {
  let o = {
    "M+": this.getMonth() + 1,
    "d+": this.getDate(),
    "h+": this.getHours(),
    "m+": this.getMinutes(),
    "s+": this.getSeconds(),
    "q+": Math.floor((this.getMonth() + 3) / 3),
    S: this.getMilliseconds()
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (this.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  }
  for (let k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );
    }
  }
  return fmt;
};

// TODO：3.1以bankCode来进行区分
// Config.constants.cookies = () => {
//   let bankCode = Store.get(Config.constants.bankCode)
//   if (!bankCode) window.alert('ba')
//   return `MCWP_COOKIES_${process.env.NODE_ENV}_${bankCode}`
// }

export { Config };
