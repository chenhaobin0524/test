import request from '@/utils/http';
// 省市四级联动
export const city = (params) => {
    return request({
        url: '/api-mdm/searchEbPlace',
        method: 'get',
        params: params
    }).then(res => res);
};
