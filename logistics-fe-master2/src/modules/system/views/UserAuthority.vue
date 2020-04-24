<template>
    <Paper class="user-authority-wrapper">
        <div class="panel-group">
            <div>
                <el-button @click="back" icon="el-icon-arrow-left" size="mini">返回</el-button>
                <el-radio-group v-model="radioValue" size="mini" class="raido-group" @change="handleRadioChange">
                    <el-radio-button label="角色权限"></el-radio-button>
                    <el-radio-button label="数据权限"></el-radio-button>
                    <el-radio-button label="资源权限"></el-radio-button>
                </el-radio-group>
            </div>
        </div>
        <div class="panel-group">
            <div class="user-info">
                <span class="user-info-item">{{curUserData.userName ? curUserData.userName : ''}}</span>
                <span class="user-info-item">{{curUserData.orgCode ? curUserData.orgCode : ''}}</span>
                <span class="user-info-item">{{curUserData.mainPostName ? curUserData.mainPostName : ''}}</span>
            </div>
            <div v-if="radioValue === '角色权限'" class="select-group">
                <el-checkbox v-model="checked" @change="() => {_getRoleByUser()}" style="line-height: 28px;">跨租户角色</el-checkbox>
                <el-input
                    class="select-input"
                    placeholder="请输入角色名进行搜索"
                    prefix-icon="el-icon-search"
                    v-model="selectValue"
                    @keyup.enter.native="() => {_getRoleByUser()}">
                </el-input>
                <el-button type="primary" size="mini" @click="Add" icon="el-icon-plus"></el-button>
            </div>
            <div v-else>
                <el-button type="text" @click="back">取消</el-button>
                <el-button type="primary" @click="save">保存</el-button>
            </div>
        </div>
        <div class="alterable">
            <div v-if="radioValue === '角色权限'" class="role-authority">
                <list-layout class="role-list">
                    <el-table slot="list" slot-scope="props" :height="props.tableHeight" border
                              ref="multipleTable"
                              :data="tableData"
                              v-loading="loading">
                        <el-table-column prop="roleName" label="角色名称" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="sourceTenantName" label="来源租户" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="roleTypeName" label="角色类型" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="applicationNames" label="应用" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="action" label="操作">
                            <template slot-scope='scope'>
                                <el-button @click='delSelect(scope.row)' type='text' size='mini'>删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination slot="footer"
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page.sync="currentPage"
                        :page-sizes="[10, 20, 30, 50, 100]"
                        layout='total, sizes, prev, pager, next, jumper'
                        :total="total">
                    </el-pagination>
                </list-layout>
            </div>
            <div v-if="radioValue === '数据权限'" class="data-authority">
                <role-selector :userData="curUserData" ref="dataAuth"></role-selector>
            </div>
            <div v-if="radioValue === '资源权限'" class="resource-authority">
                <resource-selector :userData="curUserData"
                        :systems="systems"
                        :treeData="treeData"
                        :leftLoading="leftLoading"
                        :rightLoading="rightLoading"
                        @handleSelectLeft="handleSelectLeft"
                        :hasSelect="hasSelectRight"
                        :hasRightSelect="hasRightSelect"
                        @checks="checks"
                        @rightChecks="rightChecks"
                        @save="save"
                        :defaultProps="defaultProps"
                        @selectLeft="selectLeft"/>
            </div>
            <Transfer width="1100px"
                    titlename="角色授权"
                    :visible="dialog.visible"
                    rowKey="id"
                    :leftList="dialog.leftList"
                    :leftLoading="dialog.leftLoading"
                    @closeAdd="closeAdd"
                    @saveWhiteList="saveDialog">
                    <div slot="left-header">
                        <el-input class="my-input" v-model='dialog.leftSelectValue' placeholder='请输入角色名进行搜索' @keyup.enter.native="() => {_getDialogList()}"></el-input>
                        <el-checkbox v-model="dialog.checked" @change="() => {_getDialogList()}">跨租户角色</el-checkbox>
                        <el-button  type='primary' size="mini" @click="() => {_getDialogList()}">查询</el-button>
                    </div>
                    <div slot="left-list">
                        <el-table-column prop="roleName" label="角色名称" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="sourceTenantName" label="来源租户" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="roleTypeName" label="角色类型" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="applicationNames" label="应用" show-overflow-tooltip>
                        </el-table-column>
                    </div>
                    <div slot="left-footer">
                        <el-pagination
                            @size-change="leftSizeChange"
                            :current-page.sync='dialog.leftCurrentPage'
                            @current-change="leftCurrentChange"
                            size="small"
                            layout='total, prev, pager, next'
                            :total='dialog.leftTotal'
                        ></el-pagination>
                    </div>
                    <div slot="right-header">
                        <div class="empty-slot"></div>
                    </div>
                    <div slot="right-list">
                        <el-table-column prop="roleName" label="角色名称" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="sourceTenantName" label="来源租户" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="roleTypeName" label="角色类型" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="applicationNames" label="应用" show-overflow-tooltip>
                        </el-table-column>
                    </div>
            </Transfer>
        </div>
    </Paper>
</template>
<script>
import Paper from '@/components/core/paper/Paper';
import Transfer from '@/components/lots/transfer/Index';
import ListLayout from '@/components/lots/listLayout/Index';
import RoleSelector from '../components/UserManage/RoleSelector';
import ResourceSelector from '../components/UserManage/ResourceSelector';
import { delUserRole, getResourceTree, getRoleByUser, getSystemList, saveResourceTree, saveUserRoles } from '../api/AcountManageApi.js';

export default {
    mounted() {
        this._getRoleByUser();
    },
    components: {
        Paper,
        ListLayout,
        RoleSelector,
        ResourceSelector,
        Transfer
    },
    props: {
        curUserData: {
            type: Object,
            default: () => {
                return {};
            }
        }
    },
    data() {
        return {
            oldSelection: [],
            radioValue: '角色权限',
            checked: false,
            selectValue: '',
            currentPage: 1,
            pageSize: 10,
            total: 0,
            tableData: [],
            multipleSelection: [],
            systems: [],
            treeData: [],
            leftLoading: false,
            rightLoading: false,
            hasSelectLeft: '',
            hasSelectRight: [],
            defaultProps: {
                children: 'subResources',
                label: 'resourceName'
            },
            loading: false,
            dialog: {
                visible: false,
                checked: false,
                leftSelectValue: '',
                rightSelectValue: '',
                leftLoading: false,
                leftList: [],
                leftCurrentPage: 1,
                leftPageSize: 10,
                leftTotal: 0,
                rightList: []
            },
            hasRightSelect: []
        };
    },
    methods: {
        _getRoleByUser(currentPage = 1) {
            const parm = {
                pageNo: currentPage,
                pageSize: this.pageSize,
                userCode: this.curUserData.userCode,
                authFlag: 1 // authFlag = 0 ,查询所有,authFlag = 1, 查询已授权的,authFlag = 2, 查询未授权的
            };
            if (this.selectValue.length) {
                parm['roleName'] = this.selectValue;
            }
            if (this.checked) {
                parm['roleType'] = 3;
            }
            this.loading = true;
            getRoleByUser(parm).then(res => {
                if (res && +res.code === 0) {
                    const { list, totalCount } = res.data.pageResponse;
                    this.tableData = list;
                    this.total = totalCount;
                }
                this.loading = false;
            });
        },
        _getDialogList(currentPage = 1) {
            const parm = {
                pageNo: currentPage,
                pageSize: this.dialog.leftPageSize,
                userCode: this.curUserData.userCode,
                authFlag: 2 // authFlag = 0 ,查询所有,authFlag = 1, 查询已授权的,authFlag = 2, 查询未授权的
            };
            if (this.dialog.leftSelectValue.length) {
                parm['roleName'] = this.dialog.leftSelectValue;
            }
            if (this.dialog.checked) {
                parm['roleType'] = 3;
            }
            this.dialog.leftLoading = true;
            getRoleByUser(parm).then(res => {
                if (res && +res.code === 0) {
                    const { list, totalCount } = res.data.pageResponse;
                    this.dialog.leftList = list;
                    this.dialog.leftTotal = totalCount;
                }
                this.dialog.leftLoading = false;
                // if (this.dialog.rightList.length) {
                //     this.$refs.multipleTable.toggleRowSelection(this.dialog.rightList);
                // }
            });
        },
        _saveUserRoles(list) {
            if (!list.length) {
                this.closeAdd();
                return false;
            }
            const userCodes = this.curUserData ? [this.curUserData.userCode] : null;
            const data = {
                userCodes: userCodes,
                roleCodes: list.map(item => item.roleCode)
            };
            saveUserRoles(data).then(res => {
                if (res && res.code === '0') {
                    this.$message({
                        type: 'success',
                        message: '保存成功'
                    });
                    this.closeAdd();
                    this._getRoleByUser();
                } else {
                    this.$message({
                        type: 'error',
                        message: '保存失败'
                    });
                }
            });
        },
        _getSystems(name = null) {
            this.leftLoading = true;
            getSystemList({ userCode: this.curUserData.userCode, applicationName: name }).then(res => {
                this.leftLoading = false;
                if (res && +res.code === 0 && res.data) {
                    this.systems = res.data.list ? res.data.list : [];
                    if (this.systems.length) {
                        this._getTreeList(this.systems[0]);
                    }
                }
            });
        },
        _getTreeList(user) {
            this.rightLoading = true;
            getResourceTree({
                applicationCode: user.applicationCode, // user.applicationCode
                userCode: this.curUserData.userCode
            }).then(res => {
                this.rightLoading = false;
                if (res && +res.code === 0 && res.data) {
                    this.treeData = res.data.resourceTreeList;
                    this.hasSelectRight = res.data.leftResourceCodes.map(item => item);
                    this.hasRightSelect = res.data.rightResourceCodes;
                }
            });
        },
        _saveResourceTree() {
            const { userName, userCode } = this.curUserData;
            const temp = {
                userName,
                userCode,
                applicationCode: this.hasSelectLeft.applicationCode,
                applicationName: this.hasSelectLeft.applicationName,
                leftResourceCodes: this.hasSelectRight.map(item => item),
                rightResourceCodes: this.hasRightSelect
            };
            saveResourceTree(temp).then(res => {
                if (res && +res.code === 0) {
                    this.$message.success('保存成功!');
                } else {
                    this.$message.error('保存失败!');
                }
            });
        },
        rightChecks(val) {
            this.hasRightSelect = val;
        },
        selectionChange(selection) {
            this.dialog.rightList = selection;
        },
        closeAdd() {
            this.dialog.visible = false;
            this.dialog.checked = false;
            this.dialog.leftSelectValue = '';
            this.dialog.rightSelectValue = '';
            this.dialog.leftList = [];
            this.dialog.leftCurrentPage = 1;
            this.dialog.leftPageSize = 10;
            this.dialog.leftTotal = 0;
            this.dialog.rightList = [];
        },
        leftSizeChange(val) {
            this.dialog.leftPageSize = val;
            this._getDialogList();
        },
        leftCurrentChange(val) {
            this.dialog.leftCurrentPage = val;
            this._getDialogList(val);
        },
        saveDialog(list) {
            this._saveUserRoles(list);
        },
        Add() {
            this.dialog.visible = true;
            this._getDialogList();
        },
        delSelect(row) {
            this.$confirm('该条数据将会被删除, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            }).then(() => {
                delUserRole(row).then(res => {
                    if (res && +res.code === 0) {
                        this.$message.success('删除成功');
                        this._getRoleByUser();
                    }
                });
            });
        },
        delDialogSelect(row) {
            for (let i = 0; i < this.dialog.leftList.length; i++) {
                if (this.dialog.leftList[i].id === row.id) {
                    this.$refs.multipleTable.toggleRowSelection(this.dialog.leftList[i]);
                    return;
                }
            }
            this.$refs.multipleTable.toggleRowSelection(row, false);
        },
        selectLeft(key) {
            this._getSystems(key);
        },
        filterSelect(list, selectRow) {
            for (const i of selectRow) {
                const tempObj = list.find(item => i === item.roleCode);
                if (tempObj) {
                    this.$nextTick(() => {
                        this.$refs.multipleTable.toggleRowSelection(tempObj);
                    });
                }
            }
        },
        handleSelectLeft(key) {
            this.hasSelectLeft = key;
            this._getTreeList(key);
        },
        save() {
            const val = this.radioValue;
            if (val === '角色权限') {
                this._saveUserRoles();
            }
            if (val === '数据权限') {
                this.$refs.dataAuth._saveDataAuths();
            }
            if (val === '资源权限') {
                this._saveResourceTree();
            }
        },
        checks(val) {
            this.hasSelectRight = val;
        },
        handleSelectionChange(val) {
            this.multipleSelection = val.map(item => item.roleCode);
        },
        back() {
            this.$emit('showlist');
        },
        handleSizeChange(val) {
            this.pageSize = val;
            this._getRoleByUser();
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this._getRoleByUser(val);
        },
        handleRadioChange(val) {
            if (val === '角色权限') {
                this._getRoleByUser();
            }
            if (val === '数据权限') {

            }
            if (val === '资源权限') {
                this._getSystems();
            }
        }
    }
};
</script>
<style lang="less">
.user-authority-wrapper{
    display: flex;
    flex-direction: column;
    .panel-group{
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
        .raido-group{
            margin-left: 10px;
        }
        .el-radio-button__inner{
            width: 120px;
        }
        .user-info-item{
            margin-right: 30px;
        }
        .select-group{
            display: flex;
            justify-content: flex-end;
        }
        .select-input{
            margin: 0 10px;
            width: 200px;
        }
    }
    .role-list {
        flex: 1 1 auto;
        margin-top: -10px;
    }
    .alterable{
        flex: 1;
        overflow: hidden;
        .role-authority{
            height: 100%;
            display: flex;
            flex-direction: column;
        }
        .data-authority{
            height: 100%;
        }
        .resource-authority{
            display: flex;
            height: 100%;
        }
        .add-role {
            display: flex;
            flex-direction: row;
            border: 1px solid #dbdbdb;
        }
        .my-table-left,
        .my-table-right {
            width: 50%;
            padding: 15px 15px 0 15px;
        }
        .my-table-left {
            border-right: 1px solid #dbdbdb;
        }
    }
}
</style>
