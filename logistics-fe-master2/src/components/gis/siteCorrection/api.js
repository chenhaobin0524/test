import request from '@/utils/http';

export const correctionOrderApi = (params) => {
    return request({
        url: `api-otp/alterAddressError`,
        method: 'get',
        params
    });
};

export const addSiteApi = (params) => {
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

export const getGisInfoApi = (params) => {
    return request({
        url: `api-gis/gisPolygonInfos`,
        method: 'get',
        params
    });
};