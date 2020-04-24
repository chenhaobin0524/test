# 列配置组件

组件可用于自定义配置表格展示的列。

``注：列配置组件只能用于配置对象生成的表格。``

## 示例

```html
// Main.vue
<template>
    <column-config
        :pageID="name"
        :initColumns="config.table.columns"
        ref="otpColumnConfig"
        @getTableConfigList="getTableConfigList"></column-config>
</template>
<script>
	//...
    	// 显示列配置弹窗
        showColumnConfigDialog() {
            this.$refs['otpColumnConfig'].show(true);
        },
    //...
</script>
```

```javascript
// config.js
table:
    {
        height: 400,
        columns: [
            {
                label: '客户订单号',
                prop: 'customerOrderNo',
                align: 'center'
            },
            {
                label: '仓库',
                prop: 'whName2',
                align: 'center',
                // 这个参数控制该列默认是否显示，为true则默认隐藏
                hiddenColumn: true,
                // columnStick为true时列配置中不可删除
                columnStick: true
            },
            // ....
        ]
        ]
    }
```

## 参数说明

### 组件参数

| 参数        | 参数类型           | 说明               | 备注 |
| :---------- | ------------------ | ------------------ | ---- |
| pageID      | String             | 当前页面的唯一标识 |      |
| initColumns | 表格的列的配置列表 |                    |      |

### 组件事件

| 事件               | 参数类型 | 说明                   | 备注                       |
| :----------------- | -------- | ---------------------- | -------------------------- |
| getTableConfigList | Function | 列配置修改时的回调函数 | 返回设置后的表格列配置数组 |

### 组件可用函数

| 函数 | 入参    | 说明                     | 备注 |
| :--- | ------- | ------------------------ | ---- |
| show | Boolean | 控制列配置弹窗的展示与否 |      |

### Slot说明

| 名称 | 说明 | 备注 |
| ---- | ---- | ---- |
|      |      |      |

### config配置项说明

配置项基本跟之前保持一致，做了一些参数功能性改动。

#### 示例说明

```javascript
	{
        label: '仓库',
        prop: 'whName2',
        align: 'center',
        hiddenColumn: true, // 这个参数控制该列默认是否显示，为true则默认隐藏
        columnStick: true // columnStick为true时列配置中不可删除
    }
```