import request from '@/utils/http';
const EXPORT_TIMEOUT = 1000 * 3600 * 24;
const LOAD_TIMEOUT = 1000 * 3600;

// 查询全流程报表
export const getAllReportList = params => {
    request.defaults.timeout = LOAD_TIMEOUT;
    return request({
        url: '/api-otp/report/orderAllProcess',
        method: 'get',
        params: params
    }).then(res => res).catch(err => err);
};

// 全流程报表导出
export const exportAllReportList = params => {
    request.defaults.timeout = EXPORT_TIMEOUT;
    return request({
        url: '/api-otp/export/orderAllProcess',
        method: 'get',
        params: params,
        responseType: 'arraybuffer'
    }).then(res => res);
};

// 订单批量修改
export const ordersUpdate = params => {
    request.defaults.timeout = LOAD_TIMEOUT;
    return request({
        url: '/api-lots/orders/update',
        method: 'post',
        data: params
    }).then(res => res);
};

// 来源系统
export const getSystemList = params => {
    request.defaults.timeout = LOAD_TIMEOUT;
    return request({
        url: '/api-mdm/dictionaryDetail/dict',
        method: 'get',
        params: params
    }).then(res => res);
};