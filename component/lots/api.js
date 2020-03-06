import localforage from 'localforage';
import request from '@/utils/http';
const addressDb = localforage.createInstance({
    storeName: 'address'
});
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
