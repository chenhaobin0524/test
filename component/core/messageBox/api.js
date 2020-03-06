import request from '@/utils/http';

// ------消息中心
// 查询当前用户消息
export const getSelectMessage = (params) => {
    return request({
        url: `/api-msg/selectMessage`,
        method: 'get',
        params: params
    }).then(res => res);
};

// 获取系统公告
export const getNotices = (params) => {
    return request({
        url: `/api-msg/notices`,
        method: 'get',
        params: params
    }).then(res => res);
};