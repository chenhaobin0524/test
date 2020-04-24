import request from '@/utils/http';
// 首页表格数据
export const getAreaList = (params) => {
    return request({
        url: `/api-otp/area/search`,
        method: 'post',
        data: params
    });
};
// 首页新增接口 与 编辑 保持
export const areaSave = (params) => {
    return request({
        url: `/api-otp/area/save`,
        method: 'post',
        data: params
    });
};
// 首页 获取下载模板信息
export const getModifyTime = () => {
    return request({
        url: `/api-otp/area/getModifyTime`,
        method: 'get'
    });
};
// 导出数据
export const excelExport = (params) => {
    return request({
        url: `/api-otp/export/area`,
        method: 'post',
        data: params
    });
};
// 首页表格数据 状态改变
export const updateStatus = (params) => {
    return request({
        url: `/api-otp/area/updateStatus`,
        method: 'put',
        data: params
    });
};
// 编辑 上表格删除接口
export const areachargeDelete = (params) => {
    return request({
        url: `/api-otp/areacharge/delete`,
        method: 'delete',
        data: params
    });
};
// 编辑 下表格删除接口
export const areadestinationDelete = (params) => {
    return request({
        url: `/api-otp/areadestination/delete`,
        method: 'delete',
        data: params
    });
};
// // 查询平台
// export const queryPopSite = (params) => {
//     return request({
//         url: `http://lsitapi.midea.com/api-mdm/esCompany/popSite`,
//         method: 'get',
//         params
//     });
// };
// 编辑查询数据 上表格
export const areacharge = (params) => {
    return request({
        url: `/api-otp/areacharge/${params}?pageSize=30000`,
        method: 'get'
    });
};
// 编辑查询数据 下表格
export const areadestination = (params) => {
    return request({
        url: `/api-otp/areadestination/${params}?pageSize=30000`,
        method: 'get'
    });
};
// 编辑查询数据 用户详情
export const tenantUserInfos = (params) => {
    return request({
        url: `/api-auth/tenantUserInfos`,
        method: 'get',
        params
    });
};
