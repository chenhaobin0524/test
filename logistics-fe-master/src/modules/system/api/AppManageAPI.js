import request from '@/utils/http';
const appManage = {
    update(id, params) {
        return request({
            url: `/api-auth/application/${id}`,
            method: 'put',
            data: params
        });
    },
    save(params) {
        return request({
            url: '/api-auth/application',
            method: 'post',
            data: params
        });
    },
    get(pageSize, pageNo, applicationCode, applicationName) {
        return request({
            url: '/api-auth/applications',
            method: 'get',
            params: {
                pageSize: pageSize,
                pageNo: pageNo,
                applicationCode: applicationCode,
                applicationName: applicationName
            }
        });
    },
    getSelectRole(applicationCode) {
        return request({
            url: '/api-auth/getRolesFromAppCode',
            method: 'get',
            params: {
                applicationCode: applicationCode
            }
        });
    },
    getWhiteList(pageSize, pageNo, applicationCode, resourceCode, tenantCode, blacklistFlag) {
        return request({
            url: '/api-auth/getTenantFromResource',
            method: 'get',
            params: {
                pageSize: pageSize,
                pageNo: pageNo,
                applicationCode: applicationCode,
                resourceCode: resourceCode,
                tenantCode: tenantCode,
                blacklistFlag: blacklistFlag
            }
        });
    },
    addWhiteList(data) {
        return request({
            url: '/api-auth/authTenantResource',
            method: 'post',
            data: data
        });
    },
    deleteWhiteList(applicationCode, resourceCode, tenantCode, blacklistFlag) {
        return request({
            url: '/api-auth/authTenantResource/deleteByCode',
            method: 'put',
            data: {
                applicationCode: applicationCode,
                resourceCode: resourceCode,
                tenantCode: tenantCode,
                blacklistFlag: blacklistFlag
            }
        });
    },
    getTenantList(pageSize, pageNo, tenantCode, roleCode) {
        return request({
            url: '/api-auth/tenantsFromRole',
            method: 'get',
            params: {
                pageSize: pageSize,
                pageNo: pageNo,
                tenantCode: tenantCode,
                roleCode: roleCode
            }
        });
    },
    tenantsBySourceTenant(pageSize, pageNo, tenantCode, roleCode, queryParam) {
        return request({
            url: '/api-auth/tenantsBySourceTenant',
            method: 'get',
            params: {
                pageSize: pageSize,
                pageNo: pageNo,
                tenantCode: tenantCode,
                roleCode: roleCode,
                queryParam
            }
        });
    },
    getUrlLists(pageSize, pageNo, name) {
        return request({
            url: '/api-auth/urlLists',
            method: 'get',
            params: {
                pageSize: pageSize,
                pageNo: pageNo,
                name: name
            }
        });
    },
    saveUrlLists(data) {
        return request({
            url: '/api-auth/urlList',
            method: 'post',
            data: data
        });
    },
    updateUrl(id, data) {
        return request({
            url: `/api-auth/urlList/${id}`,
            method: 'put',
            data: data
        });
    },
    deleteUrl(id) {
        return request({
            url: `/api-auth/urlList/${id}`,
            method: 'delete'
        });
    }
};
export default appManage;