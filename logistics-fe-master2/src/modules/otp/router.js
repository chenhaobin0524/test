import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';

Vue.use(Router);

export const routeConfig = [{
    path: '/preview',
    name: 'preview',
    meta: { title: 'otp.route.preview', icon: 'preview' },
    component: () => import('./views/preview/Index')
}, {
    path: '/',
    name: 'otp',
    redirect: '/index',
    component: Home,
    children: [
        {
            path: '/redirect/:path*',
            component: () => import('./views/redirect/index')
        },
        {
            path: '/',
            redirect: '/index'
        },
        {
            fdId: '9',
            path: '/index',
            name: 'personManage',
            meta: { title: 'otp.route.personManage', icon: 'dispatchPopup' },
            component: () => import('./views/manageDesk/Index')
        },
        {
            fdId: '10',
            path: '/order-manage',
            name: 'orderManage',
            component: () => import('./views/orderManage/Index'),
            meta: { title: 'otp.route.orderManage', icon: 'dispatchPopup' },
            children: [
                {
                    path: '/order-manage/alibaba-services',
                    name: 'alibabaServices',
                    component: () => import('./views/orderManage/aliServices/Index.vue'),
                    meta: { title: 'otp.route.alibabaServices', icon: 'dispatchList' }
                },
                {
                    path: '/order-manage/alibaba-services/edit/:id',
                    name: 'alibabaServicesSingle',
                    component: () => import('./views/orderManage/aliServices/edit/Index.vue'),
                    meta: { title: 'otp.route.alibabaServicesSingle', icon: 'dispatchList' }
                },
                {
                    path: '/order-manage/task-center',
                    name: 'taskCenter',
                    component: () => import('./views/orderManage/taskCenter/taskCenterList/Main.vue'),
                    meta: { title: 'otp.route.taskCenter', icon: 'taskCenter' }
                },
                {
                    path: '/order-manage/task-detail',
                    name: '_taskCenterDetail',
                    component: () => import('./views/orderManage/taskCenter/taskCenterDetail/Main'),
                    meta: { title: 'otp.route.taskCenterDetail', icon: 'taskCenterDetail' }
                },
                {
                    path: '/order-manage/order-center',
                    name: 'orderCenter',
                    component: () => import('./views/orderManage/orderCenter/orderCenterList/Main'),
                    meta: { title: 'otp.route.orderCenter' }
                },
                {
                    path: '/order-manage/order-detail',
                    name: 'orderCenterDetail',
                    component: () => import('./views/orderManage/orderCenter/orderCenterDetail/Main'),
                    meta: { title: 'otp.route.orderCenterDetail', icon: 'dispatchList' }
                }
            ]
        },
        {
            fdId: '11',
            fdFrontLink: '/distribute',
            path: '/',
            name: 'distributeManage',
            meta: { title: 'otp.route.distributeManage', icon: 'dispatchCenter' },
            component: () => import('./views/distributeManage/Index'),
            children: [
                {
                    fdId: '111',
                    fdFrontLink: '/dispatch-center',
                    path: '/dispatch-center',
                    name: 'dispatchCenter',
                    component: () => import('./views/distributeManage/dispatchCenter/DispatchCenter'),
                    meta: { title: 'otp.route.dispatchCenter', icon: 'dispatchCenter' }
                },
                {
                    path: '/dispatch-order',
                    name: 'dispatchOrder',
                    component: () => import('./views/distributeManage/dispatchOrderLists/dispatchOrder'),
                    meta: { title: 'otp.route.dispatchOrder', icon: 'dispatchOrder' }
                },
                {
                    path: '/dispatch-order/dispatch-order-detail',
                    name: 'dispatchOrderDetail',
                    component: () => import('./views/distributeManage/dispatchOrder/dispatchOrderDetail'),
                    meta: { title: 'otp.route.dispatchOrderDetail', icon: 'dispatchOrderDetail' }
                },
                {
                    fdId: '120',
                    fdFrontLink: '/distribute/vehicle-management',
                    path: '/distribute/vehicle-management',
                    name: 'vehicleManagement',
                    component: () => import('./views/distributeManage/vehicleManagement/vehicleManagement'),
                    meta: { title: 'otp.route.vehicleManagement', icon: 'vehicleManagement' }
                },
                {
                    fdId: '113',
                    fdFrontLink: '/distribute/receipt-sign',
                    path: '/distribute/receipt-sign',
                    name: 'receiptSign',
                    component: () => import('./views/distributeManage/receiptSign/index'),
                    meta: { title: 'otp.route.receiptSign', icon: 'receiptSign' }
                },
                {
                    fdId: '114',
                    fdFrontLink: '/distribute/transfer-create',
                    path: '/distribute/transfer-create',
                    name: 'transferCreate',
                    component: () => import('./views/distributeManage/transferCreate/index'),
                    meta: { title: 'otp.route.transferCreate', icon: 'transferCreate' }
                },
                {
                    fdId: '115',
                    fdFrontLink: '/distribute/transfer-confirm',
                    path: '/distribute/transfer-confirm',
                    name: 'transferConfirm',
                    component: () => import('./views/distributeManage/transferConfirm/index'),
                    meta: { title: 'otp.route.transferConfirm', icon: 'transferConfirm' }
                },
                {
                    fdId: '125',
                    fdFrontLink: '/distribute/vehicle-free-platform',
                    path: '/distribute/vehicle-free-platform',
                    name: 'otp.route.vehicleFreePlatform',
                    component: () => import('./views/distributeManage/vehicleFreePlatform/index'),
                    meta: { title: 'otp.route.vehicleFreePlatform', icon: 'vehicleFreePlatform' }
                },
                {
                    fdId: '121',
                    fdFrontLink: '/distribute/traffic-trajectory',
                    path: '/distribute/traffic-trajectory',
                    name: 'trafficTrajectory',
                    component: () => import('./views/distributeManage/trafficTrajectory/trafficTrajectory'),
                    meta: { title: 'otp.route.trafficTrajectory', icon: 'trafficTrajectory' }
                },
                {
                    path: '/source-exception-manage',
                    name: 'sourceExceptionManage',
                    component: () => import('./views/distributeManage/sourceExceptionManage/Main'),
                    meta: { title: 'otp.route.sourceExceptionManage', icon: 'sourceExceptionManage' }
                },
                {
                    path: '/distribute/transport-details',
                    name: 'transportDetails',
                    component: () => import('./views/distributeManage/transportDetail/details/Main'),
                    meta: { title: 'otp.route.transportDetails' }
                },
                {
                    path: '/distribute/transport-page',
                    name: 'transportPage',
                    component: () => import('./views/distributeManage/transportDetail/index/Main'),
                    meta: { title: 'otp.route.transportPage' }
                }
            ]
        },
        {
            path: '/config-center',
            name: 'configCenter',
            component: () => import('./views/configCenter/Index'),
            children: [
                {
                    path: '/config-center/close-order-rules',
                    name: 'closeOrderRules',
                    component: () => import('./views/configCenter/closeOrderRules/Index.vue'),
                    meta: { title: 'otp.route.closeOrderRules' }
                },
                {
                    path: '/config-center/type',
                    name: 'type',
                    component: () => import('./views/configCenter/typeClassification/Main'),
                    meta: { title: 'otp.route.type' }
                },
                {
                    path: '/config-center/charge',
                    name: 'charge',
                    component: () => import('./views/configCenter/chargeRule/Main'),
                    meta: { title: 'otp.route.charge' }
                },
                {
                    path: '/config-center/distribution',
                    name: 'distribution',
                    component: () => import('./views/configCenter/distributionRule/Main'),
                    meta: { title: 'otp.route.distribution' }
                },
                {
                    path: '/config-center/order-warhouse',
                    name: 'orderWarhouse',
                    component: () => import('./views/configCenter/compartmentRule/Main'),
                    meta: { title: 'otp.route.orderWarhouse' }
                },
                {
                    path: '/config-center/write-off',
                    name: 'writeOff',
                    component: () => import('./views/configCenter/writeOff/Main'),
                    meta: { title: 'otp.route.writeOff' }
                },
                {
                    path: '/config-center/thirdParty',
                    name: 'thirdParty',
                    component: () => import('./views/configCenter/thirdParty/Main'),
                    meta: { title: 'otp.route.thirdParty' }
                },
                {
                    path: '/config-center/order-split',
                    name: 'orderSplit',
                    component: () => import('./views/configCenter/demolitionRule/Main'),
                    meta: { title: 'otp.route.orderSplit' }
                },
                {
                    path: '/config-center/billing-service',
                    name: 'billingService',
                    component: () => import('./views/configCenter/billingService/Main'),
                    meta: { title: 'otp.route.billingService' }
                },
                {
                    path: '/config-center/assignment',
                    name: 'assignment',
                    component: () => import('./views/configCenter/taskDelivery/Main'),
                    meta: { title: 'otp.route.assignment' }
                },
                {
                    path: '/config-center/storehouse',
                    name: 'storehouse',
                    component: () => import('./views/configCenter/storehouse/Main'),
                    meta: { title: 'otp.route.storehouse' }
                },
                {
                    path: '/config-center/wms',
                    name: 'wms',
                    component: () => import('./views/configCenter/WMS/Main'),
                    meta: { title: 'otp.route.wms' }
                },
                {
                    path: '/config-center/upstream',
                    name: 'upstream',
                    component: () => import('./views/configCenter/upstream/Main'),
                    meta: { title: 'otp.route.upstream' }
                },
                {
                    path: '/config-center/customer',
                    name: 'customer',
                    component: () => import('./views/configCenter/customer/Main'),
                    meta: { title: 'otp.route.customer' }
                },
                {
                    path: '/config-center/area-rules',
                    name: 'areaRules',
                    component: () => import('./views/configCenter/areaRules/Main'),
                    meta: { title: 'otp.route.areaRules' }
                },
                // {
                //     path: '/config-center/mileage',
                //     name: 'mileage',
                //     component: () => import('./views/configCenter/mileage/Main'),
                //     meta: { title: 'otp.route.mileage' }
                // },
                {
                    path: '/config-center/shipment-quantity',
                    name: 'shipmentQuantity',
                    component: () => import('./views/configCenter/shipmentQuantity/Main'),
                    meta: { title: 'otp.route.shipmentQuantity' }
                },
                {
                    path: '/config-center/virtual-customer',
                    name: 'virtualCustomer',
                    component: () => import('./views/configCenter/virtualCustomer/Main'),
                    meta: { title: 'otp.route.virtualCustomer' }
                },
                {
                    path: '/config-center/limit',
                    name: 'Limit',
                    component: () => import('./views/configCenter/receivingLimit/Main'),
                    meta: { title: 'otp.route.receivingLimit' }
                },
                {
                    path: '/config-center/carrier-config',
                    name: 'carrierConfig',
                    component: () => import('./views/configCenter/carrierConfig/Index'),
                    meta: { title: 'otp.route.carrierConfig' }
                }
            ]
        },
        {
            path: '/report-manage',
            name: 'configCenter',
            component: () => import('./views/reportManage/Index'),
            children: [
                {
                    fdFrontLink: '/report-OMS',
                    path: '/report-OMS',
                    name: 'reportOMS',
                    component: () => import('./views/reportManage/ReportOMS'),
                    meta: { title: 'otp.route.reportOMS' }
                },
                {
                    fdFrontLink: '/report-WMS',
                    path: '/report-WMS',
                    name: 'reportWMS',
                    component: () => import('./views/reportManage/ReportWMS'),
                    meta: { title: 'otp.route.reportWMS' }
                },
                {
                    fdFrontLink: '/report-order',
                    path: '/report-order',
                    name: 'reportOrder',
                    component: () => import('./views/reportManage/ReportOrder'),
                    meta: { title: 'otp.route.reportOrder' }
                },
                {
                    fdFrontLink: '/report-all',
                    path: '/report-all',
                    name: 'orderAllReport',
                    component: () => import('./views/reportManage/AllReport'),
                    meta: { title: 'otp.route.reportAllOrder' }
                }

            ]
        },
        {
            path: '/time-manage',
            name: 'timeManage',
            component: () => import('./views/timeManage/Index'),
            children: [
                {
                    path: '/time-manage/aging-product',
                    name: 'agingProduct',
                    component: () => import('./views/timeManage/agingProduct/Main'),
                    meta: { title: 'otp.route.agingProduct' }
                },
                {
                    path: '/time-manage/customer-prescription',
                    name: 'customerPrescription',
                    component: () => import('./views/timeManage/customerPrescription/Main'),
                    meta: { title: 'otp.route.customerPrescription' }
                }
            ]
        },
        {
            path: '/monitor-manage',
            name: 'monitorManage',
            component: () => import('./views/monitorManage/Index'),
            children: [
                {
                    path: '/monitor-manage/order-exception',
                    name: 'orderException',
                    component: () => import('./views/monitorManage/orderException/Main'),
                    meta: { title: 'otp.route.orderException' }
                },
                {
                    path: '/monitor-manage/omsc-exception',
                    name: 'omscException',
                    component: () => import('./views/monitorManage/omscException/Main'),
                    meta: { title: 'otp.route.omscException' }
                }
            ]
        },
        {
            path: '/base-info',
            name: '_baseInfo',
            component: () => import('./views/baseInfo/Index'),
            children: [
                {
                    path: '/base-info/site-correction',
                    name: '_siteCorrection',
                    component: () => import('./views/baseInfo/siteCorrection/Main'),
                    meta: { title: 'otp.route.siteCorrection' }
                },
                {
                    path: '/base-info/address-map',
                    name: 'addressMap',
                    component: () => import('./views/baseInfo/addressMap/Main'),
                    meta: { title: 'otp.route.addressMap' }
                }
            ]
        },
        {
            path: '/stock-manage',
            name: 'stockManage',
            component: () => import('./views/stockManage/Index'),
            children: [
                {
                    path: '/stock-manage/inventory-flow',
                    name: 'inventoryFlow',
                    component: () => import('./views/stockManage/inventoryFlow/Main'),
                    meta: { title: 'otp.route.inventoryFlow' }
                },
                {
                    path: '/stock-manage/stock-adjust',
                    name: 'stockAdjust',
                    component: () => import('./views/stockManage/stockAdjust/Main'),
                    meta: { title: 'otp.route.stockAdjust', icon: 'stockAdjust' }
                },
                {
                    path: '/stock-manage/stockCenter',
                    name: 'stockCenter',
                    component: () => import('./views/stockManage/stockCenter/Main'),
                    meta: { title: 'otp.route.stockCenter' }
                },
                {
                    path: '/stock-manage/accessStock',
                    name: 'accessStock',
                    component: () => import('./views/stockManage/accessStock/Main'),
                    meta: { title: 'otp.route.accessStock' }
                },
                {
                    path: '/stock-manage/stockMove',
                    name: 'stockMove',
                    component: () => import('./views/stockManage/stockMove/Main'),
                    meta: { title: 'otp.route.stockMove' }
                }
            ]
        },
        {
            path: '/network-distribution',
            name: 'networkDistribution',
            component: () => import('./views/networkDistribution/Index'),
            children: [
                {
                    path: '/dot-coverage',
                    name: 'dotCoverage',
                    component: () => import('./views/networkDistribution/dotCoverage/Main'),
                    meta: { title: 'otp.route.dotCoverage' }
                },
                {
                    path: '/net-task',
                    name: 'netTaskManage',
                    component: () => import('./views/networkDistribution/netTaskManage/index/Main'),
                    meta: { title: 'otp.route.netTaskManage' }
                },
                {
                    path: '/net-task-details',
                    name: 'netTaskDetails',
                    component: () => import('./views/networkDistribution/netTaskManage/details/Main'),
                    meta: { title: 'otp.route.netTaskDetail' }
                },
                {
                    path: '/net-info',
                    name: 'netInfos',
                    component: () => import('./views/networkDistribution/netInfos/Main'),
                    meta: { title: 'otp.route.netInfos' }
                },
                {
                    path: '/net-departure',
                    name: 'netDeparture',
                    component: () => import('./views/networkDistribution/netDeparture/index/Main'),
                    meta: { title: 'otp.route.netDeparture' }
                },
                {
                    path: '/net-departure-details',
                    name: 'netDepartureDetails',
                    component: () => import('./views/networkDistribution/netDeparture/details/Main'),
                    meta: { title: 'otp.route.netDepartureDetails' }
                }
            ]
        }
    ]
}];

export default new Router({
    // mode: 'history',
    base: process.env.BASE_URL,
    routes: routeConfig
});
