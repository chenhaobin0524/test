import request from '@/utils/http';

// 查询发车单详情
export const getDispatchLists = (data) => {
    return request({
        url: `/api-otp/dispatch/${data}`,
        method: 'get'
    });
};

// 根据发车单号查询运输单商品明细
export const getSearchdetails = (data) => {
    return request({
        url: `/api-otp/dispatch/searchdetail/${data}`,
        method: 'get'
    });
};

// 根据发车单号查询运输单列表(装货)
export const getSearchtransports = (data) => {
    return request({
        url: `/api-otp/dispatch/searchtransport/sitegroup/${data}`,
        method: 'get'
    });
};

// 根据发车单号查询运输单站点分组列表卸货（卸货）
export const getDischargeCargo = (data) => {
    return request({
        url: `/api-otp/dispatch/searchtransport/sitegroupunload/${data}`,
        method: 'get'
    });
};

// 手工装车(保存)
export const getHandLoadings = (data) => {
    return request({
        url: `/api-otp/dispatch/updateload`,
        method: 'put',
        data
    });
};

// 取消装车
export const getCellHandLoadings = (data) => {
    return request({
        url: `/api-otp/dispatch/cancelload`,
        method: 'put',
        data
    });
};

// 操作日志
export const getOperationLog = (data) => {
    return request({
        url: `/api-otp/dispatch/trace/log`,
        method: 'post',
        data
    });
};

// 发车单行车路径调整
export const getPathAdjustment = (data) => {
    return request({
        url: `/api-otp/dispatch/pathadjustment`,
        method: 'put',
        data
    });
};

// 发车单详情顶部步骤条路由
export const getStepLists = (data) => {
    return request({
        url: `/api-otp/dispatch/route/dispatchstatus/${data}`,
        method: 'get'
    });
};

// 抵达
export const getArriveLists = (data) => {
    return request({
        url: `/api-otp/dispatch/updatehandlearrivedcust`,
        method: 'put',
        data
    });
};

// 取消抵达
export const getArriveCellLists = (data) => {
    return request({
        url: `/api-otp/dispatch/updatecancelarrivedcust`,
        method: 'put',
        data
    });
};

// 到车
export const getDispathOrderRegister = (data) => {
    return request({
        url: `/api-otp/dispatch/updatearrivesite`,
        method: 'put',
        data
    });
};

// 取消到车
export const getCancelarrivesite = (data) => {
    return request({
        url: `/api-otp/dispatch/cancelarrivesite`,
        method: 'put',
        data
    });
};

// 最优路径计算
export const getOptimalPathComputation = (data) => {
    return request({
        url: `/api-otp/dispatchData/getSiteBySystem/${data}`,
        method: 'get',
        data
    });
};

// 发车单装卸货列表查询和里程查询(列表)
export const getoptimizationLists = (data) => {
    return request({
        url: `/api-otp/dispatchData/getDataWithTransports/${data}/0`,
        method: 'get'
    });
};

// 发车单装卸货列表查询和里程查询
export const getOptimizationDialogLists = (data) => {
    return request({
        url: `/api-otp/dispatchData/getDataWithTransports/${data}/1`,
        method: 'get'
    });
};

// 装货确认
export const getConfirmations = (data) => {
    return request({
        url: `/api-otp/dispatch/loadconfirm`,
        method: 'put',
        data
    });
};

// 发车单状态数据字典接口（用于本地存储）
export const dispatchStatusLists = (data) => {
    return request({
        url: `/api-mdm/mdmDataDictionaryDetails?dictCode=DISPATCH_STATUS`,
        method: 'get',
        data
    });
};

// 是否标识数据字典接口（用于本地存储）
export const isYN = (data) => {
    return request({
        url: `/api-mdm/mdmDataDictionaryDetails?dictCode=YES_OR_NO`,
        method: 'get',
        data
    });
};