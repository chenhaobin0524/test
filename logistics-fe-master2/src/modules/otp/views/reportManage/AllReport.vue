<template>
    <div class="flex-layout all-report">
        <list-layout-paper>
            <div slot="header-search" class="header-search">
                <div class="inlineBlock">
                    <otpAdvance
                    @getAdvanceValue="getAdvanceValue"
                    :mValue="warehouseName"
                    :params="options.customerWhCode"
                    ></otpAdvance>
                </div>
                <el-date-picker v-model="date" size="mini" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" class="query"></el-date-picker>
                <el-select v-model="orderStatus" placeholder="订单状态" clearable>
                    <el-option v-for="item in options.orderStatus" :value="item.value" :label="item.label" :key="item.value"></el-option>
                </el-select>
                <span v-has="'08000001'" class="query">
                    <el-button type="primary" size="mini" @click="nomalQuery" :disabled="loading">查 询</el-button>
                </span>
                <span v-has="'08000002'">
                    <search-set :searchTotalTitle="searchTotalTitle" @search="highQuery" class="search-set"></search-set>
                </span>
            </div>
            <div slot="header-button" v-has="'08000003'">
                <el-button type="primary" size="mini" @click="handleExport">导 出</el-button>
            </div>
            <div slot="list" slot-scope="props">
                <el-table border :data="userData" :height="props.tableHeight" :header-cell-style="tableHeaderColor" v-loading="loading">
                    <el-table-column prop="siteName" label="服务平台" width="150"></el-table-column>
                    <el-table-column prop="customerName" label="客户名称" width="150"></el-table-column>
                    <el-table-column prop="shopName" label="店铺名称" width="150"></el-table-column>
                    <el-table-column prop="orderType" label="订单类型" width="150">
                        <template slot-scope="scope">
                            {{getOptionLabelWithValue(options.orderType, scope.row.orderType)}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="orderNo" label="安得订单号" width="150"></el-table-column>
                    <el-table-column prop="customerOrderNo" label="客户订单号" width="150"></el-table-column>
                    <el-table-column prop="orderStatus" label="订单当前状态" width="100"></el-table-column>
                    <el-table-column prop="excuteStatus" label="订单执行状态" width="100"></el-table-column>
                    <el-table-column prop="inWhName" label="入库仓名称" width="150"></el-table-column>
                    <el-table-column prop="outWhName" label="出库仓名称" width="150"></el-table-column>
                    <el-table-column label="入库时间" width="150">
                        <template slot-scope="scope">
                            {{formatDate(scope.row.inTime)}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="receiverName" label="收货人" width="100"></el-table-column>
                    <el-table-column prop="receiverMobile" label="收货人手机" width="150"></el-table-column>
                    <el-table-column prop="receiverProvinceName" label="省" width="150"></el-table-column>
                    <el-table-column prop="receiverCityName" label="市" width="150"></el-table-column>
                    <el-table-column prop="receiverDistrictName" label="区/县" width="150"></el-table-column>
                    <el-table-column prop="receiverDetailAddr" label="详细地址" width="280"></el-table-column>
                    <el-table-column label="支付时间" width="150">
                        <template slot-scope="scope">
                            {{formatDate(scope.row.payDate)}}
                        </template>
                    </el-table-column>
                    <el-table-column label="订单生成时间" width="150">
                        <template slot-scope="scope">
                            {{formatDate(scope.row.orderCreateTime)}}
                        </template>
                    </el-table-column>
                    <el-table-column label="仓库接单时间" width="150">
                        <template slot-scope="scope">
                            {{formatDate(scope.row.wmsCreateTime)}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="upperCarrierCode" label="上游指定快递" width="150"></el-table-column>
                    <el-table-column prop="carrierCode" label="快递公司" width="150"></el-table-column>
                    <el-table-column label="发货时间" width="150">
                        <template slot-scope="scope">
                            {{formatDate(scope.row.shipTime)}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="waybillNo" label="快递单号" width="150"></el-table-column>
                    <el-table-column prop="itemCode" label="商品编码" width="150"></el-table-column>
                    <el-table-column prop="itemName" label="商品名称" width="150"></el-table-column>
                    <el-table-column prop="itemStatus" label="商品状态" width="150"></el-table-column>
                    <el-table-column prop="itemClass" label="商品类别" width="150"></el-table-column>
                    <el-table-column prop="actualQty" label="实际发货数" width="150"></el-table-column>
                    <el-table-column prop="volume" label="体积" width="150"></el-table-column>
                    <el-table-column prop="singleWeight" label="重量" width="150"></el-table-column>
                    <el-table-column prop="price" label="单价" width="150"></el-table-column>
                    <el-table-column prop="sourceSystem" label="订单来源" width="150"></el-table-column>
                    <el-table-column prop="originOrderNo" label="订单来源号" width="150"></el-table-column>
                    <el-table-column prop="length" label="长" width="150"></el-table-column>
                    <el-table-column prop="width" label="宽" width="150"></el-table-column>
                    <el-table-column prop="height" label="高" width="150"></el-table-column>
                    <el-table-column prop="totalQty" label="计划数量" width="150"></el-table-column>
                </el-table>
            </div>
            <el-pagination slot="footer"
                    :current-page="currentPage"
                    :page-sizes="[10, 20, 30, 50, 100]"
                    :page-size="10" layout="total, sizes, prev, pager, next, jumper"
                    :total="total"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange">
            </el-pagination>
        </list-layout-paper>
    </div>
</template>
<script>
import utils from '@/utils/common';
import { getAllReportList, exportAllReportList, getSystemList } from '../../api/reportManage.js';
import listLayoutPaper from '@/components/lots/listLayout/Paper';
import options from './components/optionApi.js';
import SearchSet from './components/SearchSet';
import otpAdvance from '@/components/lots/otpAdvance';
export default {
    name: 'allReport',
    components: { listLayoutPaper, SearchSet, otpAdvance },
    data() {
        return {
            warehouseName: '',
            warehouseCode: '',
            date: [],
            orderStatus: '',
            dialogUserVisible: false,
            currentPage: 1,
            pageSize: 10,
            total: 0,
            options: options,
            userData: [],
            form: {},
            rules: {},
            queryParams: {},
            loading: false,
            searchTotalTitle: [{
                name: '订单生成时间',
                value: 'date',
                type: 'time',
                select: true
            }, {
                name: '服务平台',
                value: 'siteName',
                type: 'advance',
                select: true,
                options: options.serviceTypeCode
            }, {
                name: '仓库',
                advanceLabel: '仓库',
                value: 'whName',
                type: 'advance',
                select: true,
                advanceConfig: [
                    { 'prop': 'cdwhName', 'value': '仓库名称' },
                    { 'prop': 'whCode', 'value': '仓库编码' }
                ],
                tableConfig: [
                    { 'prop': 'whCode', 'value': '仓库编码' },
                    { 'prop': 'cdwhName', 'value': '仓库名称' }
                ],
                advanceUrl: 'cdWarehouse/search?cdwhIsStop=0',
                advanceCascade: 'siteCode',
                cbParams: [
                    'whCode', 'cdwhName#whName'
                ]
            }, {
                name: '客户',
                value: 'customerName',
                type: 'advance',
                unfold: true,
                advanceConfig: [
                    { 'prop': 'ebcuNameCn', 'value': '客户名称' },
                    { 'prop': 'pmCode', 'value': '客户编码' }
                ],
                tableConfig: [
                    { 'prop': 'pmCode', 'value': '客户编码' },
                    { 'prop': 'ebcuNameCn', 'value': '客户名称' }
                ],
                advanceUrl: '/ebCustomer/searchByEbCustomer',
                cbParams: ['pmCode#customerCode', 'ebcuNameCn#customerName'],
                advanceCode: 'advanceCode',
                span: 4
            }, {
                name: '客户订单号',
                value: 'customerOrderNo',
                type: 'input',
                select: true
            }, {
                name: '订单类型',
                value: 'orderType',
                type: 'select',
                options: options.orderType,
                select: false
            }, {
                name: '快递单号',
                value: 'waybillNo',
                type: 'input',
                select: false
            }, {
                name: '承运商',
                value: 'carrierCode',
                type: 'advance',
                select: false,
                options: options.customerOrderNoCode
            }, {
                name: '安得订单号',
                value: 'orderNo',
                type: 'input',
                select: true
            }, {
                name: '商品',
                value: 'itemName',
                type: 'advance',
                unfold: true,
                advanceConfig: [
                    { 'prop': 'cdcmNameCn', 'value': '商品名称' },
                    { 'prop': 'cdcmCustMaterialNo', 'value': '商品编码' }
                ],
                tableConfig: [
                    { 'prop': 'cdcmNameCn', 'value': '商品名称' },
                    { 'prop': 'cdcmCustMaterialNo', 'value': '商品编码' }
                ],
                advanceUrl: '/cdCommonMaterial/searchByMaterial',
                // advanceCascade: 'siteCode',
                cbParams: [
                    'cdcmNameCn#itemName', 'cdcmCustMaterialNo#itemCode'
                ]
            }, {
                name: '订单当前状态',
                value: 'orderStatus',
                type: 'select',
                options: options.orderStatus,
                select: false
            }, {
                name: '订单执行状态',
                value: 'excuteStatus',
                type: 'select',
                options: options.excuteStatus,
                select: false
            }, {
                name: '发货时间',
                value: 'sendDate',
                type: 'time',
                select: false
            }, {
                name: '仓库接单时间',
                value: 'receiveDate',
                type: 'time',
                select: false
            }, {
                name: '订单来源',
                value: 'sourceSystem',
                type: 'select',
                options: options.ediId,
                select: false
            }]
        };
    },
    methods: {
        handleReset() {
            this.$refs['form'].resetFields();
            this.form = {};
            this.date = [];
            this.warehouseCode = '';
            this.orderStatus = '';
        },
        handleQuery(p) {
            const params = p || {};
            params.pageNo = this.currentPage;
            params.pageSize = this.pageSize;
            this.queryParams = params;
            this.loading = true;
            getAllReportList(params).then(res => {
                this.loading = false;
                if (res.data) {
                    this.userData = res.data.list;
                    this.total = res.data.totalCount;
                } else {
                    this.userData = [];
                    this.total = 0;
                }
            }).catch(err => {
                err.msg = '';
                this.loading = false;
            });
        },
        nomalQuery() {
            const params = {};
            if (this.date && this.date.length === 2) {
                params.orderStartTime = this.formatDate(this.date[0]);
                params.orderEndTime = this.formatDate(this.date[1]);
                if (!this.checkTime(params.orderStartTime, params.orderEndTime)) return;
            } else {
                this.$message.error('请选择时间范围');
                return;
            }
            if (this.warehouseCode && this.warehouseCode.length > 0) {
                params.whCode = this.warehouseCode;
            }
            if (this.orderStatus && this.orderStatus.length > 0) {
                params.orderStatus = this.orderStatus;
            }
            this.currentPage = 1;
            this.handleQuery(params);
        },
        highQuery(p) {
            const str = JSON.stringify(p);
            const params = JSON.parse(str);
            if (params.date && params.date.length === 2) {
                params.orderStartTime = this.formatDate(params.date[0]);
                params.orderEndTime = this.formatDate(params.date[1]);
                delete params.date;
                if (!this.checkTime(params.orderStartTime, params.orderEndTime)) return;
            } else {
                this.$message.error('请选择订单生成时间');
                return;
            }
            if (params.receiveDate && params.receiveDate.length === 2) {
                params.wmsCreateStartTime = this.formatDate(params.receiveDate[0]);
                params.wmsCreateEndTime = this.formatDate(params.receiveDate[1]);
                if (!this.checkTime(params.wmsCreateStartTime, params.wmsCreateEndTime)) return;
                delete params.receiveDate;
            }
            if (params.sendDate && params.sendDate.length === 2) {
                params.shipStartTime = this.formatDate(params.sendDate[0]);
                params.shipEndTime = this.formatDate(params.sendDate[1]);
                if (!this.checkTime(params.shipStartTime, params.shipEndTime)) return;
                delete params.sendDate;
            }
            if (params.whCode && params.whCode.length > 0) {
                delete params.whName;
            }
            this.currentPage = 1;
            this.handleQuery(params);
        },
        handleExport() {
            const params = this.queryParams;
            var arr = Object.keys(params);
            if (arr.length === 0) {
                if (this.date && this.date.length === 2) {
                    params.orderStartTime = this.formatDate(this.date[0]);
                    params.orderEndTime = this.formatDate(this.date[1]);
                    if (!this.checkTime(params.orderStartTime, params.orderEndTime)) return;
                } else {
                    this.$message.error('请选择时间范围');
                    return;
                }
            }
            if (params.orderStartTime === undefined || params.orderStartTime.length === 0 || params.orderEndTime === undefined || params.orderEndTime.length === 0) {
                this.$message.error('请选择时间范围');
                return;
            }
            if (!this.checkTime(params.orderStartTime, params.orderEndTime)) return;
            delete params['pageNo'];
            delete params['pageSize'];
            exportAllReportList(params).then(res => {
                const blob = new Blob([res], { type: 'application/x-excel;charset=UTF-8' });
                const objectUrl = URL.createObjectURL(blob);
                var a = document.createElement('a');
                a.href = objectUrl;
                a.download = '订单全流程数据_' + utils.formatShortDateTime() + '.xlsx';
                a.click();
            });
        },
        tableHeaderColor({ row, column, rowIndex, columnIndex }) {
            if (rowIndex === 0) {
                return 'background-color: #f1f1f1';
            }
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.handleQuery(this.queryParams);
        },
        handleSizeChange(val) {
            this.pageSize = val;
            this.handleQuery(this.queryParams);
        },
        formatDate(timeString) {
            if (timeString !== null && timeString !== undefined && timeString !== '') {
                return utils.formatDateTime(timeString);
            } else {
                return '';
            }
        },
        checkTime(start, end) {
            const startTimestamp = new Date(start).getTime();
            const endTimestamp = new Date(end).getTime();
            const timeInterval = endTimestamp - startTimestamp;
            if (timeInterval > 1000 * 60 * 60 * 24 * 31) {
                this.$message.error('时间范围不能超过31天');
                return false;
            }
            return true;
        },
        getOptionLabelWithValue(ops, val) {
            const opt = ops.find(item => {
                return item.value === val;
            });
            if (typeof opt !== 'undefined') {
                return opt.label;
            }
            return val;
        },
        getAdvanceValue(data) {
            this.warehouseCode = data.whCode;
            this.warehouseName = data.whName;
        }
    },
    mounted() {
        const params = {};
        params.dictCodes = 'SOURCE_SYSTEM';
        getSystemList(params).then(res => {
            const option = [];
            for (const key in res.data.SOURCE_SYSTEM) {
                if (res.data.SOURCE_SYSTEM.hasOwnProperty(key)) {
                    option.push({ 'value': key, 'label': res.data.SOURCE_SYSTEM[key] });
                }
            }
            this.options.ediId = option;
        });
    }
};

</script>
<style lang="less">
.all-report {
    overflow: hidden;
    .search-set {
        margin-left: 10px;
    }
    .query {
        margin-left: 10px;
    }
    .inlineBlock {
        display: inline-block;
        width: 170px;
    }
    .header-search{
        display: flex;
        align-items: center;
    }
}
</style>
