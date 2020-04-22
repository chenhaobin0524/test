import request from '@/utils/http';

export const correctionOrderApi = (params) => {
    return request({
        url: `api-otp/alterAddressError`,
        method: 'get',
        params
    });
};

export const addSite = (params) => {
    return request({
        url: `api-gis/gisHistory/add`,
        method: 'post',
        data: params
    });
};

export const correctionApi = (params) => {
    return request({
        url: `api-gis/gisHistoryInfos`,
        method: 'post',
        data: params
    });
};

export const gisPolygonApi = (params) => {
    return request({
        url: `api-gis/getAreaByPoint `,
        method: 'post',
        data: params
    });
};

// 根据条件查询地址映射表列表
export const addressMappings = (params) => {
    return request({
        url: `api-otp/addressMappings`,
        method: 'get',
        params
    });
};

export const addAddressMapping = (params) => {
    return request({
        url: `/api-otp/addressMapping/batchCreateOrUpdate`,
        method: 'post',
        data: params
    });
};

export const deleteAddressMapping = (data) => {
    return request({
        url: `/api-otp/addressMapping/batchDelete`,
        method: 'delete',
        data
    });
};