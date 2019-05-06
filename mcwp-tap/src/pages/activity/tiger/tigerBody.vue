<template>
  <div class="tiger-body-content">
    <div class="scroller-container">
      <div class="scroller" :style="{transform: `translate(0,${left.top/100}rem)`}">
        <img class="img" alt="" :src="images[0]"/>
        <img class="img" alt="" :src="images[1]"/>
        <img class="img" alt="" :src="images[2]"/>
        <img class="img" alt="" :src="images[0]"/>
      </div>
      <div class="scroller center" :style="{transform:`translate(0,${center.top/100}rem)`}">
        <img class="img"  alt="" :src="images[0]"/>
        <img class="img" alt="" :src="images[1]"/>
        <img class="img" alt="" :src="images[2]"/>
        <img class="img" alt="" :src="images[0]"/>
      </div>
      <div class="scroller" :style="{transform:`translate(0,${right.top/100}rem)`}">
        <img class="img" alt="" :src="images[0]"/>
        <img class="img" alt="" :src="images[1]"/>
        <img class="img" alt="" :src="images[2]"/>
        <img class="img" alt="" :src="images[0]"/>
      </div>
    </div>
    <span v-if="showCount" class="person-count">已有{{personCount}}人参与</span>
    <span class="chance">你还有{{chance}}次机会哟～</span>
    <img class="test-lucky btn" id="test-click" src="../../../assets/activity/tiger/btn-test-lucky.png" alt="" @click="scroll">
  </div>
</template>

<script>
import { wxPrize } from "../../../service/activity/tiger/tiger";
const len = 624;
export default {
  name: "tiger-content",
  props: {
    chance: [Number, String],
    personCount: [Number, String],
    images: Array,
    activityCode: String,
    showCount: [Boolean, String, Number]
  },
  data() {
    return {
      isScrollIng: false,
      defaultSpeed: 10,
      shouldShowResult: 0,
      prize: null,
      left: {
        top: 0,
        num: 0,
        total: 0
      },
      center: {
        top: 0,
        num: 0,
        total: 0
      },
      right: {
        top: 0,
        num: 0,
        total: 0
      }
    };
  },
  methods: {
    scroll() {
      // if (this.chance <= 0) {
      //   this.$toast("没有机会了");
      //   return;
      // }
      if (this.isScrollIng) {
        return;
      }
      this.$emit("scroll");
      this.scrollLeft();
      setTimeout(() => {
        this.scrollCenter();
      }, 300);
      setTimeout(() => {
        this.scrollRight();
      }, 600);
      this.getPrize();
      // this.frame();
    },
    scrollLeft() {
      let callback = () => {
        if (this.left.total && this.left.num <= this.left.total) {
          // this.left.top += 3;
          this.left.num = this.left.top;
          this.left.total = 0;
          this.showResult();
          return;
        }
        // this.left.num -= this.computtationSpeed(this.left.num, this.left.total);
        this.left.num -= this.defaultSpeed;
        this.left.top = this.left.num % len;
        window.requestAnimationFrame(callback);
      };
      window.requestAnimationFrame(callback);
    },
    scrollCenter() {
      let callback = () => {
        if (this.center.total && this.center.num <= this.center.total) {
          // this.center.top += 3;
          this.center.num = this.center.top;
          this.center.total = 0;
          this.showResult();
          return;
        }
        // this.center.num -= this.computtationSpeed(
        //   this.center.num,
        //   this.center.total
        // );
        this.center.num -= this.defaultSpeed;
        this.center.top = this.center.num % len;
        window.requestAnimationFrame(callback);
      };
      window.requestAnimationFrame(callback);
    },
    scrollRight() {
      let callback = () => {
        if (this.right.total && this.right.num <= this.right.total) {
          // this.right.top += 3;
          this.right.num = this.right.top;
          this.right.total = 0;
          this.showResult();
          return;
        }
        // this.right.num -= this.computtationSpeed(
        //   this.right.num,
        //   this.right.total
        // );
        this.right.num -= this.defaultSpeed;
        this.right.top = this.right.num % len;
        window.requestAnimationFrame(callback);
      };
      window.requestAnimationFrame(callback);
    },
    async getPrize() {
      let res = await wxPrize(this.activityCode);
      this.prize = res.data;
      if (res.data.pId) {
        // let prizeCondition = number(res.data.prizeCondition);
        this.left.total = this.computationPosition(
          this.left.num,
          res.data.prizeCondition
        );
        this.center.total = this.computationPosition(
          this.center.num,
          res.data.prizeCondition
        );
        this.right.total = this.computationPosition(
          this.right.num,
          res.data.prizeCondition
        );
      } else {
        this.left.total = this.computationPosition(this.left.num, 1);
        this.center.total = this.computationPosition(this.center.num, 2);
        this.right.total = this.computationPosition(this.right.num, 3);
      }
    },
    showResult() {
      this.shouldShowResult += 1;
      if (this.shouldShowResult === 3) {
        setTimeout(() => {
          this.shouldShowResult = 0;
          this.isScrollIng = false;
          this.$emit("prize", this.prize);
        }, 200);
      }
    },
    computationPosition(current, prizeNum) {
      return current - (current % len) - len * 2 - (len / 3) * (prizeNum - 1);
    },
    computtationSpeed(current, total) {
      current = Math.abs(current);
      total = Math.abs(total);
      let speed;
      speed = this.defaultSpeed;
      if (total == 0) {
        speed = (current - (current % len)) / len + 1;
      } else {
        let number = total - current;
        speed = (number - (number % len)) / len + 1;
      }
      if (speed > this.defaultSpeed) {
        speed = this.defaultSpeed;
      }
      if (speed < 1) {
        speed = 1;
      }
      // if (total != 0 && total - current < 600) {
      //   return 4.5;
      // }
      return speed * 3;
    }
  }
};
</script>

<style lang="less" scoped>
img.btn {
  pointer-events: auto;
  padding: 0;
  margin: 0;
  border: 0;
}
.tiger-body-content {
  background: url("../../../assets/activity/tiger/tiger.png");
  background-size: cover;
  width: 100%;
  height: 11.9rem;
  position: relative;
  top: -0.1rem;

  .scroller-container {
    height: 2rem;
    padding-left: 1.92rem;
    padding-right: 1.92rem;
    overflow: hidden;
    position: absolute;
    top: 3.16rem;
    left: 0;

    .scroller {
      width: 2rem;
      height: 2rem;
      display: inline-block;
      position: relative;
      padding: 0;
      margin: 0;
      border: 0;
      font-size: 0;
      &.center {
        margin: 0 0.48rem;
      }

      .img {
        display: block;
        width: 2rem;
        height: 2.08rem;
      }
    }
  }

  .person-count {
    position: absolute;
    top: 6.4rem;
    font-size: 0.36rem;
    color: #161235;
    font-weight: bold;
    text-align: center;
    width: 100%;
    left: 0;
  }

  .chance {
    position: absolute;
    top: 7.44rem;
    left: 0;
    font-size: 0.64rem;
    /*color: 161235;*/
    color: white;
    font-weight: bold;
    text-align: center;
    width: 100%;
    /*-webkit-text-stroke: 0.03rem white;*/
  }

  .test-lucky {
    position: absolute;
    top: 9.6rem;
    width: 8rem;
    height: 1.6rem;
    left: 0.72rem;
  }
}
</style>
