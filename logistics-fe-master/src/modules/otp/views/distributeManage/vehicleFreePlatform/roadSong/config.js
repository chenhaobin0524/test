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
        'columns': [
            {
                'label': '发车单号',
                'prop': 'dispatchNo',
                'width': '148px'
            },
            {
                'label': '发车平台',
                'prop': 'siteName',
                'width': '100px'
            },
            {
                'label': '发货地省份',
                'prop': 'senderProvinceName',
                'width': '86px'
            },
            {
                'label': '发货地城市',
                'prop': 'senderCityName',
                'width': '86px'
            },
            {
                'label': '发货地区县',
                'prop': 'senderDistrictName',
                'width': '86px'
            },
            {
                'label': '目的地省份',
                'prop': 'receiverProvinceName',
                'width': '86px'
            },
            {
                'label': '目的地城市',
                'prop': 'receiverCityName',
                'width': '88px'
            },
            {
                'label': '目的地区县',
                'prop': 'receiverDistrictName',
                'width': '86px'
            },
            {
                'label': '司机',
                'prop': 'driver',
                'width': '70px'
            },
            {
                'label': '手机',
                'prop': 'driverContactWay',
                'width': '102px'
            },
            {
                'label': '车牌',
                'prop': 'vehicleCard',
                'width': '82px'
            },
            {
                'label': '运输成本',
                'prop': 'allFreight'
            },
            {
                'label': '商品中文名称',
                'prop': 'itemName',
                'width': '120px'
            },
            {
                'label': '第三方单号',
                'prop': 'thirdNum',
                'width': '90px'
            },
            {
                'label': '状态',
                'prop': 'statusText',
                'width': '50px'
            },
            {
                'label': '返回结果',
                'prop': 'result',
                'width': '106px'
            },
            {
                'label': '创建时间',
                'prop': 'createTime',
                'width': '148px'
            }],
        'action': [
            {
                'type': 'text',
                'label': '编辑',
                'size': 'mini',
                'event': 'edit'
            }
        ],
        'leftOperation': true
    },
    'page': {
        'layout': 'total, sizes, prev, pager, next, jumper',
        'pageSize': 10,
        'pageSizes': [10, 20, 30, 50, 100]
    }
};
