import request from '@/utils/http';
export const getDictList = (params) => {
    return request({
        url: `/api-mdm/dictionaryDetail/dict`,
        method: 'get',
        params
    });
};
export const getList = (params) => {
    return request({
        url: `/api-otp/cancelRules`,
        method: 'get',
        params
    });
};
export const batchCreateOrUpdate = (params) => {
    return request({
        url: `/api-otp/cancelRule/batchCreateOrUpdate`,
        method: 'post',
        data: params
    });
};
export const deleteByIds = (params) => {
    return request({
        url: `/api-otp/cancelRule/batchDeleteByBusinessKey`,
        method: 'delete',
        data: params
    });
};
