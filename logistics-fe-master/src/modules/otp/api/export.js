/**
 * 导出请求
*/
import request from '@/utils/http';

// 订单中心
export const exportOrder = (params) => {
    return request({
        url: `/api-otp/export/order`,
        params: params,
        method: 'get'
    });
};
// 配送方式规则
export const exportShippingType = (params) => {
    return request({
        url: `/api-otp/export/shippingType`,
        params: params,
        method: 'get'
    });
};
// 任务中心
export const exportTask = (params) => {
    return request({
        url: `/api-otp/export/task`,
        params: params,
        method: 'get'
    });
};
// 客户时效
export const exportCustomerAgingConfig = (params) => {
    return request({
        url: `/api-otp/export/customerAgingConfig`,
        params: params,
        method: 'get'
    });
};
// 片区规划
export const exportArea = (params) => {
    return request({
        url: `/api-otp/export/area`,
        params: params,
        method: 'get'
    });
};
export const exportAreaPost = (params) => {
    return request({
        url: `/api-otp/export/area`,
        data: params,
        method: 'post'
    });
};
// 装卸计费标识导出
export const feeRuleExcelExport = (params) => {
    return request({
        url: `/api-otp/export/loadingFeeRule`,
        method: 'get',
        params
    });
};
// 业务类型配置导出
export const busTypeConfExport = (params) => {
    return request({
        url: `/api-otp/export/busineesFeeConfig`,
        method: 'get',
        params
    });
};
// 承运商配置导出
export const carrierConfig = (params) => {
    return request({
        url: `/api-otp/export/carrierConfig`,
        data: params,
        method: 'post'
    });
};