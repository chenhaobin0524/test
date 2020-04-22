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
                carName: ['已排车', '已排车'],
                carTimes: '2019-11-13 12:00:00'
            },
            {
                id: '0',
                images: {
                    active: require('@/assets/carActive.png'),
                    notActive: require('@/assets/carNotActive.png')
                },
                carName: ['待装车', '待装车'],
                carTimes: '2019-11-13 12:00:00'
            },
            {
                id: '0',
                images: {
                    active: require('@/assets/carActive.png'),
                    notActive: require('@/assets/carNotActive.png')
                },
                carName: ['待发车', '待发车'],
                carTimes: '2019-11-13 12:00:00'
            },
            {
                id: '0',
                images: {
                    active: require('@/assets/carActive.png'),
                    notActive: require('@/assets/carNotActive.png')
                },
                carName: ['待签收', '待签收'],
                carTimes: '2019-11-13 12:00:00'
            }
        ]
    },
    infoData: [
        {
            title: '车辆信息',
            subItems: [
                {
                    label: '车牌',
                    value: '',
                    images: {
                        value: '定位',
                        url: require('@/assets/position.png')
                    }
                },
                {
                    label: '司机',
                    message: [
                        { icon: require('@/assets/touxiang.png'), value: '' },
                        { icon: require('@/assets/dianhua.png'), value: '' }
                    ]
                },
                {
                    label: '承运商',
                    value: ''
                },
                {
                    label: '发车单平台',
                    value: ''
                },
                {
                    label: '运输方式',
                    value: ''
                }
            ]
        },
        {
            title: '费用信息',
            subItems: [
                {
                    label: '运输成本',
                    value: ''
                },
                {
                    label: '预付金额',
                    value: ''
                },
                {
                    label: '预付方式',
                    value: ''
                }
            ]
        },
        {
            title: '其他信息',
            subItems: [
                {
                    label: '是否顺路带回',
                    value: ''
                },
                {
                    label: '信息费用',
                    value: ''
                },
                {
                    label: '税率',
                    value: ''
                },
                {
                    label: '备注',
                    value: ''
                }
            ]
        }
    ],
    transportTable: {
        height: 200,
        border: true,
        selection: false,
        columns: [
            {
                label: '运输单号',
                prop: 'taskNo'
            },
            {
                label: '订单号',
                prop: 'orderNo'
            },
            {
                label: '合同号',
                prop: 'contractNo'
            },
            {
                label: '签收数量',
                prop: 'netReceiveCount'
            },
            {
                label: '计费业务类型',
                prop: 'businessTypeName'
            }
        ]
    },
    dispatchItems: {
        height: 200,
        border: true,
        selection: false,
        columns: [
            {
                prop: 'receiverDetailAddr',
                label: '站点名称'
            },
            {
                prop: 'receiverDetailAddrAll',
                label: '站点地址'
            },
            {
                prop: 'networkAffect',
                label: '站点作用'
            },
            {
                prop: 'taskCount',
                label: '单量'
            }
        ]
    },
    dispatchListsItems: {
        height: 200,
        border: true,
        selection: false,
        columns: [
            {
                prop: 'finalDetailAddr',
                label: '站点名称'
            },
            {
                prop: 'finalDetailAddrAll',
                label: '站点地址'
            },
            {
                prop: 'networkAffect',
                label: '站点作用'
            },
            {
                prop: 'taskCount',
                label: '单量'
            }
        ]
    }
};
