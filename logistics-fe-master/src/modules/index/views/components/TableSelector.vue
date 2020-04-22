<template>
    <div>
        <table-selector :data="data" :columns="columns" :total="14" :bind-props="{label:'name',value:'id'}" @on-change="handleChange" @on-page-change="handlePageChange" @on-search="handleSearch" />
    </div>
</template>
<script>
import tableSelector from '@/components/awesome/page/table_selector';

export default {
    name: 'table_selector',
    components: { tableSelector },
    data() {
        return {
            data: [
                {
                    id: 1,
                    name: '梁啟坚',
                    gender: '男',
                    apartment: '开发云',
                    age: 25
                },
                {
                    id: 2,
                    name: '陈润程',
                    gender: '男',
                    apartment: '开发云',
                    age: 26
                },
                {
                    id: 3,
                    name: '李宗永',
                    gender: '男',
                    apartment: '开发云',
                    age: 25
                },
                {
                    id: 4,
                    name: '区家华',
                    gender: '男',
                    apartment: '开发云',
                    age: 26
                }
            ],
            columns: [
                {
                    title: '姓名',
                    key: 'name'
                },
                {
                    title: '性别',
                    key: 'gender'
                },
                {
                    title: '部门',
                    key: 'apartment'
                },
                {
                    title: '年龄',
                    key: 'age'
                }
            ]
        };
    },
    methods: {
        handleSearch(page, pageSize, keyword) {
            this.$Modal.info({
                title: '提示',
                content: `点击了搜索按钮，查询关键字：${keyword}`
            });
        },
        handleChange() {
            // console.log(selection);
        },
        handlePageChange(page) {
            this.$Modal.info({
                title: '提示',
                content: `切换了当前页，当前页：${page}`
            });
        }
    }
};

</script>
