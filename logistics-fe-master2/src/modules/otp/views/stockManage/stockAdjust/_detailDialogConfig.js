const config = {
    goodsAdvanceConfig: {
        label: '商品',
        advanceConfig: [
            { prop: 'cdcmNameCn', value: '商品名称' },
            { prop: 'cdcmCustMaterialNo', value: '客户商品编码' },
            { prop: 'cdcmMaterialNo', value: '商品编码' }
        ],
        tableConfig: [
            { prop: 'cdcmMaterialNo', value: '商品编码' },
            { prop: 'cdcmCustMaterialNo', value: '客户商品编码' },
            { prop: 'cdcmNameCn', value: '商品名称' }
        ],
        // 请求地址
        advanceUrl: 'cdCommonMaterial/searchByMaterial',
        type: 'advance',
        // 需要选中返回的属性，回调通过对象返回下面指定的属性
        cbParams: ['cdcmMaterialNo#itemCode', 'cdcmNameCn#itemName', 'cdcmCustMaterialNo#customerItemCode']
    },
    formData: [
        [
            {
                span: 6,
                label: ' 客户订单号 ',
                prop: 'customerOrderNo',
                type: 'input'
            },
            {
                span: 6,
                label: '上游系统来源',
                prop: 'sourceSystem',
                type: 'select',
                options: [
                    { label: 'CAINIAO', value: 'CAINIAO' },
                    { label: 'CCS', value: 'CCS' },
                    { label: 'ECM', value: 'ECM' },
                    { label: 'PDD', value: 'PDD' }
                ]
            },
            {
                span: 6,
                label: '　调整类型　',
                prop: 'adjustType',
                type: 'select',
                optionNum: 'ADJUST_TYPE'
            },
            {
                span: 6,
                label: '　小　　件　',
                prop: 'smallPiece',
                type: 'checkbox',
                disabled: true
            }
        ],
        [
            {
                span: 6,
                label: '　客　　户　',
                prop: 'customerCodeName',
                type: 'advance',
                advanceLabel: '客户',
                advanceConfig: [
                    { prop: 'ebcuNameCn', value: '客户名称' },
                    { prop: 'pmCode', value: '客户编码' }
                ],
                tableConfig: [
                    { prop: 'pmCode', value: '客户编码' }, //  显示列数
                    { prop: 'ebcuNameCn', value: '客户名称' }
                ],
                advanceUrl: '/ebCustomer/searchByEbCustomer',
                cbParams: ['pmCode#customerCode', 'ebcuNameCn#customerCodeName']
            },
            {
                span: 6,
                label: '　调整状态　',
                prop: 'applyStatus',
                type: 'select',
                optionNum: 'APPLY_STATUS',
                disabled: true
            },
            {
                span: 6,
                label: '原商品状态　',
                prop: 'itemStatusFrom',
                type: 'select',
                optionNum: 'O_ITEM_STATUS'
            },
            {
                span: 6,
                label: '　目标状态　',
                prop: 'itemStatusTo',
                type: 'select',
                optionNum: 'O_ITEM_STATUS'
            }
        ],
        [
            {
                span: 6,
                label: ' 调出财务仓 ',
                prop: 'upperWhCodeFrom',
                type: 'input',
                disabled: true
            },
            {
                span: 6,
                label: ' 调入财务仓 ',
                prop: 'upperWhCodeTo',
                type: 'input',
                disabled: true
            },
            {
                span: 6,
                label: '仓　　　库　',
                prop: 'whCodeName',
                type: 'advance',
                advanceLabel: '仓库',
                advanceConfig: [
                    { prop: 'cdwhName', value: '仓库名称' },
                    { prop: 'whCode', value: '仓库代码' }
                ],
                tableConfig: [
                    { prop: 'cdwhName', value: '仓库名称' },
                    { prop: 'whCode', value: '仓库代码' }
                ],
                // 请求地址
                advanceUrl: 'cdWarehouse/search?cdwhIsStop=0',
                // 需要选中返回的属性，回调通过对象返回下面指定的属性
                cbParams: ['whCode', 'cdwhName#whCodeName']
            },
            {
                span: 6,
                label: '　调整原因　',
                prop: 'adjustReason',
                type: 'select',
                optionNum: 'ADJUST_REASON'
            },
            {
                span: 6,
                label: '　调整单号　',
                prop: 'adjustNo',
                type: 'input',
                disabled: true
            }
        ],
        [
            {
                span: 12,
                label: '　备　　注　',
                prop: 'remark',
                type: 'input'
            }
        ]
    ],
    table: {
        header: [
            {
                prop: 'itemName',
                label: '商品名称'
            },
            {
                prop: 'customerItemCode',
                label: '客户商品编码',
                width: 140
            },
            {
                prop: 'itemCode',
                label: '商品编码',
                width: 140
            },
            {
                prop: 'planQty',
                label: '计划数量',
                width: 130,
                type: 'number',
                defaultValue: '1',
                disabled: false
            },
            {
                prop: 'actQty',
                label: '调整数量',
                width: 130
            },
            {
                prop: 'snCode',
                label: '商品SN',
                width: 150,
                type: 'input',
                disabled: false
            },
            {
                prop: 'updateTime',
                label: '时间',
                width: 160
            }
        ]
    }
};

export default config;
