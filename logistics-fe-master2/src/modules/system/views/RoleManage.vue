<template>
    <div class="flex-layout role-manage">
        <list-layout-paper v-if="status === 'index'">
            <div slot="header-search">
                <el-select v-model="systemFilter" size="mini" @change="() => {load()}" placeholder="请选择应用模块" clearable>
                    <el-option  v-for="item in systemModuleList" :value="item.applicationCode" :key="item.applicationCode" :label="item.applicationName"></el-option>
                </el-select>
                <el-select v-model="roleType" size="mini" placeholder="请选择角色类型">
                    <el-option  v-for="item in typeData" :value="item.value" :label="item.label" :key="item.value"></el-option>
                </el-select>
                <el-input v-model="nameFilter" placeholder="搜索角色名" size="mini" @keyup.enter.native="() => {load()}"></el-input>
                <el-button type="primary" size="mini" @click="() => {load()}">搜 索</el-button>
            </div>
            <div slot="header-button">
                <el-button type="primary" size="mini" @click="handleAdd" icon="el-icon-plus"></el-button>
            </div>
            <el-table slot="list" slot-scope="props" :height="props.tableHeight" v-loading="loading" :data="userData" class="list-table" border stripe>
                <el-table-column prop="roleName" label="角色名" :show-overflow-tooltip="true" width="180"></el-table-column>
                <el-table-column prop="roleCode" label="编码" width="150"></el-table-column>
                <el-table-column prop="detail" :show-overflow-tooltip="true" label="描述" width="200"></el-table-column>
                <el-table-column prop="applicationNames" label="所属系统" :show-overflow-tooltip="true" width="300"></el-table-column>
                <el-table-column prop="roleTypeName" label="角色类型" width="100"></el-table-column>
                <el-table-column prop="sourceTenantName" label="来源租户" width="100"></el-table-column>
                <el-table-column prop="enableFlag" label="角色状态" width="80">
                    <template slot-scope="scope">
                        {{scope.row.enableFlag === 1? '正常':'禁用'}}
                    </template>
                </el-table-column>
                <el-table-column label="创建时间" width="150">
                    <template slot-scope="scope">
                            {{scope.row.createTime || '--'}}
                    </template>
                </el-table-column>
                <el-table-column label="修改时间" width="150">
                    <template slot-scope="scope">
                            {{scope.row.updateTime || '--'}}
                    </template>
                </el-table-column>
                <el-table-column prop="updateUserCode" label="修改人" width="100"></el-table-column>
                <el-table-column prop="action" label="操作" width="100" fixed="right">
                    <template slot-scope="scope">
                        <el-button size="mini" type="text" @click="handleAuthority(scope.$index, scope.row)">权限</el-button>
                        <el-button size="mini" type="text" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
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
        <RoleManageAuthority v-if="status === 'auth'" :role="role" @goback="status = 'index'"/>
        <RoleManagerEdit v-if="dialogVisible" :dialogVisible.sync="dialogVisible" :user="selectUser" :systemModuleList="systemModuleList" @close="closeDialog"></RoleManagerEdit>
        <RoleManagerAdd v-if="editViewVisible" :dialogVisible.sync="editViewVisible" :user="selectUser"
            :systemModuleList="systemModuleList" @close="closeDialog" @submitUser="editData"></RoleManagerAdd>
    </div>
</template>
<script>
import ListLayoutPaper from '@/components/lots/listLayout/Paper';
import RoleManagerEdit from '../components/roleAuthority/RoleManagerEdit';
import RoleManagerAdd from '../components/roleAuthority/RoleManagerAdd';
import utils from '@/utils/common';
import { switchRoleChange, getRoleList, getAllResourceList } from '../api/RolesApi.js';
import RoleManageAuthority from './RoleManageAuthority';
export default {
    name: 'role',
    components: { ListLayoutPaper, RoleManagerEdit, RoleManagerAdd, RoleManageAuthority },
    data() {
        return {
            roleType: '',
            status: 'index',
            userName: '',
            userCode: '',
            selectUser: {
                roleName: '',
                roleCode: '',
                applicationCode: ''
            },
            currentPage: 1,
            total: 0,
            dialogVisible: false,
            editViewVisible: false,
            nameFilter: '',
            systemFilter: '',
            systemModuleList: [],
            userData: [],
            loading: false,
            pageSize: 10,
            role: {},
            typeData: [
                { label: '普通角色', value: 2 },
                { label: '跨租户角色', value: 3 },
                { label: '父租户角色', value: 4 }
            ]
        };
    },
    methods: {
        load(currentPage = 1) {
            this.loading = true;
            const parm = {
                pageNo: currentPage,
                pageSize: this.pageSize
            };
            if (this.nameFilter.length > 0) {
                parm.roleName = this.nameFilter;
            }
            if (this.systemFilter.length > 0) {
                parm.applicationCode = this.systemFilter;
            }
            if (this.roleType) {
                parm.roleType = this.roleType;
            }
            getRoleList(parm).then(res => {
                if (res.data) {
                    this.loading = false;
                    this.userData = res.data.roleDtoPages.list;
                    this.total = res.data.roleDtoPages.totalCount;
                }
            });
        },
        handleSizeChange(val) {
            this.pageSize = val;
            this.load();
        },
        handleAdd() {
            this.selectUser = null;
            this.editViewVisible = true;
        },
        handleAuthority(index, row) {
            this.status = 'auth';
            this.role = row;
        },
        handleEdit(index, row) {
            this.selectUser = row;
            this.editViewVisible = true;
        },
        handleSwichChange(enableFlag, row) {
            const data = {
                enableFlag: row.enableFlag,
                id: row.id,
                version: row.version
            };
            switchRoleChange(row.id, data).then(res => {
                this.load();
            });
        },
        closeDialog() {
            this.dialogVisible = false;
            this.editViewVisible = false;
            this.load();
        },
        editData(user) {
            this.load();
        },
        loadAplications() {
            getAllResourceList().then(res => {
                this.systemModuleList = res.data.list;
            });
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.load(val);
        },
        formatDate(timeString) {
            if (timeString != null && timeString !== undefined && timeString !== '') {
                return utils.formatDate(timeString);
            } else {
                return '';
            }
        }
    },
    mounted() {
        this.load();
        this.loadAplications();
    }
};
</script>
<style>
.role-manage {
    overflow: hidden;
}
</style>