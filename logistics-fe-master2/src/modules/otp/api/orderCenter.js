/**
 * 订单中心请求
 */
import request from '@/utils/http';

// 基础数据商品选择
export const getSearchByMaterial = (params) => {
    return request({
        url: `/api-mdm/cdCommonMaterial/searchByMaterial`,
        method: 'get',
        params
    });
};

// 根据条件查询配送规则列表
export const getCustomerOrderInfos = (params) => {
    return request({
        url: `/api-otp/customerOrderInfos`,
        method: 'get',
        params
    });
};

// 订单中心新增修改
export const addOrUpdateCustomerOrderInfo = (data) => {
    return request({
        url: `/api-otp/converged/addOrUpdateCustomerOrderInfo`,
        method: 'post',
        data
    });
};
// 订单中心地址修改
export const updateCustomerAddress = (data) => {
    return request({
        url: `/api-otp/converged/updateCustomerAddress`,
        method: 'post',
        data
    });
};

// 订单中心修改查询
export const getCustomerOrderInfo = (params, id) => {
    return request({
        url: `/api-otp/converged/getCustomerOrderInfo/${id}`,
        method: 'get',
        params
    });
};

// 订单中心详情
export const getOrderDetail = (params) => {
    return request({
        url: `/api-otp/converged/orderAndTaskDetails`,
        method: 'get',
        params
    });
};

// 订单路由
export const resInfos = (params) => {
    return request({
        url: `/api-otp/orderTraces`,
        method: 'get',
        params
    });
};

// 订单审核
export const orderVrify = (data) => {
    return request({
        url: `/api-otp/order/verify`,
        method: 'put',
        data
    });
};

// 订单复制
export const copyOrEditCustomerOrder = (params) => {
    return request({
        url: `/api-otp/converged/copyOrEditCustomerOrder`,
        method: 'get',
        params
    });
};

// 订单操作日志
export const getLog = (params) => {
    return request({
        url: `/api-otp/orderLogs`,
        method: 'get',
        params
    });
};

// 订单中心根据条件查询任务表列表
export const getTaskList = (params) => {
    return request({
        url: `/api-otp/taskItems`,
        method: 'get',
        params
    });
};

// 订单分仓查询
export const separateWarehouseSearch = (params) => {
    return request({
        url: `/api-otp/separateWarehouse/search`,
        method: 'get',
        params
    });
};

// 订单分仓确认
export const separateWarehouseConfirm = (data) => {
    return request({
        url: `/api-otp/separateWarehouse/confirm`,
        method: 'post',
        data
    });
};
// 取消分仓
export const separateWarehouseCancel = (data) => {
    return request({
        url: `/api-otp/separateWarehouse/cancel`,
        method: 'post',
        data
    });
};

// 视图建单
export const viewCreateOrder = (data) => {
    return request({
        url: `/api-otp/converged/viewCreateOrder`,
        method: 'post',
        data
    });
};

// 预约
export const appointment = (data) => {
    return request({
        url: `/api-otp/converged/appointment`,
        method: 'post',
        data
    });
};

// 冲销 /order/innerCancel
export const chargeOff = (data) => {
    return request({
        url: `/api-otp/order/innerCancel`,
        method: 'post',
        data
    });
};

// 关单查询明细列表
export const listCustomOrderItemsByOrderNos = (data) => {
    return request({
        url: `/api-otp/customerOrderInfo/listCustomOrderItemsByOrderNos`,
        method: 'post',
        data
    });
};

// 关单
export const closedCustomerOrderStatusMans = (data) => {
    return request({
        url: `/api-otp/order/closedCustomerOrderStatusMans`,
        method: 'post',
        data
    });
};
// 验证是否能关单
export const checkIsCanCloseOrder = (data) => {
    return request({
        url: `/api-otp/order/checkIsCanCloseOrder`,
        method: 'post',
        data
    });
};
// 点击修改，查询是否有子单
export const selectOne = (data) => {
    return request({
        url: '/api-otp/orderInfo/selectOne',
        method: 'post',
        data
    }).then(res => res);
};
// 拦截
export const routeIntercept = (data) => {
    return request({
        url: `/api-otp/routeIntercept`,
        method: 'post',
        data
    });
};
// Mip库存账务调账流程接口
export const workflowConfigs = (data) => {
    return request({
        url: `api-iflow/workflowConfigs`,
        method: 'post',
        data
    });
};
// 获取Mip的Url
export const mipIflowCreateDraft = (data) => {
    return request({
        url: `/api-otp/mipIflowCreateDraft`,
        method: 'post',
        data
    });
};
// 提交mip流程
export const createProcess = (data) => {
    return request({
        url: `/api-iflow/approveProcess?tenantCode=${data.tenantCode}&appCode=${data.currentApplicationCode}`,
        method: 'post',
        data
    }).then(res => res);
};
// 查询有没有mip流程
export const mipExecutionLogs = (data) => {
    return request({
        url: '/api-otp/mipExecutionLogs',
        method: 'post',
        data
    }).then(res => res);
};
// 新增流程表单
export const createMipForm = (data) => {
    return request({
        url: '/api-otp/mipForm',
        method: 'post',
        data
    }).then(res => res);
};
// 流程表单查询
export const getMipForm = (params) => {
    return request({
        url: '/api-otp/mipForm/selectOne',
        method: 'get',
        params
    }).then(res => res);
};
// 新增流程表单
export const createMipFile = (data) => {
    return request({
        url: '/api-otp/mipFile/insertBatch',
        method: 'post',
        data
    }).then(res => res);
};
// 附件删除
export const delMipFile = (data) => {
    return request({
        url: `/api-otp/mipFile/${data}`,
        method: 'delete'
    }).then(res => res);
};