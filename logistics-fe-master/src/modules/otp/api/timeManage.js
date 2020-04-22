import request from '@/utils/http';

// 时效产品查询列表
export const getAgingProduct = (params) => {
    return request({
        url: `/api-otp/agingConfigs`,
        method: 'get',
        params
    });
};

// 时效产品新增
export const agingProductAdd = (data) => {
    return request({
        url: `/api-otp/agingConfig/batchCreateOrUpdate`,
        method: 'post',
        data
    });
};

// 时效产品修改
export const agingProductEdit = (data, id) => {
    return request({
        url: `/api-otp/agingConfig/${id}`,
        method: 'put',
        data
    });
};

// 时效产品删除
export const agingProductDelete = (data) => {
    return request({
        url: `/api-otp/agingConfig/batchDeleteByBusinessKey`,
        method: 'delete',
        data
    });
};

// 时效客户列表/查询
export const getCustomerList = (params) => {
    return request({
        url: `/api-otp/customerAgingConfigs`,
        method: 'get',
        params
    });
};

// 时效客户编辑/详情
export const getCustomerDetail = (params, id) => {
    return request({
        url: `/api-otp/customerAgingConfig/${id}`,
        method: 'get',
        params
    });
};

// 时效客户新增
export const customerAdd = (data) => {
    return request({
        url: `/api-otp/customerAgingConfig/createOrUpdateToSave`,
        method: 'post',
        data
    });
};

// 时效客户批量停用
export const customerStop = (data) => {
    return request({
        url: `/api-otp/batchStop`,
        method: 'post',
        data
    });
};

// 时效客户批量停用
export const customerStart = (data) => {
    return request({
        url: `/api-otp/batchStart`,
        method: 'post',
        data
    });
};

// 时效客户导出
export const customerExport = (params) => {
    return request({
        url: `/api-otp/export/customerAgingConfig`,
        method: 'post',
        params
    });
};
