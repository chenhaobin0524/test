import request from '@/utils/http';

// 打印校验
export const printCheck = (data) => {
    return request({
        url: `/api-otp/dispatch/printCheck`,
        method: 'get',
        params: data
    });
};

// 头部查询
export const getDispathOrderLists = (data) => {
    return request({
        url: `/api-otp/dispatch/search`,
        method: 'post',
        data
    });
};

// 发车单管理编辑
export const getDispathOrderEdit = (data) => {
    return request({
        url: `/api-otp/dispatch/${data.dispatchNo}`,
        method: 'get',
        data
    });
};

// 到车
export const getDispathOrderRegister = (data) => {
    return request({
        url: `/api-otp/dispatch/updatearrive`,
        method: 'put',
        data
    });
};

// 取消到车
export const getDispathOrderNoRegister = (data) => {
    return request({
        url: `/api-otp/dispatch/cancelarrive`,
        method: 'put',
        data
    });
};

// 取消发车单
export const getDispathOrderNoInitiationSlip = (data) => {
    return request({
        // url: `/api-otp/dispatch/canceldepart`,
        url: `/api-otp/intelligent/cancel`,
        method: 'put',
        data
    });
};

// 发车
export const getDispathOrderStart = (data) => {
    return request({
        url: `/api-otp/dispatch/updatedepart`,
        method: 'put',
        data
    });
};

// 获取仓库信息
export const getDispathOrderPrinting = (params) => {
    return request({
        url: `/api-otp/dispatch/warehouse/dispatchinfo`,
        method: 'get',
        params
    });
};

// 打印
export const getDispathOrderWarehouse = (params) => {
    return request({
        url: `/api-otp/dispatch/print`,
        method: 'get',
        params
    });
};
// 供应商保存
export const getDispathOrderPreservation = (data) => {
    return request({
        url: `/api-otp/dispatch/updateeditdispatchinfo`,
        method: 'put',
        data
    });
};

// 打印（次数）
export const updataPrintTimes = (data) => {
    return request({
        url: `/api-otp/dispatch/updatePrintTimes`,
        method: 'put',
        data
    });
};

// 运输单状态数据字典接口（用于本地存储）
export const taskStatuLists = (data) => {
    return request({
        url: `/api-mdm/mdmDataDictionaryDetails?dictCode=TRANSPORT_STATUS`,
        method: 'get',
        data
    });
};
// 设备绑定/修改/解绑
export const saveupdatecancledevice = (data) => {
    return request({
        url: `/api-otp/dispatch/saveupdatecancledevice`,
        method: 'put',
        data
    });
};
// 导出
export const dispatchExport = (data) => {
    return request({
        url: `/api-otp/export/dispatch`,
        method: 'post',
        data
    });
};