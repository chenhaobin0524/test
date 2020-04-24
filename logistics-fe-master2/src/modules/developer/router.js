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
    fdFrontLink: '/developer.html',
    name: '常用示例',
    children: [
        {
            path: '/area',
            name: '省市四级联动',
            fdId: '10',
            fdFrontLink: '/area',
            component: () => import('./views/Cascader/Cascader')
        },
        {
            path: 'index',
            name: 'developer.route.index',
            fdId: '10',
            fdFrontLink: '/index',
            component: () => import('./views/Example'),
            meta: {
                title: 'index',
                authority: '/example'
            }
        },
        {
            fdId: '13',
            fdFrontLink: '/editable-table',
            path: 'editable-table',
            name: 'developer.route.editableTable',
            component: () => import('./views/EditableTable2')
        },
        {
            fdId: '15',
            path: '/import-export/',
            name: 'developer.route.importAndExport',
            redirect: '/import-export/import',
            component: () => import('./views/ImportAndExport/Index'),
            children: [{
                fdId: '151',
                fdFrontLink: '/import-export/import',
                name: 'developer.route.import',
                path: 'import',
                component: () => import('./views/ImportAndExport/DemoImport')
            },
            {
                fdId: '152',
                fdFrontLink: '/import-export/export',
                name: 'developer.route.export',
                path: 'export',
                component: () => import('./views/ImportAndExport/DemoExport')
            }]
        },
        {
            fdId: '16',
            path: '/panel/',
            fdFrontLink: '/panel/',
            name: 'developer.route.mPanel',
            component: () => import('./views/mPanel/Index'),
            children: [{
                fdId: '161',
                fdFrontLink: '/panel/m-panel1',
                name: 'developer.route.mPanel1',
                path: 'm-panel1',
                component: () => import('./views/mPanel/mPanel1/Index')
            }, {
                fdId: '162',
                fdFrontLink: '/panel/m-panel2',
                name: 'developer.route.mPanel2',
                path: 'm-panel2',
                component: () => import('./views/mPanel/mPanel2/Index')
            }, {
                fdId: '163',
                fdFrontLink: '/panel/m-panel3',
                name: 'developer.route.mPanel3',
                path: 'm-panel3',
                component: () => import('./views/mPanel/mPanel3/Index')
            }]
        },
        {
            fdId: '17',
            fdFrontLink: '/demo-progress',
            path: '/demo-progress',
            name: 'developer.route.progress',
            component: () => import('./views/DemoProgress')
        },
        {
            fdId: '19',
            fdFrontLink: '/demo-userHeaderQuery',
            path: 'demo-userHeaderQuery',
            name: 'developer.route.columns',
            component: () => import('./views/demo-userHeaderQuery/UserHeaderQueryDemo')
        },
        {
            fdId: '21',
            fdFrontLink: '/OSS/',
            name: 'oss',
            path: 'oss',
            component: () => import('./views/OSS/Index'),
            children: [{
                fdId: '211',
                fdFrontLink: '/oss/oss',
                name: 'origin oss',
                path: 'oss',
                component: () => import('./views/OSS/OSS')
            }, {
                fdId: '212',
                fdFrontLink: '/oss/upload',
                name: 'upload',
                path: 'upload',
                component: () => import('./views/OSS/Upload')
            }, {
                fdId: '213',
                fdFrontLink: '/oss/download',
                name: 'download',
                path: 'download',
                component: () => import('./views/OSS/Download')
            }, {
                fdId: '214',
                fdFrontLink: '/oss/file-list',
                name: 'fileList',
                path: 'file-list',
                component: () => import('./views/OSS/FileList')
            }, {
                fdId: '215',
                fdFrontLink: '/oss/file-list-dialog',
                name: 'fileListDialog',
                path: 'file-list-dialog',
                component: () => import('./views/OSS/FileListDialog')
            }]
        },
        {
            fdId: '22',
            fdFrontLink: '/demo-iframe-report',
            path: 'demo-iframe-report',
            name: 'developer.route.report',
            component: () => import('./views/demo-iframe-report')
        },
        {
            path: '/btn-permission',
            name: '权限按钮',
            fdId: '23',
            fdFrontLink: '/btn-permission',
            component: () => import('./views/whloc/WhLoc.vue')
        },
        {
            path: '/form',
            name: '表单验证',
            fdId: '24',
            fdFrontLink: '/form',
            component: () => import('./views/form/Form.vue')
        },
        {
            path: '/iflow',
            name: 'iflow',
            fdId: '25',
            fdFrontLink: '/iflow',
            component: () => import('./views/iflow/Main.vue')
        },
        {
            path: '/iflow/initProcess',
            name: 'iflowInitProcess',
            fdId: '26',
            fdFrontLink: '/iflow/initProcess',
            component: () => import('./views/iflow/InitProcess.vue')
        },
        {
            path: '/iflow/processList',
            name: '流程列表',
            fdId: '27',
            fdFrontLink: '/iflow/processList',
            component: () => import('./views/iflow/ProcessList.vue')
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
