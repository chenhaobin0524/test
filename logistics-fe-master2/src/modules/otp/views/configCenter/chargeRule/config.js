export default {
    'searchList': {
        'searchTxt': [
            {
                'unfold': true,
                'span': 3,
                'name': '客户',
                'value': 'customerName',
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

            }, {
                'name': '订单类型',
                'value': 'orderType',
                'type': 'select',
                'unfold': true,
                'optionNum': 'ORDER_TYPE',
                'options': [],
                'span': 3
            }, {
                'name': '计费标识',
                'value': 'feeType',
                'type': 'select',
                'unfold': true,
                'optionNum': 'SYS_LMDM_GENERATE_STEVEDORAGE',
                'options': [],
                'span': 3
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
                'span': 3
            },
            {
                'name': '服务平台',
                'value': 'siteName',
                'unfold': true,
                'advanceConfig': [
                    { 'prop': 'escoCompanyNameCn', 'value': '服务平台名称' },
                    { 'prop': 'escoCompanyNo', 'value': '服务平台编码' }
                ],
                'tableConfig': [
                    { 'prop': 'escoCompanyNo', 'value': '服务平台编码' },
                    { 'prop': 'escoCompanyNameCn', 'value': '服务平台名称' }
                ],
                'advanceUrl': '/searchPlatform',
                'cbParams': ['escoCompanyNo#siteCode', 'escoCompanyNameCn#siteName'],
                'type': 'advance',
                'advanceCode': 'advanceCode',
                'span': 3
            }],
        'unfoldState': false,
        'advancedBtn': false
    },
    'table':
    {
        'switchType': true,
        'tableCut': true,
        'clickModify': true,
        'selectBtn': true,
        'leftOperation': true,
        'height': 400,
        'statesY': '是',
        'statesN': '否',
        'columns': [
            {
                'label': '客户',
                'prop': 'customerName',
                'require': true,
                'mustFill': true,
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
                'label': '订单类型',
                'prop': 'orderType',
                'require': true,
                'mustFill': true,
                'width': 120,
                'type': 'select',
                'optionNum': 'ORDER_TYPE',
                'options': []
            },
            {
                'label': '平台',
                'prop': 'siteName',
                'require': true,
                'mustFill': true,
                'width': 200,
                'advanceConfig': [
                    { 'prop': 'escoCompanyNameCn', 'value': '服务平台名称' },
                    { 'prop': 'escoCompanyNo', 'value': '服务平台编码' }
                ],
                'tableConfig': [
                    { 'prop': 'escoCompanyNo', 'value': '服务平台编码' },
                    { 'prop': 'escoCompanyNameCn', 'value': '服务平台名称' },
                    { 'prop': 'branchCompanyNo', 'value': '分公司编码' },
                    { 'prop': 'branchCompanyName', 'value': '分公司名称' }
                ],
                'advanceUrl': '/searchPlatform',
                'type': 'advance',
                'cbParams': ['escoCompanyNo#siteCode', 'escoCompanyNameCn#siteName']
            },
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
                'type': 'advance',
                'advanceCascade': 'siteCode'
            },
            {
                'label': '是否自提',
                'prop': 'pickFlag',
                'type': 'select',
                'require': true,
                'width': 100,
                'options': [
                    { 'label': '是', 'value': 'Y' },
                    { 'label': '否', 'value': 'N' }
                ]
            },
            {
                'label': '计费标识',
                'prop': 'feeType',
                'mustFill': true,
                'width': 120,
                'require': true,
                'type': 'select',
                'optionNum': 'SYS_LMDM_GENERATE_STEVEDORAGE',
                'options': []
            },
            {
                'label': '修改人',
                'prop': 'updateUserName',
                'width': 120
            },
            {
                'label': '修改时间',
                'prop': 'updateTime',
                'width': 160,
                'type': 'dateTime'
            }],
        'action': [
            {
                'type': 'text',
                'label': '编辑',
                'size': 'small',
                'event': 'edit'
            }
        ]
    },
    'configuration': true,
    'page': {
        'layout': 'total, sizes, prev, pager, next, jumper',
        'pageSize': 10,
        'pageSizes': [10, 20, 50, 100]
    },
    'import': {
        'ImportConfig': {
            'action': `${process.env.VUE_APP_API_URL || ''}/api-otp/loadingFeeRule/import`,
            'multiple': true,
            'accept': 'xlsx/text',
            'showFileList': true,
            'fileType': '只能上传Excel文件',
            'manualUpload': true
        },
        'ImportContent': [
            {
                'fileName': '装卸计费.xlsx',
                'fileSize': '10.5KB',
                'downLoadInfo': {
                    'url': ' https://lcapi.midea.com/api-file/ossDown/221E3F05DE3A467DA9B2F79682D750E9/lcloud/%E8%A3%85%E5%8D%B8%E8%AE%A1%E8%B4%B9%E8%A7%84%E5%88%99%E5%AF%BC%E5%85%A5_%E6%A8%A1%E6%9D%BF_1584608040091.xlsx'
                }
            }
        ]
    }
};
