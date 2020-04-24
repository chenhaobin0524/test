import request from '@/utils/http';
// 查询列表
export const getLists = (data) => {
    return request({
        url: `/api-otp/netRanges`,
        method: 'post',
        data
    }).then(res => res);
};
// 新增和修改
export const batchCreateOrUpdate = (data) => {
    return request({
        url: `/api-otp/netRange/batchCreateOrUpdate`,
        method: 'post',
        data
    }).then(res => res);
};
// 停用
export const batchStop = (data) => {
    return request({
        url: `/api-otp/netRange/batchStop`,
        method: 'post',
        data
    }).then(res => res);
};
// 启用
export const batchStart = (data) => {
    return request({
        url: `/api-otp/netRange/batchStart`,
        method: 'post',
        data
    }).then(res => res);
};
// 导出
export const netCoverExports = (params) => {
    return request({
        url: `/api-otp/netRange/exports`,
        method: 'get',
        params
    }).then(res => res);
};
// 导入
export const netCoverImport = (data) => {
    return request({
        url: `/api-otp/netRange/import`,
        method: 'post',
        data
    }).then(res => res);
};