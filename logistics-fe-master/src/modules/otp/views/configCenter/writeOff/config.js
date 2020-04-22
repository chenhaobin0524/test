const config = {
    searchList: {
        searchTxt: [
            {
                name: '来源系统',
                value: 'sourceSystem',
                type: 'select',
                unfold: true,
                options: [],
                optionNum: 'SOURCE_SYSTEM',
                span: 4
            },
            {
                name: '订单类型',
                value: 'orderType',
                type: 'select',
                unfold: true,
                options: [],
                optionNum: 'ORDER_TYPE',
                span: 4
            }],
        unfoldState: false,
        advancedBtn: false
    },
    table:
    {
        switchType: true,
        tableCut: true,
        clickModify: true,
        selectBtn: true,
        leftOperation: true,
        statesY: '启用',
        statesN: '停用',
        height: 400,
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
            {
                label: '来源系统',
                prop: 'sourceSystem',
                width: 120,
                require: true,
                mustFill: true,
                type: 'select',
                optionNum: 'SOURCE_SYSTEM',
                options: []
            },
            {
                label: '订单来源',
                prop: 'orderSource',
                width: 120,
                require: true,
                mustFill: true,
                type: 'select',
                optionNum: 'ORDER_SOURCE',
                options: []
            },
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
                label: '原出库单限制',
                prop: 'isNeedRelation',
                activeValue: '1',
                inactiveValue: '0',
                defaultValue: '0',
                width: 100,
                type: 'switch',
                require: true
            },
            {
                label: '原出库单限制明细',
                type: 'detail',
                prop: 'detail',
                require: true,
                width: 120
            },
            {
                label: '修改人',
                align: 'center',
                prop: 'updateUserCode',
                width: 120
            },
            {
                label: '修改时间',
                align: 'center',
                prop: 'updateTime',
                width: 160
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
    configuration: true
};

export default config;
