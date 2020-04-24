<template>
    <div class="signoRecord tabContent">
        <el-row>
            <el-col :span='21'>
                <el-col :span='4'>
                    <div class="searchItem">
                        <!-- <el-input v-model.trim='searchData.parkNo' placeholder='车场编号' clearable></el-input> -->
                        <el-select v-model="searchData.parkNo" placeholder="车场编号" clearable style="width: 100%">
                            <el-option label="210018_0004" value="210018_0004"></el-option>
                        </el-select>
                    </div>
                </el-col>
                <el-col :span='4'>
                    <div class="searchItem">
                        <el-input v-model.trim='searchData.carNo' placeholder='车牌号' clearable></el-input>
                    </div>
                </el-col>
                <el-col :span='2'>
                    <div class="searchItem">
                        <el-select v-model="searchData.carType" placeholder="时间类型" clearable @change='selectChange' class="searchFull">
                            <el-option label="出场时间" :value="1"></el-option>
                            <el-option label="入场时间" :value="2"></el-option>
                        </el-select>
                    </div>
                </el-col>
                <el-col :span='7'>
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
                <el-col :span='4'>
                    <el-button type='primary' @click='queryBtn'>查 询</el-button>
                </el-col>
            </el-col>
            <el-col :span='3' style="text-align: right;">
                <el-button @click='showSyncData'>同步数据</el-button>
            </el-col>
        </el-row>
        <div class="table-content" style="margin-top: 10px;">
            <el-table
                :data="tableData"
                style="width: 100%"
                border
                v-loading='loading'
                >
                <!-- <el-table-column prop="parkNo" label="车场编号" show-overflow-tooltip></el-table-column> -->
                <el-table-column prop="carNo" label="车牌" show-overflow-tooltip></el-table-column>
                <el-table-column prop="entryTime" label="入场时间" show-overflow-tooltip></el-table-column>
                <el-table-column prop="exitTime" label="出场时间" show-overflow-tooltip></el-table-column>
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
        <el-dialog
            :before-close='beforeClose'
            :closeOnClickModal='false'
            title="同步数据"
            :visible.sync="visible"
            class="iotDeviceSignoRecordSyncDataDialog"
            width="40%">
            <el-date-picker
                v-model="startTime"
                value-format="yyyy-MM-dd"
                :picker-options="syncPickerOptions"
                type="date"
                placeholder="同步起始日期">
            </el-date-picker>
            <el-button type='primary' @click='syncCarIn' :disabled="syncCarInDisabled">同步入场</el-button>
            <el-button type='primary' @click='syncCarExit' :disabled="syncCarExitDisabled">同步出场</el-button>
            <span slot="footer" class="dialog-footer">
                <el-button @click="beforeClose">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import api from '@/modules/mobile/api/iotDevice/iotDevice.js';

export default {
    data() {
        return {
            disabledTime: 1000 * 60 * 5,
            syncCarInDisabled: false,
            syncCarExitDisabled: false,
            dialogLoading: {},
            startTime: '',
            visible: false,
            searchData: {
                parkNo: '',
                carNo: '',
                carType: '',
                timeArr: []
            },
            tableData: [],
            loading: false,
            syncPickerOptions: {
                disabledDate(date) {
                    return date > new Date();
                }
            },
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
        loadingDialog(status = true) {
            if (status) {
                this.dialogLoading = this.$loading({
                    target: '.iotDeviceSignoRecordSyncDataDialog > div',
                    background: 'rgba(255, 255, 255, .7)'
                });
            } else {
                this.dialogLoading.close();
            }
        },
        beforeClose() {
            this.visible = false;
        },
        showSyncData() {
            this.visible = true;
        },
        syncCarIn() {
            this.sendRequest('syncCarInDisabled', 'iotDeviceSignoRecordSyncCarInDisabled', 'syncCarInTimeout', 'syncCarIn');
        },
        sendRequest(disabled, local, timeOut, apis) {
            if (!this.startTime) {
                this.$message.warning('请选择同步起始日期');
                return false;
            }
            this.loadingDialog();
            api[apis]({ startTime: this.startTime + ' 00:00:01' }).then(res => {
                if (res) {
                    this.$message({
                        type: 'success',
                        message: '数据同步中，请稍后刷新页面',
                        showClose: true,
                        duration: 8000
                    });
                    this[disabled] = true;
                    localStorage.setItem(local, new Date().getTime());
                    this[timeOut] = setTimeout(() => {
                        this[disabled] = false;
                        localStorage.removeItem(local);
                    }, this.disabledTime);
                }
                this.loadingDialog(false);
            }).catch(() => {
                this.loadingDialog(false);
            });
        },
        syncCarExit() {
            this.sendRequest('syncCarExitDisabled', 'iotDeviceSignoRecordsyncCarExitDisabled', 'syncCarExitTimeout', 'syncCarExit');
        },
        selectChange(data) {
            if (data === '') this.searchData.timeArr = [];
        },
        dateChange(data) {
            if (!data) {
                this.searchData.carType = '';
                return false;
            }
            if (this.searchData.carType === '') {
                this.searchData.timeArr = [];
                this.$message.warning('请先选择时间类型');
            }
        },
        queryBtn() {
            this.searchParams.pageNo = 1;
            this.searchParams.parkNo = this.searchData.parkNo;
            this.searchParams.carNo = this.searchData.carNo;
            this.searchParams.carType = this.searchData.carType;
            this.searchParams.startTime = this.searchData.timeArr && this.searchData.timeArr[0];
            this.searchParams.endTime = this.searchData.timeArr && this.searchData.timeArr[1];
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
        getDataList({ parkNo, carNo, carType, startTime, endTime, pageSize, pageNo } = { pageSize: 10, pageNo: 1 }) {
            const params = { parkNo, carNo, carType, startTime, endTime, pageSize, pageNo };
            this.searchParams = params;
            this.pageOptions.currentPage = pageNo;
            this.loading = true;
            api.parkCars(params).then(res => {
                if (res) {
                    this.tableData = res.data.list;
                    this.pageOptions.total = res.data.totalCount;
                }
                this.loading = false;
            }).catch(() => {
                this.loading = false;
            });
        },
        initDisabled() {
            const handle = (local, disabled, timeout) => {
                const exist = localStorage.getItem(local);
                if (exist && (+exist + this.disabledTime > new Date().getTime())) {
                    this[disabled] = true;
                    this[timeout] = setTimeout(() => {
                        this[disabled] = false;
                        localStorage.removeItem(local);
                    }, this.disabledTime - (new Date().getTime() - exist));
                }
            };
            handle('iotDeviceSignoRecordSyncCarInDisabled', 'syncCarInDisabled', 'initSyncCarInTimeout');
            handle('iotDeviceSignoRecordsyncCarExitDisabled', 'syncCarExitDisabled', 'initSyncCarExitTimeout');
        }
    },
    created() {
        // 获取列表数据
        this.getDataList();
        this.initDisabled();
    },
    beforeDestroy () {
        clearTimeout(this.syncCarInTimeout);
        clearTimeout(this.initSyncCarInTimeout);
        clearTimeout(this.syncCarExitTimeout);
        clearTimeout(this.initSyncCarExitTimeout);
    }
};
</script>

<style lang="less">
.signoRecord {

    .table-content {
        height: calc(100vh - 201px);
        overflow-y: auto;
    }
    .el-dialog__wrapper {
        .el-button {
            margin-left: 10px;
        }
        .el-dialog__body {
            text-align: center;
        }
    }
}
</style>
