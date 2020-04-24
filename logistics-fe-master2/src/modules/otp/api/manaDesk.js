import request from '@/utils/http';

// 接单量预警EA超过天数
export const ReceiptWarning6Day = (params) => {
    return request({
        url: `/api-bi/es/search`,
        method: 'get',
        params
    });
};
// 接单量预警EA未下发
export const Noordersissued = (params) => {
    return request({
        url: `/api-bi/es/search`,
        method: 'get',
        params
    });
};
// 接单量预警EA24H应下
export const HoursShouldLower = (params) => {
    return request({
        url: `/api-bi/es/search`,
        method: 'get',
        params
    });
};
// 发货预警EA超过天数
export const Unshipped6Day = (params) => {
    return request({
        url: `/api-bi/es/search`,
        method: 'get',
        params
    });
};
// 发货预警EA未发货
export const Unshipped = (params) => {
    return request({
        url: `/api-bi/es/search`,
        method: 'get',
        params
    });
};
// 发货预警EA24H应下
export const HourShouldshipped = (params) => {
    return request({
        url: `/api-bi/es/search`,
        method: 'get',
        params
    });
};
// 发货预警(m³)超过天数
export const Unshipped6DayCube = (params) => {
    return request({
        url: `/api-bi/es/search`,
        method: 'get',
        params
    });
};
// 发货预警(m³)未发货
export const UnshippedCube = (params) => {
    return request({
        url: `/api-bi/es/search`,
        method: 'get',
        params
    });
};
// 发货预警(m³)24H应下
export const HourShouldshippedCube = (params) => {
    return request({
        url: `/api-bi/es/search`,
        method: 'get',
        params
    });
};
// 签收预警逾期超过天数
export const SignAndReceiveWarning6Day = (params) => {
    return request({
        url: `/api-bi/es/search`,
        method: 'get',
        params
    });
};
// 签收预警未签收
export const Unsigned = (params) => {
    return request({
        url: `/api-bi/es/search`,
        method: 'get',
        params
    });
};
// 签收预警24H应下
export const HourShouldSign = (params) => {
    return request({
        url: `/api-bi/es/search`,
        method: 'get',
        params
    });
};
// 今日发车量
export const TodayDepartureNum = (params) => {
    return request({
        url: `/api-bi/es/search`,
        method: 'get',
        params
    });
};
// 发车量同比
export const TodayDepartureNumTB = (params) => {
    return request({
        url: `/api-bi/es/search`,
        method: 'get',
        params
    });
};
// 今日配送量
export const DistributionToday = (params) => {
    return request({
        url: `/api-bi/es/search`,
        method: 'get',
        params
    });
};
// 配送量同比
export const DistributionTodayTB = (params) => {
    return request({
        url: `/api-bi/es/search`,
        method: 'get',
        params
    });
};
// 今日签单量
export const SignatureVolumeToday = (params) => {
    return request({
        url: `/api-bi/es/search`,
        method: 'get',
        params
    });
};
// 签单量同比
export const SignatureVolumeTodayTB = (params) => {
    return request({
        url: `/api-bi/es/search`,
        method: 'get',
        params
    });
};
// 30天订单量
export const OrderQuantity = (params) => {
    return request({
        url: `/api-bi/es/search`,
        method: 'get',
        params
    });
};
// 消息公告列表
export const MessageLIST = (params) => {
    return request({
        url: `/api-msg/notices`,
        method: 'get',
        params
    });
};
// 卸货及时率（2B）
export const TimelyDischargeCargoRate2B = (params) => {
    return request({
        url: `/api-bi/es/search`,
        method: 'get',
        params
    });
};
// 出库及时率（2B）
export const TimelyOutRate2B = (params) => {
    return request({
        url: `/api-bi/es/search`,
        method: 'get',
        params
    });
};
// 出库及时率（2C）
export const TimelyOutRate2C = (params) => {
    return request({
        url: `/api-bi/es/search`,
        method: 'get',
        params
    });
};
// 退货及时率（2C）
export const TimelyReturnGoodsRate2C = (params) => {
    return request({
        url: `/api-bi/es/search`,
        method: 'get',
        params
    });
};
// 配送及时率（2B）
export const TimelyDeliveryRate = (params) => {
    return request({
        url: `/api-bi/es/search`,
        method: 'get',
        params
    });
};
// 回单及时率（2B）
export const TimelyReceiptRate = (params) => {
    return request({
        url: `/api-bi/es/search`,
        method: 'get',
        params
    });
};
// 退货及时率（2B）
export const TimelyReturnGoodsRate2B = (params) => {
    return request({
        url: `/api-bi/es/search`,
        method: 'get',
        params
    });
};
// 支线及时率（2C）
export const TimelyFeederLineRate2C = (params) => {
    return request({
        url: `/api-bi/es/search`,
        method: 'get',
        params
    });
};
// 全链路签收及时率（2C）
export const TimelyFullLinkRate2C = (params) => {
    return request({
        url: `/api-bi/es/search`,
        method: 'get',
        params
    });
};
// 工单及时率（2C）
export const TimelyWorkOrderRate2C = (params) => {
    return request({
        url: `/api-bi/es/search`,
        method: 'get',
        params
    });
};
// 仓库数据权限接口
export const userdataAuth = (user) => {
    return request({
        url: `/api-auth/getUserAllDataAuths?tenantCode=annto&userCode=${user}`,
        method: 'get'
    });
};
// 排序
export const getList = {
    post(params) {
        return request({
            url: '/api-auth/userIndividualConfigs/saveOrUpdate',
            method: 'post',
            data: params
        }).then(res => res);
    },
    get(params) {
        return request({
            url: '/api-auth/userIndividualConfigs/param',
            method: 'post',
            data: params
        }).then(res => res);
    }
};