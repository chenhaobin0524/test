import request from '@/utils/http';
import axios from 'axios';

const wharea = {
    // 备货区管理 列表
    crenelPageLoc(params) {
        return request({
            url: '/api-mobile/pg/crenel/pageLoc',
            method: 'get',
            params
        });
    },
    // 备货区管理 操作列 状态按钮
    pgCrenelLoc(params) {
        return request({
            url: '/api-mobile/pg/crenel/loc',
            method: 'put',
            data: params
        });
    },
    // 垛口管理 get列表 put修改垛口 delete删除垛口  预约概览 顶部垛口列表
    crenels(params, cancelToken = () => {}) {
        const obj = {
            url: `/api-mobile/pg/crenels${params.method === 'delete' ? '/' + params.crenelCode : ''}`,
            method: params.method,
            cancelToken: new axios.CancelToken(cancelToken)
        };
        if (params.method !== 'delete') {
            const data = params.method === 'get' ? 'params' : 'data';
            delete params.method;
            obj[data] = params;
        }
        return request(obj);
    },
    // 垛口管理 获取关联备货区
    crenelLoc(params) {
        return request({
            url: '/api-mobile/pg/crenel/loc',
            method: 'get'
        });
    },
    // 预约单列表 列表
    crenelBookings(params) {
        return request({
            url: '/api-mobile/pg/crenel/bookings',
            method: params.id ? 'put' : 'post',
            data: params
        });
    },
    // 预约单列表 取消
    crenelBookingsCancel(params) {
        return request({
            url: `/api-mobile/pg/crenel/bookings/cancel/${params}`,
            method: 'put',
            data: {}
        });
    },
    // 预约单列表 编辑
    bookingDetails(params) {
        return request({
            url: `/api-mobile/pg/crenel/bookingDetails/${params}`,
            method: 'post'
        });
    },
    // 预约单列表 申请ST
    reqSt(params) {
        return request({
            url: `/api-mobile/wms/v1/reqSt`,
            method: 'get',
            params
        });
    },
    // 垛口管理 新增
    crenel(params) {
        return request({
            url: '/api-mobile/pg/crenel',
            method: 'post',
            data: params
        });
    },
    // 预约概览 详情
    crenelsTime(params, cancelToken = () => {}) {
        return request({
            url: '/api-mobile/pg/crenels/time',
            method: 'post',
            data: params,
            cancelToken: new axios.CancelToken(cancelToken)
        });
    },
    // 地磁管理 列表
    mobileLocGeoRelationsList(params) {
        return request({
            url: '/api-mobile/mobileLocGeoRelations/list',
            method: 'post',
            data: params
        });
    },
    // 地磁管理 编辑
    mobileLocGeoRelations(params) {
        return request({
            url: '/api-mobile/mobileLocGeoRelations',
            method: 'put',
            data: params
        });
    },
    // 地磁管理 查询仓库编码
    PGCrenelsWhList() {
        return request({
            url: '/api-mobile/PG/crenels/whList',
            method: 'get'
        });
    },
    // 地磁管理 根据仓库编码查垛口
    PGCrenels(whCode) {
        return request({
            url: `/api-mobile/PG/crenels?whCode=${whCode}&pageSize=10000&pageNo=1`,
            method: 'get'
        });
    }
};
export default wharea;