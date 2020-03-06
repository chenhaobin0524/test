<template>
    <el-row type="flex" align="middle">
        <el-col span="6">共&nbsp;{{total}}&nbsp;条记录&nbsp;&nbsp;第&nbsp;{{current}}&nbsp;/&nbsp;{{Math.ceil(total/pageSize)}}&nbsp;页</el-col>
        <el-col span="18">
        <Page style="float: right;" size="small" show-elevator show-sizer :page-size-opts="pageSizeOpts" :total="total"
                :page-size="pageSize" placement="top"
                @on-change="handleChange"
                @on-page-size-change="handlePageSizeChange"></Page>
        </el-col>
    </el-row>
</template>
<script>
export default {
    name: 'mPage',
    props: {
        current: {
            type: Number,
            default: 1
        },
        total: {
            type: Number,
            default: 0
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
    methods: {
        handleChange(page) {
            this.$emit('on-change', page);
        },
        handlePageSizeChange(pageSize) {
            this.$emit('on-page-size-change', pageSize);
        }
    }
};
</script>
<style scoped>
</style>
