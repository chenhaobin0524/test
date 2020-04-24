export default {
    delivery: {
        formInfo: [
            {
                col: [
                    { label: '订单号', prop: 'orderNo', span: 6 },
                    { label: '客户订单号', prop: 'customerOrderNo', span: 6 },
                    { label: '网点签收时间', prop: 'networkSignTime', span: 6 },
                    { label: '终端签收时间', prop: 'finalSignTime', span: 6 }
                ]
            },
            {
                col: [
                    { label: '网点名称', prop: 'netName', span: 6 },
                    { label: '网点联系方式', prop: 'netMobileetMobile', span: 6 },
                    { label: '网点详细地址', prop: 'networkAddr', span: 6 },
                    { label: '终端确认时间', prop: 'finalConfirmTime', span: 6 }
                ]
            },
            {
                col: [
                    { label: '终端收货客户', prop: 'finalName', span: 6 },
                    { label: '终端联系方式', prop: 'finalMobile', span: 6 },
                    { label: '终端详细地址', prop: 'finalDetailAddr', span: 6 },
                    { label: '增值服务类型', prop: 'addedServiceTypeName', span: 6 }
                ]
            }
        ],
        columns: [
            {
                label: '商品编码',
                prop: 'itemCode',
                width: '192px'
            },
            {
                label: '商品名称',
                prop: 'itemName',
                width: '192px'
            },
            {
                label: '商品数量',
                prop: 'planQty',
                width: '192px'
            },
            {
                label: '网点签收正品',
                prop: 'netRealReceive',
                width: '192px'
            },
            // {
            //     label: '网点签收霉变',
            //     prop: 'netMildewPollute',
            //     width: '192px'
            // },
            // {
            //     label: '网点签收破损',
            //     prop: 'netPackageDamaged',
            //     width: '192px'
            // },
            // {
            //     label: '网点签收拒收',
            //     prop: 'netRejectQty',
            //     width: '192px'
            // },
            {
                label: '网点签收短少',
                prop: 'netStockoutCount',
                width: '192px'
            },
            {
                label: '终端签收正品',
                prop: 'finalRealReceive',
                width: '192px'
            },
            {
                label: '终端签收霉变',
                prop: 'finalMildewPollute',
                width: '192px'
            },
            {
                label: '终端签收破损',
                prop: 'finalPackageDamaged',
                width: '192px'
            },
            {
                label: '终端签收拒收',
                prop: 'finalRejectQty',
                width: '192px'
            },
            {
                label: '终端签收短少',
                prop: 'finalStockoutCount',
                width: '192px'
            }
        ]
    }
};