import request from '@/utils/http';
// 查询列表
export const getSourceRoot = (params) => {
    return request({
        url: `/api-otp/transport/grouppolicy/list`,
        method: 'post',
        data: params
    }).then(res => res);
};
export const getSourceData = (params) => {
    return request({
        url: `/api-otp/transport/list/bygrouppolicy`,
        method: 'post',
        data: params
    }).then(res => res);
};
export const getDictList = (params) => {
    return request({
        url: `/api-mdm/dictionaryDetail/dict`,
        method: 'get',
        params
    });
};
export const getTargetRoot = (data) => {
    return request({
        url: `/api-otp/dispatch/list`,
        method: 'post',
        data
    }).then(res => res);
};
export const getTargetData = (data) => {
    return request({
        url: `/api-otp/transport/list/sort`,
        method: 'post',
        data
    }).then(res => res);
};
export const getDetailStatistics = (data) => {
    return request({
        url: `/api-otp/transport/itemdeail/count`,
        method: 'post',
        data
    }).then(res => res);
};
export const getStorageData = (params) => {
    return request({
        url: `/api-otp/dispatch/distribution/search`,
        method: 'get',
        params
    }).then(res => res);
};
export const getAllocate = (data) => {
    return request({
        url: `/api-otp/dispatch/distribution/update/${data.taskNo}`,
        method: 'put',
        data
    }).then(res => res);
};
export const getCancleAllocate = (data) => {
    return request({
        url: `/api-otp/dispatch/distribution/cancel`,
        method: 'put',
        data
    }).then(res => res);
};
export const saveCarArrange = (data) => {
    return request({
        url: `/api-otp/dispatch/artificial/save`,
        method: 'post',
        data
    }).then(res => res);
};
export const intelligentDispatch = (data) => {
    return request({
        url: `/api-otp/dispatch/intelligent`,
        method: 'post',
        data
    }).then(res => res);
};
export const updateCarArrange = (data) => {
    return request({
        url: `/api-otp/transport/operate`,
        method: 'post',
        data
    }).then(res => res);
};
export const updateIntelliArrange = (data) => {
    return request({
        url: `/api-otp/intelligent/operate`,
        method: 'post',
        data
    }).then(res => res);
};
export const getTransferData = (data) => {
    return request({
        url: `/api-otp/transport/transfer`,
        method: 'post',
        data
    }).then(res => res);
};
export const getTabelExpandDetail = (data) => {
    return request({
        url: `/api-otp/transport/itemdeail`,
        method: 'post',
        data
    }).then(res => res);
};
// 修改配送方式页面获取网点信息
export const searchNetInfo = (data) => {
    return request({
        url: `/api-otp/transports/searchNetinfo`,
        method: 'post',
        data
    }).then(res => res);
};
// 修改配送方式
export const updateDeliveryMethods = (data) => {
    return request({
        url: `/api-otp/transport/distributionModeUpdate`,
        method: 'post',
        data
    }).then(res => res);
};
// 查询网点信息
export const netInfos = (params) => {
    return request({
        url: `/api-mdm/netInfos`,
        method: 'get',
        params
    });
};
export const issueCarrier = (data) => {
    return request({
        url: `/api-otp/transport/issueCarrier`,
        method: 'put',
        data
    });
};
export const confirmIssueCarrier = (data) => {
    return request({
        url: `/api-otp/transport/confirmIssueCarrier`,
        method: 'put',
        data
    });
};