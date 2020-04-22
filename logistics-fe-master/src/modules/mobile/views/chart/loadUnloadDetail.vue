<template>
    <div class="loadUnloadDetail tabContent">
        <el-row>
            <el-col :span='21'>
                <el-col :span='4'>
                    <div class="searchItem">
                        <el-input v-model.trim='searchData.vehicleNo' placeholder='车牌号' clearable></el-input>
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
                            start-placeholder="预约回复开始时间"
                            end-placeholder="预约回复结束时间">
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
                style="width: 100%"
                border
                v-loading='loading'
                >
                <el-table-column prop="bookingTypeText" label="作业类型" fixed='left' show-overflow-tooltip></el-table-column>
                <el-table-column prop="vehicleNo" label="车牌" width='100' show-overflow-tooltip></el-table-column>
                <el-table-column prop="confirmTime" label="预约回复" show-overflow-tooltip width='150'></el-table-column>
                <el-table-column prop="timeCarStart" width='150' label="到车登记完成" show-overflow-tooltip></el-table-column>
                <el-table-column prop="timeCarCheckBefore" width='150' label="装卸货前检查完成" show-overflow-tooltip></el-table-column>
                <el-table-column prop="userCarCheckBefore" label="操作人" show-overflow-tooltip></el-table-column>
                <el-table-column prop="timeCarSealBefore" width='150' label="封签检查完成" show-overflow-tooltip></el-table-column>
                <el-table-column prop="userCarSealBefore" label="操作人" show-overflow-tooltip></el-table-column>
                <el-table-column prop="timeCarCheckIng" width='150' label="装卸货中检查完成" show-overflow-tooltip></el-table-column>
                <el-table-column prop="userCarCheckIng" label="操作人" show-overflow-tooltip></el-table-column>
                <el-table-column prop="timeCarCheckAfter" width='150' label="装卸货后检查完成" show-overflow-tooltip></el-table-column>
                <el-table-column prop="userCarCheckAfter" label="操作人" show-overflow-tooltip></el-table-column>
                <el-table-column prop="timeCarSealAfter" width='150' label="后面施封完成" show-overflow-tooltip></el-table-column>
                <el-table-column prop="userCarSealAfter" label="操作人" show-overflow-tooltip></el-table-column>
                <el-table-column prop="timeCarOut" width='150' label="放行检查完成" show-overflow-tooltip></el-table-column>
                <el-table-column prop="userCarOut" label="操作人" show-overflow-tooltip></el-table-column>
            </el-table>
        </div>

        <!-- 分页 -->
        <div class="table-pagination">
            <el-pagination
                class="is-background"
                :pager-count="5"
                :layout="pageOptions.layout"
                :total="pageOptions.total"
                :current-page="pageOptions.currentPage"
                :page-sizes="pageOptions.pageSizes"
                :page-size="pageOptions.pageSize"
                @size-change='sizeChange'
                @current-change='pageChange'>
            </el-pagination>
        </div>
    </div>
</template>

<script>
import api from '@/modules/mobile/api/chart/chart.js';

export default {
    data() {
        return {
            searchData: {
                vehicleNo: '',
                appointmentTime: []
            },
            tableData: [],
            loading: false,
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
            },
            pageOptions: {
                layout: 'total, sizes, prev, pager, next, jumper',
                pageSize: 10,
                pageSizes: [10, 20, 50, 100],
                total: 0,
                currentPage: 1
            },
            searchParams: {}
        };
    },
    methods: {
        queryBtn() {
            this.searchParams.pageNo = 1;
            this.searchParams.vehicleNo = this.searchData.vehicleNo;
            this.searchParams.startTime = this.searchData.appointmentTime && this.searchData.appointmentTime[0];
            this.searchParams.endTime = this.searchData.appointmentTime && this.searchData.appointmentTime[1];
            this.getDataList(this.searchParams);
        },
        sizeChange(data) {
            this.searchParams.pageSize = data;
            this.searchParams.pageNo = 1;
            this.getDataList(this.searchParams);
        },
        pageChange(data) {
            this.searchParams.pageNo = data;
            this.getDataList(this.searchParams);
        },
        // 获取列表数据
        getDataList({ vehicleNo, startTime, endTime, pageSize, pageNo } = { pageSize: 10, pageNo: 1 }) {
            const params = { vehicleNo, startTime, endTime, pageSize, pageNo };
            this.searchParams = params;
            this.pageOptions.currentPage = pageNo;
            this.loading = true;
            api.mobileBookingCheck(params).then(res => {
                if (res) {
                    res.data.list.forEach(item => {
                        item.bookingTypeText = item.bookingType === 1 ? '提货' : '卸货';
                    });
                    this.tableData = res.data.list;
                    this.pageOptions.total = res.data.totalCount;
                }
                this.loading = false;
            }).catch(() => {
                this.loading = false;
            });
        }
    },
    created() {
        // 获取列表数据
        this.getDataList();
    }
};
</script>

<style lang="less">
.loadUnloadDetail {

    .table-content {
        height: calc(100vh - 201px);
        overflow-y: auto;
    }
}
</style>
