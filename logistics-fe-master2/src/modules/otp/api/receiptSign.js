import request from '@/utils/http';

// 首页列表数据
export const receiptList = (params) => {
    return request({
        url: `/api-otp/receipt/list`,
        method: 'get',
        params
    });
};

// 逾期列表查询
export const receiptSearchoverdue = (params) => {
    return request({
        url: `/api-otp/receipt/searchoverdue/${params}`,
        method: 'get'
    });
};

// 首页列表数据
export const receiptDetail = (params) => {
    return request({
        url: `/api-otp/receipt/detail/${params}`,
        method: 'get'
    });
};

// 首页逾期接口
export const receiptOverdue = (data) => {
    return request({
        url: `/api-otp/receipt/overdue`,
        method: 'post',
        data
    });
};

// 首页签收接口 、 批量确认接口
export const receiptSign = (data) => {
    return request({
        url: `/api-otp/receipt/sign`,
        method: 'post',
        data
    });
};

// 首页拒收接口
export const receiptRejectsign = (data) => {
    return request({
        url: `/api-otp/receipt/rejectsign`,
        method: 'post',
        data
    });
};

// 上传图片
export const receiptUpload = (data) => {
    return request({
        url: `/api-otp/receipt/upload`,
        method: 'post',
        data
    });
};

// 删除图片
export const receiptDeleteReceiptpicture = (data) => {
    return request({
        url: `/api-otp/receipt/delete/receiptpicture`,
        method: 'delete',
        data
    });
};
// // 查询用户权限
// export const userdataAuth = (user, params = {}) => {
//     return request({
//         url: `/api-auth/user/${user}/dataAuth/D20190621009`,
//         method: 'get',
//         params
//     });
// };
// 仓库数据权限接口
export const userdataAuth = (user) => {
    return request({
        url: `/api-auth/getUserAllDataAuths?tenantCode=annto&userCode=${user}`,
        method: 'get'
    });
};
// 网点配送详情
export const deliveryDetailsList = (data) => {
    return request({
        url: `/api-otp/lastmile/receipt/detail/searchbyorder`,
        method: 'post',
        data
    });
};
// 网点配送详情附件查看
export const deliveryFiles = (data) => {
    return request({
        url: `/api-otp/lastmile/receipt/file/searchbyorder`,
        method: 'post',
        data
    });
};
// 网点配送详情确认
export const deliveryConfirm = (data) => {
    return request({
        url: `/api-otp/lastmile/receipt/net/confirm`,
        method: 'post',
        data
    });
};
// 网点配送详情驳回
export const deliveryReject = (data) => {
    return request({
        url: `/api-otp/lastmile/receipt/net/reject`,
        method: 'post',
        data
    });
};
export const getDictList = (params) => {
    return request({
        url: `/api-mdm/dictionaryDetail/dict`,
        method: 'get',
        params
    });
};
