import request from '@/utils/http';
// 获取组织根目录
export const organizations = params => {
    return request({
        url: 'api-auth/organizations',
        method: 'get',
        params: params
    });
};

// 获取组织下对应的租户信息
export const queryTenantsFromOrg = params => {
    return request({
        url: 'api-auth/queryTenantsFromOrgazation',
        method: 'get',
        params: params
    });
};

// 批量增加
export const batchAddTenantOrganizations = params => {
    return request({
        url: 'api-auth/batchAddTenantOrganizations',
        method: 'POST',
        data: params
    });
};

// 删除组织下对应的租户
export const deleteTenantOrganizationByCodes = params => {
    return request({
        url: 'api-auth/deleteTenantOrganizationByCodes',
        method: 'POST',
        data: params
    });
};

// 新增组织
export const organization = params => {
    return request({
        url: 'api-auth/organization',
        method: 'POST',
        data: params
    });
};

// 修改组织
export const updateOrg = params => {
    return request({
        url: `api-auth/organization/${params.id}`,
        method: 'put',
        data: params.data
    });
};

// 同步
export const synchronizeOrganization = params => {
    return request({
        url: `api-auth/synchronizeOrganization`,
        method: 'POST',
        data: params
    });
};