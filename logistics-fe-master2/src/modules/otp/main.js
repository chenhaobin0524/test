import Vue from 'vue';
import ElementUI from 'element-ui';
import App from './App';
import router from './router';
import store from '@/store/index';
import '@/utils/directive/display';
import { checkLogin } from '@/utils/index';
import '@theme/index.css';
import '@/styles/base.less';
import BaiduMap from 'vue-baidu-map';
import echarts from 'echarts';
import '@/utils/btnPermission';
// import './btnPermission';
import bigDataLog from '@/utils/bigDataLog';
import '@/utils/imgErrorListener';

Vue.prototype.$echarts = echarts;

Vue.use(BaiduMap, {
    ak: 'uXRnW5KnsRHsIseRVNRrAvtnBWd2sVHR'
});

Vue.config.productionTip = false;
const moduleName = 'C-OTP';
bigDataLog.init(moduleName);
const whiteList = ['/preview'];
checkLogin(router, whiteList);

store.dispatch('UPDATE_LANG').then(i18n => {
    Vue.use(ElementUI, {
        i18n: (path, options) => {
            const value = i18n.t(path, options);
            if (value) return value;
            return '';
        }
    });
    new Vue({
        router,
        store,
        i18n,
        render: h => h(App)
    }).$mount('#app');
});
