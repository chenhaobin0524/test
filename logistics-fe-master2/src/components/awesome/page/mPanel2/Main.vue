<template>
    <paper id="mPanel">
        <m-button-list :list="config.buttonList"></m-button-list>
        <m-table
          :totalDate="config.table"
          :tableData=tableData
          @btnView="checkTable"
          @btnEdit="editTable"
          @btnDelete="delTable"
          @onSelectionChange="selectChange"
          @onSearchChange="searchChange"
        ></m-table>
        <m-page :pageData="config.page" :total="total" @on-page-size-change="pageChange"></m-page>
    </paper>
</template>
<script>
import mButtonList from './mButtonList';
import mTable from './mTable';
import paper from '../../../core/paper/Paper';
import mPage from './mPage';

export default {
    name: 'mPanel',
    components: { paper, mTable, mButtonList, mPage },
    data() {
        return {
            data: [],
            page: 1,
            total: 100,
            condition: {},
            tableData: [{
                informNum: '2016-05-02',
                orderNum: '32134132412',
                number: '上海市普陀区金沙江路 1518 弄'
            }]
        };
    },
    props: {
        config: Object,
        dataSourceUrl: String,
        method: {
            type: String,
            default: 'get'
        }
    },
    methods: {
        // 表格中按钮触发事件
        checkTable() {
        },
        editTable() {
        },
        delTable() {
        },
        // 表单选项变化
        selectChange() {
        },
        // 表单搜索内容变化
        searchChange() {
        },
        // 分页器改变触发事件
        pageChange() {
        }
    }
};
</script>
<style lang="less">
#mPanel {
    .margin-bottom-20 {
        margin-bottom: 20px;
    }

    .margin-bottom-10 {
        margin-bottom: 10px;
    }
    .m-table-wrapper {
        border: 0;
    }

    .m-table:after {
        width: 0;
    }

    .m-table:before {
        height: 0;
    }

    .m-table td,
    .m-table th {
        border-bottom: 0;
    }

    .zk-table {
        border: 0;
    }

    .zk-table__body,
    .zk-table__footer,
    .zk-table__header {
        border-collapse: initial;
    }
}
</style>
