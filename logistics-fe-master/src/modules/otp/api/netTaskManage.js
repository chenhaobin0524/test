import request from '@/utils/http';
// 查询列表
export const getLists = (params) => {
    return request({
        url: `/api-otp/netTasks`,
        method: 'post',
        data: params
    }).then(res => res);
};
// 网点签收上传图片
export const netUpload = (params) => {
    return request({
        url: `/api-otp/netImagesSave`,
        method: 'post',
        data: params
    });
};
// 终端签收上传图片
export const finalUpload = (params) => {
    return request({
        url: `/api-otp/finalImagesSave`,
        method: 'post',
        data: params
    });
};
// 网点签收、终端签收查询
export const netTaskLists = (params) => {
    return request({
        url: `/api-otp/netTaskItems`,
        method: 'post',
        data: params
    });
};
// 网点派工
export const netDispatch = (params) => {
    return request({
        url: `/api-otp/netDispatch`,
        method: 'post',
        data: params
    });
};
// 网点签收弹框确认
export const networkSign = (params) => {
    return request({
        url: `/api-otp/networkSign`,
        method: 'post',
        data: params
    });
};
// 终端签收弹框确认
export const finalSign = (params) => {
    return request({
        url: `/api-otp/finalSign`,
        method: 'post',
        data: params
    });
};
// 网点入库弹框确认
export const netInfoIn = (params) => {
    return request({
        url: `/api-otp/netInfoIn`,
        method: 'post',
        data: params
    });
};
// 网点出库弹框确认
export const netInfoOut = (params) => {
    return request({
        url: `/api-otp/netInfoOut`,
        method: 'post',
        data: params
    });
};
// 网点预约
export const networkAppointment = (params) => {
    return request({
        url: `/api-otp/networkAppointment`,
        method: 'post',
        data: params
    });
};
// 查看图片
export const orderImages = (params) => {
    return request({
        url: `/api-otp/orderImages`,
        method: 'post',
        data: params
    });
};
// 删除图片
export const delImages = (params) => {
    return request({
        url: `/api-otp/orderImage/${params}`,
        method: 'delete'
    });
};
// 详情
export const taskDetail = (params) => {
    return request({
        url: `/api-otp/taskDetail`,
        method: 'get',
        params
    });
};
// 详情table分页查询
export const netTaskItemsPage = (data) => {
    return request({
        url: `/api-otp/netTaskItemsPage`,
        method: 'post',
        data
    });
};
// 获取工程师
export const getEngineers = (params) => {
    return request({
        url: `/api-otp/engineers`,
        method: 'get',
        params
    });
};
// 导出
export const netTaskExport = (data) => {
    return request({
        url: `/api-otp/netTaskExport`,
        method: 'post',
        data
    });
};

export const netOrderLogs = (data) => {
    return request({
        url: `/api-otp/netOrderLogs`,
        method: 'post',
        data
    });
};
export const orderPrint = (data) => {
    return request({
        url: `/api-otp/netTask/printf`,
        method: 'get',
        params: data
    });
};