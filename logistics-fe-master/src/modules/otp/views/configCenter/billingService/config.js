const config = {
    configuration: true,
    searchList: {
        searchTxt: [
            {
                name: '业务模式',
                value: 'businessMode',
                unfold: true,
                type: 'select',
                span: 4,
                optionNum: 'BUSINESS_MODE',
                options: []
            },
            {
                name: '客户',
                value: 'customerName',
                type: 'advance',
                unfold: true,
                advanceConfig: [
                    { prop: 'ebcuNameCn', value: '客户名称' },
                    { prop: 'pmCode', value: '客户编码' }
                ],
                tableConfig: [
                    { prop: 'pmCode', value: '客户编码' },
                    { prop: 'ebcuNameCn', value: '客户名称' }
                ],
                advanceUrl: 'ebCustomer/searchByEbCustomer',
                cbParams: ['pmCode#customerCode', 'ebcuNameCn#customerName'],
                advanceCode: 'advanceCode',
                span: 4
            },
            {
                name: '订单类型',
                value: 'orderType',
                unfold: true,
                type: 'select',
                span: 4,
                optionNum: 'ORDER_TYPE',
                options: []
            }
        ],
        unfoldState: false,
        advancedBtn: true
    },
    table: {
        tableCut: true,
        clickModify: true,
        selectBtn: true,
        height: 400,
        leftWidth: 100,
        leftOperation: true,
        columns: [
            {
                label: '业务模式',
                prop: 'businessMode',
                require: true,
                mustFill: true,
                width: 120,
                type: 'select',
                optionNum: 'BUSINESS_MODE',
                options: []
            },
            // {
            //     label: '配送方式',
            //     prop: 'deliveryType',
            //     require: true,
            //     // mustFill: true,
            //     width: 120,
            //     type: 'select',
            //     optionNum: 'DELIVERY_TYPE',
            //     options: []
            // },
            {
                label: '订单类型',
                prop: 'orderType',
                require: true,
                width: 120,
                type: 'select',
                optionNum: 'ORDER_TYPE',
                options: []
            },
            {
                label: '客户名称',
                prop: 'customerName',
                mustFill: true,
                require: true,
                width: 100,
                tableConfig: [
                    { prop: 'ebcuNameCn', value: '客户名称' },
                    { prop: 'pmCode', value: '客户编码' }
                ],
                // 请求地址
                advanceUrl: '/ebCustomer/searchByEbCustomer',
                type: 'advance',
                // 需要选中返回的属性，回调通过对象返回下面指定的属性
                cbParams: ['pmCode#customerCode', 'ebcuNameCn#customerName']
            },
            {
                label: '平台',
                prop: 'siteName',
                require: true,
                mustFill: true,
                width: 120,
                // 配置搜索条件
                advanceConfig: [
                    { prop: 'escoCompanyNameCn', value: '服务平台名称' },
                    { prop: 'escoCompanyNo', value: '服务平台编码' }
                ],
                // 配置表格列
                tableConfig: [
                    { prop: 'escoCompanyNo', value: '服务平台编码' },
                    { prop: 'escoCompanyNameCn', value: '服务平台名称' },
                    { prop: 'branchCompanyNo', value: '分公司编码' },
                    { prop: 'branchCompanyName', value: '分公司名称' }
                ],
                // 请求地址
                advanceUrl: '/searchPlatform',
                type: 'advance',
                // 需要选中返回的属性，回调通过对象返回下面指定的属性
                cbParams: ['escoCompanyNo#siteCode', 'escoCompanyNameCn#siteName']
            },
            {
                label: '业务类型',
                prop: 'businessType',
                require: true,
                mustFill: true,
                width: 120,
                type: 'select',
                optionNum: 'BUSINESS_TYPE',
                options: []
            }
        ],
        action: [
            {
                type: 'text',
                label: '编辑',
                size: 'small',
                event: 'edit'
            }
        ]
    },
    page: {
        layout: 'total, sizes, prev, pager, next, jumper',
        pageSize: 10,
        pageSizes: [
            10,
            20,
            50,
            100
        ]
    },
    searchTotalTitle: [
        {
            name: '平台',
            value: 'siteName',
            // 配置搜索条件
            advanceConfig: [
                { prop: 'siteNameCn', value: '服务平台名称' },
                { prop: 'siteCode', value: '服务平台编码' }
            ],
            // 配置表格列
            tableConfig: [
                { prop: 'siteCode', value: '服务平台编码' },
                { prop: 'siteNameCn', value: '服务平台名称' },
                { prop: 'companyCode', value: '分公司编码' },
                { prop: 'companyNameCn', value: '分公司名称' }
            ],
            // 请求地址
            advanceUrl: 'esCompany/popSite',
            type: 'advance',
            // 需要选中返回的属性，回调通过对象返回下面指定的属性
            cbParams: ['siteCode', 'siteNameCn#siteName']
        },
        {
            name: '业务类型',
            value: 'businessType',
            type: 'select',
            optionNum: 'BUSINESS_TYPE',
            options: []
        }
    ],
    import: {
        ImportConfig: {
            action: `${process.env.VUE_APP_API_URL || ''}/api-otp/busineesFeeConfig/import `,
            multiple: true,
            accept: 'xlsx/text',
            showFileList: true,
            fileType: '只能上传Excel文件',
            manualUpload: true
        },
        ImportContent: [
            {
                fileName: '业务类型.xlsx',
                fileSize: '10.5KB',
                downLoadInfo: {
                    url: 'https://lcapi.midea.com/api-file/ossDown/221E3F05DE3A467DA9B2F79682D750E9/lcloud/%E4%B8%9A%E5%8A%A1%E7%B1%BB%E5%9E%8B%E8%A7%84%E5%88%99_1575598618791.xlsx'
                }
            }
        ]
    }
};

export default config;