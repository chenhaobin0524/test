import axios from 'axios';
import NProgress from 'nprogress';
import { Message } from 'element-ui';
import { logout } from './index';
import bigDataLog from '@/utils/bigDataLog';
import config from '../config/user.env';

axios.defaults.timeout = 60000 * 30; // 设置全局网络请求超时时间
/* 如果前端配置了这个withCredentials=true，后端设置Access-Control-Allow-Origin不能为 " * ",必须是你的源地址啊
    header("Access-Control-Allow-Origin","源地址";
    header("Access-Control-Allow-Credentials", "true");
*/
axios.defaults.withCredentials = true;  //要求在请求头里带上cookie
axios.defaults.baseURL = config.apiUrl; //根据不同环境，自动切换路径

// request拦截器，可以在请求或响应被 then 或 catch 处理之前截获它们；
axios.interceptors.request.use(config => {
    NProgress.start(); //启动加载进度条
    return config;
}, error => {
    NProgress.done(); //加载进度条结束
    return  Promise.reject(error);
});

// respone拦截器
axios.interceptors.response.use(
    response => {
        NProgress.done();
        if (response.data && response.data.code === 403) {
            logout();
        } else if (response.data && response.data.code && response.data.code !== '0' && +response.data.code !== 200) {
            // 200 为了 oss 接口添加
            Message.error({//全局响应报错提示
                message: response.data.msg,
                showClose: true  //设置成提示可关闭
            });
            bigDataLog.sendErrorMessage({
                errContent: '接口出错了',
                errType: 'BackEndError'
            });
            window._paq && window._paq.push(['trackEvent', 'BackEndError', 'error', response.data.msg]);
        } else {
            return response.data;
        }
    },
    error => {
        NProgress.done();
        const response = Object.assign({}, error.response); // 克隆对象
        if (response) {
            switch (response.status) {
            case 401:
                Message.closeAll(); //手动关闭所有实例
                Message.error('你还没有登录呦！');
                logout();
                break;
            case 404:
                Message.error('没找到接口信息');
                window._paq && window._paq.push(['trackEvent', 'NetworkError', 'error', '404']);
                bigDataLog.sendErrorMessage({
                    errContent: '没找到接口信息',
                    errType: 'FrontEndError'
                });
                break;
            case 500:
                Message.error('系统异常');
                window._paq && window._paq.push(['trackEvent', 'NetworkError', 'error', '500']);
                bigDataLog.sendErrorMessage({
                    errContent: '系统异常',
                    errType: 'BackEndError'
                });
                break;
            default:
                window._paq && window._paq.push(['trackEvent', 'NetworkError', 'error', response.status + '']);
                bigDataLog.sendErrorMessage({
                    errContent: '网络异常',
                    errType: 'NetworkError'
                });
            }
        }
        return Promise.reject(error);
    }
);

export default axios;
