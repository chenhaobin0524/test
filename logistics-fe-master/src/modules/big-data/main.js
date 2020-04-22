import Vue from 'vue';
import ElementUI from 'element-ui';
import App from './App';
import router from './router';
import store from '../../store/index';
import echarts from 'echarts';
import '../../utils/directive/display';
import '../../../theme/index.css';
import '../../styles/base.less';
import './style/common.less';
import utils from '@/utils/common';
import 'default-passive-events';

Vue.config.productionTip = false;
Vue.prototype.$echarts = echarts;
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
        mixins: [utils.IE11RouterFix()],
        render: h => h(App)
    }).$mount('#app');
});
router.beforeEach((to, from, next) => {
    if (to.meta.title) {
        document.title = to.meta.title;
    } else {
        document.title = '宝洁数据监控';
    }
    next();
});
