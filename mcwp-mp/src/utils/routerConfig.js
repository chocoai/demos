export default {
  scoreExchange: {
    path: "/score/scoreExchange",
    name: "scoreExchange",
    component: "score/scoreExchange.vue",
    meta: {
      title: "积分兑换"
    }
  },
  scoreRank: {
    path: "/score/scorerank",
    name: "scorerank",
    component: "score/scoreRank.vue",
    meta: {
      title: "积分排行榜"
    }
  },
  scoreDetail: {
    path: "/score/scoredetail",
    name: "scoredetail",
    component: "score/scoreDetail.vue",
    meta: {
      title: "积分明细"
    }
  },
  homeProdEntry: {
    path: "/home/product/entry",
    name: "detail",
    component: "home/prodEntry.vue",
    meta: {
      title: "申请贷款"
    }
  },
  increase: {
    path: "/home/increase",
    name: "increase",
    component: "home/increase.vue",
    meta: {
      title: "我要提额"
    }
  },
  activity: {
    path: "/home/activity",
    name: "activity",
    component: "home/activity.vue",
    meta: {
      title: "我的活动"
    }
  },
  shopsJoin: {
    path: "/home/shops/join",
    name: "shopsJoin",
    component: "home/shopsJoin.vue",
    meta: {
      title: "商家入驻",
      wxSign: true
    }
  },
  geneQRcode: {
    path: "/home/geneQRcode",
    name: "geneQRcode",
    component: "home/geneQRcode.vue",
    meta: {
      title: "推广二维码"
    }
  },
  myborrow: {
    path: "/my/myborrow",
    name: "myborrow",
    component: "home/myborrow.vue",
    meta: {
      title: "我的借款"
    }
  },
  borrowDetail: {
    path: "/my/borrowDetail",
    name: "borrowDetail",
    component: "home/borrowDetail.vue",
    meta: {
      title: "我的借款"
    }
  },
  flowpath: {
    path: "/home/flowpath/:code",
    name: "/home/flowpath",
    component: "home/flowpath.vue",
    meta: {
      title: "如何获得10万信用额度"
    }
  },
  question: {
    path: "/home/question/:code",
    name: "/home/question",
    component: "home/question.vue",
    meta: {
      title: ""
    }
  },
  purpose: {
    path: "/home/purpose",
    name: "/home/purpose",
    component: "home/purpose.vue",
    meta: {
      title: "借款用途",
      auth: true
    }
  },
  homeKnifeExplain: {
    path: "/home/knifeExplain",
    name: "knifeExplain",
    component: "home/knifeExplain.vue",
    meta: {
      title: "如何获得利率优惠"
    }
  },
  homeFAQShare: {
    path: "/home/FAQ/share",
    name: "FAQShare",
    component: "home/shareFAQ.vue",
    meta: {
      title: "积分兑好礼"
    }
  },
  myinfo: {
    path: "/home/myinfo",
    name: "/myinfo",
    component: "home/myinfo.vue",
    meta: {
      title: "个人信息",
      auth: true
    }
  },
  helpknife: {
    path: "/activity/knife",
    name: "/knife",
    component: "activity/knife/knifePage.vue",
    meta: {
      title: "好友助力 一砍到底"
    }
  },
  help: {
    path: "/activity/help",
    name: "help",
    component: "activity/knife/knife.vue",
    meta: {
      title: "好友助力"
    }
  },
  invite: {
    path: "/activity/invite",
    name: "invite",
    component: "activity/share/invite.vue",
    meta: {
      title: "邀请好友"
    }
  },
  money: {
    path: "/activity/money",
    name: "money",
    component: "activity/share/money.vue",
    meta: {
      title: "现金红包"
    }
  },
  moneysuccess: {
    path: "/activity/moneysuccess",
    name: "moneysuccess",
    component: "activity/share/moneysuccess.vue",
    meta: {
      title: "兑换成功"
    }
  },
  pay: {
    path: "/activity/pay",
    name: "pay",
    component: "activity/share/pay.vue",
    meta: {
      title: "手机充值"
    }
  },
  paysuccess: {
    path: "/activity/paysuccess",
    name: "paysuccess",
    component: "activity/share/paysuccess.vue",
    meta: {
      title: "充值成功"
    }
  },
  activityPuzzle: {
    path: "/activity/puzzle",
    name: "puzzle",
    component: "activity/puzzle/index.vue",
    meta: {
      title: "拼图",
      authorization: "backend"
    }
  },
  activityAnswer: {
    path: "/activity/answer",
    name: "answer",
    component: "activity/answer/index.vue",
    meta: {
      title: "你的桃花运圣地！",
      authorization: "backend"
    }
  },
  activityDue: {
    path: "/activity/due",
    name: "due",
    component: "activity/due.vue",
    meta: {
      title: "活动不存在！"
    }
  },
  problem: {
    path: "/home/problem",
    name: "problem",
    component: "home/problem",
    meta: {
      title: "问题中心"
    }
  },
  home: {
    path: "/home",
    name: "home",
    component: "home/index.vue",
    meta: {
      title: "主页",
      tabbar: true // 底部导航
    }
  },
  qrlogin: {
    path: "/common/qrlogin",
    name: "qrlogin",
    component: "common/qrLogin.vue",
    meta: {
      title: "扫码登录"
    }
  },
  scanLogin: {
    path: "/common/scan",
    name: "scanLogin",
    component: "common/scanLogin.vue",
    meta: {
      title: "扫码登录",
      authorization: "backend"
    }
  },
  WeChatAuth: {
    path: "/common/wxAuth",
    name: "WeChatAuth",
    component: "common/weChatAuth.vue",
    meta: {
      title: "正在授权..."
    }
  },
  Tiger: {
    path: "/activity/tiger",
    name: "Tiger",
    component: "activity/tiger/tiger.vue",
    meta: {
      title: "摇一摇",
      authorization: "backend"
    }
  },
  PrizeResult: {
    path: "/activity/prize/result",
    name: "PrizeResult",
    component: "activity/tiger/prize-result.vue",
    meta: {
      title: "摇一摇"
    }
  },
  other: {
    path: "*",
    name: "any",
    redirect: "/home",
    component: "home/index.vue",
    meta: {
      title: "主页",
      tabbar: true // 底部导航
    }
  }
};
