const config = {
    searchList: {
        searchTxt: [
            {
                name: '始发仓库',
                value: 'whName',
                unfold: true,
                span: 4,
                advanceConfig: [
                    { prop: 'cdwhName', value: '仓库名称' },
                    { prop: 'whCode', value: '仓库代码' }
                ],
                tableConfig: [
                    { prop: 'cdwhName', value: '仓库名称' },
                    { prop: 'whCode', value: '仓库代码' }
                ],
                // 请求地址
                advanceUrl: 'cdWarehouse/search?cdwhIsStop=0',
                type: 'advance',
                // 需要选中返回的属性，回调通过对象返回下面指定的属性
                cbParams: ['whCode', 'cdwhName#whName']
            }, {
                name: '业务模式',
                value: 'businessMode',
                type: 'select',
                unfold: true,
                options: [],
                optionNum: 'BUSINESS_MODE',
                span: 4
            }, {
                name: '来源系统',
                value: 'sourceSystem',
                type: 'select',
                unfold: true,
                options: [],
                optionNum: 'SOURCE_SYSTEM',
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
        height: 400,
        columns: [
            {
                label: '始发仓库',
                prop: 'whName',
                width: 200,
                require: true,
                mustFill: true,
                advanceConfig: [
                    { prop: 'cdwhName', value: '仓库名称' },
                    { prop: 'whCode', value: '仓库代码' }
                ],
                tableConfig: [
                    { prop: 'cdwhName', value: '仓库名称' },
                    { prop: 'whCode', value: '仓库代码' }
                ],
                // 请求地址
                advanceUrl: 'cdWarehouse/search?cdwhIsStop=0',
                type: 'advance',
                // 需要选中返回的属性，回调通过对象返回下面指定的属性
                cbParams: ['whCode', 'cdwhName#whName']
            },
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
                label: '项目类型',
                prop: 'projectClassify',
                require: true,
                mustFill: true,
                width: 120,
                type: 'select',
                optionNum: 'PROJECT_CLASSIFY',
                options: []
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
                width: 160,
                type: 'dateTime'
            },
            {
                label: '创建人',
                align: 'center',
                prop: 'createUserCode',
                width: 120
            },
            {
                label: '创建时间',
                align: 'center',
                prop: 'createTime',
                width: 160,
                type: 'dateTime'
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
