<template>
  <div class='houseEval-container'>
    <div class="house-search">
      <div id="r-result" class="weui-search-bar weui-search-bar_focusing">
          <form class="weui-search-bar__form">
            <div class="weui-search-bar__box">
                <i class="weui-icon-search"></i>
                <input id="suggestId" ref="suggestId" type="text" class="weui-search-bar__input" placeholder="请输入本人名下房产所在小区" required="" />
                <a href="javascript:" @click='clearData' class="weui-icon-clear"></a>
            </div>
          </form>
          <div class="current-city"><span v-if='!currentCity' class="locationing">定位中...</span><span v-if='currentCity' class="location-img"></span><span id="currentCity">{{currentCity}}</span></div>
      </div>
      <div style="border:1px solid #C0C0C0;width:150px;height:auto; display:none;">{{searchResultPanel}}</div>
    </div>
    <div id="allmap" class="allmap"></div>
    <ul class="contact-ul">
      <li class='contact-detail-content'>
        <popup-picker placeholder='请选择' title="房屋用途" value-text-align='left' :data="listData" :columns="1" v-model="proptypePicker" show-name></popup-picker>
      </li>
      <li class='contact-detail-content'>
        <p class='contact-detail-item'>房屋面积</p>
        <input class='contact-detail-input' type="number" placeholder='请输入房屋面积' v-model="bldgarea" >
        <p class='contact-detail-unit'>m<sup>2</sup></p>
      </li>
      <li v-if="isShow" class='contact-detail-content'>
        <p class='contact-detail-item'>联系方式</p>
        <input class='contact-detail-input' type="tel" placeholder='请输入手机号' maxlength="11" v-model="telephone" />
      </li>
    </ul>
    <v-button url='/loan/contact' @next='next' style="margin-top: 1rem">免费评估</v-button>
    <div class="house-modal">
      <div class="house-title">{{houseTitle}}</div>
      <div class="house-addr">{{houseAddr}}</div>
      <div class="house-addr-desc">
        <input type="number" pattern="[0-9]*" placeholder="所在楼层" maxlength="3" v-model='floor'>
        <input type="number" placeholder="楼座的楼层" maxlength="4" v-model='height'>
      </div>
    </div>
  </div>
</template>

<script>
import Store from 'store'
import Utils from '../../config/utils'
import VButton from './../../components/button'
import Config from '../../config/index'
import { getDictValue, hourseEstimate } from '../../service/getData'
import { PopupPicker } from 'vux'
export default {
  components: {
    VButton,
    PopupPicker
  },
  data () {
    return {
      proCode: '',
      loanCode: '',
      houseTitle: '本人名下房产所在小区',
      houseAddr: '本人名下房产所在小区地址',
      bldgarea: '',
      floor: '',
      height: '',
      telephone: '',
      currentCity: '',
      searchResultPanel: '',
      hourseParams: {},
      proptypePicker: [],
      listData: [],
      isShow: true,
      getTime: new Date().getTime()   // 时长统计
    }
  },
  created () {
    let that = this
    const cookies = Store.get(Config.constants.cookies)
    that.proCode = cookies.proCode
    that.loanCode = cookies.loanCode
    that.isShow = Utils.getQueryParams('show') || true
  },
  mounted () {
    let that = this
    if (!that.loanCode) return
    getDictValue({code: 'fwyt'}).then(res => {
      if (res.code === Config.resCode.success) {
        if (res.data && res.data.fwyt) {
          res.data.fwyt.forEach((item, index) => {
            that.listData.push({
              value: item.ddValue,
              name: item.ddText,
              parent: item.parentValue
            })
          })
        }
      } else {
        that.$vux.toast.text(res.msg)
      }
    })
    that.$nextTick(
      that.createMap(window.BMap)
    )
    window.BMap_loadScriptTime = (new Date()).getTime()
    const oScript = document.createElement('script')
    oScript.src = 'https://api.map.baidu.com/api?v=2.0&ak=PNhhMFEMvIgiZ8LO09zFNeBd3pHtnM7r&s=1'
    oScript.type = 'text/javascript'
    document.head.appendChild(oScript)
    oScript.onload = function () {
      that.$nextTick(
        that.createMap(window.BMap)
      )
    }
    Utils.countPlus('房屋估值', 'send')
  },
  methods: {
    clearData () {
      const that = this
      that.searchData = ''
      that.$refs.suggestId.value = ''
    },
    async next () {
      const that = this
      const prdCode = that.proCode
      if (!prdCode) return that.$vux.toast.text(Config.constants.nullCode)
      const proptype = that.proptypePicker[0]
      if (!proptype) return that.$vux.toast.text(Config.constants.nullProptype)
      const bldgarea = that.bldgarea
      if (!bldgarea) return that.$vux.toast.text(Config.constants.nullBldgarea)
      if (bldgarea > 999999.99 || bldgarea < 0.01) return that.$vux.toast.text('房屋面积范围为0.01~999999.99')
      const reg = /^[0-9]+([.]{1}[0-9]{1,2})?$/
      if (!reg.test(bldgarea)) return that.$vux.toast.text('房屋面积最多2位小数')
      const floor = that.floor
      if (!floor) return that.$vux.toast.text(Config.constants.nullFloor)
      const height = that.height
      if (!height) return that.$vux.toast.text(Config.constants.nullHeight)
      const telephone = that.telephone
      if (!telephone && that.isShow) return that.$vux.toast.text(Config.constants.nullTelephone)
      if (!Utils.isTelephone(telephone)) {
        return that.$vux.toast.show({
          type: 'text',
          text: Config.constants.errorMobile,
          width: '6.5rem',
          isShowMask: true
        })
      }
      const hourseParams = that.hourseParams
      if (!hourseParams.city || !hourseParams.district || !hourseParams.haname || !hourseParams.location) return that.$vux.toast.text('请输入本人名下房产所在小区')
      const params = {
        reqCode: that.loanCode,
        prdCode: prdCode,
        proptype: proptype,
        bldgarea: bldgarea,
        floor: floor,
        height: height,
        telephone: Utils.clearSpecChars(telephone),
        city: hourseParams.city,
        district: hourseParams.district,
        haname: hourseParams.haname,
        location: hourseParams.location
      }
      if (!that.isShow) delete params.telephone
      that.$vux.loading.show({
        text: '请稍候...'
      })
      const res = await hourseEstimate(params)
      that.$vux.loading.hide()
      if (res.code === Config.resCode.success) {
        Utils.countPlus('页面停留时长', 'send', {'pageName': '房屋估值', 'stayTime': new Date().getTime() - this.getTime})
        that.$router.push(Config.constants.houseRouter)
      } else {
        that.$vux.loading.hide()
        that.$vux.toast.text(res.msg)
      }
    },
    createMap (BMap) {
      const that = this
      let map = new BMap.Map('allmap')
      let geolocation = new BMap.Geolocation()
      geolocation.getCurrentPosition(function (r) {
        if (this.getStatus() === 0) {
          let mk = new BMap.Marker(r.point)
          let city = r.address.city
          if (city.indexOf('市') > -1) {
            city = city.substring(0, city.length - 1)
          }
          if (city.indexOf('自治区') > -1) {
            city = city.substring(0, city.length - 3)
          }
          that.currentCity = city
          let point = new BMap.Point(r.point.lng, r.point.lat)
          map.centerAndZoom(point, 21)   // 初始化地图,设置中心点坐标和地图级别
          map.addOverlay(mk)
          map.panTo(r.point) // 移动
          map.disableDragging()     // 禁止拖拽
          // 建立一个自动完成的对象
          let ac = new BMap.Autocomplete({
            'input': 'suggestId',
            'location': map
          })
          that.$vux.loading.hide()
          ac.addEventListener('onhighlight', function (e) {
            let str = ''
            let _value = e.fromitem.value
            let value = ''
            if (e.fromitem.index > -1) {
              value = _value.province + _value.city + _value.district + _value.street + _value.business
            }
            str = 'FromItem<br />index = ' + e.fromitem.index + '<br />value = ' + value

            value = '<br />value = '
            if (e.toitem.index > -1) {
              _value = e.toitem.value
              value = _value.province + _value.city + _value.district + _value.street + _value.business
            }
            str += '<br />ToItem<br />index = ' + e.toitem.index + '<br />value = ' + value
            that.searchResultPanel = str
          })
          ac.addEventListener('onconfirm', function (e) {    // 鼠标点击下拉列表后的事件
            let _value = e.item.value
            if (_value.city.indexOf('市') > -1) {
              that.hourseParams.city = _value.city.substring(0, _value.city.length - 1)
            }
            that.hourseParams.district = _value.district
            that.houseTitle = that.hourseParams.haname = _value.business
            let myValue = _value.province + _value.city + _value.district + _value.street + _value.business
            that.houseAddr = that.hourseParams.location = myValue
            that.searchResultPanel = 'onconfirm<br />index = ' + e.item.index + '<br />myValue = ' + myValue
            that.setPlace(BMap, map, myValue)
          })
        } else {
          alert('failed' + this.getStatus())
        }
      }, {enableHighAccuracy: true})
    },
    setPlace (BMap, map, myValue) {
      map.clearOverlays()    // 清除地图上所有覆盖物
      function myFun () {
        let pp = local.getResults().getPoi(0).point    // 获取第一个智能搜索的结果
        map.centerAndZoom(pp, 20)
        map.addOverlay(new BMap.Marker(pp))    // 添加标注
      }
      let local = new BMap.LocalSearch(map, { // 智能搜索
        onSearchComplete: myFun
      })
      local.search(myValue)
    }
  }
}
</script>

<style lang="less">
html, body {
  background-color: #fff;
}
.tangram-suggestion-main {
  .route-icon {
    font-size: .42rem;
    color: #333;
    // font-weight: bold;
    padding-left: 0 !important;
    white-space: nowrap;
    text-overflow: ellipsis;
    width: 86%;
    display: block;
  }
  .tangram-suggestion-grey {
    display: block;
    font-size: .40rem;
    color: #666;
    margin-top: .05rem;
    font-weight: normal;
  }
}
.tangram-suggestion table tr td {
  width: 100%;
  padding: .28rem .48rem .24rem .48rem !important;
}
#r-result{
  width: 100%;
}
.allmap {
    // margin: .32rem auto 0 auto;
    margin: 0 auto;
    width: 100%;
    max-width: 10.80rem;
    // height: 10.38rem;
    height: 8rem;
}
.anchorBL {
  display: none !important;
}
.houseEval-container {
    position: relative;
    width: 10.80rem;
    margin: 0 auto;
    background-color: #fff;
    padding-bottom: .3rem;
    .contact-ul {
      position: relative;
      width: 100%;
      height: auto;
      background-color: #fff;
      overflow: hidden;
    }
    .contact-detail-content {
      position: relative;
      width: 100%;
      display: flex;
    }
    .contact-detail-item {
      width: 3rem;
      padding-left: .48rem;
      color: #333;
      height: 1.46rem;
      line-height: 1.46rem;
      // font-weight: bold;
      font-size: .4rem;
    }
    .contact-detail-input {
      flex: 1;
      border: none;
      outline: none;
      padding-left: .48rem;
      font-size: .42rem;
      color: #333;
    }
    .contact-detail-unit {
      float: right;
      padding-right: .48rem;
      color: #666;
      height: 1.46rem;
      line-height: 1.46rem;
      font-size: .4rem;
    }

    .weui-cell {
      display: flex;
      padding: 0;
      height: 1.46rem;
      line-height: 1.46rem;
      font-size: .4rem;
    }
    .weui-cell__hd {
      width: 3rem;
      padding-left: .48rem;
      text-align: left;
      // font-weight: bold;
    }
    .vux-cell-box {
      width: 100%;
    }
    .vux-popup-picker-select {
      padding-left: .48rem;
    }
    .vux-cell-box:before {
      border-top: none;
    }
    .weui-cell_access .weui-cell__ft:after {
      display: none;
    }
    .current-city {
        height: .96rem;
        line-height: .96rem;
        font-size: .4rem;
        color: #666;
        width: 2.16rem;
        text-align: center;
        overflow: hidden;
        .locationing {
          color: #369fff;
        }
        .location-img {
            display: inline-block;
            background: url(../../assets/application-process_icon_location.png) no-repeat center center;
            background-size: cover;
            height: .48rem;
            width: .48rem;
            vertical-align: middle;
            margin-right: .08rem;
        }
    }
    .weui-unit-btn {
        position: absolute;
        top: 0;
        right: .64rem;
        height: 1.46rem;
        border-left: none;
        font-size: .42rem;
        background-color: #fff;
        color: #666;
    }
    .assess-btn {
        margin: .32rem auto;
    }
}

.weui-search-bar {
    position: relative;
    display: flex;
    box-sizing: border-box;
    background-color: #fff;
    padding: .32rem 0 .32rem .4rem;
    .weui-search-bar__form {
      position: relative;
      flex: auto;
    }
    .weui-search-bar__box {
        position: relative;
        box-sizing: border-box;
        z-index: 1;
        width: 8rem;
        height: .96rem;
        line-height: .96rem;
        padding-left: .4rem;
        padding-right: .4rem;
        border-radius: 40px;
        background-color: #EFEFF4;
    }
    .weui-icon-search {
        position: absolute;
        font-size: .48rem;
        line-height: .96rem;
        left: .4rem;
    }
    .weui-icon-clear {
        position: absolute;
        top: 0;
        right: 0;
        padding: 0 10px;
        font-size: .32rem;
        line-height: .96rem;
        right: 0;
    }
    .weui-search-bar__input {
        font-size: .4rem;
        padding: 0;
        padding-left: .64rem;
        height: .96rem;
        width: 100%;
        background-color: transparent;
    }
}

.tangram-suggestion {
    overflow: hidden;
    border: none !important;
    td {
        height: .96rem !important;
        line-height: .96rem !important;
        font-size: .32rem;
        .route-icon {
            padding-left: .48rem;
            background: transparent;
        }
    }
    div:last-child {
        display: none;
    }
}
.tangram-suggestion-main {
  z-index: 100;
}

.house-modal {
    position: absolute;
    top: 3.2rem;
    left: 50%;
    margin-left: -3.88rem;
    width: 6.96rem;
    padding: .4rem;
    border-radius: 15px;
    background-color: #fff;
    z-index: 10;
    .house-title {
        font-size: .48rem;
        color: #333;
        line-height: 1;
    }
    .house-addr {
        margin-top: .32rem;
        font-size: .4rem;
        color: #666;
    }
    .house-addr-desc {
        margin-top: .48rem;
        input {
            width: 2.94rem;
            height: .88rem;
            line-height: .88rem;
            border: 1px solid #ccc;
            border-radius: .2rem;
            font-size: .4rem;
            color: #666;
            padding: 0 .3rem;
            box-sizing: border-box;
            &:last-child {
                float: right;
            }
        }
    }
}
</style>
