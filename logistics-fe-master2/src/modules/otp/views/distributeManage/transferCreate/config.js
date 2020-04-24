export default {
    'configuration': false,
    'transferTables': true,
    'popPrefix': '/api-mdm/dictionaryDetail/dict',
    'searchList': {
        'searchTxt': [
            {
                'name': '客户订单号',
                'value': 'customerOrderNo',
                'type': 'input',
                'unfold': true,
                'span': 3
            },
            {
                'name': '合同编号',
                'value': 'contractNo',
                'type': 'input',
                'unfold': true,
                'span': 3
            },
            {
                name: '创建时间',
                value: 'createTime',
                type: 'time',
                unfold: true,
                timeNum: 30,
                span: 6
            }
        ],
        'unfoldState': false,
        'advancedBtn': true
    },
    'table': {
        'leftOperation': false,
        'seperateTree': true,
        'fixedSeletionColumn': true,
        'expandTable': false,
        'height': '100%',
        'clickState': true,
        'selectBtn': true,
        'columns': [
            {
                'label': '运输单号',
                'sort': true,
                'prop': 'taskNo',
                'width': 160
            },
            {
                'label': '合同编号',
                'sort': true,
                'prop': 'contractNo',
                'width': 160
            },
            {
                'label': '客户订单号',
                'sort': true,
                'prop': 'customerOrderNo',
                'width': 160
            },
            // {
            //     'label': '移交状态',
            //     'sort': false,
            //     'prop': 'transferStatusText111',
            //     'width': 160
            // },
            {
                'label': '客户',
                'sort': true,
                'prop': 'customerName',
                'width': 160
            },
            {
                'label': '移交人',
                'sort': true,
                'prop': 'transferPersonName',
                'width': 160
            },
            {
                'label': '签收人',
                'sort': true,
                'prop': 'signContact',
                'width': 160
            },
            {
                'label': '签收时间',
                'sort': true,
                'prop': 'signTime',
                'width': 160
            },
            {
                'label': '移交单号',
                'sort': true,
                'prop': 'transferNo',
                'width': 160
            },
            {
                'label': '移交时间',
                'sort': true,
                'prop': 'transferDate',
                'width': 160
            },
            {
                'label': '移交类型',
                'sort': true,
                'prop': 'transType',
                'width': 160
            },
            {
                label: '是否完好',
                sort: true,
                prop: 'signIsFullText'
            },
            {
                'label': '目的地市',
                'prop': 'receiverCityName',
                'width': 110
            },
            {
                'label': '目的地区',
                'prop': 'receiverDistrictName',
                'sort': true,
                'width': 110
            }
        ]
    },
    'tableTarget': {
        'leftOperation': false,
        'seperateTree': true,
        'fixedSeletionColumn': true,
        'height': '100%',
        'clickState': true,
        'selectBtn': true,
        'expandTable': false,
        'funnelPlaceholder': '移交单',
        'columns': [
            {
                'label': '运输单号',
                'sort': false,
                'prop': 'taskNo',
                'width': 160
            },
            {
                'label': '合同编号',
                'sort': false,
                'prop': 'contractNo',
                'width': 160
            },
            {
                'label': '客户订单号',
                'sort': false,
                'prop': 'customerOrderNo',
                'width': 160
            },
            // {
            //     'label': '移交状态',
            //     'sort': false,
            //     'prop': 'transferStatusText',
            //     'width': 160
            // },
            {
                'label': '客户',
                'sort': false,
                'prop': 'customerName',
                'width': 160
            },
            {
                'label': '移交人',
                'sort': false,
                'prop': 'transferPersonName',
                'width': 160
            },
            {
                'label': '签收人',
                'sort': false,
                'prop': 'signContact',
                'width': 160
            },
            {
                'label': '签收时间',
                'sort': false,
                'prop': 'signTime',
                'width': 160
            },
            {
                'label': '移交单号',
                'sort': false,
                'prop': 'transferNo',
                'width': 160
            },
            {
                'label': '移交时间',
                'sort': false,
                'prop': 'transferDate',
                'width': 160
            },
            {
                'label': '移交类型',
                'sort': false,
                'prop': 'transType',
                'width': 160
            },
            {
                label: '是否完好',
                sort: true,
                prop: 'signIsFullText'
            },
            {
                'label': '目的地市',
                'prop': 'receiverCityName',
                'width': 110
            },
            {
                'label': '目的地区',
                'prop': 'receiverDistrictName',
                'sort': true,
                'width': 110
            }
        ]
    },
    'searchTotalTitle': [
        {
            'name': '运输单号',
            'value': 'taskNo',
            'type': 'input'
        },
        {
            'name': '客户',
            'value': 'customerName',
            'type': 'advance',
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
            'name': '目的地市',
            'value': 'receiverCityName',
            'type': 'advance',
            'advanceConfig': [
                { 'prop': 'ebplNameCn', 'value': '目的地市名称' },
                { 'prop': 'ebplCode', 'value': '目的地市编码' }
            ],
            'tableConfig': [
                { 'prop': 'ebplNameCn', 'value': '目的地省名称' },
                { 'prop': 'ebplCode', 'value': '目的地市编码' }
            ],
            'cbParams': [
                'ebplCode#receiverCityCode', 'ebplNameCn#receiverCityName'
            ],
            'advanceUrl': '/searchEbPlacePage?ebplType=PLACE_CITY',
            'advanceCode': 'receiverCityCode'
        },
        {
            'name': '目的地区',
            'value': 'receiverDistrictName',
            'type': 'advance',
            'advanceConfig': [
                { 'prop': 'ebplNameCn', 'value': '目的地区名称' },
                { 'prop': 'ebplCode', 'value': '目的地区编码' }
            ],
            'tableConfig': [
                { 'prop': 'ebplNameCn', 'value': '目的地区名称' },
                { 'prop': 'ebplCode', 'value': '目的地区编码' }
            ],
            'cbParams': [
                'ebplCode#receiverDistrictCode', 'ebplNameCn#receiverDistrictName'
            ],
            'advanceUrl': '/searchEbPlacePage?ebplType=PLACE_DISTRICT',
            'advanceCode': 'receiverDistrictCode'
        }
    ]
};
