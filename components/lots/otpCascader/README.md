# 四级
## 参数
```javascript
prop
  address: Array - 地址code,
  config: {
    multiple: Boolean - 是否多选,
    checkStrictly: Boolean - 任意选级
  }
```

## Demo
```template
<Cascader :config="cascaderConfig" :address.sync="address"></Cascader>
```