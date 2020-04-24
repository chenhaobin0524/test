import request from '@/utils/http';

// 查询
export const getLists = (data) => {
    return request({
        url: `/api-otp/dispatch/searchloadsonglist`,
        method: 'post',
        data
    });
};

// 重新推送
export const getAgainLists = (data) => {
    return request({
        url: `/api-otp/dispatch/pushtoloadsong`,
        method: 'post',
        data
    });
};

// 编辑保存
export const getUpdateLists = (data) => {
    return request({
        url: `/api-otp/dispatch/updateloadsong`,
        method: 'put',
        data
    });
};

// G7页面删除
export const deleteList = (data) => {
    return request({
        url: `/api-otp/dispatch/deleteloadsong/${data}`,
        method: 'delete'
    });
};
// 导出
export const noCarPushLogExport = (data) => {
    return request({
        url: `/api-otp/export/noCarPushLog`,
        method: 'post',
        data
    });
};