import request from '@/utils/http';

export default {
    mobileBooking(params) {
        return request({
            url: '/api-mobile/report/pg/mobileBooking',
            method: 'post',
            data: params
        });
    },
    mobileBookingCheck(params) {
        return request({
            url: '/api-mobile/report/pg/mobileBookingCheck',
            method: 'post',
            data: params
        });
    }
};