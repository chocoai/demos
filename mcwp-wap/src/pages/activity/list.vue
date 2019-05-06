<template>
  <div class="activity-container" v-if='list'>
    <div v-if="list && list.length">
      <div class="activity-list" v-for="(item, index) in list" :key="index" @click='activityInfo(item.code)'>
        <flexbox :gutter="0">
          <flexbox-item :span="372/1012"><div class="activity-list-left"><img class="activity-cover" src='./../../assets/activity-list-bg.png' /></div></flexbox-item>
          <flexbox-item>
            <div class="activity-list-right">
              <flexbox orient="vertical">
                <flexbox-item style="flex-direction: column"><div class="activity-list-title">{{item.activeName}}</div></flexbox-item>
                <flexbox-item style="flex-direction: column"><div class="activity-list-time">{{`${formatTime(+item.activeTime.split(',')[0])} 到 ${formatTime(+item.activeTime.split(',')[1])}`}}</div></flexbox-item>
              </flexbox>
            </div>
          </flexbox-item>
        </flexbox>
      </div>
    </div>
    <v-blank v-else>还没有活动</v-blank>
  </div>
</template>

<script>
import {getActivityList} from '../../service/getData'
import Config from '../../config/index'
import { Flexbox, FlexboxItem } from 'vux'
import Utils from '../../config/utils'
import VBlank from './../../components/blank'

export default {
  components: {
    Flexbox,
    FlexboxItem,
    VBlank
  },
  data () {
    return {
      list: null
    }
  },
  created () {
    this.getList()
  },
  methods: {
    async getList () {
      const that = this
      const listRes = await getActivityList({})
      if (listRes.code === Config.resCode.success) {
        that.list = listRes.data
      } else {
        that.$vux.toast.text(listRes.msg)
      }
    },
    activityInfo (code) {
      this.$router.push(`${Config.constants.activityTurntable}?activityCode=${code}`)
    },
    formatTime (time) {
      return Utils.formatTime(time)
    }
  }
}
</script>

<style lang="less" scoped>
.activity-container {
  .activity-list{
    width: 10.12rem;
    height: 3.36rem;
    background: #fff;
    border-radius: .3rem;
    margin: .3rem;
    position: relative;
  }
  .vux-flexbox {
    height: 100%;
  }
  .activity-cover {
    width: 2.56rem;
    height: 2.56rem;
    margin: 0.4rem 0.58rem;
  }
  .activity-list-right{
    height: 2rem;
    position: relative;
  }
  .activity-list-title {
    font-size: 0.44rem;
    color: #010101;
    margin-bottom: 0.28rem;
    word-wrap: break-word;
    width: 85%;
  }
  .activity-list-time{
    font-size: 0.4rem;
    color: #3a3a3a;
    margin-bottom: 0.05rem;
  }
}
</style>

