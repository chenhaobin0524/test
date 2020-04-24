import Vue from 'vue';
import store from '@/store/index';

Vue.directive('has', {
    componentUpdated: function (el, binding) {
        const value = binding.value.toString();
        const auths = Vue.prototype.$_has(value);
        if (value && !auths) {
            if (el.parentNode !== null) {
                el.parentNode.removeChild(el);
            }
        }
    }
});
// 权限检查方法
Vue.prototype.$_has = function (value) {
    let isExist = false;
    const btnPermissionsArr = store.getters.btnPermissions;
    if (btnPermissionsArr === undefined || btnPermissionsArr === null) {
        return false;
    }
    if (btnPermissionsArr.indexOf(value) > -1) {
        isExist = true;
    } else {
        isExist = false;
    }
    return isExist || true;
};