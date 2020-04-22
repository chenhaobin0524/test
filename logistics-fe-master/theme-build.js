/**
 * theme-build.js 创建主题
 * 运行，在命令行用 nodejs 执行: node theme-build.js
 **/
var et = require('element-theme');

// build
et.run({
    config: 'src/styles/element-variables.scss',
    out: 'theme/',
    minimize: false
});