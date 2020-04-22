import request from '@/utils/http';
// 租户列表
export const getTenantList = params => {
    return request({
        url: '/api-auth/subTenants',
        method: 'get',
        params: params
    });
};
export const saveTenantList = params => {
    return request({
        url: '/api-auth/tenant',
        method: 'post',
        data: params
    });
};
export const updataTenantList = (id, params) => {
    return request({
        url: `/api-auth/tenant/${id}`,
        method: 'put',
        data: params
    });
};
export const deleteTenantList = id => {
    return request({
        url: `/api-auth/tenant/${id}`,
        method: 'delete'
    });
};

// 租户详情
export const getTenantDetail = (id, params) => {
    return request({
        url: `/api-auth/tenantUserInfos/${id}`,
        method: 'get',
        params: params
    });
};
// 设为管理员
export const updateUser = (id, params) => {
    return request({
        url: `/api-auth/updateTenantAdminFlag/${id}/${params}`,
        method: 'put'
    });
};

// 角色授权租户
export const setAuthorityLaseholders = (params) => {
    return request({
        url: '/api-auth/authTenantRole',
        method: 'put',
        data: params
    });
};
// tenantsWithRoles
export const getTenantRolesList = params => {
    return request({
        url: '/api-auth/queryTenantsByRole',
        method: 'get',
        params: params
    });
};
// 更改租户用户绑定关系
export const setTenantRolesList = (id, params) => {
    return request({
        url: `/api-auth/bindTenant/${id}/Users`,
        method: 'post',
        data: params
    });
};
// 租户下面添加的账户列表
export const getUncheckedUserList = params => {
    return request({
        url: '/api-auth/userInfos/unchecked',
        method: 'get',
        params: params
    });
};
// 租户下角色删除
export const deleteRole = id => {
    return request({
        url: `/api-auth/tenantRole/${id}`,
        method: 'delete'
    });
};

// 用户授权角色
export const deleteUser = id => {
    return request({
        url: `/api-auth/userRole/${id}`,
        method: 'delete'
    });
};
// 租户组列表
export const getTenantGroupList = params => {
    return request({
        url: '/api-auth/applicationTenantGroups',
        method: 'get',
        params: params
    });
};
export const saveTenantGroupList = params => {
    return request({
        url: '/api-auth/applicationTenantGroup',
        method: 'post',
        data: params
    });
};
export const updataTenantGroupList = (id, params) => {
    return request({
        url: `/api-auth/applicationTenantGroup/${id}`,
        method: 'put',
        data: params
    });
};
export const deleteTenantGroupList = id => {
    return request({
        url: `/api-auth/applicationTenantGroup/${id}`,
        method: 'delete'
    });
};
// 租户组详情
export const getTenantGroupDetail = (params) => {
    return request({
        url: '/api-auth/applicationTenantGroupItems',
        method: 'get',
        params: params
    });
};
// 租户组详情-添加租户
export const updateTenantGroupDetail = (params) => {
    return request({
        url: '/api-auth/applicationTenantGroupItem',
        method: 'post',
        data: params
    });
};
// 租户组-删除租户
export const deleteGroupTenant = id => {
    return request({
        url: `/api-auth/applicationTenantGroupItem/${id}`,
        method: 'delete'
    });
};
// 组织架构
export const getOrganizations = params => {
    return request({
        url: '/api-auth/organizations',
        method: 'get',
        params: params
    });
};
// 回显组织信息
export const tenantOrganizationByTenantCode = tenantCode => {
    return request({
        url: `/api-auth/tenantOrganizationByTenantCode/${tenantCode}`,
        method: 'get'
    });
};
