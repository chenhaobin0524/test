mPanel3说明文档

示例可参考开发者页面—>常用面板—>常用面板3

##Attributes

| 参数                | 说明                                                         | 类型    | 可选值 | 默认值 |
| ------------------- | ------------------------------------------------------------ | ------- | ------ | ------ |
| config              | 配置文件，详情见下方[config]()                               | Object  |        |        |
| totalData           | 表格显示的数据                                               | Array   |        |        |
| pageTotal           | 分页器显示的总页数                                           | Number  |        |        |
| loading             | 表格的加载动画效果                                           | Boolean |        |        |
| pageID              | 当前页面的唯一标识符（即将废弃）                             | String  |        |        |
| searchId            | 配置查询条件的唯一标识符                                     | String  |        |        |
| optionNum           | 外层查询条件的数据字典key，用英文逗号（,）拼接，按照查询条件的顺序排列 | String  |        |        |
| verification        | 表格校验规则，具体用法可参考[element文档](https://element.eleme.cn/#/zh-CN/component/table) | Object  |        |        |
| searchTotalTitle    | 高级按钮内层查询条件配置文件，详情见下方[searchTotalTitle]() | Array   |        |        |
| pickerOptionsCustom | 查询条件中时间控件属性，可以自定义左侧时间快捷选项，具体用法参考[element文档](https://element.eleme.cn/#/zh-CN/component/date-picker)带快捷键的情况 | Array   |        |        |

config相关配置

| key              | 说明                                  | 类型    | 默认值                           |
| ---------------- | ------------------------------------- | ------- | -------------------------------- |
| popPrefix        | 数据字典自定义查询地址                | String  | '/api-mdm/dictionaryDetail/dict' |
| advancePrefix    | 高级查询自定义代理                    | String  | '/api-mdm'                       |
| longPrefix       | 远程搜索自定义地址                    | String  | '/api-gwms/es/comboBox'          |
| configurationUrl | 配置列自定义代理                      | String  | '/api-auth'                      |
| configuration    | 是否隐藏配置列按钮                    | Boolean | false                            |
| searchList       | 查询部分相关配置[config.searchList]() | Object  |                                  |
| table            | 表格部分相关配置[config.table]()      | Object  |                                  |

searchTotalTitle相关配置

| key       | 说明            | 类型   |
| --------- | --------------- | ------ |
| optionNum | 数据字典key拼接 | String |

备注: 剩余的属性与[searchTxt]() 表相同。

###config.searchList

查询部分相关配置

| key         | 说明                                  | 类型    | 可选值 | 默认值 |
| ----------- | ------------------------------------- | ------- | ------ | ------ |
| searchTxt   | 各个查询框的配置，详情见下表searchTxt | Array   |        |        |
| unfoldState | 是否有展开项                          | Boolean |        | false  |
| advancedBtn | 是否有高级按钮                        | Boolean |        | false  |

searchTxt各个查询框的配置

| key                    | 说明                                                         | 类型    | 可选值                                                       | 默认值                           |
| ---------------------- | ------------------------------------------------------------ | ------- | ------------------------------------------------------------ | -------------------------------- |
| name                   | 查询项的label                                                | String  |                                                              |                                  |
| value                  | 绑定值                                                       | String  |                                                              |                                  |
| type                   | 查询项的类型                                                 | String  | "input"(输入框),"advance"(弹窗高级查询),"autocomplete"(远程搜索),"select"(数据字典选框),"cascader"(级联),"time"(时间选择器),"custom"(自定义列) | "input"                          |
| unfold                 | 查询项是否在最外层中显示                                     | Boolean |                                                              | false                            |
| multiple               | 是否支持多选，在type为autocomplete或select时生效             | Boolean |                                                              | false                            |
| span                   | 用于设置查询项宽度，所有外层查询项span之和不可超过20         | Number  |                                                              | 20                               |
| advanceConfig          | type="advance"时有效。用于设置高级查询弹框表格中的表头和对应的字段名，示例：[{"prop":"whCode", "value":"仓库编码"},{"prop":"cdwhName","value":"仓库名称" }] | Array   |                                                              |                                  |
| advanceUrl             | type="advance"时有效。高级查询地址                           | String  |                                                              |                                  |
| advanceCode            | type="advance"时有效。返回给最终查询的字段名                 | String  |                                                              |                                  |
| advancePrefix          | type="advance"时有效。自定义代理                             | String  |                                                              | "/api-mdm"                       |
| advanceCascade         | type="advance"时有效。级联参数 —— 格式：[级联属性]:[查询属性],[级联属性]:[查询属性].... | String  |                                                              |                                  |
| advanceCascadeMastFill | type="advance"时有效。级联参数——上一级必填的情况             | Boolean |                                                              |                                  |
| advanceCascadeMessage  | type="advance"时有效。级联参数——必填时自定义文字提示         | String  |                                                              |                                  |
| advanceCascadeAlias    | type="advance"时有效。级联参数——给后台的字段与一级查询中字段不一致的情况——格式："别名,别名,...." | String  |                                                              |                                  |
| advanceCascadeClear    | type="advance"时有效。级联参数——用于增加弹出框级联时需要删除的值——格式："删除项,删除项,...." | String  |                                                              |                                  |
| passValue              | 配置传给查询接口的key，通常用于多选时区分原字段名与多选拼接的字段名 | String  |                                                              |                                  |
| relevanceOne           | type="autocomplete"时有效。一级级联参数                      | String  |                                                              |                                  |
| relevanceTwo           | type="autocomplete"时有效。二级级联参数                      | String  |                                                              |                                  |
| relevanceClear         | type="autocomplete"时有效。级联参数——用于增加弹出框级联时需要删除的值——格式："删除项,删除项,...." | String  |                                                              |                                  |
| tableName              | type="autocomplete"时有效。传参对应的表名                    | String  |                                                              |                                  |
| ganged                 | type="autocomplete"时，远程搜索时传给后台的参数名            | String  |                                                              |                                  |
| checkStrictly          | type="cascader"时有效。是否严格的遵守父子节点不互相关联      | Boolean |                                                              | false                            |
| propValue              | type="cascader"时有效。指定选项的值为选项对象的某个属性值    | String  |                                                              |                                  |
| propLabel              | type="cascader"时有效。指定选项标签为选项对象的某个属性值    | String  |                                                              |                                  |
| showAllLevels          | type="cascader"时有效。输入框中是否显示选中值的完整路径      | Boolean |                                                              | true                             |
| filterable             | type="cascader"时有效。是否可搜索选项                        | Boolean |                                                              |                                  |
| children               | type="cascader"时有效。指定选项的子选项为选项对象的某个属性值 | String  |                                                              |                                  |
| options                | 下拉框类的查询项的可选项数据源，详情见[element文档](https://element.eleme.cn/#/zh-CN/component/cascader) | Array   |                                                              |                                  |
| format                 | type="time"时有效。时间格式                                  | String  |                                                              | 'yyyy-MM-dd HH:mm:ss'            |
| pickerOptionsCustom    | 自定义左侧时间快捷选项，配置方法见[element文档](https://element.eleme.cn/#/zh-CN/component/datetime-picker) | Array   |                                                              | 【最近一周，最近一月，最近三月】 |
| timeType               | 显示类型                                                     | String  | year/month/date/week/ datetime/datetimerange/daterange       | datetimerange                    |
| startPlaceholder       | 自定义时间控件的开始时间的文字说明                           | String  |                                                              |                                  |
| endPlaceholder         | 自定义时间控件的结束时间的文字说明                           | String  |                                                              |                                  |
| timeNum                | 默认时间范围，表示最近timeNum天                              | Number  |                                                              |                                  |

备注：当查询项为时间控件且"value": "searchTime"时，调查询接口是会自动将searchTime字段解析为startTime和endTime。

### config.table

表格部分相关配置

| key                 | 说明                                 | 类型    | 可选值 | 默认值 |
| ------------------- | ------------------------------------ | ------- | ------ | ------ |
| height              | 设置表格的高                         | Number  |        |        |
| columns             | 各个列表项的配置，具体见下表columns  | Array   |        |        |
| action              | 操作按钮配置，具体见下表actionButten | Array   |        |        |
| leftOperation       | 是否显示右侧操作列                   | Boolean |        | false  |
| fixedSeletionColumn | 是否固定多选列                       | Boolean |        | true   |
| selectBtn           | 是否实现多选                         | Boolean |        | false  |
| leftWidth           | 自定义操作列列宽                     | Number  |        |        |
| hasMoreAction       | 操作列中的更多按钮                   | Boolean |        | false  |
| MoreAction          | 更多按钮的配置，与action配置方法一致 | Array   |        |        |

columns相关配置

| key          | 说明                                          | 类型            | 可选值                                                       | 默认值 |
| ------------ | --------------------------------------------- | --------------- | ------------------------------------------------------------ | ------ |
| label        | 表头列名                                      | String          |                                                              |        |
| prop         | 字段名，与后端确定                            | String          |                                                              |        |
| sort         | 时候可排序                                    | Boolean         |                                                              | false  |
| require      | 如有新增/修改按钮，是否添加到新增/修改面板中  | Boolean         |                                                              | false  |
| width        | 列宽，如不设置则按照element规则自动适应       | Number          |                                                              |        |
| fixedColumn  | 列是否固定在左侧或者右侧，true 表示固定在左侧 | string, boolean |                                                              |        |
| columnFilter | 是否在表头添加过滤框                          | Boolean         |                                                              | false  |
| type         | 类型，用于在新增/修改/过滤中判定输入框类型    | String          | "input"(输入框),"advance"(弹窗高级查询),"autocomplete"(远程搜索),"select"(数据字典选框),"cascader"(级联),"time"(时间选择器),"custom"(自定义列) |        |
| multiple     | 用于在新增/修改面板中判定是否多选             | Boolean         |                                                              | false  |
| mustFill     | 用于在新增/修改面板中判定是否必填             | Boolean         |                                                              | false  |

备注：剩余的用在新增/修改面板中的属性与[searchTxt]() 表中各种type类型的用法相同。

action相关配置

| key        | 说明                         | 类型   | 可选值                                                     | 默认值 |
| ---------- | ---------------------------- | ------ | ---------------------------------------------------------- | ------ |
| event      | 按钮类型                     | String | view(查看),edit(编辑),delete(删除),print(打印),amend(修改) |        |
| label      | 按钮名                       | String |                                                            |        |
| type       | 按钮样式                     | String | primary / success / warning / danger / info / text         |        |
| resourceId | 按钮标识符，用于设置按钮权限 | String |                                                            |        |

## Events

| 事件名        | 说明                           | 参数             |
| ------------- | ------------------------------ | ---------------- |
| saveData      | 新增/修改的保存                | data             |
| selectChange  | 查询按钮                       | data             |
| check-btn     | 表格中按钮触发事件             | data             |
| edit-btn      | 表格中按钮触发事件             | data             |
| separate-btn  | 表格中按钮触发事件             | data             |
| print-btn     | 表格中按钮触发事件             | data             |
| del-btn       | 表格中按钮触发事件             | data             |
| switch-change | 表格内switch切换               | data             |
| row-db-click  | 双击行                         | row              |
| searchChange  | 查询条件变化                   | data             |
| pageChange    | 分页器页数变化                 | page             |
| sizeChange    | 分页器每页显示个数选择器的变化 | size             |
| moreAction    | 更多按钮触发                   | selection, index |

