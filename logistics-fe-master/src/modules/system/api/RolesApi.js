import request from '@/utils/http';
// 角色列表
export const getRoleList = params => {
    return request({
        url: '/api-auth/roles',
        method: 'get',
        params: params
    });
};
// 创建角色
export const addRole = params => {
    return request({
        url: '/api-auth/role',
        method: 'post',
        data: params
    });
};
// 修改角色
export const editRole = (formId, params) => {
    return request({
        url: '/api-auth/role/' + formId,
        method: 'put',
        data: params
    });
};
// 角色状态修改
export const switchRoleChange = (id, params) => {
    return request({
        url: '/api-auth/role/' + params.id,
        method: 'put',
        data: params
    });
};
// 删除角色
export const deleteRole = (id) => {
    return request({
        url: '/api-auth/role/' + id,
        method: 'delete'
    });
};
// 角色菜单
export const getAllAuths = (params) => {
    return request({
        url: '/api-auth/roleResources/sourceTree',
        method: 'get',
        params: params
    });
};
// 用户菜单权限
export const getUserAuths = (roleCode) => {
    return request({
        url: '/api-auth/role/' + roleCode + '/resources',
        method: 'get'
    });
};
// 角色菜单权限保存
export const saveRoleAuths = (params) => {
    return request({
        url: '/api-auth/roles/resources',
        method: 'put',
        data: params
    });
};
// 应用列表
export const getAllResourceList = params => {
    return request({
        url: '/api-auth/applications',
        method: 'get',
        params: params
    });
};

// 角色资源应用列表
export const getRoleResourceList = params => {
    return request({
        url: '/api-auth/searchTenantApplications',
        method: 'get',
        params: params
    });
};

// 角色模块角色菜单权限保存
export const saveRoleResources = (params) => {
    return request({
        url: '/api-auth/authRoleResource',
        method: 'put',
        data: params
    });
};