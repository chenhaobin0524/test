export default {
    configuration: true,
    searchList: {
        searchTxt: [{
            name: '客户地址',
            value: 'customerAddr',
            type: 'addressSelect',
            filterable: true,
            config: {
                checkStrictly: true
            },
            unfold: true,
            span: 5
        },
        {
            name: '网点名称',
            value: 'netName',
            type: 'advance',
            unfold: true,
            advanceConfig: [
                { 'prop': 'netName', 'value': '网点名称' },
                { 'prop': 'netCode', 'value': '网点编码' }
            ],
            tableConfig: [
                { 'prop': 'netName', 'value': '网点名称' },
                { 'prop': 'netCode', 'value': '网点编码' }
            ],
            advanceUrl: '/netInfos',
            cbParams: ['netCode#netCode', 'netName#netName'],
            advanceCode: 'advanceCode',
            span: 5
        },
        {
            name: '启用状态',
            value: 'usingStatus',
            unfold: true,
            span: 3,
            options: [{
                value: 'Y',
                label: '启用'
            },
            {
                value: 'N',
                label: '停用'
            }
            ],
            type: 'select'
        }],
        unfoldState: false,
        advancedBtn: false
    },
    table:
    {
        clickModify: true,
        clickState: true,
        tableCut: true,
        selectBtn: true,
        height: 400,
        statesY: '是',
        statesN: '否',
        switchType: true,
        leftOperation: true,
        leftWidth: 60,
        columns: [
            {
                label: '客户地址',
                prop: 'customerAddrCodeArr',
                labelCn: 'customerAddrName',
                width: 280,
                type: 'addressSelect',
                minLayers: 4,
                mustFill: true,
                require: true
            },
            {
                label: '网点编码',
                prop: 'netCode',
                mustFill: true,
                require: true,
                width: 180,
                tableConfig: [
                    { prop: 'netName', value: '网点名称' },
                    { prop: 'netCode', value: '网点编码' }
                ],
                advanceUrl: '/netInfos',
                type: 'advance',
                cbParams: ['netCode', 'netName']
            },
            {
                label: '网点名称',
                prop: 'netName',
                width: '148px'
            },
            {
                label: '网点联系人',
                prop: 'netContact',
                width: '148px'
            },
            {
                label: '网点联系方式',
                prop: 'netMobile',
                width: '148px'
            },
            {
                label: '网点地址',
                prop: 'netAddr',
                width: '110px'
            },
            {
                label: '网点状态',
                prop: 'netStatus',
                width: '90px'
            },
            {
                label: '是否启用',
                prop: 'usingStatus',
                activeValue: 'Y',
                inactiveValue: 'N',
                defaultValue: 'Y',
                require: true,
                type: 'switch',
                width: '90px'
            },
            {
                label: '修改人',
                prop: 'updateUserCode',
                width: '90px'
            },
            {
                label: '修改时间',
                prop: 'updateTime',
                width: '148px'
            }],
        action: [
            {
                type: 'text',
                label: '编辑',
                size: 'mini',
                event: 'edit'
            }
            // {
            //     type: 'text',
            //     label: '保存',
            //     size: 'mini',
            //     event: 'save'
            // }
        ],
        'ImportConfig': {
            'action': `${process.env.VUE_APP_API_URL || ''}/api-otp/netRange/import`,
            'multiple': true,
            'accept': 'xlsx/text',
            'showFileList': true,
            'fileType': '只能上传Excel文件',
            'manualUpload': true
        },
        'ImportContent': [
            {
                'fileName': '网点覆盖范围_导入模板.xlsx',
                'fileSize': '28KB',
                'downLoadInfo': {
                    'url': 'https://lcapi.midea.com/api-file/ossDown/221E3F05DE3A467DA9B2F79682D750E9/lcloud/%E7%BD%91%E7%82%B9%E8%A6%86%E7%9B%96%E8%8C%83%E5%9B%B4_%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF_1576142990985.xlsx'
                }
            }
        ]
    },
    page: {
        layout: 'total, sizes, prev, pager, next, jumper',
        pageSize: 10,
        pageSizes: [10, 20, 30, 50, 100]
    },
    action: []
};
