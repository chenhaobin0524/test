import request from '@/utils/http';

// 获取流程状态
export const getProcessStatus = (params) => {
    return request({
        url: '/api-iflow/getProcessStatus',
        method: 'post',
        data: params
    }).then(res => res);
};

// 获取流程表格
export const getProcessList = (params) => {
    return request({
        url: '/api-iflow/getProcessTableInfoAndManualNodes',
        method: 'post',
        data: params
    }).then(res => res);
};

// 获取流程审批记录
export const getApprovalRecords = (params) => {
    return request({
        url: '/api-iflow/getFlowLog',
        method: 'post',
        data: params
    }).then(res => res);
};

// 取上次审批人
export const getPrevProcessApprovers = (params) => {
    return request({
        url: '/api-iflow/getPrevProcessApprovers',
        method: 'post',
        data: params
    }).then(res => res);
};