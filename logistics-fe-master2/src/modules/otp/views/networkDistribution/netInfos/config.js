export default {
    configuration: true,
    searchList: {
        searchTxt: [{
            name: '网点名称',
            value: 'netName',
            type: 'input',
            unfold: true,
            span: 5
        },
        {
            name: '网点状态',
            value: 'netStatus',
            type: 'select',
            unfold: true,
            span: 5,
            options: [
                { value: 'Y', label: '有效' },
                { value: 'N', label: '无效' },
                { value: 'D', label: '呆滞' }
            ]
        },
        {
            name: '网点编码',
            value: 'netCode',
            type: 'input',
            unfold: true,
            span: 5
        }],
        unfoldState: false,
        advancedBtn: false
    },
    table:
    {
        clickState: false,
        selectBtn: false,
        height: 400,
        columns: [
            {
                label: '网点编码',
                prop: 'netCode',
                width: '120px'
            },
            {
                label: '网点名称',
                prop: 'netName',
                width: '148px'
            },
            {
                label: '网点联系人',
                prop: 'netContact',
                width: '100px'
            },
            {
                label: '网点联系方式',
                prop: 'netMobile',
                width: '120px'
            },
            {
                label: '网点地址',
                prop: 'netAddr',
                width: '148px'
            },
            {
                label: '网点省',
                prop: 'netProvinceName',
                width: '148px'
            },
            {
                label: '网点市',
                prop: 'netCityName',
                width: '148px'
            },
            {
                label: '网点区县',
                prop: 'netDistrictName',
                width: '148px'
            },
            {
                label: '网点乡镇',
                prop: 'netTownName',
                width: '148px'
            },
            {
                label: '供应商编码',
                prop: 'supplierCode',
                width: '148px'
            },
            {
                label: '网点分中心',
                prop: 'netCenterName',
                width: '148px'
            },
            {
                label: '状态',
                prop: 'netStatus',
                width: '80px'
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
