<template>
    <div>
    <divider>default</divider>
    <box gap="10px 10px">
      <x-button type="warn" @click.native="testApp">调用</x-button>
    </box>
  </div>
</template>

<script>
  import { XButton, Box } from 'vux'

  export default {
    components: {
      XButton,
      Box
    },
    mounted () {
    },
    methods: {
      change (value) {
        console.log('change:', value)
      },
      testApp () {
        window.zdb.tApp('李阳')
        window.tApp = function (obj) {
          alert(obj.greet)
        }
      }
    },
    data () {
      return {
        submit001: 'click me',
        disable001: false
      }
    }
}
</script>

<style lang="less">
.custom-primary-red {
  border-radius: 99px!important;
  border-color: #CE3C39!important;
  color: #CE3C39!important;
  &:active {
    border-color: rgba(206, 60, 57, 0.6)!important;
    color: rgba(206, 60, 57, 0.6)!important;
    background-color: transparent;
  }
}
</style>
