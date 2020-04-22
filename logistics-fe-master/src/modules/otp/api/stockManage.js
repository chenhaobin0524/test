import request from '@/utils/http';

// 时效客户批量停用
export const getinventoryFlow = (params) => {
    return request({
        url: `/api-otp/inventoryFlows`,
        method: 'get',
        params
    });
};

// 库存中心
export const getCenterInv = (params) => {
    return request({
        url: `/api-otp/centerInv`,
        method: 'get',
        params
    });
};

// 库存中心导出
export const stockCenterExport = (data) => {
    return request({
        url: `/api-otp/export/centerInv`,
        method: 'get',
        params: data
    });
};

// 库存中心库存记录查询
export const lmsCenterStockQuery = (params) => {
    return request({
        url: `/api-otp/lmsCenterStockQuery`,
        method: 'get',
        params
    });
};

// 出入库确认反馈上游查询
export const getOrderConfirms = (params) => {
    return request({
        url: `/api-otp/orderConfirms`,
        method: 'get',
        params
    });
};

// 出入库确认反馈上游重推
export const orderConfirmList = (data) => {
    return request({
        url: `/api-otp/orderConfirmListRepust`,
        method: 'post',
        data
    });
};
