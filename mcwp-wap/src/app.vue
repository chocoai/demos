<template>
  <div id="app" class="app-container">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
.app-container {
  position: relative;
  width: 10.8rem;
  margin: 0 auto;
  min-height: 100vh;
  /* background-color: #fff; */
}
</style>
