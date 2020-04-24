import Vue from 'vue';
import Router from 'vue-router';
import NotFound from '@/components/core/core_page/404.vue';
import Home from './views/Home.vue';

Vue.use(Router);

export const routeConfig = [{
    path: '/',
    component: Home,
    // redirect: '/index',
    name: '常用示例',
    children: [
        {
            path: '/redirect/:path*',
            component: () => import('./views/redirect/index')
        },
        // {
        //     path: '/',
        //     name: 'DanoneConsole',
        //     redirect: '/control',
        //     component: () => import('./views/Control/Control'),
        //     meta: {
        //         title: '达能控制台',
        //         authority: '/control'
        //     }
        // },
        {
            path: '/',
            redirect: '/index'
        },
        {
            path: '/index',
            name: 'Index',
            component: () => import('./views/Index.vue'),
            meta: {
                title: '首页',
                authority: '/Index'
            }
        },
        {
            path: '/control',
            name: 'DanoneConsole',
            component: () => import('./views/Control/Control'),
            meta: {
                title: '达能控制台',
                authority: '/Control'
            }
        },
        {
            path: '/njdc',
            name: 'NJDC',
            component: () => import('./views/baojie/NJDCControl'),
            meta: {
                title: '宝洁控制台',
                authority: '/njdc'
            }
        },
        {
            path: '/chart',
            name: 'Chart',
            component: () => import('./views/chart/Index'),
            meta: {
                title: '报表',
                authority: '/chart'
            }
        },
        {
            path: '/iotDevice',
            name: 'IotDevice',
            component: () => import('./views/iotDevice/Index'),
            meta: {
                title: 'IoT设备',
                authority: '/iotDevice'
            }
        },
        {
            path: '/ztb',
            name: 'ztb',
            redirect: '/ztb',
            component: () => import('./views/ztb/Index'),
            meta: { title: '直通宝', authority: '/ztb' },
            children: [
                {
                    path: '/ztb/arrive',
                    name: '到车登记',
                    component: () => import('./views/ztb/arrive/Arrive.vue'),
                    meta: { title: '到车登记', authority: '/ztb/arrive' }
                },
                {
                    path: '/ztb/warehouse',
                    name: '仓库评价',
                    component: () => import('./views/ztb/warehouse/Warehouse.vue'),
                    meta: { title: '仓库评价', authority: '/ztb/warehouse' }
                },
                {
                    path: '/ztb/shortMessage',
                    name: '短信发送',
                    component: () => import('./views/ztb/shortMessage/ShortMessage.vue'),
                    meta: { title: '短信发送', authority: '/ztb/shortMessage' }
                }
            ]
        },
        {
            path: '*',
            redirect: {
                path: '/404',
                component: NotFound
            }
        }
    ]
}];

export default new Router({
    // mode: 'history',
    base: process.env.BASE_URL,
    routes: routeConfig
});
