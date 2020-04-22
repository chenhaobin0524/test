export default {
    state: {
        tags: [],
        activeTag: {}
    },
    getters: {
        tags(state) {
            return state.tags;
        },
        activeTag(state) {
            return state.activeTag;
        }
    },
    mutations: {
        /** 打开标签页 */
        OPEN_TAG(state, tag) {
            state.tags.push(tag);
            state.activeTag = tag;
        },
        /** 关闭标签页 */
        CLOSE_TAG(state, tag) {
            let index = -1;
            state.tags.forEach((item, i) => {
                if (item.name === tag.name) {
                    index = i;
                }
            });
            if (index > -1) {
                state.tags.splice(index, 1);
                if (tag.name === state.activeTag.name) {
                    [state.activeTag] = [state.tags[index] ? state.tags[index] : state.tags[index - 1]]; // 关闭标签页后，优先高亮下一个标签页，如果没有下一个则高亮上一个
                }
            }
        },
        /** 关闭所有标签页 */
        CLOSE_ALL_TAGS(state) {
            state.tags.splice(0, state.tags.length);
        },
        /** 切换标签页 */
        SWITCH_TAG(state, tag) {
            state.activeTag = tag;
        }
    },
    actions: {
        openTag(context, tag) {
            context.commit('OPEN_TAG', tag);
        },
        closeTag(context, tag) {
            context.commit('CLOSE_TAG', tag);
        },
        closeAllTags(context) {
            context.commit('CLOSE_ALL_TAGS');
        },
        switchTag(context, tag) {
            context.commit('SWITCH_TAG', tag);
        }
    }
};
