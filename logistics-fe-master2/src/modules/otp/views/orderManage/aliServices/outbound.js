export const outbound = {
    searchTotalTitle: [
        {
            name: '仓库',
            value: 'whName',
            unfold: true,
            advanceConfig: [
                { prop: 'cdwhName', value: '仓库名称' },
                { prop: 'whCode', value: '仓库编码' }
            ],
            tableConfig: [
                { prop: 'whCode', value: '仓库编码' },
                { prop: 'cdwhName', value: '仓库名称' }
            ],
            advanceUrl: 'cdWarehouse/search?cdwhIsStop=0',
            cbParams: [
                'whCode', 'cdwhName#whName'
            ],
            type: 'advance',
            span: 4
        },
        {
            name: '业务联系人',
            value: 'contracterName',
            type: 'input'
        },
        {
            name: '客户',
            value: 'cpName',
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
            advanceUrl: '/ebCustomer/searchByEbCustomer',
            cbParams: ['pmCode#customerCode', 'ebcuNameCn#cpName'],
            advanceCode: 'advanceCode',
            span: 4
        },
        {
            name: '创建时间',
            value: 'createTime',
            createStartTime: 'createStartTime',
            createEndTime: 'createEndTime',
            unfold: true,
            type: 'time',
            span: 8
        }
    ]
};