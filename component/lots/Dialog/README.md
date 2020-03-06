# Dialog
## MDialog
### Prop 简介
```javascript
@params : {
  title: String,
  showDialog: Boolean,
  operation: Array
}

Demo: {
  title: '测试弹窗名',
  showDialog: true,
  operation: {
    {
      label: '取 消',
      Event: 'closePerDialog'
    },
  }
}
```
### Slot 简介
#### content-left

####  content-mid

#### content-right

## mTree
```javascript
@params: {
  key: String,
  defaultProps: Object,
  checkedList: Array
}

Demo: {
  key: 'tree对应的key',
  defaultProps: {
    children: 'children',
    label: 'name'
  },
  checkedList: [] // 被选中的数据
}
```
### Methods
```javascript
 /**
 * @api 动态加载树
 * @apiName loadNode
 * @apiGroup tree
 * @apiParam (params) {Array} node 树数据()
 * @apiParam (params) {Function} resolve 返回值(用于动态加载子节点)
 * @apiSuccessExample Success-Response:
 *  {
 *  }
 */

/**
 * @api 搜索子节点
 * @apiName filterTree
 * @apiGroup tree
 * @apiParam (params) {String} str 关键字(用于搜索树节点)
 * @apiSuccessExample Success-Response:
 *  {
 *  }
 */
  
/**
 * @api 获取被勾选的树节点
 * @apiName getCheckedKeys
 * @apiGroup tree
 * @apiSuccessExample Success-Response:
 *  {
 *  }
 */

 /**
 * @api 设置树节点勾选
 * @apiName setCheckedKeys
 * @apiGroup tree
 * @apiParam (params) {Array} val key(通过数据的key设置勾选状态)
 * @apiSuccessExample Success-Response:
 *  {
 *  }
 */

/**
 * @api 搜索tree
 * @apiName filterNode
 * @apiGroup tree
 * @apiParam (params) {String} value 关键字(搜索子节点)
 * @apiParam (params) {Array} Data 树数据()
 * @apiSuccessExample Success-Response:
 *  {
 *  }
 */

/**
 * @api 处理勾选
 * @apiName handleCheckChange
 * @apiGroup tree
 * @apiParam (params) {Object} data 被选中的节点数据(当前选中的节点数据)
 * @apiParam (params) {Boolean} checked 判断选中状态(用于判断当前节点是否被选中)
 * @apiSuccessExample Success-Response:
 *  {
 *  }
 */

/**
 * @api 处理展开
 * @apiName handleExpand
 * @apiGroup tree
 * @apiParam (params) {Object} data 该节点所对应的对象
 * @apiParam (params) {Boolean} node 节点对应的 Node
 * @apiParam (params) {Object} tree 节点组件本身
 * @apiSuccessExample Success-Response:
 *  {
 *  }
 */

/**
 * @api 子节点渲染的html
 * @apiName treeContent
 * @apiGroup tree
 * @apiParam (params) {String} str 关键字(用于搜索树节点)
 * @apiSuccessExample Success-Response:
 *  {
 *  }
 */
```

## Organization
### Methods
```javascript
 /**
 * @api 搜索
 * @apiName search
 * @apiGroup Dialog
 * @apiParam (params) {String} str 关键字(用于搜索树节点)
 * @apiSuccessExample Success-Response:
 *  {
 *  }
 */

 /**
 * @api 关闭Dialog
 * @apiName hideDialog
 * @apiGroup Dialog
 * @apiSuccessExample Success-Response:
 *  {
 *  }
 */

/**
 * @api 关闭Dialog
 * @apiName closePerDialog
 * @apiGroup Dialog
 * @apiSuccessExample Success-Response:
 *  {
 *  }
 */

/**
 * @api 确认Dialog
 * @apiName confirmPerDialog
 * @apiGroup Dialog
 * @apiSuccessExample Success-Response:
 *  {
 *  }
 */

/**
 * @api 清除单个已选项
 * @apiName clearOne
 * @apiGroup Dialog
 * @apiSuccessExample Success-Response:
 *  {
 *  }
 */

/**
 * @api 清除所有已选项
 * @apiName clearAll
 * @apiGroup Dialog
 * @apiSuccessExample Success-Response:
 *  {
 *  }
 */
```