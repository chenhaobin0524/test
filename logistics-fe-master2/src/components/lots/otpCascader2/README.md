# 四级地址级联优化（支持单选和任意选，暂不支持多选）
```html
<otpAllAddressSelect
    ref="addressSelect"
    :placeholder="placeholder"
    :disabled="disabled"
    :clearable="true"
    v-model="codeArr"
    :minLayers="item.minLayers"
    :basicProps="config"
></otpAllAddressSelect>
```
## 参数
### v-model 说明
跟一般的input一样，绑定组件的返回值，返回值为code数组
### basicProps 说明
现在基本就是传checkStrictly，来实现任意选，其他参数暂时没测
### minLayers 说明（checkStrictly为true时为从当前值以上任意选，checkStrictly不存在时当前值为可选到几级）
控制到哪一级可以选择，从1算起

## 函数说明
### addressFormat —— 提供给外部调用的解析地址code的函数，入参：['code1', 'code2',...], 出参：['name1','name2',...]
调用方式：
1. this.$refs.addressSelect.addressFormat(codeArr);
2. 在元素上监听@getAddress事件,回调函数入参为地址名称数组

返回值示例：["山西省", "长治市", "郊区", "故县街道"]