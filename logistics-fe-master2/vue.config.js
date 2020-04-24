/* eslint-disable no-console */
const fs = require('fs');
const chalk = require('chalk');
const path = require('path');

function resolve(dir) {
    return path.join(__dirname, dir);
}

let enterModules = JSON.parse(process.env.npm_config_argv).original.splice(2)[0]; // 用户输入要打包的模块
enterModules = enterModules && enterModules.substr(2, enterModules.length - 3);
const allModules = fs.readdirSync('./src/modules'); // 所有模块
const existModules = enterModules ? allModules.filter(item => enterModules.split(',').indexOf(item) > -1) : []; // 用户输入的有效模块
const unExistModules = enterModules ? enterModules.split(',').filter(item => existModules.indexOf(item) < 0) : []; // 用户输入的不存在的模块
const entries = enterModules ? existModules : allModules; // 实际打包的模块

// 提示用户所输入的不存在的模块
if (unExistModules.length) {
    console.log(chalk.yellow(`—————————————— 模块 ${unExistModules.join(',')} 不存在，有效模块将会继续打包 ——————————————`));
}

const pages = {};
entries.forEach(entry => {
    if (entry.indexOf('.') !== 0) {
        pages[entry] = {
            entry: `src/modules/${entry}/main.js`,
            template: `src/modules/${entry}/${entry}.html`,
            filename: `${entry}.html`
        };
    }
});

module.exports = {
    // 参考配置https://cli.vuejs.org/config/#devserver-proxy
    // https://github.com/chimurai/http-proxy-middleware#proxycontext-config
    devServer: {
        disableHostCheck: true,
        host: 'localhost.midea.com',
        port: '8080',
        open: true,
        proxy: {
            '/api-ptms': {
                target: 'http://lmessit.midea.com',
                changeOrigin: true,
                pathRewrite: {
                    '^/api-ptms': ''
                }
            },
            '/api-': {
                target: 'http://luatapi.midea.com',
                changeOrigin: true
            },
            '/mframework': {
                target: 'http://devcloudsit.midea.com:9430',
                changeOrigin: true,
                debuger: 'log'
            },
            '/lots': {
                target: 'http://lsitapi.midea.com', // 需要请求的地址
                changeOrigin: true, // 是否跨域
                logLevel: 'debug'
            },
            '/file': {
                target: 'http://lsitapi.midea.com', // 需要请求的地址
                changeOrigin: true, // 是否跨域
                logLevel: 'debug'
            },
            '/web-bms': {
                target: 'http://lsitapi.midea.com', // 需要请求的地址
                changeOrigin: true // 是否跨域
            },
            '/oss-api': {
                target: 'http://oss-cn-uat.midea.com',
                changeOrigin: true,
                pathRewrite: {
                    '^/oss-api': '/v1'
                }
            },
            '/oss-download': {
                target: 'http://oss-cn-uat.midea.com:17480',
                changeOrigin: true,
                pathRewrite: {
                    '^/oss-download': ''
                }
            },
            '/oss-upload': {
                target: 'http://oss-cn-uat.midea.com:17480',
                changeOrigin: true,
                pathRewrite: {
                    '^/oss-upload': '/v1'
                }
            }
        }
    },
    pages,
    chainWebpack: config => {
        config.resolve.alias.set('@theme', resolve('theme'));
    }
};
