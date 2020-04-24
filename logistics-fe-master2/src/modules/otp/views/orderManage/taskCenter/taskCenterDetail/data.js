export default {
    process: {
        title: '',
        speedName: '任务单号',
        orderNo: '',
        step: []
    },
    infoData: [
        {
            title: '基本信息',
            subItems: [
                {
                    label: '计费任务类型',
                    value: '-'
                },
                {
                    label: '服务平台',
                    value: '-'
                },
                {
                    label: '-',
                    value: '-',
                    noShow: false
                },
                {
                    label: '业务类型',
                    value: '-'
                }
            ]
        }, {
            title: '客户信息',
            subItems: [
                {
                    label: '客户订单',
                    value: '-'
                },
                {
                    label: '客户名称',
                    value: '-'
                },
                {
                    label: '要求送达',
                    value: '-'
                }
            ]
        }, {
            title: '其他信息',
            subItems: [
                {
                    label: '预约时间',
                    value: '-'
                },
                {
                    label: '时效产品',
                    value: '-'
                },
                {
                    label: '备注',
                    value: ''
                }
            ]
        }, {
            title: '发货信息',
            event: 'showDispatchInfo',
            subTitle: '',
            subItems: [
                {
                    label: '发件人',
                    message: [{
                        icon: require('@/assets/touxiang.png'),
                        value: '-'
                    }, {
                        icon: require('@/assets/dianhua.png'),
                        value: '-'
                    }]
                },
                {
                    label: '发件单位',
                    value: '-'
                },
                {
                    label: '发件地址',
                    value: '-',
                    class: 'deliver'
                }
            ]
        }, {
            title: '网点信息',
            subItems: [
                {
                    label: '联系人',
                    message: [{
                        icon: require('@/assets/touxiang.png'),
                        value: '-'
                    }, {
                        icon: require('@/assets/dianhua.png'),
                        value: '-'
                    }]
                },
                {
                    label: '网点名称',
                    value: '-'
                },
                {
                    label: '网点地址',
                    value: '-',
                    class: 'adds'
                }
            ]
        }, {
            title: '收货信息',
            subItems: [
                {
                    label: '收件人',
                    message: [{
                        icon: require('@/assets/touxiang.png'),
                        value: '-'
                    }, {
                        icon: require('@/assets/dianhua.png'),
                        value: '-'
                    }]
                },
                {
                    label: '收件单位',
                    value: '-'
                },
                {
                    label: '收件地址',
                    value: '-',
                    class: 'adds address'
                }
            ]
        }
    ],
    tableData: [
    ],
    tableDataItems: [
        {
            label: '序号',
            prop: 'itemLineNo',
            width: '50'
        },
        {
            prop: 'customerItemCode',
            label: '客户商品编号',
            type: 'normal'
        },
        {
            prop: 'itemCode',
            label: '商品编号',
            type: 'normal'
        },
        {
            prop: 'itemName',
            label: '商品名称',
            type: 'normal'
        },
        {
            prop: 'itemSuiteCode',
            label: '套机编码',
            type: 'normal'
        },
        {
            prop: 'itemStatusName',
            label: '状态',
            type: 'normal'
        },
        // {
        //     prop: 'itemStatusToName',
        //     label: '目标状态',
        //     type: 'normal'
        // },
        {
            prop: 'planQty/actQty',
            label: '计划数量/实际数量',
            type: 'normal'
        },
        {
            prop: 'volume',
            label: '体积(m³)',
            type: 'normal'
        },
        {
            prop: 'grossWeight',
            label: '重量(Kg)',
            type: 'normal'
        },
        {
            prop: 'whName',
            label: '物理仓',
            type: 'normal'
        }
    ],
    initData: {
        finalCityCode: '',
        finalCityName: '',
        finalDetailAddr: '',
        finalDistrictCode: '',
        finalDistrictName: '',
        finalMobile: '',
        finalName: '',
        finalProvinceCode: '',
        finalProvinceName: '',
        finalTownCode: '',
        finalTownName: '',
        receiverCityCode: '',
        receiverCityName: '',
        receiverDetailAddr: '',
        receiverDistrictCode: '',
        receiverDistrictName: '',
        receiverMobile: '',
        receiverName: '',
        receiverProvinceCode: '',
        receiverProvinceName: '',
        receiverTownCode: '',
        receiverTownName: '',
        remark: '',
        senderCityCode: '',
        senderCityName: '',
        senderCountryCode: '',
        senderCountryName: '',
        senderDetailAddr: '',
        senderDistrictCode: '',
        senderDistrictName: '',
        senderMobile: '',
        senderName: '',
        senderProvinceCode: '',
        senderProvinceName: '',
        senderTel: '',
        senderTownCode: '',
        senderTownName: '',
        taskNo: '',
        updateTime: '',
        updateUserCode: ''
    }
};
