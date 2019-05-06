import { getPrefixUrl } from '../../service/common'
import Config from '../../config/index'
import Store from 'store'

export default {
  data () {
    return {
      prefixUrl: ''
    }
  },
  created () {
    this.getPrefixUrl()
  },
  methods: {
    async getPrefixUrl () {
      const res = await getPrefixUrl()
      this.prefixUrl = res.data
      if (!this.prefixUrl) {
        const cookies = Store.get(Config.constants.cookies)
        this.prefixUrl = cookies.prefixUrl
      }
    }
  }
}
