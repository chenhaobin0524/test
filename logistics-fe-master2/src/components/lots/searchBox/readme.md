# 顶部查询组件
## 示例
``` html
// Main.vue
<template>
    <search-box ref="searchBox"
    :search-key="config.name"
    :fields="config.searchFields"
    @search-change="searchChange"></search-box>
</template>
```
```javascript
// config.js
{
    name: 'xxxxxx',
    searchFields: [
        {
            name: '客户订单号',
            value: 'customerOrderNo',
            type: 'input',
            isFixed: true,
            isFussy: true,
            span: 6
        },
        {
            name: '创建时间',
            value: 'searchBeginTime',
            type: 'time',
            isFixed: true,
            span: 6
        },
        {
            name: '订单状态',
            value: 'orderStatus',
            isFixed: true,
            type: 'select',
            optionNum: 'ORDER_STATUS',
            filterable: true,
            multiple: true,
            options: [],
            span: 4
        },
        {
            name: '订单号',
            value: 'orderNo',
            type: 'input'
        },
        {
            name: '订单类型',
            value: 'orderType',
            type: 'select',
            multiple: true,
            filterable: true,
            optionNum: 'ORDER_TYPE',
            options: []
        },
        {
            name: '项目分类',
            value: 'projectClassify',
            type: 'select',
            optionNum: 'PROJECT_CLASSIFY',
            options: []
        },
        {
            name: '审核状态',
            value: 'excuteStatus',
            type: 'select',
            filterable: true,
            multiple: true,
            optionNum: 'EXCUTE_STATUS',
            options: []
        },
        {
            name: '客户',
            value: 'customerName',
            type: 'advance',
            isFixed: true,
            span: 4,
            advanceConfig: [
                { 'prop': 'ebcuNameCn', 'value': '客户名称' },
                { 'prop': 'pmCode', 'value': '客户编码' }
            ],
            tableConfig: [
                { 'prop': 'pmCode', 'value': '客户编码' },
                { 'prop': 'ebcuNameCn', 'value': '客户名称' }
            ],
            advanceUrl: '/ebCustomer/searchByEbCustomer',
            cbParams: ['pmCode#customerCode', 'ebcuNameCn#customerName'],
            advanceCode: 'advanceCode'
        },
        {
            name: '仓库',
            value: 'whName',
            advanceConfig: [
                { 'prop': 'cdwhName', 'value': '仓库名称' },
                { 'prop': 'whCode', 'value': '仓库编码' }
            ],
            tableConfig: [
                { 'prop': 'whCode', 'value': '仓库编码' },
                { 'prop': 'cdwhName', 'value': '仓库名称' }
            ],
            advanceUrl: 'cdWarehouse/search?cdwhIsStop=0',
            cbParams: [
                'whCode', 'cdwhName#whName'
            ],
            type: 'advance'
        }
    ]
}
```
## 参数说明
### 组件参数
| 参数      | 参数类型 | 说明            | 备注     |
| :-------- | -------- | --------------- | -------- |
| search-key | String   | 当前页面搜索框的唯一标识 | |
| fields    | Object   | 查询对象列表            | |
### 组件事件
| 事件      | 参数类型 | 说明            | 备注     |
| :-------- | -------- | --------------- | -------- |
| search-change | Function   | 点击查询按钮的回调函数 | function(data){...} |
### 组件可用函数
| 函数      | 入参 | 说明            | 备注     |
| :-------- | -------- | --------------- | -------- |
| setQueryParams | Object   | 设置默认查询条件 | |
| submitSearch    | isExport   | 手动触发查询， isExport为true则返回查询参数           | |
### Slot说明
| 名称   | 说明         | 备注 |
| ------ | ------------ | ---- |
| table-module-btn | 右侧导入导出，列配置区域     |      |
### config配置项说明
配置项基本跟之前保持一致，做了一些参数功能性改动。
例如：
- 默认查询配置项和高级查询项不分成两个数组进行设置，改为合并成一个数组，通过每一个配置项中的**isFixed**属性来区分，该属性为true则为默认查询项，为false则表示只在高级搜索中展示。
- 高级按钮不再通过独立属性进行判断，改成根据**isFixed**属性进行计算，如果查询配置项中每一项**isFixed**的值都为true则表示不需要高级查询按钮，反之显示高级查询按钮。

#### 示例说明
``` javascript
	{
        name: '客户订单号', 
        value: 'customerOrderNo',
        type: 'input',
        isFixed: true, //（可选）表示为默认查询项，为false可不写
        isFussy: true, //（可选）表示该字段会返回是否模糊字段，可根据该字段去实现接口模糊查询，返回属性格式为：[属性名]Fussy，如上为customerOrderNoFussy
        span: 6 //（可选）当isFixed为true时生效，表示宽度比例
    },
```
