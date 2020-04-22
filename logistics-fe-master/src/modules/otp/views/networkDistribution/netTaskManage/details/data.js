export default {
    processPo: {
        title: '',
        speedName: '订单号',
        orderNo: '',
        step: [
            {
                id: '0',
                images: {
                    active: require('@/assets/create_2.png'),
                    notActive: require('@/assets/create_1.png')
                },
                carName: ['网点接单', '网点接单'],
                carTimes: ''
            },
            {
                id: '0',
                images: {
                    active: require('@/assets/audit_2.png'),
                    notActive: require('@/assets/audit_1.png')
                },
                carName: ['网点签收', '网点签收'],
                carTimes: ''
            },
            {
                id: '0',
                images: {
                    active: require('@/assets/grant_2.png'),
                    notActive: require('@/assets/grant_1.png')
                },
                carName: ['网点派工', '网点派工'],
                carTimes: ''
            },
            {
                id: '0',
                images: {
                    active: require('@/assets/grant_2.png'),
                    notActive: require('@/assets/grant_1.png')
                },
                carName: ['终端签收', '终端签收'],
                carTimes: ''
            },
            {
                id: '0',
                images: {
                    active: require('@/assets/close_2.png'),
                    notActive: require('@/assets/close_1.png')
                },
                carName: ['服务完成', '服务完成'],
                carTimes: ''
            }
        ]
    },
    processRi: {
        title: '',
        speedName: '订单号',
        orderNo: '',
        step: [
            {
                id: '0',
                images: {
                    active: require('@/assets/create_2.png'),
                    notActive: require('@/assets/create_1.png')
                },
                carName: ['网点接单', '网点接单'],
                carTimes: ''
            },
            {
                id: '0',
                images: {
                    active: require('@/assets/audit_2.png'),
                    notActive: require('@/assets/audit_1.png')
                },
                carName: ['网点派工', '网点派工'],
                carTimes: ''
            },
            {
                id: '0',
                images: {
                    active: require('@/assets/grant_2.png'),
                    notActive: require('@/assets/grant_1.png')
                },
                carName: ['网点入库', '网点入库'],
                carTimes: ''
            },
            {
                id: '0',
                images: {
                    active: require('@/assets/close_2.png'),
                    notActive: require('@/assets/close_1.png')
                },
                carName: ['服务完成', '服务完成'],
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
                    label: '业务模式',
                    value: ''
                },
                {
                    label: '备注信息',
                    value: ''
                }
            ]
        },
        {
            title: '客户信息',
            subItems: [
                {
                    label: '客户订单',
                    value: ''
                },
                {
                    label: '客户名称',
                    value: ''
                },
                {
                    label: '要求网点签收时间',
                    value: ''
                },
                {
                    label: '要求终端签收时间',
                    value: ''
                }
            ]
        },
        {
            title: '订单信息',
            subItems: [
                {
                    label: '总数量',
                    value: ''
                },
                {
                    label: '总体积',
                    value: ''
                },
                {
                    label: '总毛重',
                    value: ''
                }
            ]
        },
        {
            title: '来源信息',
            subItems: [
                {
                    label: '来源平台',
                    value: ''
                },
                {
                    label: '来源发车单号',
                    value: ''
                },
                {
                    label: '是否分拨',
                    value: ''
                }
            ]
        },
        {
            title: '网点信息',
            subItems: [
                {
                    label: '网点名称',
                    value: ''
                },
                {
                    label: '网点联系人',
                    value: ''
                },
                {
                    label: '网点地址',
                    value: ''
                }
            ]
        },
        {
            title: '收货信息',
            subItems: [
                {
                    label: '收货人',
                    value: ''
                },
                {
                    label: '收货联系方式',
                    value: ''
                },
                {
                    label: '收货地址',
                    value: ''
                }
            ]
        }
    ],
    netSignColumns: {
        width: '',
        border: true,
        selection: false,
        height: 240,
        columns: [
            {
                label: '商品编码',
                prop: 'itemCode',
                width: '150'
            },
            {
                label: '商品名称',
                prop: 'itemName'
            },
            {
                label: '计划数量',
                prop: 'planQty',
                width: '130'
            },
            {
                label: '单台体积',
                prop: 'volume',
                width: 110
            },
            {
                label: '单台重量',
                prop: 'grossWeight',
                width: 80
            },
            {
                label: '正品',
                prop: 'netRealReceive',
                width: 60
            },
            {
                label: '污染',
                prop: 'netMildewPollute',
                width: 60
            },
            {
                label: '破损',
                prop: 'netPackageDamaged',
                width: 60
            },
            {
                label: '短少',
                prop: 'netStockoutCount',
                width: 60
            },
            {
                label: '拒收',
                prop: 'netRejectQty',
                width: 60
            },
            {
                label: '备注',
                prop: 'networkSignRemark',
                width: 300
            }
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
    dispatchInfo: {
        // 预约时间
    },
    finalSignColumns: {
        width: '',
        border: true,
        selection: false,
        height: 240,
        columns: [
            {
                label: '商品编码',
                prop: 'itemCode',
                width: '150'
            },
            {
                label: '商品名称',
                prop: 'itemName'
            },
            {
                label: '网点签收数量',
                prop: 'netReceiveCount',
                width: '130'
            },
            {
                label: '单台体积',
                prop: 'volume',
                width: 110
            },
            {
                label: '单台重量',
                prop: 'grossWeight',
                width: 80
            },
            {
                label: '正品',
                prop: 'finalRealReceive',
                width: 60
            },
            {
                label: '污染',
                prop: 'finalMildewPollute',
                width: 60
            },
            {
                label: '破损',
                prop: 'finalPackageDamaged',
                width: 60
            },
            {
                label: '短少',
                prop: 'finalStockoutCount',
                width: 60
            },
            {
                label: '拒收',
                prop: 'finalRejectQty',
                width: 60
            },
            {
                label: '备注',
                prop: 'finalSignRemark',
                width: 300
            }
        ]
    },
    netOutColumns: {
        width: '',
        border: true,
        selection: false,
        height: 240,
        columns: [
            {
                label: '商品编码',
                prop: 'itemCode'
            },
            {
                label: '商品名称',
                prop: 'itemName'
            },
            {
                label: '网点入库数量',
                prop: 'netStorageCount'
            },
            {
                label: '网点出库数量',
                prop: 'netOutletsCount'
            }
        ]
    },
    logTable: {
        width: '',
        border: true,
        selection: false,
        isPagination: true,
        columns: [
            {
                prop: 'operateType',
                label: '操作类型',
                type: 'normal'
            },
            {
                prop: 'operateContent',
                label: '操作内容',
                type: 'normal'
            },
            {
                prop: 'createUserCode',
                label: '创建人',
                type: 'normal'
            },
            {
                prop: 'createTime',
                label: '创建时间',
                type: 'normal'
            }
        ]
    },
    logColumns: [
        // {
        //     prop: 'customerOrderNo',
        //     label: '客户订单号',
        //     type: 'normal'
        // },
        // {
        //     prop: 'parentOrderNo',
        //     label: '父单号',
        //     type: 'normal'
        // },
        // {
        //     prop: 'orderNo',
        //     label: '订单号',
        //     type: 'normal',
        //     width: 200
        // },
        {
            prop: 'taskNo',
            label: '任务号',
            type: 'normal',
            width: 200
        },
        {
            prop: 'operateName',
            label: '操作类型',
            type: 'normal',
            width: 100
        },
        {
            prop: 'operateContent',
            label: '操作内容',
            type: 'normal'
        },
        {
            prop: 'createUserCode',
            label: '创建人',
            type: 'normal',
            width: 100
        },
        {
            prop: 'createTime',
            label: '创建时间',
            type: 'normal',
            width: 200
        }
    ],
    statusActions: {
        PO: {
            0: [
                { index: '0', propTime: 'createTime' }
            ],
            10: [
                { index: '0', propTime: 'createTime' },
                { index: '1', propTime: 'networkSignTime' }
            ],
            20: [
                { index: '0', propTime: 'createTime' },
                { index: '1', propTime: 'networkSignTime' },
                { index: '2', propTime: 'netDispatchTime' }
            ],
            30: [
                { index: '0', propTime: 'createTime' },
                { index: '1', propTime: 'networkSignTime' },
                { index: '2', propTime: 'netDispatchTime' },
                { index: '3', propTime: 'finalSignTime' }
            ],
            40: [
                { index: '0', propTime: 'createTime' },
                { index: '1', propTime: 'networkSignTime' },
                { index: '2', propTime: 'netDispatchTime' },
                { index: '3', propTime: 'finalSignTime' },
                { index: '4', propTime: 'serviceCompleteTime' }
            ],
            50: [
                { index: '0', propTime: 'createTime' },
                { index: '1', propTime: 'networkSignTime' },
                { index: '2', propTime: 'netDispatchTime' },
                { index: '3', propTime: 'finalSignTime' }
            ],
            60: [
                { index: '0', propTime: 'createTime' },
                { index: '1', propTime: 'networkSignTime' },
                { index: '2', propTime: 'netDispatchTime' },
                { index: '3', propTime: 'finalSignTime' }
            ]
        },
        RI: {
            0: [
                { index: '0', propTime: 'createTime' }
            ],
            20: [
                { index: '0', propTime: 'createTime' },
                { index: '1', propTime: 'netDispatchTime' }
            ],
            50: [
                { index: '0', propTime: 'createTime' },
                { index: '1', propTime: 'netDispatchTime' }
            ],
            60: [
                { index: '0', propTime: 'createTime' },
                { index: '1', propTime: 'netDispatchTime' },
                { index: '2', propTime: 'netInTime' }
            ],
            40: [
                { index: '0', propTime: 'createTime' },
                { index: '1', propTime: 'netDispatchTime' },
                { index: '2', propTime: 'netInTime' },
                { index: '3', propTime: 'serviceCompleteTime' }
            ]
        }
    },
    detailTabActions: {
        net: 'netPagesParams',
        final: 'finalPagesParams',
        in: 'inPagesParams',
        out: 'outPagesParams'
    }
};
