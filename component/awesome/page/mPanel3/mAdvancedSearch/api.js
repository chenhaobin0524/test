import request from '@/utils/http';
// 弹框搜索
export const popSit = (advancePrefix, url, params) => {
    return request({
        url: advancePrefix + url,
        method: 'get',
        params: { ...params }
    }).then(res => res);
};
export default popSit;
