<template>
  <div class="answer-container">
    <div class="answer" v-if="!showQr">
      <div ref="answer" :style="styleObject" v-show="showAnswer">
      </div>
      <audio ref="audio0" preload="auto">
        <source src="../../../assets/one.mp3" />
      </audio>
      <audio ref="audio1" preload="auto" >
        <source src="../../../assets/two.mp3" />
      </audio>
      <audio ref="audio2" preload="auto" >
        <source src="../../../assets/three.mp3" />
      </audio>
      <audio ref="audio3" preload="auto" >
        <source src="../../../assets/four.mp3" />
      </audio>
      <audio ref="bgMusic" preload="auto" autoplay loop >
        <source src="../../../assets/bg-music.mp3" />
      </audio>
    </div>
    <qr-canvas :qrUrl="qrUrl" v-else />
    <answer-result v-if="showResult" :detail="showResultDetail" :score="resultScore"></answer-result>
  </div>
</template>

<script>
import * as PIXI from "pixi.js";
import * as TWEEN from "@tweenjs/tween.js";
import AnswerResult from "@/components/activity/answerResult";
import { Toast } from "vant";
import QrCanvas from "@/components/qrCanvas";
import Store from "store";
import { Config, countPlus } from "@/utils/index.js";
import Wxsdk from "@/utils/wxJsSdk";
import { joinActivity } from "../../../service/activity";
// import CryptoJS from "crypto-js"
// import {Scroller} from 'scroller'

export default {
  components: {
    AnswerResult,
    QrCanvas
  },
  data() {
    let WIDTH = window.innerWidth;
    let HEIGHT = window.innerHeight;
    let SCALE = WIDTH / 750;
    return {
      WIDTH: 750,
      HEIGHT: HEIGHT / SCALE,
      styleObject: {
        width: `750px`,
        height: `${HEIGHT / SCALE}px`,
        transform: `rotate(0deg) scale(${SCALE}) translate3d(0,0,0) `,
        transformOrigin: "0 0"
      },
      warning: WIDTH > HEIGHT, // todo 显示警告，不显示问句
      // welocation: "//s5c.music.126.net/static_public/5b519742aad18d1f9602c346/images/",
      baseUrl: process.env.BASE_URL,
      guideList: [
        {
          bg: "guide_1.png",
          duration: 1500
        },
        {
          bg: "guide_2.png"
        },
        {
          bg: "guide_3.png"
        },
        {
          bg: "guide_4.png"
        },
        {
          bg: "guide_5.png"
        },
        {
          bg: "guide_6.png"
        }
      ],
      q1List: [
        {
          bg: "q1_1.png"
        },
        {
          bg: "q1_2.png"
        }
      ],
      q2List: [
        {
          bg: "q2_1.png"
        },
        {
          bg: "q2_2.png"
        }
      ],
      q3List: [
        {
          bg: "q3_1.png"
        },
        {
          bg: "q3_2.png"
        }
      ],
      q4List: [
        {
          bg: "q4_1.png"
        },
        {
          bg: "q4_2.png"
        },
        {
          bg: "q4_3.png"
        }
      ],
      q5List: [
        {
          bg: "q5_1.png"
        },
        {
          bg: "q5_2.png"
        }
      ],
      q6List: [
        {
          bg: "q6_1.png"
        },
        {
          bg: "q6_2.png"
        }
      ],
      q7List: [
        {
          bg: "q7_1.png"
        },
        {
          bg: "q7_2.png"
        }
      ],
      btnList: [
        [
          {
            btn: "btn_find.png",
            width: 220,
            height: 75,
            position: {
              x: 265,
              y: 0
            },
            state: "q1" // 第一步 直接答题
          }
        ],
        [
          {
            btn: "btn_behavior_2.png",
            width: 180,
            height: 75,
            position: {
              x: 10,
              y: 0
            },
            score: 2,
            state: "q2"
          },
          {
            btn: "btn_behavior_3.png",
            width: 180,
            height: 75,
            position: {
              x: 190,
              y: 0
            },
            score: 5,
            state: "q2"
          },
          {
            btn: "btn_behavior_4.png",
            width: 180,
            height: 75,
            position: {
              x: 370,
              y: 0
            },
            score: 8,
            state: "q2"
          },
          {
            btn: "btn_behavior_5.png",
            width: 180,
            height: 75,
            position: {
              x: 550,
              y: 0
            },
            score: 10,
            state: "q2"
          }
        ],
        [
          {
            btn: "btn_one.png",
            width: 170,
            height: 75,
            position: {
              x: 25,
              y: 0
            },
            score: 2,
            state: "q3"
          },
          {
            btn: "btn_two.png",
            width: 170,
            height: 75,
            position: {
              x: 205,
              y: 0
            },
            score: 5,
            state: "q3"
          },
          {
            btn: "btn_three.png",
            width: 170,
            height: 75,
            position: {
              x: 385,
              y: 0
            },
            score: 8,
            state: "q3"
          },
          {
            btn: "btn_four.png",
            width: 170,
            height: 75,
            position: {
              x: 565,
              y: 0
            },
            score: 10,
            state: "q3"
          }
        ],
        [
          {
            btn: "btn_one.png",
            width: 170,
            height: 75,
            position: {
              x: 25,
              y: 0
            },
            state: "q4"
          },
          {
            btn: "btn_two.png",
            width: 170,
            height: 75,
            position: {
              x: 205,
              y: 0
            },
            state: "q4"
          },
          {
            btn: "btn_three.png",
            width: 170,
            height: 75,
            position: {
              x: 385,
              y: 0
            },
            state: "q4"
          },
          {
            btn: "btn_four.png",
            width: 170,
            height: 75,
            position: {
              x: 565,
              y: 0
            },
            state: "q4"
          }
        ],
        [
          {
            btn: "btn_night_book.png",
            width: 210,
            height: 75,
            position: {
              x: 30,
              y: 0
            },
            state: "q5"
          },
          {
            btn: "btn_night_think.png",
            width: 210,
            height: 75,
            position: {
              x: 270,
              y: 0
            },
            state: "q5"
          },
          {
            btn: "btn_night_chat.png",
            width: 210,
            height: 75,
            position: {
              x: 510,
              y: 0
            },
            state: "q5"
          }
        ],
        [
          {
            btn: "btn_one.png",
            width: 170,
            height: 75,
            position: {
              x: 25,
              y: 0
            },
            score: 2,
            state: "q6"
          },
          {
            btn: "btn_two.png",
            width: 170,
            height: 75,
            position: {
              x: 205,
              y: 0
            },
            score: 8,
            state: "q6"
          },
          {
            btn: "btn_three.png",
            width: 170,
            height: 75,
            position: {
              x: 385,
              y: 0
            },
            score: 10,
            state: "q6"
          },
          {
            btn: "btn_four.png",
            width: 170,
            height: 75,
            position: {
              x: 565,
              y: 0
            },
            score: 5,
            state: "q6"
          }
        ],
        [
          {
            btn: "btn_one.png",
            width: 170,
            height: 75,
            position: {
              x: 25,
              y: 0
            },
            score: 2,
            state: "q7"
          },
          {
            btn: "btn_two.png",
            width: 170,
            height: 75,
            position: {
              x: 205,
              y: 0
            },
            score: 10,
            state: "q7"
          },
          {
            btn: "btn_three.png",
            width: 170,
            height: 75,
            position: {
              x: 385,
              y: 0
            },
            score: 8,
            state: "q7"
          },
          {
            btn: "btn_four.png",
            width: 170,
            height: 75,
            position: {
              x: 565,
              y: 0
            },
            score: 5,
            state: "q7"
          }
        ],
        [
          {
            btn: "btn_left.png",
            width: 220,
            height: 75,
            position: {
              x: 100,
              y: 0
            },
            state: "end"
          },
          {
            btn: "btn_right.png",
            width: 220,
            height: 75,
            position: {
              x: 430,
              y: 0
            },
            state: "end"
          }
        ]
      ],
      btnType: "startGuide",
      diaHeight: 0,
      moveHeight: 0,
      allContainer: new PIXI.Container(),
      vacationContainer: new PIXI.Container(),
      dialogContainer: new PIXI.Container(),
      btnContainer: new PIXI.Container(),
      interaContainer: new PIXI.Container(),
      resultScore: 11, // default
      allCity: [
        "台北",
        "杭州",
        "乌镇",
        "北海道",
        "爱琴海",
        "普罗旺斯",
        "丽江",
        "婺源",
        "丹麦",
        "埃及",
        "斯特拉福德",
        "维罗纳",
        "卡帕多奇亚",
        "冰岛",
        "布拉格",
        "拉萨",
        "科隆",
        "奥比都斯",
        "敦煌"
      ],
      resultCity: "",
      showResultDetail: false,
      showResult: false,
      showAnswer: false,
      showQr: this.$route.meta.showQr,
      qrUrl: `${
        Config.api.url
      }/comm/v1/wx/authorize?url=%2Ftap%2Factivity%2Fanswer&wxCode=${
        this.$route.query.wxCode
      }&activityCode=${this.$route.query.activityCode}&bankCode=${
        this.$route.query.bankCode
      }&activityType=answer`
    };
  },
  created() {
    if (this.showQr) return;
    Toast.loading({
      duration: 0, // 持续展示 toast
      forbidClick: true, // 禁用背景点击
      message: "加载中..."
    });
  },
  mounted() {
    if (this.showQr) return;
    this.CanvasRenderer = new PIXI.CanvasRenderer(this.WIDTH, this.HEIGHT, {
      backgroundColor: "0xffffff"
    });
    this.$refs.answer.appendChild(this.CanvasRenderer.view);
    if (!PIXI.loader.resources[`${this.baseUrl}pixi/dialog.json`]) {
      PIXI.loader
        .add([
          `${this.baseUrl}pixi/btn.json`,
          `${this.baseUrl}pixi/fire.json`,
          `${this.baseUrl}pixi/dialog.json`,
          `${this.baseUrl}pixi/bg.png`
        ])
        .load(() => {
          this.init();
        });
    } else {
      this.init();
    }
    let play = () => {
      document.removeEventListener("WeixinJSBridgeReady", play);
      // document.removeEventListener("touchstart", play, false);
      this.$refs.bgMusic.play();
    };
    this.$refs.bgMusic.play();
    // this.$refs.bgMusic.pause();
    //weixin
    document.addEventListener("WeixinJSBridgeReady", play, false);
    // document.addEventListener("touchstart", play, false);
    // let scrollerObj = new Scroller(function(left, top, zoom) {
    //   // apply coordinates/zooming
    // }, {
    //     zooming: false,
    //     animating: true,
    //     bouncing: false,
    //     animationDuration: 1000
    // });
    this.wxShare();
    joinActivity({ activityCode: this.activityCode });
  },
  methods: {
    wxShare() {
      let that = this;
      let wxUserInfo = Store.get(Config.constants.wxUserInfo);
      Wxsdk.wxShare(
        () => {
          // that.showShareTip = false;
          countPlus("桃花运活动", "send");
        },
        {
          title: that.resultCity
            ? `${wxUserInfo.nickname}的桃花圣地是${
                that.resultCity
              }，快来测测你的吧~`
            : "测测你的桃花运圣地~",
          summary: "选对了地方，才有可能相遇！",
          url: that.qrUrl,
          imgUrl:
            "http://zhudaibao-public.oss-cn-hangzhou.aliyuncs.com/activity/%E7%AD%94%E9%A2%98%E6%B4%BB%E5%8A%A8.jpg"
        }
      );
    },
    init() {
      let that = this;
      this.btnContainer.position.set(0, this.HEIGHT);
      // 加载
      this.diaAddLoader(this.guideList, "pixi/dialog.json");
      this.diaAddLoader(this.q1List, "pixi/dialog.json");
      this.diaAddLoader(this.q2List, "pixi/dialog.json");
      this.diaAddLoader(this.q3List, "pixi/dialog.json");
      this.diaAddLoader(this.q4List, "pixi/dialog.json");
      this.diaAddLoader(this.q5List, "pixi/dialog.json");
      this.diaAddLoader(this.q6List, "pixi/dialog.json");
      this.diaAddLoader(this.q7List, "pixi/dialog.json");

      // 按钮
      this.btn();
      // dialog动画
      this.animation(this.dialogContainer.children[0]);

      // 加载后面选项
      if (!PIXI.loader.resources[`${that.baseUrl}pixi/lovers.json`]) {
        that.$nextTick(() => {
          PIXI.loader.add(`${that.baseUrl}pixi/vacation.json`).load(function() {
            that.options("vacation", "vacationContainer");
            that.$nextTick(() => {
              PIXI.loader
                .add([
                  `${that.baseUrl}pixi/video.json`,
                  `${that.baseUrl}pixi/lovers.json`,
                  `${that.baseUrl}pixi/happiness.json`,
                  `${that.baseUrl}pixi/end.json`
                ])
                .load(function() {
                  that.video();
                  that.options("lovers", "loversContainer");
                  that.options("happiness", "happinessContainer");
                  that.end();
                });
            });
          });
        });
      } else {
        that.options("vacation", "vacationContainer");
        that.video();
        that.options("lovers", "loversContainer");
        that.options("happiness", "happinessContainer");
        that.end();
      }

      let bgContainer = new PIXI.Container();
      // const bgTexture = PIXI.Texture.fromImage(`${this.baseUrl}pixi/bg.png`);
      // let bg = new PIXI.Sprite(PIXI.loader.resources[`${this.baseUrl}pixi/bg.png`]);
      // let bg = PIXI.Sprite.fromImage(`${this.baseUrl}pixi/bg.png`);
      let bg = new PIXI.Sprite(
        PIXI.loader.resources[`${this.baseUrl}pixi/bg.png`].texture
      );
      bg.position.x = 0;
      bg.position.y = 0;
      bgContainer.addChild(bg);

      this.interaContainer.addChild(this.dialogContainer, this.btnContainer);
      this.allContainer.addChild(bgContainer, this.interaContainer);
      this.allContainer.addChild(this.interaContainer);
      this.CanvasRenderer.render(this.allContainer);
      // 避免黑屏闪烁
      Toast.clear();
      setTimeout(() => {
        this.showAnswer = true;
      }, 20);
      this.refresh();
    },
    // dia height 108
    diaAddLoader(diaList, json) {
      let totalHeight = 0;
      let tmpContainer = new PIXI.Container();
      diaList.map(i => {
        let diaContainer = new PIXI.Container();
        let diaSprite;
        diaSprite = new PIXI.Sprite(
          PIXI.loader.resources[`${this.baseUrl}${json}`].textures[i.bg]
        );
        diaContainer.addChild(diaSprite);
        diaContainer.duration = i.duration;
        diaContainer._height = diaContainer.height - 17;
        // diaContainer.pivot.set(14, diaContainer.height - 23)
        // diaContainer.position.set(19, totalHeight + diaContainer.height + 30 - 23)
        diaContainer.position.set(5, totalHeight + 30);
        totalHeight += diaContainer.height - 17;
        diaContainer.scale.set();
        tmpContainer.addChild(diaContainer);
      });
      // todo
      // tmpContainer._height = totalHeight
      this.dialogContainer.addChild(tmpContainer);
    },
    // 顺序播放
    animation(target) {
      let that = this;
      // 设置初始位置
      target.position.set(0, that.diaHeight);

      let arr = [];
      target.children.map(i => {
        arr.push(() => {
          let renderPromise = new Promise(resolve => {
            this.sizeChange(i);
            setTimeout(() => {
              resolve();
            }, i.duration || 1e3);
          });
          return renderPromise;
        });
      });
      // todo
      let test = Promise.resolve();
      arr.forEach(i => {
        test = test.then(i);
      });
      // 显示具体按钮
      test.then(() => {
        // todo
        that.diaHeight += 30;
        // 按钮或者选择
        if (that.btnType === "startGuide")
          this.showBtn(this.btnContainer.children[0]);
        if (that.btnType === "q1") this.showBtn(this.btnContainer.children[1]);
        if (that.btnType === "q2") this.showOptions("vacationContainer", 2);
        if (that.btnType === "q3") this.showVideo(3);
        if (that.btnType === "q4") this.showBtn(this.btnContainer.children[4]);
        if (that.btnType === "q5") this.showOptions("loversContainer", 5);
        if (that.btnType === "q6") this.showOptions("happinessContainer", 6);
        if (that.btnType === "q7") this.showEnd(7);
      });
    },
    // dia出现
    sizeChange(target) {
      let one = new TWEEN.Tween({
        scale: 0
      })
        .to(
          {
            scale: 1.05
          },
          280
        )
        .onUpdate(function() {
          target.scale.set(this.scale);
        })
        .start();
      let two = new TWEEN.Tween({
        scale: 1.05
      })
        .to(
          {
            scale: 1
          },
          220
        )
        .onUpdate(function() {
          target.scale.set(this.scale);
        });
      one.chain(two);
      // 位置高度记录 91
      let tmpHeight = target._height;
      this.diaHeight += tmpHeight;
      // 超过高度不移动
      if (this.moveHeight <= target.parent.position.y - tmpHeight) {
        if (this.btnType === "q1") {
          tmpHeight += 154;
          this.move(tmpHeight); // dia向上移动
        }
        if (this.btnType === "q2") this.move(tmpHeight);
        if (this.btnType === "q3") {
          tmpHeight += 100;
          this.move(tmpHeight);
        }
        if (this.btnType === "q4") {
          tmpHeight += 200;
          this.move(tmpHeight);
        }
        if (this.btnType === "q5") this.move(tmpHeight);
        if (this.btnType === "q6") {
          tmpHeight += 200;
          this.move(tmpHeight);
        }
        if (this.btnType === "q7") {
          tmpHeight += 100;
          this.move(tmpHeight);
        }
      } else if (this.moveHeight < target.parent.position.y) {
        this.move(target.parent.position.y - this.moveHeight);
      }
    },
    // dia向上移动
    move(height) {
      let that = this;
      this.moveHeight += height;
      // 未选中按钮高度修改
      this.btnContainer.children.forEach(i => {
        i.chosen || i.position.set(0, this.moveHeight);
      });
      // 整体高度
      new TWEEN.Tween(that.interaContainer.position)
        .to(
          {
            y: -this.moveHeight
          },
          300
        )
        .onUpdate(function() {
          // st.canMove || (st.position.y = -rtContainer.position.y)
        })
        .start();
    },
    refresh() {
      // todo window this
      TWEEN.update();
      this.CanvasRenderer.render(this.allContainer);
      window.requestAnimationFrame(this.refresh);
    },
    btn() {
      let that = this;
      // TODO：烟火注释
      // let fireLeft = [],
      //   fireRight = [];
      // for (let i = 0; i < 27; i++) {
      //   fireLeft.push(
      //     PIXI.loader.resources[`${this.baseUrl}pixi/fire.json`].textures[
      //       "yanhua1_000" + (i < 10 ? "0" + i : i) + ".png"
      //     ]
      //   );
      // }
      // for (let i = 0; i < 27; i++) {
      //   fireRight.push(
      //     PIXI.loader.resources[`${this.baseUrl}pixi/fire.json`].textures[
      //       "yanhua2_000" + (i < 10 ? "0" + i : i) + ".png"
      //     ]
      //   );
      // }
      this.btnList.map((item, index) => {
        let n = new PIXI.Container();
        item.map(i => {
          let a = new PIXI.Container();
          // 动态按钮
          // let o = new PIXI.extras.AnimatedSprite(this.Pt);
          // o.loop = !1
          // o.animationSpeed = .4
          let btnSprite = new PIXI.Sprite(
            PIXI.loader.resources[`${this.baseUrl}pixi/btn.json`].textures[
              i.btn
            ]
          );
          // 文字
          // let text = new PIXI.Sprite(PIXI.loader.resources[this.welocation + "animate/btn_text.json"].textures[i.btn]);
          // text.position.set((i.width - text.width) / 2, 17 + (90 - text.height) / 2)
          // TODO：烟花注释
          // let fireLeftAnimated = new PIXI.extras.AnimatedSprite(fireLeft);
          // fireLeftAnimated.loop = false;
          // fireLeftAnimated.position.set(-60, -90);
          // fireLeftAnimated.animationSpeed = 0.5;
          // fireLeftAnimated.visible = false;
          // a.fire1 = fireLeftAnimated;
          // let fireRightAnimated = new PIXI.extras.AnimatedSprite(fireRight);
          // fireRightAnimated.loop = false;
          // fireRightAnimated.position.set(i.width - 80, -90),
          // (fireRightAnimated.animationSpeed = 0.5);
          // fireRightAnimated.visible = false;
          // a.fire2 = fireRightAnimated;
          // TODO：烟火注释
          // a.addChild(btnSprite, fireLeftAnimated, fireRightAnimated);
          a.addChild(btnSprite);
          a.pivot.set(i.width / 2, i.height / 2);
          a.position.set(
            i.position.x + i.width / 2,
            i.position.y + i.height / 2
          );
          a.interactive = !0;
          a.buttonMode = !0;
          a.index = index;
          a.bg = btnSprite;
          a._width = i.width;
          a.state = i.state;
          a.score = i.score;

          a.on("tap", that.tap);

          n.addChild(a);
        });
        n.visible = false;
        this.btnContainer.addChild(n);
      });
    },
    // btn动画
    showBtn(target, cb) {
      target.visible = !0;
      let targetY = -130;
      let a = new TWEEN.Tween({
        y: 0
      })
        .to(
          {
            y: targetY
          },
          240
        )
        .onUpdate(function() {
          target.children.forEach(children => {
            children.position.y = this.y;
          });
        })
        .start();
      let b = new TWEEN.Tween({
        scale: 1
      })
        .to(
          {
            scale: 1.03
          },
          120
        )
        .onUpdate(function() {
          target.children.forEach(children => {
            children.scale.set(this.scale);
          });
        });
      let c = new TWEEN.Tween({
        scale: 1.03
      })
        .to(
          {
            scale: 0.98
          },
          120
        )
        .onUpdate(function() {
          target.children.forEach(children => {
            children.scale.set(this.scale);
          });
        });
      let d = new TWEEN.Tween({
        scale: 0.98
      })
        .to(
          {
            scale: 1
          },
          120
        )
        .onUpdate(function() {
          target.children.forEach(children => {
            children.scale.set(this.scale);
          });
        })
        .onComplete(function() {
          cb && cb();
          console.log("complete");
        });
      a.chain(b);
      b.chain(c);
      c.chain(d);
    },
    // 按钮点击
    tap(e) {
      let that = this;
      let target = e.target || e;
      // 防止重复点击
      if (target.parent.chosen) return;
      // 动画未结束无法点击
      if (target.scale.x != 1) return;
      target.parent.chosen = true;
      target.chosen = true;
      // todo
      // target.parent.tween.stop()
      // 隐藏按钮
      target.parent.children.map(i => {
        new TWEEN.Tween({
          scale: 1
        })
          .to(
            {
              scale: 0
            },
            200
          )
          .onUpdate(function() {
            i.scale.set(this.scale);
          })
          .start();
      });
      // 没隐藏按钮动画
      let one = new TWEEN.Tween({
        scale: 1
      })
        .to(
          {
            scale: 1.2
          },
          200
        )
        .onUpdate(function() {
          target.scale.set(this.scale);
        })
        .onComplete(function() {
          // todo
          // t.bg.play()
        })
        .start();
      let two = new TWEEN.Tween({
        scale: 1.2
      })
        .to(
          {
            scale: 0.9
          },
          300
        )
        .onUpdate(function() {
          target.scale.set(this.scale);
        });
      // TODO：烟火注释
      // .onComplete(function() {
      //   (target.fire1.visible = !0),
      //     target.fire1.play(),
      //     (target.fire2.visible = !0),
      //     target.fire2.play();
      // });
      let three = new TWEEN.Tween(target.position)
        .to(
          {
            x: 750 - target._width + target.pivot.x,
            y: 20 + that.diaHeight - target.parent.position.y - that.HEIGHT
          },
          300
        )
        .onComplete(function() {
          // TODO：烟火注释
          that.diaHeight += target.height - 70 + 30;
          // that.diaHeight += target.height - 160 + 30;
          if (target.state == "q3") {
            that.$refs.bgMusic.pause();
          }
          if (target.state == "q4") {
            that.$refs.bgMusic.play();
            // 关闭音频 todo
            for (let j = 0; j < 4; j++) {
              that.$refs[`audio${j}`] && that.$refs[`audio${j}`].pause();
              that.videoContainer.children[2 * j].visible = true;
              that.videoContainer.children[2 * j + 1].visible = false;
            }
          }
          if (target.state == "end") {
            let result = 0;
            that.btnContainer.children.map(i => {
              i.children.map(item => {
                if (item.chosen && item.score) result += item.score;
              });
            });
            if (result < 17) {
              let score = (1 + Math.random() * 3) | 0;
              that.resultScore = `1${score}`;
              that.resultCity = that.allCity[score - 1];
            } else if (result < 22) {
              let score = (1 + Math.random() * 5) | 0;
              that.resultScore = `2${score}`;
              that.resultCity = that.allCity[score - 1 + 3];
            } else if (result < 27) {
              let score = (1 + Math.random() * 4) | 0;
              that.resultScore = `3${score}`;
              that.resultCity = that.allCity[score - 1 + 8];
            } else if (result < 33) {
              let score = (1 + Math.random() * 3) | 0;
              that.resultScore = `4${score}`;
              that.resultCity = that.allCity[score - 1 + 12];
            } else {
              let score = (1 + Math.random() * 4) | 0;
              that.resultScore = `5${score}`;
              that.resultCity = that.allCity[score - 1 + 15];
            }
            that.showResult = true;
            // 结果图片加载
            setTimeout(() => {
              that.showResultDetail = true;
            }, 1000);
            that.wxShare();
            console.log(that.resultScore);
          } else {
            // 进入问题1
            that.btnType = target.state;
            that.animation(
              that.dialogContainer.children[target.state.slice(1)]
            );
          }
        });
      one.chain(two, three);
    },
    options(type, container) {
      this[container] = new PIXI.Container();
      let textures =
        PIXI.loader.resources[`${this.baseUrl}pixi/${type}.json`].textures;
      Object.keys(textures).map((i, index) => {
        let sprite = new PIXI.Sprite(textures[i]);
        sprite.visible = false;
        if (index == 0) sprite.position.set(52, 0);
        if (index == 1) sprite.position.set(400, 0);
        if (index == 2) sprite.position.set(52, 370);
        if (index == 3) sprite.position.set(400, 370);
        this[container].addChild(sprite);
      });
      this.interaContainer.addChild(this[container]);
      // this.vacationContainer.children[0].interactive = true
      // this.vacationContainer.children[0].on('tap', () => {
      //   this.vacationContainer.addChildAt(tmp, 0)
      //   this.vacationContainer.removeChildAt(1)
      // })
      // this.vacationContainer.addChildAt(this.vacationContainer.children[1], 0)
      // this.vacationContainer.removeChildAt(1)
    },
    // 四个选项
    showOptions(container, btnIndex) {
      let that = this;
      this[container].position.set(0, this.diaHeight + 10);
      this.move(this.diaHeight - this.moveHeight - 150 - 30, 600);
      this.diaHeight += 10;
      this.$nextTick(() => {
        this[container].children.map(i => {
          i.visible = true;
          i.interactive = true;
          i.alpha = 0;
        });
        new TWEEN.Tween({
          alpha: 0
        })
          .to(
            {
              alpha: 1
            },
            300
          )
          .onUpdate(function() {
            that[container].children[0].alpha = this.alpha;
          })
          .start();
        new TWEEN.Tween({
          alpha: 0
        })
          .to(
            {
              alpha: 1
            },
            300
          )
          .onUpdate(function() {
            that[container].children[1].alpha = this.alpha;
          })
          .delay(300)
          .start();
        new TWEEN.Tween({
          alpha: 0
        })
          .to(
            {
              alpha: 1
            },
            300
          )
          .onUpdate(function() {
            that[container].children[2].alpha = this.alpha;
          })
          .delay(600)
          .start();
        new TWEEN.Tween({
          alpha: 0
        })
          .to(
            {
              alpha: 1
            },
            300
          )
          .onUpdate(function() {
            that[container].children[3].alpha = this.alpha;
          })
          .delay(900)
          .onComplete(function() {
            that.diaHeight += 800;
            that.showBtn(that.btnContainer.children[btnIndex], () => {
              that[container].children.map((i, index) => {
                i.on("tap", () =>
                  that.tap(that.btnContainer.children[btnIndex].children[index])
                );
              });
            });
          })
          .start();
      });
    },
    video() {
      this.videoContainer = new PIXI.Container();
      let textures =
        PIXI.loader.resources[`${this.baseUrl}pixi/video.json`].textures;
      Object.keys(textures).map((i, index) => {
        let sprite = new PIXI.Sprite(textures[i]);
        sprite.visible = false;
        if (index == 0 || index == 1) sprite.position.set(52, 0);
        if (index == 2 || index == 3) sprite.position.set(400, 0);
        if (index == 4 || index == 5) sprite.position.set(52, 370);
        if (index == 6 || index == 7) sprite.position.set(400, 370);
        this.videoContainer.addChild(sprite);
      });
      this.interaContainer.addChild(this.videoContainer);
    },
    // 四个选项
    showVideo(btnIndex) {
      let that = this;
      this.videoContainer.position.set(0, this.diaHeight + 10);
      this.move(this.diaHeight - this.moveHeight - 150 - 30, 600);
      this.diaHeight += 10;
      this.$nextTick(() => {
        this.videoContainer.children.map((i, index) => {
          if (!(index % 2)) {
            i.visible = true;
            i.interactive = true;
            i.alpha = 0;
          } else {
            i.interactive = true;
            i.alpha = 1;
          }
        });
        new TWEEN.Tween({
          alpha: 0
        })
          .to(
            {
              alpha: 1
            },
            300
          )
          .onUpdate(function() {
            that.videoContainer.children[0].alpha = this.alpha;
          })
          .start();
        new TWEEN.Tween({
          alpha: 0
        })
          .to(
            {
              alpha: 1
            },
            300
          )
          .onUpdate(function() {
            that.videoContainer.children[2].alpha = this.alpha;
          })
          .delay(300)
          .start();
        new TWEEN.Tween({
          alpha: 0
        })
          .to(
            {
              alpha: 1
            },
            300
          )
          .onUpdate(function() {
            that.videoContainer.children[4].alpha = this.alpha;
          })
          .delay(600)
          .start();
        new TWEEN.Tween({
          alpha: 0
        })
          .to(
            {
              alpha: 1
            },
            300
          )
          .onUpdate(function() {
            that.videoContainer.children[6].alpha = this.alpha;
          })
          .delay(900)
          .onComplete(function() {
            that.diaHeight += 800;
            that.showBtn(that.btnContainer.children[btnIndex]);
            that.videoContainer.children.map((i, index) => {
              if (!(index % 2)) {
                i.on("tap", () => {
                  // 关闭其他音频
                  for (let j = 0; j < 4; j++) {
                    that.$refs[`audio${j}`] && that.$refs[`audio${j}`].pause();
                    if (2 * j != index) {
                      that.videoContainer.children[2 * j].visible = true;
                      that.videoContainer.children[2 * j + 1].visible = false;
                    }
                  }
                  that.$refs[`audio${(index / 2) | 0}`].play();
                  that.$refs[`audio${(index / 2) | 0}`].addEventListener(
                    "ended",
                    () => {
                      that.videoContainer.children[index + 1].visible = false;
                      that.videoContainer.children[index].visible = true;
                    }
                  );
                  that.videoContainer.children[index + 1].visible = true;
                  that.videoContainer.children[index].visible = false;
                });
              } else {
                i.on("tap", () => {
                  that.$refs[`audio${(index / 2) | 0}`].pause();
                  that.videoContainer.children[index - 1].visible = true;
                  that.videoContainer.children[index].visible = false;
                });
              }
            });
          })
          .start();
      });
    },
    end() {
      this.endContainer = new PIXI.Container();
      let textures =
        PIXI.loader.resources[`${this.baseUrl}pixi/end.json`].textures;
      Object.keys(textures).map(i => {
        let sprite = new PIXI.Sprite(textures[i]);
        sprite.visible = false;
        sprite.position.set(35, 0);
        this.endContainer.addChild(sprite);
      });
      this.interaContainer.addChild(this.endContainer);
    },
    showEnd(btnIndex) {
      let that = this;
      this.endContainer.position.set(0, this.diaHeight + 10);
      this.move(this.diaHeight - this.moveHeight - 150 - 30, 600);
      this.diaHeight += 10;
      this.$nextTick(() => {
        this.endContainer.children.map(i => {
          i.visible = true;
          i.interactive = true;
          i.alpha = 0;
        });
        new TWEEN.Tween({
          alpha: 0
        })
          .to(
            {
              alpha: 1
            },
            300
          )
          .onUpdate(function() {
            that.endContainer.children[0].alpha = this.alpha;
          })
          .onComplete(function() {
            that.diaHeight += 460;
            that.showBtn(that.btnContainer.children[btnIndex]);
          })
          .start();
      });
    }
  }
};
</script>

<style lang="less" scoped>
.answer-container {
  // width: 100%;
  .answer {
    width: 100%;
    height: 100vh;
  }
}
</style>
