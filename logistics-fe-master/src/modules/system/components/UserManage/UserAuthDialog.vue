<template>
    <el-dialog :visible.sync="show" class="user-auth-dialog">
        <el-tabs  v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="用户角色" name="role">
                <p class="user-info">{{userData.user_name}} {{userData.org_code}} {{userData.position_name}}</p>
                <role-selector></role-selector>
            </el-tab-pane>
            <el-tab-pane label="数据权限" name="data">
                <p class="user-info">{{userData.user_name}} {{userData.org_code}} {{userData.position_name}}</p>
                <data-selector></data-selector>
            </el-tab-pane>
        </el-tabs>
    </el-dialog>
</template>
<script>
import RoleSelector from './RoleSelector';
import DataSelector from './DataSelector';
export default {
    props: ['visible', 'userData'],
    components: { RoleSelector, DataSelector },
    data() {
        return {
            activeName: 'role',
            show: true
        };
    },
    mounted() {
        this.show = this.visible;
    },
    methods: {
        handleClick() {}
    }
};
</script>
<style lang="less">
.user-auth-dialog {
    .el-dialog__header {
        border-bottom: 0;
        padding: 0;
    }
    .user-info {
        margin: 2em 0 3em 0;
    }
}
</style>