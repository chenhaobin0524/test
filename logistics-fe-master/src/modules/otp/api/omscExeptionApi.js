/**
 * 订单中心请求
 */
import request from '@/utils/http';

// 异常订单列表
export const getExceptionList = (params) => {
    return request({
        url: `/api-otp/exceptionChecks`,
        method: 'get',
        params
    });
};

// 新增异常
export const addException = (params) => {
    return request({
        url: `/api-otp/exceptionCheck`,
        method: 'POST',
        data: params
    });
};

// 编辑异常
export const editException = (data) => {
    return request({
        url: `/api-otp/exceptionCheck/${data.id}`,
        method: 'PUT',
        data
    });
};

// 关闭异常
export const closeException = (data) => {
    return request({
        url: `/api-otp/exceptionCheck/${data.id}`,
        method: 'PUT',
        data
    });
};

// 删除异常
export const delException = (id) => {
    return request({
        url: `/api-otp/exceptionCheck/${id}`,
        method: 'DELETE'
    });
};