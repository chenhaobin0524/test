### 参数说明
```javascript
//config.js
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

### 使用方式
```html
<!-- html -->
<otp-column-config ref="otpColumnConfig" :initColumns="config.table.columns" @getTableConfigList="getTableConfigList"></otp-column-config>

// js
import otpColumnConfig from '@/components/lots/otpColumnConfig';

// 唤出列配置弹框
this.$refs['otpColumnConfig'].show(true);
```


### 参数说明
#### initColumns
组件prop参数： initColumns ———— 页面的table的列配置对象

### 回调函数说明
#### getTableConfigList
返回参数：columns ———— 修改之后的列数组（返回新数组），页面可以通过使用新数组的hiddenColumn参数来控制列的显示与否


### TODO
- 可以配置固定项
