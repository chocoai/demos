<template>
  <span v-bind:class="{ active: placement, popover: !placement, authorize: type == 'authorize'}">
    <slot></slot>
  </span>
</template>

<script>
// 要个父级元素添加position:relative
export default {
  props: ['placement', 'type'],
  created () {
    console.log(this.placement)
  },
  methods: {
  }
}
</script>

<style scoped>
.popover {
  position:absolute;
  left: 50%;
  top: -.1rem;
  padding: .2rem;
  background-color: #484848;
  font-size: .3rem;
  line-height: .5rem;
  width: 2.6rem;
  word-break: break-all;
  transform: translate(-50%, -100%);
  border-radius: .2rem;
  opacity: .8;
  color: #fff;
  z-index: 100;
}
.popover.authorize {
  width: 3.6rem;
  left: 2.2rem;
  top: .2rem;
  text-align: center;
  line-height: .6rem;
  background-color: rgba(0, 0, 0, .9);
}
.popover.authorize::after {
  left: 0;
  left: -3rem;
  border-left: .22rem solid transparent;
  border-right: .22rem solid transparent;
  border-top: .22rem solid rgba(0, 0, 0, .9);
}
.popover::after {
  content: '';
  position: absolute;
  margin: auto;
  left: 0;
  right: 0;
  bottom: -.2rem;
  width: 0;
  height: 0;
  border-left: .3rem solid transparent;
  border-right: .3rem solid transparent;
  border-top: .3rem solid #484848;
}
.active {
  position:absolute;
  left: 50%;
  top: -.1rem;
  padding: .2rem;
  background-color: #484848;
  font-size: .3rem;
  line-height: .5rem;
  width: 2.6rem;
  word-break: break-all;
  transform: translate(-50%, 25%);
  border-radius: .2rem;
  opacity: .8;
  color: #fff;
  z-index: 100;
}
.active::after {
  content: '';
  position: absolute;
  margin: auto;
  left: 0;
  right: 0;
  top: -.2rem;
  width: 0;
  height: 0;
  border-left: .3rem solid transparent;
  border-right: .3rem solid transparent;
  border-bottom: .3rem solid #484848;
}
</style>
