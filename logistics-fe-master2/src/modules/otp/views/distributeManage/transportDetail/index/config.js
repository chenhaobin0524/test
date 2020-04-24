export default {
    searchList: {
        searchTxt: [{
            name: '客户订单号',
            value: 'customerOrderNo',
            type: 'input',
            unfold: true,
            span: 4
        },
        {
            name: '发车单号',
            value: 'dispatchNo',
            type: 'input',
            unfold: true,
            span: 4
        },
        {
            name: '创建时间',
            value: 'createTime',
            startPlaceholder: '创建开始时间',
            endPlaceholder: '创建结束时间',
            type: 'time',
            unfold: true,
            timeNum: 0.2,
            span: 7
        },
        {
            name: '运输单状态',
            value: 'taskStatus',
            type: 'select',
            unfold: true,
            optionNum: 'TRANSPORT_STATUS',
            span: 3
        }

        ],
        unfoldState: false,
        advancedBtn: true
    },
    table: {
        selectBtn: true,
        fixedSeletionColumn: true,
        height: 400,
        leftWidth: 160,
        columns: [{
            label: '运输单号',
            prop: 'taskNo',
            width: '180px'
        },
        {
            label: '客户订单号',
            prop: 'customerOrderNo',
            width: '200px'
        },
        {
            label: '发车单号',
            prop: 'dispatchNo',
            width: '200px'
        },
        {
            label: '订单类型',
            prop: 'orderTypeName',
            width: '120px'
        },
        {
            label: '任务类型',
            prop: 'taskTypeName',
            optionNum: 'TASK_TYPE',
            width: '120px'
        },
        {
            'label': '运输单状态',
            'prop': 'taskStatusName',
            'optionNum': 'TRANSPORT_STATUS',
            'width': 100
        },
        {
            label: '网点编码',
            prop: 'networkCode',
            width: '110px'
        },
        {
            label: '网点名称',
            prop: 'networkName',
            width: '140px'
        },
        {
            label: '服务平台',
            prop: 'siteName',
            width: '110px'
        },
        {
            label: '创建时间',
            prop: 'createTime',
            width: '148px'
        },
        {
            label: '客户',
            prop: 'customerName',
            width: '148px'
        },
        {
            label: '业务模式',
            prop: 'businessMode',
            width: '80px'
        },
        {
            label: '配送方式',
            prop: 'deliveryTypeName',
            optionNum: 'DELIVERY_TYPE',
            width: '80px'
        },
        {
            label: '目的地省',
            prop: 'receiverProvinceName',
            width: '100px'
        },
        {
            label: '目的地市',
            prop: 'receiverCityName',
            width: '148px'
        },
        {
            label: '目的地区',
            prop: 'receiverDistrictName',
            width: '148px'
        },
        {
            label: '目的地县',
            prop: 'receiverTownName',
            width: '148px'
        },
        {
            label: '仓库',
            prop: 'whName',
            width: '148px'
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
            name: '运输单号',
            value: 'taskNo',
            type: 'input'
        },
        {
            name: '订单类型',
            value: 'orderType',
            optionNum: 'ORDER_TYPE',
            type: 'select',
            options: []
        },
        {
            'name': '任务类型',
            'value': 'taskType',
            'type': 'select',
            'optionNum': 'TASK_TYPE',
            'options': []
        },
        {
            name: '配送方式',
            value: 'deliveryType',
            optionNum: 'DELIVERY_TYPE',
            type: 'select',
            options: []
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
            'advanceCode': 'advanceCode'
        },
        {
            name: '网点名称',
            value: 'networkName',
            type: 'input'
        },
        {
            'name': '客户',
            'value': 'cpName',
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
            'cbParams': ['pmCode#customerCode', 'ebcuNameCn#cpName'],
            'advanceCode': 'advanceCode'
        },
        {
            'name': '目的地省',
            'value': 'receiverProvinceName',
            'type': 'advance',
            'advanceConfig': [
                { 'prop': 'ebplNameCn', 'value': '目的地省名称' },
                { 'prop': 'ebplCode', 'value': '目的地省编码' }
            ],
            'tableConfig': [
                { 'prop': 'ebplNameCn', 'value': '目的地省名称' },
                { 'prop': 'ebplCode', 'value': '目的地省编码' }
            ],
            'cbParams': [
                'ebplCode#receiverProvinceCode', 'ebplNameCn#receiverProvinceName'
            ],
            'advanceUrl': '/searchEbPlacePage?ebplType=PLACE_PROVINCE&ebplParentPmCode=100000',
            'advanceCode': 'receiverProvinceCode'
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
        },
        {
            'name': '目的地县',
            'value': 'receiverTownName',
            'type': 'advance',
            'advanceConfig': [
                { 'prop': 'ebplNameCn', 'value': '目的地县名称' },
                { 'prop': 'ebplCode', 'value': '目的地县编码' }
            ],
            'tableConfig': [
                { 'prop': 'ebplNameCn', 'value': '目的地县名称' },
                { 'prop': 'ebplCode', 'value': '目的地县编码' }
            ],
            'cbParams': [
                'ebplCode#receiverTownCode', 'ebplNameCn#receiverTownName'
            ],
            'advanceUrl': '/searchEbPlacePage?ebplType=PLACE_STREET',
            'advanceCode': 'receiverTownCode'
        },
        {
            'name': '网点编码',
            'value': 'networkCode',
            'type': 'input'
        }
    ]
};
