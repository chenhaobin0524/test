



# 开发者页面

开发者页面主要提供一些常用的公共组件的示例。



## 按钮权限

demo地址：

[http://lsit.midea.com/developer.html#/btn-permission](http://lsit.midea.com/developer.html#/btn-permission)

### 使用方法

在权限系统中，在需要配置按钮权限的页面下，增加"元素"子资源，协商资源 id。

id为8位数字，每2位数字代表一个资源的序号，编码规则如下：

> 00（一级菜单/页面序号） 00（二级菜单/页面序号） 00（三级页面序号） 00 （按钮序号）

如果没有当前菜单，则为00。



在子项目中添加如下的代码：

**main.js**

```javascript
import '../../utils/btnPermission';
```

**页面中，父元素添加 v-has 属性，并绑定约定好的 resourceId。**

```html
<el-tooltip content="新增" v-has="'13000003'">
     <el-button type='primary' size="mini" icon='el-icon-plus' @click="addData"></el-button>
</el-tooltip>
```

**导入导出组件按钮**
```html
<mExport resourceId='13000003'><mExport>
```

**mPanel3组件操作列按钮**
```json
"action": [{
     "type": "text",
     "label": "修改",
     "size": "small",
     "event": "amend",
     "resourceId": "05010503"
}]

```
