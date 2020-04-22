<template>
  <div class="role-resource">
    <div class="role-header">
        <p class="role-name">{{name}}</p>
        <div>
            <el-button type="primary" size="mini" @click="sureAction">保 存</el-button>
        </div>
    </div>
    <resource-selector  :userData="user"
                        :systems="systems"
                        :treeData="treeData"
                        :leftLoading="leftLoading"
                        :rightLoading="rightLoading"
                        :hasSelect="hasSelect"
                        :hasRightSelect="hasRightSelect"
                        @checks="checks"
                        @rightChecks="rightChecks"
                        @selectLeft="selectLeft"
                        @handleSelectLeft="handleSelectLeft"
                        :defaultProps="defaultProps"/>
  </div>
</template>

<script>
import { getAllAuths, getRoleResourceList, getUserAuths, saveRoleResources } from '../../api/RolesApi.js';
import ResourceSelector from '../UserManage/ResourceSelector';

export default {
    data() {
        return {
            isSelectAll: false,
            systems: [],
            treeData: [],
            defaultProps: {
                children: 'subResources',
                label: 'resourceName'
            },
            leftLoading: false,
            rightLoading: false,
            hasSelect: [],
            hasRightSelect: [],
            name: ' ',
            selectedApplicationCode: ''
        };
    },
    props: {
        user: {
            type: Object,
            default: () => {
                return {};
            }
        }
    },
    methods: {
        checks(val) {
            this.hasSelect = val;
        },
        rightChecks(val) {
            this.hasRightSelect = val;
        },
        sureAction() {
            const params = {
                roleCode: this.user.roleCode,
                // resourceCodes: this.hasSelect,
                leftResourceCodes: this.hasSelect,
                rightResourceCodes: this.hasRightSelect,
                applicationCode: this.selectedApplicationCode
            };
            saveRoleResources(params).then(res => {
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
                    this.hasSelect = res.data.leftResourceCodes;
                    this.hasRightSelect = res.data.rightResourceCodes;
                }
            });
        },
        loadApplications(key = '') {
            if (!this.user.roleCode) return;
            const param = {
                roleCode: this.user.roleCode,
                applicationName: key
            };
            getRoleResourceList(param).then(res => {
                if (res.data) {
                    this.systems = res.data.list;
                }
            });
        },
        handleSelectLeft(row) {
            this.selectedApplicationCode = row.applicationCode;
            this.loadAllAuths(this.user.roleCode, row.applicationCode);
        },
        selectLeft(key) {
            this.loadApplications(key);
        }
    },
    mounted() {
        this.name = this.user.roleName;
        this.loadApplications();
    },
    watch: {
        user: function(newVal, oldVal) {
            this.loadApplications();
        }
    },
    components: {
        ResourceSelector
    }
};
</script>

<style lang="less">
.role-resource{
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    .role-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .role-name{
        font-size: 14px;
    }
}
</style>
