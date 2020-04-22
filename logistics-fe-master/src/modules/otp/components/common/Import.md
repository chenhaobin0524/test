###  Import.vue参数说明

​	**需要在 config.json文件的table中配置一个 ImportConfig 集合**

"ImportConfig": {
  "action": "https://jsonplaceholder.typicode.com/posts/",  上传地址
  "multiple": true,		 是否支持多个文件
  "accept":"xlsx/text",	 上传文件类型
  "showFileList": true,	 是否显示参数列表
  "fileType": "只能上传Excel文件，且不超过500kb"
}

需要知道更多参数请参照element-ui参数说明

