<template>
  <div v-html="contract">
  </div>
</template>

<script>
import Sto from 'store'
import { getBoContract, getFinContract } from '../../service/getData'

export default {
  data () {
    return {
      contract: null
    }
  },
  methods: {
    async getContract () {
      let params = Sto.get('MCWP_LOAN_SELECT')
      let con
      if (params.borrowCode) {
        con = getFinContract({borrowCode: params.borrowCode})
      } else {
        con = getBoContract(params)
      }
      let res = await con
      if (+res.code === 0) {
        this.contract = res.data
      } else {
        alert(res.msg)
      }
    }
  },
  created () {
    this.getContract()
  }
}
</script>

<style lang="less" scoped>
</style>
