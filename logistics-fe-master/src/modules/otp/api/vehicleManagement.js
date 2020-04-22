import request from '@/utils/http';

// 查询
export const getVehicles = (data) => {
    return request({
        url: `/api-otp/dispatch/carmanagesearch`,
        method: 'post',
        data
    });
};

// 头部数据统计
export const getVehicleLists = (params) => {
    return request({
        url: `/api-otp/dispatch/dispatchstatusort`,
        method: 'post',
        data: params
    });
};