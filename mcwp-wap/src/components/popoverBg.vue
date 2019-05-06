<template>
  <div>
    <div class="popover">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
}
</script>

<style scoped>
.popover {
  position:fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, .8);
  z-index: 1000;
  overflow: hidden;
}
</style>
