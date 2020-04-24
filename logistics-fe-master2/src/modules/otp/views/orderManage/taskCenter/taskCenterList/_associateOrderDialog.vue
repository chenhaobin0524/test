<template>
    <el-dialog
        title="关联协同"
        :visible.sync="visiable"
        :append-to-body="true"
        width="1100px">
        <el-form :inline="true" :model="formInline" class="associate-form">
            <el-form-item label="客户订单号">
                <el-input v-model="formInline.customerOrderNo" placeholder="客户订单号" clearable></el-input>
            </el-form-item>
            <el-form-item label="客户">
                <otpAdvance
                    :params="config.customer"
                    @getAdvanceValue="_updateProps"
                    :mValue="formInline.customerCodeName"
                ></otpAdvance>
            </el-form-item>
            <el-form-item label="时间">
                <el-date-picker
                    class='text-box'
                    v-model="createdStartTime"
                    type="datetimerange"
                    format="yyyy-MM-dd HH:mm:ss"
                    :picker-options="pickerOptions"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    align="right"
                    :default-time="['00:00:00', '23:59:59']">
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSearch">查询</el-button>
            </el-form-item>
        </el-form>
        <el-table
            ref="singleTable"
            :data="tableList"
            v-loading="loading"
            highlight-current-row
            @current-change="handleCurrentChange"
            style="width: 100%;"
            height="400px">
            <el-table-column
            property="customerOrderNo"
            label="客户订单号"
            width="250">
            </el-table-column>
            <el-table-column
            property="taskNo"
            label="任务号"
            width="250">
            </el-table-column>
            <el-table-column
            property="customerName"
            label="客户名称">
            </el-table-column>
            <el-table-column
            property="taskTypeName"
            label="任务类型"
            width="150">
            </el-table-column>
            <el-table-column
            property="whName"
            label="仓库名称"
            width="120">
            </el-table-column>
        </el-table>
        <div style="text-align: right;">
            <el-pagination
                layout="total, prev, pager, next"
                :current-page.sync="searchParams.pageNo"
                :page-size="searchParams.pageSize"
                :total="totalCount"
                @current-change="handleCurrentPageChange">
            </el-pagination>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="close">取 消</el-button>
            <el-button type="primary" @click="submit" v-loading="btnLoading">确 定</el-button>
        </span>
    </el-dialog>
</template>
<script>
import {
    searchTaskOutList,
    associatedCooperativeOrder
} from '../../../../api/taskCenter';
import otpAdvance from '@/components/lots/otpAdvance';
import { dateTimes } from '../../../../judge/configCenter';
import moment from 'moment';
export default {
    components: { otpAdvance },
    data() {
        return {
            visiable: false,
            btnLoading: false,
            loading: false,
            tableList: [],
            currentRow: null,
            totalCount: 0,
            createdStartTime: [],
            config: {
                customer: {
                    advanceLabel: '客户',
                    advanceConfig: [
                        { prop: 'ebcuNameCn', value: '客户名称' },
                        { prop: 'pmCode', value: '客户编码' }
                    ],
                    tableConfig: [
                        { prop: 'pmCode', value: '客户编码' }, //  显示列数
                        { prop: 'ebcuNameCn', value: '客户名称' }
                    ],
                    advanceUrl: '/ebCustomer/searchByEbCustomer',
                    cbParams: ['pmCode#customerCode', 'ebcuNameCn#customerCodeName']
                }
            },
            formInline: {
                customerOrderNo: '',
                customerCode: ''
            },
            searchParams: {
                pageNo: 1,
                pageSize: 10
            },
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() > Date.now();
                },
                shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                        const start = moment().startOf('day').subtract(6, 'd').toDate();
                        const end = moment().endOf('day').toDate();
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近一个月',
                    onClick(picker) {
                        const start = moment().startOf('day').subtract(1, 'M').toDate();
                        const end = moment().endOf('day').toDate();
                        picker.$emit('pick', [start, end]);
                    }
                }]
            }
        };
    },
    methods: {
        startTime() {
            const startDate = moment().startOf('day').subtract(7, 'd').toDate();
            const endDate = moment().endOf('day').toDate();
            this.createdStartTime = [];
            this.createdStartTime.push(startDate);
            this.createdStartTime.push(endDate);
        },
        _updateProps(data) {
            this.formInline = { ...this.formInline, ...data };
        },
        async fetchData(taskNo) {
            this.loading = true;
            let createStartTime, createEndTime;
            // 时间
            if (this.createdStartTime && this.createdStartTime.length) {
                createStartTime = dateTimes(this.createdStartTime[0]);
                createEndTime = dateTimes(this.createdStartTime[1]);
            }
            const params = {
                taskNo,
                ...this.searchParams,
                ...this.formInline,
                createStartTime,
                createEndTime
            };
            delete params.customerCodeName;
            const res = await searchTaskOutList(params);
            if (res && res.code === '0') {
                this.tableList = res.data.list;
                this.totalCount = res.data.totalCount;
            }
            this.loading = false;
        },
        show(status = true, taskNo) {
            if (taskNo) {
                this.startTime();
                this.fetchData(taskNo);
            }
            this.taskNo = taskNo;
            this.visiable = status;
        },
        handleCurrentChange(val) {
            this.currentRow = val;
        },
        handleCurrentPageChange(val) {
            this.searchParams.pageNo = val;
            this.fetchData(this.taskNo);
        },
        onSearch() {
            this.searchParams.pageNo = 1;
            if (!this.createdStartTime && !this.formInline.customerOrderNo) {
                this.$message.warning('客户订单号 或 时间不可为空！');
                this.loading = false;
                return;
            }
            this.fetchData(this.taskNo);
        },
        async submit() {
            if (!this.currentRow) {
                this.$message.warning('未选中关联的仓库');
                return;
            }
            const res = await associatedCooperativeOrder({
                outTaskNo: this.currentRow.taskNo,
                inTaskNo: this.taskNo
            });
            if (res && res.code === '0') {
                this.$message.success('关联成功');
                this.visiable = false;
                this.createdStartTime = [];
            }
        },
        close() {
            this.visiable = false;
        }
    },
    created() {
        this.startTime();
    }
};
</script>
<style lang="less">
.associate-form {
    .el-form-item__content .el-input-group {
        vertical-align: middle;
    }
    .text-box {
        position: relative;
        font-size: 12px;
        width: 320px;
    }
}
</style>