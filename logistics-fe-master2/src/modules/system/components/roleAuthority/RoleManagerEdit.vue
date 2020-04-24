<template>
  <div class="Role-manager-edit">
    <el-dialog title="角色菜单权限" v-if="visible" :visible.sync="visible" @close="close">
        <span class="center-container">
            <p>{{user.roleName}}</p>
            <resource-selector  :userData="user"
                                @closeDialog="closeAuthDialog"
                                :systems="systems"
                                :treeData="treeData"
                                :leftLoading="leftLoading"
                                :rightLoading="rightLoading"
                                :hasSelect="hasSelect"
                                @checks="checks"
                                @save="save"
                                :defaultProps="defaultProps"/>
        </span>
    </el-dialog>
  </div>
</template>

<script>
import { getAllAuths, getUserAuths, saveRoleAuths } from '../../api/RolesApi.js';
import ResourceSelector from '../UserManage/ResourceSelector';
export default {
    data() {
        return {
            visible: this.dialogVisible,
            isSelectAll: false,
            systems: [],
            treeData: [],
            defaultProps: {
                children: 'subResInfos',
                label: 'resourceName'
            },
            leftLoading: false,
            rightLoading: false,
            hasSelect: []
        };
    },
    props: {
        dialogVisible: Boolean,
        user: Object
    },
    methods: {
        save(user) {
            this.sureAction(user);
            this.visible = false;
            this.$emit('close');
        },
        checks(val) {
            this.hasSelect = val;
        },
        close() {
            this.visible = false;
            this.$emit('close');
        },
        closeAuthDialog() {
            this.visible = false;
            this.$emit('close');
        },
        sureAction(user) {
            const params = {
                roleCode: user.roleCode,
                resourceCodes: this.hasSelect,
                applicationCode: user.applicationCode
            };
            saveRoleAuths(params).then(res => {
                if (res.code === '0') {
                    this.$message({
                        type: 'success',
                        message: '保存成功'
                    });
                } else {
                    this.$message({
                        type: 'error',
                        message: '保存失败'
                    });
                }
                this.visible = false;
                this.$emit('close');
            });
        },
        handleTreeAllChange(val) {
            if (val === true) {
                this.$refs.tree.setCheckedNodes(this.treeData);
            } else {
                this.$refs.tree.setCheckedKeys([]);
            }
        },
        loadUserAuths() {
            getUserAuths(this.user.roleCode).then(res => {
                this.$refs.tree.setCheckedNodes(res.data);
            });
        },
        loadAllAuths(roleCode, applicationCode) {
            this.rightLoading = true;
            getAllAuths({ roleCode, applicationCode }).then(res => {
                this.rightLoading = false;
                if (res && +res.code === 0 && res.data) {
                    this.treeData = res.data.resources;
                    this.hasSelect = res.data.resourceCodes;
                }
            });
        }
    },
    mounted() {
        const { roleCode, applicationName, applicationCode } = this.user;
        this.systems = [{
            applicationName,
            applicationCode
        }];
        this.loadAllAuths(roleCode, applicationCode);
    },
    components: {
        ResourceSelector
    }
};
</script>

<style lang="less">
.Role-manager-edit{
    .el-dialog__body{
        padding: 20px 20px;
        min-height: 300px;
    }
    .el-dialog__title{
        font-size: 16px;
    }
    .spaceline{
        height: 1px;
        background-color: #f1f1f1;
    }

    .center-container{
        font-size: 12px;
        h5 {
            color: #666;
        }
        .el-tree-node__content{
            height: 40px;
        }

        .selectAll{
            display: flex;
            justify-content: space-between;
            align-items:center;
        }
    }
}
</style>
