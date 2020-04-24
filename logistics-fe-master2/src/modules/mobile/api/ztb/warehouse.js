import request from '@/utils/http';

const warehouseEvaluation = {
    get(params) {
        return request({
            url: '/api-gwms/basic/proOrderInfos/list',
            method: 'post',
            data: params
        });
    }
};
export default warehouseEvaluation;