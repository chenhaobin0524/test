export default {
    searchList: {
        searchTxt: [{
            name: '来源发车单号',
            value: 'fromDispatchNo',
            type: 'input',
            unfold: true,
            span: 3
        },
        {
            name: '订单号',
            value: 'orderNo',
            type: 'input',
            unfold: true,
            span: 3
        },
        {
            name: '订单状态',
            value: 'orderStatus',
            type: 'select',
            unfold: true,
            optionNum: 'NET_ORDER_STATUS',
            span: 3
        },
        {
            name: '创建时间',
            value: 'createTime',
            type: 'time',
            unfold: true,
            timeNum: 30,
            span: 7
        }
        ],
        unfoldState: false,
        advancedBtn: true
    },
    table: {
        selectBtn: true,
        fixedSeletionColumn: true,
        height: 400,
        leftWidth: 160,
        columns: [{
            label: '订单号',
            prop: 'orderNo',
            sort: true,
            width: '180px'
        },
        {
            label: '客户订单号',
            prop: 'customerOrderNo',
            sort: true,
            width: '120px'
        },
        {
            label: '订单类型',
            prop: 'orderTypeName',
            sort: true,
            width: '120px'
        },
        {
            label: '订单状态',
            prop: 'orderStatusName',
            sort: true,
            width: '120px'
        },
        {
            label: '网点编码',
            prop: 'networkCode',
            sort: true,
            width: '110px'
        },
        {
            label: '网点名称',
            prop: 'networkName',
            sort: true,
            width: '148px'
        },
        {
            label: '来源平台',
            prop: 'tonetSiteName',
            sort: true,
            width: '110px'
        },
        {
            label: '来源发车单号',
            prop: 'fromDispatchNo',
            sort: true,
            width: '148px'
        },
        {
            label: '来源系统',
            prop: 'sourceSystem',
            sort: true,
            width: '148px'
        },
        {
            label: '总数量',
            prop: 'totalQty',
            sort: true,
            width: '90px'
        },
        {
            label: '总体积',
            prop: 'taskTotalVolume',
            sort: true,
            width: '90px'
        },
        {
            label: '总毛重',
            prop: 'totalGrossWeight',
            sort: true,
            width: '90px'
        },
        {
            label: '网点实收总体积',
            prop: 'netTotalReceivedVolume',
            sort: true,
            width: '90px'
        },
        {
            label: '收货人',
            prop: 'receiverName',
            sort: true,
            width: '90px'
        },
        {
            label: '收货联系方式',
            prop: 'receiverTel',
            sort: true,
            width: '148px'
        },
        {
            label: '收货详细地址',
            prop: 'receiverDetailAddr',
            sort: true,
            width: '148px'
        },
        {
            label: '收货市',
            prop: 'receiverCityName',
            sort: true,
            width: '148px'
        },
        {
            label: '收货区县',
            prop: 'receiverDistrictName',
            sort: true,
            width: '148px'
        },
        {
            label: '附件',
            prop: 'images',
            type: 'photos',
            width: '70px'
        },
        {
            label: '增值服务类型',
            prop: 'addedServiceTypeName',
            sort: true,
            width: '148px'
        },
        {
            label: '创建人',
            prop: 'createUserCode',
            sort: true,
            width: '148px'
        },
        {
            label: '创建时间',
            prop: 'createTime',
            sort: true,
            width: '148px'
        },
        {
            label: '修改人',
            prop: 'updateUserCode',
            sort: true,
            width: '148px'
        },
        {
            label: '修改时间',
            prop: 'updateTime',
            sort: true,
            width: '148px'
        },
        {
            label: '商超标识',
            prop: 'scPosFlagName',
            sort: true,
            width: '148px'
        },
        {
            label: '客户名称',
            prop: 'customerName',
            sort: true,
            width: '148px'
        },
        {
            label: '业务模式',
            prop: 'businessMode',
            sort: true,
            width: '148px'
        },
        {
            label: '配送方式',
            prop: 'deliveryTypeName',
            sort: true,
            width: '148px'
        },
        {
            label: '网点分中心',
            prop: 'networkCenterName',
            sort: true,
            width: '148px'
        },
        {
            label: '网点联系人',
            prop: 'networkContact',
            sort: true,
            width: '148px'
        },
        {
            label: '网点联系方式',
            prop: 'networkPhone',
            sort: true,
            width: '148px'
        },
        {
            label: '网点详细地址',
            prop: 'networkAddr',
            sort: true,
            width: '148px'
        },
        {
            label: '网点市',
            prop: 'networkCityName',
            sort: true,
            width: '148px'
        },
        {
            label: '网点区县',
            prop: 'networkDistrictName',
            sort: true,
            width: '148px'
        },
        {
            label: '提货联系人',
            prop: 'senderName',
            sort: true,
            width: '148px'
        },
        {
            label: '提货联系方式',
            prop: 'senderTel',
            sort: true,
            width: '148px'
        },
        {
            label: '提货详细地址',
            prop: 'senderDetailAddr',
            sort: true,
            width: '148px'
        },
        {
            label: '提货市',
            prop: 'senderCityName',
            sort: true,
            width: '148px'
        },
        {
            label: '提货区县',
            prop: 'senderDistrictName',
            sort: true,
            width: '148px'
        },
        {
            label: '网点预约开始时间',
            prop: 'networkAppointmentStart',
            sort: true,
            width: '160px'
        },
        {
            label: '网点预约结束时间',
            prop: 'networkAppointmentEnd',
            sort: true,
            width: '160px'
        },
        {
            label: '网点预约备注',
            prop: 'networkAppointmentRemark',
            sort: true,
            width: '160px'
        },
        {
            label: '网点签收时间',
            prop: 'networkSignTime',
            sort: true,
            width: '160px'
        },
        {
            label: '网点上传状态',
            prop: 'networkReceiptStatusName',
            sort: true,
            width: '160px'
        },
        {
            label: '网点上传时间',
            prop: 'networkReceiptTime',
            sort: true,
            width: '160px'
        },
        {
            label: '终端签收时间',
            prop: 'finalSignTime',
            sort: true,
            width: '160px'
        },
        {
            label: '支线应到达时间',
            prop: 'networkArrivePlanTime',
            sort: true,
            width: '160px'
        },
        {
            label: '时效要求送达时间',
            prop: 'finalSignPlanTime',
            sort: true,
            width: '160px'
        },
        {
            label: '上门取件应完成时间',
            prop: 'requiredPickTime',
            sort: true,
            width: '160px'
        },
        {
            label: '终端签收上传状态',
            prop: 'finalReceiptStatusName',
            sort: true,
            width: '160px'
        },
        {
            label: '终端签收上传时间',
            prop: 'finalReceiptTime',
            sort: true,
            width: '160px'
        },
        {
            label: '终端签收是否完好',
            prop: 'finalSignFullName',
            sort: true,
            width: '160px'
        },
        {
            label: '最终要求送达时间',
            prop: 'expectArriveStartTime',
            sort: true,
            width: '160px'
        }
        ],
        action: [{
            type: 'text',
            label: '网点签收',
            size: 'mini',
            event: 'branchSign',
            isHas: '10030006'
        },
        {
            type: 'text',
            label: '终端签收',
            size: 'mini',
            event: 'terminalSign',
            isHas: '10030007'
        },
        {
            type: 'text',
            label: '网点入库',
            size: 'mini',
            event: 'netInbound',
            isHas: '10030008'
        },
        {
            type: 'text',
            label: '网点出库',
            size: 'mini',
            event: 'netOutbound',
            isHas: '10030009'
        },
        {
            type: 'text',
            label: '打印',
            size: 'mini',
            event: 'print',
            isHas: '10030009'
        }
        ],
        leftOperation: true
    },
    page: {
        layout: 'total, sizes, prev, pager, next, jumper',
        pageSize: 10,
        pageSizes: [10, 20, 30, 50, 100]
    },
    searchTotalTitle: [{
        name: '来源平台',
        value: 'tonetSiteName',
        advanceConfig: [{
            prop: 'escoCompanyNameCn',
            value: '来源平台名称'
        },
        {
            prop: 'escoCompanyNo',
            value: '来源平台编码'
        }
        ],
        tableConfig: [{
            prop: 'escoCompanyNo',
            value: '来源平台编码'
        },
        {
            prop: 'escoCompanyNameCn',
            value: '来源平台名称'
        }
        ],
        advanceUrl: '/searchPlatform',
        cbParams: ['escoCompanyNo#siteCode', 'escoCompanyNameCn#tonetSiteName'],
        type: 'advance'
    },
    {
        name: '网点上传状态',
        value: 'networkReceiptStatus',
        options: [{
            value: 'Y',
            label: '是'
        },
        {
            value: 'N',
            label: '否'
        }
        ],
        type: 'select'
    },
    {
        name: '终端上传状态',
        value: 'finalReceiptStatus',
        options: [{
            value: 'Y',
            label: '是'
        },
        {
            value: 'N',
            label: '否'
        }
        ],
        type: 'select'
    },
    {
        name: '增值服务类型',
        value: 'addedServiceType',
        optionNum: 'ADDED_SERVICE',
        type: 'select'
    },
    {
        name: '预约开始时间',
        value: 'appointmentStartTime',
        type: 'time'
    },
    {
        name: '预约结束时间',
        value: 'appointmentEndTime',
        type: 'time'
    },
    {
        name: '收货联系人',
        value: 'receiverName',
        type: 'input'
    },
    {
        name: '收货联系方式',
        value: 'receiverTel',
        type: 'input'
    },
    {
        name: '收货市',
        value: 'receiverCityName',
        advanceConfig: [{
            prop: 'ebplNameCn',
            value: '收货市名称'
        },
        {
            prop: 'ebplCode',
            value: '收货市编码'
        }
        ],
        tableConfig: [{
            prop: 'ebplNameCn',
            value: '收货市编码'
        },
        {
            prop: 'ebplCode',
            value: '收货市名称'
        }
        ],
        advanceUrl: '/searchEbPlacePage?ebplType=PLACE_CITY',
        cbParams: ['ebplCode#receiverCityCode', 'ebplNameCn#receiverCityName'],
        type: 'advance'
    },
    {
        name: '收货区县',
        value: 'receiverDistrictName',
        advanceConfig: [{
            prop: 'ebplNameCn',
            value: '收货区县名称'
        },
        {
            prop: 'ebplCode',
            value: '收货区县编码'
        }
        ],
        tableConfig: [{
            prop: 'ebplNameCn',
            value: '收货区县编码'
        },
        {
            prop: 'ebplCode',
            value: '收货区县名称'
        }
        ],
        advanceUrl: '/searchEbPlacePage?ebplType=PLACE_DISTRICT',
        cbParams: ['ebplCode#receiverDistrictCode', 'ebplNameCn#receiverDistrictName'],
        type: 'advance'
    },
    {
        name: '收货乡镇',
        value: 'receiverTownName',
        advanceConfig: [{
            prop: 'ebplNameCn',
            value: '收货乡镇名称'
        },
        {
            prop: 'ebplCode',
            value: '收货乡镇编码'
        }
        ],
        tableConfig: [{
            prop: 'ebplNameCn',
            value: '收货乡镇编码'
        },
        {
            prop: 'ebplCode',
            value: '收货乡镇名称'
        }
        ],
        advanceUrl: '/searchEbPlacePage?ebplType=PLACE_STREET',
        cbParams: ['ebplCode#receiverTownCode', 'ebplNameCn#receiverTownName'],
        type: 'advance'
    },
    {
        name: '网点分中心',
        value: 'networkCenterName',
        type: 'input'
    },
    {
        name: '网点名称',
        value: 'networkName',
        advanceConfig: [{
            prop: 'netName',
            value: '网点名称'
        },
        {
            prop: 'netCode',
            value: '网点编码'
        }
        ],
        tableConfig: [{
            prop: 'netCode',
            value: '网点编码'
        },
        {
            prop: 'netName',
            value: '网点名称'
        }
        ],
        advanceUrl: '/netInfos',
        cbParams: ['netCode#networkCode', 'netName#networkName'],
        type: 'advance'
    },
    {
        name: '网点预约备注',
        value: 'networkAppointmentRemark',
        type: 'input'
    },
    {
        name: '订单类型',
        value: 'orderType',
        type: 'select',
        options: [{
            value: 'PO',
            label: '销售出库'
        },
        {
            value: 'RI',
            label: '退货入库单'
        }
        ]
    },
    {
        name: '上门取件时间',
        value: 'requiredPickTime',
        type: 'time'
    }
    ]
};
