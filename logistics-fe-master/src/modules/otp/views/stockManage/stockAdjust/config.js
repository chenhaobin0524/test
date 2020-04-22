const config = {
    searchList: {
        searchTxt: [
            {
                name: '客户订单号',
                value: 'customerOrderNo',
                unfold: true,
                span: 4,
                type: 'input'
            }, {
                name: '调整类型',
                value: 'adjustType',
                type: 'select',
                unfold: true,
                options: [],
                optionNum: 'ADJUST_TYPE',
                span: 3
            }, {
                name: '调整状态',
                value: 'applyStatus',
                type: 'select',
                unfold: true,
                options: [],
                optionNum: 'APPLY_STATUS',
                span: 3
            },
            {
                name: '创建时间',
                value: 'createTime',
                type: 'time',
                unfold: true,
                timeNum: 60,
                span: 7
            }],
        unfoldState: false,
        advancedBtn: false
    },
    table:
    {
        height: 400,
        columns: [
            {
                label: '客户订单号',
                prop: 'customerOrderNo',
                align: 'center',
                columnStick: true
            },
            {
                label: '仓库',
                prop: 'whCodeName',
                align: 'center',
                columnStick: true
            },
            {
                label: '客户',
                prop: 'customerCodeName',
                align: 'center',
                columnStick: true
            },
            {
                label: '调整状态',
                prop: 'applyStatusName',
                align: 'center'
            },
            {
                label: '调整类型',
                prop: 'adjustTypeName',
                align: 'center'
            },
            {
                label: '上游系统来源',
                prop: 'sourceSystemName',
                align: 'center'
            },
            {
                label: '原商品状态',
                prop: 'itemStatusFromName',
                align: 'center'
            },
            {
                label: '目标状态',
                prop: 'itemStatusToName',
                align: 'center'
            },
            {
                label: '创建时间',
                prop: 'createTime',
                align: 'center'
            },
            {
                label: '调整单号',
                prop: 'adjustNo',
                align: 'center'
            }],
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
        pageSizes: [10, 20, 50, 100]
    },
    configuration: false
};

export default config;
