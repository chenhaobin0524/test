<template>
    <Paper class='app-manage-white-list'>
        <div class="topTab">
            <el-button class="back" icon="el-icon-arrow-left" size="mini" @click='goBack()'>返回</el-button>
            <div v-if="type==='whiteList'" class="title">授权</div>
            <div v-else class="title">黑名单</div>
        </div>
        <div class="main">
            <div class="tree">
                <el-tree
                    ref="tree"
                    :data="originResources"
                    v-loading="treeLoading"
                    node-key="id"
                    show-checkbox
                    check-strictly
                    default-expand-all
                    :props="defaultProps"
                    :expand-on-click-node="false"
                    :render-content="renderContent"
                    @check="handleCheckChange"
                ></el-tree>
            </div>
            <div class='my-table'>
                <list-layout>
                    <div slot="header-search">
                        <el-input class="my-input" v-model='tenantCode' placeholder='请输入编码'></el-input>
                        <el-button  type='primary' size="mini" @click='searchWhiteTenantList'>查询</el-button>
                    </div>
                    <div slot="header-button">
                        <el-button  type='primary' size="mini" @click='AddWhite()'>添加</el-button>
                    </div>
                    <el-table slot-scope="props"
                            :height="props.tableHeight"
                            slot="list"
                            stripe
                            v-loading="whiteLoading"
                            :data='whiteTenantList'>
                        <el-table-column v-if="type==='whiteList'" prop='tenantName' label='白名单租户名称' show-overflow-tooltip></el-table-column>
                        <el-table-column v-else prop='tenantName' label='黑名单租户名称' show-overflow-tooltip></el-table-column>
                        <el-table-column prop='tenantCode' label='租户编码' show-overflow-tooltip></el-table-column>
                        <el-table-column fixed='right' label='操作' width="80">
                            <template slot-scope='scope'>
                                <el-button @click='deleteWhiteList(scope.row)' type='text' size='mini'>删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div slot="footer">
                        <el-pagination
                            @size-change="handleSizeChange"
                            :current-page.sync='currentPage'
                            @current-change="handleCurrentChange"
                            :page-sizes="[10, 20, 30, 50, 100]"
                            :page-size='10'
                            layout='total, sizes, prev, pager, next, jumper'
                            :total='totalCount'
                        ></el-pagination>
                    </div>
                </list-layout>
            </div>
        </div>
        <Transfer width="1000px"
                  :titlename="titlename"
                  :visible="visible"
                  rowKey="tenantCode"
                  :leftList="tenantList"
                  :leftLoading="tenantLoading"
                  @closeAdd="closeAdd"
                  @saveWhiteList="saveWhiteList">
                <div slot="left-header">
                    <el-input class="my-input" v-model='tenantlistCode' placeholder='请输入编码'></el-input>
                    <el-select class="select" clearable v-model="roleCode" placeholder="请选择角色">
                        <el-option
                            v-for="item in options"
                            :key="item.roleCode"
                            :label="item.roleName"
                            :value="item.roleCode">
                        </el-option>
                    </el-select>
                    <el-button  type='primary' size="mini" @click='goSearchTenantList()'>查询</el-button>
                </div>
                <div slot="left-list">
                    <el-table-column prop='tenantName' label='租户列表' show-overflow-tooltip></el-table-column>
                    <el-table-column prop='tenantCode' label='租户编码' show-overflow-tooltip></el-table-column>
                </div>
                <div slot="left-footer">
                    <el-pagination
                        @size-change="tenantHandleSizeChange"
                        :current-page.sync='tenantCurrentPage'
                        @current-change="tenantHandleCurrentChange"
                        :page-sizes="[10, 20, 30, 50, 100]"
                        :page-size='10'
                        size="small"
                        layout='total, prev, pager, next'
                        :total='tenantListTotalCount'
                    ></el-pagination>
                </div>
                <div slot="right-header">
                    <div class="empty-slot"></div>
                    <!-- <el-input disabled class="my-input" v-model='activeCodeName' placeholder='请输入编码'></el-input>
                    <el-button  disabled type='primary' size="mini" @click='goBack()'>查询</el-button> -->
                </div>
                <div slot="right-list">
                    <el-table-column prop='tenantName' label='已选租户列表' show-overflow-tooltip></el-table-column>
                    <el-table-column prop='tenantCode' label='租户编码' show-overflow-tooltip></el-table-column>
                </div>
        </Transfer>
    </Paper>
</template>
<script>
import listLayout from '@/components/lots/listLayout/Index';
import Transfer from '@/components/lots/transfer/Index';
import Paper from '@/components/core/paper/Paper';
import appManageAPI from '../api/AppManageAPI';
import resource from '../api/ResourceAPI';
import { mapGetters } from 'vuex';

export default {
    components: { Paper, listLayout, Transfer },
    name: 'AppManageWhiteList',
    data() {
        return {
            tempList: [],
            RightCurrentPage: 1,
            RightPageSize: 10,
            oldSelection: [],
            treeLoading: false,
            whiteLoading: false,
            tenantLoading: false,
            searchvalue: '',
            optionsValue: '',
            originResources: [],
            tenantList: [],
            roleCode: '',
            whiteTenantList: [],
            selectTenantList: [],
            selectTenantListLength: 0,
            resourceCode: '',
            titlename: '',
            visible: false,
            activeCode: { },
            activeCodeName: '',
            tenantCode: '',
            tenantlistCode: '',
            activeName: 'tenant',
            currentPage: 1,
            tenantCurrentPage: 1,
            selectTenantCurrentPage: 1,
            totalCount: 0,
            tenantListTotalCount: 0,
            selectTenantListTotalCount: 0,
            pageSize: 10,
            tenantPageSize: 10,
            selectTenantPageSize: 10,
            data: [],
            id: 100,
            modify: false,
            options: [],
            resources: [],
            defaultProps: {
                children: 'subResources',
                label: 'resourceName'
            },
            rules: {
                resourceName: [
                    {
                        required: true,
                        message: '请输入父级名称',
                        trigger: 'blur'
                    }
                ]
            },
            dialogAuthVisible: false
        };
    },
    props: {
        appCode: {
            type: String,
            default: ''
        },
        type: {
            type: String,
            default: 'whiteList'
        }
    },
    methods: {
        rightHandleSizeChange(val) {
            this.RightPageSize = val;
        },
        rightHandleCurrentChange(val) {
            this.RightCurrentPage = val;
        },
        saveWhiteList(list) {
            let blacklistFlag = 0;
            if (this.type === 'blackList') {
                blacklistFlag = 1;
            }
            const data = {};
            data.blacklistFlag = blacklistFlag;
            data.applicationCode = this.appCode;
            data.resourceCode = this.resourceCode;
            const tenantCodes = list.map(item => {
                return item.tenantCode;
            });
            data.tenantCodes = tenantCodes;
            appManageAPI.addWhiteList(data).then(res => {
                this.closeAdd();
                this.searchWhiteTenantList();
                if (res.code === '0') {
                    this.$message({
                        type: 'success',
                        message: '添加成功'
                    });
                } else {
                    this.$message({
                        type: 'error',
                        message: '添加失败'
                    });
                }
            });
        },
        delSelect(row) {
            for (let i = 0; i < this.tenantList.length; i++) {
                if (this.tenantList[i].tenantCode === row.tenantCode) {
                    this.$refs.multipleTable.toggleRowSelection(this.tenantList[i]);
                    return;
                }
            }
            this.$refs.multipleTable.toggleRowSelection(row, false);
        },
        selectionChange(selection) {
            this.tempList = selection;
        },
        goSearchTenantList() {
            this.getTennatList();
        },
        deleteWhiteList(row) {
            var blacklistFlag = 0;
            if (this.type === 'blackList') {
                blacklistFlag = 1;
            }
            appManageAPI.deleteWhiteList(this.appCode, this.resourceCode, row.tenantCode, blacklistFlag).then(res => {
                this.searchWhiteTenantList();
                if (res.code === '0') {
                    this.$message({
                        type: 'success',
                        message: '删除成功'
                    });
                } else {
                    this.$message({
                        type: 'error',
                        message: '删除失败'
                    });
                }
            });
        },
        searchWhiteTenantList() {
            if (this.resourceCode === '') {
                this.$message({
                    message: '请先选择一个资源项'
                });
                return;
            }
            this.whiteLoading = true;
            var blacklistFlag = 0;
            if (this.type === 'blackList') {
                blacklistFlag = 1;
            }
            appManageAPI.getWhiteList(this.pageSize, this.currentPage, this.appCode, this.resourceCode, this.tenantCode, blacklistFlag).then(res => {
                this.whiteLoading = false;
                if (res.code === '0' && res.data && res.data.list) {
                    this.whiteTenantList = res.data.list;
                    this.totalCount = res.data.totalCount;
                }
            });
        },
        getTennatList() {
            this.tenantLoading = true;
            appManageAPI.tenantsBySourceTenant(this.tenantPageSize, this.tenantCurrentPage, this.tenantlistCode, this.roleCode, this.appCode).then(res => {
                this.tenantLoading = false;
                if (res.code === '0' && res.data && res.data.list) {
                    this.tenantList = [];
                    this.tenantList = res.data.list;
                    this.tenantListTotalCount = res.data.totalCount;
                    for (var i = 0; i < this.tenantList.lengt; i++) {
                        this.tenantList[i].checked = false;
                    }
                }
            });
        },
        handleSizeChange(val) {
            this.pageSize = val;
            this.load();
        },
        tenantHandleSizeChange(val) {
            this.tenantPageSize = val;
            this.getTennatList();
        },
        selectHandleSizeChange(val) {
            this.selectTenantPageSize = val;
            this.load();
        },
        handleCheckChange(data, checked, indeterminate) {
            this.$refs.tree.setCheckedKeys([data.id]);
            var blacklistFlag = 0;
            if (this.type === 'blackList') {
                blacklistFlag = 1;
            }
            this.resourceCode = data.resourceCode;
            appManageAPI.getWhiteList(this.pageSize, this.currentPage, this.appCode, data.resourceCode, this.tenantCode, blacklistFlag).then(res => {
                if (res.code === '0' && res.data && res.data.list) {
                    this.whiteTenantList = res.data.list;
                    this.totalCount = res.data.totalCount;
                }
            });
        },
        goBack() {
            this.$emit('goback');
        },
        closeAdd() {
            this.visible = false;
            this.options = [];
            this.roleCode = '';
            this.tenantlistCode = '';
            this.tenantList = [];
            this.tempList = [];
        },
        AddWhite(data) {
            if (this.resourceCode === '') {
                this.$message({
                    message: '请先选择一个资源项'
                });
                return;
            }
            this.visible = true;
            if (this.type === 'whiteList') {
                this.titlename = '添加白名单租户';
            } else {
                this.titlename = '添加黑名单租户';
            }
            this.modify = false;
            this.getTennatList();
            appManageAPI.getSelectRole(this.appCode).then(res => {
                if (res.code === '0') {
                    this.options = res.data;
                }
            });
        },
        getResources() {
            this.treeLoading = true;
            return resource.getResources(this.appCode).then(res => {
                this.treeLoading = false;
                if (res.data) {
                    this.originResources = res.data;
                }
            });
        },
        renderContent(h, { node, data, store }) {
            return (
                <span class="resource-tree-node">
                    <span>{data.resourceName}</span>
                </span>);
        },
        load(value) {

        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.load();
        },
        tenantHandleCurrentChange(val) {
            this.tenantCurrentPage = val;
            this.getTennatList();
        },
        selectHandleCurrentChange(val) {
            this.selectTenantCurrentPage = val;
            this.load();
        },
        changeSearch(val) {
            this.searchvalue = val;
        },
        editAuthority(row) {
            this.dialogAuthVisible = true;
            this.activeCode = JSON.parse(JSON.stringify(row));
        },
        closeAuthDialog() {
            this.dialogAuthVisible = false;
        }
    },
    mounted() {
        // this.appCode = this.$route.params.applicationCode;
        // this.type = this.$route.params.type;
        this.load();
        this.getResources();
    },
    computed: {
        ...mapGetters(['currentTenant'])
    },
    watch: {
        tempList(newValue, oldValue) {
            if (newValue.length === oldValue.length) return false;
            const { RightPageSize, RightCurrentPage } = this;
            if (newValue.length) {
                this.selectTenantList = newValue.filter((item, index) => {
                    if (index < RightPageSize * (RightCurrentPage - 1)) {
                        return false;
                    } else if (index > (RightPageSize - 1) * (RightCurrentPage)) {
                        return false;
                    } else {
                        return true;
                    }
                });
            }
        },
        RightPageSize(newValue) {
            const { RightPageSize, RightCurrentPage } = this;
            this.selectTenantList = this.tempList.filter((item, index) => {
                if (index < RightPageSize * (RightCurrentPage - 1)) {
                    return false;
                } else if (index > (RightPageSize - 1) * (RightCurrentPage)) {
                    return false;
                } else {
                    return true;
                }
            });
        },
        RightCurrentPage(newValue) {
            const { RightPageSize, RightCurrentPage } = this;
            this.selectTenantList = this.tempList.filter((item, index) => {
                if (index < RightPageSize * (RightCurrentPage - 1)) {
                    return false;
                } else if (index > (RightPageSize - 1) * (RightCurrentPage)) {
                    return false;
                } else {
                    return true;
                }
            });
        }
    }
};
</script>
<style lang='less'>
.app-manage-white-list {
    display: flex;
    flex-direction: column;
    .topTab {
        margin-bottom: 10px;
        .title {
            display: inline-block;
            vertical-align: middle;
            padding: 0 20px;
        }
    }
    .main {
        display: flex;
        flex-direction: row;
        border: 1px solid #dbdbdb;
        height: 100%;
        .my-table {
            box-sizing: border-box;
            width: 60%;
            height: 100%;
            padding: 15px;
            display: flex;
        }
        .tree {
            box-sizing: border-box;
            padding: 15px;
            width: 40%;
            border-right: 1px solid #dbdbdb;
            overflow-y: auto;
        }
    }
    .add-white {
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        justify-content: center;
        border: 1px solid #dbdbdb;
        .add-white-list,
        .add-white-seleted {
            box-sizing: border-box;
            width: 50%;
            padding: 15px;
        }
        .add-white-list {
            border-right: 1px solid #dbdbdb;
        }
    }

    .resource-tree-node {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
    }
}
</style>
