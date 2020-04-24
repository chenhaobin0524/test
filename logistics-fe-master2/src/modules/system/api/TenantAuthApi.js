import request from '@/utils/http';
// 租户列表
export const getTenantList = params => {
    return request({
        url: '/api-auth/tenants',
        method: 'get',
        params: params
    });
};
// 租户资源列表
export const getTenantAuthList = params => {
    return request({
        url: `/api-auth/tenantResources/${params.applicationCode}/${params.tenantCode}`,
        method: 'get'
    });
};
// 保存租户资源
export const saveTenantAuthList = (applicationCode, tenantCode, params) => {
    return request({
        url: `/api-auth/tenantResources/${applicationCode}/${tenantCode}`,
        method: 'post',
        data: {
            applicationCode: applicationCode,
            tenantCode: tenantCode,
            resources: params
        }
    });
};
