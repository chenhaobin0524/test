import request from '@/utils/http';

const resource = {
    getApps(data) {
        return request({
            url: '/api-auth/applications',
            method: 'get',
            params: data
        });
    },
    getResources(data) {
        return request({
            url: `/api-auth/resources/${data}/tree`,
            method: 'get'
        });
    },
    appendResource(data) {
        return request({
            url: `/api-auth/resource`,
            method: 'post',
            data: data
        });
    },
    editResource(data, id) {
        return request({
            url: `/api-auth/resource/${id}`,
            method: 'put',
            data: data
        });
    },
    deleteResource(id) {
        return request({
            url: `/api-auth/resource/${id}`,
            method: 'delete'
        });
    },
    getTenantResourceUrls(resourceCode) {
        return request({
            url: '/api-auth/tenantResourceUrls',
            method: 'get',
            params: {
                resourceCode: resourceCode
            }
        });
    }
};
export default resource;
