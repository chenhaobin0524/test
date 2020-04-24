export default {
    'configuration': true,
    'searchList': {
        'searchTxt': [
            {
                'name': '客户',
                'value': 'customerName',
                'unfold': true,
                'type': 'advance',
                'span': 4,
                'advanceConfig': [
                    { 'prop': 'ebcuNameCn', 'value': '客户名称' },
                    { 'prop': 'pmCode', 'value': '客户编码' }
                ],
                'tableConfig': [
                    { 'prop': 'pmCode', 'value': '客户编码' },
                    { 'prop': 'ebcuNameCn', 'value': '客户名称' }
                ],
                'advanceUrl': '/ebCustomer/searchByEbCustomer',
                'cbParams': ['pmCode#customerCode', 'ebcuNameCn#customerName'],
                'advanceCode': 'advanceCode'
            },
            {
                'name': '仓库',
                'value': 'whName',
                'unfold': true,
                'advanceConfig': [
                    { 'prop': 'cdwhName', 'value': '仓库名称' },
                    { 'prop': 'whCode', 'value': '仓库编码' }
                ],
                'tableConfig': [
                    { 'prop': 'whCode', 'value': '仓库编码' },
                    { 'prop': 'cdwhName', 'value': '仓库名称' }
                ],
                'advanceUrl': 'cdWarehouse/search?cdwhIsStop=0',
                'cbParams': [
                    'whCode', 'cdwhName#whName'
                ],
                'type': 'advance',
                'span': 4
            },
            {
                'name': '订单类型',
                'value': 'orderType',
                'unfold': true,
                'type': 'select',
                'span': 4,
                'optionNum': 'ORDER_TYPE',
                'options': []
            },
            {
                'name': '状态',
                'value': 'enableFlag',
                'unfold': true,
                'type': 'select',
                'span': 4,
                'options': [
                    {
                        'label': '启用',
                        'value': 1
                    },
                    {
                        'label': '停用',
                        'value': 0
                    }
                ]
            }
        ],
        'unfoldState': false,
        'advancedBtn': true
    },
    'table': {
        'clickModify': true,
        'selectBtn': true,
        'leftWidth': 100,
        'leftOperation': true,
        'customBtn': true,
        'height': 400,
        'btnDisplayCredentials': ['enableFlag'],
        'columns': [
            {
                'label': '客户',
                'prop': 'customerName',
                'require': true,
                'mustFill': true,
                'width': 120
            },
            {
                'label': '客户时效名称',
                'prop': 'customerAgingName',
                'require': true,
                'mustFill': true,
                'width': 120
            },
            {
                'label': '仓库',
                'prop': 'whName',
                'require': true,
                'width': 120,
                'advanceConfig': [
                    { 'prop': 'cdwhName', 'value': '仓库名称' },
                    { 'prop': 'whCode', 'value': '仓库编码' }
                ],
                'tableConfig': [
                    { 'prop': 'whCode', 'value': '仓库编码' },
                    { 'prop': 'cdwhName', 'value': '仓库名称' }
                ],
                'advanceUrl': 'cdWarehouse/search?cdwhIsStop=0',
                'cbParams': [
                    'whCode', 'cdwhName#whName'
                ],
                'type': 'advance'
            },
            {
                'label': '订单类型',
                'prop': 'orderType',
                'require': true,
                'width': 100,
                'type': 'select',
                'optionNum': 'ORDER_TYPE',
                'options': []
            },
            {
                'label': '一级分拨仓',
                'prop': 'distributionWhName',
                'value': 'distributionWhName',
                'require': true,
                'width': 120,
                'advanceConfig': [
                    { 'prop': 'cdwhName', 'value': '仓库名称' },
                    { 'prop': 'whCode', 'value': '仓库编码' }
                ],
                'tableConfig': [
                    { 'prop': 'whCode', 'value': '仓库编码' },
                    { 'prop': 'cdwhName', 'value': '仓库名称' }
                ],
                'advanceUrl': 'cdWarehouse/search?cdwhIsStop=0',
                'cbParams': [
                    'whCode', 'cdwhName#distributionWhName'
                ],
                'type': 'advance'
            },
            {
                'label': '业务模式',
                'prop': 'businessMode',
                'value': 'businessMode',
                'require': true,
                'width': 100,
                'type': 'select',
                'optionNum': 'BUSINESS_MODE',
                'options': []
            },
            {
                'label': '发货地',
                'prop': 'sendTown',
                'require': true,
                'mustFill': true,
                'width': 160
            },
            {
                'label': '收货地',
                'prop': 'receiveTown',
                'require': true,
                'mustFill': true,
                'width': 160
            },
            {
                'label': '时效产品',
                'prop': 'agingProductName',
                'require': true,
                'mustFill': true,
                'width': 120
            },
            {
                'label': '状态',
                'prop': 'enableFlag',
                'require': true,
                'mustFill': true,
                'type': 'select',
                'options': [
                    {
                        'label': '启用',
                        'value': 1
                    },
                    {
                        'label': '停用',
                        'value': 0
                    }
                ]
            }
        ],
        'action': [
            [
                {
                    'type': 'text',
                    'label': '编辑',
                    'size': 'small',
                    'event': 'edit',
                    'displayCode': 0
                },
                {
                    'type': 'text',
                    'label': '查看',
                    'size': 'small',
                    'event': 'view',
                    'displayCode': 1
                }
            ]
        ],
        'ImportConfig': {
            'action': `${process.env.VUE_APP_API_URL || ''}/api-otp/customerAgingConfig/import`,
            'multiple': false,
            'accept': 'xlsx/text',
            'showFileList': true,
            'fileType': '只能上传Excel文件，且不超过500kb',
            'manualUpload': true
        },
        'ImportContent': [
            {
                'fileName': '客户时效.xlsx',
                'fileSize': '10.5KB',
                'downLoadInfo': {
                    'url': 'https://lcapi.midea.com/api-file/ossDown/221E3F05DE3A467DA9B2F79682D750E9/lcloud/%E5%AE%A2%E6%88%B7%E6%97%B6%E6%95%88_1577417443854.xlsx'
                }
            }
        ]
    },
    'page': {
        'layout': 'total, sizes, prev, pager, next, jumper',
        'pageSize': 10,
        'pageSizes': [
            10,
            20,
            50,
            100
        ]
    },
    'dialog': {
        'type': 'normal',
        'title': '时效编码',
        'gutter': 10,
        'width': '1280px',
        'btnList': [{
            'type': 'negative',
            'text': '取消'
        }, {
            'type': 'sure',
            'text': '确定'
        }],
        'dialogForm': {
            'labelWidth': 8,
            'inputWidth': 16,
            'labelEnd': true,
            'inline': true,
            'btnSpan': 3,
            'inputList': [
                {
                    'label': '客户时效名称',
                    'prop': '',
                    'value': 'customerAgingName',
                    'mustFill': true,
                    'span': 6,
                    'type': 'text'
                },
                {
                    'label': '客户时效编码',
                    'value': 'customerAgingCode',
                    'disabled': true,
                    'readOnly': true,
                    'span': 6,
                    'type': 'text'
                },
                {
                    'label': '订单类型',
                    'value': 'orderType',
                    'relyOnVlaue': [
                        { 'field': 'deliveryType', 'value': 'YS', 'targetValue': 'ZT', 'setValue': '' }
                    ],
                    'span': 6,
                    'type': 'dictionary',
                    'mustFillOpration': true,
                    'mustFill': true,
                    'optionNum': 'ORDER_TYPE'
                },
                {
                    'label': '业务模式',
                    'prop': '',
                    'value': 'businessMode',
                    'span': 6,
                    'type': 'dictionary',
                    'optionNum': 'BUSINESS_MODE',
                    'mustFill': true
                },
                {
                    'label': '客户',
                    'name': '客户',
                    'prop': 'customerName',
                    'value': 'customerName',
                    'span': 6,
                    'type': 'advance',
                    'advanceLabel': '客户',
                    'advanceConfig': [
                        { 'prop': 'ebcuNameCn', 'value': '客户名称' },
                        { 'prop': 'pmCode', 'value': '客户编码' }
                    ],
                    'tableConfig': [
                        { 'prop': 'pmCode', 'value': '客户编码' },
                        { 'prop': 'ebcuNameCn', 'value': '客户名称' }
                    ],
                    'advanceUrl': 'ebCustomer/searchByEbCustomer',
                    'cbParams': ['pmCode#customerCode', 'ebcuNameCn#customerName']
                },
                {
                    'label': '配送方式',
                    'value': 'deliveryType',
                    'relyOnVlaue': [
                        { 'field': 'orderType', 'value': 'ZT', 'targetValue': 'YS', 'setValue': '' }
                    ],
                    'span': 6,
                    'type': 'dictionary',
                    'mustFill': true,
                    'optionNum': 'DELIVERY_TYPE'
                },
                {
                    'label': '平台',
                    'name': '平台',
                    'advanceLabel': '平台',
                    'prop': 'siteName',
                    'value': 'siteName',
                    'span': 6,
                    'mustFill': true,
                    'width': 200,
                    'advanceConfig': [
                        { 'prop': 'escoCompanyNameCn', 'value': '平台名称' },
                        { 'prop': 'escoCompanyNo', 'value': '平台编码' }
                    ],
                    'tableConfig': [
                        { 'prop': 'escoCompanyNo', 'value': '平台编码' },
                        { 'prop': 'escoCompanyNameCn', 'value': '平台名称' },
                        { 'prop': 'branchCompanyNo', 'value': '分公司编码' },
                        { 'prop': 'branchCompanyName', 'value': '分公司名称' }
                    ],
                    'advanceUrl': 'searchPlatform',
                    'type': 'advance',
                    'cbParams': ['escoCompanyNo#siteCode', 'escoCompanyNameCn#siteName']
                },
                {
                    'label': '仓库',
                    'name': '仓库',
                    'mustFill': false,
                    'advanceLabel': '仓库',
                    'mustFillRelyOn': { 'orderType': '!=YS' },
                    'prop': 'whName',
                    'value': 'whName',
                    'span': 6,
                    'type': 'advance',
                    'advanceCascade': 'siteCode',
                    'advanceConfig': [
                        { 'prop': 'cdwhName', 'value': '仓库名称' },
                        { 'prop': 'whCode', 'value': '仓库编码' }
                    ],
                    'tableConfig': [
                        { 'prop': 'whCode', 'value': '仓库编码' },
                        { 'prop': 'cdwhName', 'value': '仓库名称' }
                    ],
                    'advanceUrl': 'cdWarehouse/search?cdwhIsStop=0',
                    'cbParams': [
                        'whCode#whCode', 'cdwhName#whName'
                    ]
                },
                {
                    'label': '一级分拨仓',
                    'name': '一级分拨仓',
                    'prop': 'distributionWhName',
                    'value': 'distributionWhName',
                    'advanceLabel': '一级分拨仓',
                    'span': 6,
                    'type': 'advance',
                    'advanceConfig': [
                        { 'prop': 'cdwhName', 'value': '仓库名称' },
                        { 'prop': 'whCode', 'value': '仓库编码' }
                    ],
                    'tableConfig': [
                        { 'prop': 'whCode', 'value': '仓库编码' },
                        { 'prop': 'cdwhName', 'value': '仓库名称' }
                    ],
                    'advanceUrl': 'cdWarehouse/search?cdwhIsStop=0',
                    'cbParams': [
                        'whCode#distributionWhCode', 'cdwhName#distributionWhName'
                    ]
                },
                {
                    'label': '二级分拨仓',
                    'name': '二级分拨仓',
                    'prop': 'nextDistributeWhName',
                    'value': 'nextDistributeWhName',
                    'advanceLabel': '二级分拨仓',
                    'span': 6,
                    'type': 'advance',
                    'advanceConfig': [
                        { 'prop': 'cdwhName', 'value': '仓库名称' },
                        { 'prop': 'whCode', 'value': '仓库编码' }
                    ],
                    'tableConfig': [
                        { 'prop': 'whCode', 'value': '仓库编码' },
                        { 'prop': 'cdwhName', 'value': '仓库名称' }
                    ],
                    'advanceUrl': 'cdWarehouse/search?cdwhIsStop=0',
                    'cbParams': [
                        'whCode#nextDistributeWhCode', 'cdwhName#nextDistributeWhName'
                    ]
                },
                {
                    'label': '定日达周期',
                    'prop': '',
                    'value': 'agingCircle',
                    'span': 6,
                    'type': 'text'
                },
                {
                    'label': '时效产品',
                    'prop': '',
                    'value': 'agingProduct',
                    'mustFill': true,
                    'span': 6,
                    'type': 'dictionary',
                    'optionNum': '',
                    'options': []
                },
                {
                    'label': '发货地',
                    'value': 'send',
                    'minLayers': 3,
                    'span': 6,
                    'mustFill': false,
                    'mustFillRelyOn': { 'orderType': 'RI|DPRI|YS' },
                    'disabledRelyOn': { 'deliveryType': 'ZT' },
                    'valueDependentOnDisabled': { 'val': true, 'setValue': [] },
                    'type': 'addressSelect',
                    'config': {
                        'checkStrictly': true
                    }
                },
                {
                    'label': '收货地',
                    'value': 'receive',
                    'mustFillRelyOn': { 'orderType': 'PO|AO|DP|YS' },
                    'disabledRelyOn': { 'deliveryType': 'ZT' },
                    'minLayers': 3,
                    'mustFill': true,
                    'valueDependentOnDisabled': { 'val': true, 'setValue': [] },
                    'span': 6,
                    'type': 'addressSelect',
                    'config': {
                        'checkStrictly': true
                    }
                },
                {
                    'label': '上游平台',
                    'name': '上游平台',
                    'value': 'sourceSystem',
                    'span': 6,
                    'type': 'dictionary',
                    'optionNum': 'SOURCE_SYSTEM'
                },
                {
                    'label': '截单开始时间',
                    'prop': '',
                    'value': 'orderStartTime',
                    'mustFillRelyOn': { 'orderType': 'YS|PO|AO|RO|TFO|ADO|TO|DO|RDO|TF', 'deliveryType': '!=ZT' },
                    'mustFill': false,
                    'span': 6,
                    'type': 'select',
                    'options': []
                },
                {
                    'label': '截单结束时间',
                    'prop': '',
                    'value': 'orderEndTime',
                    'mustFillRelyOn': { 'orderType': 'YS|PO|AO|RO|TFO|ADO|TO|DO|RDO|TF', 'deliveryType': '!=ZT' },
                    'mustFill': false,
                    'span': 6,
                    'type': 'select',
                    'options': []
                },
                {
                    'label': '时效起点',
                    'prop': '',
                    'value': 'agingStartTime',
                    'mustFillRelyOn': { 'orderType': 'YS|PO|AO|RO|TFO|ADO|TO|DO|RDO|TF', 'deliveryType': '!=ZT' },
                    'mustFill': false,
                    'span': 6,
                    'type': 'select',
                    'options': []
                }
            ]
        },
        'dialogTable': {
            'width': '',
            'border': true,
            'isPagination': true,
            'btnActive': true,
            'columns': [
                {
                    'label': '订单状态',
                    'prop': 'status',
                    'type': 'select',
                    'mustFill': true,
                    'optionNum': 'AGING_ORDER_STATUS',
                    'options': []
                },
                {
                    'label': '时效要求',
                    'mustFill': true,
                    'prop': 'agingHour'
                },
                {
                    'label': '预警',
                    'prop': 'warnHour'
                },
                {
                    'label': '计算起点',
                    'prop': 'begainStatus',
                    'type': 'select',
                    'optionNum': 'AGING_ORDER_STATUS',
                    'options': []
                }
            ],
            'action': {
                'fixed': 'right',
                'width': '80',
                'list': [
                    {
                        'text': '删除',
                        'event': 'delete'
                    },
                    {
                        'text': '编辑',
                        'event': 'edit'
                    }
                ]
            }
        }
    },
    'searchTotalTitle': [
        {
            'name': '客户时效名称',
            'value': 'customerAgingName',
            'type': 'input'
        },
        {
            'name': '客户时效编码',
            'value': 'customerAgingCode',
            'type': 'input'
        },
        {
            'name': '业务模式',
            'value': 'businessMode',
            'type': 'select',
            'optionNum': 'BUSINESS_MODE'
        },
        {
            'name': '配送方式',
            'value': 'deliveryType',
            'type': 'select',
            'optionNum': 'DELIVERY_TYPE'
        },
        {
            'name': '平台',
            'value': 'siteName',
            'advanceConfig': [
                { 'prop': 'escoCompanyNameCn', 'value': '服务平台名称' },
                { 'prop': 'escoCompanyNo', 'value': '服务平台编码' },
                { 'prop': 'branchCompanyNo', 'value': '分公司编码' },
                { 'prop': 'branchCompanyName', 'value': '分公司名称' }
            ],
            'tableConfig': [
                { 'prop': 'escoCompanyNo', 'value': '服务平台编码' },
                { 'prop': 'escoCompanyNameCn', 'value': '服务平台名称' },
                { 'prop': 'branchCompanyNo', 'value': '分公司编码' },
                { 'prop': 'branchCompanyName', 'value': '分公司名称' }
            ],
            'advanceUrl': 'searchPlatform',
            'type': 'advance',
            'cbParams': ['escoCompanyNo#siteCode', 'escoCompanyNameCn#siteName']
        },
        {
            'name': '一级分拨仓',
            'value': 'distributionWhName',
            'type': 'advance',
            'advanceConfig': [
                { 'prop': 'cdwhName', 'value': '仓库名称' },
                { 'prop': 'whCode', 'value': '仓库编码' }
            ],
            'tableConfig': [
                { 'prop': 'whCode', 'value': '仓库编码' },
                { 'prop': 'cdwhName', 'value': '仓库名称' }
            ],
            'advanceUrl': 'cdWarehouse/search?cdwhIsStop=0',
            'cbParams': [
                'whCode#distributionWhCode', 'cdwhName#distributionWhName'
            ]
        },
        {
            'name': '二级分拨仓',
            'value': 'nextDistributeWhName',
            'type': 'advance',
            'advanceConfig': [
                { 'prop': 'cdwhName', 'value': '仓库名称' },
                { 'prop': 'whCode', 'value': '仓库编码' }
            ],
            'tableConfig': [
                { 'prop': 'whCode', 'value': '仓库编码' },
                { 'prop': 'cdwhName', 'value': '仓库名称' }
            ],
            'advanceUrl': 'cdWarehouse/search?cdwhIsStop=0',
            'cbParams': [
                'whCode#nextDistributeWhCode', 'cdwhName#nextDistributeWhName'
            ]
        },
        {
            'name': '定日达周期',
            'value': 'agingCircle',
            'type': 'input'
        },
        {
            'name': '时效产品',
            'value': 'agingProduct',
            'type': 'select',
            'optionNum': '',
            'options': []
        },
        {
            'name': '起始地',
            'value': 'sendTownCode',
            'minLayers': 3,
            'type': 'addressSelect',
            'config': {
                'checkStrictly': true,
                'clearable': true
            }
        },
        {
            'name': '目的地',
            'value': 'receiveTownCode',
            'minLayers': 3,
            'type': 'addressSelect',
            'config': {
                'checkStrictly': true,
                'clearable': true
            }
        },
        {
            'name': '上游平台',
            'value': 'sourceSystem',
            'type': 'select',
            'optionNum': 'SOURCE_SYSTEM'
        },
        {
            'name': '截单开始时间',
            'value': 'orderStartTime',
            'type': 'select',
            'options': []
        },
        {
            'name': '截单结束时间',
            'value': 'orderEndTime',
            'type': 'select',
            'options': []
        },
        {
            'name': '时效起点',
            'value': 'agingStartTime',
            'type': 'select',
            'options': []
        }
    ]
};