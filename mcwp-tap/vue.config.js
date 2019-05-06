/**
 * 参考链接：
 * https://github.com/vuejs/vue-cli/issues/1027
 */
let argv = process.argv.slice(2);
let apiEnv = null;
do {
  let next = argv.shift();
  if (next && next.indexOf("--api=") === 0) {
    apiEnv = next.substring("--api=".length);
  }
} while (argv.length > 0);

process.env.VUE_APP_API = apiEnv || "local";

module.exports = {
  devServer: {
    open: true,
    port: 8889,
    inline: true,
    proxy: {
      "/api": {
        target: "https://mcwp.test.zhudb.com/backend",
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          "^/api": ""
        }
      }
    }
  },
  baseUrl: "/tap",
  // chainWebpack: config => {
  //   // console.log(config);
  //   // config.plugins.deleteImg("prefetch");
  // },
  configureWebpack: config => {
    if (process.env.NODE_ENV === "production") {
      config.output.filename = "js/[name].[chunkhash:5].js";
      config.output.chunkFilename = "js/[name].[chunkhash:5].js";
    }
  },
  css: {}
};
