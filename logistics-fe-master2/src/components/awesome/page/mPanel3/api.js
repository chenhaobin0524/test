import request from '@/utils/http';
// 库区列表
export const getList = {
    post(url, params) {
        return request({
            url: url + '/userIndividualConfigs/saveOrUpdate',
            method: 'post',
            data: params
        }).then(res => res);
    },
    get(url, params) {
        return request({
            url: url + '/userIndividualConfigs/param',
            method: 'post',
            data: params
        }).then(res => res);
    }
};
export default getList;
