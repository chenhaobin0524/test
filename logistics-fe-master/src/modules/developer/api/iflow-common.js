import request from '@/utils/http';
// 字典值
export const getDicts = (params) => {
    return request({
        url: '/api-mdm/dictionaryDetail/dict',
        method: 'get',
        params: params
    }).then(res => res);
};
// 远程搜索
export const longRange = (params) => {
    return request({
        url: '/gwms-api/es/highsearch',
        method: 'get',
        params: params
    }).then(res => res);
};

// 获取用户待处理的流程列表
export const getMyRunningProcess = (params) => {
    return request({
        url: '/api-iflow/getMyRunningProcess',
        method: 'post',
        data: params
    }).then(res => res);
};
// 获取用户已审批/处理的流程列表
export const getMyWorkedProcess = (params) => {
    return request({
        url: '/api-iflow/getMyWorkedProcess',
        method: 'post',
        data: params
    }).then(res => res);
};
// 获取我启动的流程
export const getMyStartProcess = (params) => {
    return request({
        url: '/api-iflow/getMyStartProcess',
        method: 'post',
        data: params
    }).then(res => res);
};