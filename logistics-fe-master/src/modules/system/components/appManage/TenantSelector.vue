<template>
    <div class="tenant-auth">
        <el-row>
            <el-col :span="8">
                <el-row class="title-row">
                    <span>租户列表</span>
                </el-row>
                <el-row class="system-list">
                    <el-tree
                        :data="tenants"
                        node-key="id"
                        ref="treeTenants"
                        highlight-current
                        :props="tenantProps"
                        :check-on-click-node='true'
                        @node-click="getTenantAuth"
                        :default-checked-keys="[1]">
                        <template slot-scope="{ data }">
                            <div class="treeTenants">
                                <span>{{data.tenantName}}</span>
                                <span v-show="data.tenantHasAuth" class="box"></span>
                            </div>
                        </template>
                    </el-tree>
                </el-row>
            </el-col>
            <el-col :span="16">
                <el-row class="title-row">
                    <span>菜单</span>
                    <div class="select-all">
                        <span>全选</span>
                        <el-checkbox v-model="checkAll" @change="handleTreeAllChange"></el-checkbox>
                    </div>
                </el-row>
                <el-row class="auth-selector">
                    <el-tree
                        :data="authTree"
                        show-checkbox
                        node-key="id"
                        ref="treeAuth"
                        :props="modularProps">
                    </el-tree>
                </el-row>
                <el-row>
                    <div class="auth-footer">
                        <div class="pull-right">
                            <el-button type="text" @click="cancle">取消</el-button>
                            <el-button type="primary" @click="saveTenantAuth">保存</el-button>
                        </div>
                    </div>
                </el-row>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import { getTenantList, getTenantAuthList, saveTenantAuthList } from '../../api/TenantAuthApi.js';
export default {
    name: 'tenantAuth',
    props: ['allModular', 'type'],
    data() {
        return {
            tenants: [],
            checkAll: false,
            roles: [],
            checkedRoles: [],
            show: true,
            activeIndex: null,
            tenantProps: {
                label: 'tenantName'
            },
            modularProps: {
                children: 'subResources',
                label: 'resourceName'
            },
            authTree: [],
            currentTenant: {}
        };
    },
    mounted() {
        this.getTenant();
        this.loadAllAuths();
    },
    watch: {
        allModular: function () {
            const params = {
                applicationCode: this.allModular.applicationCode
            };
            getTenantAuthList(params).then(res => {
                if (res.data) {
                    this.authTree = res.data;
                }
            });
        }
    },
    methods: {
        getTenant() {
            getTenantList().then(res => {
                if (res.data && res.data.list) {
                    this.tenants = res.data.list;
                }
                this.tenants.map(item => {
                    item.tenantHasAuth = false;
                });
                this.$nextTick(function() {
                    this.$refs.treeTenants.setCurrentKey(2);
                });
                this.getTenantAuth(this.tenants[0]);
            });
        },
        getTenantAuth(data) {
            this.currentTenant = data;
            const params = {
                applicationCode: this.allModular.applicationCode,
                tenantCode: data.tenantCode
            };
            getTenantAuthList(params).then(res => {
                if (res.data) {
                    this.$refs.treeAuth.setCheckedKeys([3]);
                }
            });
        },
        saveTenantAuth() {
            let data = [];
            data = this.$refs.treeAuth.getCheckedNodes();
            const applicationCode = this.allModular.applicationCode;
            const tenantCode = this.currentTenant.tenantCode;
            const params = [];
            data.map(item => {
                params.push({
                    applicationCode: applicationCode,
                    tenantCode: tenantCode,
                    resourceCode: item.resourceCode
                });
            });
            saveTenantAuthList(applicationCode, tenantCode, params).then(res => {});
        },
        handleTreeAllChange(val) {
            if (val === true) {
                this.$refs.treeAuth.setCheckedNodes(this.authTree);
            } else {
                this.$refs.treeAuth.setCheckedKeys([]);
            }
        },
        loadAllAuths() {
            const params = {
                applicationCode: this.allModular.applicationCode,
                tenantCode: '00001'
            };
            getTenantAuthList(params).then(res => {
                if (res.data) {
                    this.authTree = res.data;
                }
            });
        },
        cancle() {
            this.checkedRoles = [];
            this.authTree = [];
            this.$emit('closeDialog');
        }
    }
};
</script>
<style lang="less">
.tenant-auth {
    .title-row {
        margin-bottom: 10px;
        font-size: 14px;
    }
    .select-all{
        float: right;
        > * {
            margin-right: 8px;
        }
    }
    .system-list {
        border-right: 0;
        height: 345px;
        overflow-y: auto;
        .el-tree-node__expand-icon{
            display: none;
        }
    }
    .treeTenants{
        margin: 0 10px;
        height: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .auth-selector {
        padding: 0 0 0 10px;
        border-left: 1px solid #e6e6e6;
        height: 345px;
        overflow-y: auto;
    }

    .auth-list {
        height: 260px;
        overflow: auto;
        margin: 10px 0 0 0;
        &.auth-list-page {
            height: 400px;
        }
        .auth-checkbox {
            width: 45%;
            box-sizing: border-box;
            margin: 0 10px 10px 0;
            padding: 0 10px;
            line-height: 2em;
        }
    }
    .auth-footer {
        display: flex;
        justify-content: flex-end;
        padding-top: 10px;
        border-left: 1px solid #e6e6e6;
        .el-button {
            margin-left: 15px;
        }
    }
    .el-tree-node__content > .el-checkbox{
        float: right;
        margin-top: 8px;
    }
    .el-tree-node__content{
        display: block;
        height: 36px;
    }
    .el-tree-node__content > .el-tree-node__expand-icon{
        padding: 12px;
    }
    .box{
        display: inline-block;
        height: 10px;
        width: 10px;
        background-color: #00BCBF;
        border-radius: 50%;
    }
}
</style>