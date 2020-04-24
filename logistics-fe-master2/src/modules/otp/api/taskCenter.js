/**
 * 订单中心请求
 */
import request from '@/utils/http';

// 根据条件查询配送规则列表
export const getSearchInfosApi = (params) => {
    return request({
        url: `/api-otp/task/searchTaskList`,
        method: 'get',
        params
    });
};

// 任务编辑
export const taskInfoEditApi = (params) => {
    return request({
        url: `/api-otp/converged/task/edit`,
        method: 'post',
        data: params
    });
};

// 任务详情
export const taskDetailInfoApi = (params) => {
    return request({
        url: `/api-otp/converged/task/searchTaskDetails`,
        method: 'get',
        params
    });
};
// 任务详情 带子单（预约功能需要）
export const searchTaskOrderDetails = (params) => {
    return request({
        url: `/api-otp/converged/task/searchTaskOrderDetails`,
        method: 'get',
        params
    });
};

// 任务详情日志
export const getTaskLogApi = (params) => {
    return request({
        url: `/api-otp/orderLogs`,
        method: 'get',
        params
    });
};

// 任务详情车程
export const getDetailTraces = (params) => {
    return request({
        url: `/api-otp/orderTraces`,
        method: 'get',
        params
    });
};

// 任务下发(by elin)
export const taskDistribute = (data) => {
    return request({
        url: `/api-otp/task/issue`,
        method: 'post',
        data
    });
};

// 任务预约 /converged/appointment
export const appointment = (data) => {
    return request({
        url: `/api-otp/converged/appointment`,
        method: 'post',
        data
    });
};

// 任务预约 /dispatch
export const getDispatchApi = (dispatchNo) => {
    return request({
        url: `/api-otp/dispatch/${dispatchNo}`,
        method: 'get'
    });
};

// 批量到车
export const carArrivedInfo = (data) => {
    return request({
        url: `/api-otp/converger/carArrivedInfo`,
        method: 'post',
        data
    });
};

// 任务列表撤回
export const retract = (params) => {
    return request({
        url: `/api-otp/task/retract`,
        method: 'get',
        params
    });
};

// 逾期登记
export const saveOverdueRegistration = (data) => {
    return request({
        url: `/api-otp/saveOverdueRegistration`,
        method: 'post',
        data
    });
};

// 货权转移
export const transferOfGoodsRight = (data) => {
    return request({
        url: `/api-otp/task/transferOfGoodsRight`,
        method: 'post',
        data
    });
};

// 查询符合货权转移出库任务列表
export const searchTaskOutList = (params) => {
    return request({
        url: `/api-otp/task/searchTaskOutList`,
        method: 'get',
        params
    });
};

// 关联协同
export const associatedCooperativeOrder = (data) => {
    return request({
        url: `/api-otp/task/associatedCooperativeOrder`,
        method: 'post',
        data
    });
};

// 获取时效列表
export const getOrderAgings = (params) => {
    return request({
        url: `/api-otp/orderAgings`,
        method: 'get',
        params
    });
};