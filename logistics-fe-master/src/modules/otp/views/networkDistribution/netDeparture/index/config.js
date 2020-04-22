export default {
    configuration: true,
    searchList: {
        searchTxt: [{
            name: '网点名称',
            value: 'networkName',
            type: 'advance',
            unfold: true,
            advanceConfig: [
                { 'prop': 'netName', 'value': '网点名称' },
                { 'prop': 'netCode', 'value': '网点编码' }
            ],
            tableConfig: [
                { 'prop': 'netName', 'value': '网点名称' },
                { 'prop': 'netCode', 'value': '网点编码' }
            ],
            advanceUrl: '/netInfos',
            cbParams: ['netCode#networkCode', 'netName#networkName'],
            advanceCode: 'advanceCode',
            span: 3
        },
        {
            name: '服务平台',
            value: 'siteName',
            advanceConfig: [
                { prop: 'escoCompanyNameCn', value: '服务平台名称' },
                { prop: 'escoCompanyNo', value: '服务平台编码' }
            ],
            tableConfig: [
                { prop: 'escoCompanyNo', value: '服务平台编码' },
                { prop: 'escoCompanyNameCn', value: '服务平台名称' }
            ],
            advanceUrl: '/searchPlatform',
            cbParams: ['escoCompanyNo#siteCode', 'escoCompanyNameCn#siteName'],
            type: 'advance',
            advanceCode: 'advanceCode',
            unfold: true,
            span: 3
        },
        {
            name: '推送状态',
            value: 'pushBmsStatus',
            type: 'select',
            unfold: true,
            options: [
                { value: '0', label: '未推送' },
                { value: '1', label: '成功' },
                { value: '2', label: '失败' }
            ],
            span: 3
        },
        {
            name: '创建时间',
            value: 'createTime',
            type: 'time',
            unfold: true,
            span: 5
        }],
        unfoldState: false,
        advancedBtn: false
    },
    table:
    {
        selectBtn: true,
        height: 400,
        leftWidth: 100,
        columns: [
            {
                label: '发车单号',
                prop: 'dispatchInventedNo',
                width: '180px'
            },
            {
                label: '网点名称',
                prop: 'networkName',
                width: '130px'
            },
            {
                label: '推送状态',
                prop: 'pushBmsStatusName',
                width: '100px'
            },
            {
                label: '单据类型',
                prop: 'inOutTypeName',
                width: '80px'
            },
            {
                label: '单量',
                prop: 'taskCount',
                width: '80px'
            },
            {
                label: '重量（Kg）',
                prop: 'grossWeight',
                width: '80px'
            },
            {
                label: '方量（m³）',
                prop: 'volume',
                width: '80px'
            },
            {
                label: '总里程（Km）',
                prop: 'totalMileage',
                width: '100px'
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
                label: '推送时间',
                prop: 'pushBmsTime',
                width: '70px'
            },
            {
                label: '推送人',
                prop: 'pushBmsUser',
                width: '70px'
            }
        ],
        action: [],
        leftOperation: false
    },
    page: {
        layout: 'total, sizes, prev, pager, next, jumper',
        pageSize: 10,
        pageSizes: [10, 20, 30, 50, 100]
    },
    searchTotalTitle: [
        {
            name: '来源平台',
            value: 'siteName',
            advanceConfig: [
                { prop: 'escoCompanyNameCn', value: '来源平台名称' },
                { prop: 'escoCompanyNo', value: '来源平台编码' }
            ],
            tableConfig: [
                { prop: 'escoCompanyNo', value: '来源平台编码' },
                { prop: 'escoCompanyNameCn', value: '来源平台名称' }
            ],
            advanceUrl: '/searchPlatform',
            cbParams: ['escoCompanyNo#orderSourcePlatform', 'escoCompanyNameCn#siteName'],
            type: 'advance',
            advanceCode: 'advanceCode'
        }
    ]
};
