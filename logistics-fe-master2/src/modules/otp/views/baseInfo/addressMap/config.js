export default {
    'configuration': true,
    'searchList': {
        'searchTxt': [
            {
                name: '上游省份',
                value: 'upperProvince',
                type: 'input',
                unfold: true,
                span: 4
            },
            {
                name: '上游市',
                value: 'upperCity',
                type: 'input',
                unfold: true,
                span: 4
            },
            {
                name: '上游区',
                value: 'upperDistrict',
                type: 'input',
                unfold: true,
                span: 4
            },
            {
                name: '上游镇',
                value: 'upperTown',
                type: 'input',
                unfold: true,
                span: 4
            },
            {
                name: '映射地址',
                value: 'location',
                span: 4,
                unfold: true,
                config: {
                    checkStrictly: true
                },
                type: 'addressSelect'
            }
        ],
        'unfoldState': false,
        'advancedBtn': false
    },
    'table': {
        'tableCut': true,
        'clickModify': true,
        'selectBtn': true,
        'leftOperation': true,
        'height': 400,
        'columns': [
            {
                label: '上游省',
                prop: 'upperProvince',
                require: true,
                width: 150
            },
            {
                label: '上游市',
                prop: 'upperCity',
                require: true,
                width: 150
            },
            {
                label: '上游县',
                prop: 'upperDistrict',
                require: true,
                width: 150
            },
            {
                label: '上游镇',
                prop: 'upperTown',
                require: true,
                width: 150
            },
            {
                'label': '省/市/区(县)',
                'prop': 'location',
                'minLayers': 2,
                'require': true,
                'width': 200,
                'labelCn': 'locationName',
                'type': 'addressSelect',
                'config': {
                    checkStrictly: true
                }
            },
            {
                'label': '修改人',
                'align': 'center',
                'prop': 'updateUserCode',
                'width': 120
            },
            {
                'label': '修改时间',
                'align': 'center',
                'prop': 'updateTime',
                'width': 160,
                'type': 'text'
            }
        ],
        'action': [
            {
                'type': 'text',
                'label': '编辑',
                'size': 'small',
                'event': 'edit'
            }
        ]
    },
    'page': {
        'layout': 'total, sizes, prev, pager, next, jumper',
        'pageSize': 10,
        'pageSizes': [
            10,
            20,
            50,
            100
        ]
    },
    'searchTotalTitle': [
        {
            'name': '业务模式',
            'value': 'businessMode',
            'type': 'select',
            'optionNum': 'BUSINESS_MODE',
            'options': []
        },
        {
            'name': '省/市/区/乡镇',
            'value': 'townCode',
            'labelCn': 'townName',
            'type': 'addressSelect',
            'config': {
                'checkStrictly': true
            }
        },
        {
            'name': '修改人',
            'value': 'modifyUserName',
            'type': 'input'
        },
        {
            'name': '修改时间',
            'value': 'modifyTime',
            'type': 'time'
        }
    ]
};