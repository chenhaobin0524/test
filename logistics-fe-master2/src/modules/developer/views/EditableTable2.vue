<template>
  <div style="overflow: auto;">
    <Paper class='batch-operation'>
        <p>可编辑的自定义表格</p>
        <Table :tableData="tableData" :rowDblclick="rowDblclick" :tableHeaders="tableHeaders" :loading="loading" :headerFilterCb="headerFilterCb"></Table>
    </Paper>
     <Paper>
        使用说明
        <el-container>
            <el-main>
        1,引入Table组件
              <pre>
                <code>
import Table from '../components/common/EditableTable';
                </code>
              </pre>
        2,自定义表头
              <pre>
                <code>
const tableHeader = [
    // 表头数据
    { prop: 'dhm', label: '时间', minWidth: '140px', sortable: true },
    { prop: 'plazano', label: '编码', minWidth: '100px', sortable: true },
    { prop: 'plazano2', label: '名称', minWidth: '100px', sortable: true, formatData: val => val },
    { prop: 'car_plate', sortable: true, label: '号码' },
    { prop: 'card_no', label: '卡号', minWidth: '120px' },
    { prop: 'laneno', label: '数据类型', formatData: function (val) { return val.substr(2, 1) === '1' ? '出口' : '入口'; } },
    { prop: 'staffname', label: '姓名', minWidth: '100px' },
    { prop: 'mediatype', label: '付款方式' },
    { prop: 'comp_cash', label: '计算费额' },
    { prop: 'fact_cash', label: '实收费额' },
    {
        prop: 'oper',
        label: '操作',
        fixed: 'right',
        minWidth: '100px',
        oper: [
            { name: '查看', clickFun: () => { console.log('click'); } },
            { name: '编辑', clickFun: () => { console.log('click'); } }
        ]
    }
];

export default tableHeader;
                </code>
              </pre>
              3,将表头和数据通过属性传递给Table组件
              <pre>
                <code>
&lt;Table :tableData="tableData" :rowDblclick="rowDblclick" :tableHeaders="tableHeaders" :loading="loading"&gt;&lt;/Table&gt;
                </code>
              </pre>
              4,过滤器
              <pre>
// 表头format属性指定-内置过滤器
                <code>
{ prop: 'dhm', label: '时间', format: 'dateTime', minWidth: '140px', sortable: true }
                </code>
// 表头format属性指定-自定义过滤器
                <code>
{ prop: 'laneno', label: '数据类型', format: function (val) { return val.substr(2, 1) ? '雷兵兵出口' : '入口'; } },
                </code>
              </pre>
              5,内置过滤器
              <pre>
日期类：
                <code>
date // 格式：'YYYY-MM-DD',
dateTime // 格式： 'YYYY-MM-DD HH:mm',
shortDateTime // 格式：'YY/MM/DD HH:mm',
time // 格式：'HH:mm'
                </code>
其他：
                <code>
待补充
                </code>
              </pre>
              6,Demo数据
              <pre>
                <code>
const tableData = [
    {
        dhm: '今天1',
        plazano: '1212230302304',
        plazano2: '中央空调',
        car_plate: '34205DFFF',
        card_no: '544430303939484585',
        laneno: '美的系',
        staffname: '刘德华',
        mediatype: '美的移动支付',
        comp_cash: '1个亿',
        fact_cash: '3个亿'
    },
    {
        dhm: '今天2',
        plazano: '1212230302304',
        plazano2: '中央空调',
        car_plate: '34205DFFF',
        card_no: '544430303939484585',
        laneno: '美的系',
        staffname: '刘德华',
        mediatype: '美的移动支付',
        comp_cash: '1个亿',
        fact_cash: '3个亿'
    },
    {
        dhm: '今天3',
        plazano: '1212230302304',
        plazano2: '中央空调',
        car_plate: '34205DFFF',
        card_no: '544430303939484585',
        laneno: '美的系',
        staffname: '刘德华',
        mediatype: '美的移动支付',
        comp_cash: '1个亿',
        fact_cash: '3个亿'
    },
    {
        dhm: '今天4',
        plazano: '1212230302304',
        plazano2: '中央空调',
        car_plate: '34205DFFF',
        card_no: '544430303939484585',
        laneno: '美的系',
        staffname: '刘德华',
        mediatype: '美的移动支付',
        comp_cash: '1个亿',
        fact_cash: '3个亿'
    }
];
export default tableData;
                </code>
              </pre>
            </el-main>
        </el-container>
    </Paper>
  </div>
</template>
<script>
import Paper from '@/components/core/paper/Paper';
import Table from '../components/common/EditableTable';
import tableHeaders from './configs/editTableHeader';
import tableData from './configs/editTableData';

// import request from '@/utils/http';
export default {
    data() {
        return {
            tableHeaders,
            tableData,
            loading: false
        };
    },
    components: { Paper, Table },
    methods: {
        rowDblclick(row, event, column) {},
        headerFilterCb: (params) => {}
    }
};
</script>
<style lang='less'>
</style>
