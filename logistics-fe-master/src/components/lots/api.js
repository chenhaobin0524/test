/**
 * 公共组件所需的接口api文件
 */
import localforage from 'localforage';
import request from '@/utils/http';
import { getSession, setSession, getLocal, setLocal } from '@/utils/storage';

/**
 * 省市区相关接口
 */
// 初始化indexedDb数据表
const addressDb = localforage.createInstance({
    storeName: 'address'
});
// 省市四级联动
export const getAreaApi = async (params) => {
    const areaList = await addressDb.getItem(String(params.ebplParentPmCode));
    if (areaList) {
        return {
            code: '0',
            data: areaList
        };
    } else {
        params.ebplIsAble = 'ENABLE';
        return request({
            url: '/api-mdm/searchEbPlace',
            method: 'get',
            params: params
        }).then(res => {
            if (res && res.code === '0') {
                addressDb.setItem(String(params.ebplParentPmCode), res.data);
            }
            return res;
        });
    }
};

/**
 * 列配置相关接口
 */
// 列配置
export const columnsConfigApi = {
    save(params) {
        return request({
            url: '/api-auth/userIndividualConfigs/saveOrUpdate',
            method: 'post',
            data: params
        });
    },
    get(params) {
        return request({
            url: '/api-auth/userIndividualConfigs/param',
            method: 'post',
            data: params
        });
    }
};

/**
 * 列配置和自定义搜索条件配置相关接口
 */
export const getList = {
    post(url, params) {
        const key = `${params.id}-${params.subjectType}-${params.moduleCode}`;
        Reflect.deleteProperty(params, 'id');
        setLocal(key, params.configName);
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
                    configName: getLocal(key)
                }
            });
        } else {
            return request({
                url: url + '/userIndividualConfigs/param',
                method: 'post',
                data: params
            }).then(res => {
                if (res.code === '0') {
                    setLocal(key, res.data.configName);
                }
                return res;
            });
        }
    }
};
export const fieldConfig = {
    set: (params) => {
        return getList.post('/api-auth', params);
    },
    get: (params) => {
        return getList.get('/api-auth', params);
    }
};

/**
 *  数据字典相关接口
 */
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
