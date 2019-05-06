const routerConfig = {
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
}

// TODO: 调整
module.exports = [
  {
    path: `pages/${routerConfig.home.component.slice(0, -4)}`, // 页面路径，同时是 vue 文件相对于 src 的路径
    config: { // 页面配置，即 page.json 的内容
      navigationBarTitleText: '首页',
      usingComponents: {
        'tabbar': '/static/vant/tabbar/index',
        'tabbar-item': '/static/vant/tabbar-item/index',
        'van-toast': '/static/vant/toast/index'
      }
    }
  }, {
    path: 'pages/home/problem',
    config: {
      navigationBarTitleText: '问题中心',
      usingComponents: {
        'button': '/static/vant/button/index',
        'collapse': '/static/vant/collapse/index',
        'collapse-item': '/static/vant/collapse-item/index'
      }
    }
  }, {
    path: 'pages/common/logs',
    root: 'pages/common',
    subPackage: true,
    config: { // 页面配置，即 page.json 的内容
      navigationBarTitleText: '查看启动日志'
    }
  }, {
    path: 'pages/score/scoreDetail',
    config: {
      navigationBarTitleText: '积分明细',
      usingComponents: {
        'tab': '/static/vant/tab/index',
        'tabs': '/static/vant/tabs/index'
      }
    }
  }, {
    path: 'pages/score/scoreRank',
    config: {
      navigationBarTitleText: '积分排行榜'
    }
  }, {
    path: 'pages/home/myInfo',
    config: {
      navigationBarTitleText: '个人信息'
    }
  }
]
