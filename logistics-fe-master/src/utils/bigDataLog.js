/**
 * 大数据埋点系统
 **/
import store from '@/store/index';
import utils from '@/utils/common';
import SHA256 from '@/utils/sha1';
import config from '@/config/user.env';

class BigDataLog {
    constructor() {
        this.tokenApi = config.bigDataLogTokenUrl + '/api/1.0.1/getToken';
        this.mainApi = config.bigDataLogUrl + '/api/2.0/send_main_message';
        this.detailApi = config.bigDataLogUrl + '/api/2.0/send_detail_message';
        this.errorApi = config.bigDataLogUrl + '/api/2.0/send_error_message';
        this.moduleName = '';
        this.userName = '';
        this.token = '';
        this.expire = (new Date()).getTime();
        this.browserInfo = {};
        this.screenInfo = {};
    }

    init(moduleName) {
        this.moduleName = moduleName;
        this.browserInfo = this.getBrowserInfo();
        this.screenInfo = this.getScreenInfo();
    }
    checkToken() {
        if (!this.token || this.expire < (new Date()).getTime()) {
            return this.getToken();
        } else {
            return new Promise(resolve => {
                resolve();
            });
        }
    }
    // 获取 token
    getToken() {
        this.userName = store.state.user.userCode;
        return new Promise(resolve => {
            utils.ajax({
                url: this.tokenApi,
                data: {
                    appSecrect: config.bigDataLogAppSecrect,
                    appName: config.bigDataLogAppName,
                    userName: this.userName
                },
                success: (data) => {
                    data = JSON.parse(data);
                    if (data && data.data) {
                        this.token = data.data.token;
                        this.expire = data.data.expire;
                        resolve();
                    }
                }
            });
        });
    }
    getBrowserInfo() {
        const Sys = {
            platform: window.navigator.platform,
            userAgent: window.navigator.userAgent,
            language: window.navigator.language,
            appPlatform: window.navigator.appVersion,
            appVersion: window.navigator.buildID
        };
        const ua = window.navigator.userAgent.toLowerCase();
        const re = /(msie|firefox|chrome|opera|version).*?([\d.]+)/;
        const m = ua.match(re);
        if (m[0] && m[1]) {
            Sys.appCodeName = m[1].replace(/version/, "'safari");
            Sys.appName = m[0];
        }
        return Sys;
    }
    getScreenInfo() {
        return {
            availWidth: window.screen.availWidth,
            availHeight: window.screen.availHeight,
            width: window.screen.width,
            height: window.screen.height,
            colorDepth: window.screen.colorDepth,
            pixelDepth: window.screen.pixelDepth
        };
    }
    getNetworkType() {
        let netType = 'wifi';
        if (window.navigator.connection && window.navigator.connection.effectiveType) {
            netType = navigator.connection.effectiveType;
        };
        return netType;
    }
    getMainMessage() {
        return {
            userName: this.userName,
            moduleName: this.moduleName,
            clientDate: utils.formatDateTime(new Date()),
            href: window.location.href,
            ...this.screenInfo,
            ...this.browserInfo
        };
    }
    getDetailMessage(modelInfo = {}) {
        return {
            userName: this.userName,
            moduleName: this.moduleName,
            clientDate: utils.formatDateTime(new Date()),
            href: window.location.href,
            ...this.screenInfo,
            ...this.browserInfo,
            ...modelInfo
        };
    }
    getErrorMessage(errInfo = {}) {
        return {
            userName: this.userName,
            moduleName: this.moduleName,
            clientDate: utils.formatDateTime(new Date()),
            href: window.location.href,
            netType: this.getNetworkType(),
            errContent: errInfo.Content,
            errType: errInfo.Type
        };
    }
    sendMainMessage() {
        // 必填信息不为空才提交
        if (!this.moduleName) {
            return false;
        }
        this.checkToken().then(() => {
            utils.ajax({
                url: this.mainApi,
                data: {
                    token: this.token,
                    sign: SHA256(config.bigDataLogAppName + this.expire + config.bigDataLogAppSecrect),
                    appName: config.bigDataLogAppName,
                    time: this.expire,
                    topicName: 'request_data_main_log',
                    message: JSON.stringify(this.getMainMessage())
                },
                type: 'POST',
                success: function(data) {}
            });
        });
    }
    sendDetailMessage(modelInfo = {}) {
        // 必填信息不为空才提交
        if (!this.moduleName || !modelInfo.model_name1) {
            return false;
        }
        this.checkToken().then(() => {
            utils.ajax({
                url: this.detailApi,
                data: {
                    token: this.token,
                    sign: SHA256(config.bigDataLogAppName + this.expire + config.bigDataLogAppSecrect),
                    appName: config.bigDataLogAppName,
                    time: this.expire,
                    topicName: 'request_data_detail_log',
                    message: JSON.stringify(this.getDetailMessage(modelInfo))
                },
                type: 'POST',
                success: function(data) {}
            });
        });
    }
    sendErrorMessage(errInfo = {}) {
        // 必填信息不为空才提交
        if (!this.moduleName || !errInfo.errContent || !errInfo.errType) {
            return false;
        }
        this.checkToken().then(() => {
            utils.ajax({
                url: this.detailApi,
                data: {
                    token: this.token,
                    sign: SHA256(config.bigDataLogAppName + this.expire + config.bigDataLogAppSecrect),
                    appName: config.bigDataLogAppName,
                    time: this.expire,
                    topicName: 'request_data_error_log',
                    message: JSON.stringify(this.getErrorMessage(errInfo))
                },
                type: 'POST',
                success: function(data) {}
            });
        });
    }
};
export default new BigDataLog();
