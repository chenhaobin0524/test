import request from '@/utils/http';
// 查询列表
export const getLists = (params) => {
    return request({
        url: `/api-otp/abnormalClaim/search`,
        method: 'post',
        data: params
    }).then(res => res);
};
// 提交
export const submit = (params) => {
    return request({
        url: `/api-otp/abnormalClaim/submit`,
        method: 'post',
        data: params
    }).then(res => res);
};
// 配送审核
export const examine = (params) => {
    return request({
        url: `/api-otp/abnormalClaim/examine`,
        method: 'post',
        data: params
    }).then(res => res);
};
// 索赔审核
export const cliamExamine = (params) => {
    return request({
        url: `/api-otp/abnormalClaim/cliamExamine`,
        method: 'post',
        data: params
    }).then(res => res);
};
// 新增
export const add = (params) => {
    return request({
        url: `/api-otp/abnormalClaim`,
        method: 'post',
        data: params
    }).then(res => res);
};
// 修改
export const edit = (params) => {
    return request({
        url: `/api-otp/abnormalClaim/updateAbnormalClaim`,
        method: 'post',
        data: params
    }).then(res => res);
};
// 上传
export const upload = (params) => {
    return request({
        url: `/api-otp/abnormalClaim/uploadClaimConfirmation`,
        method: 'post',
        data: params
    }).then(res => res);
};
// 图片删除
export const deletePicture = (params) => {
    return request({
        url: `/api-otp/abnormalClaim/deletePicture`,
        method: 'post',
        data: params
    }).then(res => res);
};
// 运输单/客户订单号 =》查承运商和司机的接口
export const findCarrierAndDriver = (params) => {
    return request({
        url: `/api-otp/abnormalClaim/findCarrierAndDriver`,
        method: 'post',
        data: params
    }).then(res => res);
};