import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';

Vue.use(Router);

export const routeConfig = [{
    path: '/',
    name: 'home',
    redirect: '/index',
    fdId: '1',
    fdFrontLink: '/index.html',
    component: Home,
    children: [
        {
            path: '/',
            name: 'siteIndex.route.index_page',
            fdId: '11',
            fdFrontLink: '/',
            component: () => import('./views/Index.vue'),
            meta: {
                title: 'index_page'
            }
        },
        {
            path: 'help',
            name: 'siteIndex.route.help',
            fdId: '12',
            fdFrontLink: '/help',
            component: () => import('./views/help/Main.vue')
        },
        {
            path: 'components/mpanel',
            name: 'siteIndex.route.mpanel',
            fdId: '13',
            fdFrontLink: 'components/mpanel',
            component: () => import('./views/components/mpanel/Main.vue')
        },
        {
            path: 'components/table-selector',
            name: 'siteIndex.route.table_selector',
            fdId: '14',
            fdFrontLink: 'components/table-selector',
            component: () => import('./views/components/TableSelector.vue')
        },
        {
            path: 'button-authority',
            name: 'siteIndex.route.button_authority',
            fdId: '15',
            fdFrontLink: '/button-authority',
            component: () => import('./views/ButtonAuthority.vue')
        },
        {
            path: 'multi-language',
            name: 'siteIndex.route.multi_language',
            fdId: '16',
            fdFrontLink: '/multi-language',
            component: () => import('./views/MultiLanguage.vue')
        },
        {
            path: '*',
            name: 'siteIndex.route.not_found',
            component: () => import('@/components/core/core_page/404.vue')
        }
    ]
}];

export default new Router({
    // mode: 'history',
    base: process.env.BASE_URL,
    routes: routeConfig
});
