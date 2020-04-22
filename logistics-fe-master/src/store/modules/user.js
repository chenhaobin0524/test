import { findCurrUser, getUserAllTenants, getUserApplications } from '@/modules/index/api/user';
import { getAllResources } from '../../modules/system/api/AcountManageApi';
import lang from '@/lang/index';
import config from '@/config/user.env';
import { MessageBox, Message } from 'element-ui';
import { logout } from '@/utils/index';
import utils from '@/utils/common.js';

export default {
    state: {
        user: {},
        authority: '',
        appId: config.appId,
        lang: {},
        tenantInfo: {},
        currentTenant: {},
        appList: [],
        currentApplicationCode: '',
        btnPermissions: null
    },
    getters: {
        user: state => state.user,
        appId: state => state.appId,
        authority: state => state.authority,
        menus: state => {
            if (state.authority) {
                return state.authority;
            }
            return [];
        },
        lang: state => state.lang,
        tenantInfo: state => state.tenantInfo,
        currentTenant: state => state.currentTenant,
        appList: state => state.appList,
        btnPermissions: state => state.btnPermissions,
        applicationCode: state => {
            const currentPath = state.appList.find(item => {
                if (item.applicationDomain) {
                    return item.applicationDomain.indexOf(window.location.pathname) >= 0;
                }
                return false;
            });
            return currentPath ? currentPath.applicationCode : '';
        }
    },
    mutations: {
        getBtnPermissions(state, btnPermissions) {
            state.btnPermissions = btnPermissions;
        },
        updateUserInfo(state, user) {
            state.user = user;
        },
        updateAuthority(state, authority) {
            state.authority = authority;
        },
        updateLang(state, _lang) {
            state.lang = _lang;
        },
        updateTenant(state, _tenantInfo) {
            state.tenantInfo = _tenantInfo;
        },
        updateCurrenTenant(state, _tenantInfo) {
            state.currentTenant = _tenantInfo;
        },
        updateAppList(state, _appList) {
            state.appList = _appList;
        },
        updateCurrentApplicationCode(state, applicationCode) {
            state.currentApplicationCode = applicationCode;
        }
    },
    actions: {
        /**
         * 初始化系统
         * @param {*} param0
         */
        initSystem({ commit }) {
            const params = {
                listFlag: 1,
                pageNo: 1,
                pageSize: 10
            };
            return Promise.all([findCurrUser(), getUserAllTenants(params)]).then(res => {
                if (+res[0].code === 0 && +res[1].code === 0) {
                    commit('updateUserInfo', res[0].data);
                    if (!res[1].data.currentTenant) {
                        MessageBox.alert('不存在默认租户，请联系管理员重新登录!', '错误', {
                            confirmButtonText: '确定',
                            callback: action => {
                                logout();
                            }
                        });
                        return false;
                    }
                    commit('updateTenant', res[1].data.tenants ? res[1].data.tenants : {});
                    commit('updateCurrenTenant', res[1].data.currentTenant ? res[1].data.currentTenant : {});
                    return getUserApplications({
                        userCode: res[0].data.userCode,
                        tenantCode: res[1].data.currentTenant.tenantCode
                    }).then(response => {
                        if (response && +response.code === 0) {
                            if (!response.data.length) {
                                MessageBox.alert('不存在应用列表，请联系管理员重新登录!', '错误', {
                                    confirmButtonText: '确定'
                                });
                                return false;
                            }
                            commit('updateAppList', response.data);
                            const appId = response.data.find(item => {
                                return item.applicationDomain && item.applicationDomain.indexOf(window.location.pathname) > -1;
                            });
                            const applicationCode = appId && appId['applicationCode'] ? appId['applicationCode'] : '';
                            commit('updateCurrentApplicationCode', applicationCode);
                            return getAllResources({
                                userCode: res[0].data.userCode,
                                applicationCode: applicationCode,
                                tenantCode: res[1].data.currentTenant.tenantCode
                            }).then(resData => {
                                if (resData && +resData.code === 0) {
                                    const btnPermissions = utils.getResourceIds(resData.data);
                                    commit('getBtnPermissions', btnPermissions);
                                    commit('updateAuthority', resData.data[0] && resData.data[0].subResources && resData.data[0].subResources.length ? resData.data[0].subResources : []);
                                    if (resData.data && resData.data.length === 0) {
                                        Message.error({
                                            message: '您没有菜单权限',
                                            showClose: true
                                        });
                                    }
                                    return true;
                                } else {
                                    Message.error(resData.msg);
                                    return false;
                                }
                            });
                        } else {
                            Message.error(response.msg);
                            return false;
                        }
                    });
                } else {
                    if (res[0] && +res[0].code !== 0) {
                        MessageBox.alert(res[0].msg || '接口返回异常', '错误', {
                            confirmButtonText: '确定',
                            callback: action => {
                                logout();
                            }
                        });
                    }
                    if (res[1] && +res[1].code !== 0) {
                        MessageBox.alert(res[1].msg || '接口返回异常', '错误', {
                            confirmButtonText: '确定',
                            callback: action => {
                                logout();
                            }
                        });
                    }
                }
                // return +res[0].code === 0 && +res[1].code === 0;
            });
        },
        UPDATE_LANG({ commit, state }) {
            const langSettings = lang.initLanguage(state.user.fdLangType);
            commit('updateLang', langSettings);
            return langSettings;
        }
    }
};
