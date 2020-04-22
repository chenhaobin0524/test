const tableHeader = [
    // 表头数据
    { prop: 'dhm', label: '时间', format: 'dateTime', minWidth: '140px', sortable: true, headerFilter: 'visible' },
    { prop: 'plazano', label: '编码', minWidth: '140px', sortable: true, headerFilter: 'visible' },
    { prop: 'plazano2', label: '名称', minWidth: '140px', sortable: true, format: val => val + '多聪明', headerFilter: 'visible' },
    { prop: 'car_plate', sortable: true, label: '号码' },
    { prop: 'card_no', label: '卡号', minWidth: '120px' },
    { prop: 'laneno', label: '数据类型', format: function (val) { return val.substr(2, 1) ? '雷兵兵出口' : '入口'; } },
    { prop: 'staffname', label: '姓名', minWidth: '100px' },
    { prop: 'mediatype', label: '付款方式' },
    { prop: 'comp_cash', label: '计算费额' },
    { prop: 'fact_cash', label: '实收费额' },
    {
        prop: 'oper',
        label: '操作',
        fixed: 'right',
        minWidth: '100px',
        oper: [
            { name: '查看', clickFun: () => {} },
            { name: '编辑', clickFun: () => {} }
        ]
    }
];

export default tableHeader;