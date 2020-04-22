import request from '@/utils/http';

export default {
    parkCars(params) {
        return request({
            url: '/api-mobile/iot/report/v1/parkCars',
            method: 'post',
            data: params
        });
    },
    mdmUsers(params) {
        return request({
            url: '/api-mobile/iot/report/v1/mdmUsers',
            method: 'post',
            data: params
        });
    },
    crenelGeomagnetisms(params) {
        return request({
            url: '/api-mobile/iot/report/v1/crenelGeomagnetisms',
            method: 'post',
            data: params
        });
    },
    crenelTimes(params) {
        return request({
            url: '/api-mobile/iot/report/v1/crenelTimes',
            method: 'post',
            data: params
        });
    },
    geoRelationsList(params) {
        return request({
            url: '/api-mobile/iot/v1/mobileLocGeoRelations/list',
            method: 'get',
            params
        });
    },
    // 道闸记录 同步入场
    syncCarIn(params) {
        return request({
            url: '/api-mobile/iot/v1/syncCarIn',
            method: 'post',
            data: params
        });
    },
    // 道闸记录 同步出场
    syncCarExit(params) {
        return request({
            url: '/api-mobile/iot/v1/syncCarExit',
            method: 'post',
            data: params
        });
    },
    // 人证记录 同步访问记录
    syncMdmUser(params) {
        return request({
            url: '/api-mobile/iot/v1/syncMdmUser',
            method: 'post',
            data: params
        });
    },
    // 人证记录 同步员工记录
    syncMdmUserRecord(params) {
        return request({
            url: '/api-mobile/iot/v1/syncMdmUserRecord',
            method: 'post',
            data: params
        });
    }
};