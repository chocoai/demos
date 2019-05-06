# mcwp-tap
vue + vuex + vant

## 特性

- :gem: **优雅美观**：基于 Vant 体系精心设计
- :rocket: **最新技术栈**：使用 Vue/Vuex/Vant 等前端前沿技术开发
- :art: **主题**：可配置的主题满足多样化的业务需求

## 使用

```bash
$ git clone git@qdjr.git.zhudb.com:zdb/mcwp-web.git
$ cd mcwp-tap
$ npm install
$ npm start         # 访问 http://localhost:8889
```

## 功能

## 参考

[vue-cli 文档](https://github.com/vuejs/vue-cli/tree/dev/docs)

[vue-cli 中文文档](https://github.com/vuejs/vue-docs-zh-cn)

[vue-router 中文文档](https://router.vuejs.org/zh-cn/index.html)

## BUG

[npm run serve error: You must pass the `"decoratorsLegacy": true` option to @babel/preset-stage-2](https://github.com/vuejs/vue-cli/issues/1162)

Guys while this issue is not fixed, simply use this temporary solution:
Specify the old version of @babel/preset-stage-2 in devDependencies:

```javascript
"devDependencies": {
  "@babel/preset-stage-2": "7.0.0-beta.44",
  ...
}
```
