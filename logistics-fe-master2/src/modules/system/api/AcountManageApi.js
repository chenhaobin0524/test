import request from '@/utils/http';
// 创建账户
export const userAdd = params => {
    return request({
        url: 'api-auth/userInfo/createUser',
        method: 'POST',
        data: params
    });
};
// 账户列表
export const getUserList = params => {
    return request({
        url: '/api-auth/userInfos',
        method: 'get',
        params: params
    });
};
// 导出账户
export const exportUserList = params => {
    return request({
        url: '/api-auth/userInfos/export',
        method: 'get',
        params: params,
        responseType: 'arraybuffer'
    });
};
// 账户状态修改
export const switchAccountType = (row) => {
    return request({
        url: `/api-auth/tenantUser/${row.tenantUserId}`,
        method: 'put',
        data: {
            enableFlag: Number(!row.tenantUserEnableFlag),
            version: row.tenantUserVersion
        }
    });
};
// 设置管理员
export const setAdmin = (row) => {
    return request({
        url: `/api-auth/tenantUser/${row.tenantUserId}`,
        method: 'put',
        data: {
            tenantAdminFlag: Number(!row.tenantAdminFlag),
            version: row.tenantUserVersion,
            ownerTenantCode: row.tenantCode
        }
    });
};
// 系统列表
export const getSystemList = (params) => {
    return request({
        url: '/api-auth/applications',
        method: 'get',
        params: params
    });
};
// 系统下的角色
export const getRoleList = (params) => {
    return request({
        url: '/api-auth/roles',
        method: 'get',
        params: params
    });
};
// 用户角色
export const getUserRoleList = (params) => {
    return request({
        url: `/api-auth/userRoles`,
        method: 'get',
        params: params
    });
};
// 保存用户角色修改
export const saveUserRoles = (params) => {
    return request({
        url: '/api-auth/authUsersRoles',
        method: 'put',
        data: params
    });
};
// 数据类型
export const getDataTypeList = (params) => {
    return request({
        url: '/api-auth/dataAuths',
        method: 'get',
        params: params
    });
};
// 数据类型下的权限
export const getDataAuthQuery = (params) => {
    return request({
        url: '/api-auth/users/dataAuthQuery',
        method: 'get',
        params: params
    });
};
// 数据类型权限保存
export const saveDataAuths = (params) => {
    return request({
        url: '/api-auth/user/dataAuths',
        method: 'POST',
        data: params
    });
};
// 根据人员查询系统列表
export const getSystemsList = (params) => {
    return request({
        url: '/api-auth/searchTenantApplications',
        method: 'get',
        params: params
    });
};
// 根据系统列表查询右边树
export const getResourceTree = (params) => {
    return request({
        url: `/api-auth/searchTenantResources`,
        method: 'get',
        params: params
    });
};
// 保存资源权限
export const saveResourceTree = (params) => {
    return request({
        url: `/api-auth/authUserResource`,
        method: 'put',
        data: params
    });
};
// 新建账户查询用户名是否存在，0是用户都不存在,1存在用户系统,2只存在4A
export const queryFourA = (params) => {
    return request({
        url: `/api-auth/userInfo/query4A`,
        method: 'get',
        params: params
    });
};
// 点击同步
export const syncFourA = (params) => {
    return request({
        url: `/api-auth/userInfo/sync4A`,
        method: 'POST',
        data: params
    });
};
// 关联到租户
export const addToTenant = (params) => {
    return request({
        url: `/api-auth/userInfo/sync4A`,
        method: 'POST',
        data: params
    });
};
// 获取用户管理授权数据权限
export const getDataAuth = ({ userCode, dataCode, pageSize, pageNo, queryParam, search, selectedFlag }) => {
    return request({
        url: `/api-auth/user/${userCode}/dataAuth/${dataCode}`,
        method: 'get',
        params: {
            pageSize,
            pageNo,
            queryParam,
            search,
            selectedFlag
        }
    });
};
// 获取个人权限信息
export const getUserInfoResources = (params) => {
    return request({
        url: `/api-auth/getUserInfoResources`,
        method: 'get',
        params: params
    });
};
// 获取菜单
export const getAllResources = (params) => {
    return request({
        url: `/api-auth/getAllResources`,
        method: 'get',
        params: params
    });
};
// 删除已选的用户授权角色
export const delUserRole = (params) => {
    return request({
        url: `/api-auth/userRole/${params.userRoleId}`,
        method: 'delete'
    });
};
// 用户授权角色列表
export const getUserByRoleList = params => {
    return request({
        url: '/api-auth/queryUsersByRole',
        method: 'get',
        params: params
    });
};
// 给用户授权角色
export const getRoleByUser = params => {
    return request({
        url: '/api-auth/queryRolesByUser',
        method: 'get',
        params: params
    });
};