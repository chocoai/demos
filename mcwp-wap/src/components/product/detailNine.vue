<template>
  <div class="product-desc tpl-nine">
    <div class="product-btn" @click="goApply"></div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
      }
    },
    components: {
    },
    props: ['proInfoData'],
    computed: {
    },
    mounted () {
    },
    methods: {
      goApply () {
        this.$emit('goApply')
      }
    }
  }
</script>
<style lang="less">
.product-desc {
  width: 10.8rem;
  background-color: #fff;
  margin: 0 auto;
  -moz-user-select: none;
  -khtml-user-select: none;
  user-select: none;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  overflow: hidden;
  &.tpl-nine {
    height: 20.84rem;
    background: url("./../../assets/detail_bg_nine.png") no-repeat;
    background-size: cover;
  }
  .product-btn {
    background: url(./../../assets/product_btn_nine.png) no-repeat;
    background-size: cover;
    width: 5.4rem;
    height: 1.36rem;
    // border-radius: 1.36rem;
    position: absolute;
    top: 12.24rem;
    left: 50%;
    margin-left: -2.7rem;
  }
}
</style>
