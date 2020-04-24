import request from '@/utils/http';

// 订单异常监控
export const getOrderExceptions = (params) => {
    return request({
        url: `/api-otp/orderExceptions`,
        method: 'get',
        params
    });
};

// 订单异常关闭
export const closes = (data) => {
    return request({
        url: `/api-otp/orderExceptions/closes`,
        method: 'post',
        data
    });
};

// 订单异常处理
export const orderExceptionsHandles = (data) => {
    return request({
        url: `/api-otp/orderExceptions/handlesConverge`,
        method: 'post',
        data
    });
};