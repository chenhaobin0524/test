<template>
    <div class="flex-layout">
        <list-layout-paper class="relevance-role">
            <div slot="header-search">
                <el-button @click="$emit('goback')" icon="el-icon-arrow-left" size="mini" >返回</el-button>
            </div>
            <div slot="header-button">
                <el-button type="primary" @click="Add" icon="el-icon-plus"></el-button>
            </div>
            <div slot="list" slot-scope="props">
                <el-table
                        v-loading="tbLoading"
                        border
                        :height="props.tableHeight"
                        stripe
                        :data='list'>
                        <el-table-column prop="roleName" label="关联角色">
                        </el-table-column>
                        <el-table-column prop="roleCode" label="编码">
                        </el-table-column>
                        <el-table-column prop="detail" label="描述" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="applicationNames" label="所属系统" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="roleTypeName" label='角色类型'>
                        </el-table-column>
                        <el-table-column prop="sourceTenantName" label='来源租户'>
                        </el-table-column>
                        <el-table-column prop="enableFlag" label='角色状态'>
                            <template slot-scope='scope'>
                                <span>{{scope.row.enableFlag === 1 ? '启用' : '禁用'}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="action" label='操作' width="80">
                            <template slot-scope='scope'>
                                <el-button type="text" @click="handleDelect(scope.row.positionRoleId)">删除</el-button>
                            </template>
                        </el-table-column>
                </el-table>
            </div>
            <el-pagination
                class="text-right"
                slot="footer"
                @size-change="SizeChange"
                :current-page.sync='currentPage'
                @current-change="CurrentChange"
                size="small"
                layout='total, sizes, prev, pager, next, jumper'
                :total='total'
            ></el-pagination>
        </list-layout-paper>
        <Transfer width="1100px"
                    titlename="添加角色"
                    :visible="dialog.visible"
                    rowKey="id"
                    :leftList="dialog.leftList"
                    :leftLoading="dialog.leftLoading"
                    @closeAdd="closeAdd"
                    @saveWhiteList="saveDialog">
                <div slot="left-header">
                    <el-input class="my-input" v-model='dialog.leftSelectValue' placeholder='请输入角色名进行搜索'></el-input>
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
</template>
<script>
import Transfer from '@/components/lots/transfer/Index';
import ListLayoutPaper from '@/components/lots/listLayout/Paper';
import { queryPositionRoles, batchAddPositionRoles, DeleteRolePosition } from '../../api/PostManage.js';
export default {
    methods: {
        _requestList() {
            this.tbLoading = true;
            const parm = {
                pageNo: this.currentPage,
                pageSize: this.pageSize,
                positionCode: this.curUserData.positionCode,
                tenantCode: this.curUserData.tenantCode,
                authFlag: 1 // authFlag = 0 ,查询所有,authFlag = 1, 查询已授权的,authFlag = 2, 查询未授权的
            };
            queryPositionRoles(parm).then(res => {
                if (res && +res.code === 0) {
                    const { list, totalCount } = res.data.pageResponse;
                    this.list = list;
                    this.total = totalCount;
                }
                this.tbLoading = false;
            });
        },
        _batchAddPositionRoles(list) {
            const positionCode = this.curUserData ? this.curUserData.positionCode : null;
            const data = {
                positionCode: positionCode,
                roleCodes: list.map(item => item.roleCode)
            };
            batchAddPositionRoles(data).then(res => {
                if (res && res.code === '0') {
                    this.$message({
                        type: 'success',
                        message: '保存成功'
                    });
                    this.closeAdd();
                    this._requestList();
                } else {
                    this.$message({
                        type: 'error',
                        message: '保存失败'
                    });
                }
            });
        },
        _getDialogList(currentPage = 1) {
            const parm = {
                pageNo: currentPage,
                pageSize: this.dialog.leftPageSize,
                positionCode: this.curUserData.positionCode,
                tenantCode: this.curUserData.tenantCode,
                authFlag: 2, // authFlag = 0 ,查询所有,authFlag = 1, 查询已授权的,authFlag = 2, 查询未授权的
                roleType: 2
            };
            if (this.dialog.leftSelectValue.length) {
                parm['roleName'] = this.dialog.leftSelectValue;
            }
            if (this.dialog.checked) {
                parm['roleType'] = 3;
            }
            this.dialog.leftLoading = true;
            queryPositionRoles(parm).then(res => {
                if (res && +res.code === 0 && res.data) {
                    const { list, totalCount } = res.data.pageResponse;
                    this.dialog.leftList = list;
                    this.dialog.leftTotal = totalCount;
                }
                this.dialog.leftLoading = false;
            });
        },
        _DeleteRolePosition(id) {
            this.$confirm('此操作不可逆, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(res => {
                DeleteRolePosition(id).then(res => {
                    if (res && +res.code === 0) {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        if (this.list.length === 1 && this.currentPage >= 2) {
                            this.currentPage--;
                        }
                        this._requestList();
                    }
                });
            });
        },
        selectionChange(selection) {
            this.dialog.rightList = selection;
        },
        leftSizeChange(val) {
            this.dialog.leftPageSize = val;
            this._getDialogList();
        },
        leftCurrentChange(val) {
            this.dialog.leftCurrentPage = val;
            this._getDialogList(val);
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
        saveDialog(list) {
            this._batchAddPositionRoles(list);
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
        Add() {
            this.dialog.visible = true;
            this._getDialogList();
        },
        SizeChange(val) {
            this.pageSize = val;
            this._requestList();
        },
        CurrentChange(val) {
            this.currentPage = val;
            this._requestList();
        },
        handleDelect(id) {
            this._DeleteRolePosition(id);
        }
    },
    mounted() {
        this._requestList();
    },
    data() {
        return {
            tbLoading: false,
            list: [],
            currentPage: 1,
            total: 0,
            pageSize: 10,
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
            }
        };
    },
    props: {
        curUserData: {
            type: Object,
            default: () => {
                return {};
            }
        }
    },
    components: {
        Transfer,
        ListLayoutPaper
    }
};
</script>
<style lang="less">
</style>