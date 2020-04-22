export default {
    'searchList': {
        'searchTxt': [{
            'name': '发车单号',
            'value': 'dispatchNo',
            'type': 'input',
            'unfold': true,
            'span': 3
        }, {
            'name': '创建时间',
            'value': 'createTime',
            'startTime': 'beginDate',
            'endTime': 'endDate',
            'startPlaceholder': '创建开始日期',
            'endPlaceholder': '创建结束日期',
            'type': 'time',
            'unfold': true,
            'span': 7
        }, {
            'name': '状态',
            'value': 'status',
            'type': 'select',
            'unfold': true,
            'span': 3,
            'optionNum': 'S_F_FLAG',
            'multiple': false
        },
        {
            'name': '服务平台',
            'value': 'siteName',
            'type': 'advance',
            'unfold': true,
            'advanceConfig': [
                { 'prop': 'escoCompanyNameCn', 'value': '服务平台名称' },
                { 'prop': 'escoCompanyNo', 'value': '服务平台编码' }
            ],
            'tableConfig': [
                { 'prop': 'escoCompanyNameCn', 'value': '服务平台名称' },
                { 'prop': 'escoCompanyNo', 'value': '服务平台编码' }
            ],
            'advanceUrl': '/searchPlatform',
            'cbParams': ['escoCompanyNo#siteCode', 'escoCompanyNameCn#siteName'],
            'advanceCode': 'advanceCode',
            'span': 3
        }],
        'unfoldState': false,
        'advancedBtn': false
    },
    'table':
    {
        'clickState': false,
        'selectBtn': true,
        'height': 400,
        'fixedSeletionColumn': true,
        'columns': [
            {
                'label': '发车单号',
                'prop': 'dispatchNo',
                'width': '148px'
            },
            {
                'label': '会计主体',
                'prop': 'invoiceUnitName',
                'width': '86px'
            },
            {
                'label': '发车平台',
                'prop': 'siteName',
                'width': '100px'
            },
            {
                'label': '发货详细地址',
                'prop': 'senderDetailAddr',
                'width': '120px'
            },
            {
                'label': '收货详细地址',
                'prop': 'receiverDetailAddr',
                'width': '120px'
            },
            {
                'label': '收货人',
                'prop': 'receiver',
                'width': '70px'
            },
            {
                'label': '收货人电话',
                'prop': 'receiverContactWay',
                'width': '102px'
            },
            {
                'label': '司机',
                'prop': 'driver',
                'width': '86px'
            },
            {
                'label': '司机电话',
                'prop': 'driverContactWay',
                'width': '110px'
            },
            {
                'label': '车牌',
                'prop': 'vehicleCard',
                'width': '82px'
            },
            {
                'label': '身份证号',
                'prop': 'driverCard',
                'width': '120px'
            },
            {
                'label': '运输成本',
                'prop': 'allFreight',
                'width': '90px'
            },
            {
                'label': '商品中文名称',
                'prop': 'itemName',
                'width': '120px'
            },
            {
                'label': '重量（Kg）',
                'prop': 'weight',
                'width': '90px'
            },
            {
                'label': '状态',
                'prop': 'statusText',
                'width': '80px'
            },
            {
                'label': '返回结果',
                'prop': 'result',
                'width': '110px'
            },
            {
                'label': '创建时间',
                'prop': 'createTime',
                'width': '160px'
            }],
        'action': [
            {
                'type': 'text',
                'label': '编辑',
                'size': 'mini',
                'event': 'edit'
            },
            {
                'type': 'text',
                'label': '删除',
                'size': 'mini',
                'event': 'delete'
            }
        ],
        'leftOperation': true,
        'leftWidth': 100
    },
    'page': {
        'layout': 'total, sizes, prev, pager, next, jumper',
        'pageSize': 10,
        'pageSizes': [10, 20, 30, 50, 100]
    }
};