import request from '@/utils/http';
// 查询列表
export const getLists = (data) => {
    return request({
        url: `/api-otp/dispatchInvented/search`,
        method: 'post',
        data
    }).then(res => res);
};
// 查询发车单详情
export const getDispatchLists = (data) => {
    return request({
        url: `/api-otp/dispatch/${data}`,
        method: 'get'
    });
};
// 详情页运输单表明细
export const getSearchdetails = (data) => {
    return request({
        url: `/api-otp/dispatchInvented/searchdetail/${data}`,
        method: 'get'
    });
};
// 发车单装卸货列表查询和里程查询(列表)
export const getOptimizationLists = (data) => {
    return request({
        url: `/api-otp/dispatchInventedData/getDataWithTransports/${data}`,
        method: 'get'
    });
};
// 行车路径调整保存
export const mileageUpdate = (data) => {
    return request({
        url: `/api-otp/dispatchInvent/mileageUpdate`,
        method: 'post',
        data
    });
};
export const dictLists = (params) => {
    return request({
        url: `/api-mdm/mdmDataDictionaryDetails`,
        method: 'get',
        params
    });
};
// 推送
export const push = (data) => {
    return request({
        url: `/api-otp/transports/sendToWms`,
        method: 'post',
        data
    });
};