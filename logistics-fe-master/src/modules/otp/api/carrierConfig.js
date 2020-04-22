import request from '@/utils/http';

// 主页列表数据
export const carrierConfigs = (params) => {
    return request({
        url: `/api-otp/carrier/carrierConfigs`,
        method: 'post',
        data: params
    });
};

// 获取模板信息
export const queryCarrierConfigFile = () => {
    return request({
        url: `/api-otp/carrier/queryCarrierConfigFile`,
        method: 'get'
    });
};

// 上传确认按钮
export const confirmCarrierConfig = (params) => {
    return request({
        url: `/api-otp/carrier/confirmCarrierConfig?batchNum=${params}`,
        method: 'get'
    });
};

// 删除按钮
export const deleteByIds = (params) => {
    return request({
        url: `/api-otp/carrier/deleteByIds`,
        method: 'delete',
        data: params
    });
};

// 保存按钮
export const saveOrUpdate = (params) => {
    return request({
        url: `/api-otp/carrier/saveOrUpdate`,
        method: 'post',
        data: params
    });
};

export default {
    queryCarrierConfigFile,
    confirmCarrierConfig,
    carrierConfigs,
    deleteByIds,
    saveOrUpdate
};