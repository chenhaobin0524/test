import request from '@/utils/http';

// 初始化流程
export const initProcess = (params) => {
    return request({
        url: '/api-iflow/initProcess',
        method: 'post',
        data: params
    }).then(res => res);
};

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
        url: `/api-iflow/approveProcess?tenantCode=${params.tenantCode}&appCode=${params.currentApplicationCode}`,
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