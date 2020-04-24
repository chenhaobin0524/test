const config = {
    MAS_TGC_UAT: '',
    singlePointLogin: '',
    appId: '',
    staffSelector: {},
    defaultPage: '',
    uploadAppId: '',
    uploadAppKey: '',
    bucket: '',
    filePreviewUrl: ''
};
/*
    vue中使用.env文件配置全局变量
    VUE_APP_URL = value     键值对形式， VUE_APP_是规定的命名格式，URL是自定义的变量名。
    process.env.VUE_APP_URL  通过这种格式访问全局变量
 */
if (process.env.VUE_APP_ENV) {
    config.MAS_TGC = process.env.VUE_APP_MAS_TGC;
    config.singlePointLogin = process.env.VUE_APP_LOGIN_URL;
    config.staffSelector = {
        url: process.env.VUE_APP_STAFF_SELECTOR_URL,
        project: process.env.VUE_APP_STAFF_SELECTOR_PROJECT
    };
    config.appId = process.env.VUE_APP_APPID;
    config.defaultPage = process.env.VUE_APP_DEFAULT_PAGE;
    config.uploadAppId = process.env.VUE_APP_UPLOAD_APP_ID;
    config.uploadAppKey = process.env.VUE_APP_UPLOAD_APP_KEY;
    config.apiUrl = process.env.VUE_APP_API_URL;
    config.bucket = process.env.VUE_APP_GWMS_BUCKET;
    config.bigDataLogTokenUrl = process.env.VUE_APP_BIG_DATA_LOG_TOKEN_URL;
    config.bigDataLogUrl = process.env.VUE_APP_BIG_DATA_LOG_URL;
    config.bigDataLogAppSecrect = process.env.VUE_APP_BIG_DATA_LOG_APP_SECRECT;
    config.bigDataLogAppName = process.env.VUE_APP_BIG_DATA_LOG_APP_NAME;
    config.filePreviewUrl = process.env.VUE_APP_FILE_PREVIEW;
} else {
    config.MAS_TGC = 'MAS_TGC_UAT';
    config.singlePointLogin = 'https://signinuat.midea.com/login?service=';
    config.staffSelector = {
        url: 'http://devcloud.midea.com/builder/m_staff_selector-V1.0.1/index.js',
        project: '/mframework'
    };
    config.appId = 'MFRAMEWORK_CLI3.0';
    config.defaultPage = '/index.html';
    config.uploadAppId = '32883248FE8946CCA59DDB36C80BF571';
    config.uploadAppKey = 'Vgjmcgy24Hjwb6Buq7ZfRz0uX2NebGJFrfYDRRPZ';
    config.apiUrl = '/';
    config.bucket = 'gwms';
    config.bigDataLogTokenUrl = '//testbigdataservice.midea.com/bigdatatoken';
    config.bigDataLogUrl = '//testbigdataservice.midea.com/kfk';
    config.bigDataLogAppSecrect = '5i8912j4-km12-57jm-03mn-n392jlkm9as';
    config.bigDataLogAppName = 'LTC';
    config.filePreviewUrl = 'http://mipuat.midea.com/';
}

export default config;
