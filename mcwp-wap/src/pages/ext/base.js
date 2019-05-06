// 通用基本类型
import Base from './../citizen/base.vue'
import Store from 'store'
import Config from '../../config/index'

const baseConfig = require.context('./', true, /base\.js$/)
let config = {}

baseConfig.keys().forEach(i => {
  if (i === './base.js') return
  config[i.split('/')[1]] = baseConfig(i).default
})

// BUG：加载完成后切换失效，暂不影响业务
const getConfig = () => Store.get(Config.constants.cookies).prdType

// TODO：等下一个银行确定，进行进一步提取，提取LC分支，基础组件特殊处理全置空
export default {
  extends: Base,
  ...config[getConfig()]
}
