export default {
    configuration: true,
    searchList: {
        searchTxt: [
            {
                name: '发货仓',
                value: 'whName',
                type: 'advance',
                span: 4,
                unfold: true,
                advanceConfig: [
                    { prop: 'cdwhName', value: '仓库名称' },
                    { prop: 'whCode', value: '仓库编码' }
                ],
                tableConfig: [
                    { prop: 'whCode', value: '仓库编码' },
                    { prop: 'cdwhName', value: '仓库名称' }
                ],
                advanceUrl: 'cdWarehouse/search?cdwhIsStop=0',
                cbParams: [
                    'whCode', 'cdwhName#whName'
                ]
            },
            {
                name: '发货地',
                value: 'senderCode',
                config: {
                    checkStrictly: true
                },
                type: 'addressSelect',
                unfold: true,
                minLayers: 3,
                span: 4
            },
            {
                name: '收货地',
                value: 'receiverCode',
                config: {
                    checkStrictly: true
                },
                type: 'addressSelect',
                unfold: true,
                minLayers: 3,
                span: 4
            },
            {
                name: '状态',
                value: 'configStatus',
                type: 'select',
                optionNum: 'CONFIG_STATUS',
                unfold: true,
                span: 4
            }
        ],
        unfoldState: false,
        advancedBtn: true
    },
    table: {
        switchType: true,
        tableCut: true,
        clickModify: true,
        selectBtn: true,
        leftOperation: true,
        height: 400,
        statesY: '启用',
        statesN: '停用',
        leftWidth: 105,
        columns: [
            {
                label: '发货仓',
                prop: 'whName',
                type: 'advance',
                width: 200,
                require: true,
                advanceConfig: [
                    { prop: 'cdwhName', value: '仓库名称' },
                    { prop: 'whCode', value: '仓库编码' }
                ],
                tableConfig: [
                    { prop: 'whCode', value: '仓库编码' },
                    { prop: 'cdwhName', value: '仓库名称' }
                ],
                advanceUrl: 'cdWarehouse/search?cdwhIsStop=0',
                cbParams: [
                    'whCode', 'cdwhName#whName'
                ]
            },
            {
                label: '发货地',
                prop: 'senderCode',
                labelCn: 'senderName',
                width: 200,
                config: {
                    checkStrictly: true
                },
                type: 'addressSelect',
                require: true,
                minLayers: 3
            },
            {
                label: '收货地',
                prop: 'receiverCode',
                labelCn: 'receiverName',
                mustFill: true,
                width: 200,
                config: {
                    checkStrictly: true
                },
                type: 'addressSelect',
                minLayers: 3,
                require: true
            },
            {
                label: '订单类型',
                prop: 'orderType',
                mustFill: true,
                width: 200,
                type: 'select',
                optionNum: 'ORDER_TYPE',
                require: true
            },
            {
                label: '承运商',
                prop: 'carrierName',
                mustFill: true,
                width: 200,
                type: 'advance',
                require: true,
                advanceConfig: [
                    { prop: 'suppliersNameCn', value: '承运商名称' },
                    { prop: 'suppliersCode', value: '承运商编码' },
                    { prop: 'tranName', value: '采购渠道' }
                ],
                tableConfig: [
                    { prop: 'suppliersNameCn', value: '承运商名称' },
                    { prop: 'suppliersCode', value: '承运商编码' },
                    { prop: 'tranName', value: '采购渠道' }
                ],
                advanceUrl: 'ebSupplier/searchBySupplier',
                cbParams: ['suppliersNameCn#carrierName', 'suppliersCode#carrierCode', 'transType#procurementChannel', 'tranName#procurementChannelName']
            },
            {
                label: '采购渠道',
                prop: 'procurementChannelName',
                width: 160
            },
            {
                label: '订单来源',
                prop: 'sourceSystem',
                width: 200,
                type: 'select',
                optionNum: 'SOURCE_SYSTEM',
                require: true
            },
            {
                label: '客户',
                width: 200,
                prop: 'customerName',
                type: 'advance',
                require: true,
                advanceConfig: [
                    { prop: 'ebcuNameCn', value: '名称' },
                    { prop: 'pmCode', value: '编码' }
                ],
                tableConfig: [
                    { prop: 'pmCode', value: '客户编码' },
                    { prop: 'ebcuNameCn', value: '客户名称' }
                ],
                advanceUrl: '/ebCustomer/searchByEbCustomer',
                cbParams: ['pmCode#customerCode', 'ebcuNameCn#customerName']
            },
            {
                label: '商超',
                prop: 'scPosFlag',
                type: 'select',
                width: 200,
                optionNum: 'YES_OR_NO',
                require: true
            },
            {
                label: '状态',
                prop: 'configStatus',
                activeValue: 1,
                inactiveValue: 0,
                defaultValue: 1,
                width: 100,
                type: 'switch',
                require: true
            },
            {
                label: '修改人',
                prop: 'updateUserName',
                width: 120
            },
            {
                label: '修改时间',
                prop: 'updateTime',
                width: 160
            }
        ],
        action: [
            {
                type: 'text',
                label: '编辑',
                size: 'small',
                event: 'edit'
            }
        ]
    },
    page: {
        layout: 'total, sizes, prev, pager, next, jumper',
        pageSize: 10,
        pageSizes: [10, 20, 30, 50, 100]
    },
    searchTotalTitle: [
        {
            name: '订单来源',
            value: 'sourceSystem',
            type: 'select',
            optionNum: 'SOURCE_SYSTEM',
            unfold: true,
            span: 4
        },
        {
            name: '订单类型',
            value: 'orderType',
            type: 'select',
            optionNum: 'ORDER_TYPE',
            unfold: true,
            span: 4
        },
        {
            name: '客户',
            value: 'customerName',
            unfold: true,
            type: 'advance',
            advanceConfig: [
                { prop: 'ebcuNameCn', value: '名称' },
                { prop: 'pmCode', value: '编码' }
            ],
            tableConfig: [
                { prop: 'pmCode', value: '客户编码' },
                { prop: 'ebcuNameCn', value: '客户名称' }
            ],
            advanceUrl: '/ebCustomer/searchByEbCustomer',
            cbParams: ['pmCode#customerCode', 'ebcuNameCn#customerName']
        },
        {
            name: '商超',
            value: 'scPosFlag',
            type: 'select',
            optionNum: 'YES_OR_NO',
            unfold: true,
            span: 4
        },
        {
            name: '承运商',
            value: 'carrierName',
            unfold: true,
            type: 'advance',
            advanceConfig: [
                { prop: 'suppliersNameCn', value: '承运商名称' },
                { prop: 'suppliersCode', value: '承运商编码' },
                { prop: 'tranName', value: '采购渠道' }
            ],
            tableConfig: [
                { prop: 'suppliersNameCn', value: '承运商名称' },
                { prop: 'suppliersCode', value: '承运商编码' },
                { prop: 'tranName', value: '采购渠道' }
            ],
            advanceUrl: 'ebSupplier/searchBySupplier',
            cbParams: ['suppliersNameCn#carrierName', 'suppliersCode#carrierCode']
        }
    ]
};
