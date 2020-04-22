import axios from 'axios';
import NProgress from 'nprogress';
import { Message } from 'element-ui';
import { logout } from './index';
import bigDataLog from '@/utils/bigDataLog';
import config from '../config/user.env';

axios.defaults.timeout = 60000 * 30; // 请求超时时间
axios.defaults.withCredentials = true;
axios.defaults.baseURL = config.apiUrl;

// request拦截器
axios.interceptors.request.use(config => {
    NProgress.start();
    return config;
}, error => {
    NProgress.done();
    Promise.reject(error);
});

// respone拦截器
axios.interceptors.response.use(
    response => {
        NProgress.done();
        if (response.data && response.data.code === 403) {
            logout();
        } else if (response.data && response.data.code && response.data.code !== '0' && +response.data.code !== 200) {
            // 200 为了 oss 接口添加
            Message.error({
                message: response.data.msg,
                showClose: true
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
        const response = Object.assign({}, error.response);
        if (response) {
            switch (response.status) {
            case 401:
                Message.closeAll();
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
