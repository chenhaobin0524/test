<template>
      <el-pagination
        style="display: flex;justify-content:flex-end;margin-top: 20px"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-size=pageData.pageSize
        :page-sizes="pageData.pageSizes || []"
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
            type: Array,
            default () { return [10, 20, 30, 40, 50]; }
        }
    },
    data() {
        return {
            currentPage: 1
        };
    },
    methods: {
        handleSizeChange(page) {
            this.$emit('on-change', page);
        },
        handleCurrentChange(pageSize) {
            this.$emit('on-page-size-change', pageSize);
        }
    }
};
</script>
<style scoped>
</style>
