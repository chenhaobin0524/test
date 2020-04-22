<template>
    <paper id="agingProduct">
        <m-pane
            ref="tablePage"
            :config="config"
            :totalData="totalData"
            :pageTotal="pageTotal"
            :loading="loading"
            :searchTotalTitle="searchTotalTitle"
            :initSearchInfo="initSearchInfo"
            @saveData="saveData"
            @row-db-click="rowDBclick"
            @check-btn="checkBtn"
            @edit-btn="editBtn"
            @switch-change="switchChange"
            @selectChange="selectChange"
            @searchChange="searchChange"
            @pageChange="pageChange"
            @sizeChange="sizeChange"
            searchId="test"
            pageID="test"
            class="inventory-flow"
        >
            <div slot="table-module-btn">
                <el-tooltip class="item" effect="dark" content="导出" placement="bottom">
                    <el-button size="mini" icon="el-icon-upload2"></el-button>
                </el-tooltip>
            </div>
        </m-pane>
    </paper>
</template>
<script>
import moment from 'moment';
import mPane from '@/components/otpPanel';
import config from './config.json';
import paper from '@/components/core/paper/Paper';
import { getinventoryFlow } from '../../../api/stockManage';
import { dateTimes } from '../../../judge/configCenter';
export default {
    name: 'inventoryFlow',
    components: { mPane, paper },
    data() {
        return {
            config: config,
            totalData: [],
            loading: false,
            pageTotal: 10,
            searchTotalTitle: config.searchTotalTitle,
            searchParams: {
                pageSize: 10,
                pageNo: 1
            },
            initSearchInfo: {}
        };
    },
    methods: {
        async getList() {
            getinventoryFlow(this.searchParams).then(res => {
                if (res) {
                    if (res.data.totalPage !== 0 && this.searchParams.pageNo > res.data.totalPage) {
                        this.searchParams.pageNo = res.data.totalPage;
                        this.getList();
                    } else {
                        this.totalData = res.data.list || [];
                        this.pageTotal = res.data.totalCount;
                    }
                } else {
                    this.totalData = [];
                }
            });
        },
        rowDBclick(row) {
            // 表格内双击事件
        },
        checkBtn(data) {
            // 表格内按钮查看事件;
            this.visible = true;
        },
        editBtn(data) {
            // 表格内按钮修改事件;
        },
        selectChange(data) {
            // 表格内选择变化
            this.selectRow = data;
        },
        switchChange(data) {
            // 表格内switch切换事件
        },
        searchChange(data) {
            if (!data.time && !data.custOrderNo) {
                return this.$message.warning('客户订单号 和 时间必选一个进行查询！');
            }
            // 提交搜索框
            if (data.time && data.time.length) {
                data.createStartTime = dateTimes(data.time[0]);
                data.createEndTime = dateTimes(data.time[1]);
                if (new Date(data.createEndTime).getTime() - new Date(data.createStartTime).getTime() > 32 * 24 * 60 * 60 * 1000) {
                    return this.$message.warning('查询时间跨度最大为一个月！');
                }
            }
            delete data.time;

            delete data.itemName;
            this.searchParams = { ...data, pageNo: 1, pageSize: this.searchParams.pageSize };
            this.getList();
        },
        pageChange(data) {
            // 分页器页数变化
            this.searchParams.pageNo = data;
            this.getList();
        },
        sizeChange(data) {
            // 分页器页数大小变化
            this.searchParams.pageSize = data;
            this.getList();
        },
        addData() {
            // 表格新增方法
            this.$refs.tablePage.$refs.table.addRow();
        },
        saveData(data) {
            // 表格新增修改后返回数据
        },
        redomet(data) {
            // 这是删除方法
        },
        refresh() {
            // 表格内刷新按钮
        },
        init() {
            const initSearchInfo = {};
            const startTime = moment().subtract(6, 'days').startOf('day');
            const endTime = moment().endOf('day');
            initSearchInfo.time = [startTime.toDate(), endTime.toDate()];
            this.initSearchInfo = initSearchInfo;
            this.$router.replace({ name: 'inventoryFlow', query: {} });
            // this.getInitList();
        },
        getInitList() {
            setTimeout(() => {
                this.$refs.tablePage.$refs.searchList.onSearchChange();
            }, 50);
        }
    },
    mounted() {
        // this.getList();
        this.init();
    }
};
</script>
<style lang="less">
    .inventory-flow {
        .el-pager {
            & > .number {
                display: none;
                &.active {
                    display: inline-block;
                }
            }
            & > .more {
                display: none;
            }
        }
    }
</style>