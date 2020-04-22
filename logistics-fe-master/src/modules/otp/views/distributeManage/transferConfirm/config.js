export default {
    'searchList': {
        'searchTxt': [
            {
                'name': '移交单号',
                'value': 'transferNo',
                'type': 'input',
                'unfold': true,
                'span': 4
            }, {
                'name': '接收时间',
                'value': 'searchTime',
                'type': 'time',
                'unfold': true,
                'span': 7,
                timeNum: 30,
                'startPlaceholder': '移交开始日期',
                'endPlaceholder': '移交结束日期'
            }, {
                'name': '移交状态',
                'value': 'transferStatus',
                'type': 'select',
                'unfold': true,
                'span': 4,
                'optionNum': 'TRANSFER_STATUS',
                'multiple': false
            }
        ],
        'unfoldState': false,
        'advancedBtn': true
    },
    'table':
    {
        'clickState': false,
        'selectBtn': false,
        'height': 400,
        'columns': [
            {
                'label': '移交单号',
                'prop': 'transferNo'
            },
            {
                'label': '运输单数量',
                'prop': 'signCount'
            },
            {
                'label': '移交类型',
                'prop': 'transTypeText'
            },
            {
                'label': '移交状态',
                'prop': 'transferStatusText'
            },
            {
                'label': '附件',
                'prop': 'files',
                'type': 'photos',
                'ifHas': '04070001'
            },
            {
                'label': '客户',
                'prop': 'customerName'
            },
            {
                'label': '接收人',
                'prop': 'receiptPersonName'
            },
            {
                'label': '接收时间',
                'prop': 'receiptDate'
            },
            {
                'label': '移交人',
                'prop': 'transferPersonName'
            },
            {
                'label': '移交时间',
                'prop': 'transferDate'
            }
        ],
        'action': [
            {
                'type': 'text',
                'label': '接收',
                'size': 'small',
                'event': 'view',
                'ifHas': '04070004'
            },
            {
                'type': 'text',
                'label': '打印',
                'size': 'small',
                'event': 'edit',
                'ifHas': '04070005'
            }
        ],
        'leftOperation': true,
        'leftWidth': 120
    },
    'page': {
        'layout': 'total, sizes, prev, pager, next, jumper',
        'pageSize': 10,
        'pageSizes': [10, 20, 30, 50, 100]
    }
};
