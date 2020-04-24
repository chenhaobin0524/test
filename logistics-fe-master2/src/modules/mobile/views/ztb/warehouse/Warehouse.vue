<template>
    <Paper class='warehouse-evaluation'>
        <m-panel
        ref="tablePage"
        :config="config"
        :totalData="totalData"
        :pageTotal="pageTotal"
        :loading="loading"
        @searchChange="searchChange"
        @pageChange="pageChange"
        @sizeChange="sizeChange"
        pageID="warehouse_evaluation">
        <div slot="table-module-btn">
            <div class="icon-button">
                <el-tooltip class='item' effect='dark' content='导出' placement='bottom'>
                    <mExport :url="exportURl" :params="exportParams" :name="exportName" @exportSearchChange="exportSearchChange"></mExport>
                </el-tooltip>
            </div>
        </div>
        </m-panel>
    </Paper>
</template>
<script>
import Paper from '@/components/core/paper/Paper';
import mPanel from '@/components/awesome/page/mPanel3';
import mExport from '@/components/awesome/page/fileHandle/export';
import config from './config.json';
import api from '../../../api/ztb/warehouse.js';
export default {
    name: 'orderInfo',
    data() {
        return {
            config: config,
            totalData: [],
            pageTotal: 0,
            selectedRows: [],
            loading: false,
            pageNo: 1,
            pageSize: 10,
            searchTerm: {},
            exportURl: '/api-gwms/basic/proOrderInfos/export',
            exportName: '生产单基本信息列表.xls',
            exportParams: {}
        };
    },
    methods: {
        exportSearchChange() {
            const data = this.$refs.tablePage.$refs.searchList.onSearchChange(null, true);
            const params = {
                pageNo: this.pageNo,
                pageSize: this.pageSize,
                ...data
            };
            this.exportParams = params;
        },
        searchChange(data) {
            this.pageNo = 1;
            this.config.page.pageSize = this.pageSize;
            this.searchTerm = data;
            this.loadData();
        },
        pageChange(data) {
            this.pageNo = data;
            this.loadData();
        },
        sizeChange(data) {
            this.pageSize = data;
            this.loadData();
        },
        loadData() {
            this.loading = true;
            const params = {
                pageNo: this.pageNo,
                pageSize: this.pageSize,
                ...this.searchTerm
            };
            api.get(params).then(res => {
                if (res) {
                    this.pageTotal = res.data.totalCount;
                    this.totalData = res.data.list;
                }
                this.loading = false;
            }).catch(() => {
                this.loading = false;
            });
        }
    },
    mounted() {
        this.loadData();
    },
    components: { Paper, mPanel, mExport }
};
</script>
<style lang='less'>
.warehouse-evaluation {
    .el-cascader {
        width: 100%
    }
}
</style>