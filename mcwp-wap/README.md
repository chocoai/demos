# mcwp-wap

## 前言
>  本工程主要基于vue + vuex + less + ES6/7 + webpack + fetch + vue-router + vux + fastclick + flex.css + store + weixin-js-sdk 实现的SPA助贷宝移动网页。

>  使用技术： vue + vuex + less + ES6/7 + webpack + fetch + vue-router + vux + fastclick + flex.css + store + weixin-js-sdk

>  项目说明： 本工程主要基于vue + vuex + less + ES6/7 + webpack + fetch + vue-router + vux + fastclick + flex.css + store + weixin-js-sdk 实现的SPA助贷宝移动网页。

> 利用EsLint进行代码规范校验


### 下载

```
# git clone

git clone git@121.43.184.183:zdb/mcwp-web.git

cd mcwp-web
cd mcwp-wap
```

### 安装
```bush
// 安装前请先确保全局环境下已安装node、npm和yarn，注意：由于涉及大量的 ES6/7 等新属性，nodejs 必须是 6.0 以上版本

// 安装成功后,正常编译模式、热替换编译模式需要再安装依赖，如果之前有用npm安装过，请先删掉node_modules，其他模式直接执行相关命令即可
yarn install
```

### 运行
```bush
yarn run dev （开发编译模式，热加载）

yarn run test （发布测试版本，对代码进行混淆压缩，提取公共代码，分离css文件）

yarn run advance （发布预发版本，对代码进行混淆压缩，提取公共代码，分离css文件）

yarn run dist （发布生产版本，对代码进行混淆压缩，提取公共代码，分离css文件）

npm run test/advance/dist --report（build for production and view the bundle analyzer report）

npm run unit（run unit tests）

npm run e2e（run e2e tests）

npm test（run all tests）
```

