<template>
  <div class="borrow-addBankcard">
    <div class="addBankcard-content">
      <div class="content-top">
        <p class="content-tip font-36">请选择本人银行卡！</p>
        <!--<p class="content-name">高轴承</p>-->
      </div>
      <div class="content-bottom content-choose">
        <div v-if="true">
          <p class="content-tip font-32" style="padding-bottom: 0;">选择银行</p>
          <!--<p class="content-name">建设银行</p>-->
          <popup-picker class="font-32" placeholder='请选择银行'  value-text-align='left' :data="bankList" :columns="1" v-model="bankPicker" show-name></popup-picker>
        </div>
        <!--<div v-if="false" class="select-bank">
          <popup-picker placeholder='请选择银行' title="选择银行" value-text-align='left' :data="listData" :columns="1" v-model="bankPicker" show-name></popup-picker>
        </div>-->
      </div>
    </div>
    <div class="addBankcard-content">
      <div class="content-top"  style="padding-bottom: .3rem;">
        <p class="content-tip font-32">银行卡号</p>
        <input class='apply-detail-input font-32' v-model="bankNo" type="text" placeholder='请输入银行卡号' @input="calcValue" />
      </div>
      <div class="content-bottom">
        <p class="content-tip font-32">手机号</p>
        <input class='apply-detail-input font-32' v-model="telephone" type="text" placeholder='银行预留手机号' @input="calcTelephone" />
      </div>
    </div>
    <v-button style="width: 9rem; margin-top: 1.1rem" @click.native="back">确定</v-button>
  </div>
</template>

<script>
import { PopupPicker } from 'vux'
import VButton from './../../components/button'
import { bankList, addBankcard } from '../../service/getData'
import Config from '../../config/index'

export default {
  components: {
    VButton,
    PopupPicker
  },
  data () {
    return {
      bankList: [],
      bankPicker: [],
      bankNo: '',
      telephone: ''
    }
  },
  methods: {
    async getBank () {
      let res = await bankList()
      if (res.code - 0 === 0) {
        this.bankList = Array.from(res.data.xzyh, item => { item.name = item.ddText; item.value = item.ddText; return item })
      } else {
        alert(res.msg)
      }
    },
    async back () {
      let that = this
      if (!that.bankPicker[0]) return that.$vux.toast.text('请选择银行')
      if (!that.bankNo) return that.$vux.toast.text('请输入银行卡号')
      if (!that.telephone) return that.$vux.toast.text('请输入手机号')
      let params = {
        bankName: that.bankPicker[0],
        bankNo: that.bankNo,
        telephone: that.telephone
      }
      let res = await addBankcard(params)
      if (res.code - 0 === 0) {
        console.log(res)
        this.$router.push(Config.constants.purposeRouter)
      } else {
        alert(res.msg)
      }
    },
    calcValue () {
      let that = this
      // let first = that.bankNo.toString().slice(0, 15)
      // let second = that.bankNo.toString().slice(15)
      // if (isNaN(parseInt(that.bankNo, 10))) {
      //   that.bankNo = ''
      // } else {
      //   first = isNaN(parseInt(first)) ? '' : parseInt(first)
      //   second = isNaN(parseInt(second)) ? '' : parseInt(second)
      //   that.bankNo = `${first}${second}`
      //   that.bankNo = that.bankNo.slice(0, 19)
      // }
      let value = that.bankNo.toString()
      let arr = value.split('')
      arr = arr.filter((item, index) => (/\d/g.test(item)))
      that.bankNo = arr.join('').slice(0, 19)
    },
    calcTelephone () {
      let that = this
      if (isNaN(parseInt(that.telephone))) {
        that.telephone = ''
      } else {
        that.telephone = parseInt(that.telephone)
        that.telephone = that.telephone.toString().slice(0, 11)
      }
    }
  },
  created () {
    this.getBank()
  }
}
</script>

<style lang="less">
.borrow-addBankcard{
  width: 10.2rem;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: .3rem auto;
  .addBankcard-content + .addBankcard-content{
    margin-top: .3rem;
  }
  .addBankcard-content{
    width:9.6rem;
    background: #fff;
    padding-left: .6rem;
    font-size: .44rem;
    border-radius: .3rem;
    .content-top{
      position:relative;
      .apply-detail-input {
        margin-bottom:.4rem;
      }
    }
    .content-top:after{
      content: " ";
      position: absolute;
      left: 0;
      bottom: 0;
      right: 0;
      height: 1px;
      border-bottom: 1px solid #e5e5e5;
      color: #e5e5e5;
      -webkit-transform-origin: 0 100%;
      transform-origin: 0 100%;
      -webkit-transform: scaleY(0.5);
      transform: scaleY(0.5);
      width:9.6rem;
    }
    .content-tip{
      color: #535353;
      padding: .4rem 0 .4rem;
      text-align: left;
    }
    // .content-name{
    //   color: #010101;
    //   margin-top: .5rem;
    // }
    .content-bottom {
      padding-bottom: .525rem;
      .vux-cell-box{
        width: 9.3rem;
      }
    }
    .content-choose {
      padding-bottom: .2rem;
    }
    .vux-cell-box{
      margin-top: 0!important;
    }
    .apply-detail-input {
      flex: 1;
      border: none;
      outline: none;
      color: #333;
      width: 100%;
    }
  }
  .addBankcard-content::after {
    content: '';
    display: table;
  }
  .userinfo-detail-content {
    position: relative;
    width: 100%;
    display: flex;
  }
  .weui-cell {
    padding-left: 0;
    padding-bottom: 0;
    // display: flex;
    // padding: 0;
    height: 1.26rem;
    line-height: 1.26rem;
    // font-size: .4rem;
  }
  .weui-cell__hd {
    width: 2.3rem;
    text-align: left;
    font-weight: bold;
  }
  .vux-cell-box {
    width: 100%;
  }
  .vux-popup-picker-select {
    // padding-left: .48rem;
  }
  .vux-cell-box:before {
    border-top: none;
  }
  // .weui-cell_access .weui-cell__ft:after {
    // display: none;
  // }
  .weui-cell__hd {
    display: none;
  }
  .vux-popup-picker-placeholder {
    color: #777;
  }
}
</style>
