<template>
    <div class="flex-layout">
        <list-layout-paper class="laseholder-users">
            <div slot="header-search">
                <el-button size="mini" icon="el-icon-arrow-left" @click="handleBack">返 回</el-button>
                <el-input v-model="account" placeholder="账号" size="mini"></el-input>
                <el-select v-model="type" placeholder="类型" ref="select" clearable>
                    <el-option value="1" label="管理员"></el-option>
                    <el-option value="0" label="非管理员"></el-option>
                </el-select>
                <el-button type="primary" size="mini" @click="() => {load(1)}">查 询</el-button>
            </div>
            <div slot="header-button">
                <el-button size='mini' type="primary" @click="visiable=true">批量绑定</el-button>
                <el-button size='mini' type="primary" @click="dialogCreateUserVisible=true">同步并绑定</el-button>
            </div>
            <el-table slot="list" slot-scope="props" :height="props.tableHeight" border :data="userData" :header-cell-style="tableHeaderColor">
                <el-table-column prop="userName" label="用户名" width="130" show-overflow-tooltip></el-table-column>
                <el-table-column prop="userCode" label="用户账号" width="130" show-overflow-tooltip></el-table-column>
                <el-table-column prop="orgName" label="部门" show-overflow-tooltip></el-table-column>
                <el-table-column prop="positionName" label="岗位" width="180" show-overflow-tooltip></el-table-column>
                <el-table-column prop="userType" label="类型" width="100" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{getUserTypeName(scope.row.userType)}}
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间" width="100" show-overflow-tooltip>
                    <template slot-scope="scope">
                            {{formatDate(scope.row.createTime)}}
                    </template>
                </el-table-column>
                <el-table-column prop="enableFlag" label="账号状态" width="100" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <!-- <el-switch v-model="scope.row.tenantUserEnableFlag" active-text="启用" inactive-text="禁用" :active-value=1
                            :inactive-value=0 @change="handleTypeChange(scope.row)"></el-switch> 后端明悟没有时间，未提供接口，暂时屏蔽-->
                        {{scope.row.tenantUserEnableFlag === 1? '已启用':'已禁用'}}
                    </template>
                </el-table-column>
                <el-table-column prop="tenantAdminFlag" label="设为管理员" width="150" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.tenantAdminFlag" active-text="开启" inactive-text="禁用" :active-value=1
                            :inactive-value=0 @change="handleAdminChange(scope.row)"></el-switch>
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
        </list-layout-paper >
        <el-dialog title="添加用户" :visible.sync='visiable' width="840px" @open="() => {loadAddList(1)}">
            <list-layout>
                <div slot="header-search" class="wrapp-search">
                    <el-input v-model="userSearchKey" placeholder="账号搜索" size="mini"></el-input>
                    <Cascader @change="handleOrgNameChange" value="fullName" placeholder="请选择组织搜索" class="cascader"/>
                    <el-button type="primary" size="mini" @click="() => {loadAddList(1)}">查 询</el-button>
                </div>
                <el-table slot="list" border :data="userAddData" stripe @selection-change="handleSelectionChange" ref="table">
                    <el-table-column fixed="left" type="selection" width="55" show-overflow-tooltip></el-table-column>
                    <el-table-column fixed="left" prop="userName" label="用户名" width="130" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="userCode" label="账户" width="130" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="orgName" label="组织" width="400" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="positionName" label="岗位" width="180" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="userType" label="类型" width="100" show-overflow-tooltip>
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
                <el-pagination slot="footer"
                        class="text-right"
                        @size-change="handleSizeChange1"
                        @current-change="handleCurrentChange1"
                        :current-page="currentPage1"
                        size="small"
                        layout="total, prev, pager, next"
                        :total="total1">
                </el-pagination>
            </list-layout>
            <span slot='footer' class='dialog-buttons'>
                <el-button @click='visiable = false'>取 消</el-button>
                <el-button type='primary' @click="handleAddUser">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="新建账号"
                width="500px"
                :visible.sync="dialogCreateUserVisible"
                @close="dialogCreateUserVisible=false">
            <user-creater @closeCreateDialog="() => {
                    this.dialogCreateUserVisible = false;
                    this.load(1);
                }" :tenantCode="id" ref="creatUser"/>
        </el-dialog>
    </div>
</template>

<script>
import ListLayoutPaper from '@/components/lots/listLayout/Paper';
import ListLayout from '@/components/lots/listLayout/Index';
import utils from '@/utils/common';
import UserCreater from '../components/UserManage/UserCreater';
import Cascader from '../components/postManage/Cascader';
import { getTenantDetail, getUncheckedUserList, setTenantRolesList, updateUser } from '../api/LaseholderManageApi.js';

export default {
    name: 'laseholderUsers',
    components: { ListLayoutPaper, ListLayout, UserCreater, Cascader },
    data() {
        return {
            currentPage: 1,
            total: 0,
            pageSize: 10,
            account: '',
            type: '',
            userData: [],
            visiable: false,
            userSearchKey: '',
            userList: [],
            selections: [],
            userAddData: [],
            pageSize1: 10,
            currentPage1: 1,
            total1: 0,
            dialogCreateUserVisible: false,
            dialogOrgName: ''
        };
    },
    props: {
        id: {
            type: String,
            default: ''
        }
    },
    methods: {
        load(currentPage) {
            const params = {};
            if (this.account.length > 0) {
                params.queryParam = this.account;
            }
            if (this.type.length > 0) {
                params.tenantAdminFlag = this.type;
            }
            params.selectFlag = 1;
            params.pageSize = this.pageSize;
            params.pageNo = currentPage || this.currentPage;
            getTenantDetail(this.id, params).then(res => {
                if (res.data) {
                    this.userData = res.data.list;
                    this.total = res.data.totalCount;
                }
            });
        },
        loadAddList(currentPage1) {
            const params = {};
            params.pageSize = this.pageSize1;
            params.pageNo = currentPage1 || this.currentPage1;
            params.tenantCode = this.id;
            if (this.userSearchKey.length > 0) {
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
        tableHeaderColor({ row, column, rowIndex, columnIndex }) {
            if (rowIndex === 0) {
                return 'background-color: #f1f1f1';
            }
        },
        handleOrgNameChange(val) {
            this.dialogOrgName = val.slice(-1).join('');
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.load();
        },
        handleSizeChange(val) {
            this.pageSize = val;
            this.load();
        },
        handleCurrentChange1(val) {
            this.currentPage1 = val;
            this.loadAddList();
        },
        handleSizeChange1(val) {
            this.pageSize1 = val;
            this.loadAddList();
        },
        formatDate(timeString) {
            if (timeString != null && timeString !== undefined && timeString !== '') {
                return utils.formatDate(timeString);
            } else {
                return '';
            }
        },
        handleAdminChange(row) {
            const params = row.tenantAdminFlag;
            updateUser(row.tenantUserId, params).then(res => {
                this.load();
            });
        },
        handleTypeChange(row) {
            const params = row.tenantUserEnableFlag;
            updateUser(row.tenantUserId, params).then(res => {
                this.load();
            });
        },
        handleSelectionChange(val) {
            this.selections = val;
        },
        handleBack() {
            this.$emit('goback');
        },
        handleAddUser() {
            const userCodes = [];
            this.selections.forEach(item => {
                userCodes.push(item.userCode);
            });
            const params = { tenantCode: this.id, userCodes: userCodes };
            setTenantRolesList(this.id, params).then(res => {
                if (res.code === '0') {
                    this.visiable = false;
                    this.$message.success('保存成功');
                    this.load(1);
                } else {
                    this.visiable = false;
                    this.$message.error('保存失败');
                    this.load(1);
                }
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
        }
    },
    mounted() {
        this.load(1);
    }
};
</script>
<style lang="less">
.wrapp-search{
    .el-input{
        margin-right: 15px;
    }
    .cascader{
        .el-input{
            width: 340px;
        }
    }
}
</style>
