<template>
    <div class="reservesList tabContent">
        <el-row>
            <el-col :span='21'>
                <el-col :span='4'>
                    <div class="searchItem">
                        <el-input v-model.trim='searchData.vehicleNo' placeholder='车牌号' clearable></el-input>
                    </div>
                </el-col>
                <el-col :span='4'>
                    <div class="searchItem">
                        <el-select v-model="searchData.bookingType" placeholder="预约类型" style="width: 100%" clearable>
                            <el-option label="装货" :value="1"></el-option>
                            <el-option label="卸货" :value="2"></el-option>
                        </el-select>
                    </div>
                </el-col>
                <el-col :span='7'>
                    <div class="searchItem">
                        <el-date-picker
                            v-model='searchData.appointmentTime'
                            class="searchFull"
                            size="mini"
                            :clearable="false"
                            format="yyyy-MM-dd HH:mm:ss"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            :picker-options="pickerOptions"
                            type='datetimerange'
                            unlink-panels
                            range-separator="至"
                            start-placeholder="预约确认开始时间"
                            end-placeholder="预约确认结束时间"
                            :default-time="['00:00:00', '23:59:59']">
                        </el-date-picker>
                    </div>
                </el-col>
                <el-col :span='4'>
                    <el-button type='primary' @click='queryBtn'>查 询</el-button>
                </el-col>
            </el-col>
        </el-row>

        <div class="table-content" style="margin-top: 10px;">
            <el-table
                :data="tableData"
                style="width: 100%;"
                border
                v-loading='loading'>
                <el-table-column prop="vehicleNo" label="车牌号" show-overflow-tooltip></el-table-column>
                <el-table-column prop="bookingTypeText" label="预约类型" show-overflow-tooltip></el-table-column>
                <el-table-column prop="bookingTime" label="预约时间" width='150' show-overflow-tooltip></el-table-column>
                <el-table-column prop="confirmTime" label="确认时间" width='150' show-overflow-tooltip></el-table-column>
                <el-table-column prop="carrierName" label="运输商" show-overflow-tooltip></el-table-column>
                <el-table-column prop="crenelName" label="分配垛口" show-overflow-tooltip></el-table-column>
                <el-table-column prop="locCode" label="ST号" show-overflow-tooltip></el-table-column>
                <el-table-column prop="sendSite" label="发货方" show-overflow-tooltip></el-table-column>
                <el-table-column prop="receiveSite" label="收货DC" show-overflow-tooltip></el-table-column>
                <el-table-column prop="customerSite" label="收货客户" show-overflow-tooltip></el-table-column>
                <el-table-column prop="totalVolume" label="总体积m³" show-overflow-tooltip></el-table-column>
                <el-table-column prop="totalWeight" label="总重量kg" show-overflow-tooltip></el-table-column>
                <el-table-column prop="numberOfUnits" label="总数量" show-overflow-tooltip></el-table-column>
                <el-table-column prop="bookingId" label="预约ID" show-overflow-tooltip></el-table-column>
                <el-table-column fixed="right" label="操作" align='center' width="200">
                    <template slot-scope="scope">
                        <el-button @click="editBtn(scope.row)" type="text" size="small">编辑</el-button>
                        <el-button @click="detailBtn(scope.row)" type="text" size="small">详情</el-button>
                        <el-button @click="STBtn(scope.row)" type="text" size="small" v-if='scope.row.applyCrenelStatus === 0'>申请ST</el-button>
                        <el-button @click="cancelBtn(scope.row)" type="text" size="small">取消</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <!-- 分页 -->
        <div class="table-pagination">
            <el-pagination
                class="is-background"
                :pager-count="5"
                :layout="pageConfig.layout"
                :total="pageConfig.total"
                :current-page="pageConfig.currentPage"
                :page-sizes="pageConfig.pageSizes"
                :page-size="pageConfig.pageSize"
                @size-change='sizeChange'
                @current-change='pageChange'>
            </el-pagination>
        </div>

        <!-- 编辑弹窗 -->
        <edit-dialog v-if='visible' :getDataList='getDataList' :searchObj='searchObj' :visible.sync='visible' :currentRow='editRow'></edit-dialog>

        <!-- 详情弹框 -->
        <detail-dialog v-if='detailVisible' :visible.sync='detailVisible' :currentRow='detailRow'></detail-dialog>
    </div>
</template>

<script>
import api from '@/modules/mobile/api/njdc/njdc.js';
import editDialog from './editDialog.vue';
import detailDialog from './detailDialog.vue';

export default {
    components: {
        editDialog,
        detailDialog
    },
    data() {
        return {
            editRow: {},
            detailRow: {},
            visible: false,
            detailVisible: false,
            pageConfig: {
                layout: 'total, sizes, prev, pager, next, jumper',
                pageSize: 10,
                pageSizes: [10, 20, 50, 100],
                total: 0,
                currentPage: 1
            },
            loading: false,
            tableData: [],
            searchData: {
                vehicleNo: '',
                bookingType: '',
                appointmentTime: []
            },
            searchObj: {},
            pickerOptions: {
                shortcuts: [
                    {
                        text: '最近一周',
                        onClick(picker) {
                            const start = new Date();
                            start.setHours(0);
                            start.setMinutes(0);
                            start.setSeconds(0);
                            start.setMilliseconds(0);
                            const end = new Date();
                            end.setHours(23);
                            end.setMinutes(59);
                            end.setSeconds(59);
                            end.setMilliseconds(0);
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 6);
                            picker.$emit('pick', [start, end]);
                        }
                    },
                    {
                        text: '最近一个月',
                        onClick(picker) {
                            const start = new Date();
                            start.setHours(0);
                            start.setMinutes(0);
                            start.setSeconds(0);
                            start.setMilliseconds(0);
                            const end = new Date();
                            end.setHours(23);
                            end.setMinutes(59);
                            end.setSeconds(59);
                            end.setMilliseconds(0);
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    },
                    {
                        text: '最近三个月',
                        onClick(picker) {
                            const start = new Date();
                            start.setHours(0);
                            start.setMinutes(0);
                            start.setSeconds(0);
                            start.setMilliseconds(0);
                            const end = new Date();
                            end.setHours(23);
                            end.setMinutes(59);
                            end.setSeconds(59);
                            end.setMilliseconds(0);
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }
                ]
            }
        };
    },
    methods: {
        queryBtn() {
            this.searchObj.pageNo = 1;
            this.searchObj.startTime = this.searchData.appointmentTime && this.searchData.appointmentTime[0];
            this.searchObj.endTime = this.searchData.appointmentTime && this.searchData.appointmentTime[1];
            this.searchObj.vehicleNo = this.searchData.vehicleNo;
            this.searchObj.bookingType = this.searchData.bookingType;
            this.getDataList(this.searchObj);
        },
        // 编辑按钮
        editBtn(row) {
            this.editRow = Object.assign(row);
            this.visible = true;
        },
        cancelBtn(row) {
            this.$confirm('您确定要取消该预约单吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.loading = true;
                api.crenelBookingsCancel(row.bookingId).then(res => {
                    this.loading = false;
                    if (res) {
                        this.$message.success('取消成功');
                        this.getDataList(this.searchObj);
                    }
                }).catch(() => {
                    this.loading = false;
                });
            }).catch(() => {
            });
        },
        detailBtn(row) {
            this.detailRow = row;
            this.detailVisible = true;
        },
        // 申请ST
        STBtn(row) {
            this.$confirm('您确定要申请ST吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.loading = true;
                api.reqSt({ bookingId: row.bookingId }).then(res => {
                    this.loading = false;
                    if (res) {
                        this.$message.success('申请成功');
                        this.getDataList(this.searchObj);
                    }
                }).catch(() => {
                    this.loading = false;
                });
            }).catch(() => {
            });
        },
        sizeChange(data) {
            this.searchObj.pageSize = data;
            this.searchObj.pageNo = 1;
            this.getDataList(this.searchObj);
        },
        pageChange(data) {
            this.searchObj.pageNo = data;
            this.getDataList(this.searchObj);
        },
        // 获取列表数据
        getDataList({ pageNo, pageSize, startTime, endTime, vehicleNo, bookingType } = { pageNo: 1, pageSize: 10 }) {
            const params = { pageNo, pageSize, startTime, endTime, vehicleNo, bookingType };
            this.searchObj = params;
            this.pageConfig.currentPage = pageNo;
            this.loading = true;
            api.crenelBookings(params).then(res => {
                if (res) {
                    res.data.list.forEach(item => {
                        item.bookingTypeText = item.bookingType === 1 ? '装货' : '卸货';
                    });
                    this.tableData = res.data.list;
                    this.pageConfig.total = res.data.totalCount;
                }
                this.loading = false;
            }).catch(() => {
                this.loading = false;
            });
        }
    },
    created () {
        // 获取列表数据
        this.getDataList();
    }
};
</script>

<style lang="less">
.reservesList {

    .table-content {
        height: calc(100vh - 201px);
        overflow-y: auto;
    }
    .labelContent {
        font-size: 14px;
        line-height: 30px;
        display: flex;

        .label {
            width: 100px;
            text-align: right;
        }
    }
}
</style>
