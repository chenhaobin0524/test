import request from '@/utils/http';
// 获取垛口列表
export const getCrenelList = (params) => {
    return request({
        url: '/api-mobile/dn/crenels',
        method: 'get',
        params: params
    }).then(res => res);
};
// 提交新增排队
export const addQueue = (params) => {
    return request({
        url: `/api-mobile/dn/crenel/queue/${params.id}`,
        method: 'post',
        data: params,
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => res);
};
// 关闭排队
export const closeQueue = (params) => {
    return request({
        url: `/api-mobile/dn/crenel/queue/${params.id}`,
        method: 'put',
        data: params,
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => res);
};
// 司机到位
export const driverReady = (params) => {
    return request({
        url: `/api-mobile/dn/crenel/queue/${params.id}`,
        method: 'put',
        data: params,
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => res);
};
// 删除排队车牌
export const deleteQueue = (params) => {
    return request({
        url: `/api-mobile/dn/crenel/queue/${params.id}`,
        method: 'delete',
        data: params,
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => res);
};