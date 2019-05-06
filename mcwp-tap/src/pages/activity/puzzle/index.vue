<template>
    <div class="activity-puzzle-container" v-if="!showQr">
      <!-- <h3 class="title">拼图体验版-第<strong class="currLevel">{{levelIndex + 1}}</strong>关</h3> -->
      <p class="chance-wrapper">还有&nbsp;<span class="chance">{{chance}}</span>&nbsp;次拼图机会</p>
      <svg-progress-bar class="bar-wrap" v-show="showBar" v-if="ifBar" :value="second" :options="options" type="rect"></svg-progress-bar>
      <svg-progress-bar class="bar-wrap" v-show="showRemeberBar" v-if="ifRemeberBar" :value="remeberSecond" :options="remeberOptions" type="rect"></svg-progress-bar>
      <div class="pic-wrapper" ref="picWrapper" v-if="showPic">
        <div v-if="showMask" class="mask" ref="mask" :style="styleObject">
          <!-- <p class='difficulty' v-if="startBtn">
            <span class="degree" @click="start()">高&nbsp;级</span>
            <span class="degree" @click="start(120)">中&nbsp;级</span>
            <span class="degree" @click="start(180)">低&nbsp;级</span>
          </p> -->
          <div v-show="puzzleWay" class="puzzle-way-wrapper">
            <p class="puzzle-way">拼图玩法</p>
            <p>开始游戏后</p>
            <p>观察图片{{maxRemeberSecond || '5'}}s或直接开始</p>
            <p>拖动要互换的两块拼图</p>
            <p>在有限时间拼完</p>
          </div>
          <!-- <span class="btn" v-if="repeatBtn" @click="startNext(0)">重新开始</span> -->
          <!-- <span class="btn" v-if="nextBtn" @click="startNext()">下一关</span> -->
        </div>
        <div class="puzzle-main" :class="`pic-cell${index}`" ref="picCell"
          v-for="(item, index) in picCell" :key="index"
          :style="item"
          @mousedown.prevent.stop="down" @touchstart.prevent.stop="down"
          @mousemove.prevent.stop="move" @touchmove.prevent.stop="move"
          @mouseup.prevent.stop="end" @touchend.prevent.stop="end">
        </div>
      </div>
      <img class="logo" v-if="logo" :src="logo" alt="logo">
      <img class="puzzle-rule" @click.prevent="showRule = true" src="../../../assets/puzzle_rule.png" />
      <div class="btn-wrapper">
        <img class="puzzle-share" @click.prevent="showShareTip = true" src="../../../assets/puzzle-share.png" />
        <img class="puzzle-start" v-if="stage == 0" @click.prevent="startNext(0)" src="../../../assets/puzzle-start.png" />
        <img class="puzzle-start" v-if="stage == 1" @click.prevent="startNow" src="../../../assets/puzzle-start-now.png" />
      </div>
      <div class="turntable-slider" v-if="listData.length">
        <tiny-slider :mouse-drag="false" :touch="false" :items="1" :controls = 'false' :autoplayButtonOutput='false' :autoplay='true' :axis='`vertical`'>
          <div v-for = "(item, index) in listData" :key = "index">{{item}}</div>
        </tiny-slider>
      </div>
      <v-share v-if="showShareTip" @hide="showShareTip=false" :showShareTip="showShareTip"></v-share>
      <v-winner v-if="showWinner" @takeSuccess="getUserPrize" @exchange="exchange" :prize="prize" :activityCode="activityCode" :prizeId="prizeId" :qrCode="qrCode"/>
      <v-result v-if="nextBtn || repeatBtn || finishBtn" :nextBtn="nextBtn" :repeatBtn="repeatBtn" :finishBtn="finishBtn" :prizeName="prizeName"  @showShare="showShareTip = true" @startNext="startNext()" @reStart="startNext(0)" @receive="receive" :chance="chance" />
      <v-rule v-if="showRule" :rule="rule" @hide="showRule = false" />
      <p class="participate-num" v-if="participateNum">已有{{participateNum}}人参与</p>
      <Login v-show="showLogin" @success="loginSuccess" />
      <!--<popup :overlay="false" v-model="showLogin" style="width:100%;height:100%;"><Login v-show="showLogin" @success="loginSuccess" @changeTab="changeTab" /></popup>-->
      <v-received v-if="userPrize" :userPrize="userPrize">
        <img class="logo" v-if="logo" :src="logo" alt="logo">
        <img class="puzzle-rule" @click.prevent="showRule = true" src="../../../assets/puzzle_rule.png" />
        <div class="turntable-slider" v-if="listData.length">
          <tiny-slider :mouse-drag="false" :touch="false" :items="1" :controls = 'false' :autoplayButtonOutput='false' :autoplay='true' :axis='`vertical`'>
            <div v-for = "(item, index) in listData" :key = "index">{{item}}</div>
          </tiny-slider>
        </div>
        <p class="participate-num" v-if="participateNum">已有{{participateNum}}人参与</p>
      </v-received>
      <audio id="confuse-voice" ref="confuseVoice" preload >
          <source src="../../../assets/3.wav" />
      </audio>
      <audio id="success-voice" ref="successVoice" preload >
          <source src="../../../assets/2.wav" />
      </audio>
      <audio id="fail-voice" ref="failVoice" preload >
          <source src="../../../assets/4.wav" />
      </audio>
    </div>
    <div v-else>
      <qr-canvas v-if="qrUrl" :qrUrl="qrUrl"  />
    </div>
</template>

<script>
import TinySlider from "@/components/tinySlider";
import VShare from "@/components/share";
import VWinner from "@/components/activity/puzzle/winner";
import VResult from "@/components/activity/puzzle/result";
import VReceived from "@/components/activity/puzzle/received";
import VRule from "@/components/activity/puzzle/rule";
import {
  getPuzzleInfo,
  getPuzzlePrize,
  putPuzzleFailure,
  postPuzzleShare
} from "@/service/activity/puzzle";
import get from "lodash.get";
import CryptoJS from "crypto-js";
import Wxsdk from "@/utils/wxJsSdk";
import { Config, countPlus } from "@/utils/index.js";
import Store from "store";
import QrCanvas from "@/components/qrCanvas";
import Login from "../../../components/home/login";
import { Popup } from "vant";
import { getWxLoginStatus } from "../../../service/user";
// import Base64 from "crypto-js/enc-base64";

export default {
  components: {
    TinySlider,
    VShare,
    VWinner,
    VResult,
    VReceived,
    VRule,
    QrCanvas,
    Login,
    Popup
  },
  data() {
    let fontSize = parseFloat(window.document.documentElement.style.fontSize);
    let initSize = 9.6 * fontSize;
    let offsetLeft = ((10.8 - 9.6) / 2) * fontSize;
    let maxSecond = 30;
    let maxRemeberSecond = 5;
    return {
      fontSize,
      maxWidth: initSize,
      maxHeight: initSize,
      offsetTop: "", // 顶部距离
      offsetLeft, // 左边距离
      cellWidth: "",
      cellHeight: "",
      levelConfig: [],
      levelIndex: 0,
      picCell: [],
      currImg: "",
      currMovePic: "",
      changing: false,
      changingDom: [],
      mutiPointer: 0,
      position: {},
      styleObject: {
        width: `${initSize + 4}px`,
        height: `${initSize + 4}px`,
        left: 0,
        top: 0
      },
      showMask: true, // 遮罩
      showPic: true, // 拼图区域
      startBtn: true,
      finishBtn: false,
      nextBtn: false,
      repeatBtn: false,
      maxSecond,
      maxRemeberSecond,
      second: maxSecond,
      timer: "",
      remeberTimer: "", // 记忆定时器
      options: {
        rectRadius: 5,
        maxValue: maxSecond,
        rectWidth: 8 * fontSize,
        rectHeight: 10,
        duration: 0,
        pathColors: ["#fff", "#fb5899"],
        text: value => value + '<span class="unit">秒</span>'
      },
      remeberOptions: {
        rectRadius: 5,
        maxValue: maxRemeberSecond,
        rectWidth: 8 * fontSize,
        rectHeight: 10,
        duration: 0,
        pathColors: ["#fff", "#fb5899"],
        text: value => value + '<span class="unit">秒</span>'
      },
      ifBar: true,
      ifRemeberBar: true,
      showBar: false,
      showRemeberBar: false,
      chance: 0,
      puzzleWay: true, // 刚进游戏时候的游戏说明
      remeberSecond: maxRemeberSecond,
      listData: [],
      classOption: {
        step: 0.5,
        limitMoveNum: 5
      },
      participateNum: 1000,
      showShareTip: false,
      activityCode: this.$route.query.activityCode,
      stage: 0, // 阶段 0：没开始/已结束；1：观察；2：游戏
      userPrize: "", // 中奖信息
      rule: "", // 游戏规则
      showRule: false,
      showWinner: false,
      prizeName: "",
      logo: null,
      prize: null, // 奖品详情
      activityInfo: null,
      showQr: this.$route.meta.showQr, // 非微信二维码
      qrUrl: null,
      shareUrl: null,
      openId: this.$route.query.openId, // 分享人的openId
      qrCode: null,
      showLogin: false,
      userPhone: null, //用户手机号,
      userName: null,
      loginStatus: false,
      prizeType: null //奖品类型
    };
  },
  mounted() {
    let wxUserInfo = Store.get(Config.constants.wxUserInfo) || {};
    let cookies = Store.get(Config.constants.cookies) || {};
    this.userName = wxUserInfo.userName;
    this.userPhone = wxUserInfo.telephone;
    this.loginStatus = wxUserInfo.loginStatus;
    this.getWxLoginStatus();
    this.qrUrl = `${
      Config.api.url
    }/comm/v1/wx/authorize?url=%2Ftap%2Factivity%2Fpuzzle%3FopenId%3D${
      this.openId
    }&wxCode=${this.$route.query.wxCode}&bankCode=${
      this.$route.query.bankCode
    }&activityCode=${this.$route.query.activityCode}&activityType=puzzle`;
    this.shareUrl = `${
      Config.api.url
    }/comm/v1/wx/authorize?url=%2Ftap%2Factivity%2Fpuzzle%3FopenId%3D${
      cookies.openid
    }&wxCode=${this.$route.query.wxCode}&bankCode=${
      this.$route.query.bankCode
    }&activityCode=${this.$route.query.activityCode}&activityType=puzzle`;
    if (this.showQr) return;
    this.getConfig();
    this.wxShare();
    if (this.openId) {
      this.postShare();
    }
  },
  methods: {
    async getWxLoginStatus() {
      let res = await getWxLoginStatus();
      if (res.data) {
        this.loginStatus = res.data.loginStatus;
        if (res.data.telephone) {
          this.userPhone = res.data.telephone;
        }
        if (res.data.userName) {
          this.userName = res.data.userName;
        }
      }
    },
    // 分享得到次数
    async postShare() {
      let param = {
        openId: this.openId,
        activityCode: this.activityCode
      };
      await postPuzzleShare(param);
    },
    wxShare() {
      let that = this;
      Wxsdk.wxShareCommon(
        () => {
          // that.showShareTip = false;
          countPlus("拼图活动", "send");
        },
        {
          type: 2,
          activityCode: this.activityCode
        },
        that.shareUrl
      );
    },
    async getConfig() {
      const that = this;
      let res = await getPuzzleInfo({ activityCode: this.activityCode });
      that.activityInfo = res.data;
      that.chance = that.activityInfo.liveNum;
      that.userPrize = that.activityInfo.userPrize;
      that.participateNum = that.activityInfo.peopleNum;
      that.qrCode = get(that.activityInfo, "jigsawStateDTO.qrcodeUrl");
      that.rule = that.activityInfo.jigsawStateDTO;
      that.listData = that.activityInfo.winners;
      that.logo = that.activityInfo.coverUrl;
      document.title = get(
        that.activityInfo,
        "operateJigsawActivity.activeName",
        "拼图"
      );
      that.levelConfig = that.activityInfo.operateJigsawConf;
      that.maxSecond = that.levelConfig[0].endTime;
      that.maxRemeberSecond = that.levelConfig[0].stayTime;
      // 存在不大于1px的误差
      this.offsetTop = this.$refs.picWrapper.offsetTop;
      this.render();
    },
    async getLifeNum() {
      const that = this;
      let res = await getPuzzleInfo({ activityCode: this.activityCode });
      that.activityInfo = res.data;
      that.chance = that.activityInfo.liveNum;
    },
    async getUserPrize() {
      const that = this;
      let res = await getPuzzleInfo({ activityCode: this.activityCode });
      that.activityInfo = res.data;
      that.userPrize = that.activityInfo.userPrize;
    },
    render() {
      const that = this;
      let config = that.levelConfig[that.levelIndex];
      let row = config.cuttingWays;
      let col = config.cuttingWays;
      that.currImg = config.coverUrl;
      // TODO
      // row = 2;
      // col = 2;
      // 随机图片 TODO
      // that.currImg =
      //   that.imgdata[Math.floor(Math.random() * that.imgdata.length)];
      // 时间重置
      this.second = this.maxSecond;
      this.remeberSecond = this.maxRemeberSecond;
      that.cellWidth = Math.floor(that.maxWidth / row);
      that.cellHeight = Math.floor(that.maxHeight / col);
      that.picCell = [...Array(row * col)].map((_, i) => ({
        width: `${that.cellWidth}px`,
        height: `${that.cellHeight}px`,
        left: `${(i % row) * that.cellWidth + (i % row)}px`,
        top: `${(((i / col) | 0) * that.cellWidth + i / col) | 0}px`,
        background: `url(${that.currImg}) no-repeat ${-(i % row) *
          that.cellWidth}px ${-((i / col) | 0) *
          that.cellWidth}px scroll transparent`,
        backgroundSize: `${that.maxWidth}px ${that.maxHeight}px`,
        zIndex: 0
      }));
    },
    confuse() {
      const that = this;
      let tmpPicArray = [...that.picCell];
      let index = 0;
      // 播放音频
      this.$refs.confuseVoice.play();
      while (tmpPicArray.length > 0) {
        let random = Math.floor(Math.random() * tmpPicArray.length);
        let tempCell = tmpPicArray[random];
        that.$anime({
          targets: `.pic-cell${index}`,
          left: tempCell.left,
          top: tempCell.top,
          duration: "500",
          easing: "easeInOutSine"
        });
        // 位置高宽数组减少，图片下标加1
        tmpPicArray.splice(random, 1);
        index = index + 1;
      }
    },
    start(num) {
      let that = this;
      let config = that.levelConfig[that.levelIndex];
      if (!that.chance) return that.$toast("次数已经用光");
      // 改变时间，暂未使用
      if (num) {
        this.maxSecond = num;
        this.second = num;
        this.options.maxValue = num;
        this.ifBar = false;
        this.ifRemeberBar = false;
        this.$nextTick(() => {
          this.ifBar = true;
          this.ifRemeberBar = true;
        });
      } else {
        this.maxSecond = config.endTime;
        this.second = config.endTime;
        this.options.maxValue = config.endTime;
        this.maxRemeberSecond = config.stayTime;
        this.remeberSecond = config.stayTime;
        this.remeberOptions.maxValue = config.stayTime;
        this.ifBar = false;
        this.ifRemeberBar = false;
        this.$nextTick(() => {
          this.ifBar = true;
          this.ifRemeberBar = true;
        });
      }
      that.$refs.mask.style.opacity = 0;
      that.startBtn = false;
      that.nextBtn = false;
      that.repeatBtn = false;
      that.finishBtn = false;
      // 游戏玩法只显示一次
      that.puzzleWay = false;
      that.showRemeberBar = true;
      that.showBar = false;
      // 阶段改变
      that.stage = 1;
      that.remeberTimer = setInterval(() => {
        that.remeberSecond -= 1;
        if (that.remeberSecond <= 0) {
          that.startNow();
        }
      }, 1000);
    },
    // 立即开始
    startNow() {
      const that = this;
      // this.getLifeNum();
      // 阶段改变
      that.stage = 2;
      that.remeberTimer && clearInterval(that.remeberTimer);
      that.showRemeberBar = false;
      that.showBar = true;
      let i = 0;

      countPlus("拼图游戏点击“立即开始”", "send");
      this.highLight();
      let timer = setInterval(() => {
        if (i > 2 && !that.isPass()) {
          clearInterval(timer);
          that.showMask = false;
          // that.startBtn = false;
          // that.nextBtn = false;
          // that.repeatBtn = false;
          // 开始倒计时
          that.timer = setInterval(() => {
            that.second -= 1;
            if (that.second == 0) {
              that.gameover();
            }
          }, 1000);
          return false;
        }
        that.confuse();
        // if (i === 1) {
        //   // 第一次观察
        //   this.highLight();
        // }
        // if (i > 1) {
        //   that.confuse();
        // }
        i += 1;
      }, 600); // 多增加100，渲染需要时间
    },
    highLight() {
      this.$anime({
        targets: ".mask",
        opacity: "1",
        easing: "easeInOutSine",
        duration: "200",
        complete: () => {
          this.$anime({
            targets: ".mask",
            opacity: "0",
            easing: "easeInOutSine",
            duration: "200"
          });
        }
      });
    },
    // 实现移动端拖拽，目前一次只准许移动一块
    down(e) {
      if (e.touches.length > 1 || e.targetTouches.length > 1) {
        this.mutiPointer = 1;
        return false;
      } else {
        this.mutiPointer = 0;
      }
      let touch;
      if (e.touches) {
        touch = e.touches[0];
      } else {
        touch = e;
      }
      if (this.changingDom.includes(touch.target)) return false;
      // 暂不支持同时移动两个
      if (this.currMovePic) return false;
      e.target.style.zIndex = 100;
      this.currMovePic = e.target;
      // 记录位置，点击位置
      this.position = {
        top: e.target.style.top,
        left: e.target.style.left,
        x: touch.pageX,
        y: touch.pageY
      };
    },
    move(e) {
      if (e.touches.length > 1 || e.targetTouches.length > 1) {
        self.mutiPointer = 1;
        return false;
      } else {
        self.mutiPointer = 0;
      }
      let touch;
      if (e.touches) {
        touch = e.touches[0];
      } else {
        touch = e;
      }
      if (this.changingDom.includes(touch.target)) return false;
      if (this.currMovePic !== touch.target) return false;
      let moveX = touch.pageX - this.position.x;
      let moveY = touch.pageY - this.position.y;
      e.target.style.left = parseFloat(this.position.left) + moveX + "px";
      e.target.style.top = parseFloat(this.position.top) + moveY + "px";
    },
    end(e) {
      // BUG修复
      // 松手时是多指，初始移动手指一起松开，导致图片停留 todo
      if (e.changedTouches.length > 1 || self.mutiPointer == 1) {
        if (e.changedTouches[0].target === this.currMovePic) {
          let currMovePic = this.currMovePic;
          this.currMovePic = "";
          this.changingDom = this.changingDom.concat([currMovePic]);
          this.$anime({
            targets: currMovePic,
            left: this.position.left,
            top: this.position.top,
            easing: "easeInOutSine",
            duration: "300",
            complete: () => {
              // 动画结束前不能按
              if (currMovePic) currMovePic.style.zIndex = 0;
              e.target.style.zIndex = 0;
              this.changingDom = this.changingDom.filter(i => i != currMovePic);
              this.changing = false;
              if (this.isPass()) {
                this.gameFinish();
              }
            }
          });
          return false;
        }
        return false;
      }
      let touch;
      if (e.changedTouches) {
        touch = e.changedTouches[0];
      } else {
        touch = e;
      }
      if (this.changingDom.includes(touch.target)) return false;
      // 如果不是当前目标，先重置原来目标，先后松手的情况
      if (this.currMovePic !== touch.target) {
        // 避免下一次开始重置
        let currMovePic = this.currMovePic;
        this.currMovePic = "";
        this.changingDom = this.changingDom.concat([currMovePic]);
        this.$anime({
          targets: currMovePic,
          left: this.position.left,
          top: this.position.top,
          easing: "easeInOutSine",
          duration: "300",
          complete: () => {
            // 动画结束前不能按
            if (currMovePic) currMovePic.style.zIndex = 0;
            e.target.style.zIndex = 0;
            this.changingDom = this.changingDom.filter(i => i != currMovePic);
            this.changing = false;
            if (this.isPass()) {
              this.gameFinish();
            }
          }
        });
        return false;
      }
      let touchX = touch.pageX - this.offsetLeft;
      let touchY = touch.pageY - this.offsetTop;
      // 避免下一次开始重置
      let currMovePic = this.currMovePic;
      this.currMovePic = "";
      // 是否存在交换目标
      let changeTarget = null;
      // 不超过最大范围
      if (
        !(
          touchX < 0 ||
          touchX > this.maxWidth ||
          touchY < 0 ||
          touchY > this.maxHeight
        )
      ) {
        changeTarget = this.$refs.picCell
          .filter(i => i !== e.target)
          .filter(i => {
            let left = parseFloat(i.style.left);
            let top = parseFloat(i.style.top);
            return (
              left < touchX &&
              touchX < left + this.cellWidth &&
              top < touchY &&
              touchY < top + this.cellHeight
            );
          })[0];
      }
      this.changing = true;
      if (changeTarget && !this.changingDom.includes(changeTarget)) {
        this.changingDom = this.changingDom.concat([changeTarget, currMovePic]);
        // 交换的目标z-index调整
        changeTarget.style.zIndex = 10;
        this.$anime({
          targets: currMovePic,
          left: changeTarget.style.left,
          top: changeTarget.style.top,
          easing: "easeInOutSine",
          duration: "300"
        });
        this.$anime({
          targets: changeTarget,
          left: this.position.left,
          top: this.position.top,
          easing: "easeInOutSine",
          duration: "300",
          complete: () => {
            // 动画结束前不能按
            changeTarget.style.zIndex = 0;
            e.target.style.zIndex = 0;
            // this.onOff = false;
            this.changingDom = this.changingDom.filter(
              i => i != changeTarget && i != currMovePic
            );
            this.changing = false;
            // 通关
            if (this.isPass()) {
              this.gameFinish();
            }
          }
        });
      } else {
        this.changingDom = this.changingDom.concat([currMovePic]);
        this.$anime({
          targets: currMovePic,
          left: this.position.left,
          top: this.position.top,
          easing: "easeInOutSine",
          duration: "300",
          complete: () => {
            // 动画结束前不能按
            e.target.style.zIndex = 0;
            this.changingDom = this.changingDom.filter(i => i != currMovePic);
            this.changing = false;
            if (this.isPass()) {
              this.gameFinish();
            }
          }
        });
      }
      this.position = {};
    },
    isPass() {
      let pass = true;
      this.$refs.picCell.map((item, index) => {
        if (
          this.picCell[index].left !== item.style.left ||
          this.picCell[index].top !== item.style.top
        ) {
          pass = false;
          return pass;
        }
      });
      return pass;
    },
    // 下一关
    async gameFinish() {
      // 如果动画过程中时间结束return
      if (this.stage == 0) return;
      // 阶段改变
      this.stage = 0;
      if (this.timer) clearInterval(this.timer);
      this.showMask = true;
      if (this.levelIndex == this.levelConfig.length - 1) {
        // 抽奖
        let id = this.levelConfig[this.levelIndex].id;

        let keyHex = CryptoJS.enc.Utf8.parse(this.activityCode.slice(0, 16));
        // direct decrypt ciphertext
        let cipherid = CryptoJS.AES.encrypt(id + "", keyHex, {
          mode: CryptoJS.mode.ECB,
          padding: CryptoJS.pad.Pkcs7
        });
        let param = {
          competeness: cipherid.toString(),
          activityCode: this.activityCode
        };
        let res = await getPuzzlePrize(param);
        this.prizeName = get(res.data, "prizeName", null);
        this.prizeId = get(res.data, "pId", null);
        this.prizeType = get(res.data, "prizeType", null);
        this.prize = res.data || {};
        this.finishBtn = true;
        this.getLifeNum();
      } else {
        this.nextBtn = true;
      }
      this.$refs.successVoice.play();
      // this.$refs.mask.style.opacity = 0;
      // let i = 0;
      // let timer = setInterval(() => {
      //   if (i == 2) {
      //     clearInterval(timer);
      //     this.nextBtn = true;
      //     this.$refs.mask.style.opacity = 1;
      //     this.$refs.successVoice.play();
      //   } else {
      //     i += 1;
      //     this.highLight();
      //   }
      // }, 600);
    },
    // 倒计时结束
    async gameover() {
      // 如果动画过程中时间结束return
      if (this.stage == 0) return;
      // 阶段改变
      this.stage = 0;
      if (this.timer) clearInterval(this.timer);
      let res = await putPuzzleFailure({ activityCode: this.activityCode });
      if (res.data) {
        // 阶段改变
        // this.stage = 0;
        this.showMask = true;
        this.repeatBtn = true;
        this.$refs.failVoice.play();
        this.getLifeNum();
      }
      // this.$refs.mask.style.opacity = 0;
      // let i = 0;
      // let timer = setInterval(() => {
      //   if (i == 2) {
      //     clearInterval(timer);
      //     this.repeatBtn = true;
      //     this.$refs.mask.style.opacity = 1;
      //     this.$refs.failVoice.play();
      //   } else {
      //     i += 1;
      //     this.highLight();
      //   }
      // }, 600);
    },
    async startNext(level) {
      const that = this;
      let msg;
      if (level === 0) {
        let res = await getPuzzleInfo({ activityCode: this.activityCode });
        that.activityInfo = res.data;
        that.chance = that.activityInfo.liveNum;
        // this.getLifeNum();
        this.levelIndex = 0;
        msg = "拼图游戏点击“开始”";
      } else {
        this.levelIndex += 1;
        msg = "拼图游戏点击“再来一次”";
      }
      countPlus(msg, "send");
      this.showPic = !this.showPic;
      this.currMovePic = "";
      this.position = {};
      this.changingDom = [];
      this.picCell = [];
      this.render();
      this.$nextTick(() => {
        this.showPic = true;
        this.$nextTick(() => {
          this.start();
        });
      });
    },
    receive() {
      if (this.loginStatus) {
        this.showWinner = true;
      } else {
        this.showLogin = true;
      }
    },
    loginSuccess() {
      this.showLogin = false;
      // this.userPhone = data.telephone;
      // if (data.userName) {
      //   this.userName = data.userName;
      // }
      this.showWinner = true;
    },
    exchange() {
      this.router.replace("/score/scoreExchange");
    }
  }
};
</script>

<style lang="less">
.activity-puzzle-container {
  // background-color: #2a2a2a;
  height: 100vh;
  background: url(../../../assets/puzzle_bg.png) no-repeat top left;
  background-size: 100%;
  box-sizing: border-box;
  padding: 0 0.6rem;
  // 标题
  .title {
    font-size: 0.22rem;
    padding: 0.2rem 0;
    color: #ccc;
  }
  .chance-wrapper {
    font-size: 0.48rem;
    line-height: 0.48rem;
    font-family: "方正兰亭准黑";
    padding: 1.04rem 0 0.6rem;
    .chance {
      font-weight: bold;
      font-size: 0.64rem;
    }
  }
  .bar-wrap {
    position: absolute;
    text-align: left;
    .circles-text {
      text-align: right !important;
      left: 1.6rem !important;
      // position: absolute;
      // right: -200px;
    }
    .unit {
      font-size: 14px;
    }
  }
  .logo {
    position: absolute;
    left: 0.4rem;
    top: 0.16rem;
    width: 1.5rem;
    height: 1.5rem;
  }
  .puzzle-rule {
    position: absolute;
    top: 0.6rem;
    right: 0;
    width: 1.92rem;
    height: 0.8rem;
    pointer-events: auto;
  }
  .btn-wrapper {
    display: flex;
  }
  .puzzle-share,
  .puzzle-start {
    margin-top: 10.2rem;
    width: 4.16rem;
    height: 1.6rem;
    pointer-events: auto;
  }
  .puzzle-share + .puzzle-start {
    margin-left: 0.8rem;
  }
  .turntable-slider {
    margin: 0.56rem auto 0;
    font-size: 0.32rem;
    height: 0.78rem;
    line-height: 0.8rem;
    width: 8.4rem;
    background-color: #fff;
    overflow: hidden;
    border: 2px solid #000;
    color: #441314;
  }
  .participate-num {
    margin-top: 0.4rem;
    font-size: 0.36rem;
    color: #441314;
  }
  .difficulty {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 1.4rem;
    color: #fff;
  }
  .degree {
    margin-top: 0.8rem;
    width: 2.4rem;
    height: 1rem;
    line-height: 1rem;
    border-radius: 0.2rem;
    font-size: 16px;
    background: #f0ad4e;
  }
  .currLevel {
    color: #f0ad4e;
  }
  .pic-wrapper {
    margin-top: 0.6rem;
    position: relative;
    .mask {
      position: absolute;
      color: #fff;
      font-size: 0.48rem;
      line-height: 0.64rem;
      background-color: rgba(0, 0, 0, 0.4);
      z-index: 400;
    }
    .puzzle-way-wrapper {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #48333a;
    }
    .puzzle-way {
      font-size: 0.56rem;
      line-height: 0.56rem;
      padding: 1.8rem 0 0.9rem;
    }
    .btn {
      position: absolute;
      left: 0;
      right: 0;
      top: 60%;
      color: #fff;
      margin: auto;
      width: 2.4rem;
      height: 1rem;
      line-height: 1rem;
      border-radius: 0.2rem;
      font-size: 16px;
      background: #f0ad4e;
    }
    .puzzle-main {
      position: absolute;
    }
  }
  .restart {
    color: #fff;
  }
}
</style>
