<template>
  <div>
    <canvas id="qr-canvas"></canvas>
    <p class="qr-describe">请用手机微信扫描二维码</p>
  </div>
</template>

<script>
import QRCode from "qrcode";

export default {
  props: ["qrUrl"],
  mounted() {
    QRCode.toCanvas(document.getElementById("qr-canvas"), this.qrUrl, function(
      error
    ) {
      if (error) console.error(error);
      console.log("success!");
    });
  }
};
</script>

<style lang="less" scoped>
.qr-describe {
  font-size: 0.5rem;
}
</style>
