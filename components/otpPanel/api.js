import request from '@/utils/http';
import { getSession, setSession, getLocal, setLocal } from '@/utils/storage';

function getDictCache(keysStr) {
    if (!keysStr) {
        return {
            result: {},
            passKeys: ''
        };
    }
    const keys = keysStr.split(',');
    const result = {};
    const passKeys = [];
    keys.forEach(key => {
        const val = getSession(key);
        if (val) {
            result[key] = val;
        } else {
            passKeys.push(key);
        }
    });
    return {
        result,
        passKeys: passKeys.join(',')
    };
}
function setDictCache(map) {
    Object.keys(map).forEach(key => {
        setSession(key, map[key]);
    });
}

// 库区列表
export const getList = {
    post(url, params) {
        const key = `${params.id}-${params.subjectType}-${params.moduleCode}`;
        Reflect.deleteProperty(params, 'id');
        setLocal(key, params.configNameCn);
        return request({
            url: url + '/userIndividualConfigs/saveOrUpdate',
            method: 'post',
            data: params
        });
    },
    get(url, params) {
        const key = `${params.id}-${params.subjectType}-${params.moduleCode}`;
        Reflect.deleteProperty(params, 'id');
        if (getLocal(key)) {
            return Promise.resolve({
                code: '0',
                data: {
                    configNameCn: getLocal(key)
                }
            });
        } else {
            return request({
                url: url + '/userIndividualConfigs/param',
                method: 'post',
                data: params
            }).then(res => {
                if (res.code === '0') {
                    setLocal(key, res.data.configNameCn);
                }
                return res;
            });
        }
    }
};

// 字典值
export const dict = (popPrefix, params) => {
    const type = Object.prototype.toString.call(params);
    let dictCodes = null;
    if (type === '[object String]') {
        dictCodes = params;
    } else {
        dictCodes = params.dictCodes;
    }
    const data = getDictCache(dictCodes);
    if (data.passKeys === '') {
        return new Promise(resolve => {
            resolve({
                code: '0',
                data: data.result
            });
        });
    } else {
        return request({
            url: popPrefix,
            method: 'get',
            params: {
                // 不区分租户
                // tenantCode: params.tenantCode,
                dictCodes: data.passKeys
            }
        }).then(res => {
            setDictCache(res.data);
            res.data = { ...data.result, ...res.data };
            return res;
        });
    }
};
export const dictWithUrl = (params) => {
    return dict('/api-mdm/dictionaryDetail/dict', params);
};

// 远程搜索
export const longRange = (longPrefix, params) => {
    return request({
        url: longPrefix,
        method: 'post',
        data: params
    }).then(res => res);
};