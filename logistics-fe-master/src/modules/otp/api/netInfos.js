import request from '@/utils/http';
// 查询列表
export const getLists = (params) => {
    return request({
        url: `/api-mdm/netInfos`,
        method: 'get',
        params
    }).then(res => res);
};
// 导出
export const exportNetInfos = (params) => {
    return request({
        url: `/api-otp/netInfoExport`,
        method: 'post',
        data: params
    }).then(res => res);
};