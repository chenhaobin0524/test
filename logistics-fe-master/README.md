# 美的前端开发框架

## 开发说明

因为接入了4A 因此：

## 重要事情说在前面请配host和切换美的NPM源:

```
# [配置](http://evadev.midea.com:5000/frontend/framework/框架.html)本地host
127.0.0.1 localhost.midea.com

# 切换美的源
npm config set registry http://npm.midea.com:7001/
```

详细的说明文档和开发规范参考[开发指引](http://evadev.midea.com:5000/)

```
# 依赖安装
$ npm install

# 开发启动

$ npm run serve 

# 编译打包
$ npm run build:prod (全量打包)

# 分环境分模块
$ npm run build:prod -[module1,module2...]（生产环境）
$ npm run build:sit -[module1,module2...]（SIT环境）

# 测试语法检测
$ npm run lint
```

## 其他说明 

(点击)[http://evadev.midea.com:5000/frontend/framework/%E5%BF%AB%E9%80%9F%E5%BC%80%E5%A7%8B.html]查看