<template>
    <div class="storage-area-manage tabContent">
        <div class="table-content" style="margin-top: 38px;">
            <el-table
                :data="tableData"
                style="width: 100%"
                border
                v-loading='loading'>
                <el-table-column prop="locCode" label="库位编码" show-overflow-tooltip></el-table-column>
                <el-table-column prop="zoneCode" label="所属库区" show-overflow-tooltip></el-table-column>
                <el-table-column prop="whName" label="仓库名称" show-overflow-tooltip></el-table-column>
                <el-table-column prop="maxCount" label="最大存储量CS" show-overflow-tooltip></el-table-column>
                <el-table-column prop="maxPl" label="最大托盘数" show-overflow-tooltip></el-table-column>
                <el-table-column prop="locStatusText" label="状态" show-overflow-tooltip></el-table-column>
                <el-table-column fixed="right" align='center' label="操作">
                    <template slot-scope="{row}">
                        <el-switch
                            class="demo"
                            @change="switchChange(row)"
                            v-model="row.locStatus"
                            active-text='启用'
                            inactive-text='停用'>
                        </el-switch>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <!-- 分页 -->
        <div class="table-pagination">
            <el-pagination
                class="is-background"
                :pager-count="5"
                :layout="pageConfig.layout"
                :total="pageConfig.total"
                :current-page="pageConfig.currentPage"
                :page-sizes="pageConfig.pageSizes"
                :page-size="pageConfig.pageSize"
                @size-change='sizeChange'
                @current-change='pageChange'>
            </el-pagination>
        </div>
    </div>
</template>

<script>
import api from '@/modules/mobile/api/njdc/njdc.js';

export default {
    data() {
        return {
            tableData: [],
            loading: false,
            pageConfig: {
                layout: 'total, sizes, prev, pager, next, jumper',
                pageSize: 10,
                pageSizes: [10, 20, 50, 100],
                total: 0,
                currentPage: 1
            },
            searchParams: {}
        };
    },
    methods: {
        switchChange(row) {
            const params = {};
            params.locStatus = row.locStatus ? 30 : 0;
            params.id = row.id;
            params.version = row.version;
            this.loading = true;
            api.pgCrenelLoc(params).then(res => {
                this.loading = false;
                if (res) {
                    this.$message.success('状态切换成功');
                    this.getDataList(this.searchParams);
                } else {
                    row.switchStatus = !row.switchStatus;
                }
            }).catch(() => {
                row.switchStatus = !row.switchStatus;
                this.loading = false;
            });
        },
        sizeChange(data) {
            this.searchParams.pageSize = data;
            this.searchParams.pageNo = 1;
            this.getDataList(this.searchParams);
        },
        pageChange(data) {
            this.searchParams.pageNo = data;
            this.getDataList(this.searchParams);
        },
        // 获取列表数据
        getDataList({ pageSize, pageNo } = { pageSize: 10, pageNo: 1 }) {
            const params = { pageSize, pageNo };
            this.searchParams = params;
            this.pageConfig.currentPage = pageNo;
            this.loading = true;
            api.crenelPageLoc(params).then(res => {
                if (res) {
                    const locStatus = {
                        '0': '不可用',
                        '10': '呼叫中', // 这个应该用不到, 先写着预留不影响
                        '20': '作业中',
                        '30': '空闲'
                    };
                    res.data.list.forEach(item => {
                        item.locStatusText = locStatus[item.locStatus];
                        item.locStatus = !!item.locStatus;
                    });
                    this.pageConfig.total = res.data.totalCount;
                    this.tableData = res.data.list;
                }
                this.loading = false;
            }).catch(() => {
                this.loading = false;
            });
        }
    },
    created() {
        // 获取列表数据
        this.getDataList();
    }
};
</script>

<style lang="less">
.storage-area-manage {

    .table-content {
        height: calc(100vh - 201px);
        overflow-y: auto;
    }
    .demo .el-switch__label--left,
    .demo .el-switch__label--right {
        text-align: left;
    }
}
</style>
