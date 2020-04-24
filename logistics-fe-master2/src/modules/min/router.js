import Vue from 'vue';
import Router from 'vue-router';
import NotFound from '@/components/core/core_page/404.vue';
import Home from './views/Home.vue';

Vue.use(Router);

export const routeConfig = [{
    path: '/',
    component: Home,
    redirect: '/index',
    hidden: false,
    fdId: '1',
    fdFrontLink: '/order.html',
    name: '常用示例',
    children: [
        {
            path: '/',
            name: '首页',
            component: () => import('./views/Index'),
            meta: {
                title: 'index',
                authority: '/index'
            }
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
