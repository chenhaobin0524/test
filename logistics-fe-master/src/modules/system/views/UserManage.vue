<template>
    <div class="flex-layout user-manage">
        <list-layout-paper v-if="showList">
            <div slot="header-search">
                <el-input v-model="queryOptions.orgName" placeholder="请输入部门" size="mini"/>
                <el-select v-model="queryOptions.tenantUserEnableFlag" placeholder="选择账号状态" size="mini"
                    @change="() => {
                        queryOptions.pageNo = 1;
                        getUsers();
                    }">
                    <el-option v-for="item in statusList"
                        :key="item.value"
                        :label="item.name"
                        :value="item.value">{{item.name}}</el-option>
                </el-select>
                <el-input v-model="queryOptions.queryParam"
                        placeholder="请输入账户名称搜索"
                        size="mini"
                        @keyup.enter.native="() => {
                            queryOptions.pageNo = 1;
                            getUsers();
                        }"/>
                <el-button size="mini" type="primary" @click="() => {
                            queryOptions.pageNo = 1;
                            getUsers();
                        }">查询</el-button>
            </div>
            <div slot="header-button">
                <el-button size="mini" type="primary" @click="visiable=true">批量绑定</el-button>
                <el-button size="mini" type="primary" @click="dialogCreateUserVisible=true">同步并绑定</el-button>
            </div>
            <div slot="list" slot-scope="props">
                <el-table ref="tb"
                        stripe
                        :data="userData"
                        border
                        :height="props.tableHeight"
                        v-loading="tbLoading">
                    <el-table-column prop="userName" label="用户名" width="130">
                    </el-table-column>
                    <el-table-column prop="userCode" label="用户账号" width="130">
                    </el-table-column>
                    <el-table-column prop="orgName" label="部门" :show-overflow-tooltip="true">
                    </el-table-column>
                    <el-table-column prop="mainPostName" label="岗位" width="180" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="userTypeName" label="用户类型" width="100">
                    </el-table-column>.
                    <el-table-column label="创建时间" width="100">
                        <template slot-scope="scope">
                                {{formatDate(scope.row.createTime)}}
                        </template>
                    </el-table-column>
                    <el-table-column label="设置为管理员" width="120" fixed="right">
                        <template slot-scope="scope">
                            <el-switch  v-if="currentTenant.tenantAdminFlag"
                                        :value="scope.row.tenantAdminFlag"
                                        active-text="是"
                                        inactive-text="否"
                                        :active-value="1"
                                        :inactive-value="0"
                                        @change="() => switchEnable(scope.$index, scope.row)">
                            </el-switch>
                            <span v-else>{{scope.row.tenantAdminFlag ? '是' : '否'}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="账户状态" width="150" fixed="right">
                        <template slot-scope="scope">
                            <el-switch  v-if="currentTenant.tenantAdminFlag"
                                        :value="scope.row.tenantUserEnableFlag"
                                        active-text="启用"
                                        inactive-text="禁用"
                                        :active-value="1"
                                        :inactive-value="0"
                                        @change="() => switchAccount(scope.$index, scope.row)">
                            </el-switch>
                            <span v-else>{{scope.row.tenantUserEnableFlag ? '启用' : '禁用'}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="90" fixed="right">
                        <template slot-scope="scope">
                            <el-button class="btn" type="text" size="mini" @click="editAuthority(scope.$index, scope.row)">权限</el-button>
                            <el-button type="text" size="mini" @click="showUser(scope.$index)">详情</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <el-pagination
                slot="footer"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="currentPage"
                :page-sizes="[10, 20, 30, 50, 100]"
                :page-size="10"
                layout='total, sizes, prev, pager, next, jumper'
                :total="total">
            </el-pagination>
        </list-layout-paper>
        <user-authority v-else
                        :curUserData="curUserData"
                        @showlist="showlist">
        </user-authority>
        <el-dialog title="新建账号" width="500px" :visible.sync="dialogCreateUserVisible" @close="closeCreateUserDialog">
            <user-creater @closeCreateDialog="closeCreateUserDialog" ref="creatUser"/>
        </el-dialog>
        <el-dialog width="500px" class="user-info-dialog"
                    :visible.sync="dialogUserVisible"
                    @close="() => {
                        this.$refs.userInfo.activeName = 'userInfo';
                    }">
            <user-info :userData="curUserData" ref="userInfo"/>
        </el-dialog>
        <el-dialog title="批量添加用户" :visible.sync='visiable' width="900px" @open="loadAddList">
            <list-layout>
                <div slot="header-search" class="wrapp-search">
                    <el-input v-model="userSearchKey" placeholder="账号搜索" size="mini"></el-input>
                    <Cascader @change="handleOrgNameChange" value="fullName" placeholder="请选择组织搜索"/>
                    <el-button type="primary" size="mini" @click="loadAddList">查 询</el-button>
                </div>
                 <el-table slot="list" border :data="userAddData" stripe @selection-change="handleSelectionChange" ref="table">
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column prop="userName" label="用户名" width="130" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="userCode" label="账户" width="130" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="orgName" label="组织" width="400" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="positionName" label="岗位" width="180" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="userType" label="用户类型" width="100" show-overflow-tooltip>
                        <template slot-scope="scope">
                                {{getUserTypeName(scope.row.userType)}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="registerDate" label="创建时间" width="100" show-overflow-tooltip>
                        <template slot-scope="scope">
                                {{formatDate(scope.row.registerDate)}}
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                        slot="footer"
                        @size-change="handleSizeChange1"
                        @current-change="handleCurrentChange1"
                        :current-page="currentPage1"
                        size="small"
                        layout="total, prev, pager, next"
                        :total="total1">
                </el-pagination>
            </list-layout>
            <span slot='footer' class='text-right'>
                <el-button @click='visiable = false'>取 消</el-button>
                <el-button type='primary' @click="handleAddUser">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import ListLayoutPaper from '@/components/lots/listLayout/Paper';
import Cascader from '../components/postManage/Cascader';
import ListLayout from '@/components/lots/listLayout/Index';
import utils from '@/utils/common';
import UserCreater from '../components/UserManage/UserCreater';
import UserInfo from '../components/UserManage/UserInfo';
import UserAuthority from './UserAuthority';
import { exportUserList, setAdmin, switchAccountType } from '../api/AcountManageApi.js';
import { getUncheckedUserList, setTenantRolesList, getTenantDetail } from '../api/LaseholderManageApi.js';
import { mapGetters } from 'vuex';

export default {
    name: 'account',
    components: { ListLayoutPaper, ListLayout, UserCreater, UserInfo, UserAuthority, Cascader },
    data() {
        return {
            showList: true,
            currentPage: 1,
            total: 0,
            pageSize: 10,
            dialogCreateUserVisible: false,
            dialogUserVisible: false,
            userName: '',
            queryOptions: {
                tenantUserEnableFlag: 2,
                orgName: null,
                queryParam: null,
                pageNo: 1,
                pageSize: 10
            },
            curUserData: {},
            statusList: [
                {
                    name: '全部',
                    value: 2
                },
                {
                    name: '启用',
                    value: 1
                },
                {
                    name: '禁用',
                    value: 0
                }
            ],
            userData: [],
            hasSelectRight: [],
            hasSelectLeft: '',
            tbLoading: false,
            visiable: false,
            userSearchKey: '',
            userAddData: [],
            selections: [],
            pageSize1: 10,
            currentPage1: 1,
            total1: 0,
            dialogOrgName: ''
        };
    },
    mounted() {
        this.getUsers();
    },
    methods: {
        _switchAccountType(row) {
            switchAccountType(row).then(res => {
                if (res && +res.code === 0) {
                    const msg = row.tenantUserEnableFlag === 0 ? '启用成功' : '停用成功';
                    this.$message.success(msg);
                }
                this.getUsers();
            });
        },
        _setAdmin(row) {
            setAdmin(row).then(res => {
                if (res && +res.code === 0) {
                    const msg = row.tenantAdminFlag === 0 ? '启用成功' : '停用成功';
                    this.$message.success(msg);
                }
                this.getUsers();
            });
        },
        handleSizeChange1(val) {
            this.pageSize1 = val;
            this.loadAddList();
        },
        handleCurrentChange1(val) {
            this.currentPage1 = val;
            this.loadAddList();
        },
        showlist() {
            this.showList = true;
            this.getUsers();
        },
        handleSelectionChange(val) {
            this.selections = val;
        },
        handleOrgNameChange(val) {
            this.dialogOrgName = val.slice(-1).join('');
        },
        loadAddList() {
            const params = {};
            params.pageSize = this.pageSize1;
            params.pageNo = this.currentPage1;
            if (this.userSearchKey.length) {
                params.userCode = this.userSearchKey;
            }
            if (this.dialogOrgName) {
                params.orgName = this.dialogOrgName;
            }
            getUncheckedUserList(params).then(res => {
                if (res.data) {
                    this.userAddData = res.data.list;
                    this.total1 = res.data.totalCount;
                }
            });
        },
        handleSizeChange(val) {
            this.pageSize = val;
            this.queryOptions.pageSize = this.pageSize;
            this.getUsers();
        },
        getUsers() {
            const temp = Object.assign({}, this.queryOptions);
            if (temp.tenantUserEnableFlag === 2) {
                temp.tenantUserEnableFlag = null;
            }
            this.tbLoading = true;
            getTenantDetail('', temp).then(res => {
                if (res && +res.code === 0 && res.data) {
                    this.userData = res.data.list;
                    this.total = res.data.totalCount;
                }
                this.tbLoading = false;
            });
        },
        getUserTypeName(val) {
            switch (val) {
            case 1:
                return '美的用户';
            case 2:
                return '司机';
            case 3:
                return '承运商';
            case 4:
                return '供应商';
            default:
                return '';
            }
        },
        handleAddUser(e) {
            const userCodes = [];
            this.selections.forEach(item => {
                userCodes.push(item.userCode);
            });
            const params = { tenantCode: this.id, userCodes: userCodes };
            setTenantRolesList(this.id, params).then(res => {
                if (res.code === '0') {
                    this.visiable = false;
                    this.$message.success('保存成功');
                    this.getUsers();
                } else {
                    this.visiable = false;
                    this.$message.error('保存失败');
                    this.getUsers();
                }
            });
        },
        exportUser() {
            exportUserList(this.queryOptions).then(res => {
                const blob = new Blob([res], { type: 'application/x-excel;charset=UTF-8' });
                const objectUrl = URL.createObjectURL(blob);
                // window.location.href = objectUrl;
                var a = document.createElement('a');
                a.href = objectUrl;
                a.download = '用户列表.xlsx';
                a.click();
            });
        },
        showUser(index) {
            this.dialogUserVisible = true;
            this.curUserData = this.userData[index];
        },
        editAuthority(index, row) {
            this.curUserData = this.userData[index];
            this.showList = false;
        },
        switchEnable (index, row) {
            const { tenantAdminFlag } = row;
            if (+tenantAdminFlag === 0) {
                this.$confirm('设置该用户为管理员, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消'
                }).then(() => {
                    this._setAdmin(row);
                });
            }
            if (+tenantAdminFlag === 1) {
                this._setAdmin(row);
            }
        },
        switchAccount (index, row) {
            const { tenantUserEnableFlag } = row;
            if (+tenantUserEnableFlag === 0) {
                this.$confirm('设置该用户状态为启用, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消'
                }).then(() => {
                    this._switchAccountType(row);
                });
            }
            if (+tenantUserEnableFlag === 1) {
                this.$confirm('设置该用户状态为禁用, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消'
                }).then(() => {
                    this._switchAccountType(row);
                });
            }
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.queryOptions.pageNo = this.currentPage;
            this.getUsers();
        },
        formatDate(data) {
            if (data != null && data !== undefined && data !== '') {
                return utils.formatDate(data);
            } else {
                return '';
            }
        },
        closeCreateUserDialog(data) {
            this.$refs.creatUser.$refs['userForm'].resetFields();
            this.$refs.creatUser.verifyData = false;
            this.$refs.creatUser.isAdd = true;
            this.dialogCreateUserVisible = false;
            if (data) {
                this.getUsers();
            }
        },
        organiChange(e) {}
    },
    computed: {
        ...mapGetters(['user', 'currentTenant'])
    }
};

</script>
<style lang="less">
.user-manage{
    overflow-y: auto;
    .user-info-dialog{
        .el-dialog__header {
            border-bottom: 0;
            padding: 0;
        }
        .el-dialog__headerbtn{
            z-index: 99;
        }
    }
    .wrapp-search{
        .el-input{
            margin-right: 15px;
        }
    }
}
</style>
