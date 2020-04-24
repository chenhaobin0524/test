export default {
    process: {
        title: '',
        speedName: '发车单号',
        orderNo: '',
        step: [
            {
                id: '0',
                images: {
                    active: require('@/assets/carActive.png'),
                    notActive: require('@/assets/carNotActive.png')
                },
                carName: ['待调度', '已调度'],
                carTimes: ''
            },
            {
                id: '0',
                images: {
                    active: require('@/assets/carActive.png'),
                    notActive: require('@/assets/carNotActive.png')
                },
                carName: ['待到车', '已到车'],
                carTimes: ''
            },
            {
                id: '0',
                images: {
                    active: require('@/assets/carActive.png'),
                    notActive: require('@/assets/carNotActive.png')
                },
                carName: ['待装车', '已装车'],
                carTimes: ''
            },
            {
                id: '0',
                images: {
                    active: require('@/assets/carActive.png'),
                    notActive: require('@/assets/carNotActive.png')
                },
                carName: ['待发车', '在途'],
                carTimes: ''
            },
            {
                id: '0',
                images: {
                    active: require('@/assets/carActive.png'),
                    notActive: require('@/assets/carNotActive.png')
                },
                carName: ['待抵达', '抵达'],
                carTimes: ''
            }
        ]
    },
    infoData: [
        {
            title: '基本信息',
            subItems: [
                {
                    label: '任务类型',
                    value: '--'
                },
                {
                    label: '服务平台',
                    value: ''
                },
                {
                    label: '配送方式',
                    value: ''
                },
                {
                    label: '订单来源',
                    value: ''
                },
                {
                    label: '计费业务类型',
                    value: ''
                }
            ]
        },
        {
            title: '客户信息',
            subItems: [
                {
                    label: '客户订单号',
                    value: '',
                    class: 'orders'
                },
                {
                    label: '客户名称',
                    value: ''
                },
                {
                    label: '订单信息',
                    value: '',
                    tooltip: '是否上门取件 - 是否上门 - 是否装送一体 - 是否商超'
                }
            ]
        },
        {
            title: '其他信息',
            subItems: [
                {
                    label: '发货仓库',
                    value: ''
                },
                {
                    label: '网点名称',
                    value: ''
                },
                {
                    label: '分拨信息',
                    value: '',
                    tooltip: '是否分拨 - 分拨仓 - 分拨段数 - 是否最后一段分拨'
                },
                {
                    label: '是否拦截',
                    value: ''
                },
                {
                    label: '备注',
                    value: ''
                }
            ]
        },
        {
            title: '发货信息',
            event: 'showDispatchInfo',
            subTitle: '',
            subItems: [
                {
                    label: '发货人',
                    message: [{
                        icon: require('@/assets/touxiang.png'),
                        value: ''
                    }, {
                        icon: require('@/assets/dianhua.png'),
                        value: ''
                    }]
                },
                {
                    label: '发货单位',
                    value: ''
                },
                {
                    label: '发货地址',
                    value: '',
                    class: 'address'
                }
            ]
        },
        {
            title: '收货信息',
            subItems: [
                {
                    label: '收货人',
                    message: [{
                        icon: require('@/assets/touxiang.png'),
                        value: ''
                    }, {
                        icon: require('@/assets/dianhua.png'),
                        value: ''
                    }]
                },
                {
                    label: '收货单位',
                    value: ''
                },
                {
                    label: '收货地址',
                    value: '',
                    class: 'address'
                }
            ]
        },
        {
            title: '时间信息',
            subItems: [
                {
                    label: '预约时间',
                    value: ''
                },
                {
                    label: '要求发车时间',
                    value: ''
                },
                {
                    label: '要求抵达时间',
                    value: ''
                },
                {
                    label: '期望送达时间',
                    value: ''
                },
                {
                    label: '要求回单时间',
                    value: ''
                },
                {
                    label: '要求签收时间',
                    value: ''
                }
            ]
        }
    ],
    tableDataItems: [
        {
            prop: 'customerItemCode',
            label: '客户商品编号',
            width: 140
        },
        {
            prop: 'itemCode',
            label: '商品编号',
            width: 120
        },
        {
            prop: 'itemName',
            label: '商品名称',
            width: 240
        },
        {
            prop: 'itemSuiteCode',
            label: '套机编码',
            width: 140
        },
        {
            prop: 'itemStatus',
            label: '状态',
            width: 100
        },
        {
            prop: 'planQty',
            label: '计划数量/实发数量/实收数量'
        },
        {
            prop: 'volume',
            label: '单台方量（m³）',
            width: 120
        },
        {
            prop: 'grossWeight',
            label: '单台重量（Kg）',
            width: 120
        },
        {
            prop: 'financeNo',
            label: '财务单号',
            width: 180
        }

    ],
    logTableDate: {
        height: 140,
        selection: false,
        isPagination: false,
        columns: [
            {
                prop: 'content',
                label: '操作内容',
                type: 'normal',
                width: 700
            },
            {
                prop: 'updateTime',
                label: '操作时间',
                type: 'normal'
            },
            {
                prop: 'updateUserName',
                label: '操作人',
                type: 'normal'
            }
        ]
    }
};