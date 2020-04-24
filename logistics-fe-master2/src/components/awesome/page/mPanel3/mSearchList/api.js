import request from '@/utils/http';
// 字典值
export const dict = (popPrefix, params) => {
    return request({
        url: popPrefix,
        method: 'get',
        params: params
    }).then(res => res);
};
// 远程搜索
export const longRange = (longPrefix, params) => {
    return request({
        url: longPrefix,
        method: 'post',
        data: params
    }).then(res => res);
};
