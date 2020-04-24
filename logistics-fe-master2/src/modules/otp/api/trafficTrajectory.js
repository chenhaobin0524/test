import request from '@/utils/http';

// 查询
export const getTrafficLists = (data) => {
    return request({
        url: `/api-otp/driving/dispatchs`,
        method: 'post',
        data
    });
};

// 查询在途轨迹
export const getTrajectoryLists = (data) => {
    return request({
        url: `/api-otp/driving/queryztbdispatchtrace`,
        method: 'post',
        data
    });
};
// 查询站点详情
export const getSitedetails = (data) => {
    return request({
        url: `/api-otp/driving/sitedetail`,
        method: 'get',
        data
    });
};