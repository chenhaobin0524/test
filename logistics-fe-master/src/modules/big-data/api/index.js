import request from '@/utils/http';
// 宝洁大屏-垛口当天计划
export const getCrenelPlan = () => {
    return request({
        url: '/api-bi/es/search?type=bj_plan&refresh=true',
        method: 'get'
    });
};

// 完成率 bj_rate
export const getCrenelRate = () => {
    return request({
        url: '/api-bi/es/search?type=bj_rate&refresh=true',
        method: 'get'
    });
};

// 垛口停靠
export const getCrenelNew = () => {
    return request({
        url: '/api-bi/es/search?type=bj_park&refresh=true',
        method: 'get'
    });
};

// st区占用率
export const getStOccupancy = () => {
    return request({
        url: '/api-bi/es/search?type=bj_st&refresh=true',
        method: 'get'
    });
};

// 备货进度
export const getStock = () => {
    return request({
        url: '/api-bi/es/search?type=bj_vehicle&refresh=true',
        method: 'get'
    });
};

export const getStNews = () => {
    return request({
        url: '/api-bi/db/search?type=bj_basic&refresh=true',
        method: 'get'
    });
};

// 垛口状态
export const getCrenelStatus = () => {
    return request({
        url: '/api-bi/es/search?type=dk_type&refresh=true',
        method: 'get'
    });
};
