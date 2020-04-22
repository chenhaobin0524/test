const options = {
    // 发货状态
    deliveryFlag: [{ value: '0', label: '未发货' }, { value: '1', label: '已发货' }],
    // 签收状态
    signFlag: [{ value: '0', label: '未签收' }, { value: '1', label: '已签收' }, { value: '9', label: '签收失败' }],
    // 异常标签
    excpFlag: [{ value: '无实物', label: '无实物' }, { value: '推单错误', label: '推单错误' }, { value: '负卖订单', label: '负卖订单' },
        { value: '已发未揽拦截', label: '已发未揽拦截' }, { value: '已拦截', label: '已拦截' }, { value: '无异常', label: '无异常' }, { value: '回传异常', label: '回传异常' },
        { value: '错发', label: '错发' }, { value: '漏发', label: '漏发' }, { value: '未揽：运力不足', label: '未揽：运力不足' }, { value: '未揽：面单异常', label: '未揽：面单异常' },
        { value: '未揽：作业太晚', label: '未揽：作业太晚' }, { value: 'ERP与OMS帐差异', label: 'ERP与OMS帐差异' }, { value: '来往发货', label: '来往发货' }, { value: '库内截件', label: '库内截件' },
        { value: '拒收', label: '拒收' }, { value: '丢件', label: '丢件' }, { value: '换单', label: '换单' }, { value: '逾期在途', label: '逾期在途' },
        { value: '客户信息不详', label: '客户信息不详' }, { value: '客户改期', label: '客户改期' }],
    // 订单类型
    orderType: [{ value: 'TI', label: '中转入库' }, { value: 'TR', label: '传送带入库' }, { value: 'PI', label: '采购入库' }, { value: 'AI', label: '调拨入库' },
        { value: 'RI', label: '退货入库' }, { value: 'PO', label: '销售出库' }, { value: 'TO', label: '中转退货出库' }, { value: 'AO', label: '调拨出库' },
        { value: 'RO', label: '退货出库' }, { value: 'YS', label: '运输订单' }, { value: 'MF', label: '移库订单' }, { value: 'TS', label: '调拨订单' },
        { value: 'AD', label: '数量调整' }, { value: 'TF', label: '状态调整' }, { value: 'HC', label: '拦截红冲' }, { value: 'JDPI', label: '基地采购入库' },
        { value: 'ORO', label: '其他退货出库' }, { value: 'MA', label: '调拨入库（外销）' }, { value: 'DI', label: '分拨入库' }, { value: 'DO', label: '分拨出库' },
        { value: 'ADI', label: '数量调整入库单' }, { value: 'ZY', label: '中转运输' }, { value: 'TC', label: '调整红冲' }, { value: 'CO', label: '出库红冲' },
        { value: 'CI', label: '入库红冲' }, { value: 'TFI', label: '状态调整入库' }, { value: 'TFO', label: '状态调整出' }, { value: 'ZF', label: '下线直发' },
        { value: 'ADO', label: '数量调整出库单' }],
    // 仓库
    warehouseName: [
        { value: '华中通美电商小电仓', label: '华中通美电商小电仓' },
        { value: '华东通美电商小电仓', label: '华东通美电商小电仓' },
        { value: '华南来往电商小电仓', label: '华南来往电商小电仓' },
        { value: '西部来往电商小电仓', label: '西部来往电商小电仓' },
        { value: '华北安捷电商小电仓', label: '华北安捷电商小电仓' },
        { value: '华南来往电商小电普罗斯仓', label: '华南来往电商小电普罗斯仓' },
        { value: '华南来往电商小电顺丰仓', label: '华南来往电商小电顺丰仓' },
        { value: '华南安得佛山小电仓', label: '华南安得佛山小电仓' },
        { value: '西部安捷小电仓', label: '西部安捷小电仓' },
        { value: '华中安得武汉小电仓', label: '华中安得武汉小电仓' },
        { value: '华东安得昆山小电仓', label: '华东安得昆山小电仓' },
        { value: '华南惠阳安得仓', label: '华南惠阳安得仓' },
        { value: '武汉云仓', label: '武汉云仓' },
        { value: '华东安捷云仓', label: '华东安捷云仓' },
        { value: '北京转转仓', label: '北京转转仓' },
        { value: '东莞物流中心网易仓', label: '东莞物流中心网易仓' },
        { value: '顺德樱花1仓电商仓', label: '顺德樱花1仓电商仓' },
        { value: '西部来往电商小电仓', label: '西部来往电商小电仓' },
        { value: '西南安得成都小电仓', label: '西南安得成都小电仓' },
        { value: '华北中件高级仓', label: '华北中件高级仓' },
        { value: '华东中件高级仓', label: '华东中件高级仓' },
        { value: '华中中件高级仓', label: '华中中件高级仓' },
        { value: '华南中件高级仓', label: '华南中件高级仓' }
    ],
    // 订单状态
    orderStatus: [{ value: 'NEW', label: '新建' }, { value: 'CFM', label: '已审核' }, { value: 'CNL', label: '已取消' }, { value: 'REJECT', label: '已拒收' }, { value: 'SIGN', label: '已签收' }],
    // 揽收状态
    gotFlag: [{ value: '0', label: '未揽收' }, { value: '1', label: '已揽收' }],
    // 揽收状态
    importStauts: [{ value: '0', label: '正常' }, { value: '1', label: '删除' }, { value: '9', label: '导入异常' }],
    // 来源系统
    ediId: [
        { value: 'CAINIAO', label: '菜鸟' },
        { value: 'ECM', label: 'ECM' },
        { value: 'CIMS', label: 'CIMS' },
        { value: 'QiMen', label: '奇门' },
        { value: 'FuRun', label: '富润' },
        { value: 'GuanYi', label: '管易' },
        { value: 'CSS', label: '售后' },
        { value: 'HANDLE', label: '手工单' },
        { value: 'GUOAN', label: '国安' },
        { value: 'PDD', label: '拼多多' },
        { value: 'CCS', label: 'CCS' },
        { value: 'WMS', label: '仓储管理系统' },
        { value: 'TMS', label: '运配' },
        { value: 'LTMS', label: '大物流TMS' },
        { value: 'OTP', label: 'OTP' },
        { value: 'LMS', label: 'LMS' },
        { value: 'ELS', label: 'ELS' }
    ],
    excuteStatus: [
        { value: 'NEW', label: '新增' },
        { value: 'AUDITING', label: '审核中' },
        { value: 'AUDIT_PART_FAILE', label: '部分审核失败' },
        { value: 'FAILD', label: '异常' },
        { value: 'AUDITED', label: '已审核' },
        { value: 'CLOSED', label: '关闭' },
        { value: 'INTERCEPT', label: '拦截' },
        { value: 'CANCEL', label: '取消' },
        { value: 'WRITE_OFF', label: '冲销' }
    ],
    customerWhCode: {
        'name': '请输入仓库',
        'advanceLabel': '仓库',
        'value': 'whName',
        'advanceConfig': [
            { 'prop': 'cdwhName', 'value': '仓库名称' },
            { 'prop': 'whCode', 'value': '仓库编码' }
        ],
        'tableConfig': [
            { 'prop': 'whCode', 'value': '仓库编码' },
            { 'prop': 'cdwhName', 'value': '仓库名称' }
        ],
        'advanceUrl': 'cdWarehouse/search?cdwhIsStop=0',
        'advanceCascade': 'siteCode',
        'cbParams': [
            'whCode', 'cdwhName#whName'
        ]
    },
    serviceTypeCode: {
        'name': '请选择服务平台',
        'advanceLabel': '服务平台',
        'value': 'siteName',
        'advanceConfig': [
            { 'prop': 'escoCompanyNameCn', 'value': '服务平台名称' },
            { 'prop': 'escoCompanyNo', 'value': '服务平台编码' }
        ],
        'tableConfig': [
            { 'prop': 'escoCompanyNo', 'value': '服务平台编码' },
            { 'prop': 'escoCompanyNameCn', 'value': '服务平台名称' }
        ],
        'advanceUrl': '/searchPlatform',
        'cbParams': [
            'escoCompanyNo#siteCode', 'escoCompanyNameCn#siteName'
        ]
    },
    customerOrderNoCode: {
        'name': '请输入承运商',
        'advanceLabel': '承运商',
        'value': 'carrierName',
        'advanceConfig': [
            { 'prop': 'suppliersNameCn', 'value': '承运商名称' },
            { 'prop': 'suppliersCode', 'value': '承运商编码' },
            { 'prop': 'tranName', 'value': '采购渠道' }
        ],
        'tableConfig': [
            { 'prop': 'suppliersNameCn', 'value': '承运商名称' },
            { 'prop': 'suppliersCode', 'value': '承运商编码' },
            { 'prop': 'tranName', 'value': '采购渠道' }
        ],
        'advanceUrl': 'ebSupplier/searchBySupplier',
        'cbParams': [
            'suppliersNameCn#carrierName', 'suppliersCode#carrierCode', 'transType', 'tranName'
        ],
        'advanceCascade': 'suppliersCode#carrierCode'
    }
};

export default options;