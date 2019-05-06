<template>
  <div class="signature-container">
      <vue-signature class="canvas" ref="signature" :sigOption="option" w="100vw" h="100vh"></vue-signature>
        <scroll>
          <div class="placeholder" v-if="placeholderShow">
            <span class="placeholder-content">签字区域</span>
          </div>
        </scroll>

      <span class="title">请横屏书写姓名</span>
      <div class="btn-group">
        <button class="btn clear" @click="clear">重写</button>
        <button class="btn save" @click="save">确定</button>
        <!-- <button class="btn" @click="undo">Undo</button> -->
        <!-- <button class="btn" @click="addWaterMark">addWaterMark</button> -->
        <!-- <button class="btn" @click="fromDataURL">fromDataURL</button> -->
      </div>
  </div>
</template>

<script>
import vueSignature from 'vue-signature/src/lib/vue-signature'
import { postSignature } from '../../service/getData'
import Scroll from '../../components/scroll.vue'
import Config from '../../config/index'
import Utils from '../../config/utils'
import Store from 'store'

export default {
  name: 'app',
  data () {
    return {
      option: {
        penColor: 'rgb(0, 0, 0)',
        minWidth: 3.5,
        maxWidth: 5,
        backgroundColor: 'rgba(255,255,255, 0)'
      },
      placeholderShow: true,
      loanRoutes: [],
      getTime: new Date().getTime()   // 时长统计
    }
  },
  components: {
    vueSignature,
    Scroll
  },
  created () {
    const that = this
    const cookies = Store.get(Config.constants.cookies)
    that.loanCode = cookies.loanCode
    that.loanRoutes = cookies.loanRoutes
    that.pathIndex = Utils.getIndex(that.loanRoutes, window.location.pathname)
  },
  methods: {
    async save () {
      const that = this
      if (that.$refs.signature.isEmpty()) return that.$vux.toast.text('请书写姓名')
      const png = that.$refs.signature.save()
      const res = await postSignature({
        reqCode: that.loanCode,
        signature: encodeURIComponent(png.split('data:image/png;base64,')[1])
      })
      if (res.code === Config.resCode.success) {
        that.$vux.loading.show({
          text: '正在加载'
        })
        let loanRoutes = that.loanRoutes
        let pathIndex = Utils.getIndex(loanRoutes, window.location.pathname)
        Utils.countPlus('页面停留时长', 'send', {'pageName': '手写签名', 'stayTime': new Date().getTime() - this.getTime})
        if (pathIndex > -1 && pathIndex !== loanRoutes.length - 1) {
          that.$router.push(loanRoutes[pathIndex + 1])
          that.$vux.loading.hide()
        } else {
          that.$vux.loading.hide()
          that.$router.push(Config.constants.confirmRouter)
        }
      } else {
        that.$vux.toast.text(res.msg)
      }
    },
    clear () {
      const that = this
      that.$refs.signature.clear()
    },
    undo () {
      const that = this
      that.$refs.signature.undo()
    },
    addWaterMark () {
      const that = this
      that.$refs.signature.addWaterMark({
        text: 'mark text',          // watermark text, > default ''
        font: '20px Arial',         // mark font, > default '20px sans-serif'
        style: 'all',               // fillText and strokeText,  'all'/'stroke'/'fill', > default 'fill
        fillStyle: 'red',           // fillcolor, > default '#333'
        strokeStyle: 'blue',        // strokecolor, > default '#333'
        x: 100,                     // fill positionX, > default 20
        y: 200,                     // fill positionY, > default 20
        sx: 100,                    // stroke positionX, > default 40
        sy: 200                     // stroke positionY, > default 40
      })
    },
    fromDataURL (url) {
      var that = this
      that.$refs.signature.fromDataURL('data:image/png;base64,iVBORw0K...')
    }
  }
}
</script>
<style lang="less" scoped>
.signature-container {
  background-color: #fff;
  .canvas{
    position: absolute;
    width: 100%;
    z-index: 100;
  }
  .placeholder {
    width: 100vw;
    height: 100vh;
    font-size: 1.2rem;
    color: #d0d0d0;
    display: flex;
    justify-content: center;
    align-items: center;
    background: url('../../assets/activity-list-bg.png') 100px 100px center center;
  }
  .placeholder-content {
    transform: rotate(90deg)
  }
  .title {
    position: absolute;
    top: 2rem;
    right: -1rem;
    font-size: .48rem;
    color: #333;
    transform: rotate(90deg)
  }
  .btn-group {
    position: absolute;
    left: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    z-index: 200;
    button{
      width: 20vw;
      height: .96rem;
      width: 2rem;
      margin-bottom: 1.5rem;
      transform: rotate(90deg);
      border-radius: .5rem;
    }
    .clear {
      background-color: #fff;
      color: #369fff;
      border: 1px solid #369fff;
    }
    .save {
      background-color: #369fff;
      color: #fff;
    }
  }
}
</style>
