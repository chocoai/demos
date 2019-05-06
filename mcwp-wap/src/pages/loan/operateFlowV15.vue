<template>
  <div class="loan-operate">
    <p class="more-tips">填写更多信息，有助于提高您的贷款通过率</p>
    <ul class="contact-ul">
      <li class='contact-detail-content'>
        <p class='contact-detail-item'>手机号查询密码</p>
        <input class='contact-detail-input' type="text" placeholder='请输入手机号查询密码' v-model="phonePassword" >
      </li>
      <li class='contact-detail-content'>
        <popup-picker placeholder='请选择' title="流水提供方式" value-text-align='left' :data="listData" :columns="1" v-model="operatePicker" show-name></popup-picker>
      </li>
      <li class='contact-detail-content'>
        <p class='contact-detail-item'>主营借记卡卡号</p>
        <input class='contact-detail-input' type="text" placeholder='请输入主营借记卡卡号' v-model="phonePassword" >
      </li>
      <li class='contact-detail-content'>
        <popup-picker placeholder='请选择' title="所属银行" value-text-align='left' :data="listData" :columns="1" v-model="operatePicker" show-name></popup-picker>
      </li>
      <li class='contact-detail-content'>
        <p class='contact-detail-item'>查询密码</p>
        <input class='contact-detail-input' type="text" placeholder='请输入查询密码' v-model="phonePassword" >
      </li>
    </ul>
    <v-button @next='nextStep'>下一步</v-button>
  </div>
</template>

<script>
  import VButton from './../../components/button'
  import { PopupPicker } from 'vux'
  export default {
    components: {
      VButton,
      PopupPicker
    },
    data () {
      return {
        listData: [],
        phonePassword: '',
        operatePicker: []
      }
    },
    methods: {
      nextStep () {
        console.log('next')
      }
    }
  }
</script>

<style lang="less">
  .loan-operate {
    position: relative;
    width: 10.8rem;
    background-color: #fafafa;
    margin: 0 auto;
    overflow: hidden;
    .more-tips{
      width: 10.8rem;
      height: 1.04rem;
      background: #f2f9ff;
      line-height: 1.04rem;
      font-size: .36rem;
      color: #218beb;
      padding-left: 1.36rem;
      position: relative;
    }
    .more-tips::before{
      content: "";
      position: absolute;
      width: .48rem;
      height: .48rem;
      background: url(../../assets/icon_prompt.png) no-repeat;
      background-size: cover;
      top: .22rem;
      left: .64rem;
    }
    .contact-ul {
      position: relative;
      width: 100%;
      height: auto;
      background-color: #fff;
      overflow-x: hidden;
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
      font-weight: bold;
      font-size: .4rem;
    }
    .contact-detail-input {
      flex: 1;
      border: none;
      outline: none;
      padding-left: .48rem;
      font-size: .42rem;
      color: #333;
      height: 1.46rem;
      line-height: 1.46rem;
      &.empty {
        color: #777;
      }
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
      font-weight: bold;
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
      color: #777;
    }
    .weui-label {
      color: #333;
    }
  }
</style>
