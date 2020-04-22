import request from '@/utils/http';
// 首页表格数据
export const getTransferConfirmList = (params) => {
    return request({
        url: `/api-otp/receipt/transferconfirm/list`,
        method: 'post',
        data: params
    });
};
// 上传
export const uploadTransfer = (params) => {
    return request({
        url: `/api-otp/receipt/upload/transfer`,
        method: 'post',
        data: params
    });
};
// 接收
export const receiptTransfertoconfirm = (params) => {
    return request({
        url: `/api-otp/receipt/transfertoconfirm`,
        method: 'post',
        data: params
    });
};
// 打印
export const receiptPrinttransfer = (params) => {
    return request({
        url: `/api-otp/receipt/printtransfer/${params}`,
        method: 'get'
    });
};
// 删除
export const deleteTransferpicture = (params) => {
    return request({
        url: `/api-otp/receipt/delete/transferpicture`,
        method: 'delete',
        data: params
    });
};
// 接收弹框 数据
export const transfersToconfirmList = (params) => {
    return request({
        url: `/api-otp/receipt/transfers/toconfirm/list/${params}`,
        method: 'get'
    });
};
