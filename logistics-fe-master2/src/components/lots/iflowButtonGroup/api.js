import request from '@/utils/http';

// 获取流程状态
export const getProcessStatus = (params) => {
    return request({
        url: '/api-iflow/getProcessStatus',
        method: 'post',
        data: params
    }).then(res => res);
};

// 获取可用操作
export const getAvilableNodesAndOperation = (params) => {
    return request({
        url: '/api-iflow/getAvilableNodesAndOperation',
        method: 'post',
        data: params
    }).then(res => res);
};

// 提交流程
export const createProcess = (params) => {
    return request({
        url: '/api-iflow/approveProcess',
        method: 'post',
        data: params
    }).then(res => res);
};

// 获取流程详情
export const getProcessDetails = (params) => {
    return request({
        url: '/api-iflow/getProcessInfo',
        method: 'post',
        data: params
    }).then(res => res);
};

// 获取驳回节点
export const getProcessRefuseNode = (params) => {
    return request({
        url: '/api-iflow/getProcessRefuseNode',
        method: 'post',
        data: params
    }).then(res => res);
};
