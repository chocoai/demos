<template>
  <div class="borrow-contanier">
    <pull-refresh v-model="isRefresh" @refresh="onRefresh" v-if="this.borrowList && this.borrowList.length > 0">
      <list class="borrow-ul" v-model="loading" :finished="finished" @load="onLoad" :offset="10" :immediate-check="false">
        <p class="p-hint">温馨提示：信息更新可能出现延迟，请以实际还款情况为准～</p>
        <li class="borrow-li" v-for="item in borrowList" :key="item.code" @click="toDetailPlan(item.code, item.loanStatusText)">
          <span class="borrow-status">{{item.loanStatusText}}</span>
          <span class="borrow-createtime">{{new Date(item.createDate).format("yyyy.MM.dd hh:mm:ss")}}</span>
          <img src="../../assets/icon_choice.png" class="borrow-arrow" alt="arrow" v-if="item.loanStatusText === '已放款' || item.loanStatusText === '已结清'"/>
          <span class="borrow-moneyAmount">{{thousandBitSeparator(item.borrowMoney)}}</span>
          <div class="borrow-line"></div>
        </li>
      </list>
      </pull-refresh>
    <div v-else class="borrow-nodata">暂无数据</div>
  </div>
</template>

<script>
import { thousandBitSeparator } from "../../utils";
import { getMyBorrowInfos } from "../../service/home.js";
import { PullRefresh, List } from "vant";
export default {
  name: "myborrow",
  data() {
    return {
      thousandBitSeparator,
      page: 1,
      rows: 20,
      borrowList: [],
      loanStatusText: null,
      createDate: null,
      borrowMoney: null,
      code: null, //借款信息code
      isRefresh: false,
      loading: false,
      finished: false
    };
  },
  components: {
    PullRefresh,
    List
  },
  created() {
    this.getBorrowInfoLists();
  },
  mounted() {},
  methods: {
    async getBorrowInfoLists() {
      // const that = this;
      let res = await getMyBorrowInfos({
        page: this.page,
        rows: this.rows
      });
      this.isRefresh = false;
      this.loading = false;
      let data = res.data;
      // data = this.createData().data;
      if (data.length < this.rows) {
        this.finished = true;
      }
      if (this.page === 1) {
        this.borrowList = data;
      } else {
        this.borrowList.push(...data);
        // this.borrowList.concat(data);
      }
    },
    toDetailPlan(code, loanText) {
      if (loanText === "已放款" || loanText === "已结清") {
        this.$router.push({
          path: "/my/borrowDetail",
          query: { merchantCode: code }
        });
      }
    },
    onRefresh() {
      this.page = 1;
      this.getBorrowInfoLists();
    },
    onLoad() {
      this.page = this.borrowList.length / 20 + 1;
      this.getBorrowInfoLists();
    },
    createData() {
      return {
        code: "0",
        message: "成功",
        data: [
          {
            loanStatusText: "1",
            createDate: 1540880147000,
            code: "1540880147000",
            borrowMoney: 200000
          },
          {
            loanStatusText: "2",
            createDate: 1540880147000,
            code: "1540880147001",
            borrowMoney: 200000
          },
          {
            loanStatusText: "3",
            createDate: 1540880147000,
            code: "1540880147002",
            borrowMoney: 200000
          },
          {
            loanStatusText: "4",
            createDate: 1540880147000,
            code: "1540880147004",
            borrowMoney: 200000
          },
          {
            loanStatusText: "5",
            createDate: 1540880147000,
            code: "1540880147005",
            borrowMoney: 200000
          },
          {
            loanStatusText: "6",
            createDate: 1540880147000,
            code: "1540880147006",
            borrowMoney: 200000
          },
          {
            loanStatusText: "7",
            createDate: 1540880147000,
            code: "1540880147007",
            borrowMoney: 200000
          },
          {
            loanStatusText: "8",
            createDate: 1540880147000,
            code: "1540880147008",
            borrowMoney: 200000
          },
          {
            loanStatusText: "9",
            createDate: 1540880147000,
            code: "1540880147009",
            borrowMoney: 200000
          },
          {
            loanStatusText: "10",
            createDate: 1540880147000,
            code: "15408801470010",
            borrowMoney: 200000
          },
          {
            loanStatusText: "11",
            createDate: 1540880147000,
            code: "1540880147011",
            borrowMoney: 200000
          },
          {
            loanStatusText: "12",
            createDate: 1540880147000,
            code: "1540880147012",
            borrowMoney: 200000
          },
          {
            loanStatusText: "13",
            createDate: 1540880147000,
            code: "1540880147013",
            borrowMoney: 200000
          },
          {
            loanStatusText: "14",
            createDate: 1540880147000,
            code: "1540880147014",
            borrowMoney: 200000
          },
          {
            loanStatusText: "15",
            createDate: 1540880147000,
            code: "1540880147015",
            borrowMoney: 200000
          },
          {
            loanStatusText: "16",
            createDate: 1540880147000,
            code: "1540880147016",
            borrowMoney: 200000
          },
          {
            loanStatusText: "17",
            createDate: 1540880147000,
            code: "1540880147017",
            borrowMoney: 200000
          },
          {
            loanStatusText: "18",
            createDate: 1540880147000,
            code: "1540880147018",
            borrowMoney: 200000
          },
          {
            loanStatusText: "19",
            createDate: 1540880147000,
            code: "1540880147019",
            borrowMoney: 200000
          },
          {
            loanStatusText: "20",
            createDate: 1540880147000,
            code: "1540880147020",
            borrowMoney: 200000
          }
        ]
      };
    }
  }
};
</script>

<style lang="less" scoped>
.borrow-contanier {
  width: 10.8rem;
  height: 100vh;
  margin: 0 auto;
  overflow: scroll;
  //解决iPhone滑动不流畅
  -webkit-overflow-scrolling: touch;
  .borrow-nodata {
    padding-top: 3.6rem;
    text-align: center;
    font-size: 0.64rem;
    font-weight: normal;
  }
  .borrow-ul {
    width: 100%;
    .p-hint {
      width: 100%;
      text-align: center;
      background-color: white;
      padding: 0.3rem 0;
      font-size: 0.373rem;
      font-weight: 500;
      margin-bottom: 0.32rem;
    }
    .borrow-li {
      background: #fff;
      padding: 0.48rem 0.32rem 0.48rem 0.48rem;
      height: 2rem;
      position: relative;
      &:last-child {
        .borrow-line {
          background-color: #fff;
        }
      }
      .borrow-status {
        position: relative;
        float: left;
        color: #333;
        text-align: left;
        font-size: 0.4rem;
      }
      .borrow-createtime {
        position: absolute;
        display: block;
        float: left;
        color: #888;
        font-size: 0.36rem;
        text-align: left;
        bottom: 0.48rem;
      }
      .borrow-moneyAmount {
        position: relative;
        float: right;
        top: 50%;
        transform: translateY(-50%);
        font-size: 0.48rem;
        color: #333;
        right: 0.2rem;
      }
      .borrow-arrow {
        position: relative;
        float: right;
        top: 50%;
        transform: translateY(-50%);
        width: 0.4rem;
        height: 0.4rem;
      }
      .borrow-line {
        position: absolute;
        width: 100%;
        background-color: #ddd;
        height: 1px;
        bottom: 0;
      }
      /*.borrow-moneyAmount:after{*/
      /*content: url(../../assets/icon_choice.png);*/
      /*width: 0.4rem;*/
      /*height: 0.4rem;*/
      /*padding-left: 0.2rem;*/
      /*}*/
    }
  }
}
</style>
