import request from '@/utils/http';
// 查询 bucket 列表
export const addCrenel = (params) => {
    return request({
        url: `/api-mobile/dn/crenel`,
        method: 'POST',
        data: params
    }).then(res => res);
};

export const getCrenels = (page, pageSize) => {
    return request({
        url: `/api-mobile/dn/crenels`,
        method: 'GET',
        params: {
            pageSize: pageSize,
            pageNo: page
        }
    }).then(res => res);
};
export const enableCrenel = (id, crenelCode, crenelName, crenelStatus, serialNumber, version) => {
    return request({
        url: `/api-mobile/dn/crenel/` + id,
        method: 'PUT',
        data: {
            crenelCode: crenelCode,
            crenelStatus: crenelStatus,
            crenelName: crenelName,
            serialNumber: serialNumber,
            version: version
        }
    }).then(res => res);
};
