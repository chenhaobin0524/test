export default {
    state: {
        chooseDay: ''
    },
    getters: {
        checkDayOrWeek: state => state.chooseDay
    },
    mutations: {
        changeDayOrWeek(state, arg) {
            state.chooseDay = arg;
        }
    },
    actions: {}
};