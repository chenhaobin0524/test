import Vue from 'vue';
import Vuex from 'vuex';
import user from './modules/user';
import breadcrumb from './modules/breadcrumb';
import tagsNav from './modules/tags_nav';
import tagsView from './modules/tags_view';
import gwmsDictData from './modules/gwms/dictData';
import mon from './modules/mon/mon';
import iflow from './modules/iflow';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        ...user.state,
        ...breadcrumb.state,
        ...tagsNav.state,
        ...tagsView.state,
        ...gwmsDictData.state,
        ...mon.state,
        ...iflow.state
    },
    getters: {
        ...user.getters,
        ...breadcrumb.getters,
        ...tagsNav.getters,
        ...tagsView.getters,
        ...gwmsDictData.getters,
        ...mon.getters,
        ...iflow.getters
    },
    mutations: {
        ...user.mutations,
        ...breadcrumb.mutations,
        ...tagsNav.mutations,
        ...tagsView.mutations,
        ...gwmsDictData.mutations,
        ...mon.mutations,
        ...iflow.mutations
    },
    actions: {
        ...user.actions,
        ...breadcrumb.actions,
        ...tagsNav.actions,
        ...tagsView.actions,
        ...gwmsDictData.actions,
        ...iflow.actions
    }
});

// 热重载
if (module.hot) {
    // 指定要监控的文件
    module.hot.accept([store.mutations], () => {
        store.hotUpdate({
            mutations: store.mutations
        });
    });
}

export default store;
