export default {
    configuration: true,
    searchList: {
        searchTxt: [
            {
                'name': '来源系统',
                'value': 'sourceSystem',
                'type': 'select',
                'optionNum': 'SOURCE_SYSTEM',
                span: 4,
                unfold: true
            },
            {
                'name': '订单类型',
                'value': 'orderType',
                'type': 'select',
                'optionNum': 'ORDER_TYPE',
                span: 4,
                unfold: true
            }
        ],
        unfoldState: false,
        advancedBtn: false
    },
    table: {
        switchType: true,
        tableCut: true,
        clickModify: true,
        selectBtn: true,
        leftOperation: true,
        height: 400,
        statesY: '启用',
        statesN: '停用',
        leftWidth: 105,
        columns: [
            {
                'label': '业务模式',
                'prop': 'businessMode',
                'require': true,
                'width': 120,
                'type': 'select',
                'optionNum': 'BUSINESS_MODE',
                mustFill: true
            },
            {
                'label': '来源系统',
                'prop': 'sourceSystem',
                'require': true,
                'mustFill': true,
                'width': 120,
                'type': 'select',
                'optionNum': 'SOURCE_SYSTEM'
            },
            {
                label: '订单来源',
                prop: 'orderSource',
                width: 200,
                type: 'select',
                optionNum: 'ORDER_SOURCE',
                require: true,
                mustFill: true
            },
            {
                label: '订单类型',
                prop: 'orderType',
                width: 200,
                type: 'select',
                optionNum: 'ORDER_TYPE',
                require: true
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
                label: '允许零出入库关单',
                prop: 'zeroInClose',
                activeValue: '1',
                inactiveValue: '0',
                defaultValue: '0',
                width: 100,
                type: 'switch',
                require: true
            },
            {
                label: '修改人',
                prop: 'updateUserCode',
                width: 120
            },
            {
                label: '修改时间',
                prop: 'updateTime',
                width: 160
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
        pageSizes: [10, 20, 30, 50, 100]
    }
};
