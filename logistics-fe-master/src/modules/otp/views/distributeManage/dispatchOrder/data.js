export default {
    process: {
        title: '',
        speedName: '发车单号',
        orderNo: '',
        step: [
            {
                id: '1',
                images: {
                    active: require('@/assets/carActive.png'),
                    notActive: require('@/assets/carNotActive.png')
                },
                carName: '',
                carTimes: ''
            },
            {
                id: '1',
                images: {
                    active: require('@/assets/carActive.png'),
                    notActive: require('@/assets/carNotActive.png')
                },
                carName: '',
                carTimes: ''
            },
            {
                id: '1',
                images: {
                    active: require('@/assets/carActive.png'),
                    notActive: require('@/assets/carNotActive.png')
                },
                carName: '',
                carTimes: ''
            },
            {
                id: '',
                images: {
                    active: require('@/assets/carActive.png'),
                    notActive: require('@/assets/carNotActive.png')
                },
                carName: '',
                carTimes: ''
            },
            {
                id: '',
                images: {
                    active: require('@/assets/carActive.png'),
                    notActive: require('@/assets/carNotActive.png')
                },
                carName: '',
                carTimes: ''
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
    tableDataItems: [
        {
            prop: 'senderDetailAddr',
            label: '站点名称',
            type: 'normal'
        },
        {
            prop: 'senderDetailAddrAll',
            label: '站点地址',
            type: 'normal'
        },
        {
            prop: 'networkAffect',
            label: '站点作用',
            type: 'normal'
        },
        {
            prop: 'taskCount',
            label: '单量',
            type: 'normal'
        },
        {
            prop: 'totalGrossWeight',
            label: '总重量(kg)',
            type: 'normal'
        },
        {
            prop: 'totalVolume',
            label: '总方量(m³)',
            type: 'normal'
        },
        {
            prop: 'actualArriveDate',
            label: '到车时间',
            type: 'normal'
        },
        {
            prop: 'arriveTypeText',
            label: '到车方式',
            type: 'normal'
        }
    ],
    tableListsDataItems: [
        {
            prop: 'receiverDetailAddr',
            label: '站点名称',
            type: 'normal'
        },
        {
            prop: 'receiverDetailAddrAll',
            label: '站点地址',
            type: 'normal'
        },
        {
            prop: 'networkAffect',
            label: '站点作用',
            type: 'normal'
        },
        {
            prop: 'taskCount',
            label: '单量',
            type: 'normal'
        },
        {
            prop: 'totalGrossWeight',
            label: '总重量(kg)',
            type: 'normal'
        },
        {
            prop: 'totalVolume',
            label: '总方量(m³)',
            type: 'normal'
        },
        {
            prop: 'arrivalTime',
            label: '抵达时间',
            type: 'normal'
        },
        {
            prop: 'arrivalWayText',
            label: '抵达方式',
            type: 'normal'
        }
    ],
    tabItems: [
        {
            prop: 'type',
            label: '操作类型',
            type: 'normal'
        },
        {
            prop: 'content',
            label: '操作内容',
            type: 'normal'
        },
        {
            prop: 'createUserName',
            label: '创建人',
            type: 'normal'
        },
        {
            prop: 'createTime',
            label: '创建时间',
            type: 'normal'
        }
    ]
};
