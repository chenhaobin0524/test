import Vue from 'vue';
import Router from 'vue-router';
import NotFound from '@/components/core/core_page/404.vue';
import Home from './views/Home.vue';

Vue.use(Router);

export const routeConfig = [{
    path: '/',
    component: Home,
    hidden: false,
    fdFrontLink: '/big-data.html',
    children: [
        {
            path: '/',
            name: 'big-data.route.index',
            component: () => import('./views/Index'),
            meta: {
                head: '宝洁',
                authority: '/index'
            }
        },
        {
            path: '/warehouse-network',
            name: 'index',
            component: () => import('./views/warehouseNetwork/Index')
        },
        {
            path: '/storage-area-monitoring',
            name: 'storageAreaMonitoring',
            component: () => import('./views/storageAreaMonitoring/Index')
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
