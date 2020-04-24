<template>
    <div class="geomagnetismRecord tabContent">
        <el-row>
            <el-col :span='22'>
                <el-col :span='3'>
                    <div class="searchItem">
                        <el-select v-model="searchData.whCode" placeholder="仓库编码" @change='whCodeChange' clearable style="width: 100%">
                            <el-option
                                v-for="item in whCodeOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                </el-col>
                <el-col :span='3'>
                    <div class="searchItem">
                        <el-select v-model="searchData.crenelCode" placeholder="垛口号" @change='crenelCodeChange' clearable style="width: 100%">
                            <el-option
                                v-for="item in crenelOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                </el-col>
                <el-col :span='3'>
                    <div class="searchItem">
                        <el-select v-model="searchData.equipmentCode" placeholder="设备号" clearable style="width: 100%">
                            <el-option
                                v-for="item in equipmentOptions"
                                :key="item.equipmentCode"
                                :label="item.equipmentCode"
                                :value="item.equipmentCode">
                            </el-option>
                        </el-select>
                    </div>
                </el-col>
                <el-col :span='3'>
                    <div class="searchItem">
                        <el-select v-model="searchData.recordType" placeholder="记录类型" clearable style="width: 100%">
                            <el-option label="车辆驶出" :value="0"></el-option>
                            <el-option label="车辆驶入" :value="1"></el-option>
                            <el-option label="无车心跳" :value="2"></el-option>
                            <el-option label="有车心跳" :value="3"></el-option>
                        </el-select>
                    </div>
                </el-col>
                <el-col :span='6'>
                    <div class="searchItem">
                        <el-date-picker
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
                            start-placeholder="记录开始时间"
                            end-placeholder="记录结束时间">
                        </el-date-picker>
                    </div>
                </el-col>
                <el-col :span='3'>
                    <div class="searchItem">
                        <el-select v-model="searchData.crenelStatus" placeholder="垛口状态" clearable style="width: 100%">
                            <el-option label="停用" :value="0"></el-option>
                            <el-option label="作业中" :value="20"></el-option>
                            <el-option label="空闲" :value="30"></el-option>
                        </el-select>
                    </div>
                </el-col>
                <el-col :span='3'>
                    <div class="searchItem">
                        <el-select v-model="searchData.geoStatus" placeholder="地磁状态" clearable style="width: 100%">
                            <el-option label="停用" :value="0"></el-option>
                            <el-option label="作业中" :value="20"></el-option>
                            <el-option label="空闲" :value="30"></el-option>
                        </el-select>
                    </div>
                </el-col>
            </el-col>
            <el-col :span='2'>
                <el-button type='primary' @click='queryBtn'>查 询</el-button>
            </el-col>
        </el-row>
        <div class="table-content" style="margin-top: 10px;">
            <el-table
                :data="tableData"
                style="width: 100%"
                border
                v-loading='loading'
                >
                <!-- <el-table-column prop="whCode" label="仓库编码" show-overflow-tooltip></el-table-column> -->
                <el-table-column prop="crenelName" label="垛口号" show-overflow-tooltip></el-table-column>
                <el-table-column prop="createTime" label="创建时间" show-overflow-tooltip></el-table-column>
                <el-table-column prop="recordTime" label="记录时间" show-overflow-tooltip></el-table-column>
                <el-table-column prop="berthCode" label="车位号" show-overflow-tooltip></el-table-column>
                <el-table-column prop="recordTypeText" label="记录类型" show-overflow-tooltip></el-table-column>
                <el-table-column prop="crenelStatusText" label="垛口状态" show-overflow-tooltip></el-table-column>
                <el-table-column prop="geoStatusText" label="地磁状态" show-overflow-tooltip></el-table-column>
                <el-table-column prop="equipmentCode" label="设备号" show-overflow-tooltip></el-table-column>
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
            crenelOptions: [],
            whCodeOptions: [],
            equipmentOptions: [],
            searchData: {
                whCode: '',
                crenelCode: '',
                equipmentCode: '',
                recordType: '',
                timeArr: [],
                crenelStatus: '',
                geoStatus: ''
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
        // 获取垛口号
        getCrenel(whCode) {
            njdcApi.PGCrenels(whCode).then(res => {
                if (res) {
                    this.crenelOptions = res.data.list.map(item => ({ label: item.crenelName, value: item.crenelCode }));
                }
            }).catch(() => {
            });
        },
        // 获取设备号
        getequipment(crenelCode) {
            api.geoRelationsList({ crenelCode }).then(res => {
                if (res) {
                    this.equipmentOptions = res.data;
                }
            }).catch(() => {
            });
        },
        // 获取仓库编码
        getwhCode() {
            njdcApi.PGCrenelsWhList().then(res => {
                if (res) {
                    this.whCodeOptions = res.data.map(item => ({ label: item, value: item }));
                    this.searchData.whCode = this.whCodeOptions[0].value;
                    this.whCodeChange(this.searchData.whCode);
                }
            }).catch(() => {
            });
        },
        whCodeChange(data) {
            this.searchData.crenelCode = '';
            this.crenelOptions = [];
            this.searchData.equipmentCode = '';
            this.equipmentOptions = [];
            if (data !== '') {
                this.getCrenel(data);
            }
        },
        crenelCodeChange(data) {
            this.searchData.equipmentCode = '';
            this.equipmentOptions = [];
            if (data !== '') {
                this.getequipment(data);
            }
        },
        queryBtn() {
            this.searchParams.pageNo = 1;
            this.searchParams.whCode = this.searchData.whCode;
            this.searchParams.crenelCode = this.searchData.crenelCode;
            this.searchParams.equipmentCode = this.searchData.equipmentCode;
            this.searchParams.recordType = this.searchData.recordType;
            this.searchParams.startTime = this.searchData.timeArr && this.searchData.timeArr[0];
            this.searchParams.endTime = this.searchData.timeArr && this.searchData.timeArr[1];
            this.searchParams.crenelStatus = this.searchData.crenelStatus;
            this.searchParams.geoStatus = this.searchData.geoStatus;
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
        getDataList({ whCode, crenelCode, equipmentCode, recordType, startTime, endTime, crenelStatus, geoStatus, pageSize, pageNo } = { pageSize: 10, pageNo: 1 }) {
            const params = { whCode, crenelCode, equipmentCode, recordType, startTime, endTime, crenelStatus, geoStatus, pageSize, pageNo };
            this.searchParams = params;
            this.pageOptions.currentPage = pageNo;
            this.loading = true;
            api.crenelGeomagnetisms(params).then(res => {
                if (res) {
                    const status = {
                        0: '停用',
                        20: '作业中',
                        30: '空闲'
                    };
                    const recordStatus = {
                        0: '车辆驶出',
                        1: '车辆驶入',
                        2: '无车心跳',
                        3: '有车心跳'
                    };
                    res.data.list.forEach(item => {
                        item.crenelStatusText = status[item.crenelStatus];
                        item.geoStatusText = status[item.geoStatus];
                        item.recordTypeText = recordStatus[item.recordType];
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
        // 获取仓库编码
        this.getwhCode();
    }
};
</script>

<style lang="less">
.geomagnetismRecord {

    .table-content {
        height: calc(100vh - 201px);
        overflow-y: auto;
    }
}
</style>
