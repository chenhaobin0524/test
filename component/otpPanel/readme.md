# changelog
- 【添加initTableLabels属性】config文件的**table**对象中添加**initTableLabels**属性，用于初始化表格第一次展示的列，不设属性则默认展示全部列。格式 —— initTableLabels : 列名1,[列名2...]
```json
{
    "table": {
        "initTableLabels": "客户订单号,任务号,客户,平台,仓库,商品编码,型号,商品状态,订单大类,计划数量,变更数量,变更时间"
        ...
    }
    ...
}
```