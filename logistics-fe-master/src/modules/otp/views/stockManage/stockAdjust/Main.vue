<template>
    <paper>
        <div class="page-container">
            <m-search-list ref="searchList" :searchId="name" :list="config.searchList"
                :searchTotalTitle="config.searchTotalTitle"
                :configurationUrl="configurationUrl"
                @onSearchChange="searchChange">
            <div slot="table-module-btn" class="btn-box">
                <el-tooltip
                    class="item"
                    v-has="'03020004'"
                    effect="dark"
                    content="新增"
                    placement="bottom">
                    <el-button size="mini"
                        icon='el-icon-plus'
                        @click="edit()"></el-button>
                </el-tooltip>
                <el-tooltip v-if="config.configuration?false: true" class="item allocation-box" effect="dark" content="配置列" placement="bottom">
                    <el-button size="mini" class="el-icon-setting" @click="showColumnConfigDialog"></el-button>
                </el-tooltip>
            </div>
            </m-search-list>
            <el-table
                border
                :data="tableData"
                :height="config.table.height"
                @selection-change="handleSelectionChange"
                style="min-height: calc(100vh - 166px);width:99.8%;"
                :header-cell-style="{ 'text-align': 'center' }">
                <el-table-column type="selection" width="40"></el-table-column>
                <el-table-column
                    v-for="(tTitle, index) in tableColumns"
                    :key="tTitle.prop + tTitle.label + index"
                    :prop="tTitle.prop"
                    :label="tTitle.label"
                    :align="tTitle.align"
                    :show-overflow-tooltip="true"
                    :width="tTitle.width">
                    <template slot-scope="scope">
                        {{scope.row[tTitle.prop]}}
                    </template>
                </el-table-column>
                <el-table-column
                    label="操作"
                    align="left"
                    width="200">
                    <template slot-scope="scope">
                        <span class="pdh-8" v-has="'03020007'">
                            <el-button type="text" size="mini" @click="edit(scope.row.id, true)">查看</el-button>
                        </span>
                        <span v-has="'03020005'">
                            <span class="pdh-8">
                                <Throttle v-if="[10, 50].includes(scope.row.applyStatus)">
                                    <el-button type="text" size="mini" @click="edit(scope.row.id)">编辑</el-button>
                                </Throttle>
                            </span>
                        </span>
                        <template v-if="[10, 20, 50].includes(scope.row.applyStatus)">
                            <span v-if="scope.row.applyStatus !== 20" v-has="'03020002'">
                                <span class="pdh-8">
                                    <el-button type="text" size="mini" @click="batchFunc(scope.row.id, 'submitAdjustApply')">申请</el-button>
                                </span>
                            </span>
                            <span v-else-if="scope.row.sourceSystem !== 'CCS'" v-has="'03020003'">
                                <span class="pdh-8">
                                    <el-button type="text" size="mini" @click="batchFunc(scope.row.id, 'cancelAdjustApply')">取消申请</el-button>
                                </span>
                            </span>
                        </template>
                        <span v-has="'03020006'">
                            <span class="pdh-8">
                                <Throttle v-if="[10, 50].includes(scope.row.applyStatus)">
                                    <el-button type="text" size="mini" @click="batchFunc(scope.row.id, 'adjustApplysDelete')">删除</el-button>
                                </Throttle>
                            </span>
                        </span>
                    </template>
                </el-table-column>
            </el-table>
            <el-row type="flex" class="footer" justify="space-between">
                <el-col :span="12" class="page-text">
                    <div class="select-total-num">已选&nbsp;&nbsp;<span class="text-color">{{selectTotal}}</span>&nbsp;&nbsp;项</div>
                    <span v-has="'03020002'">
                        <Throttle>
                            <el-button type="primary" size="small" @click="batchFunc(multipleSelection, 'submitAdjustApply')">申请</el-button>
                        </Throttle>
                    </span>
                    <span style="margin-left: 10px;" v-has="'03020003'">
                        <Throttle>
                            <el-button type="primary" size="small" @click="batchFunc(multipleSelection, 'cancelAdjustApply')">取消申请</el-button>
                        </Throttle>
                    </span>
                </el-col>
                <el-col :span="12">
                    <m-page ref="page" :current-page="searchParams.pageNo" :pageData="config.page" :total="pageTotal" @on-page-change="pageChange" @on-size-change="sizeChange"></m-page>
                </el-col>
            </el-row>
            <otp-column-config :pageID="name" :initColumns="config.table.columns" ref="otpColumnConfig" @getTableConfigList="getTableConfigList"></otp-column-config>
        </div>
        <detail-dialog ref="DetailDialog" @success="fetchData()"></detail-dialog>
        <ViewsDialog ref="ViewsDialog" :viewVisible.sync="viewVisible" :formItem="config.table.columns" :data="viewData"></ViewsDialog>
    </paper>
</template>
<script>
import config from './config.js';
import paper from '@/components/core/paper/Paper';
import mSearchList from '@/components/otpPanel/mSearchList';
import mPage from '@/components/awesome/page/mPanel3/mPage';
import otpColumnConfig from '@/components/lots/otpColumnConfig';
import Throttle from '@/components/lots/debounce/Debounce';
import DetailDialog from './_detailDialog';
import ViewsDialog from './ViewsDialog';
import formatTime from '@/utils/common.js';
import { adjustApplys, adjustApplysDelete, submitAdjustApply, cancelAdjustApply } from '../../../api/orderManage';
export default {
    name: 'stockAdjust',
    components: { paper, mSearchList, mPage, otpColumnConfig, DetailDialog, Throttle, ViewsDialog },
    data() {
        return {
            name: 'STOCK_ADJUST',
            config: config,
            configurationUrl: config.configurationUrl ? config.configurationUrl : '/api-gwms/basic',
            loading: false,
            tableData: [],
            // 选中的行数
            selectData: [],
            // 多选框数组
            multipleSelection: [],
            pageTotal: 0,
            searchParams: {
                pageSize: 10,
                pageNo: 1
            },
            batchFuncObj: {
                submitAdjustApply,
                cancelAdjustApply,
                adjustApplysDelete
            },
            viewVisible: false,
            viewData: {}
        };
    },
    methods: {
        async fetchData() {
            const res = await adjustApplys(this.searchParams);
            if (res && res.code === '0') {
                if (res.data.totalPage !== 0 && this.searchParams.pageNo > res.data.totalPage) {
                    this.searchParams.pageNo = res.data.totalPage;
                    this.fetchData();
                } else {
                    this.tableData = res.data.list || [];
                    this.pageTotal = res.data.totalCount;
                }
            } else {
                this.tableData = [];
            }
        },
        selectChange(data) {
            // 表格内选择变化
            this.selectData = data;
        },
        searchChange(data) {
            // 提交搜索框
            if (data.createTime && data.createTime.length > 0) {
                data.beginDate = formatTime.formatDateTime(data.createTime[0]);
                data.endDate = formatTime.formatDateTime(data.createTime[1]);
            } else if (!data.createTime) {
                data.beginDate = '';
                data.endDate = '';
            }
            delete data.createTime;
            this.searchParams = { ...this.searchParams, ...data };
            this.fetchData();
        },
        pageChange(data) {
            // 分页器页数变化
            this.searchParams.pageNo = data;
            this.fetchData();
        },
        sizeChange(data) {
            // 分页器页数大小变化
            this.searchParams.pageSize = data;
            this.fetchData();
        },
        edit(id, onlyView = false) {
            // 表格新增方法
            this.$refs['DetailDialog'].show(true, id, onlyView);
        },
        getTableConfigList(data) {
            this.config.table.columns = data;
        },
        // 显示列配置弹窗
        showColumnConfigDialog() {
            this.$refs['otpColumnConfig'].show(true, this.config.table.columns);
        },
        // 批量函数
        async batchFunc(ids, funcName) {
            // 如果是数组，以','进行拼接
            if (Object.prototype.toString.call(ids) === '[object Array]') {
                if (ids.length === 0) {
                    this.$message.warning('至少勾选一条数据进行操作');
                    return;
                }
                ids = ids.map(i => i.id).join(',');
            }
            const res = await this.batchFuncObj[funcName](ids);
            if (res && res.code === '0') {
                this.$message.success('操作成功');
                this.fetchData();
            }
        },
        // 多选框change回调
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        viewsFunc(row) {
            this.viewVisible = true;
            this.viewData = row;
        }
    },
    mounted() {
        const createTime = this.$refs.searchList.searchData.createTime;

        if (createTime && createTime.length > 0) {
            this.searchParams.beginDate = formatTime.formatDateTime(createTime[0]);
            this.searchParams.endDate = formatTime.formatDateTime(createTime[1]);
        } else if (!createTime) {
            this.searchParams.beginDate = '';
            this.searchParams.endDate = '';
        }
        this.fetchData();
    },
    computed: {
        tableColumns() {
            return this.config.table.columns.filter(item => !item.hiddenColumn);
        },
        selectTotal() {
            return this.multipleSelection.length || 0;
        }
    }
};
</script>
<style lang="less" scoped>
.page-container {
    .btn-box {
        text-align: right;
    }
    .mgh-8 {
        margin: 0 8px;
    }
    .pdh-8 {
        padding: 0 8px;
    }
    .footer {
        margin-top: 20px;
        .select-total-num{
            display: inline-block;
            height: 28px;
            line-height: 28px;
            font-size: 12px;
            margin-right: 10px;
            .text-color{
                color: #00BCBF;
            }
        }
    }
}
</style>