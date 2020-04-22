import request from '@/utils/http';
// 首页表格左侧tab栏数据 上
export const receiptTransfersGroup = (params) => {
    return request({
        url: `/api-otp/receipt/transfers/group`,
        method: 'post',
        data: params
    });
};
// 首页表格左侧tab栏数据 下
export const receiptTransfersToconfirm = (params) => {
    return request({
        url: `/api-otp/receipt/transfers/toconfirm`,
        method: 'post',
        data: params
    });
};
// 首页表格左侧tab栏数据 下
export const receiptTransfers = (params) => {
    return request({
        url: `/api-otp/receipt/transfers`,
        method: 'post',
        data: params
    });
};
// 移交 与 确认
export const receiptGeneratetransfer = (params) => {
    return request({
        url: `/api-otp/receipt/generatetransfer`,
        method: 'post',
        data: params
    });
};