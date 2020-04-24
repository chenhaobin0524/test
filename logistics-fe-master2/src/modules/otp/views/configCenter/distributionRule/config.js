export default {
    'configuration': true,
    'searchList': {
        'searchTxt': [
            {
                'name': '客户',
                'value': 'customerName',
                'type': 'advance',
                'unfold': true,
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
                'span': 4
            },
            {
                'name': '仓库',
                'value': 'whName',
                'type': 'advance',
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
                'span': 4
            },
            {
                'name': '配送方式',
                'value': 'deliveryType',
                'type': 'select',
                'unfold': true,
                'optionNum': 'DELIVERY_TYPE',
                'options': [],
                'span': 4
            }
        ],
        'unfoldState': false,
        'advancedBtn': true
    },
    'table': {
        'tableCut': true,
        'clickModify': true,
        'selectBtn': true,
        'leftOperation': true,
        'height': 400,
        'columns': [
            {
                'label': '仓库',
                'prop': 'whName',
                'require': true,
                'mustFill': true,
                'width': 200,
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
                'label': '业务模式',
                'prop': 'businessMode',
                'require': true,
                'mustFill': true,
                'width': 120,
                'type': 'select',
                'optionNum': 'BUSINESS_MODE',
                'options': []
            },
            {
                'label': '省/市/区(县)',
                'prop': 'location',
                'minLayers': 3,
                config: {
                    checkStrictly: true
                },
                'require': true,
                'width': 200,
                'labelCn': 'locationName',
                'type': 'addressSelect'
            },
            {
                'label': '客户',
                'prop': 'customerName',
                'require': true,
                'type': 'advance',
                'width': 200,
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
                'label': '配送方式',
                'prop': 'deliveryType',
                'require': true,
                'width': 120,
                'filter': true,
                'mustFill': true,
                'type': 'select',
                'optionNum': 'DELIVERY_TYPE',
                'options': []
            },
            {
                'label': '修改人',
                'align': 'center',
                'prop': 'updateUserCode',
                'width': 120
            },
            {
                'label': '修改时间',
                'align': 'center',
                'prop': 'updateTime',
                'width': 160,
                'type': 'text'
            }
        ],
        'action': [
            {
                'type': 'text',
                'label': '编辑',
                'size': 'small',
                'event': 'edit'
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
    'searchTotalTitle': [
        {
            'name': '业务模式',
            'value': 'businessMode',
            'type': 'select',
            'optionNum': 'BUSINESS_MODE',
            'options': []
        },
        {
            'name': '省/市/区/乡镇',
            'value': 'location',
            'labelCn': 'locationName',
            'type': 'addressSelect',
            'config': {
                'checkStrictly': true
            }
        },
        {
            'name': '修改人',
            'value': 'modifyUserName',
            'type': 'input'
        },
        {
            'name': '修改时间',
            'value': 'modifyTime',
            'type': 'time'
        }
    ],
    'import': {
        'ImportConfig': {
            'action': `${process.env.VUE_APP_API_URL || ''}/api-otp/shippingTypeRule/excelImport`,
            'multiple': true,
            'accept': 'xlsx/text',
            'showFileList': true,
            'fileType': '只能上传Excel文件',
            'manualUpload': true
        },
        'ImportContent': [
            {
                'fileName': '配送方式规则.xlsx',
                'fileSize': '9KB',
                'downLoadInfo': {
                    'url': 'https://lcapi.midea.com/api-file/ossDown/221E3F05DE3A467DA9B2F79682D750E9/lcloud/%E9%85%8D%E9%80%81%E6%96%B9%E5%BC%8F%E8%A7%84%E5%88%99_1567233871877.xlsx'
                }
            }
        ]
    }
};