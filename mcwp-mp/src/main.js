import Vue from 'vue'
import App from '@/App'
import store from '@/store'
import GbalPlugin from '@/plugins/gbal'
import WXP from 'minapp-api-promise'
import MpvueRouterPatch from 'mpvue-router-patch'
import Toast from '@/../static/vant/toast/toast'

Vue.use(GbalPlugin)
Vue.use(MpvueRouterPatch)
Vue.config.productionTip = false
Vue.prototype.$wx = WXP
Vue.prototype.$toast = Toast
App.store = store
App.mpType = 'app'

const app = new Vue(App)
app.$mount()
