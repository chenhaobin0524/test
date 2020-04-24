import request from '@/utils/http';

export default {
    parkLoc(params, cancelToken = () => {}) {
        return request({
            url: '/api-mobile/screen/pg/parkLoc',
            method: 'post',
            data: params,
            cancelToken: new request.CancelToken(cancelToken)
        });
    }
};