const config = {
    table: {
        header: [
            {
                prop: 'orderNo',
                label: '子单号',
                type: 'link'
            },
            {
                prop: 'qty',
                label: '预占数量',
                width: 160
            },
            {
                prop: 'createTime',
                label: '预占时间',
                width: 160
            }
        ]
    }
};

export default config;
