import request from '@/utils/http';
// 获取组织根目录
export const organizations = params => {
    return request({
        url: 'api-auth/organizations',
        method: 'get',
        params: params
    }).then(res => res);
};
// 搜索员工
export const searchUser = params => {
    return request({
        url: '/api-auth/userInfos',
        method: 'get',
        params: params
    }).then(res => res);
};
