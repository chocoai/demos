<template>
  <div class='houseEval-container'>
    <div class="house-search">
      <div id="r-result" class="weui-search-bar weui-search-bar_focusing">
          <form class="weui-search-bar__form">
            <div class="weui-search-bar__box">
                <i class="weui-icon-search"></i>
                <input id="suggestId" ref="suggestId" type="text" class="weui-search-bar__input" placeholder="请输入本人名下房产所在小区" required="" autocomplete="off" v-model.trim="inputValue" />
                <a href="javascript:" @click='clearData' class="weui-icon-clear"></a>
            </div>
          </form>
          <div class="current-city" @click='changeCity'><span v-if='!currentCity' class="locationing">定位中...</span><span v-if='currentCity' class="location-img"></span><span id="currentCity">{{currentCity}}</span></div>
      </div>
      <div style="border:1px solid #C0C0C0;width:150px;height:auto; display:none;">{{searchResultPanel}}</div>
    </div>
    <ul class="house-result">
      <li class="house-result-item" @click="choseHouse(item)" v-for="(item, index) in searchResult" :key="index">
        <span class="house-result-img"></span>
        <p class="house-result-detail">
          <span class="house">{{item.name}}</span>
          <span class="address">{{`${item.district}${item.address ? '---' + item.address : ''}`}}</span>
        </p>
      </li>
      <!-- <li class="house-result-item">
        <span class="house-result-img"></span>
        <p class="house-result-detail">
          <span class="house">在水一方</span>
          <span class="address">上城区富春路</span>
        </p>
      </li> -->
    </ul>
    <div id="allmap" class="allmap"></div>
    <div v-show="showBottom" class="house-bottom" :style="`bottom: ${ !selectHouse ? '2.2rem' : '.8rem'};`">
      <div v-if='!evaluation'>
        <div v-if='selectHouse'>
          <ul class="contact-ul">
            <li class='contact-detail-content' v-if="getInfo" @click='selectDetail'>
              <p class='contact-detail-item'>详细地址</p>
              <p class='contact-detail-select' :style="`color: ${listAddr? '#333': '#999'}`">{{listAddr? listAddr: '请选择'}}</p>
              <img class="icon-choice" src="../../assets/icon_choice.png"/>
            </li>
            <li class='contact-detail-content'>
              <p class='contact-detail-item'>房屋面积</p>
              <input class='contact-detail-input' type="number" placeholder='请输入房屋面积' v-model="bldgarea" >
              <p class='contact-detail-unit'>m<sup>2</sup></p>
            </li>
            <li class='contact-detail-content'>
              <popup-picker placeholder='请选择' title="房产类型" value-text-align='left' :data="fclxDicts" :columns="1" v-model="houseTypePicker" show-name></popup-picker>
              <img class="icon-choice" src="../../assets/icon_choice.png"/>
            </li>
            <!--<li v-if="isShow" class='contact-detail-content'>
              <p class='contact-detail-item'>联系方式</p>
              <input class='contact-detail-input' type="tel" placeholder='请输入手机号' maxlength="11" v-model="telephone" />
            </li>-->
          </ul>
          <v-button url='/loan/contact' @next='evaluate' style="margin: .5rem auto">{{valuationCode && type === 'valuation' ? '下一步' : '免费评估'}}</v-button>
          <div class="house-pass" v-if='type == "valuation"' @click="next">跳过</div>
        </div>
        <div v-else>
          <ul class="contact-ul">
            <li class='contact-detail-content' @click='selectHouse = !selectHouse'>
              <p class='contact-detail-item'>详细地址</p>
              <p class='contact-detail-select' :style="`color: ${listAddr? '#333': '#999'}`">{{listAddr? listAddr: '请选择'}}</p>
              <img class="icon-choice" src="../../assets/icon_choice.png"/>
            </li>
            <li class='contact-detail-content'>
              <p class="select-item" style="flex: 2">楼栋</p>
              <p class="select-item">单元</p>
              <p class="select-item" style="flex: 3">房号</p>
              <img class="select-item-determine" @click='selectHouse = !selectHouse' src='./../../assets/icon_determine.png' />
            </li>
          </ul>
          <smooth-picker ref="smoothPicker" :data="listData" :change="listDataChange" />
        </div>
      </div>
      <div v-else>
        <ul class="contact-ul" v-if="evaluateNum && loanNum && houseUnitPrice">
          <li class='contact-detail-content' @click='selectHouse = !selectHouse'>
            <p class='contact-detail-item'>房屋单价</p>
            <p class='contact-detail-select'>{{houseUnitPrice ? houseUnitPrice + '元/平' : '哎呀，我估不出来，请申请试试'}}</p>
            <!--<img class="icon-choice" src="../../assets/icon_choice.png"/>-->
          </li>
          <li class='contact-detail-content' @click='selectHouse = !selectHouse'>
            <p class='contact-detail-item'>房屋估值</p>
            <p class='contact-detail-select' :style="`color: ${evaluateNum? '#ff9a4a': '#999'}`">{{evaluateNum ? evaluateNum + '万元' : '哎呀，我估不出来，请申请试试'}}</p>
            <!--<img class="icon-choice" src="../../assets/icon_choice.png"/>-->
          </li>
          <li class='contact-detail-content' @click='selectHouse = !selectHouse'>
            <p class='contact-detail-item'>最高可贷额度</p>
            <p class='contact-detail-select' :style="`color: ${loanNum? '#ff9a4a': '#999'}`">{{loanNum ? loanNum + '万元' : '哎呀，我估不出来，请申请试试'}}</p>
            <!--<img class="icon-choice" src="../../assets/icon_choice.png"/>-->
          </li>
        </ul>
        <ul class="contact-ul" v-else>
          <li class="contact-false">
            <img class="false-evaluate" src="../../assets/img_false_evaluate.png" alt="false-evaluate" />
            <span class="false-evaluate-desc">哎呀，我估不出来，请申请试试</span>
          </li>
        </ul>
        <v-button url='/loan/contact' @next='next' style="margin: .2rem auto">我要贷款</v-button>
      </div>
    </div>
  </div>
</template>

<script>
import Store from 'store'
import Utils from '../../config/utils'
import VButton from './../../components/button'
import SmoothPicker from './../../components/smoothPicker'
import Config from '../../config/index'
import { PopupPicker } from 'vux'
import { getHouseSearch, getHouseBuild, getHouseUnit, getHouseRoom, getEvaluateRoom, getDictValue } from '../../service/getData'
import Wxsdk from '../../config/wxJsSdk'

export default {
  components: {
    VButton,
    SmoothPicker,
    PopupPicker
  },
  data () {
    return {
      proCode: '',
      loanCode: '',
      valuationCode: '',
      enterpriseCode: '',
      // houseTitle: '本人名下房产所在小区',
      // houseAddr: '本人名下房产所在小区地址',
      bldgarea: '',
      // floor: '',
      // height: '',
      // telephone: '',
      currentCity: '',
      // choseCity: '太原',
      searchResultPanel: '',
      hourseParams: {},
      proptypePicker: [],
      params: {
        valuationCode: '',  // 估值编码
        loanCode: '',     // 进件编码
        city: '',      // 城市
        district: '',  // 区
        projectName: '',  // 小区
        buildingNumber: '',     // 幢
        unit: ''     // 楼层
      },
      houseParams: {
        valuationCode: '',  // 估值编码
        loanCode: '',     // 进件编码
        city: '',      // 城市
        district: '',  // 区
        projectName: ''  // 小区
      },
      buildList: [],
      unitList: [],
      roomList: [],
      listNumber: [0, 0, 0],   // 选中
      listAddr: '',
      listData: [
        {
          currentIndex: 0,
          flex: 2,
          list: [
            '暂无'
          ],
          textAlign: 'center',
          className: 'build'
        },
        {
          currentIndex: 0,
          flex: 1,
          list: [
            '暂无'
          ],
          textAlign: 'center',
          className: 'unit'
        },
        {
          currentIndex: 0,
          flex: 3,
          list: [
            '暂无'
          ],
          textAlign: 'center',
          className: 'room'
        }
      ],
      isShow: true,
      selectHouse: true,     // 选择房屋
      evaluation: false,     // 是否评估
      houseEvaluate: '',
      loanLimit: '',
      evaluateNum: 0,      // 估值
      loanNum: 0,          // 可贷
      houseUnitPrice: 0, // 房屋单价
      loanRoutes: '',       //
      getInfo: false,       // 是否获取到数据，获取不到则直接估值
      getTime: new Date().getTime(),   // 时长统计
      type: this.$route.params.type,     // 类型
      houseTypePicker: [], // 房产类型选择项
      fclxDicts: [], // 房产类型字典列表
      inputValue: '',    // 输入内容
      searchResult: [],
      showBottom: true
    }
  },
  created () {
    let that = this
    let cookies = Store.get(Config.constants.cookies)
    let valuation = JSON.parse(sessionStorage.getItem(Config.constants.valuation)) || {}
    let activityValuationCode = sessionStorage.getItem(Config.constants.activityValuation)
    // 有待删除
    // cookies = Object.assign(cookies, {loanCode: '484c08f89c8146588f9aa4d391017094'})
    // Store.set(Config.constants.cookies, cookies)
    that.proCode = cookies.proCode
    that.loanCode = cookies.loanCode
    that.loanRoutes = cookies.loanRoutes
    // 如果存在估值则采取估值的路由
    if (that.type === 'valuation') {
      that.loanRoutes = valuation.list
      that.valuationCode = valuation.valuationCode || ''
    }
    if (that.type === 'activity') {
      that.valuationCode = activityValuationCode || ''
      Wxsdk.wxShare(() => {
      }, {}, 'activityValuation')
    }
    that.params = Object.assign(that.params, {loanCode: cookies.loanCode, valuationCode: that.valuationCode || ''})
    that.houseParams = Object.assign(that.houseParams, {loanCode: cookies.loanCode, valuationCode: that.valuationCode || ''})
    that.isShow = Utils.getQueryParams('show') || true
  },
  mounted () {
    let that = this
    // if (!that.loanCode) return
    that.$nextTick(
      that.createMap(window.BMap)
    )
    that.getDicts({code: 'fclx'})
    // Utils.countPlus('房屋估值', 'send')
  },
  watch: {
    inputValue: async function (newValue, oldValue) {
      if (this.showOpt) {
        this.showOpt = false
        return null
      }
      let params = {
        city: this.currentCity + '市',
        projectName: this.inputValue,
        loanCode: this.loanCode,
        valuationCode: this.valuationCode
      }
      let res = await getHouseSearch(params, this.type)
      this.searchResult = []
      this.getInfo = false
      this.reset()
      if (res.data && res.data.length) this.searchResult = res.data.slice(0, 5)
    }
  },
  methods: {
    async getDicts (params) { // 字典列表：房产类型
      const that = this
      const res = await getDictValue(params)
      if (res.code === Config.resCode.success) {
        that.$vux.loading.hide()
        if (res.data && res.data.fclx) {
          res.data.fclx.forEach((item, index) => {
            that.fclxDicts.push({
              value: item.ddValue,
              name: item.ddText,
              parent: item.parentValue
            })
          })
        }
      } else {
        that.$vux.toast.text(res.msg)
      }
    },
    // 选择小区
    choseHouse (item) {
      let that = this
      // // 重置
      that.reset()
      // that.$refs.suggestId.value = item.name
      that.inputValue = item.name
      // 选择后是否显示
      that.showOpt = true
      that.params = Object.assign(this.params, {city: item.city, district: item.district, projectName: item.name})
      that.houseParams = Object.assign(this.houseParams, {city: item.city, district: item.district, projectName: item.name})
      // 解析地址定位
      let myGeo = new window.BMap.Geocoder()
      myGeo.getPoint(`${item.city}${item.district}${item.name}`, function (point) {
        if (point) {
          that.map.panTo(point)
          that.map.addOverlay(new window.BMap.Marker(point))
        } else {
          alert('您选择地址没有解析到结果!')
        }
      }, `${item.city}`)
      // 经纬度定位
      // that.map.panTo(new window.BMap.Point(item.lng, item.lat))
      // that.map.addOverlay(new window.BMap.Marker(new window.BMap.Point(item.lng, item.lat)))
      that.buildChange()
      that.searchResult = []
    },
    // 修改城市
    changeCity () {
      const that = this
      // 区别类型，存在类型的为估值或活动估值排名，不存在的为进件
      if (that.type) {
        this.$router.push(`${Config.constants.houseLocationRouter}/${that.type}`)
      } else {
        this.$router.push(Config.constants.houseLocationRouter)
      }
    },
    // 将房屋信息也重置
    clearData () {
      const that = this
      that.inputValue = ''
      // that.$refs.suggestId.value = ''
      that.showOpt = false
      that.getInfo = false
      this.reset()
    },
    reset () {
      const that = this
      that.selectHouse = true      // 选择房屋
      that.evaluation = false      // 是否评估
      that.params = Object.assign(that.params, {
        city: '',      // 城市
        district: '',  // 区
        projectName: '',  // 小区
        buildingNumber: '',     // 幢
        room: '',
        unit: ''     // 楼层
      })
      that.houseParams = Object.assign(that.houseParams, {
        city: '',      // 城市
        district: '',  // 区
        projectName: ''  // 小区
      })
      that.buildList = []
      that.unitList = []
      that.roomList = []
      that.listNumber = [0, 0, 0]   // 选中
      that.listAddr = ''      // 地址
      that.bldgarea = ''      // 房屋面积
      that.evaluateNum = 0      // 估值
      that.loanNum = 0          // 可贷
      that.houseUnitPrice = 0 // 房屋单价
      if (that.$refs.smoothPicker) {
        that.$refs.smoothPicker.setGroupData(0, Object.assign(that.listData[0], { currentIndex: 0, list: ['暂无'] }))
        that.$refs.smoothPicker.setGroupData(1, Object.assign(that.listData[1], { currentIndex: 0, list: ['暂无'] }))
        that.$refs.smoothPicker.setGroupData(2, Object.assign(that.listData[2], { currentIndex: 0, list: ['暂无'] }))
      }
      // that.telephone = ''     // 联系方式
    },
    listDataChange (gIndex, iIndex) {
      switch (gIndex) {
        case 2:
          this.roomChange(iIndex)
          break
        case 1:
          this.unitChange(iIndex)
          break
        default:
          this.buildChange(iIndex)
      }
    },
    selectDetail () {
      const that = this
      that.selectHouse = false
      that.strJoin()
    },
    // 幢
    async buildChange (iIndex) {
      const that = this
      that.listNumber[0] = iIndex || 0
      // that.params = Object.assign(that.params)
      const res = await getHouseBuild(that.houseParams, that.type)
      that.buildList = res.data
      let tmpBuildList = res.data && res.data.length ? res.data.reduce((arr, item) => {
        arr.push(item.label)
        return arr
      }, []) : ['暂无']
      if (that.$refs.smoothPicker && !iIndex) {
        that.$refs.smoothPicker.setGroupData(0, Object.assign(that.listData[0], { currentIndex: that.listNumber[0], list: tmpBuildList }))
      } else {
        that.listData[0] = Object.assign(that.listData[0], {currentIndex: that.listNumber[0], list: tmpBuildList})
      }
      // 临时需求，要求不显示
      if (tmpBuildList.includes('暂无')) {
        // 查找不到不往下走
        that.getInfo = false
      } else {
        that.getInfo = true
        this.unitChange()
      }
    },
    // 单元
    async unitChange (iIndex) {
      const that = this
      that.listNumber[1] = iIndex || 0
      that.params = Object.assign(that.params, {
        buildingNumber: that.buildList && that.buildList[that.listNumber[0]] && that.buildList[that.listNumber[0]].buildingNumber,
        projectName: that.buildList && that.buildList[that.listNumber[0]] && that.buildList[that.listNumber[0]].projectName
      })
      const res = await getHouseUnit(that.params, that.type)
      that.unitList = res.data
      let tmpUnitList = res.data && res.data.length ? res.data.reduce((arr, item) => {
        arr.push(item.label)
        return arr
      }, []) : ['暂无']
      if (that.$refs.smoothPicker && !iIndex) {
        that.$refs.smoothPicker.setGroupData(1, Object.assign(that.listData[1], { currentIndex: that.listNumber[1], list: tmpUnitList }))
      } else {
        that.listData[1] = Object.assign(that.listData[1], {currentIndex: that.listNumber[1], list: tmpUnitList})
      }
      this.roomChange()
    },
    // 房号
    async roomChange (iIndex) {
      const that = this
      that.listNumber[2] = iIndex || 0
      that.params = Object.assign(that.params, {unit: that.unitList && that.unitList[that.listNumber[1]] && that.unitList[that.listNumber[1]].unitNumber})
      const res = await getHouseRoom(that.params, that.type)
      that.roomList = res.data
      let tmpRoomList = res.data && res.data.length ? res.data.reduce((arr, item) => {
        arr.push(item.label)
        return arr
      }, []) : ['暂无']
      that.params = Object.assign(that.params, {room: that.roomList && that.roomList[that.listNumber[2]] && that.roomList[that.listNumber[2]].room})
      if (that.$refs.smoothPicker && !iIndex) {
        that.$refs.smoothPicker.setGroupData(2, Object.assign(that.listData[2], { currentIndex: that.listNumber[2], list: tmpRoomList }))
      } else {
        that.listData[2] = Object.assign(that.listData[2], {currentIndex: that.listNumber[2], list: tmpRoomList})
      }
      // 打开的时候拼接
      if (!that.selectHouse) that.strJoin()
    },
    strJoin () {
      const that = this
      let buildStr = that.buildList && that.buildList.length ? that.buildList[that.listNumber[0]].label : ''
      let unitStr = that.unitList && that.unitList.length ? that.unitList[that.listNumber[1]].label : ''
      let roomStr = that.roomList && that.roomList.length ? that.roomList[that.listNumber[2]].label : ''
      that.listAddr = buildStr + unitStr + roomStr
    },
    async evaluate () {
      const that = this
      // const prdCode = that.proCode
      // if (!that.valuationCode) return that.$vux.toast.text(Config.constants.nullCode)
      if (!that.inputValue) return that.$vux.toast.text('请输入本人名下房产所在小区')
      if (!that.listAddr && that.getInfo) return that.$vux.toast.text(Config.constants.nullListAddr)
      const bldgarea = that.bldgarea
      if (!bldgarea) return that.$vux.toast.text(Config.constants.nullBldgarea)
      if (bldgarea > 999999.99 || bldgarea < 0.01) return that.$vux.toast.text('房屋面积范围为0.01~999999.99')
      const reg = /^[0-9]+([.]{1}[0-9]{1,2})?$/
      if (!reg.test(bldgarea)) return that.$vux.toast.text('房屋面积最多2位小数')
      const houseType = that.houseTypePicker[0]
      if (!houseType) return that.$vux.toast.text(Config.constants.nullHouseType)
      let params = {
        city: that.params.city,
        district: that.params.district,
        projectName: that.params.projectName || '',
        buildingNumber: that.params.buildingNumber || '',
        unitNumber: that.params.unit || '',
        room: that.params.room || '',
        size: that.bldgarea,
        loanCode: that.loanCode,
        valuationCode: that.valuationCode,
        houseType: houseType // 房产类型
      }
      // 临时需求添加，拿不到楼栋信息
      if (!that.getInfo) {
        params.city = that.houseParams.city || that.currentCity + '市'
        params.district = that.houseParams.district
        params.loanCode = that.houseParams.loanCode
        params.valuationCode = that.houseParams.valuationCode
        params.projectName = that.houseParams.projectName || that.inputValue
      }
      that.$vux.loading.show()
      const res = await getEvaluateRoom(params, that.type)
      if (that.valuationCode) return that.next()
      if (res.code === Config.resCode.success) {
        that.evaluation = true
        that.evaluateNum = res.data.total
        that.loanNum = res.data.loanLimit
        that.houseUnitPrice = res.data.houseUnitPrice // 房屋单价
      } else {
        // 所以异常全部为0
        // that.$vux.toast.text(res.msg)
        that.evaluation = true
        that.evaluateNum = 0
        that.loanNum = 0
        that.houseUnitPrice = 0 // 房屋单价
      }
      that.$vux.loading.hide()
    },
    next () {
      const that = this
      that.$vux.loading.show()
      if (that.type === 'activity') {
        that.$router.push(Config.constants.ActivityValuationResult)
      } else {
        let loanRoutes = that.loanRoutes
        let pathIndex = Utils.getIndex(loanRoutes, window.location.pathname)
        that.$router.push(loanRoutes[pathIndex + 1])
      }
      that.$vux.loading.hide()
    },
    createMap (BMap) {
      const that = this
      let choseCity = Store.get(Config.constants.cityChose)
      Store.set(Config.constants.cityChose, '')
      that.map = new BMap.Map('allmap')
      if (choseCity) {
        // 创建地址解析器实例
        that.currentCity = choseCity
        let choseLocation = new BMap.Geocoder()
        choseLocation.getPoint(choseCity + '市', function (point) {
          if (point) {
            that.map.centerAndZoom(point, 21)
            that.map.addOverlay(new BMap.Marker(point))
            that.map.panTo(point) // 移动
            // that.map.disableDragging()     // 禁止拖拽
            // // 建立一个自动完成的对象
            // let ac = new BMap.Autocomplete({
            //   'input': 'suggestId',
            //   'location': map
            // })
            that.$vux.loading.hide()
            // ac.addEventListener('onhighlight', function (e) {
            //   let str = ''
            //   let _value = e.fromitem.value
            //   let value = ''
            //   if (e.fromitem.index > -1) {
            //     value = _value.province + _value.city + _value.district + _value.street + _value.business
            //   }
            //   str = 'FromItem<br />index = ' + e.fromitem.index + '<br />value = ' + value

            //   value = '<br />value = '
            //   if (e.toitem.index > -1) {
            //     _value = e.toitem.value
            //     value = _value.province + _value.city + _value.district + _value.street + _value.business
            //   }
            //   str += '<br />ToItem<br />index = ' + e.toitem.index + '<br />value = ' + value
            //   that.searchResultPanel = str
            // })
            // ac.addEventListener('onconfirm', function (e) {    // 鼠标点击下拉列表后的事件
            //   let _value = e.item.value
            //   if (_value.city.indexOf('市') > -1) {
            //     that.hourseParams.city = _value.city.substring(0, _value.city.length - 1)
            //   }
            //   that.hourseParams.district = _value.district
            //   that.houseTitle = that.hourseParams.haname = _value.business
            //   let myValue = _value.province + _value.city + _value.district + _value.street + _value.business
            //   that.houseAddr = that.hourseParams.location = myValue
            //   that.searchResultPanel = 'onconfirm<br />index = ' + e.item.index + '<br />myValue = ' + myValue
            //   that.setPlace(BMap, map, myValue)
            //   // 获取幢信息
            //   // 显示底部信息
            //   // 重置
            //   that.reset()
            //   that.params = Object.assign(that.params, {city: _value.city, district: _value.district, projectName: _value.business})
            //   that.houseParams = Object.assign(that.houseParams, {city: _value.city, district: _value.district, projectName: _value.business})
            //   that.buildChange()
            // })
          } else {
            alert('您选择地址没有解析到结果!')
          }
        }, '杭州市')
      } else {
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
            // 定位城市
            that.currentCity = city
            let point = new BMap.Point(r.point.lng, r.point.lat)
            that.map.centerAndZoom(point, 21)   // 初始化地图,设置中心点坐标和地图级别
            that.map.addOverlay(mk)
            that.map.panTo(r.point) // 移动
            // that.map.disableDragging()     // 禁止拖拽
            // 建立一个自动完成的对象
            // let ac = new BMap.Autocomplete({
            //   'input': 'suggestId',
            //   'location': map
            // })
            that.$vux.loading.hide()
            // ac.addEventListener('onhighlight', function (e) {
            //   let str = ''
            //   let _value = e.fromitem.value
            //   let value = ''
            //   if (e.fromitem.index > -1) {
            //     value = _value.province + _value.city + _value.district + _value.street + _value.business
            //   }
            //   str = 'FromItem<br />index = ' + e.fromitem.index + '<br />value = ' + value

            //   value = '<br />value = '
            //   if (e.toitem.index > -1) {
            //     _value = e.toitem.value
            //     value = _value.province + _value.city + _value.district + _value.street + _value.business
            //   }
            //   str += '<br />ToItem<br />index = ' + e.toitem.index + '<br />value = ' + value
            //   that.searchResultPanel = str
            // })
            // // 鼠标点击下拉列表后的事件
            // ac.addEventListener('onconfirm', function (e) {
            //   let _value = e.item.value
            //   if (_value.city.indexOf('市') > -1) {
            //     that.hourseParams.city = _value.city.substring(0, _value.city.length - 1)
            //   }
            //   that.hourseParams.district = _value.district
            //   that.houseTitle = that.hourseParams.haname = _value.business
            //   let myValue = _value.province + _value.city + _value.district + _value.street + _value.business
            //   that.houseAddr = that.hourseParams.location = myValue
            //   that.searchResultPanel = 'onconfirm<br />index = ' + e.item.index + '<br />myValue = ' + myValue
            //   that.setPlace(BMap, map, myValue)
            //   // 获取幢信息
            //   // 显示底部信息
            //   // 重置
            //   that.reset()
            //   that.params = Object.assign(that.params, {city: _value.city, district: _value.district, projectName: _value.business})
            //   that.houseParams = Object.assign(that.houseParams, {city: _value.city, district: _value.district, projectName: _value.business})
            //   that.buildChange()
            // })
          } else {
            console.log('failed' + this.getStatus())
          }
        }, {enableHighAccuracy: true})
      }
    }
    // setPlace (BMap, map, myValue) {
    //   that.map.clearOverlays()    // 清除地图上所有覆盖物
    //   function myFun () {
    //     let pp = local.getResults().getPoi(0).point    // 获取第一个智能搜索的结果
    //     that.map.centerAndZoom(pp, 20)
    //     that.map.addOverlay(new BMap.Marker(pp))    // 添加标注
    //   }
    //   let local = new BMap.LocalSearch(map, { // 智能搜索
    //     onSearchComplete: myFun
    //   })
    //   local.search(myValue)
    // }
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
.house-search {
  position: fixed;
  width: 10.80rem;
  margin-left: -5.4rem;
  left: 50%;
  right: 0;
  top: 0;
  z-index: 10000;
  height: 1.56rem;
  line-height: 1.56rem;
  box-sizing: border-box;
}
.house-result {
  position: fixed;
  width: 10.80rem;
  margin-left: -5.4rem;
  left: 50%;
  right: 0;
  top: 1.56rem;
  z-index: 10000;
  height: 1.56rem;
  line-height: 1.56rem;
  box-sizing: border-box;
}
.house-result-item {
  background-color: #fbfbfb;
  display: flex;
  position: relative;
  align-items: center;
  .house-result-img {
    display: inline-block;
    background: url(../../assets/application-process_icon_location.png) no-repeat center center;
    background-size: cover;
    height: .5rem;
    width: .48rem;
    vertical-align: middle;
    margin: 0 .3rem;
  }
  .house-result-detail {
    display: flex;
    flex-direction: column;
    padding: .2rem 0;
  }
  .house {
    font-size: .4rem;
    line-height: 1;
    padding-bottom: .2rem;
    color: #000;
  }
  .address {
    font-size: .32rem;
    // line-height: .8rem;
    line-height: 1;
    color: #666;
  }
  &:after{
    content: " ";
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    height: 1px;
    border-bottom: 1px solid #e5e5e5;
    color: #e5e5e5;
    transform-origin: 0 100%;
    transform: scaleY(0.5);
    width:9.6rem;
  }
}
#r-result{
  width: 100%;
  height: 1.56rem;
  line-height: 1.56rem;
  box-sizing: border-box;
}
.allmap {
    width: 100%;
    max-width: 10.80rem;
    height: 100%;
    max-height: 9.6rem;
    // max-height: calc(~"100vh - 6.9rem")
}
.anchorBL {
  display: none !important;
}
.houseEval-container {
    position: relative;
    box-sizing: border-box;
    width: 10.80rem;
    margin: 0 auto;
    background-color: #fff;
    // height: 100%;
    height: 100vh;
    min-height: 17.04rem;
    padding-top: 1.56rem;
    .house-bottom {
      position: relative;
      bottom: 0;
      left: 0;
      right: 0;
      width: 10.8rem;
      // position: fixed;
      // bottom: 0;
      // left: 0;
      // right: 0;
      // width: 10.8rem;
      background-color: #fff;
    }
    .smooth-picker {
      height: 6rem;
      .smooth-list {
        height: .2rem;
        top:2.6rem;
      }
      .smooth-handle-layer .smooth-middle {
        height: 1.2rem;
      }
      .smooth-item {
        height: 1rem;
        font-size: .4rem;
      }
      .smooth-handle-layer {
        .smooth-top {
          transform: translate3d(0, 0, 3.625rem);
        }
        .smooth-bottom {
          transform: translate3d(0, 0, 3.625rem);
        }
      }
    }
    .contact-ul {
      position: relative;
      width: 100%;
      background-color: #fff;
      overflow: hidden;
    }
    .contact-detail-content {
      position: relative;
      width: 100%;
      display: flex;
      .weui-label {
        color: #333;
      }
    }
    .select-item {
      height: 1.46rem;
      line-height: 1.46rem;
      font-size: .4rem;
      flex: 1;
      color: #333;
      text-align: center;
    }
    .icon-choice {
      width: .4rem;
      height: .4rem;
      position: relative;
      top: .5rem;
      right: .48rem;
    }
    .select-item-determine {
      width: .48rem;
      height: .48rem;
      padding: .49rem;
      position: absolute;
      right: 0;
    }
    .contact-detail-item {
      width: 2.5rem;
      padding-left: .48rem;
      color: #333;
      height: 1.46rem;
      line-height: 1.46rem;
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
    .contact-detail-select {
      flex: 1;
      border: none;
      outline: none;
      line-height: 1.46rem;
      padding-left: .48rem;
      font-size: .42rem;
      color: #333;
    }
    .contact-detail-unit {
      float: right;
      width: .5rem;
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
      width: 2.5rem;
      padding-left: .48rem;
      text-align: left;
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
    .vux-popup-picker-placeholder {
      color: rgb(153, 153, 153);
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
            height: .58rem;
            width: .58rem;
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
    .contact-false {
      margin: .44rem 0 .5rem 1.2rem;
    }
    .false-evaluate {
      width: 2rem;
      height: 2rem;
      vertical-align: middle;
    }
    .false-evaluate-desc {
      display: inline-block;
      font-size: .4rem;
      text-indent: .24rem;
      color: #666;
      vertical-align: middle;
    }
    .house-pass {
      position: relative;
      margin: .4rem auto;
      font-size: .4rem;
      color: #369fff;
      overflow: hidden;
      width: 2rem;
      height: 1rem;
      line-height: 1rem;
      text-align: center;
      text-decoration: underline;
    }
    .house-bottom:after {
      content: '';
      display: table;
      clear: both;
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
        line-height: .96rem;
        vertical-align: middle;
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
</style>
