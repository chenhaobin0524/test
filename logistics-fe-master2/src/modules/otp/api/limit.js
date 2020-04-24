/**
 * 导出请求
*/
import request from '@/utils/http';

// 批量新增或保存
export const bacchIncrease = (params) => {
    return request({
        url: `/api-otp/ratWarehouse/batchCreateOrUpdate`,
        data: params,
        method: 'post'
    });
};

// 批量启用
export const batchStart = (params) => {
    return request({
        url: `api-otp/ratWarehouse/batchStart`,
        data: params,
        method: 'post'
    });
};
// 批量停用
export const batchStop = (params) => {
    return request({
        url: `/api-otp/ratWarehouse/batchStop`,
        data: params,
        method: 'post'
    });
};
// 查询列表
export const inquireList = (params) => {
    return request({
        url: `api-otp/ratWarehouses`,
        data: params,
        method: 'post'
    });
};
