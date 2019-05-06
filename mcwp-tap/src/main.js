import Vue from "vue";
import "./style/index.less";
import App from "./App.vue";
import store from "./store";
import FastClick from "fastclick";
import { Config } from "./utils";
import "babel-polyfill";
import "./utils/rem";
import { getRouterData } from "./router";
import VueAnime from "vue-animejs";
import svg from "svg-progress-bar";

Vue.use(svg);
Vue.use(VueAnime);
Vue.config.productionTip = false;

if ("addEventListener" in document) {
  document.addEventListener(
    "DOMContendLoaded",
    function() {
      FastClick.attach(document.body);
    },
    false
  );
}

// 禁止显示在浏览器打开：有无影响暂无法预估
document.oncontextmenu = function(e) {
  // 测试环境不禁止
  if (!Config.test) {
    e.preventDefault();
  }
};

new Vue({
  store,
  router: getRouterData(),
  render: h => h(App)
}).$mount("#app");
