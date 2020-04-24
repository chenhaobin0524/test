import request from '@/utils/http';

// 菜鸟增值列表
export const getValueAddedServices = (params) => {
    return request({
        url: `/api-otp/valueAddedServices`,
        method: 'get',
        params
    });
};

// 菜鸟增值服务单商品列表
export const getvalueAddedServiceItems = (params) => {
    return request({
        url: `/api-otp/valueAddedServiceItems`,
        method: 'get',
        params
    });
};

// 菜鸟增值单商品SN列表
export const getValueAddedServiceItemSns = (params) => {
    return request({
        url: `/api-otp/valueAddedServiceItemSns`,
        method: 'get',
        params
    });
};

/* 订单调整申请 */
// 列表
export const adjustApplys = (params) => {
    return request({
        url: `/api-otp/adjustApplys`,
        method: 'get',
        params
    });
};

// 通过id获取
export const adjustApplyById = (id) => {
    return request({
        url: `/api-otp/adjustApply/getAdjustApply/${id}`,
        method: 'get'
    });
};

// 修改
export const adjustApplysEdit = (data) => {
    return request({
        url: `/api-otp/adjustApply/saveOrUpdateAdjustApply`,
        method: 'post',
        data
    });
};

// 删除
export const adjustApplysDelete = (id) => {
    return request({
        url: `/api-otp/adjustApply/${id}`,
        method: 'delete'
    });
};
// 申请（支持批量）
export const submitAdjustApply = (ids) => {
    return request({
        url: `/api-otp/adjustApply/submitAdjustApply/${ids}`,
        method: 'get'
    });
};
// 取消申请（支持批量）
export const cancelAdjustApply = (ids) => {
    return request({
        url: `/api-otp/adjustApply/cancleAdjustApply/${ids}`,
        method: 'get'
    });
};

// 菜鸟增值服务单商品修改
export const batchUpdate = (data) => {
    return request({
        url: `/api-otp/valueAddedServiceItem/batchCreateOrUpdate`,
        method: 'post',
        data
    });
};

// 菜鸟增值商品服务单SN新增或保存valueAddedServiceItemSn/batchCreateOrUpdate
export const snBatchUpdate = (data) => {
    return request({
        url: `/api-otp/valueAddedServiceItemSn/batchCreateOrUpdate`,
        method: 'post',
        data
    });
};

// 菜鸟增值确认
export const statusUpload = (params) => {
    return request({
        url: `/api-otp/WMSInventoryStatusUpload`,
        method: 'get',
        params
    });
};

// 菜鸟增值关闭
export const orderConfirm = (params) => {
    return request({
        url: `/api-otp/valueAddedServicesOrderConfirm`,
        method: 'get',
        params
    });
};