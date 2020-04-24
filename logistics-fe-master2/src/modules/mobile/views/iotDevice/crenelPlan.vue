<template>
    <div class="crenelPlan tabContent">
        <el-row>
            <el-col :span='23'>
                <el-col :span='3'>
                    <div class="searchItem">
                        <el-input v-model.trim='searchData.vehicleNo' placeholder='车牌号' clearable></el-input>
                    </div>
                </el-col>
                <el-col :span='2'>
                    <div class="searchItem">
                        <el-select v-model="searchData.timeType" placeholder="时间类型" clearable @change='selectChange' class="searchFull">
                            <el-option label="计划时间" :value="0"></el-option>
                            <el-option label="实际时间" :value="1"></el-option>
                        </el-select>
                    </div>
                </el-col>
                <el-col :span='6'>
                    <div class="searchItem">
                        <el-date-picker
                            @change='dateChange'
                            v-model='searchData.timeArr'
                            class="searchFull"
                            size="mini"
                            :clearable="false"
                            format="yyyy-MM-dd HH:mm:ss"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            :picker-options="pickerOptions"
                            type='datetimerange'
                            unlink-panels
                            range-separator="至"
                            start-placeholder="开始时间"
                            end-placeholder="结束时间">
                        </el-date-picker>
                    </div>
                </el-col>
                <el-col :span='2'>
                    <div class="searchItem">
                        <el-select v-model="searchData.queueType" placeholder="操作类型" clearable class="searchFull">
                            <el-option label="装车" :value="0"></el-option>
                            <el-option label="卸车" :value="10"></el-option>
                        </el-select>
                    </div>
                </el-col>
                <!-- <el-col :span='3'>
                    <div class="searchItem">
                        <el-input v-model.trim='searchData.crenelCode' placeholder='垛口编码' clearable></el-input>
                    </div>
                </el-col> -->
                <el-col :span='3'>
                    <div class="searchItem">
                        <!-- <el-input v-model.trim='searchData.crenelName' placeholder='垛口名称' clearable></el-input> -->
                        <el-select v-model="searchData.crenelName" placeholder="垛口名称" clearable style="width: 100%">
                            <el-option
                                v-for="(item, index) in crenelNameArr"
                                :key="index"
                                :label="item"
                                :value="item">
                            </el-option>
                        </el-select>
                    </div>
                </el-col>
                <el-col :span='3'>
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
                <el-table-column prop="vehicleNo" label="车牌号" show-overflow-tooltip></el-table-column>
                <el-table-column prop="timeTypeText" label="时间类型" show-overflow-tooltip></el-table-column>
                <el-table-column prop="startTime" label="开始时间" show-overflow-tooltip></el-table-column>
                <el-table-column prop="finishTime" label="结束时间" show-overflow-tooltip></el-table-column>
                <el-table-column prop="queueTypeText" label="操作类型" show-overflow-tooltip></el-table-column>
                <!-- <el-table-column prop="crenelCode" label="垛口编码" show-overflow-tooltip></el-table-column> -->
                <el-table-column prop="crenelName" label="垛口名称" show-overflow-tooltip></el-table-column>
                <el-table-column prop="createTime" label="创建时间" show-overflow-tooltip></el-table-column>
                <el-table-column prop="carrierName" label="承运商" show-overflow-tooltip></el-table-column>
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
import api from '@/modules/mobile/api/iotDevice/iotDevice.js';
import njdcApi from '@/modules/mobile/api/njdc/njdc.js';

export default {
    data() {
        return {
            crenelNameArr: [],
            searchData: {
                vehicleNo: '',
                timeType: '',
                timeArr: [],
                queueType: '',
                // crenelCode: '',
                crenelName: ''
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
        getCrenelNameList() {
            return njdcApi.crenels({ pageSize: 10000, pageNo: 1, method: 'get' }).then(res => {
                if (res) {
                    this.crenelNameArr = res.data.list.map(item => item.crenelName);
                }
            }).catch(() => {});
        },
        selectChange(data) {
            if (data === '') this.searchData.timeArr = [];
        },
        dateChange(data) {
            if (!data) {
                this.searchData.timeType = '';
                return false;
            }
            if (this.searchData.timeType === '') {
                this.searchData.timeArr = [];
                this.$message.warning('请先选择时间类型');
            }
        },
        queryBtn() {
            this.searchParams.pageNo = 1;
            this.searchParams.vehicleNo = this.searchData.vehicleNo;
            this.searchParams.timeType = this.searchData.timeType;
            this.searchParams.startTime = this.searchData.timeArr && this.searchData.timeArr[0];
            this.searchParams.finishTime = this.searchData.timeArr && this.searchData.timeArr[1];
            this.searchParams.queueType = this.searchData.queueType;
            // this.searchParams.crenelCode = this.searchData.crenelCode;
            this.searchParams.crenelName = this.searchData.crenelName;
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
        getDataList({ vehicleNo, timeType, startTime, finishTime, queueType, crenelName, pageSize, pageNo } = { pageSize: 10, pageNo: 1 }) {
            const params = { vehicleNo, timeType, startTime, finishTime, queueType, crenelName, pageSize, pageNo };
            this.searchParams = params;
            this.pageOptions.currentPage = pageNo;
            this.loading = true;
            api.crenelTimes(params).then(res => {
                if (res) {
                    res.data.list.forEach(item => {
                        item.timeTypeText = item.timeType === 0 ? '计划时间' : '实际时间';
                        item.queueTypeText = item.queueType === 0 ? '装车' : '卸车';
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
        // 获取垛口名称下拉框数据
        this.getCrenelNameList();
    }
};
</script>

<style lang="less">
.crenelPlan {

    .table-content {
        height: calc(100vh - 201px);
        overflow-y: auto;
    }
}
</style>
