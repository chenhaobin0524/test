import request from '@/utils/http';

// 列表数据
export const closeRules = (params) => {
    return request({
        url: `/api-otp/closeRules`,
        method: 'get',
        params
    });
};

// 列表数据删除
export const batchDeleteByBusinessKey = (params) => {
    return request({
        url: `/api-otp/closeRule/batchDeleteByBusinessKey`,
        method: 'delete',
        data: params
    });
};

// 列表数据保存
export const batchCreateOrUpdate = (params) => {
    return request({
        url: `/api-otp/closeRule/batchCreateOrUpdate`,
        method: 'post',
        data: params
    });
};

export default {
    closeRules,
    batchDeleteByBusinessKey,
    batchCreateOrUpdate
};