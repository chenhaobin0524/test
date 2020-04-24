import request from '@/utils/http';

// 车牌
export const getLicensePlate = (data) => {
    return request({
        url: `/api-mdm/suCar/searchByConditions`,
        method: 'get',
        params: data
    });
};

// 司机
export const getDriverName = (data) => {
    return request({
        url: `/api-mdm/suDriver/searchByConditions`,
        method: 'get',
        params: data
    });
};