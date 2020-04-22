/**
 * 配置中心请求
*/
import request from '@/utils/http';

/* 配送方式规则 */
// 根据条件查询配送规则列表
export const getShippingTypeRules = (params) => {
    return request({
        url: `/api-otp/shippingTypeRules`,
        method: 'get',
        params
    });
};

/* 上游出入库规则 */
// 根据条件查询上游出库确认规则列表
export const getCustomerConfirmRules = (params) => {
    return request({
        url: `/api-otp/customerConfirmRules`,
        method: 'get',
        params
    });
};

// 批量更新上游出库规则
export const batchUpdateCustomerConfirmRules = (data) => {
    return request({
        url: `/api-otp/customerConfirmRule/batchCreateOrUpdate`,
        method: 'post',
        data
    });
};

// 批量删除上游出库规则
export const batchDeleteCustomerConfirmRules = (data) => {
    return request({
        url: `/api-otp/customerConfirmRule/batchDeleteByBusinessKey`,
        method: 'delete',
        data
    });
};

/* wms出入库规则 */
// 根据条件查询WMS出入库确认规则列表
export const getWmsConfirmRules = (params) => {
    return request({
        url: `/api-otp/wmsConfirmRules`,
        method: 'get',
        params
    });
};

// 批量更新WMS出入库规则
export const batchUpdateWmsConfirmRules = (data) => {
    return request({
        url: `/api-otp/wmsConfirmRule/batchCreateOrUpdate`,
        method: 'post',
        data
    });
};

// 批量删除WMS出入库规则
export const batchDeleteWmsConfirmRules = (data) => {
    return request({
        url: `/api-otp/wmsConfirmRule/batchDeleteByBusinessKey`,
        method: 'delete',
        data
    });
};

/* 仓库配置 */
// 根据条件查询仓库配置列表
export const getWhConfigs = (params) => {
    return request({
        url: `/api-otp/whConfigs`,
        method: 'get',
        params
    });
};

// 批量更新仓库配置
export const batchUpdateWhConfig = (data) => {
    return request({
        url: `/api-otp/whConfig/batchCreateOrUpdate`,
        method: 'post',
        data
    });
};

// 批量删除仓库配置
export const batchDeleteWhConfig = (data) => {
    return request({
        url: `/api-otp/whConfig/batchDeleteByBusinessKey`,
        method: 'delete',
        data
    });
};
/* 计费业务规则 */
// 根据条件查询列表
export const getBusineesFeeConfigs = (params) => {
    return request({
        url: `/api-otp/busineesFeeConfigs`,
        method: 'get',
        params
    });
};

// 批量更新配置
export const batchUpdateBusineesFeeConfigs = (data) => {
    return request({
        url: `/api-otp/busineesFeeConfig/batchCreateOrUpdate`,
        method: 'post',
        data
    });
};

// 批量删除配置
export const batchDeleteBusineesFeeConfigs = (data) => {
    return request({
        url: `/api-otp/busineesFeeConfig/batchDeleteByBusinessKey`,
        method: 'delete',
        data
    });
};

/* 装卸计费规则 */
// 装卸计费规则列表
export const charRulesList = (params) => {
    return request({
        url: `/api-otp/loadingFeeRules`,
        method: 'get',
        params
    });
};

// 装卸计费规则列表修改
export const charRulesEdit = (data) => {
    return request({
        url: `/api-otp/loadingFeeRule/batchCreateOrUpdate`,
        method: 'post',
        data
    });
};

// 装卸计费规则列表删除
export const charRulesDelete = (data, id) => {
    return request({
        url: `/api-otp/loadingFeeRules/${id}`,
        method: 'delete',
        data
    });
};

/* 订单拆单规则 */
// 根据条件查询列表
export const getApartRules = (params) => {
    return request({
        url: `/api-otp/apartRules`,
        method: 'get',
        params
    });
};

// 批量更新订单拆单
export const batchCreateOrUpdate = (data) => {
    return request({
        url: `/api-otp/apartRule/batchCreateOrUpdate`,
        method: 'post',
        data
    });
};

// 批量删除订单拆单
export const batchDeleteByBusinessKey = (data) => {
    return request({
        url: `/api-otp/apartRule/batchDeleteByBusinessKey`,
        method: 'delete',
        data
    });
};

/* 任务下发规则 */
// 根据条件查询列表
export const getIssueRules = (params) => {
    return request({
        url: `/api-otp/issueRules`,
        method: 'get',
        params
    });
};

// 批量更新任务下发规则
export const issueRuleBatchCreateOrUpdate = (data) => {
    return request({
        url: `/api-otp/issueRule/batchCreateOrUpdate`,
        method: 'post',
        data
    });
};

// 批量删除任务下发规则
export const issueRuleBatchDeleteByBusinessKey = (data) => {
    return request({
        url: `/api-otp/issueRule/batchDeleteByBusinessKey`,
        method: 'delete',
        data
    });
};

// 起运方量列表及查询
export const shipmentQuantity = (params) => {
    return request({
        url: `/api-otp/deliveryRules`,
        method: 'get',
        params
    });
};

// 起运方量新增
export const shipmentQuantityAdd = (data) => {
    return request({
        url: `/api-otp/deliveryRule/batchCreateOrUpdate`,
        method: 'post',
        data
    });
};

// 起运方量删除
export const shipmentQuantityDelete = (data, id) => {
    return request({
        url: `/api-otp/deliveryRules/${id}`,
        method: 'delete',
        data
    });
};

/* 项目分类配置 */
// 根据条件查询列表
export const getProjectClassifyConfigs = (params) => {
    return request({
        url: `/api-otp/projectClassifyConfigs`,
        method: 'get',
        params
    });
};

// 批量更新
export const batchUpdateProjectClassifyConfig = (data) => {
    return request({
        url: `/api-otp/projectClassifyConfig/batchCreateOrUpdate`,
        method: 'post',
        data
    });
};

// 批量删除
export const batchDeleteProjectClassifyConfig = (data) => {
    return request({
        url: `/api-otp/projectClassifyConfigs/${data.join(',')}`,
        method: 'delete'
    });
};

/* 订单分仓规则 */
// 根据条件查询列表
export const compartRules = (params) => {
    return request({
        url: `/api-otp/compartRules`,
        method: 'get',
        params
    });
};

// 批量更新任务下发规则
export const compartRuleBatchCreateOrUpdate = (data) => {
    return request({
        url: `/api-otp/compartRule/batchCreateOrUpdate`,
        method: 'post',
        data
    });
};

// 批量删除任务下发规则
export const compartRuleBatchDeleteByBusinessKey = (data) => {
    return request({
        url: `/api-otp/compartRule/batchDeleteByBusinessKey`,
        method: 'delete',
        data
    });
};

// 客户配置列表及查询
export const customerList = (params) => {
    return request({
        url: `/api-otp/customerConfigs`,
        method: 'get',
        params
    });
};

// 客户配置批量新增/修改
export const customerAdd = (data) => {
    return request({
        url: `/api-otp/customerConfig/batchCreateOrUpdate`,
        method: 'post',
        data
    });
};

// 客户配置批量删除
export const customerDelete = (data) => {
    return request({
        url: `/api-otp/customerConfig/batchDeleteByBusinessKey`,
        method: 'delete',
        data
    });
};

// 里程列表/查询
export const getMileageList = (params) => {
    return request({
        url: `/api-otp/adressMileages`,
        method: 'get',
        params
    });
};

// 里程新增
export const addMileage = (data) => {
    return request({
        url: `/api-otp/adressMileage/batchCreateOrUpdate`,
        method: 'post',
        data
    });
};

// 里程删除
export const deleteMileage = (data) => {
    return request({
        url: `/api-otp/adressMileage/batchDeleteByBusinessKey`,
        method: 'delete',
        data
    });
};

// 配送方式规则删除
export const deleteShippingTypeRules = (data) => {
    return request({
        url: `/api-otp/shippingTypeRule/batchDeleteByBusinessKey`,
        method: 'delete',
        data
    });
};

// 配送方式规则新增/修改
export const addShippingTypeRules = (data) => {
    return request({
        url: `/api-otp/shippingTypeRule/batchCreateOrUpdate`,
        method: 'post',
        data
    });
};

// 配送方式导出
export const excelExport = (params) => {
    return request({
        url: `/api-otp/export/shippingType`,
        method: 'post',
        params
    });
};

/* 虚拟客户配置 */
// 列表
export const getCustomerContractConfigs = (params) => {
    return request({
        url: `/api-otp/customerContractConfigs`,
        method: 'get',
        params
    });
};

// 修改
export const customerContractConfigEdit = (data) => {
    return request({
        url: `/api-otp/customerContractConfig/batchCreateOrUpdate`,
        method: 'post',
        data
    });
};

// 删除
export const customerContractConfigDelete = (data) => {
    return request({
        url: `/api-otp/customerContractConfig/batchDeleteByBusinessKey`,
        method: 'delete',
        data
    });
};

// 是否第三方列表
export const thirdPartyList = (params) => {
    return request({
        url: `/api-otp/thirdPartRules`,
        method: 'get',
        params
    });
};

// 是否第三方新增/thirdPartRule
export const thirdPartyAdd = (data) => {
    return request({
        url: `/api-otp/thirdPartRule/batchCreateOrUpdate`,
        method: 'post',
        data
    });
};

// 是否第三方删除/thirdPartRule/batchDeleteByBusinessKey
export const thirdPartyDel = (data) => {
    return request({
        url: `/api-otp/thirdPartRule/batchDeleteByBusinessKey`,
        method: 'DELETE',
        data
    });
};
