import request from '@/utils/http';

const userCenter = {
    getAccount() {
        return request({
            url: '/api-auth/userAccountCurrent',
            method: 'get'
        });
    },
    getUserInfo() {
        return request({
            url: '/api-auth/userInfoCurrent',
            method: 'get'
        });
    },
    getUserRoles() {
        return request({
            url: '/api-auth/userInfoCurrent/roles',
            method: 'get'
        });
    },
    getUserResources() {
        return request({
            url: '/api-auth/getAllResources',
            method: 'get'
        });
    },
    getUserTenants() {
        return request({
            url: '/api-auth/userInfoCurrent/tenants',
            method: 'get'
        });
    }
};
export default userCenter;
