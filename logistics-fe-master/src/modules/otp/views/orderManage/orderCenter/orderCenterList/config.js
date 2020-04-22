export default {
    'searchList': {
        'searchTxt': [
            {
                'name': '客户订单号',
                'value': 'customerOrderNo',
                'type': 'input',
                'unfold': true,
                'isFussy': true,
                'span': 6
            },
            {
                'name': '创建时间',
                'value': 'searchBeginTime',
                'type': 'time',
                'unfold': true,
                'span': 6
            },
            {
                'name': '订单状态',
                'value': 'orderStatus',
                'unfold': true,
                'type': 'select',
                'optionNum': 'ORDER_STATUS',
                'filterable': true,
                'multiple': true,
                'options': [],
                'span': 4
            }
        ],
        'unfoldState': false,
        'advancedBtn': true
    },
    'table': {
        'clickModify': true,
        'selectBtn': true,
        'leftOperation': true,
        'height': 400,
        'leftWidth': 250,
        'columns': [
            {
                'label': '订单号',
                'align': 'center',
                'value': 'orderNo',
                'prop': 'orderNo',
                'width': 200
            },
            {
                'label': '客户订单号',
                'align': 'center',
                'value': 'customerOrderNo',
                'prop': 'customerOrderNo',
                'width': 200
            },
            {
                'label': '业务模式',
                'prop': 'businessMode',
                'width': 120
            },
            {
                'label': '订单类型',
                'prop': 'orderTypeName',
                'width': 150
            },
            {
                'label': '订单状态',
                'prop': 'orderStatusName',
                'width': 150
            },
            {
                'label': '审核状态',
                'prop': 'excuteStatusName',
                'type': 'button',
                'width': 150
            },
            {
                'label': '客户',
                'align': 'center',
                'prop': 'customerName',
                'width': 200
            },
            {
                'label': '平台',
                'align': 'center',
                'prop': 'siteName',
                'width': 170
            },
            {
                'label': '仓库',
                'align': 'center',
                'prop': 'whName',
                'value': 'whCode',
                'width': 150
            },
            {
                'label': '是否自提',
                'align': 'center',
                'prop': 'deliveryTypeName',
                'width': 100
            },
            {
                'label': '来源系统',
                'align': 'center',
                'prop': 'sourceSystemName',
                'width': 150
            },
            {
                'label': '订单来源',
                'align': 'center',
                'prop': 'orderSourceName',
                'width': 150
            },
            {
                'label': '目标客户',
                'align': 'center',
                'prop': 'targetCustomerName',
                'width': 130
            },
            {
                'label': '项目分类',
                'align': 'center',
                'prop': 'projectClassifyName',
                'width': 130
            },
            {
                'label': '收货省份',
                'align': 'center',
                'prop': 'receiverProvinceName',
                'width': 200
            },
            {
                'label': '收货市',
                'align': 'center',
                'prop': 'receiverCityName',
                'width': 200
            },
            {
                'label': '收货县',
                'align': 'center',
                'prop': 'receiverDistrictName',
                'width': 200
            },
            {
                'label': '收货乡镇',
                'align': 'center',
                'prop': 'receiverTownName',
                'width': 200
            },
            {
                'label': '收货地址',
                'align': 'center',
                'prop': 'receiverDetailAddr',
                'width': 200
            },
            {
                'label': '收货人',
                'align': 'center',
                'prop': 'receiverName',
                'width': 150
            },
            {
                'label': '收货人电话',
                'align': 'center',
                'prop': 'receiverMobile',
                'width': 150
            },
            {
                'label': '总毛重',
                'align': 'center',
                'prop': 'totalGrossWeight',
                'width': 150
            },
            {
                'label': '总体积',
                'align': 'center',
                'prop': 'totalVolume',
                'width': 150
            },
            {
                'label': '总数量',
                'align': 'center',
                'prop': 'totalQty',
                'width': 150
            },
            {
                'label': '上游收货单位',
                'align': 'center',
                'prop': 'upperReceiverName',
                'width': 160
            },
            {
                'label': '上游发货单位',
                'align': 'center',
                'prop': 'upperSenderName',
                'width': 160
            },
            {
                'label': '上游源客户',
                'align': 'center',
                'prop': 'upperSourceCustomerName',
                'width': 160
            },
            {
                'label': '订单来源平台',
                'prop': 'orderSourcePlatformName',
                'width': 150
            },
            {
                'label': '店铺名称',
                'align': 'center',
                'prop': 'shopName',
                'width': 150
            },
            {
                'label': '支付时间',
                'align': 'center',
                'prop': 'payDate',
                'width': 150
            },
            {
                'label': '上游审核时间',
                'align': 'center',
                'prop': 'upperComfirmTime',
                'width': 150
            },
            {
                'label': '上游下单时间',
                'align': 'center',
                'prop': 'upperOrderTime',
                'width': 150
            },
            {
                'label': '期望提货时间',
                'align': 'center',
                'prop': 'expectPickTime',
                'width': 150
            },
            {
                'label': '承运商',
                'align': 'center',
                'prop': 'carrierTypeName',
                'width': 150
            },

            {
                'label': '业务类型',
                'prop': 'businessTypeName',
                'width': 100
            },

            {
                'label': '运作模式',
                'align': 'center',
                'prop': 'logisticModeName',
                'width': 150
            },

            {
                'label': '发货地址',
                'align': 'center',
                'prop': 'senderDetailAddr',
                'width': 200
            },
            {
                'label': '发货人',
                'align': 'center',
                'prop': 'senderName',
                'width': 150
            },
            {
                'label': '发货人电话',
                'align': 'center',
                'prop': 'senderMobile',
                'width': 150
            },
            {
                'label': '合同号',
                'align': 'center',
                'prop': 'contractNo',
                'width': 160
            },
            {
                'label': '发车单号',
                'align': 'center',
                'prop': 'dispatchNo',
                'width': 160
            },

            {
                'label': '上游仓库名称',
                'align': 'center',
                'prop': 'upperWhName',
                'width': 160
            },
            {
                'label': '上游客户名称',
                'align': 'center',
                'prop': 'upperCustomerName',
                'width': 160
            },
            {
                'label': '关联单号',
                'align': 'center',
                'prop': 'relationOrderNo',
                'width': 150
            },
            {
                'label': '平台单号',
                'align': 'center',
                'prop': 'platformOrderNo',
                'width': 150
            },
            {
                'label': '原单号',
                'align': 'center',
                'prop': 'originOrderNo',
                'width': 150
            },
            {
                'label': '期望到货时间(起)',
                'align': 'center',
                'prop': 'expectArriveStartTime',
                'width': 150
            },
            {
                'label': '期望到货时间(迄)',
                'align': 'center',
                'prop': 'expectArriveEndTime',
                'width': 150
            },
            {
                'label': 'CCS工单号',
                'align': 'center',
                'prop': 'serviceOrderNo',
                'width': 150
            },
            {
                'label': '买家备注',
                'align': 'center',
                'prop': 'buyerRemark',
                'width': 200
            },
            {
                'label': '货值',
                'align': 'center',
                'prop': 'orderValue',
                'width': 160
            },
            {
                'label': '上游订单类型',
                'align': 'center',
                'prop': 'upperOrderType',
                'width': 130
            },
            {
                'label': '是否第三方',
                'align': 'center',
                'prop': 'thirdFlagName',
                'width': 130
            },
            {
                'label': '上撤样',
                'align': 'center',
                'prop': 'specimenTypeName',
                'width': 130
            },
            {
                'label': '是否商超',
                'align': 'center',
                'prop': 'scPosFlagName',
                'width': 130
            },
            {
                'label': '服务类型',
                'align': 'center',
                'prop': 'serviceTypeName',
                'width': 130
            },
            {
                'label': '创建时间',
                'align': 'center',
                'prop': 'createTime',
                'width': 160
            },
            {
                'label': '创建人',
                'align': 'center',
                'prop': 'createUserCode',
                'width': 160
            },
            {
                'label': '修改时间',
                'align': 'center',
                'prop': 'updateTime',
                'width': 160
            },
            {
                'label': '修改人',
                'align': 'center',
                'prop': 'updateUserCode',
                'width': 160
            },
            {
                'label': '备注',
                'align': 'center',
                'prop': 'remark',
                'width': 160
            },
            {
                'label': '收货单位',
                'align': 'center',
                'prop': 'upperReceiverName',
                'width': 160
            }
        ],
        'action': [
            {
                'type': 'text',
                'label': '修改',
                'size': 'small',
                'event': 'edit',
                'ifHas': '02010001'
            },
            {
                'type': 'text',
                'label': '分仓',
                'size': 'small',
                'event': 'separate',
                'ifHas': '02010009'
            },
            {
                'type': 'text',
                'label': '复制',
                'size': 'small',
                'event': 'view',
                'ifHas': '02010002'
            },
            {
                'type': 'text',
                'label': '定位校对',
                'size': 'small',
                'event': 'dispatch',
                'ifHas': '02010010'
            },
            {
                'type': 'text',
                'label': '地址修改',
                'size': 'small',
                'event': 'fixAddress',
                'ifHas': '02010011'
            },
            {
                'type': 'text',
                'label': '调账MIP流程',
                'size': 'small',
                'event': 'adjustMip'
            }
        ],
        'ImportConfig': {
            'action': `${process.env.VUE_APP_API_URL || ''}/api-otp/order/excelImport`,
            'multiple': false,
            'accept': 'xlsx/text',
            'showFileList': true,
            'fileType': '只能上传Excel文件',
            'manualUpload': false
        },
        'ImportContent': [
            {
                'fileName': '城配订单-出库.xlsx',
                'fileSize': '28KB',
                'downLoadInfo': {
                    'url': 'https://lcapi.midea.com/api-file/ossDown/221E3F05DE3A467DA9B2F79682D750E9/lcloud/%E5%9F%8E%E9%85%8D%E8%AE%A2%E5%8D%95-%E5%87%BA%E5%BA%93_%E6%A8%A1%E6%9D%BF5_1585276180269.xlsx'
                }
            },
            {
                'fileName': '城配订单-入库.xlsx',
                'fileSize': '31KB',
                'downLoadInfo': {
                    'url': 'https://lcapi.midea.com/api-file/ossDown/221E3F05DE3A467DA9B2F79682D750E9/lcloud/%E5%9F%8E%E9%85%8D%E8%AE%A2%E5%8D%95-%E5%85%A5%E5%BA%93_1_1%E6%A8%A1%E6%9D%BF8_1584498819037.xlsx'
                }
            }
        ]
    },
    'page': {
        'layout': 'sizes, prev, pager, next',
        'pageSize': 10,
        'pageSizes': [
            10,
            20,
            50
        ]
    },
    'searchTotalTitle': [
        {
            'name': '订单号',
            'value': 'orderNo',
            'type': 'input'
        },
        {
            'name': '订单类型',
            'value': 'orderType',
            'type': 'select',
            'multiple': true,
            'filterable': true,
            'optionNum': 'ORDER_TYPE',
            'options': []
        },
        {
            'name': '项目分类',
            'value': 'projectClassify',
            'type': 'select',
            'optionNum': 'PROJECT_CLASSIFY',
            'options': []
        },
        {
            'name': '审核状态',
            'value': 'excuteStatus',
            'type': 'select',
            'filterable': true,
            'multiple': true,
            'optionNum': 'EXCUTE_STATUS',
            'options': []
        },
        {
            'name': '客户',
            'value': 'customerName',
            'type': 'advance',
            'unfold': true,
            'advanceConfig': [
                { 'prop': 'ebcuNameCn', 'value': '客户名称' },
                { 'prop': 'pmCode', 'value': '客户编码' }
            ],
            'tableConfig': [
                { 'prop': 'pmCode', 'value': '客户编码' },
                { 'prop': 'ebcuNameCn', 'value': '客户名称' }
            ],
            'advanceUrl': '/ebCustomer/searchByEbCustomer',
            'cbParams': ['pmCode#customerCode', 'ebcuNameCn#customerName'],
            'advanceCode': 'advanceCode',
            'span': 4
        },
        {
            'name': '平台',
            'value': 'siteName',
            'unfold': true,
            'advanceConfig': [
                { 'prop': 'escoCompanyNameCn', 'value': '服务平台名称' },
                { 'prop': 'escoCompanyNo', 'value': '服务平台编码' }
            ],
            'tableConfig': [
                { 'prop': 'escoCompanyNo', 'value': '服务平台编码' },
                { 'prop': 'escoCompanyNameCn', 'value': '服务平台名称' },
                { 'prop': 'branchCompanyNo', 'value': '分公司编码' },
                { 'prop': 'branchCompanyName', 'value': '分公司名称' }
            ],
            'advanceUrl': '/searchPlatform',
            'type': 'advance',
            'cbParams': ['escoCompanyNo#siteCode', 'escoCompanyNameCn#siteName'],
            'span': 4
        },
        {
            'name': '仓库',
            'value': 'whName',
            'unfold': true,
            'advanceConfig': [
                { 'prop': 'cdwhName', 'value': '仓库名称' },
                { 'prop': 'whCode', 'value': '仓库编码' }
            ],
            'tableConfig': [
                { 'prop': 'whCode', 'value': '仓库编码' },
                { 'prop': 'cdwhName', 'value': '仓库名称' }
            ],
            'advanceUrl': 'cdWarehouse/search?cdwhIsStop=0',
            'cbParams': [
                'whCode', 'cdwhName#whName'
            ],
            'type': 'advance',
            'span': 4
        },
        {
            'name': '来源系统',
            'value': 'sourceSystem',
            'type': 'select',
            'filterable': true,
            'optionNum': 'SOURCE_SYSTEM',
            'options': []
        },
        {
            'name': '订单来源平台',
            'value': 'orderSourcePlatform',
            'type': 'select',
            'filterable': true,
            'optionNum': 'SOURCE_PLATFORM',
            'options': []
        },
        {
            'name': '店铺名称',
            'value': 'shopName',
            'type': 'input'
        },
        {
            'name': '支付时间',
            'value': 'payDate',
            'type': 'time',
            'timeNum': 0
        },
        {
            'name': '上游审核时间',
            'value': 'upperComfirmTime',
            'type': 'time',
            'timeNum': 0
        },
        {
            'name': '上游下单时间',
            'value': 'upperOrderTime',
            'type': 'time',
            'timeNum': 0
        },
        {
            'name': '期望提货时间',
            'value': 'expectPickTime',
            'type': 'time',
            'timeNum': 0
        },
        {
            'name': '承运商',
            'value': 'carrierCode',
            'type': 'select',
            'filterable': true,
            'optionNum': 'carrierType',
            'options': []
        },
        {
            'name': '业务模式',
            'value': 'businessMode',
            'type': 'select',
            'filterable': true,
            'optionNum': 'BUSINESS_MODE',
            'options': []
        },
        {
            'name': '业务类型',
            'value': 'businessType',
            'type': 'select',
            'filterable': true,
            'optionNum': 'BUSINESS_TYPE',
            'options': []
        },
        {
            'name': '运作模式',
            'value': 'logisticMode',
            'type': 'select',
            'filterable': true,
            'optionNum': 'LOGISTIC_MODE',
            'options': []
        },
        {
            'name': '一级分拨仓',
            'value': 'distributionWhName',
            'unfold': true,
            'advanceConfig': [
                { 'prop': 'cdwhName', 'value': '仓库名称' },
                { 'prop': 'whCode', 'value': '仓库编码' }
            ],
            'tableConfig': [
                { 'prop': 'whCode', 'value': '仓库编码' },
                { 'prop': 'cdwhName', 'value': '仓库名称' }
            ],
            'advanceUrl': 'cdWarehouse/search?cdwhIsStop=0',
            'cbParams': [
                'whCode#distributionWhCode', 'cdwhName#distributionWhName'
            ],
            'type': 'advance',
            'span': 4
        },
        {
            'name': '二级分拨仓',
            'value': 'nextDistributionWhName',
            'unfold': true,
            'advanceConfig': [
                { 'prop': 'cdwhName', 'value': '仓库名称' },
                { 'prop': 'whCode', 'value': '仓库编码' }
            ],
            'tableConfig': [
                { 'prop': 'whCode', 'value': '仓库编码' },
                { 'prop': 'cdwhName', 'value': '仓库名称' }
            ],
            'advanceUrl': 'cdWarehouse/search?cdwhIsStop=0',
            'cbParams': [
                'whCode#nextDistributionWhCode', 'cdwhName#nextDistributionWhName'
            ],
            'type': 'advance',
            'span': 4
        },
        {
            'name': '合同号',
            'value': 'contractNo',
            'type': 'input'
        },
        {
            'name': '源发车单号',
            'value': 'dispatchNo',
            'type': 'input'
        },
        {
            'name': '上游仓库名称',
            'value': 'upperWhName',
            'type': 'input'
        },
        {
            'name': '上游客户名称',
            'value': 'upperCustomerName',
            'type': 'input'
        },
        {
            'name': '子订单号',
            'value': 'subOrderNo',
            'type': 'input'
        },
        {
            'name': '原始订单号',
            'value': 'originOrderNo',
            'type': 'input'
        },
        {
            'name': '平台单号',
            'value': 'platformOrderNo',
            'type': 'input'
        },
        {
            'name': '关联单号',
            'value': 'relationOrderNo',
            'type': 'input'
        },
        {
            'name': '运单号',
            'value': 'waybillNo',
            'type': 'input'
        },

        {
            'name': '订单分类',
            'value': 'inOutType',
            'type': 'select',
            'filterable': true,
            'optionNum': 'IN_OUT_TYPE',
            'options': []
        },
        {
            'name': '配送方式',
            'value': 'deliveryType',
            'type': 'select',
            'filterable': true,
            'optionNum': 'DELIVERY_TYPE',
            'options': []
        },
        {
            'name': '收货人地址',
            'value': 'receiverCode',
            'filterable': true,
            'config': {
                'checkStrictly': true
            },
            'type': 'addressSelect'
        },
        {
            'name': '收货人手机',
            'value': 'receiverMobile',
            'type': 'input'
        },
        {
            'name': '收货人详细地址',
            'value': 'receiverDetailAddr',
            'type': 'input'
        },
        {
            'name': '发货人地址',
            'value': 'senderCode',
            'filterable': true,
            'unfold': true,
            'config': {
                'checkStrictly': true
            },
            'type': 'addressSelect'
        },
        {
            'name': '发货人手机',
            'value': 'senderMobile',
            'type': 'input'
        },
        {
            'name': '发货人详细地址',
            'value': 'senderDetailAddr',
            'type': 'input'
        },
        {
            'name': 'CSS工单号',
            'value': 'serviceOrderNo',
            'type': 'input'
        },
        {
            'name': '网点名称',
            'value': 'networkName',
            'type': 'input'
        },
        {
            'name': '网点编码',
            'value': 'networkCode',
            'type': 'input'
        },
        {
            'name': '上游源客户编码',
            'value': 'upperSourceCustomerCode',
            'type': 'input'
        },
        {
            'name': '要求发货时间',
            'value': 'requireOutTime',
            'type': 'time',
            'timeNum': 0
        },
        {
            'name': '是否自提',
            'value': 'selfMention',
            'type': 'select',
            'filterable': true,
            'optionNum': '',
            'options': [
                { 'label': '是', 'value': '1' },
                { 'label': '否', 'value': '0' }
            ]
        },
        {
            'name': '上游发货单位编码',
            'value': 'upperSenderCode',
            'type': 'input'
        },
        {
            'name': '上游发货单位名称',
            'value': 'upperSenderName',
            'type': 'input'
        },
        {
            'name': '上游收货单位编码',
            'value': 'upperReceiverCode',
            'type': 'input'
        },
        {
            'name': '上游收货单位名称',
            'value': 'upperReceiverName',
            'type': 'input'
        }
    ],
    'dateDialog': {
        'type': 'date',
        'title': '预约',
        'width': '1000px',
        'hideFooter': true,
        'hideTable': true,
        'dayHeight': '20px',
        'calendarWidth': '30%',
        'formBoxWidth': '70%',
        'btnList': [{
            'type': 'negative',
            'text': '重置'
        }, {
            'type': 'sure',
            'text': '保存'
        }],
        'dialogForm': {
            'inline': false,
            'labelWidth': 7,
            'inputWidth': 15,
            'inputList': [{
                'label': '预约时间',
                'value': 'appointTime',
                'prop': 'appointTime',
                'placeholder': '预约时间',
                'disabled': true,
                'span': 12,
                'type': 'text'
            }, {
                'label': '改约一级原因',
                'prop': 'appointReason',
                'value': 'appointReason',
                'placeholder': '请选择',
                'span': 12,
                'type': 'select'
            }, {
                'label': '预约类型',
                'prop': 'appointType',
                'value': 'appointType',
                'placeholder': '请选择',
                'span': 12,
                'type': 'dictionary',
                'optionNum': 'APPOINTMENT_TYPE'
            }, {
                'label': '改约二级原因',
                'prop': 'secendAppointReason',
                'value': 'secendAppointReason',
                'placeholder': '请选择',
                'span': 12,
                'type': 'select'
            }, {
                'label': '预约异常类型',
                'prop': 'exceptionType',
                'value': 'exceptionType',
                'placeholder': '请选择',
                'span': 12,
                'type': 'dictionary',
                'optionNum': 'CAINIAO_WMS_ERROR'
            }, {
                'label': '备       注',
                'prop': 'remarks',
                'value': 'remarks',
                'placeholder': '备注',
                'span': 12,
                'type': 'text'
            }]
        }
    },
    'viewBillBasicData': {
        'customerOrderNoCode': {
            'name': '请输入客户名称',
            'advanceLabel': '客户',
            'value': 'customerName',
            'advanceConfig': [
                { 'prop': 'ebcuNameCn', 'value': '客户名称' },
                { 'prop': 'pmCode', 'value': '客户编码' }
            ],
            'tableConfig': [
                { 'prop': 'pmCode', 'value': '客户编码' },
                { 'prop': 'ebcuNameCn', 'value': '客户名称' }
            ],
            'advanceUrl': '/ebCustomer/searchByEbCustomer',
            'cbParams': [
                'pmCode#customerCode', 'ebcuNameCn#customerName'
            ]
        },
        'serviceTypeCode': {
            'name': '请输入服务平台',
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
        'customerWhCode': {
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
        }
    },
    'logColumns': [
        {
            'prop': 'orderNo',
            'label': '订单号',
            'type': 'normal'
        },
        {
            'prop': 'taskNo',
            'label': '任务号',
            'type': 'normal'
        },
        {
            'prop': 'operateName',
            'label': '操作类型',
            'type': 'normal'
        },
        {
            'prop': 'operateContent',
            'label': '操作内容',
            'type': 'normal'
        },
        {
            'prop': 'createUserCode',
            'label': '创建人',
            'type': 'normal'
        },
        {
            'prop': 'createTime',
            'label': '创建时间',
            'type': 'normal'
        }
    ]
};
