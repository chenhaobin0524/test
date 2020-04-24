import request from '@/utils/http';
// 应用平台
export const getTenantOwnApplications = (params) => {
    return request({
        url: `/api-mdm/tenant/getTenantOwnApplications`,
        method: 'get',
        params
    });
};
// 发送消息
export const sentmsg = (params) => {
    return request({
        url: `/api-msg/notice`,
        method: 'post',
        data: params
    });
};
// 修改信息
export const savemsg = (params) => {
    return request({
        url: `/api-msg/notice/${params.id}`,
        method: 'put',
        data: params
    });
};
