export default {
    'searchList': {
        'searchTxt': [
            {
                'name': '客户订单号',
                'value': 'customerOrderNo',
                'type': 'input',
                'unfold': true,
                'span': 4
            },
            {
                'name': '创建时间',
                'value': 'searchTime',
                'type': 'time',
                'unfold': true,
                timeNum: 7,
                'span': 6,
                'startPlaceholder': '创建开始时间',
                'endPlaceholder': '创建结束时间'
            },
            {
                'name': '签收状态',
                'value': 'signStatus',
                'type': 'select',
                'unfold': true,
                'span': 4,
                'optionNum': 'SIGN_STATUS',
                'multiple': true
            }
        ],
        'unfoldState': false,
        'advancedBtn': true
    },
    'table':
    {
        'clickState': false,
        'selectBtn': true,
        'height': 400,
        'columns': [
            {
                'label': '运输单号',
                'prop': 'taskNo',
                width: '192px',
                sort: true
            },
            {
                'label': '客户订单号',
                'prop': 'customerOrderNo',
                width: '192px',
                sort: true
            },
            {
                'label': '发车单号',
                'prop': 'dispatchNo',
                sort: true
            },
            {
                'label': '客户',
                'prop': 'customerName',
                width: '242px',
                sort: true
            },
            {
                'label': '合同编号',
                'prop': 'contractNo',
                sort: true
            },
            {
                'label': '是否完好',
                'prop': 'signIsFullText',
                sort: true
            },
            {
                'label': '集配单号',
                'prop': 'collectNo',
                width: '172px',
                sort: true
            },
            {
                'label': '服务平台',
                'prop': 'siteName',
                sort: true
            },
            {
                'label': '附件',
                'prop': 'files',
                'type': 'photos',
                'ifHas': '04050004',
                sort: true
            },
            {
                'label': '上传状态',
                'prop': 'receiptStatusText',
                sort: true
            },
            {
                'label': '签收状态',
                'prop': 'signStatusText',
                optionNum: 'SIGN_STATUS',
                sort: true
            },
            {
                'label': '签收人',
                'prop': 'signContact',
                sort: true
            },
            {
                'label': '签收时间',
                'prop': 'signTime',
                width: '182px',
                sort: true
            },
            {
                'label': '逾期明细',
                type: 'detail',
                sort: true
            },
            {
                'label': '项目分类',
                'prop': 'projectClassifyText',
                sort: true
            },
            {
                'label': '要求回单时间',
                'prop': 'requestFileDate',
                width: '182px',
                sort: true
            },
            {
                'label': '要求签收时间',
                'prop': 'requestSignDate',
                width: '182px',
                sort: true
            },
            // {
            //     'label': '逾期一级原因',
            //     'prop': 'overdueReasonText'
            // },
            // {
            //     'label': '逾期二级原因',
            //     'prop': 'overdueReasDetailText'
            // },
            // {
            //     'label': '逾期备注',
            //     'prop': 'overdueDesc'
            // },
            {
                'label': '上传时间',
                'prop': 'electronicTime',
                width: '182px',
                sort: true
            },
            {
                'label': '上传方式',
                'prop': 'receiptSourceText',
                sort: true
            },
            {
                'label': '物流单号',
                'prop': 'orderNo',
                sort: true
            },
            {
                'label': '业务模式',
                'prop': 'businessMode',
                sort: true
            },
            {
                'label': '承运商',
                'prop': 'carrierName',
                sort: true
            },
            {
                'label': '发车时间',
                'prop': 'actDepartTime',
                sort: true
            },
            {
                'label': '网配审核',
                'prop': 'netCheck',
                sort: true
            },
            {
                'label': '采购渠道',
                'prop': 'procurementChannelText',
                sort: true
            },
            {
                'label': '是否下发',
                'prop': 'carrierVisibleFlagName',
                'sort': true,
                'width': 80
            },
            {
                'label': '收货单位',
                'prop': 'upperReceiverName',
                sort: true
            }
        ],
        'action': [
            {
                'type': 'text',
                'label': '签收',
                'size': 'small',
                'event': 'view',
                'ifHas': '04050007'
            },
            {
                'type': 'text',
                'label': '拒收',
                'size': 'small',
                'event': 'edit',
                'ifHas': '04050008'
            }],
        'leftOperation': true,
        'leftWidth': 105
    },
    'page': {
        'layout': 'total, sizes, prev, pager, next, jumper',
        'pageSize': 10,
        'pageSizes': [10, 20, 30, 50, 100]
    },
    // 高级搜索配置项
    searchTotalTitle: [
        {
            name: '运输单号',
            value: 'taskNo',
            type: 'input'
        },
        {
            name: '合同号',
            value: 'contractNo',
            type: 'input'
        },
        {
            name: '订单号',
            value: 'orderNo',
            type: 'input'
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
            name: '服务平台',
            value: 'siteName',
            unfold: true,
            type: 'advance',
            advanceConfig: [
                { prop: 'escoCompanyNameCn', value: '名称' },
                { prop: 'escoCompanyNo', value: '编码' }
            ],
            tableConfig: [
                { prop: 'escoCompanyNo', value: '平台编码' },
                { prop: 'escoCompanyNameCn', value: '平台名称' }
            ],
            advanceUrl: '/searchPlatform',
            cbParams: ['escoCompanyNo#siteCode', 'escoCompanyNameCn#siteName']
        },
        {
            name: '上传方式',
            value: 'receiptSource',
            type: 'select',
            optionNum: 'SYS_TMS_UPLOAD_WAY'
        },
        {
            name: '是否完好',
            value: 'signIsFull',
            type: 'select',
            optionNum: 'signIsFull'
        },
        {
            name: '项目分类',
            value: 'projectClassify',
            type: 'select',
            optionNum: 'PROJECT_CLASSIFY'
        },
        {
            name: '业务模式',
            value: 'businessMode',
            type: 'select',
            optionNum: 'BUSINESS_MODE'
        },
        {
            name: '上传状态',
            value: 'receiptStatus',
            type: 'select',
            optionNum: 'SYS_TMS_UPLOAD_STATUS'
        },
        {
            name: '发车单号',
            value: 'dispatchNo',
            type: 'input'
        },
        {
            'name': '要求签收时间',
            'value': 'signTime',
            'type': 'time',
            'timeNum': 0
        },
        {
            'name': '承运商',
            'advanceLabel': '承运商',
            'value': 'carrierName',
            'advanceConfig': [
                { 'prop': 'suppliersNameCn', 'value': '承运商名称' },
                { 'prop': 'suppliersCode', 'value': '承运商编码' },
                { 'prop': 'tranName', 'value': '采购渠道' }
            ],
            'tableConfig': [
                { 'prop': 'suppliersNameCn', 'value': '承运商名称' },
                { 'prop': 'suppliersCode', 'value': '承运商编码' },
                { 'prop': 'tranName', 'value': '采购渠道' }
            ],
            'advanceUrl': 'ebSupplier/searchBySupplier',
            'type': 'advance',
            'cbParams': [
                'suppliersNameCn#carrierName', 'suppliersCode#carrierCode', 'tranName', 'transType'
            ],
            'advanceCascade': 'suppliersCode#carrierCode'
        },
        {
            name: '网配审核',
            value: 'isNetCheck',
            type: 'select',
            options: [
                { value: 'Y', label: '是' }, { value: 'N', label: '否' }
            ]
        },
        {
            'name': '采购渠道',
            'value': 'procurementChannel',
            'optionNum': 'OTP_TMS_PROCUREMENT_CHANNEL',
            'type': 'select'
        },
        {
            'name': '是否下发',
            'value': 'carrierVisibleFlag',
            'type': 'select',
            'options': [{ 'value': 'Y', 'label': '是' }, { 'value': 'N', 'label': '否' }]
        },
        {
            name: '收货单位',
            value: 'upperReceiverName',
            type: 'input'
        }
    ]
};
