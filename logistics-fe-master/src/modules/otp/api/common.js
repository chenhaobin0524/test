/**
 * 公用请求
*/
import request from '@/utils/http';
// 根据code从数据字典获取
export const getDictionaryDetailByCode = (params) => {
    return request({
        url: `/api-mdm/dictionaryDetail/dict`,
        method: 'get',
        params
    });
};