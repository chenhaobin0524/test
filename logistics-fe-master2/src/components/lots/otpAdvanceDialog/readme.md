# 基础数据弹窗2.0
### 参数说明
```javascript
//config.js
table:
    {
        height: 400,
        columns: [
            // *号标注为必填项
            {
                span: 6,
                label: '仓库',
                prop: 'whCodeName',
                type: 'advance',    // *控件类型
                advanceLabel: '仓库',   // 弹窗标题，如果没有，则使用name或label属性
                advanceConfig: [    // 下拉框的选项列表
                    { prop: 'cdwhName', value: '仓库名称' },
                    { prop: 'whCode', value: '仓库代码' }
                ],
                tableConfig: [         // *展示的表格列列表
                    { prop: 'cdwhName', value: '仓库名称' },
                    { prop: 'whCode', value: '仓库代码' }
                ],
                // 请求地址前缀（不填则默认为api-mdm）
                prefix: '/api-mdm/',
                // 请求地址
                advanceUrl: '/cdWarehouse/searchByCdWarehouse', // *请求地址
                // 需要选中返回的属性，回调通过对象返回下面指定的属性
                cbParams: ['whCode', 'cdwhName#whCodeName'],     // *返回的参数，可以用#来更改返回的对象的属性名称
                advanceCascade: 'sourceSystem#source_system', // 级联参数 —— 格式：[级联属性]:[查询属性],[级联属性]:[查询属性]....(选填)
            },
        ]
        ]
    }
```

### 使用方式
```html
<!-- html -->
<advance-dialog ref="advanceDialog" @confirm="detaliSearchSure" disabledDbClick rejectClose></advance-dialog>

// disabledDbClick  阻止双击返回数据

// rejectClose 阻止点击确认按钮关闭dialog，并且确认按钮disabled为true，需要关闭dialog
// 请使用 this.$refs.advanceDialog.dialogVisible = false; dialog关闭 确认按钮 disabled 自动为false
// 手动切换确认按钮 disabled 请使用 this.$refs.advanceDialog.disabledCancel = false;
                    

// js
import advanceDialog from '@/components/lots/otpAdvanceDialog';

// 唤出弹窗
this.$refs.advanceDialog.show(true, current, advanceCascade);
```



### 回调函数说明
#### confirm
返回参数：data ———— 返回cbParams声明的属性对象  
