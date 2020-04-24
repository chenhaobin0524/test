<template>
    <m-panel :config="config" :data="dataset" :total="3" @on-create="handleCreate" @on-import="handleImport"
        @on-row-details="handleRowDetails" @on-row-delete="handleRowDelete" @on-row-update="handleRowUpdate"
        @on-submit="handleSubmit" />
</template>
<script>
import mPanel from '@/components/awesome/page/mPanel';
import _config from './config.json';

export default {
    name: 'mpanel',
    components: { mPanel },
    data() {
        return {
            config: _config,
            dataset: [
                {
                    name: '区某华',
                    gender: '男',
                    apartment: '开发云'
                },
                {
                    name: '李宗某',
                    gender: '男',
                    apartment: '开发云'
                },
                {
                    name: '陈某程',
                    gender: '男',
                    apartment: '开发云'
                }
            ]
        };
    },
    methods: {
        handleCreate() {
            this.$Modal.info({
                title: '提示',
                content: '点击了新建按钮'
            });
        },
        handleImport() {
            this.$Modal.info({
                title: '提示',
                content: '点击了导入按钮'
            });
        },
        handleRowUpdate(row) {
            this.$Modal.info({
                title: '提示',
                content: `点击了修改按钮，行数据：${JSON.stringify(row)}`
            });
        },
        handleRowDetails(row) {
            this.$Modal.info({
                title: '提示',
                content: `点击了详情按钮，行数据：${JSON.stringify(row)}`
            });
        },
        handleRowDelete(row) {
            this.$Modal.info({
                title: '提示',
                content: `点击了删除按钮，行数据：${JSON.stringify(row)}`
            });
        },
        handleSubmit(page, pageSize, params) {
            this.$Modal.info({
                title: '提示',
                content: `点击了查询按钮，查询条件：${JSON.stringify(params)}`
            });
        }
    }
};

</script>
