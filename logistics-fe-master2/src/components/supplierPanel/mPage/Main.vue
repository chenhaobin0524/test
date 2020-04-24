<template>
      <el-pagination
        v-if="pageState"
        background
        class="table-pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size=pageData.pageSize
        :pager-count="5"
        :page-sizes="pageData.pageSizes || [10, 20, 30, 50, 100]"
        :layout=pageData.layout
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
        },
        currentPage: {
            type: Number,
            default: 1
        }
    },
    data() {
        return {
            pageState: true
        };
    },
    methods: {
        handleSizeChange(page) {
            this.$emit('on-size-change', page);
        },
        handleCurrentChange(pageSize) {
            this.$emit('on-page-change', pageSize);
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
