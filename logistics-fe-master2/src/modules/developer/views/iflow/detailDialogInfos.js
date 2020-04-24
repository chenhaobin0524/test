export const detailDialogInfos = [
    {
        title: '费率明细',
        type: 'form',
        labelPosition: 'right',
        name: 'detail1',
        contents: [
            // {
            //     lable: '费率主键',
            //     prop: 'transRateItemId',
            //     editAble: false,
            //     value: ''
            // },
            // {
            //     lable: '分公司',
            //     prop: 'companyName',
            //     editAble: false,
            //     value: ''
            // },
            {
                lable: '服务平台',
                prop: 'siteName',
                value: '',
                type: 'advance',
                advanceConfig: [
                    { prop: 'siteCode', value: '服务平台编码' },
                    { prop: 'siteNameCn', value: '服务平台中文名' }
                ],
                advanceUrl: '/esCompany/popSite',
                advanceCode: 'siteCode'
            },
            {
                lable: '业务类型',
                prop: 'businessType',
                value: '',
                type: 'select',
                optionNum: 'SYS_BMS_BUSI_TYPE'
            },
            {
                lable: '费用名称',
                prop: 'feeName',
                value: '',
                type: 'advance',
                advanceConfig: [
                    {
                        prop: 'code',
                        value: '费用名称代码'
                    },
                    {
                        prop: 'name',
                        value: '费用名称'
                    }],
                advanceUrl: '/basicData/costNames',
                advancePrefix: 'web-bms',
                advanceCode: 'feeCode',
                ajaxType: 'post'
            },
            {
                lable: '单据类型',
                prop: 'orderType',
                value: '',
                type: 'select',
                optionNum: 'SYS_BMS_ORDER_TYPE'
            },
            // {
            //     lable: '订单来源',
            //     prop: 'orderSource',
            //     value: '',
            //     type: 'select',
            //     optionNum: 'BMS_ORDER_SOURCE_FROM'
            // },
            // {
            //     lable: '计费方式',
            //     prop: 'chargeWay',
            //     value: '',
            //     type: 'select',
            //     optionNum: 'SYS_BMS_TRANS_CHARGE_WAY'
            // },
            {
                lable: '计费规则',
                prop: 'ruleCode',
                type: 'advance',
                advanceConfig: [
                    {
                        'prop': 'ruleCode',
                        'value': '规则代码'
                    },
                    {
                        'prop': 'ruleName',
                        'value': '规则名称'
                    }],
                advanceUrl: '/calcRules',
                advancePrefix: 'web-bms',
                advanceCode: 'ruleCodeName',
                ajaxType: 'post'
            },
            {
                lable: '价目表',
                align: 'center',
                prop: 'priceCode',
                width: 160,
                require: true,
                type: 'advance',
                advanceConfig: [
                    {
                        'prop': 'priceCode',
                        'value': '价目表代码'
                    },
                    {
                        'prop': 'priceName',
                        'value': '价目表名称'
                    }],
                advanceUrl: '/calcPrices',
                advancePrefix: 'web-bms',
                advanceCode: 'priceName',
                ajaxType: 'post'
            },
            // {
            //     lable: '是否集拼',
            //     prop: 'ifCollect',
            //     value: '',
            //     type: 'select',
            //     optionNum: 'SYS_BMS_CYCLE_COLLECT_WAY'
            // },
            // {
            //     lable: '集拼方式',
            //     prop: 'collectUnit',
            //     value: ''
            // },
            {
                lable: '结算对象名称',
                prop: 'clearingObjectName',
                value: '',
                type: 'advance',
                advanceConfig: [
                    { prop: 'suppliersCode', value: '供应商编码' },
                    { prop: 'suppliersNameCn', value: '供应商中文名' },
                    { prop: 'supplierNameEn', value: '供应商英文名' }
                ],
                advanceUrl: '/ebSupplier/popSupplier',
                advanceCode: 'clearingObjectCode'
            },
            // {
            //     lable: '指定客户',
            //     prop: 'appointCustomer',
            //     value: ''
            // },
            // {
            //     lable: '客户名称',
            //     prop: 'customerName',
            //     value: ''
            // },
            // {
            //     lable: '结算客户名称',
            //     prop: 'clearingCustomerName',
            //     value: ''
            // },
            // {
            //     lable: '油卡支付比例',
            //     prop: 'oilPayRatio',
            //     value: ''
            // },
            {
                lable: '税率',
                align: 'center',
                prop: 'taxRate',
                width: 160,
                type: 'advance',
                advanceConfig: [
                    { 'prop': 'nameCn', 'value': '税率名称' },
                    { 'prop': 'currency', 'value': '税率编码' }
                ],
                advanceUrl: '/efCurrency/search',
                advancePrefix: '/api-mdm',
                require: true,
                advanceCode: 'taxRateCode'
            },
            {
                lable: '币种',
                align: 'center',
                prop: 'currency',
                width: 160,
                type: 'advance',
                advanceConfig: [
                    { 'prop': 'nameCn', 'value': '币种名称' },
                    { 'prop': 'currency', 'value': '币种编码' }
                ],
                advanceUrl: '/efCurrency/search',
                advancePrefix: '/api-mdm',
                require: true
            },
            // {
            //     lable: '状态',
            //     prop: 'enabledFlag',
            //     value: '',
            //     type: 'select',
            //     optionNum: 'SYS_BMS_RATE_DETAIL_FLAG'
            // },
            {
                lable: '生效日期',
                prop: 'effectiveDate',
                value: '',
                type: 'date'
            },
            {
                lable: '失效日期',
                prop: 'expirationDate',
                value: '',
                type: 'date'
            },
            {
                lable: '备注',
                prop: 'remark',
                value: ''
            }
        ]
    }
];
