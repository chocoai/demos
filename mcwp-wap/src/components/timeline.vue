<template>
  <div>
    <div v-for="(i, index) in list" :key="index" class="timeline-item">
      <p class="timeline-date">{{i.repaymentDate}}<p>
      <p class="timeline-dot" />
      <p class="timeline-calc">
        <span class="timeline-total">{{i.monthTotal}}元</span>
        <span class="timeline-principal">本金{{i.principal}}+利息{{i.interest}}</span>
      </p>
      <p class="timeline-period">{{i.period}}期</p>
    </div>
  </div>
</template>

<script>
export default {
  props: ['list'],
  methods: {
  }
}
</script>

<style lang="less" scoped>
.timeline-item {
  display: flex;
  height: 2rem;
  align-items: baseline;
  font-size: .42rem;
  .timeline-date {
    font-size: .36rem;
    padding-left:.48rem;
    text-align: right;
    color: #535353;
    min-width: 2rem;
  }
  .timeline-dot {
    width: .2rem;
    height: .2rem;
    border-radius: 50%;
    background-color: #b5b5b5;
    margin-left: .28rem;
    position: relative;
  }
  .timeline-dot::before {
    content: '';
    width: .04rem;
    height: 1.46rem;
    background-color: #b5b5b5;
    // transform: scaleX(.5);
    border-radius: .02rem;
    position: absolute;
    margin: auto;
    left: 0;
    right: 0;
    top: .32rem;
  }
  .timeline-calc {
    margin-left: .56rem;
    display: flex;
    flex-direction: column;
    width: 4rem;
    .timeline-total {
      color: #535353;
    }
    .timeline-principal {
      font-size: .36rem;
      color: #9d9d9d;
    }
  }
  .timeline-period {
    width: 2rem;
    text-align: right;
    color: #a9a9a9;
  }
}
</style>
