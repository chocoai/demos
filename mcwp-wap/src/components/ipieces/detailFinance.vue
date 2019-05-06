<template>
  <div ref="component" class="detail-finance">
      <tab ref="tab" active-color="#333" defaultColor="#787878" bar-active-color="#369fff" :line-width="3" v-model="index">
        <tab-item :selected="select === item" v-for="(item, index) in list" @on-item-click="onItemClick" @click="select = item" :key="index">{{item.name}}</tab-item>
      </tab>
      <!--<keep-alive>-->
      <component :is="list[index].component" :loanData="loanData[index]" />
      <!--</keep-alive>-->
  </div>
</template>

<script>
import { Tab, TabItem } from 'vux'
import FinanceBalance from './children/financeBalance'
import FinanceIncome from './children/financeIncome'
import FinanceCash from './children/financeCash'
import FarmBalance from './children/farmBalance'
import FarmIncome from './children/farmIncome'
import FarmCash from './children/farmCash'
// const list = () => [{name: '资产负债表', component: 'FinanceBalance'}, {name: '损益表', component: 'FinanceIncome'}, {name: '现金流量表', component: 'FinanceCash'}]

export default {
  props: ['loanData', 'children'],
  components: {
    Tab,
    TabItem,
    FinanceBalance,
    FinanceIncome,
    FinanceCash,
    FarmBalance,
    FarmIncome,
    FarmCash
  },
  data () {
    return {
      list: this.children,
      select: '',
      index: 0
    }
  },
  mounted () {
    console.log(this.children)
  },
  methods: {
    onItemClick () {
      // 重新计算高度
      this.$emit('heightChange')
    }
  }
}
</script>

<style lang="less" scoped>
.vux-tab {
  height: 1.42rem;
}
.detail-finance {
  margin-top: .26rem;
}
.vux-tab-item {
  font-size: .4rem;
  line-height: 1.42rem;
}
</style>
