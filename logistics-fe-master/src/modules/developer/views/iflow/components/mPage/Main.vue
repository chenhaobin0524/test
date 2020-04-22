<template>
      <el-pagination
        background
        class="table-pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-size=pageData.pageSize
        :pager-count="5"
        :page-sizes="pageData.pageSizes || []"
        :layout=pageData.layout
        :current-page.sync="currentPage"
        :total=total>
      </el-pagination>
</template>
<script>
export default {
    name: 'mPage',
    props: {
        total: {
            type: Number,
            default: 0
        },
        pageData: {
            type: Object
        },
        pageSize: {
            type: Number,
            default: 10
        },
        pageSizeOpts: {
            type: Array
        }
    },
    data() {
        return {
            currentPage: 1
        };
    },
    methods: {
        handleSizeChange(page) {
            this.$emit('on-size-change', page);
        },
        handleCurrentChange(pageSize) {
            this.$emit('on-page-change', pageSize);
        },
        handlecurrentPage() {
            this.currentPage = 1;
        }
    }
};
</script>
<style lang="less">
.table-pagination{
    float: right;
    padding: 0;
    .btn-prev, .btn-next, .el-pager li {
        background-color: #ffffff !important;
        border: 1px solid #cccccc;
        border-radius: 4px !important;
    }
    .el-pager li.active + li {
        border-left: 1px solid #cccccc;
    }
    .el-pager li:not(.disabled).active{
        background-color: #00BCBF !important;
        border: 1px solid #00BCBF;
    }
}
</style>
