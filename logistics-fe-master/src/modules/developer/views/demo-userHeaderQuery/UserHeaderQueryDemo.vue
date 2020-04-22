<template>
    <Paper>
        <el-button @click="showModal=true" type="primary">配置列</el-button>
        <el-table :data="data" border style="width: 100%" class="table">
            <div v-for="(item, index) in columns" :key="'row_' + index">
                <el-table-column :prop="item.key" :label="item.title" type="selection" width="60px" v-if="index===0"/>
                <el-table-column :prop="item.key" :label="item.title" type="index" width="80px" v-else-if="index===1"/>
                <el-table-column :prop="item.key" :label="item.title" v-else/>
            </div>
        </el-table>
        <user-query-setting :showModal="showModal" v-if="showModal" v-model="settingColumns" @on-ok="handleOk" @on-cancel="showModal=false"></user-query-setting>
    </Paper>
</template>
<script>
import Paper from '@/components/core/paper/Paper';
import UserQuerySetting from '@/components/utils/user_query/UserQuerySetting.vue';
import { columns, data } from './mock-data';
import { serviceUserHeaderQuery } from '../../api/UserHeaderQuery';

export default {
    name: 'UserQuery',
    data() {
        return {
            showModal: false,
            columns: columns,
            settingColumns: columns.filter(item => { return item.key !== undefined; }), // 配置了多选和序号两列，不应该把它们放去排序，过滤掉
            data: data,
            formKey: 'UserHeaderQuery',
            fdId: ''
        };
    },
    methods: {
        handleOk(newColumns) {
            if (this.fdId === '') {
                this.columns.splice(2, this.columns.length - 2); // 配置了多选和序号选项，则需要此代码
                this.columns = this.columns.concat(newColumns);
                serviceUserHeaderQuery.save(this.formKey, JSON.stringify(this.columns)).then(res => {
                    if (res.success) {
                        this.$Message.success(res.msg);
                        this.showModal = false;
                    } else {
                        this.$Message.error(res.msg);
                    }
                });
            } else {
                this.columns.splice(2, this.columns.length - 2); // 配置了多选和序号选项，则需要此代码
                this.columns = this.columns.concat(newColumns);
                serviceUserHeaderQuery.update(this.fdId, this.formKey, JSON.stringify(this.columns)).then(res => {
                    if (res.success) {
                        this.$Message.success(res.msg);
                        this.showModal = false;
                    } else {
                        this.$Message.error(res.msg);
                    }
                });
            }
        }
    },
    components: {
        'user-query-setting': UserQuerySetting,
        Paper
    },
    mounted() {
        serviceUserHeaderQuery.get(this.formKey).then(res => {
            if (res.data) {
                this.fdId = res.data.fdId;
                this.columns = JSON.parse(res.data.configContent);
            } else {
                this.$Message.error(res.msg);
            }
        });
    }
};
</script>
<style lang="less">
.user-query {
    padding: 12px;
    .table {
        margin-top: 20px;
    }
}
</style>