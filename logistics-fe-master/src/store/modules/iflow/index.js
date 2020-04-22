export default {
    state: {
        fdStatus: '',
        fdStatusSetTime: '', // fdStatus被修改时的时间戳
        nodeHandlers: [], // 已选处理人
        mustSelectedNodeIds: [] // 必选处理人节点
    },
    getters: {},
    mutations: {
        setFdStatus(state, data) {
            const now = new Date();
            state.fdStatus = data;
            state.fdStatusSetTime = now.getTime();
        },
        setNodeHandlers(state, data) {
            state.nodeHandlers = data;
        },
        setMustSelectedNodeIds(state, data) {
            state.mustSelectedNodeIds = data;
        }
    },
    actions: {}
};