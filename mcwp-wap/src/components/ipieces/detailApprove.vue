<template>
  <div class="detail-approve">
    <tabbar v-if="approveStatus==='approve' || approveStatus==='check'">
       <tabbar-item class="pass">
          <span slot="label" @click="auditCheck">{{approveStatus==='check' ? '审查通过': '审批通过'}}</span>
        </tabbar-item>
        <tabbar-item class="reject">
          <span slot="label" @click="refuseDir">{{approveStatus==='check' ? '审查拒绝' : '审批拒绝'}}</span>
        </tabbar-item>
        <tabbar-item class="reback" v-if="type !== '1' && !ipiecesShow.detailApproveReBackApprove.includes(+type) && (approveStatus==='approve')">
          <span slot="label" @click="showBack=true">打回</span>
        </tabbar-item>
        <tabbar-item class="reback" v-if="type !== '1' && !ipiecesShow.detailApproveReBackCheck.includes(+type) &&(approveStatus==='check' && (surveyStatus === 4 || auditStatus === '综合授信审核通过'))">
          <span slot="label" @click="showBack=true">打回</span>
        </tabbar-item>
      </tabbar>
      <tabbar v-if="approveStatus==='intervene'">
       <tabbar-item class="pass">
          <span slot="label" @click="showIntervene=true">人工干预</span>
        </tabbar-item>
      </tabbar>
      <tabbar v-if="approveStatus==='cancelLoan'">
       <tabbar-item class="cancelLoan">
          <span slot="label" @click="refuseDir">撤销贷款</span>
        </tabbar-item>
      </tabbar>
      <div v-if="approveStatus==='approve' || approveStatus==='check'">
        <div class="pass-wrapper" v-transfer-dom>
          <confirm v-model="showPass"
            ref="confirm5"
            :title="`${approveStatus==='check' ? '审查通过' : '审批通过'}`"
            :close-on-confirm="false"
            @on-cancel="onCancel"
            @on-confirm="onConfirm">
            <p v-if="approveStatus == 'approve' && ipiecesShow.detailApproveApproveTip.includes(+type)" class="ipieces-cust-type">确定已经查验过客户的征信报告吗？</p>
            <div v-if="authMoney && modifyStatus && !ipiecesShow.detailApproveApproveModify.includes(+type)" class="pass-already">
              <p>客户{{baseInfo.loanCustomer && baseInfo.loanCustomer.cname}}在我行已授信<span @click="modifyStatus = false" class="modify-wrapper"><img class="modify-png" src="../../assets/icon_modify.png" alt='modify' />修改</span></p>
              <p>授信金额:{{authMoney}}元，借款日利率:{{dailyRate ? `${dailyRate}%`: '无'}}，最长还款期数:{{repaymentPeriodName  ? `${repaymentPeriodName}期`: '无'}}</p>
            </div>
            <div v-else>
              <div class='pass-item'>
                <label for="authMoney">授信金额</label>
                <div class="input-wrapper">
                  <input v-model="modifyAuthMoney" autocomplete="off" class="pass-input" type="text" placeholder="请输入" id="authMoney" @click="modifyStatus = false" />
                </div>
                <span class="measure">元</span>
              </div>
              <div class='pass-item' v-if="(approveStatus == 'approve' || approveStatus == 'check') && ipiecesShow.detailApproveApproveDailyRate.includes(+type) && dailyRate">
                <label for="dailyRate">借款日利率</label>
                <div class="input-wrapper">
                  <span class="pass-span">{{modifyDailyRate}}</span>
                </div>
                <span class="measure">%</span>
              </div>
              <div class='pass-item' v-else>
                <label for="dailyRate">借款日利率</label>
                <div class="input-wrapper">
                  <input v-model="modifyDailyRate" autocomplete="off" class="pass-input" type="text" placeholder="请输入" id="dailyRate" />
                </div>
                <span class="measure">%</span>
              </div>
              <!-- 审批存在最长还款期数和还款期数，审查中不存在 -->
              <div v-if="approveStatus==='approve'">
                <div class='pass-item' v-if="creditOn">
                  <label for="repaymentPeriod">最长还款期数</label>
                  <div class="input-wrapper">
                    <select v-model="modifyRepaymentPeriod" placeholder="请选择" class="pass-select" id="repaymentPeriod">
                      <option value="" disabled selected>请选择</option>
                      <option v-for="(item, index) in hkqs" :key="index" :value ="item.ddValue">{{item.ddText}}</option>
                    </select>
                    <!--<selector class="pass-input" placeholder="请选择" :options="list"></selector>-->
                  </div>
                  <span class="measure">期</span>
                </div>
                <div v-else>
                  <!-- 还款期数、还款方式均被需求混乱 -->
                  <!-- 房抵贷有值可以修改 -->
                  <!-- 其他贷有值不可修改 -->
                  <!-- 后端未做限制 -->
                  <div class='pass-item'>
                    <label for="period">还款期数</label>
                    <div class="input-wrapper">
                      <select v-model="period" placeholder="请选择" disabled="disabled" class="pass-select disabled-select" id="period" v-if="hasPeriod">
                        <option value="" disabled selected>请选择</option>
                        <option v-for="(item, index) in hkqs" :key="index" :value ="item.ddValue">{{item.ddText}}</option>
                      </select>
                      <select v-model="period" placeholder="请选择" class="pass-select" id="period" v-else>
                        <option value="" disabled selected>请选择</option>
                        <option v-for="(item, index) in hkqs" :key="index" :value ="item.ddValue">{{item.ddText}}</option>
                      </select>
                      <!--<selector class="pass-input" placeholder="请选择" :options="list"></selector>-->
                    </div>
                    <span class="measure">期</span>
                  </div>
                  <div class='pass-item'>
                    <label for="king">还款方式</label>
                    <div class="input-wrapper">
                      <select v-model="kind" placeholder="请选择" disabled="disabled" class="pass-select disabled-select" id="kind" v-if="hasKind">
                        <option value="" disabled selected>请选择</option>
                        <option v-for="(item, index) in hkfs" :key="index" :value ="item.ddValue">{{item.ddText}}</option>
                      </select>
                      <select v-model="kind" placeholder="请选择" class="pass-select" id="kind" v-else>
                        <option value="" disabled selected>请选择</option>
                        <option v-for="(item, index) in hkfs" :key="index" :value ="item.ddValue">{{item.ddText}}</option>
                      </select>
                      <!--<selector class="pass-input" placeholder="请选择" :options="list"></selector>-->
                    </div>
                    <span class="measure">期</span>
                  </div>
                  <div class='pass-item'>
                    <label for="dailyRate">备注</label>
                    <div class="textarea-wrapper">
                      <textarea class="commit-reason" v-model="comment" autocomplete="off" type="text" placeholder="请输入"  />
                    </div>
                    <span class="measure"></span>
                  </div>
                </div>
              </div>
            </div>
          </confirm>
        </div>
        <div class="pass-wrapper" v-transfer-dom>
          <confirm v-model="showRisk"
            ref="confirm8"
            title="风险提示"
            :close-on-confirm="false"
            @on-cancel="showRisk = false"
            @on-confirm="showRisk = false, riskMsg= '', showPass = true, modifyStatus = true">
            <p>{{riskMsg}}</p>
          </confirm>
        </div>
        <div class="reback-wrapper" v-transfer-dom>
          <confirm v-model="showBack"
            ref="confirm6"
            title="打回原因"
            :close-on-confirm="false"
            @on-cancel="onCancel"
            @on-confirm="onConfirmBack">
            <div class="reback-already">
              <textarea class="reback-reason" v-model="rebackReason" autocomplete="off" type="text" placeholder="请输入打回原因" id="dailyRate" />
              <p class="reback-explain" v-if='!ipiecesShow.detailApproveReBackTip.includes(+type)'>提示：打回贷款后，将重新进入现场调查流程</p>
              <p class="reback-repulseTimes" v-if="basic && basic.repulseTimes">该笔贷款已被打回{{basic.repulseTimes}}次</p>
            </div>
          </confirm>
        </div>
      <popup v-model="showRefuse" position="bottom" height="100%">
        <div class="bank-container">
          <refuse />
        </div>
      </popup>
    </div>
    <div class="reback-wrapper" v-else v-transfer-dom>
          <confirm v-model="showIntervene"
            ref="confirm6"
            title="干预原因"
            :close-on-confirm="false"
            @on-cancel="onCancel"
            @on-confirm="onConfirmIntervene">
            <div class="reback-already">
              <textarea class="reback-reason" v-model="interveneReason" autocomplete="off" type="text" placeholder="请输入干预原因" id="dailyRate" />
            </div>
          </confirm>
        </div>
  </div>
</template>

<script>
import { Tabbar, TabbarItem, TransferDom, Confirm, Selector, Group, Toast, Popup } from 'vux'
import Refuse from './refuse'
import Config from '../../config/index'
import {getAuditCheck} from './../../service/ipieces'

export default {
  directives: {
    TransferDom
  },
  components: {
    Tabbar,
    TabbarItem,
    Confirm,
    Selector,
    Group,
    Toast,
    Popup,
    Refuse
  },
  props: ['dictInfo', 'token', 'credit', 'baseInfo', 'code', 'type', 'basic', 'approveStatus', 'surveyStatus', 'auditStatus'],
  data () {
    return {
      showPass: false,
      hkqs: this.dictInfo.hkqs,
      hkfs: this.dictInfo.hkfs,
      authMoney: this.credit && this.credit.creditAmount,
      dailyRate: this.credit && this.credit.dailyRate,
      repaymentPeriod: this.credit && this.credit.repaymentPeriod,
      repaymentPeriodName: this.credit && this.credit.repaymentPeriodName,
      modifyAuthMoney: this.credit && this.credit.creditAmount,  // 修改的授信金额
      modifyDailyRate: this.credit && this.credit.dailyRate,
      modifyRepaymentPeriod: this.credit && this.credit.repaymentPeriod,
      creditOn: this.credit && this.credit.creditOn,
      showRefuse: false,
      showBack: false,
      showIntervene: false,
      showRisk: false,
      modifyStatus: true,
      rebackReason: '',
      comment: '',
      interveneReason: '',
      period: this.credit && this.credit.period,
      hasPeriod: this.credit && this.credit.period && !Config.ipiecesShow.detailApproveApprovePeriod.includes(+this.type),   // 等后端限制了可以换成其他字段
      kind: this.credit && this.credit.kind,
      hasKind: this.credit && this.credit.kind && !Config.ipiecesShow.detailApproveApproveKind.includes(+this.type),
      ipiecesShow: Config.ipiecesShow,
      riskMsg: ''
    }
  },
  methods: {
    onCancel () {
      this.modifyAuthMoney = this.authMoney
      this.modifyDailyRate = this.dailyRate
      this.modifyRepaymentPeriod = this.repaymentPeriod
    },
    async auditCheck () {
      if (this.approveStatus === 'approve') {
        let res = await getAuditCheck({code: this.code}, this.token)
        if (res.data) {
          this.showRisk = true
          this.riskMsg = res.data
        } else {
          this.showPass = true
          this.modifyStatus = true
        }
      } else {
        this.showPass = true
        this.modifyStatus = true
      }
    },
    onConfirm () {
      if (!this.modifyAuthMoney) return this.$vux.toast.text('授信金额不能为空', 'top')
      if (!this.modifyDailyRate) return this.$vux.toast.text('借款日利率不能为空', 'top')
      // 审批
      if (this.approveStatus === 'approve') {
        if (this.creditOn) {
          if (!this.modifyRepaymentPeriod) return this.$vux.toast.text('最长还款期数不能为空', 'top')
        } else {
          if (!this.period) return this.$vux.toast.text('还款期数不能为空', 'top')
          if (!this.kind) return this.$vux.toast.text('还款方式不能为空', 'top')
        }
      }
      let reg = /^[0-9]{1}\d*(\.\d{1,2})?$/
      let rateReg = /^0\.\d{1,4}$/
      if (!rateReg.test(this.modifyDailyRate)) {
        return this.$vux.toast.text('借款日利率小于1，且小数点后最多四位', 'top')
      }
      if (!reg.test(this.modifyAuthMoney)) {
        return this.$vux.toast.text('授信金额最多小数点后面两位', 'top')
      }
      if (this.comment.length > 256) return this.$vux.toast.text('备注不能超过256个字', 'top')
      if (this.creditOn) {
        this.$emit('pass', this.modifyAuthMoney, this.modifyDailyRate, this.modifyRepaymentPeriod, this.comment)
      } else {
        this.$emit('pass', this.modifyAuthMoney, this.modifyDailyRate, '', this.period, this.kind, this.comment)
      }
      // 不用关闭，直接退出进件
      // this.showPass = false
    },
    onConfirmBack () {
      if (!this.rebackReason) return this.$vux.toast.text('打回原因不能为空', 'top')
      if (this.rebackReason.length > 120) return this.$vux.toast.text('打回原因不能超过120个字', 'top')
      this.$emit('reback', this.rebackReason)
    },
    onConfirmIntervene () {
      if (!this.interveneReason) return this.$vux.toast.text('干预原因不能为空', 'top')
      if (this.interveneReason.length > 256) return this.$vux.toast.text('干预原因不能超过256个字', 'top')
      this.$emit('intervene', this.interveneReason)
    },
    refuseDir () {
      this.$router.push(`${Config.constants.refuseRouter}?token=${this.token}&code=${this.code}&approveStatus=${this.approveStatus}`)
    }
  },
  mounted () {
    console.log(this.dictInfo, this.credit, 'this.dictInfodictInfo')
  }
}
</script>

<style lang="less">
.detail-approve {
  .weui-tabbar {
    height: 2rem;
  }
  .weui-tabbar__item.vux-tabbar-simple {
    font-size: .36rem;
    // width: 4.16rem;
    height: 1.2rem;
    line-height: 1.2rem;
  }
  .vux-tabbar-simple .weui-tabbar__label {
    height: 1.2rem;
    line-height: 1.2rem;
    font-size: .36rem;
    color: #fff;
  }
  .weui-tabbar__item.weui-bar__item_on .weui-tabbar__label {
    color: #fff;
  }
  .reject {
    // margin: .4rem .2rem 0 1.04rem;
    margin: .4rem;
    border-radius: .6rem;
    background-color: #d23737;
  }
  .pass {
    // margin: .4rem 1.04rem 0 .2rem;
    margin: .4rem;
    border-radius: .6rem;
    background-color: #43b94f;
  }
  .reback {
    // margin: .4rem 1.04rem 0 .2rem;
    margin: .4rem;
    border-radius: .6rem;
    background-color: #1c7bef;
  }
  .cancelLoan {
    margin: .4rem;
    border-radius: .6rem;
    background-color: #369fff;
  }
  .bank-container {
    padding: .3rem 0;
    max-height: 100%;
  }
}
.pass-wrapper {
  .pass-item {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  .weui-dialog__title {
    font-weight: 400;
    font-size: 14px;
  }
  .weui-dialog__btn {
    font-size: 16px;
  }
  .pass-item, .pass-title {
    font-size: .4rem;
  }
  .input-wrapper {
    width: 3.62rem;
    height: 1.04rem;
    margin: .28rem .16rem;
  }
  .pass-span {
    line-height: 1.04rem;
  }
  .textarea-wrapper {
    width: 3.62rem;
    height: 2rem;
    margin: .28rem .16rem;
  }
  .pass-input, .pass-select {
    border: 1px solid #ccc;
    border-radius: .16rem;
    height: 100%;
    width: 100%;
    font-size: .4rem;
    text-indent: .24rem;
    color: #333;
  }
  .measure {
    flex: 0 0 .6rem;
  }
  .pass-already {
    text-align: left;
    line-height: .8rem;
    font-size: .4rem;
  }
  .modify-wrapper {
    font-weight: bold;
    color: #108ee9;
  }
  .modify-png {
    vertical-align: middle;
    margin-left: .4rem;
  }
  .disabled-select {
    background-color: #eee;
  }
  .commit-reason {
    width: 100%;
    resize: none;
    border-radius: .16rem;
    height: 100%;
    width: 100%;
    font-size: .4rem;
    text-indent: .24rem;
    color: #333;
  }
}
.reback-wrapper {
  .weui-dialog__title {
    font-weight: 400;
    font-size: 14px;
  }
  .weui-dialog__btn {
    font-size: 16px;
  }
  .reback-reason {
    resize: none;
    margin-top: .5rem;
    height: 4rem;
    width: 100%;
    border-radius: 5px;
  }
  .reback-explain {
    color: #ff4f02;
    font-size: 12px;
    text-align: left;
  }
  .reback-repulseTimes {
    color: #ff4f02;
    font-size: 12px;
    text-align: left;
    padding: .2rem 0 0 1.05rem;
  }
}
.ipieces-cust-type {
    background: url(../../assets/icon_prompt.png) no-repeat 0 0;
    background-size: 20px 20px;
    margin-left: 0;
    font-size: 12px;
    padding-bottom: 10px;
    height: 20px;
    line-height: 20px;
  }
</style>
