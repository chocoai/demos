# mcwp-web


## mcwp-admin: (助贷宝调查管理平台)
>  本工程主要基于react + redux + immutable + less + ES6/7 + webpack + fetch + react-router + antd(1.x)实现的SPA助贷宝调查管理平台。

>  使用技术： react + redux + immutable + less + ES6/7 + webpack + fetch + react-router + antd(1.x)

>  项目说明： 本工程主要基于react + redux + immutable + less + ES6/7 + webpack + fetch + react-router + antd(1.x)实现的SPA助贷宝调查管理平台。

## mcwp-html: (助贷宝html5页面)
>  本工程主要基于zepto + webpack + gulp搭建纯静态页面型前端工程解决方案模板。

>  使用技术： zepto + webpack + gulp

>  项目说明： 本工程主要基于zepto + webpack + gulp搭建纯静态页面型前端工程解决方案模板。

# mcwp-website: (助贷宝html5官网)
>  本工程主要基于 jquery + gulp 搭建纯静态页面型前端工程解决方案模板。

>  使用技术： jquery + gulp

>  项目说明： 本工程主要基于 jquery + gulp 搭建纯静态页面型前端工程解决方案模板。

## mcwp-wap: (基于Vue助贷宝移动页面)
>  本工程主要基于vue2 + vuex + vue-router + webpack + ES6/7 + fetch + less + flex实现的SPA助贷宝移动页面。

>  使用技术： vue2 + vuex + vue-router + webpack + ES6/7 + fetch + less + flex

>  项目说明： 本工程主要基于vue2 + vuex + vue-router + webpack + ES6/7 + fetch + less + flex实现的SPA助贷宝移动页面。

### 下载

```
# git clone

git clone git@121.43.184.183:zdb/mcwp-web.git

cd mcwp-web
```

### 团队分享

#### 对象对比方法，常用于表单编辑时，只提交修改过的表单项

```javascript
  /**
  * @description 判断变量是不是引用类型
  * @param {*} variable - 待判定的变量。接受任意类型
  * @returns {Boolean} 如果返回true则表示是引用类型，反之则不是
  */
  function variableIsReference(variable) {
    return (
      variable !== null &&
      variable !== undefined &&
      typeof variable !== "string" &&
      typeof variable !== "number" &&
      typeof variable !== "boolean" &&
      typeof variable !== "symbol"
    );
  }

  /**
  * @description 两个对象字面量比较  注意，如果obj1 = {a:"123",b:456}, ob2 = {b:456,a:"123"};本方法也会判定他们完全相等
  * @param {Object} o1 - 必填。要比较的对象
  * @param {Object} o2 - 必填。被比较的对象
  * @param {Array<String>} keys - 选填。仅检查指定的keys
  * @returns {Object} 返回的结果 包含两个属性
  *          {Boolean} isAllSame 表明是否完全相同
  *          {Object} diffObj 被检查出来不相同的项
  */
  function diff(o1, o2, keys = null, __isRecursion__ = false) {
    let isAllSame = true,
      diffObj = {};
    let list = Object.entries(o1);
    let list2 = Object.entries(o2);
    if (Array.isArray(keys) && keys.length > 0) {
      list = list.filter(([k, v]) => keys.includes(k));
      list2 = list2.filter(([k, v]) => keys.includes(k));
    }
    if (__isRecursion__ && list.length !== list2.length) {
      isAllSame = false;
      //递归模式下，上一级只读取isAllSame
      //参见下面的那句 const { isAllSame: _isAllSame } = diff(v1, v2);
      return {
        isAllSame,
      };
    }
    // 递归模式下，有一项不同则终止循环，所以有every
    if (__isRecursion__) {
      list.every(__fetchDiff__);
    } else {
      list.forEach(__fetchDiff__);
    }

    function __fetchDiff__([key, v1]) {
      const v2 = o2[key];
      let isSame = v1 == v2;
      //区分其是基本类型还是引用类型,如果是引用类型还需要进一步判断（递归本方法）
      // v2也要校验，否则v1为引用类型 v2为基本类型则无需diff就可判定isSame一定为false
      const isReference = variableIsReference(v1) && variableIsReference(v2);
      if (isReference) {
        // 递归的时候要传入第四参数表明是递归
        const { isAllSame: _isAllSame } = diff(v1, v2, null, true);
        isSame = _isAllSame;
      }

      if (!isSame) {
        isAllSame = false;
        diffObj[key] = v1;
      }
      return v1 == v2;
    }
    return {
      isAllSame,
      diffObj,
    };
  }

  // 使用方法
  const obj1 = {
    a: 123,
    c: {
      d: 2,
      e: {
        f: 2
      }
    },
    b: 456,
    h: 10,
    g: {
      a: 2
    }
  };
  const ob2 = {
    b: 456, 
    a: "123",
    c: {
      d: 2,
      e: {
        f: 2
      }
    },
    g: {
      a: 1
    }
  };
  const res = diff(obj1, ob2);
  console.log(res);
```
