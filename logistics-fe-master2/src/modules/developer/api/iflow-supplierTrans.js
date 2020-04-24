import request from '@/utils/http';

const supplierTrans = {
    // 首页查询
    getLists(params) {
        params.tenantCode = '1';
        return request({
            url: '/web-bms/transRate/search',
            method: 'post',
            data: params
        }).then(res => res);
    },
    // 双击进入明细页面的查询
    getDetails(params) {
        // params.tenantCode = '1';
        return request({
            url: `/web-bms/transRate/rowDbSearch/${params}`,
            method: 'get'
        }).then(res => res);
    },
    // 刷新明细信息 -- 详情界面
    loadDetails(params) {
        params.tenantCode = '1';
        return request({
            url: `/web-bms/transRateItem/search`,
            method: 'post',
            data: params
        }).then(res => res);
    },
    // 刷新明细信息 -- 编辑界面
    loadingDetails(params) {
        params.tenantCode = '1';
        return request({
            url: `/web-bms/transRateItemMip/search`,
            method: 'post',
            data: params
        }).then(res => res);
    },
    // 费率变更操作 -- 首页查询、详情界面
    transRateUpdate(params) {
        // params.tenantCode = '1';
        return request({
            url: `/web-bms/transRateMip/transRateUpdate/${params}`,
            method: 'get',
            data: params
        }).then(res => res);
    },
    // 新增保存单据信息（编辑界面）
    transRateMipCreat(params) {
        params.tenantCode = '1';
        return request({
            url: `/web-bms/transRateMip/creat`,
            method: 'post',
            data: params
        }).then(res => res);
    },
    // 变更保存单据信息（编辑界面）
    transRateMipUpdate(params) {
        params.tenantCode = '1';
        return request({
            url: `/web-bms/transRateMip/update`,
            method: 'post',
            data: params
        }).then(res => res);
    },
    // 保存明细信息（编辑界面）
    saveRateDetail(params) {
        params.tenantCode = '1';
        return request({
            url: `/web-bms/transRateItemMip/saveOrUpdate`,
            method: 'post',
            data: params
        }).then(res => res);
    },
    // 查询首页导出功能
    export(params) {
        params.tenantCode = '1';
        return request({
            url: '/web-bms/transRate/exportTransRateForExcel',
            method: 'post',
            data: {
                ...params
            },
            responseType: 'arraybuffer'
        }).then(res => res);
    }

};
export default supplierTrans;
