const config = {
    goodsAdvanceConfig: {
        label: '商品',
        advanceConfig: [
            { prop: 'cdcmNameCn', value: '商品名称' },
            { prop: 'cdcmCustMaterialNo', value: '客户商品编码' },
            { prop: 'cdcmMaterialNo', value: '商品编码' }
        ],
        tableConfig: [
            { prop: 'cdcmMaterialNo', value: '商品编码' },
            { prop: 'cdcmCustMaterialNo', value: '客户商品编码' },
            { prop: 'cdcmNameCn', value: '商品名称' }
        ],
        // 请求地址
        advanceUrl: 'cdCommonMaterial/searchByMaterial',
        type: 'advance',
        // 需要选中返回的属性，回调通过对象返回下面指定的属性
        cbParams: ['cdcmMaterialNo#customerItemCode', 'cdcmNameCn#itemName', 'cdcmCustMaterialNo#customerItemCode']
    },
    formData: [
        [
            {
                span: 6,
                label: '订单号',
                prop: 'orderNo',
                'value': 'orderNo',
                'unfold': true,
                'advanceConfig': [
                    { 'prop': '', 'value': '全部' },
                    { 'prop': 'orderNo', 'value': '订单号' }
                ],
                'tableConfig': [
                    { 'prop': 'orderNo', 'value': '订单号' },
                    { 'prop': 'customerName', 'value': '客户名称' },
                    { 'prop': 'customerCode', 'value': '客户编码' },
                    { 'prop': 'companyName', 'value': '分公司' },
                    { 'prop': 'siteName', 'value': '平台' },
                    { 'prop': 'createTime', 'value': '创建时间' }
                ],
                prefix: 'api-otp',
                'advanceUrl': '/orderInfos',
                'type': 'advance',
                // 异常类型去掉，让用户自己选 by lj
                'cbParams': ['customerName', 'customerCode', 'exceptionDesc', 'customerOrderNo', 'orderNo', 'companyName', 'siteName', 'whCode', 'whName', 'deliveryType']
            },
            {
                span: 6,
                label: '客户单号',
                prop: 'customerOrderNo',
                type: 'input'
            },
            {
                span: 6,
                label: '客户名称',
                prop: 'customerName',
                type: 'input',
                disabled: true
            },
            {
                'label': '商品',
                'value': 'itemName',
                'prop': 'itemName',
                'unfold': true,
                'advanceConfig': [
                    { 'prop': 'cdcmNameCn', 'value': '商品名称' },
                    { 'prop': 'cdcmMaterialNo', 'value': '商品编码' }
                ],
                'tableConfig': [
                    { 'prop': 'cdcmMaterialNo', 'value': '商品编码' },
                    { 'prop': 'cdcmNameCn', 'value': '商品名称' }
                ],
                'advanceUrl': 'cdCommonMaterial/searchByMaterial',
                'type': 'advance',
                'cbParams': ['cdcmMaterialNo#itemCode', 'cdcmNameCn#itemName'],
                'span': 5
            }
        ],
        [
            {
                'label': '改约日期/时间',
                'prop': 'appointmentTime',
                'type': 'time',
                'unfold': true,
                'span': 6
            },
            {
                span: 6,
                label: '配送类型',
                prop: 'deliveryType',
                type: 'select',
                optionNum: 'DELIVERY_TYPE',
                options: [],
                disabled: true
            },
            {
                label: '异常类型',
                prop: 'exceptionType',
                type: 'select',
                unfold: true,
                filterable: true,
                optionNum: 'EXCEPTION_REASON',
                options: [],
                span: 5
            }
        ],
        [
            {
                span: 6,
                label: '分公司名称',
                prop: 'companyName',
                type: 'input',
                disabled: true
            },
            {
                span: 6,
                label: '平台',
                prop: 'siteName',
                type: 'input',
                disabled: true
            },
            {
                span: 6,
                label: '单据状态',
                prop: 'checkStatus',
                type: 'select',
                options: [
                    {
                        'label': '未关闭',
                        'value': 0
                    },
                    {
                        'label': '已关闭',
                        'value': 1
                    }
                ]
            }
        ],
        [
            {
                span: 12,
                label: '异常描述',
                prop: 'exceptionDesc',
                type: 'input'
            }
        ]
    ]
};

export default config;
