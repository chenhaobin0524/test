import request from '@/utils/http';

const arriveRecord = {
    // 已完成排队的常量
    QUEUE_STATUS_FINISH: 20,
    // 获取排队列表
    vehicleList(params) {
        return request({
            url: '/api-mobile/driverQueue',
            method: 'get',
            params: params
        });
    },
    // 获取操作记录列表
    recordList(params) {
        return request({
            url: '/api-mobile/driverQueue/trace',
            method: 'get',
            params: params
        });
    },
    // 数据字典
    dict(params) {
        return request({
            url: '/api-mdm/dictionaryDetail/dict',
            method: 'get',
            params: params
        }).then(res => res);
    },
    // 组织架构
    getOrgOptions() {
        return request({
            url: '/api-mobile/driverDispatch/companyAndSite',
            method: 'get',
            params: { pageSize: 9999 }
        });
    },
    // 操作按钮优先/过号/异常排队
    driverQueue(params) {
        return request({
            url: '/api-mobile/driverQueue',
            method: 'put',
            data: params
        });
    }
};
export default arriveRecord;