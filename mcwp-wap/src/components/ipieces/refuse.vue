<template>
  <div class="ipieces-refuse">
    <checker v-model="checkReason" @on-change="selectReason" default-item-class="ipieces-item" selected-item-class="ipieces-item-selected">
      <checker-item :value="item.ddValue" v-for="(item, index) in checkReasonList" :key="index"><p class="content-p">{{item.ddText}}</p></checker-item>
    </checker>
    <input v-if="chooseOther" class='ipieces-input' type="text" placeholder='请输入' v-model='inputValue'  />
    <div class="refuse-confirm" @click="refuse">确定</div>
  </div>
</template>

<script>
import { Checker, CheckerItem } from 'vux'
import Config from '../../config/index'
import { getDictValueAll } from '../../service/getData'
export default {
  components: {
    Checker,
    CheckerItem
  },
  data () {
    return {
      checkReason: '',
      chooseOther: false,
      checkReasonList: [],
      inputValue: ''
    }
  },
  mounted () {
    const that = this
    getDictValueAll({code: 'spjjyy'}).then(res => {
      that.$vux.loading.hide()
      if (res.code === Config.resCode.success) {
        const data = res.data
        if (data) {
          that.checkReasonList = data.spjjyy
        }
      } else {
        that.$vux.toast.text(res.msg)
      }
    })
  },
  methods: {
    selectReason (val) {
      if (val === '15') {
        this.chooseOther = true
      } else {
        this.chooseOther = false
      }
    },
    refuse () {
      console.log(this.inputValue)
      // window.zdb.tExit()
    }
  },
  created () {
  }
}
</script>

<style lang="less" scoped>
  .ipieces-refuse{
    width:8.7rem;
    max-height: 100%;
    background: #fff;
    margin: 0 auto;
    font-size: .44rem;
    padding: .6rem;
    position: relative;
    .vux-checker-box{
      width: .34rem;
      // float: left;
      height: 100%;
    }
    .vux-checker-item {
      margin: .8rem 0 0;
    }
    .vux-checker-item + .vux-checker-item{
      margin-top: .5rem;
    }
    .ipieces-content{
      width: 8.63rem;
      color: #000;
      font-size:.36rem;
      margin-left: .6rem;
    }
    .content-p {
      width: 8rem;
      text-indent: .8rem;
      line-height: .5rem;
    }
    // .content-p+.content-p{
    //   margin-top: .5rem;
    //   height: .5rem;
    // }
    .ipieces-item{
      width: .36rem;
      height: .36rem;
      background: url(../../assets/ipieces-refuse-select.png) no-repeat;
      background-size: cover;background: url(../../assets/ipieces-refuse-default.png) no-repeat;
      background-size: cover;
    }
    .ipieces-item-selected{
      background: url(../../assets/ipieces-refuse-select.png) no-repeat;
      background-size: cover;
    }
    .ipieces-input{
      width: 7.96rem;
      height: 1.04rem;
      border: 1px solid #ccc;
      margin-top: .5rem;
      padding-left: .6rem;
    }
    .refuse-confirm {
      width: 5rem;
      height: 1.2rem;
      color: #fff;
      background-color: #369fff;
      border-radius: .6rem;
      line-height: 1.2rem;
      text-align: center;
      margin: 1rem auto 0;
    }
  }
</style>
