import request from '@/utils/http';
// 弹框搜索
export const popSit = (advancePrefix, url, params, ajaxType) => {
    const paramsObj = {
        url: advancePrefix + url,
        method: ajaxType || 'get'
    };
    paramsObj[ajaxType ? 'data' : 'params'] = params;
    return request(paramsObj).then(res => res);
};
export default popSit;
