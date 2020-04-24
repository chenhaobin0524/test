<template>
    <div class="vehicleNode tabContent">
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
            <div style="float: right">
                <el-tooltip effect='dark' content='导出' placement='bottom'>
                    <el-button icon='el-icon-download' size='mini' @click='downLoad'></el-button>
                </el-tooltip>
            </div>
        </el-row>
        <div class="table-content" style="margin-top: 10px;">
            <el-table
                ref='table'
                :data="tableData"
                style="width: 100%"
                border
                v-loading='loading'
                @selection-change='selectionChange'
                >
                <el-table-column type="selection" width="40" fixed></el-table-column>
                <el-table-column prop="bookingTypeText" label="作业类型" fixed show-overflow-tooltip></el-table-column>
                <el-table-column prop="vehicleNo" label="车牌" show-overflow-tooltip width='100'></el-table-column>
                <el-table-column prop="sendSite" label="合作方" show-overflow-tooltip width='150'></el-table-column>
                <el-table-column prop="crenelName" label="垛口" show-overflow-tooltip></el-table-column>
                <el-table-column label="提卸量" show-overflow-tooltip>
                    <template slot-scope='{row}'>
                        <div :class="{notData: row.numberOfUnits === undefined}">
                            {{row.numberOfUnits}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="预约提卸" show-overflow-tooltip width='150'>
                    <template slot-scope='{row}'>
                        <div :class="{notData: row.bookingTime === undefined}">
                            {{row.bookingTime}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="预约回复" show-overflow-tooltip width='150'>
                    <template slot-scope='{row}'>
                        <div :class="{notData: row.confirmTime === undefined}">
                            {{row.confirmTime}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="入园" show-overflow-tooltip width='150'>
                    <template slot-scope='{row}'>
                        <div :class="{notData: row.timeParkCarIn === undefined}">
                            {{row.timeParkCarIn}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="靠垛" show-overflow-tooltip width='150'>
                    <template slot-scope='{row}'>
                        <div :class="{notData: row.timeLocStart === undefined}">
                            {{row.timeLocStart}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="开始装卸" show-overflow-tooltip width='150'>
                    <template slot-scope='{row}'>
                        <div :class="{notData: row.timeCarStart === undefined}">
                            {{row.timeCarStart}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="结束装卸" show-overflow-tooltip width='150'>
                    <template slot-scope='{row}'>
                        <div :class="{notData: row.timeCarEnd === undefined}">
                            {{row.timeCarEnd}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="离垛" show-overflow-tooltip width='150'>
                    <template slot-scope='{row}'>
                        <div :class="{notData: row.timeLocEnd === undefined}">
                            {{row.timeLocEnd}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="出园" show-overflow-tooltip width='150'>
                    <template slot-scope='{row}'>
                        <div :class="{notData: row.timeParkCarOut === undefined}">
                            {{row.timeParkCarOut}}
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <!-- 分页 -->
        <div class="selection-pagination">
            <div class="page-text">
                已选<span class="text-color">{{checkedNum}}</span>项
            </div>
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
            checkedNum: 0,
            checkedData: [],
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
            searchData: {
                vehicleNo: '',
                appointmentTime: []
            },
            tableData: [],
            loading: false,
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
        downLoad() {
            if (!this.checkedData.length) {
                this.$message({
                    type: 'warning',
                    message: '请选择需要导出的数据!'
                });
                return false;
            }
            // , 隔开一个单元格 \t 防止科学计数法显示或其他格式 \n 换行
            let exportData = '作业类型,车牌,合作方,垛口,提卸量,预约提卸,预约回复,入园,靠垛,开始装卸,结束装卸,离垛,出园\n';
            const keys = [
                'bookingTypeText',
                'vehicleNo',
                'sendSite',
                'crenelName',
                'numberOfUnits',
                'bookingTime',
                'confirmTime',
                'timeParkCarIn',
                'timeLocStart',
                'timeCarStart',
                'timeCarEnd',
                'timeLocEnd',
                'timeParkCarOut'
            ];
            this.checkedData.forEach(item => {
                keys.forEach(key => {
                    exportData += item[key] === undefined ? ',' : item[key] + '\t,';
                });
                exportData += '\n';
            });
            // encodeURIComponent解决中文乱码
            const uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(exportData);

            const link = document.createElement('a');
            link.href = uri;
            link.download = '车辆节点导出数据.csv';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            this.$refs.table.clearSelection();
        },
        // 获取表格选中数据
        selectionChange(data) {
            this.checkedData = data;
            this.checkedNum = data.length;
        },
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
            api.mobileBooking(params).then(res => {
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
.vehicleNode {

    .table-content {
        height: calc(100vh - 201px);
        overflow-y: auto;
    }
    .notData {
        height: 23px;
        background-color: #ececec;
    }
    .selection-pagination {
        margin-top: 10px;
        display: flex;
        justify-content: space-between;
    }
    .page-text {
        font-size: 12px;

        .text-color {
            color: #00BCBF;
            padding: 0 10px;
        }
    }
}
</style>
