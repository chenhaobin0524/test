import request from '@/utils/http';
// 获取岗位管理列表
export const positions = params => {
    return request({
        url: 'api-auth/positionInfos',
        method: 'POST',
        data: params
    });
};
// 新增岗位
export const position = params => {
    return request({
        url: 'api-auth/positionInfo',
        method: 'POST',
        data: params
    });
};
// 修改岗位
export const updatePosition = params => {
    return request({
        url: `api-auth/positionInfo/${params.id}`,
        method: 'PUT',
        data: params.data
    });
};
// 删除岗位
export const deletePosition = params => {
    return request({
        url: `api-auth/positionInfo/${params.id}`,
        method: 'delete',
        data: params.data
    });
};
// 同步IHR岗位列表
export const positionRelations = params => {
    return request({
        url: 'api-auth/positionRelations',
        method: 'POST',
        data: params
    });
};

// 同步IHR岗位
export const syncPositionRelations = params => {
    return request({
        url: 'api-auth/syncPositionRelations',
        method: 'get',
        params: params
    });
};

// IHR岗位启用
export const positionRelation = params => {
    return request({
        url: `api-auth/positionRelation/${params.id}`,
        method: 'PUT',
        data: params.data
    });
};

// 获取关联角色的列表
export const queryPositionRoles = params => {
    return request({
        url: 'api-auth/queryPositionRoles',
        method: 'get',
        params: params
    });
};
// 新增关联角色保存
export const batchAddPositionRoles = params => {
    return request({
        url: 'api-auth/savePositionRoles',
        method: 'POST',
        data: params
    });
};
// 删除关联角色
export const DeleteRolePosition = id => {
    return request({
        url: `api-auth/rolePosition/${id}`,
        method: 'delete'
    });
};
// 同步用户权限
export const syncUserAuth = params => {
    return request({
        url: `api-auth/syncUserAuth`,
        method: 'get',
        params: params
    });
};