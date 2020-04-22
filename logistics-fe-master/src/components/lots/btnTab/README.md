<btn-tab :tabList='tabArr' @btn-click='btnClick' :active='0'></btn-tab>

const tabArr = [ // 渲染数据
    {
        label: '供应商A', // 按钮名称字段
        carrierCode: 'L0277941' // 只为模拟数据字段
    },
    {
        label: '供应商B',
        carrierCode: 'HC0058770'
    }
]
btnClick(data) { // 点击按钮触发
    // data 为 tabArr 其中一个对象 
}
// active [可选参数] 指定第几个元素高亮，默认 0