<template>
  <div :class="['gene-qrcode', {'lock-height': showImg}]">
    <div :class="['gene-whitebg' ,{'blur-back': showImg}]">
      <ul class="gene-ul">
        <li v-for="item in qrcodeList" :key="item.prdUrl" class="gene-li" @click="clickImg(item.prdUrl)">
          <span class="gene-span">{{item.productName}}</span>
          <img :src="'data:image/png;base64,'+item.prdUrl" class="gene-img"/>
          <div class="gene-div"></div>
        </li>
      </ul>
    </div>
    <big-img v-if="showImg" @clickit="viewImg" :prdurl="prdUrl"></big-img>
  </div>
</template>

<script>
import { getGenQRCodes } from "../../service/home.js";
import { getUrlkey } from "@/utils";
import { doLoading } from "../../utils/index.js";
import BigImg from "./bigImg.vue";
export default {
  name: "geneQRcode",
  data() {
    return {
      qrcodeList: [],
      code: getUrlkey(window.location.search)["merchantCode"],
      showImg: false,
      prdUrl: null
    };
  },
  mounted() {
    this.getQRcodeList();
  },
  methods: {
    async getQRcodeList() {
      doLoading(this, true);
      const { code } = this;
      let res = await getGenQRCodes({ code: code, size: 10 });
      this.qrcodeList = res.data;
      doLoading(this, false);
    },
    clickImg(e) {
      this.showImg = true;
      this.prdUrl = e;
    },
    viewImg() {
      this.showImg = false;
    }
  },
  components: {
    "big-img": BigImg
  }
};
</script>

<style lang="less" scoped>
.gene-qrcode {
  width: 10.8rem;
  margin: 0;
  background: #fafafa;
  height: 100vh;
  position: relative;
  .gene-whitebg {
    position: relative;
    top: 0.32rem;
    background-color: #fff;
    .gene-ul {
      .gene-li {
        padding: 0.2rem 0 0 0.48rem;
        &:last-child {
          .gene-div {
            background-color: #fff;
          }
        }
        .gene-span {
          font-size: 0.44rem;
          color: #333;
          width: 100%;
          display: inline-block;
          text-align: left;
        }
        .gene-img {
          display: block;
          margin: 0.4rem 0 0.4rem;
          width: 2.25rem;
          height: 2.25rem;
          // pointer-events: auto;
        }
        .gene-div {
          background-color: #eee;
          height: 0.02rem;
          width: 100%;
        }
      }
    }
  }
  .gene-nodata-whitebg {
    position: relative;
    height: 4rem;
    background-color: #fff;
    width: 100%;
    top: 0.32rem;
    display: flex;
    justify-content: center;
    align-items: center;
    .gene-span {
      font-size: 0.8rem;
      font-weight: 600;
      text-align: center;
    }
  }
  .blur-back {
    filter: blur(0.1rem);
  }
}
.lock-height {
  height: 100%;
  overflow: hidden;
}
</style>
