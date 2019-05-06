<template>
  <div class="next" @click='next'>
    <slot></slot>
  </div>
</template>

<script>
export default {
  methods: {
    next() {
      this.$emit("next");
    }
  }
};
</script>

<style scoped>
.next {
  display: block;
  width: 6rem;
  height: 1.44rem;
  line-height: 1.44rem;
  text-align: center;
  background-color: #369fff;
  border-radius: 0.72rem;
  color: #fff;
  font-size: 0.5rem;
  margin: 1.6rem auto 0 auto;
}
</style>
