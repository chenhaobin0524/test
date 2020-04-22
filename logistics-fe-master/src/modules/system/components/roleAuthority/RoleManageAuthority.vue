<template>
    <div class="flex-layout">
        <list-layout>
            <div slot="header-search">
                <el-input v-model="nameFilter" placeholder="搜索租户编码/名称" size="mini" @keyup.enter.native="load"></el-input>
                <el-button type="primary" size="mini" @click="load" class="paddingleft">搜 索</el-button>
            </div>
            <div slot="header-button">
                <el-tooltip effect="dark" content="新增" placement="bottom" class="paddingleft">
                    <el-button type="primary" size="mini" @click="() => {
                        this.dialogVisible = true;
                        this.loadAdd();
                        }" icon="el-icon-plus"></el-button>
                </el-tooltip>
            </div>
            <el-table slot="list" slot-scope="props" :height="props.tableHeight" v-loading="loading" :data="userData" class="list-table" border stripe ref="table">
                <el-table-column prop="tenantName" label="租户列表" width="300"></el-table-column>
                <el-table-column prop="tenantCode" label="租户编码"></el-table-column>
                <el-table-column prop="action" label="操作" width="100">
                    <template slot-scope="scope">
                        <el-button size="mini" type="text" @click="handleDelete(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination slot="footer"
                    class="text-right"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[10, 20, 30, 50, 100]"
                    :page-size="10"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </list-layout>
        <Transfer width="900px"
                  titlename="新增"
                  :visible="dialogVisible"
                  :leftList="userData1"
                  @closeAdd="closeAdd"
                  @saveWhiteList="handleAuthority">
                <div slot="left-header">
                    <el-input v-model="nameFilter1" placeholder="搜索租户编码/名称" size="mini" @keyup.enter.native="loadAdd"></el-input>
                    <el-button type="primary" size="mini" @click="loadAdd">搜 索</el-button>
                </div>
                <div slot="left-list">
                    <el-table-column prop="tenantName" label="租户列表" width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="tenantCode" label="租户编码" show-overflow-tooltip></el-table-column>
                </div>
                <div slot="left-footer">
                    <el-pagination
                            slot="footer"
                            class="text-right"
                            @size-change="handleSizeChange1"
                            @current-change="handleCurrentChange1"
                            :current-page="currentPage1"
                            size="small"
                            layout="total, prev, pager, next"
                            :total="total1">
                    </el-pagination>
                </div>
                <div slot="right-header">
                    <div class="empty-slot"></div>
                </div>
                <div slot="right-list">
                    <el-table-column prop="tenantName" label="租户列表" width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="tenantCode" label="租户编码" show-overflow-tooltip></el-table-column>
                </div>
        </Transfer>
    </div>
</template>
<script>
import ListLayout from '@/components/lots/listLayout/Index';
import Transfer from '@/components/lots/transfer/Index';
import utils from '@/utils/common';
import { deleteRole, getTenantRolesList, setAuthorityLaseholders } from '../../api/LaseholderManageApi.js';

export default {
    components: { ListLayout, Transfer },
    data() {
        return {
            currentPage: 1,
            total: 0,
            nameFilter: '',
            userData: [],
            pageSize: 10,
            currentPage1: 1,
            total1: 0,
            nameFilter1: '',
            userData1: [],
            pageSize1: 10,
            nameFilter2: '',
            loading: false,
            selections: [],
            dialogVisible: false
        };
    },
    props: {
        user: Object
    },
    methods: {
        load() {
            const param = { roleCode: this.user.roleCode };
            if (this.nameFilter.length > 0) {
                param.queryParam = this.nameFilter;
            }
            param.pageSize = this.pageSize;
            param.pageNo = this.currentPage;
            param.authFlag = 1;
            getTenantRolesList(param).then(res => {
                if (res.data) {
                    this.userData = res.data.tenantPageResponse.list;
                    this.total = res.data.tenantPageResponse.totalCount;
                }
            });
        },
        closeAdd() {
            this.dialogVisible = false;
            this.nameFilter1 = '';
            this.nameFilter2 = '';
            this.userData1 = [];
            this.selections = [];
            this.currentPage1 = 1;
            this.total1 = 0;
        },
        loadAdd() {
            const param = { roleCode: this.user.roleCode };
            if (this.nameFilter1.length > 0) {
                param.queryParam = this.nameFilter1;
            }
            param.pageSize = this.pageSize1;
            param.pageNo = this.currentPage1;
            param.authFlag = 2;
            getTenantRolesList(param).then(res => {
                if (res.data) {
                    this.userData1 = res.data.tenantPageResponse.list;
                    this.total1 = res.data.tenantPageResponse.totalCount;
                }
            });
        },
        handleSizeChange(val) {
            this.pageSize = val;
            this.load();
        },
        handleSizeChange1(val) {
            this.pageSize1 = val;
            this.loadAdd();
        },
        handleAuthority(list) {
            const params = { roleCode: this.user.roleCode, tenantCode: 'midea' };
            const tenantCodes = list.map(item => item.tenantCode);
            params.tenantCodes = tenantCodes;
            setAuthorityLaseholders(params).then(res => {
                if (res && +res.code === 0) {
                    this.$message({ type: 'success', message: '保存成功!' });
                    this.dialogVisible = false;
                    this.closeAdd();
                } else {
                    this.$message({ type: 'error', message: '保存失败!' });
                }
                this.currentPage1 = 1;
                this.load();
            });
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.load();
        },
        handleSelectionChange(val) {
            this.selections = val;
        },
        handleCurrentChange1(val) {
            this.currentPage1 = val;
            this.loadAdd();
        },
        formatDate(date) {
            return utils.formatDate(date);
        },
        handleDelete(row) {
            deleteRole(row.tenantRoleId).then(res => {
                if (res.code === '0') {
                    this.$message({ type: 'success', message: '删除成功!' });
                } else {
                    this.$message({ type: 'error', message: '删除失败!' });
                }
                this.load();
            });
        },
        delDialogSelect(row) {
            for (let i = 0; i < this.userData1.length; i++) {
                if (this.userData1[i].id === row.id) {
                    this.$refs.table1.toggleRowSelection(this.userData1[i]);
                    return;
                }
            }
            this.$refs.table1.toggleRowSelection(row, false);
        }
    },
    mounted() {
        this.load();
    },
    watch: {
        user: function(newVal, oldVal) {
            this.load();
        }
    }
};
</script>
