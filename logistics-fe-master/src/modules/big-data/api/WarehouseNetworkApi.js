import request from '@/utils/http';
import { apiPath } from './Constant';
// 仓配网络中心 接口

// 过去24小时
export const getPast = () => {
    return request({
        url: `${apiPath}/db/search?type=ck_past&refresh=true`,
        method: 'get'
    });
};

// 未来24小时
export const getNext = () => {
    return request({
        url: `${apiPath}/db/search?type=ck_next&refresh=true`,
        method: 'get'
    });
};

// 准时率
export const getRate = () => {
    return request({
        url: `${apiPath}/db/search?type=ck_rate&refresh=true`,
        method: 'get'
    });
};

// 效率
export const getEfficiency = () => {
    return request({
        url: `${apiPath}/db/search?type=ck_efcy&refresh=true`,
        method: 'get'
    });
};

// 品类IPP
export const getIPP = () => {
    return request({
        url: `${apiPath}/db/search?type=ck_ipp&refresh=true`,
        method: 'get'
    });
};

// AOT
export const getAot = () => {
    return request({
        url: `${apiPath}/db/search?type=ys_rate&refresh=true`,
        method: 'get'
    });
};

// 准时到货率
export const getGoods = () => {
    return request({
        url: `${apiPath}/db/search?type=ys_good&refresh=true`,
        method: 'get'
    });
};

// GPS
export const getGps = () => {
    return request({
        url: `${apiPath}/db/search?type=ys_index&refresh=true`,
        method: 'get'
    });
};

// Reject
export const getReject = () => {
    return request({
        url: `${apiPath}/db/search?type=ys_fd&refresh=true`,
        method: 'get'
    });
};

// 正常和迟到风险
export const getLate = () => {
    return request({
        url: `${apiPath}/db/search?type=ys_late&refresh=true`,
        method: 'get'
    });
};

// 信号丢失
export const getLoss = () => {
    return request({
        url: `${apiPath}/db/search?type=ys_loss&refresh=true`,
        method: 'get'
    });
};

// GPS接口
export const getNewGps = () => {
    return request({
        url: `${apiPath}/db/search?type=ys_gps&refresh=true`,
        method: 'get'
    });
};

// 电子锁有效率接口
export const getLock = () => {
    return request({
        url: `${apiPath}/db/search?type=ys_lock&refresh=true`,
        method: 'get'
    });
};
