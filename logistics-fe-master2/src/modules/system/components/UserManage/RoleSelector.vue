<template>
    <div class="role-selector">
        <el-row class="role-selector-row">
            <el-col :span="8" class="role-selector-row-col">
                <el-input
                    class="select-input"
                    placeholder="搜索数据项"
                    size="mini"
                    prefix-icon="el-icon-search"
                    v-model="selectLeftValue"
                    @keyup.enter.native="getSystems">
                </el-input>
                <div class="system-list" v-loading="leftLoading">
                    <el-menu :class="{'system-menu': true, 'system-menu-page': !isDialog}"
                        default-active="0">
                        <el-menu-item class="system-menu-item" v-for="(item, index) in systems"
                            :index="index + ''" :key="item.id"
                            @click="() => handleLeftClick(index)"
                            >{{item.dataName}}</el-menu-item>
                    </el-menu>
                </div>
            </el-col>
            <el-col :span="16" class="role-selector-row-col">
                <div class="auth-selector">
                    <div class="auth-search">
                        <div>
                            <el-input v-model="roleName"
                                        @keyup.enter.native="() => {
                                            currentPage = 1;
                                            getRoles();
                                        }"
                                        size="mini"
                                        placeholder="请输入内容"
                                        clearable
                                        class="auth-search-input">
                            </el-input>
                            <el-checkbox v-model="hasChecked" @change="handleChangeHasAuth">已有权限</el-checkbox>
                        </div>
                        <el-checkbox v-model="checkedAll" style="color: red;">分配所有数据权限</el-checkbox>
                    </div>
                    <div :class="{'auth-list': true, 'auth-list-page': !isDialog}" v-loading="rightLoading">
                        <!-- <el-checkbox-group v-model="checkedRoles" @change="handleCheckedRolesChange">
                            <el-checkbox class="auth-checkbox" v-for="item in roles"
                                :key="item.roleCode"
                                :label="item.roleCode">{{item.roleName}}</el-checkbox>
                        </el-checkbox-group> -->
                        <el-checkbox class="auth-checkbox" v-for="item in roles"
                            :key="item.authCode"
                            v-model="item.selectedFlag"
                            @change="handleChangecheckbox"
                            :label="item.authCode">
                            {{item.authName}}
                        </el-checkbox>
                    </div>
                    <div class="auth-footer">
                        <el-checkbox v-model="checkAll" @change="handleCheckAllChange" class="check-all">全选</el-checkbox>
                        <el-pagination
                            class="pull-right"
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page.sync="currentPage"
                            :page-sizes="[20, 30, 50, 100]"
                            layout='total, sizes, prev, pager, next, jumper'
                            :total="total">
                        </el-pagination>
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import { getDataTypeList, saveUserRoles, saveDataAuths, getDataAuth } from '../../api/AcountManageApi.js';
export default {
    name: 'RoleSelector',
    props: ['userData', 'type'],
    data() {
        return {
            isDialog: true,
            systems: [],
            checkAll: false,
            roles: [],
            checkedRoles: [],
            show: true,
            activeIndex: null,
            roleName: '',
            currentSystems: '',
            selectLeftValue: '',
            hasChecked: false,
            checkedAll: false,
            currentPage: 1,
            total: 0,
            pageSize: 20,
            leftLoading: false,
            rightLoading: false
        };
    },
    mounted() {
        if (this.type === 'page') {
            this.isDialog = false;
        };
        this.getSystems();
        // this.getUserRoles();
    },
    methods: {
        getSystems() {
            this.leftLoading = true;
            getDataTypeList({
                dataName: this.selectLeftValue ? this.selectLeftValue : null,
                enableFlag: 1
            }).then(res => {
                if (res && res.data && res.data.list) {
                    this.systems = res.data.list;
                }
                this.leftLoading = false;
                this.currentSystems = 0;
                if (this.systems.length) {
                    this.getRoles();
                }
            });
        },
        getRoles() {
            this.rightLoading = true;
            this.activeIndex = this.systems[this.currentSystems].dataCode;
            const params = {
                dataCode: this.activeIndex,
                userCode: this.userData.userCode,
                pageSize: this.pageSize,
                pageNo: this.currentPage,
                search: this.roleName ? this.roleName : null,
                selectedFlag: this.hasChecked ? 1 : null
            };
            getDataAuth(params).then(res => {
                if (res && res.data && +res.code === 0) {
                    this.roles = res.data.userDataAuthDtos.list.map(item => {
                        item.selectedFlag = !!item.selectedFlag;
                        return item;
                    });
                    this.total = res.data.userDataAuthDtos.totalCount;
                    this.checkedAll = !!res.data.allFlag;
                    this.$nextTick(() => {
                        if (res.data.userDataAuthDtos.list.length) {
                            this.checkAll = res.data.userDataAuthDtos.list.every(item => {
                                return item.selectedFlag;
                            });
                        } else {
                            this.checkAll = false;
                        }
                    });
                }
                this.rightLoading = false;
            });
        },
        handleChangeHasAuth() {
            this.currentPage = 1;
            if (this.roles.length) {
                this.getRoles();
            }
        },
        handleSizeChange(val) {
            this.pageSize = val;
            this.getRoles();
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.getRoles();
        },
        handleLeftClick(index) {
            this.currentSystems = index;
            this.getRoles();
        },
        cancle() {
            this.checkedRoles = [];
        },
        _saveDataAuths() {
            const tempArr = JSON.parse(JSON.stringify(this.roles));
            saveDataAuths({
                data: tempArr.map(item => {
                    item.selectedFlag = +item.selectedFlag;
                    return item;
                }),
                allFlag: this.checkedAll ? 1 : 0,
                dataCode: this.activeIndex,
                userCode: this.userData.userCode
            }).then(res => {
                if (res && +res.code === 0) {
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
        saveRolesSetting() {
            const userCodes = this.userData ? [this.userData.userCode] : null;
            const data = {
                userCodes: userCodes,
                roleCodes: this.checkedRoles,
                applicationCode: this.activeIndex
            };
            saveUserRoles(data).then(res => {
                if (res && res.code === '0') {
                    this.$message({
                        type: 'success',
                        message: '保存成功'
                    });
                    this.cancle();
                } else {
                    this.$message({
                        type: 'error',
                        message: '保存失败'
                    });
                }
            });
        },
        handleCheckAllChange(isCheckedAll) {
            this.roles = this.roles.map(item => {
                item.selectedFlag = !!isCheckedAll;
                return item;
            });
        },
        handleCheckedRolesChange(value) {
            const checkedCount = value.length;
            this.checkAll = checkedCount === this.roles.length;
        },
        handleChangecheckbox(val) {
            this.checkAll = this.roles.every(item => {
                return item.selectedFlag;
            });
        }
    },
    watch: {
        roles(newValue) {
            const checkedCount = this.checkedRoles.length;
            if (checkedCount.length && this.roles.length) {
                this.checkAll = checkedCount === newValue.length;
            }
        }
    }
};
</script>
<style lang="less">
.role-selector {
    height: 100%;
    &-row{
        height: 100%;
        &-col{
            display: flex;
            flex-direction: column;
            height: 100%;
            .select-input{
                box-sizing: border-box;
                padding-right: 15px;
                margin-bottom: 10px;
            }
            .system-list {
                flex: 1;
                .system-menu {
                    padding-right: 15px;
                    border-right: 0;
                    overflow-y: auto;
                }
                .system-menu-item {
                    width: auto;
                    height: 40px;
                    line-height: 40px;
                }
            }
        }
    }

    .auth-selector {
        padding: 0 0 0 15px;
        border-left: 1px solid #e6e6e6;
        height: 100%;
        display: flex;
        flex-direction: column;
    }
    .auth-search{
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
        &-input{
            width: 360px;
            margin-right: 10px;
        }
    }
    .auth-list {
        flex: 1;
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
        justify-content: space-between;
        .check-all {
            padding: 0 10px;
            line-height: 40px;
        }
        .pull-right {
            line-height: 40px;
            .el-button {
                margin-left: 15px;
            }
        }
    }

}
</style>