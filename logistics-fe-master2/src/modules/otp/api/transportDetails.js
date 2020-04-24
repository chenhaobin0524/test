
import request from '@/utils/http';

// 进度
export const getStep = (params) => {
    return request({
        url: `/api-otp/transport/selectstate/${params}`,
        method: 'get'
    });
};

// 综合信息
export const getAllMassage = (params) => {
    return request({
        url: `api-otp/transport/selectbytaskno/${params}`,
        method: 'get'
    });
};
// 商品信息
export const goodsDetails = (params) => {
    return request({
        url: `/api-otp/transport/searchgoodsdetail/${params}`,
        method: 'get'
    });
};
// 日志
export const transportLogs = (params) => {
    return request({
        url: `/api-otp/transportTraces/selectlogsinfo/${params}`,
        method: 'get'
    });
};
// 列表
export const transportData = (data) => {
    return request({
        url: `/api-otp/transport/selectallPage`,
        method: 'post',
        data
    });
};
