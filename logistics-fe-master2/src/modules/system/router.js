import Vue from 'vue';
import Router from 'vue-router';
import NotFound from '@/components/core/core_page/404.vue';
import Home from './views/Home.vue';

Vue.use(Router);

export const routeConfig = [{
    fdId: '1',
    fdFrontLink: '/system.html',
    name: 'system',
    path: '/',
    component: Home,
    redirect: '/example',
    hidden: false,
    children: [
        {
            path: '/redirect/:path*',
            component: () => import('./views/redirect/index')
        },
        {
            path: '/',
            name: 'example',
            redirect: '/index',
            component: () => import('./views/Example'),
            meta: {
                title: 'index',
                authority: '/example'
            }
        },
        {
            path: '/index',
            name: 'index',
            component: () => import('./views/Example'),
            meta: {
                title: 'system.route.index',
                authority: '/example'
            }
        },
        {
            fdId: '11',
            fdFrontLink: '/user-manage',
            path: '/user-manage',
            name: 'account',
            component: () => import('./views/UserManage'),
            meta: {
                title: 'system.route.account'
            }
        },
        {
            fdId: '12',
            fdFrontLink: '/role-manage',
            path: '/role-manage',
            name: 'role',
            component: () => import('./views/RoleManage'),
            meta: {
                title: 'system.route.role'
            }
        },
        {
            path: '/role-authority',
            name: 'roleAuthority',
            component: () => import('./views/RoleManageAuthority'),
            meta: {
                title: 'system.route.roleAuthority'
            }
        },
        {
            fdId: '15',
            fdFrontLink: '/app-manage',
            path: '/app-manage',
            name: 'app',
            component: () => import('./views/AppManage'),
            meta: {
                title: 'system.route.app'
            }
        },
        {
            fdId: '16',
            fdFrontLink: '/data-type-manage',
            path: '/data-type-manage',
            name: 'data_type',
            component: () => import('./views/DataTypeManage'),
            meta: {
                title: 'system.route.data_type'
            }
        },
        {
            fdId: '17',
            fdFrontLink: '/laseholder-manage',
            path: '/laseholder-manage',
            name: 'laseholder',
            component: () => import('./views/LaseholderManage'),
            meta: {
                title: 'system.route.laseholder'
            }
        },
        {
            fdId: '18',
            fdFrontLink: '/organizationvar',
            path: '/organizationvar',
            name: 'organizationvar',
            component: () => import('./views/Organizationvar'),
            meta: {
                title: 'system.route.organizationvar'
            }
        },
        {
            path: '/laseholder-users',
            name: 'laseholderUsers',
            component: () => import('./views/LaseholderUsers'),
            meta: {
                title: 'system.route.laseholderUsers'
            }
        },
        {
            fdId: '19',
            fdFrontLink: '/laseholder-group',
            path: '/laseholder-group',
            name: 'laseholderGroup',
            component: () => import('./views/LaseholderGroup'),
            meta: {
                title: 'system.route.laseholderGroup'
            }
        },
        {
            path: '/laseholder-GroupManager',
            name: 'laseholderGroupManager',
            component: () => import('./views/LaseholderGroupManager'),
            meta: {
                title: 'system.route.laseholderGroupManager'
            }
        },
        {
            path: '/user-center',
            name: 'userCenter',
            component: () => import('./views/UserCenter'),
            meta: {
                title: 'system.route.userCenter'
            }
        },
        {
            path: '/app-manage/resoure-manage',
            name: 'resoureManage',
            component: () => import('./views/AppManageResoure'),
            meta: {
                title: 'system.route.resoureManage'
            }
        },
        {
            path: '/app-manage/white-list',
            name: 'AppManageWhiteList',
            component: () => import('./views/AppManageWhiteList'),
            meta: {
                title: 'system.route.AppManageWhiteList'
            }
        },
        {
            fdId: '20',
            fdFrontLink: '/url-black-white-list',
            path: '/url-black-white-list',
            name: 'UrlBlackWhite',
            component: () => import('./views/UrlBlackWhite'),
            meta: {
                title: 'system.route.UrlBlackWhite'
            }
        },
        {
            fdId: '21',
            fdFrontLink: '/post-manage',
            path: '/post-manage',
            name: 'PostManage',
            component: () => import('./views/PostManage'),
            meta: {
                title: 'system.route.PostManage'
            }
        },
        {
            path: '*',
            name: '404',
            component: NotFound
        }
    ]
}];

export default new Router({
    // mode: 'history',
    base: process.env.BASE_URL,
    routes: routeConfig
});
