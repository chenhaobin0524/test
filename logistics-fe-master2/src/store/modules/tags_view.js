const tagsView = {
    state: {
        visitedViews: [],
        cachedViews: []
    },
    getters: {
        visitedViews(state) {
            return state.visitedViews;
        },
        cachedViews(state) {
            return state.cachedViews;
        }
    },
    mutations: {
        COVER_VISITED_VIEW: (state, view) => {
            if (view.length) {
                state.visitedViews = view;
            }
        },
        ADD_VISITED_VIEW: (state, view) => {
            state.visitedViews.forEach((item, index) => {
                if (item.fullPath.split('?')[0] === view.fullPath.split('?')[0]) {
                    state.visitedViews[index] = Object.assign({}, view, {
                        title: view.meta.title || 'no-title',
                        fullPath: view.fullPath || 'no-fullPath',
                        query: view.query
                    });
                }
            });
            if (state.visitedViews.some(v => v.fullPath.split('?')[0] === view.fullPath.split('?')[0])) {
                return;
            }
            state.visitedViews.push(
                Object.assign({}, view, {
                    title: view.meta.title || 'no-title',
                    fullPath: view.fullPath || 'no-fullPath',
                    query: view.query
                })
            );
        },
        ADD_CACHED_VIEW: (state, view) => {
            view.matched.forEach(i => {
                if (state.cachedViews.includes(i.name)) {
                    return;
                }
                if (!i.meta.noCache && i.path) {
                    state.cachedViews.push(i.name);
                }
            });
        },

        DEL_VISITED_VIEW: (state, view) => {
            for (const [i, v] of state.visitedViews.entries()) {
                if (v.path === view.path) {
                    state.visitedViews.splice(i, 1);
                    break;
                }
            }
        },
        DEL_CACHED_VIEW: (state, view) => {
            view.matched.forEach(item => {
                if (!item.path) {
                    return false;
                }
                for (const i of state.cachedViews) {
                    if (i === item.name) {
                        const index = state.cachedViews.indexOf(i);
                        state.cachedViews.splice(index, 1);
                        break;
                    }
                }
            });
        },

        DEL_OTHERS_VISITED_VIEWS: (state, view) => {
            for (const [i, v] of state.visitedViews.entries()) {
                if (v.path === view.path) {
                    state.visitedViews = state.visitedViews.slice(i, i + 1);
                    break;
                }
            }
        },
        DEL_OTHERS_CACHED_VIEWS: (state, view) => {
            for (const i of state.cachedViews) {
                if (i === view.name) {
                    const index = state.cachedViews.indexOf(i);
                    state.cachedViews = state.cachedViews.slice(index, index + 1);
                    break;
                }
            }
        },

        DEL_ALL_VISITED_VIEWS: state => {
            state.visitedViews = [];
        },
        DEL_ALL_CACHED_VIEWS: state => {
            state.cachedViews = [];
        },

        UPDATE_VISITED_VIEW: (state, view) => {
            for (const v of state.visitedViews) {
                if (v.path === view.path) {
                    Object.assign(v, view);
                    break;
                }
            }
        }

    },
    actions: {
        addView({ dispatch }, view) {
            dispatch('addVisitedView', view);
            dispatch('addCachedView', view);
        },
        addVisitedView({ commit }, view) {
            commit('ADD_VISITED_VIEW', view);
        },
        addCachedView({ commit }, view) {
            commit('ADD_CACHED_VIEW', view);
        },
        delView({ dispatch, state }, view) {
            return new Promise(resolve => {
                dispatch('delVisitedView', view);
                dispatch('delCachedView', view);
                resolve({
                    visitedViews: [...state.visitedViews],
                    cachedViews: [...state.cachedViews]
                });
            });
        },
        delVisitedView({ commit, state }, view) {
            return new Promise(resolve => {
                commit('DEL_VISITED_VIEW', view);
                resolve([...state.visitedViews]);
            });
        },
        delCachedView({ commit, state }, view) {
            return new Promise(resolve => {
                commit('DEL_CACHED_VIEW', view);
                resolve([...state.cachedViews]);
            });
        },

        delOthersViews({ dispatch, state }, view) {
            return new Promise(resolve => {
                dispatch('delOthersVisitedViews', view);
                dispatch('delOthersCachedViews', view);
                resolve({
                    visitedViews: [...state.visitedViews],
                    cachedViews: [...state.cachedViews]
                });
            });
        },
        delOthersVisitedViews({ commit, state }, view) {
            return new Promise(resolve => {
                commit('DEL_OTHERS_VISITED_VIEWS', view);
                resolve([...state.visitedViews]);
            });
        },
        delOthersCachedViews({ commit, state }, view) {
            return new Promise(resolve => {
                commit('DEL_OTHERS_CACHED_VIEWS', view);
                resolve([...state.cachedViews]);
            });
        },

        delAllViews({ dispatch, state }, view) {
            return new Promise(resolve => {
                dispatch('delAllVisitedViews', view);
                dispatch('delAllCachedViews', view);
                resolve({
                    visitedViews: [...state.visitedViews],
                    cachedViews: [...state.cachedViews]
                });
            });
        },
        delAllVisitedViews({ commit, state }) {
            return new Promise(resolve => {
                commit('DEL_ALL_VISITED_VIEWS');
                resolve([...state.visitedViews]);
            });
        },
        delAllCachedViews({ commit, state }) {
            return new Promise(resolve => {
                commit('DEL_ALL_CACHED_VIEWS');
                resolve([...state.cachedViews]);
            });
        },

        updateVisitedView({ commit }, view) {
            commit('UPDATE_VISITED_VIEW', view);
        }
    }
};

export default tagsView;
