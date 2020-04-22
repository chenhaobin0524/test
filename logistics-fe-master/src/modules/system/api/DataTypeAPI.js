import request from '@/utils/http';

const dataType = {
    update(id, params) {
        return request({
            url: `/api-auth/dataAuth/${id}`,
            method: 'put',
            data: {
                ...params
            }
        });
    },
    save(params, enableFlag) {
        return request({
            url: '/api-auth/dataAuth',
            method: 'post',
            data: {
                ...params,
                enableFlag: enableFlag
            }
        });
    },
    get(params) {
        return request({
            url: '/api-auth/dataAuths/likeSearch',
            method: 'get',
            params
        });
    },
    getById(id) {
        return request({
            url: `/api-auth/dataAuth/${id}`,
            method: 'get'
        });
    },
    remove(id) {
        return request({
            url: `/api-auth/dataAuth/${id}`,
            method: 'delete'
        });
    },
    getTenants(params) {
        return request({
            url: '/api-auth/tenants',
            method: 'get',
            params: params
        });
    }
};
export default dataType;
