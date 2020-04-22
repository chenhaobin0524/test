<template>
    <div class="flex-layout">
    <list-layout-paper class="relevance-post">
        <div slot="header-search">
            <el-button @click="$emit('goback')" icon="el-icon-arrow-left" size="mini" class="margin-right">返回</el-button>
            <span class="margin-right">关联IHR岗位</span>
            <Cascader @change="handleOrgNameChange" class="margin-right" value="code" placeholder="请选择组织搜索"/>
            <el-button type="primary" class="margin-right" @click="_requestList">查询</el-button>
        </div>
        <div slot="header-button">
            <el-button type="primary" @click="Sync">同步</el-button>
        </div>
        <div slot="list" slot-scope="props">
            <el-table
                    v-loading="tbLoading"
                    border
                    stripe
                    :height="props.tableHeight"
                    :data='list'>
                    <el-table-column prop="ihrName" label="关联岗位">
                    </el-table-column>
                    <el-table-column prop="ihrCode" label="岗位编码">
                    </el-table-column>
                    <el-table-column prop="orgName" label="组织">
                    </el-table-column>
                    <el-table-column prop="orgFullName" label="组织全称" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="action" label='是否启用' width="80">
                        <template slot-scope='scope'>
                            <el-switch
                                v-model="scope.row.enableFlag"
                                @change="_updateFlag(scope.row)"
                                :active-value="1"
                                :inactive-value="0">
                            </el-switch>
                        </template>
                    </el-table-column>
            </el-table>
        </div>
        <el-pagination
            slot="footer"
            @size-change="SizeChange"
            :current-page.sync='currentPage'
            @current-change="CurrentChange"
            size="small"
            layout='total, sizes, prev, pager, next, jumper'
            :total='total'
        ></el-pagination>
    </list-layout-paper>
    </div>
</template>
<script>
import { positionRelations, syncPositionRelations, positionRelation } from '../../api/PostManage';
import ListLayoutPaper from '@/components/lots/listLayout/Paper';
import Cascader from './Cascader';
import { mapGetters } from 'vuex';
export default {
    data() {
        return {
            tbLoading: false,
            list: [],
            currentPage: 1,
            total: 0,
            pageSize: 10,
            orgName: ''
        };
    },
    props: {
        currentNode: {
            type: Object,
            default: () => {
                return {};
            }
        }
    },
    methods: {
        _requestList() {
            this.tbLoading = true;
            const { positionCode } = this.currentNode;
            positionRelations({
                tenantCode: this.currentTenant.tenantCode,
                pageNo: this.currentPage,
                pageSize: this.pageSize,
                positionCode,
                orgCode: this.orgName
            }).then(res => {
                if (res && +res.code === 0 && res.data) {
                    this.list = res.data.list;
                    this.total = res.data.totalCount;
                }
                this.tbLoading = false;
            });
        },
        // 是否启用
        _updateFlag(row) {
            this.$nextTick(() => {
                const { enableFlag } = row;
                positionRelation({
                    data: {
                        enableFlag: enableFlag,
                        version: row.version
                    },
                    id: row.id
                }).then(res => {
                    if (res && +res.code === 0) {
                        this.$message({
                            type: 'success',
                            message: '保存成功!'
                        });
                        this._requestList();
                    } else {
                        this.$message({
                            type: 'error',
                            message: '保存失败!'
                        });
                    }
                });
            });
        },
        SizeChange(val) {
            this.pageSize = val;
            this._requestList();
        },
        CurrentChange(val) {
            this.currentPage = val;
            this._requestList();
        },
        Sync() {
            const { orgFullName, positionName, positionCode } = this.currentNode;
            syncPositionRelations({
                orgFullName, positionName, positionCode
            }).then(res => {
                if (res && +res.code === 0) {
                    this.$message.success('同步成功!');
                    this._requestList();
                } else {
                    this.$message.error('同步失败!');
                }
            });
        },
        handleOrgNameChange(val) {
            this.orgName = val.slice(-1).join('');
        }
    },
    mounted() {
        this._requestList();
    },
    computed: {
        ...mapGetters(['currentTenant'])
    },
    components: {
        Cascader,
        ListLayoutPaper
    }
};
</script>
<style lang="less">
.relevance-post{
    .margin-right{
        margin-right: 20px;
        white-space: nowrap;
    }
    .panel{
        display: flex;
        justify-content: space-between;
    }
    .panel-left{
        display: flex;
        align-items: center;
    }
    .wrapper-tb{
        flex: 1;
        margin-top: 10px;
    }
}
</style>