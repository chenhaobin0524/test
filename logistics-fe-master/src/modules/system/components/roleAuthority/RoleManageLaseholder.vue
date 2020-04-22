<template>
    <div class="flex-layout">
        <list-layout-paper>
            <div slot="header-search">
                <el-input v-model="nameFilter" placeholder="搜索用户名" size="mini" @keyup.enter.native="load"></el-input>
                <el-input v-model="apartMentFilter" placeholder="请选择部门" size="mini" @keyup.enter.native="load"></el-input>
                <el-select v-model="userStatusFilter" size="mini" @change="load" placeholder="请选账号状态" clearable>
                    <el-option  v-for="item in userStaus" :value="item.value" :key="item.value" :label="item.label"></el-option>
                </el-select>
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
                <el-table-column prop="userName" label="用户名" width="130"></el-table-column>
                <el-table-column prop="orgName" label="部门"></el-table-column>
                <el-table-column prop="mainPostName" label="岗位" width="180"></el-table-column>
                <el-table-column prop="userTypeName" label="用户类型" width="100"></el-table-column>
                <el-table-column prop="registerDate" label="创建时间" width="100">
                    <template slot-scope="scope">
                            {{formatDate(scope.row.registerDate)}}
                    </template>
                </el-table-column>
                <el-table-column prop="enableFlag" label="账号状态" align="center" width="100">
                    <template slot-scope="scope">
                        {{scope.row.tenantUser.enableFlag === 1? '已启用':'已禁用'}}
                    </template>
                </el-table-column>
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
        </list-layout-paper>
        <Transfer width="1000px"
                  titlename="新增"
                  :visible="dialogVisible"
                  :leftList="userData1"
                  @closeAdd="closeAdd"
                  @saveWhiteList="handleAuthority">
                <div slot="left-header">
                        <el-input v-model="nameFilter1" placeholder="搜索用户名" size="mini" @keyup.enter.native="loadAdd"></el-input>
                        <el-button type="primary" size="mini" @click="loadAdd" class="paddingleft">搜 索</el-button>
                </div>
                <div slot="left-list">
                    <el-table-column prop="userName" label="用户名" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="orgName" label="部门" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="mainPostName" label="岗位" show-overflow-tooltip></el-table-column>
                </div>
                <div slot="left-footer">
                    <el-pagination slot="footer"
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
                    <el-table-column prop="userName" label="用户名" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="orgName" label="部门" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="mainPostName" label="岗位" show-overflow-tooltip></el-table-column>
                </div>
        </Transfer>
    </div>
</template>
<script>
import ListLayoutPaper from '@/components/lots/listLayout/Paper';
import Transfer from '@/components/lots/transfer/Index';
import utils from '@/utils/common';
import { getUserByRoleList, saveUserRoles } from '../../api/AcountManageApi.js';
import { deleteUser } from '../../api/LaseholderManageApi.js';
export default {
    components: { Transfer, ListLayoutPaper },
    data() {
        return {
            currentPage: 1,
            total: 0,
            nameFilter: '',
            apartMentFilter: '',
            userStatusFilter: '',
            userData: [],
            loading: false,
            pageSize: 10,
            selections: [],
            currentPage1: 1,
            total1: 0,
            nameFilter1: '',
            userData1: [],
            pageSize1: 10,
            nameFilter2: '',
            dialogVisible: false,
            userStaus: [{ label: '已禁用', value: 0 }, { label: '已启用', value: 1 }],
            apartMent: [{ label: '已禁用', value: 0 }, { label: '已启用', value: 1 }]
        };
    },
    props: {
        user: Object
    },
    methods: {
        load() {
            if (!this.user) return;
            const parm = {
                pageNo: this.currentPage,
                pageSize: this.pageSize,
                roleCode: this.user.roleCode,
                authFlag: 1
            };
            if (this.nameFilter.length > 0) {
                parm.queryParam = this.nameFilter;
            }
            if (this.apartMentFilter.length) {
                parm.orgName = this.apartMentFilter;
            }
            if (this.userStatusFilter === 0 || this.userStatusFilter === 1) {
                parm.enableFlag = this.userStatusFilter;
            }
            getUserByRoleList(parm).then(res => {
                this.userData = res.data.pageResponse.list;
                this.total = res.data.pageResponse.totalCount;
            });
        },
        loadAdd() {
            const parm = {
                pageNo: this.currentPage1,
                pageSize: this.pageSize1,
                roleCode: this.user.roleCode,
                authFlag: 2
            };
            if (this.nameFilter1.length > 0) {
                parm.queryParam = this.nameFilter1;
            }
            getUserByRoleList(parm).then(res => {
                this.userData1 = res.data.pageResponse.list;
                this.total1 = res.data.pageResponse.totalCount;
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
        handleSizeChange(val) {
            this.pageSize = val;
            this.load();
        },
        handleSizeChange1(val) {
            this.pageSize1 = val;
            this.loadAdd();
        },
        handleAuthority(list) {
            this.dialogVisible = false;
            const userCodes = list.map(item => item.userCode);
            const roleCodes = [this.user.roleCode];
            const params = { userCodes, roleCodes };
            saveUserRoles(params).then(res => {
                if (res.code === '0') {
                    this.$message({ type: 'success', message: '保存成功!' });
                    this.closeAdd();
                } else {
                    this.$message({ type: 'error', message: '保存失败!' });
                }
                this.load();
                this.currentPage1 = 1;
            });
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.load();
        },
        handleCurrentChange1(val) {
            this.currentPage1 = val;
            this.loadAdd();
        },
        handleSelectionChange(val) {
            this.selections = val;
        },
        formatDate(timeString) {
            if (timeString != null && timeString !== undefined && timeString !== '') {
                return utils.formatDate(timeString);
            } else {
                return '';
            }
        },
        handleDelete(row) {
            deleteUser(row.userRoleId).then(res => {
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
<style lang="less">
.role-manage-laseholder-dialog {
    .blank {
        display: block;
        line-height: 28px;
    }
}
</style>