<template>
  <div class='house-location-container'>
    <p class='change-city font-32'>切换城市</p>
    <ul class='city-wrapper'>
      <li @click='choseCity(item)' class='location-city font-36' v-for='(item, index) in city' :key='index'><span class='city'>{{item}}</span></li>
    </ul>
  </div>
</template>

<script>
import Store from 'store'
// import Utils from '../../config/utils'
import Config from '../../config/index'
import {getDictValue} from '../../service/getData'

export default {
  components: {
  },
  data () {
    return {
      city: ['北京', '上海', '深圳', '杭州', '太原', '重庆', '成都', '大同', '晋城', '朔州', '阳泉', '长治', '忻州', '吕梁', '晋中', '临汾', '运城', '中山'],
      type: this.$route.params.type || ''     // 类型
    }
  },
  created () {
    this.getCity()
  },
  mounted () {
  },
  methods: {
    async getCity () {
      let res = await getDictValue({code: 'fddcslb'})
      this.city = res.data.fddcslb.map(i => i.ddText)
    },
    choseCity (item) {
      Store.set(Config.constants.cityChose, item)
      // 存在type的为估值，不存在的为进件
      if (this.type) {
        this.$router.push(`${Config.constants.houseLoanRouter}/${this.type}`)
      } else {
        this.$router.push(Config.constants.houseLoanRouter)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.house-location-container {
  .change-city {
    padding: .4rem;
    color: #666;
  }
  .city-wrapper {
    display: flex;
    flex-wrap: wrap;
  }
  .location-city {
    flex: 0 0 33.3333%;
    text-align: center;
    height: 1.6rem;
    line-height: 1.6rem;
  }
  .city {
    display: inline-block;
    height: 1rem;
    line-height: 1rem;
    width: 70%;
    background-color: #eee;
    border-radius: .4rem;
  }
}
</style>
