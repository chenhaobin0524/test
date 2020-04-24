export default {
    state: {
        list: []
    },
    getters: {
        breadcrumb: state => state.list
    },
    mutations: {
        updateBreadcrumb(state, list) {
            state.list = list;
        }
    }
};
