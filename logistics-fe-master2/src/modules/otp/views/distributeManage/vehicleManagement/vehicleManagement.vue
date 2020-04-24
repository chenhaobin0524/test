<template>
    <Paper class="stock-manage">
        <div class="switchoverTable">
            <div class="switchoverTableHead">
                <div class="headTab" :class="{ 'activeClass':indexy == current}" v-for="(item, indexy) in tabItems" :key="indexy" @click="tabClick(indexy)">
                    <span class="label">{{item.label}}</span>
                    <span class="value">{{item.value}}</span>
                </div>
                <div class="headTabBtn">
                   <el-button @click="handleStart">高 级</el-button>
                </div>
            </div>
            <template>
                <el-table :data="tableData" height="300" border style="width:100%" @selection-change="selectChange" v-loading="loading">
                    <el-table-column prop="dispatchNo" label="发车单号" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column prop="planEquipmentName" label="车辆信息" :show-overflow-tooltip="true">
                        <template slot-scope="{row}" >{{row.vehicleCard}}/{{row.planEquipmentName}}</template>
                    </el-table-column>
                    <el-table-column prop="driver,driverContactWay" label="司机信息" :show-overflow-tooltip="true">
                        <template slot-scope="{row}">{{row.driver}}/{{row.driverContactWay}}</template>
                    </el-table-column>
                    <el-table-column prop="loadRate" label="装载率" >
                        <template slot-scope="{row}">
                            {{row.loadRate}}%
                        </template>
                    </el-table-column>
                    <el-table-column prop="originName" label="始发地" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column prop="destinationName" label="目的地" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column prop="outStopMileage" label="里程(Km)" ></el-table-column>
                    <el-table-column prop="taskCount" label="单量" ></el-table-column>
                    <el-table-column prop="totalGrossWeight" label="重量(Kg)" ></el-table-column>
                    <el-table-column prop="volume" label="方量(m³)" ></el-table-column>
                    <el-table-column prop="date" label="轨迹" >
                        <template slot-scope="{row}">
                            <div class="trajectory">
                                <span class="trajectoryImg" @click="jumpClick(row.dispatchNo)">
                                    <img class="gpsImg" src="@/assets/gps.png" alt>
                                </span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="planCarrierName" label="承运商" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column prop="dispatchStatus" label="状态" ></el-table-column>
                    <el-table-column prop="dispatchTime" label="发车时间" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column prop="createTime" label="更新时间" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column prop="updateTime" label="创建时间" :show-overflow-tooltip="true"></el-table-column>
                </el-table>
            </template>
            </div>

        <el-row type="flex" class="row-bg" justify="space-between">
            <el-col :span="11">
                <slot name="page-module-btn"></slot>
            </el-col>
            <el-col :span="12">
                <m-page :pageData="config.page" :total="pageTotal" :currentPage="currentPage" @on-page-change="pageChange" @on-size-change="sizeChange"></m-page>
            </el-col>
        </el-row>
        <el-dialog title="高级查询" class="form-dialog" :visible.sync="completeShaowForm" :before-close="handleCompleteFormClose" width="60%">
             <m-search-list
                ref="search"
                :currentPage='currentPage'
                :searchId="searchId"
                :list="config.searchList"
                :searchTotalTitle="searchTotalTitle"
                :searchSetTitle="searchSetTitle"
                @onSearchChange="searchChange">
            </m-search-list>
        </el-dialog>
    </Paper>
</template>
<script>
import mSearchList from '@/components/otpPanel/mSearchList';
import mPage from '@/components/awesome/page/mPanel3/mPage';
import config from './vehicles.json';
import Paper from '@/components/core/paper/Paper';
import { getVehicleLists, getVehicles } from '../../../api/vehicleManagement';

export default {
    name: 'vehicleManagement',
    components: { mPage, Paper, mSearchList },
    data() {
        return {
            completeShaowForm: false,
            pageSize: 10,
            currentPage: 0,
            pageTotal: 0,
            current: '2',
            tabItems: [
                // {
                //     label: '应到车',
                //     value: '',
                //     a: 'headTab',
                //     index: 0,
                //     status: ''
                // },
                {
                    label: '待到车',
                    value: '',
                    index: 0,
                    status: '10'
                },
                {
                    label: '待装车',
                    value: '',
                    index: 1,
                    status: '20'
                },
                {
                    label: '待发车',
                    value: '',
                    index: 2,
                    status: '30'
                },
                {
                    label: '在途',
                    value: '',
                    index: 3,
                    status: '40'
                },
                {
                    label: '逾期',
                    value: '',
                    index: 4,
                    status: '40',
                    type: 'larter'
                }
                // {
                //     label: '异常',
                //     value: '',
                //     index: 5,
                //     type: 'excepetion'
                // }
            ],
            tableData: [],
            settingColumns: config.table.columns,
            searchList: config.searchList,
            config: config,
            searchTotalTitle: config.searchTotalTitle,
            searchSetTitle: config.searchTotalTitle,
            showModal: false,
            checkedList: '',
            checkedNum: 0,
            loading: false,
            pageID: 'vehicleManagement',
            searchId: 'vehicleManagementQuery',
            tableList: '',
            searchTerm: [],
            name: '',
            clickValue: '',
            clickLable: '',
            dispatchStatus: ''
        };
    },
    computed: {},
    methods: {
        handleStart() { this.completeShaowForm = true; },
        handleCompleteFormClose() { this.completeShaowForm = false; },
        searchChange(data) {
            // this.current = 'aaa'; // 显示边框高亮
            this.completeShaowForm = false;
            this.currentPage = this.pageNo = 1;
            if (data.departureTime !== null && data.departureTime !== '') {
                data.startDispatchTime = data.departureTime[0];
                data.endDispatchTime = data.departureTime[1];
            } else {
                data.startDispatchTime = '';
                data.endDispatchTime = '';
            }
            if (data.createTime !== null && data.createTime !== '') {
                data.startCreateTime = data.createTime[0];
                data.endCreateTime = data.createTime[1];
            } else {
                data.startCreateTime = '';
                data.endCreateTime = '';
            }
            this.dispatchNo = data.dispatchNo;
            data.dispatchStatus = this.dispatchStatus;
            this.vehicleCard = data.vehicleCard;
            this.planCarrierName = data.planCarrierName;
            this.endCreateTime = data.createTime ? data.createTime[1] : '';
            this.startCreateTime = data.createTime ? data.createTime[0] : '';
            this.endDispatchTime = data.departureTime ? data.departureTime[1] : '';
            this.startDispatchTime = data.departureTime ? data.departureTime[0] : '';
            delete data.createTime;
            delete data.departureTime;
            this.loadData(data);
        },
        getTableList() {
            const searchData = !this.$refs['searchData'] ? {} : this.$refs.search.searchData;
            const dispatchNo = this.dispatchNo;
            searchData['dispatchNo'] = dispatchNo;
            const vehicleCard = this.vehicleCard;
            searchData['vehicleCard'] = vehicleCard;
            const planCarrierName = this.planCarrierName;
            searchData['planCarrierName'] = planCarrierName;
            const endCreateTime = this.createTime ? this.createTime[1] : '';
            searchData['endCreateTime'] = endCreateTime;
            const startCreateTime = this.createTime ? this.createTime[0] : '';
            searchData['startCreateTime'] = startCreateTime;
            const endDispatchTime = this.departureTime ? this.departureTime[1] : '';
            searchData['endDispatchTime'] = endDispatchTime;
            const startDispatchTime = this.departureTime ? this.departureTime[0] : '';
            searchData['startDispatchTime'] = startDispatchTime;
            const params = {
                pageNo: this.pageNo,
                pageSize: this.pageSize,
                specialStatus: this.specialStatus,
                dispatchNo: this.dispatchNo,
                vehicleCard: this.vehicleCard,
                planCarrierName: this.planCarrierName,
                endCreateTime: this.endCreateTime,
                endDispatchTime: this.endDispatchTime,
                startCreateTime: this.startCreateTime,
                startDispatchTime: this.startDispatchTime
            };
            getVehicleLists(params).then(res => {
                // this.tabItems[0].value = res.data.shouldComeCars;
                this.tabItems[0].value = res.data.waitingGetCars;
                this.tabItems[1].value = res.data.waitingLoadCars;
                this.tabItems[2].value = res.data.waitingSendCars;
                this.tabItems[3].value = res.data.runningCars;
                this.tabItems[4].value = res.data.laterCars;
                // this.tabItems[5].value = res.data.exceptionCars;
            });
        },
        jumpClick(val) {
            this.$router.push({
                name: 'trafficTrajectory',
                params: {
                    name: '/distribute/traffic-trajectory',
                    dispatchNo: val
                }
            });
        },
        tabClick(indexy) {
            this.tabItems.map((item, index) => {
                if (indexy === index) {
                    this.clickValue = item.value;
                    this.clickLable = item.label;
                    this.specialStatus = item.type;
                    this.dispatchStatus = item.status;
                }
            });
            this.currentPage = this.pageNo = 1;
            const searchDataList = !this.$refs['searchData'] ? {} : this.$refs.search.searchData;
            this.loadData(searchDataList);
            this.current = indexy;
        },
        selectChange(data) { this.checkedNum = data.length; },
        pageChange(page) {
            this.pageNo = page;
            this.currentPage = page;
            const searchDataList = !this.$refs['searchData'] ? {} : this.$refs.search.searchData;
            this.loadData(searchDataList);
        },
        sizeChange(size) {
            this.currentPage = 1;
            this.pageSize = size;
            const searchDataList = !this.$refs['searchData'] ? {} : this.$refs.search.searchData;
            this.loadData(searchDataList);
        },
        dialogClose() {
            this.$refs.dialog.initData();
        },
        loadData(val) {
            this.loading = true;
            const params = {
                pageNo: this.pageNo,
                pageSize: this.pageSize,
                specialStatus: this.specialStatus,
                dispatchStatus: this.dispatchStatus,
                vehicleCard: this.vehicleCard,
                dispatchNo: this.dispatchNo,
                planCarrierName: this.planCarrierName,
                endCreateTime: this.endCreateTime,
                endDispatchTime: this.endDispatchTime,
                startCreateTime: this.startCreateTime,
                startDispatchTime: this.startDispatchTime,
                ...val
            };
            getVehicles(params).then(res => {
                if (res) {
                    this.tableData = res.data.list.map((item, index) => {
                        item.dispatchStatus = window.sessionStorage.DISPATCH_STATUS ? JSON.parse(window.sessionStorage.DISPATCH_STATUS)[item.dispatchStatus] : item.dispatchStatus;
                        return item;
                    });
                    this.pageNo = res.data.pageNo;
                    this.pageTotal = res.data.totalCount;
                    this.loading = false;
                }
            }).catch(() => {
                this.loading = false;
            });
            this.getTableList();
        },
        tableConfigClose() {
            this.showModal = false;
        }
    },
    mounted() {
        this.getTableList();
        this.tabItems.map((item, index) => {
            if (index === 2) {
                this.dispatchStatus = item.status;
            }
        });
        // this.loadData(this.val);
    },
    watch: {}
};
</script>
<style lang='less'>
.stock-manage {
    .btn-box {
        display: flex;
        justify-content: flex-end;
    }
    .row-bg {
        margin-top: 10px;
    }
    .el-table {
        min-height: calc(100vh - 234px);
        max-height: calc(100vh - 234px);
    }
    .allocation-box {
        margin-left: 10px;
    }
    .el-table__body tr.selected-row > td {
        background: #f1f8fa !important;
    }
    .error-active input {
        border-color: red;
    }
    .switchoverTable {
        .switchoverTableHead {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 10px;
            .headTab {
                cursor: pointer;
                margin: 0 20px 0 0;
                flex: 1;
                width: 20%;
                height: 60px;
                line-height: 60px;
                border: 1px solid #ccc;
                border-radius: 5px;
                display: flex;
                .label {
                    width: 60%;
                    font-size: 14px;
                    margin-left: 16px;
                    color:#666;
                }
                .value {
                    flex: 1;
                    font-size: 30px;
                }
            }
            .headTabBtn {
                width: 80px !important;
            }
        }
    }
    .trajectory {
        text-align: center;
        line-height: 34px;

        .trajectoryImg {
            // margin: 0 auto;
            width: 20px;
            height: 20px;
            display: block;
            .gpsImg {
                cursor: pointer;
                width: 20px;
                height: 20px;
                display: block;
            }
        }
    }
    .el-col-6 {
        width:33%;
    }
    .el-col-7 {
        width:34%;
    }
    .el-col-21 {
        width: 100%;
    }
    .el-col-3 {
        width: 0;
    }
    .select-btn-box {
        text-align: right;
        width: 100%;
    }

    .activeClass {
        border: 1px solid#00bcbf !important;
        color: #00bcbf;
    }
}

</style>
