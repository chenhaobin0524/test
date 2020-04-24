import request from '@/utils/http';
const whloc = {
    save(params) {
        return request({
            url: '/api-gwms/basic/whLocs/saveOrUpdate',
            method: 'post',
            data: params
        }).then(res => res);
    },
    get(params) {
        return request({
            url: '/api-gwms/basic/whLocs/list',
            method: 'post',
            data: {
                ...params
            }
        }).then(res => res);
    }
};
export default whloc;