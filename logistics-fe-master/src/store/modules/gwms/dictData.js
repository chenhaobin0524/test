import { dict } from '../../../components/awesome/page/mPanel3/mSearchList/api';
export default {
    state: {
        dictData: {}
    },
    getters: {
        dictData: state => state.dictData
    },
    mutations: {
        getDictData(state, dictObj) {
            state.dictData[dictObj.key] = dictObj.data;
        }
    },
    actions: {
        getDictData({ commit }, params) {
            return new Promise((resolve, reject) => {
                const url = '/api-mdm/dictionaryDetail/dict';
                const para = {
                    dictCodes: params.dictCode
                };
                dict(url, para).then(res => {
                    const {
                        code,
                        data,
                        msg
                    } = res;
                    if (code === '0') {
                        commit('getDictData', { data, key: params.key });
                    } else {
                        reject(msg);
                    }
                }).catch((error) => {
                    reject(error);
                });
            });
        }
    }
};