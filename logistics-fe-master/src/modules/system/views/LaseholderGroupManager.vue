<template>
    <div class="flex-layout Laseholder-group-manager">
        <list-layout-paper>
            <div slot="header-search">
                <el-button size="mini" icon="el-icon-arrow-left" @click="handleBack">返 回</el-button>
                <el-input v-model="account" placeholder="搜索租户编码/名称" size="mini"></el-input>
                <el-button type="primary" size="mini" @click="load">查 询</el-button>
            </div>
            <div slot="header-button">
                <el-button size='mini' type="primary" @click="() => {
                        this.dialogVisible = true;
                        this.loadAdd();
                        }" icon="el-icon-plus"></el-button>
            </div>
            <el-table slot="list" slot-scope="props" :height="props.tableHeight" border :data="userData">
                <el-table-column prop="tenantName" label="租户列表"></el-table-column>
                <el-table-column prop="tenantCode" label="租户编码"></el-table-column>
                <el-table-column prop="action" label="操作" width="100">
                    <template slot-scope="scope">
                        <el-button size="mini" type="text" @click="showVisi(scope.row.id)">删除</el-button>
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
        </list-layout-paper>
        <Transfer width="80%"
                  titlename="新增"
                  rowKey="tenantCode"
                  :visible="dialogVisible"
                  :leftList="userAddData"
                  @closeAdd="closeAdd"
                  @saveWhiteList="handleAddUser">
                <div slot="left-header">
                    <el-input v-model="nameFilter1" placeholder="搜索租户编码/名称" size="mini" @keyup.enter.native="loadAdd"></el-input>
                    <el-button type="primary" size="mini" @click="loadAdd" class="padding-left">搜 索</el-button>
                </div>
                <div slot="left-list">
                    <el-table-column prop="tenantName" label="租户列表" width="200"></el-table-column>
                    <el-table-column prop="tenantCode" label="租户编码"></el-table-column>
                </div>
                <div slot="left-footer">
                    <el-pagination slot="footer"
                            small
                            @size-change="handleSizeChange1"
                            @current-change="handleCurrentChange1"
                            :current-page="currentPage1"
                            :page-size="10"
                            layout="total, prev, pager, next"
                            :total="total1">
                    </el-pagination>
                </div>
                <div slot="right-header">
                    <div class="empty-slot"></div>
                </div>
                <div slot="right-list">
                    <el-table-column prop="tenantName" label="租户列表"></el-table-column>
                    <el-table-column prop="tenantCode" label="租户编码"></el-table-column>
                </div>
        </Transfer>
    </div>
</template>

<script>
import ListLayoutPaper from '@/components/lots/listLayout/Paper';
import Transfer from '@/components/lots/transfer/Index';
import utils from '@/utils/common';
import { getTenantGroupDetail, updateTenantGroupDetail, deleteGroupTenant } from '../api/LaseholderManageApi.js';

export default {
    name: 'laseholderGroupManager',
    components: { ListLayoutPaper, Transfer },
    data() {
        return {
            currentPage: 1,
            total: 0,
            pageSize: 10,
            account: '',
            userData: [],
            dialogVisible: false,
            nameFilter1: '',
            nameFilter2: '',
            userList: [],
            selections: [],
            userAddData: [],
            pageSize1: 10,
            currentPage1: 1,
            total1: 0
        };
    },
    props: {
        id: {
            type: String,
            default: ''
        }
    },
    methods: {
        load() {
            const params = { groupCode: this.id };
            if (this.account.length > 0) {
                params.queryParam = this.account;
            }
            params.joinFlag = 1;
            params.pageSize = this.pageSize;
            params.pageNo = this.currentPage;
            getTenantGroupDetail(params).then(res => {
                if (res.data) {
                    this.userData = res.data.list;
                    this.total = res.data.totalCount;
                }
            });
        },
        loadAdd() {
            const params = { groupCode: this.id };
            params.pageSize = this.pageSize1;
            params.pageNo = this.currentPage1;
            if (this.nameFilter1.length > 0) {
                params.queryParam = this.nameFilter1;
            }
            params.joinFlag = 2;
            getTenantGroupDetail(params).then(res => {
                if (res.data) {
                    this.userAddData = res.data.list;
                    this.total1 = res.data.totalCount;
                }
            });
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.load();
        },
        handleSizeChange(val) {
            this.pageSize = val;
            this.load();
        },
        closeAdd() {
            this.dialogVisible = false;
            this.nameFilter1 = '';
            this.nameFilter2 = '';
            this.userAddData = [];
            this.selections = [];
            this.currentPage1 = 1;
            this.total1 = 0;
        },
        handleCurrentChange1(val) {
            this.currentPage1 = val;
            this.loadAdd();
        },
        handleSizeChange1(val) {
            this.pageSize1 = val;
            this.loadAdd();
        },
        formatDate(timeString) {
            if (timeString != null && timeString !== undefined && timeString !== '') {
                return utils.formatDate(timeString);
            } else {
                return '';
            }
        },
        handleDelete(id) {
            deleteGroupTenant(id).then(res => {
                if (res.code === '0') {
                    this.$message.success('删除成功');
                    this.load();
                } else {
                    this.$message.error('删除失败');
                    this.load();
                }
            });
        },
        showVisi(id) {
            this.$confirm('此操作不可逆, 是否继续删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.handleDelete(id);
            }).catch(() => {
            });
        },
        handleSelectionChange(val) {
            this.selections = val;
        },
        handleAddUser(list) {
            const tenantCodes = list.map(item => item.tenantCode);
            const params = { groupCode: this.id, tenantCodes: tenantCodes };
            updateTenantGroupDetail(params).then(res => {
                if (res.code === '0') {
                    this.dialogVisible = false;
                    this.$message.success('保存成功');
                    this.load();
                } else {
                    this.dialogVisible = false;
                    this.$message.error('保存失败');
                    this.load();
                }
                this.currentPage1 = 1;
            });
        },
        delDialogSelect(row) {
            for (var i = 0; i < this.selections.length; i++) {
                if (this.selections[i].tenantCode === row.tenantCode) {
                    this.selections.splice(i, 1);
                    break;
                }
            }
            for (i = 0; i < this.userAddData.length; i++) {
                if (this.userAddData[i].tenantCode === row.tenantCode) {
                    this.$refs.table1.toggleRowSelection(this.userAddData[i]);
                    return;
                }
            }
        },
        handleBack() {
            this.$emit('goback');
        }
    },
    mounted() {
        this.load();
    }
};
</script>
