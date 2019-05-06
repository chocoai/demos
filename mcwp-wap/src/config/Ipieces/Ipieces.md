### 说明
配置为3层对象，最外层为模块，第二层为字段，第三层为具体配置

### 注意
目前H5和web端配置需要手动同步，web端或者H5修改后要手动同步，以后优化

### 配置具体说明

Props               | Default Value  | Description
------------------- | -------------- | ------------------------
`position`          |                | 排序权重
`name`              |                | 字段英文
`detailName`        |                | 展示字段名（可能和编辑字段不同）
`detailType`        |                | 渲染模式，默认不填，目前有wether（是否渲染）verify（是否核实）
`unit`              |                | 单位
`detailWidth`       |                | 详情大小，一行为24，6为4分之一行，12为2分之一行
`detailVerifyRet`   |                | 详情是否在核实的字段
`detailVerify`      |                | 详情是否在核实的结果
`h5Width`           |                | H5详情大小，如果不配置则采用`detailWidth`，12为一行，6为2分之一行，12为一行
`message`           |                | 错误信息，具体见Validate.warnInfo
`validator`         |                | 校验方式
`type`              |                | 表单类型，目前有input,select,multiInput,multiSelect
`width`             |                | 编辑大小，一行为24，6为4分之一行，12为2分之一行
`edit`              | `false`        | 编辑阶段是否能编辑（和配置的可编辑区分）  false || true || { 6: false,7: false,8: true}
`switch`            | `false`        | 多个条件判断编辑，如果为`type`，代表是否编辑与类型有关
`dict`              |                | 字典值
`fieldChName`       |                | 来自服务端，字段中文
`fieldEnName`       |                | 来自服务端，字段英文
`formEnName`        |                | 来自服务端，字段所属模块英文
`isrequire`         |                | 来自服务端，是否必填
`isshow`            |                | 来自服务端，是否显示

```
// 候选属性
onchange                        // 事件
```
