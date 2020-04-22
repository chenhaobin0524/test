export default {
    process: {
        title: '待创建',
        speedName: '            ',
        orderNo: '',
        step: [
            {
                id: '0',
                images: {
                    active: require('@/assets/create_2.png'),
                    notActive: require('@/assets/create_1.png')
                },
                carName: ['待创建', '已创建'],
                processType: '',
                carTimes: ''
            },
            {
                id: '0',
                images: {
                    active: require('@/assets/audit_2.png'),
                    notActive: require('@/assets/audit_1.png')
                },
                carName: ['待审核', '已审核'],
                processType: '',
                carTimes: ''
            },
            {
                id: '0',
                images: {
                    active: require('@/assets/grant_2.png'),
                    notActive: require('@/assets/grant_1.png')
                },
                carName: ['待下发', '已下发'],
                processType: '',
                carTimes: ''
            },
            {
                id: '0',
                images: {
                    active: require('@/assets/close_2.png'),
                    notActive: require('@/assets/close_1.png')
                },
                carName: ['待关闭', '已关闭'],
                processType: '',
                carTimes: ''
            }
        ]
    },
    infoData: [
        {
            title: '基本信息',
            subItems: [
                {
                    label: '订单类型',
                    value: ''
                },
                {
                    label: '服务平台',
                    messages: [
                        { value: '' },
                        { value: '-' },
                        { value: '' },
                        { value: '--' },
                        { value: '' }
                    ]
                },
                {
                    label: '业务模式',
                    value: ''
                },
                {
                    label: '配送方式',
                    value: ''
                },
                {
                    label: '原销售出库单号',
                    value: ''
                },
                {
                    label: 'Mip调账',
                    event: true
                }
            ]
        },
        {
            title: '客户信息',
            subItems: [
                {
                    label: '客户订单',
                    value: '',
                    class: 'numbers'
                },
                {
                    label: '客户名称',
                    messages: [
                        { value: '' },
                        { value: '--' },
                        { value: '' }
                    ]
                },
                {
                    label: '上游审单时间',
                    value: ''
                },
                {
                    label: '要求到达时间',
                    value: ''
                },
                {
                    label: '关联单号',
                    value: ''
                }
            ]
        },
        {
            title: '收货信息',
            subItems: [
                {
                    label: '收件人',
                    message: [
                        { icon: require('@/assets/touxiang.png'), value: '' },
                        { icon: require('@/assets/dianhua.png'), value: '' }
                    ]
                },
                {
                    label: '收件单位',
                    value: ''
                },
                {
                    label: '收件地址',
                    value: '',
                    class: 'numbers',
                    detailAddress: ''
                },
                {
                    label: '上游收件地址',
                    value: ''
                }
            ]
        },
        {
            title: '发货信息',
            subItems: [
                {
                    label: '发件人',
                    message: [{
                        icon: require('@/assets/touxiang.png'),
                        value: ''
                    }, {
                        icon: require('@/assets/dianhua.png'),
                        value: ''
                    }]
                },
                {
                    label: '发件单位',
                    value: ''
                },
                {
                    label: '发件地址',
                    value: '',
                    class: 'numbers',
                    detailAddress: ''
                }
            ]
        }
    ],
    infoData2: [
        {
            // title: '其他信息',
            subItems: [
                {
                    label: '备注',
                    value: ''
                },
                {
                    label: '时效产品',
                    value: ''
                },
                {
                    label: '要求发货时间',
                    value: ''
                },
                {
                    label: '鉴定类型',
                    value: ''
                }
            ]
        },
        {
            title: '网点信息',
            subItems: [
                {
                    label: '联系人',
                    message: [{
                        icon: require('@/assets/touxiang.png'),
                        value: ''
                    }, {
                        icon: require('@/assets/dianhua.png'),
                        value: ''
                    }]
                },
                {
                    label: '网点名称',
                    value: ''
                },
                {
                    label: '网点地址',
                    value: ''
                }
            ]
        },
        {
            title: '发货信息',
            subItems: [
                {
                    label: '发件人',
                    message: [{
                        icon: require('@/assets/touxiang.png'),
                        value: ''
                    }, {
                        icon: require('@/assets/dianhua.png'),
                        value: ''
                    }]
                },
                {
                    label: '发件单位',
                    value: ''
                },
                {
                    label: '发件地址',
                    value: '',
                    dblclick: true
                }
            ]
        }
    ],
    dialogTable: {
        width: '',
        border: true,
        selection: false,
        columns: [
            {
                label: '序号',
                prop: 'itemLineNo',
                width: '50'
            },
            {
                label: '上游商品编码',
                prop: 'upperItemCode',
                width: '150'
            },
            {
                label: '客户商品编码',
                prop: 'customerItemCode',
                width: '130'
            },
            {
                label: '商品编号',
                prop: 'itemCode',
                width: '110'
            },
            {
                label: '商品名称',
                prop: 'itemName',
                width: '340'
            },
            {
                label: '状态',
                prop: 'itemStatus',
                width: 110
            },
            {
                label: '计划数/实际数',
                prop: 'Qty',
                width: 110
            },
            {
                label: '取消数',
                prop: 'cancleQty',
                width: 80
            },
            {
                label: '体积(m³)',
                prop: 'volume',
                width: 90
            },
            {
                label: '重量（Kg）',
                prop: 'grossWeight',
                width: 100
            },
            {
                label: '件型',
                prop: 'itemSize',
                width: '50'
            },
            {
                label: '商品分类',
                prop: 'itemClass',
                width: '130'
            },
            {
                label: '套机编码',
                prop: 'itemSuiteCode',
                width: '130'
            },
            // {
            //     label: '目标状态',
            //     prop: 'itemStatusToName'
            // },
            {
                label: '销售价（元）',
                prop: 'price',
                width: 130
            }
            // {
            //     label: '物理仓',
            //     prop: 'whName',
            //     width: 160
            // }
        ],
        information: [
            {
                task: '35647767683',
                type: '出库&运输',
                destination: '武汉'
            },
            {
                task: '35647767683',
                type: '入库'
            },
            {
                task: '35647767683',
                type: '出库&运输',
                destination: '武汉'
            }
        ]
    },
    logColumns: [
        {
            'prop': 'orderNo',
            'label': '订单号',
            'type': 'normal'
        },
        {
            'prop': 'taskNo',
            'label': '任务号',
            'type': 'normal'
        },
        {
            'prop': 'operateName',
            'label': '操作类型',
            'type': 'normal'
        },
        {
            'prop': 'operateContent',
            'label': '操作内容',
            'type': 'normal'
        },
        {
            'prop': 'createUserCode',
            'label': '创建人',
            'type': 'normal'
        },
        {
            'prop': 'createTime',
            'label': '创建时间',
            'type': 'normal'
        }
    ]
};
