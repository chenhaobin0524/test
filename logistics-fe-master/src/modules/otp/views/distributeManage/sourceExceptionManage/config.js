export default {
    searchList: {
        searchTxt: [{
            name: '异常单号',
            value: 'abnormalSingleNumber',
            type: 'input',
            unfold: true,
            span: 3
        },
        {
            name: '创建时间',
            value: 'createTime',
            startTime: 'startReportingTime',
            endTime: 'endReportingTime',
            startPlaceholder: '创建开始日期',
            endPlaceholder: '创建结束日期',
            type: 'time',
            timeNum: 3,
            unfold: true,
            span: 6
        },
        {
            name: '客户订单号',
            value: 'customerOrderNumber',
            type: 'input',
            unfold: true,
            span: 3
        }],
        unfoldState: false,
        advancedBtn: true
    },
    searchTotalTitle: [
        {
            name: '运输单号',
            value: 'taskNo',
            type: 'input'
        },
        {
            name: '发车单号',
            value: 'dispatchNo',
            type: 'input'
        },
        {
            name: '异常来源',
            value: 'indicationOfSource',
            type: 'select',
            optionNum: 'indication_of_source',
            options: []
        },
        {
            name: '一级异常类型',
            value: 'tmsExceptionType1',
            type: 'select',
            optionNum: 'tms_exception_type1',
            options: []
        },
        {
            name: '索赔类型',
            value: 'claimType',
            type: 'select',
            optionNum: 'claim_type',
            options: []
        },
        {
            name: '费用类型',
            value: 'costType',
            type: 'select',
            optionNum: 'cost_type',
            options: []
        },
        {
            name: '处理状态',
            value: 'processingStatus',
            type: 'select',
            optionNum: 'processing_status',
            options: []
        }
    ],
    table:
    {
        clickState: false,
        selectBtn: true,
        height: 400,
        statesY: '是',
        statesN: '否',
        switchType: true,
        fixedSeletionColumn: true,
        columns: [
            {
                label: '异常单号',
                prop: 'abnormalSingleNumber',
                width: '148px'
            },
            {
                label: '订单号',
                prop: 'customerOrderNumber',
                width: '148px'
            },
            {
                label: '运输单号',
                prop: 'taskNo',
                width: '170px'
            },
            {
                label: '发车单号',
                prop: 'dispatchNo',
                width: '148px'
            },
            {
                label: '服务平台',
                prop: 'servicePlatform',
                width: '148px'
            },
            {
                label: '申请人',
                prop: 'informant',
                width: '148px'
            },
            {
                label: '申请时间',
                prop: 'reportingTime',
                width: '148px'
            },
            {
                label: '一级异常类型',
                prop: 'tmsExceptionTypeName1',
                optionNum: 'tms_exception_type1',
                width: '148px'
            },
            {
                label: '二级异常类型',
                prop: 'tmsExceptionTypeName2',
                optionNum: 'tms_exception_type2',
                width: '148px'
            },
            {
                label: '异常描述',
                prop: 'abnormal',
                width: '148px'
            },
            {
                label: '异常原因',
                prop: 'reason',
                width: '148px'
            },
            {
                label: '处理人',
                prop: 'handler',
                width: '148px'
            },
            {
                label: '处理结果',
                prop: 'processResult',
                width: '148px'
            },
            {
                label: '处理时间',
                prop: 'handleTime',
                width: '148px'
            },
            {
                label: '处理状态',
                prop: 'processingStatusName',
                width: '148px'
            },
            {
                label: '异常来源',
                prop: 'indicationOfSourceName',
                optionNum: 'indication_of_source',
                width: '148px'
            },
            {
                label: '承运商',
                prop: 'carrierName',
                width: '148px'
            },
            {
                label: '责任承运商',
                prop: 'carrier',
                width: '148px'
            },
            {
                label: '司机',
                prop: 'primaryDriver',
                width: '90px'
            },
            {
                label: '索赔类型',
                prop: 'claimTypeName',
                optionNum: 'claim_type',
                width: '148px'
            },
            {
                label: '索赔原因',
                prop: 'reasonForClaim',
                width: '148px'
            },
            {
                label: '索赔金额',
                prop: 'claimAmount',
                width: '90px'
            },
            {
                label: '备注',
                prop: 'remarks',
                width: '148px'
            },
            {
                label: '附件',
                type: 'photos',
                prop: 'url',
                width: '148px'
            },
            {
                label: '费用类型',
                prop: 'costTypeName',
                optionNum: 'cost_type',
                width: '148px'
            },
            {
                label: '结算费用',
                prop: 'settlementCost',
                width: '148px'
            },
            {
                label: '改善措施',
                prop: 'measure',
                width: '148px'
            },
            {
                label: '异常处理时效',
                prop: 'dealTime',
                width: '148px'
            }],
        action: [],
        leftOperation: false
    },
    page: {
        layout: 'total, sizes, prev, pager, next, jumper',
        pageSize: 10,
        pageSizes: [10, 20, 30, 50, 100]
    }
};
