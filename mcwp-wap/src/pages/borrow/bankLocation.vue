<template>
  <div class="map-container">
    <div id="allmap" class="allmap"></div>
    <div class="bank-address">
      <p class="bank-name">杭州联合银行益乐支行</p>
      <p>杭州市文二路西湖27-29号</p>
    </div>
  </div>
</template>

<script>

export default {
  components: {
  },
  data () {
    return {
    }
  },
  methods: {
    createMap (BMap) {
      // const that = this
      let map = new BMap.Map('allmap')
      let point = new BMap.Point(120.127401, 30.288469)
      map.centerAndZoom(point, 15)
      let myGeo = new BMap.Geocoder()
      myGeo.getPoint('杭州市西湖区文二路391号', function (point) {
        if (point) {
          map.centerAndZoom(point, 15)
        } else {
          console.log('您选择地址没有解析到结果!')
        }
      }, '杭州市')
    }
  },
  mounted () {
    let that = this
    that.$nextTick(
      that.createMap(window.BMap)
    )
  }
}
</script>

<style lang="less">
.map-container {
  position: relative;
  padding-bottom: 2.2rem;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  .allmap {
    width: 100%;
    height: 100%;
  }
  .anchorBL {
    display: none;
  }
  .bank-address {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    font-size: .44rem;
    padding-left: .5rem;
    line-height: .72rem;
    height: 2.2rem;
    padding-top: .4rem;
    background-color: #fff;
    box-sizing: border-box;
  }
  .bank-name {
    font-weight: bold;
  }
}
</style>
