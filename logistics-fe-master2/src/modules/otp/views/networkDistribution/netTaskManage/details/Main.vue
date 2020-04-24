<template>
    <Paper>
        <div class="netTask-details">
            <el-main v-loading="taskDetailLoading">
                <div class="content">
                    <speed v-if="$route.query.orderType === 'PO'" :process="processPo"></speed>
                    <speed v-if="$route.query.orderType === 'RI'" :process="processRi"></speed>
                </div>
                <vehicle
                    :infoData="infoData"
                    @operation="operation"
                    @showAccessory ="showAccessory"
                    :merchant="true"
                    :showPhotos='true'
                    :emergenceFlag="emergenceFlag"
                    :scPosFlag="scPosFlag"
                    :specimenType="specimenType"
                    @showDispatchInfo="showDispatchInfo">
                </vehicle>
                <el-dialog :visible.sync="visible" :title="title">
                    <dialogTable
                        :tableData="logData"
                        :dialogTable="logTable"
                        ref="logData">
                    </dialogTable>
                </el-dialog>
                 <attachment-view ref='attachmentView'
                    @typeChange="viewTypeChange" v-if='netAttachmentShow' :attachmentShow.sync='netAttachmentShow'
                    :rowData='rowData'>
                </attachment-view>
            </el-main>
           <el-tabs v-model="activeName" @tab-click="handleTabClick" v-loading="taskItemsLoading">
            <el-tab-pane v-if="orderType === 'PO'" name="net">
             <span slot="label">网点签收</span>
                <el-row>
                    <el-col :span="8">
                        <strong>汇总: 实发{{signInfoData.netSendCount || 0 }} / 实收{{signInfoData.netReceiveCount || 0}} / 正品{{signInfoData.netRealReceive || 0}}</strong>
                    </el-col>
                    <el-col :span="8">
                        网点签收操作人: <span>{{signInfoData.networkReceiptName}}</span>
                    </el-col>
                    <el-col :span="8">
                        网点签收时间: <span>{{signInfoData.networkSignTime}}</span>
                    </el-col>
                </el-row>
                <table-info :tableColumns="netSignColumns" :tableData="netTaskItems" :tableConf="data.netSignColumns"></table-info>
                <paging-query :pager="searchParams" @query="getNetTaskItemsPage"/>
             </el-tab-pane>
            <el-tab-pane label="预约派工" name="appoint">
                <div class="appointment">
                    <el-row>
                        <el-col :span="10">预约时间: {{signInfoData.networkAppointmentStart}} ~ {{signInfoData.networkAppointmentEnd}}</el-col>
                        <el-col :span="10">预约备注: {{signInfoData.networkAppointmentRemark}}</el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="10">派工工程师: {{signInfoData.engineerName}}</el-col>
                        <el-col :span="10">工程师联系方式: {{signInfoData.engineerMobile}}</el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="10">派工备注: {{signInfoData.netDispatchRemark}}</el-col>
                    </el-row>
                </div>
            </el-tab-pane>
            <el-tab-pane label="终端签收" v-if="orderType === 'PO'" name="final">
                <el-row>
                     <el-col :span="8">
                        <strong>汇总: 实发{{signInfoData.finalSendCount || 0}} / 实收{{signInfoData.finalReceiveCount || 0}} / 正品{{signInfoData.finalRealReceive || 0}} /
                            异常{{signInfoData.finalAbnormalCount}}</strong>
                    </el-col>
                    <el-col :span="8">
                        终端签收操作人: <span>{{signInfoData.finalReceiptName}}</span>
                    </el-col>
                    <el-col :span="8">
                        终端签收时间: <span>{{signInfoData.finalSignTime}}</span>
                    </el-col>
                </el-row>
                <table-info :tableColumns="finalSignColumns" :tableData="netTaskItems" :tableConf="data.finalSignColumns"></table-info>
                <paging-query :pager="searchParams" @query="getNetTaskItemsPage"/>
            </el-tab-pane>
            <el-tab-pane label="网点入库" v-if="orderType === 'RI' || (+signInfoData.netRejectQty + signInfoData.finalRejectQty) > 0" name="in">
                  <el-row>
                     <el-col :span="8">
                        <strong>汇总: 网点拒收数量{{signInfoData.netRejectQty || 0}} / 终端拒收数量{{signInfoData.finalRejectQty || 0}} / 网点入库数量{{signInfoData.netStorageCount || 0}}</strong>
                    </el-col>
                    <el-col :span="8">
                        入库时间: <span>{{signInfoData.netInTime}}</span>
                    </el-col>
                    <el-col :span="8">
                        网点入库备注: <span>{{signInfoData.netInRemark}}</span>
                    </el-col>
                    <el-table :data="netTaskItems" border style="width: 100%" height="240">
                    <el-table-column prop="itemCode" label="商品编码"></el-table-column>
                    <el-table-column prop="itemName" label="商品名称"></el-table-column>
                    <el-table-column v-if="orderType === 'PO'" prop="netRejectQty" label="网点拒收数量"></el-table-column>
                    <el-table-column v-if="orderType === 'PO'" prop="finalRejectQty" label="终端拒收数量"></el-table-column>
                    <el-table-column v-if="orderType === 'RI'" prop="planQty" label="订单计划数量"></el-table-column>
                    <el-table-column prop="netStorageCount" label="网点入库总数"></el-table-column>
                </el-table>
                </el-row>
                <paging-query :pager="searchParams" @query="getNetTaskItemsPage"/>
            </el-tab-pane>
            <el-tab-pane label="网点出库" v-if="orderType === 'RI' || (+signInfoData.netRejectQty + signInfoData.finalRejectQty) > 0" name="out">
                 <el-row>
                     <el-col :span="8">
                        <strong>汇总: 网点入库数量{{signInfoData.netStorageCount || 0}} / 网点出库数量{{signInfoData.netOutletsCount || 0}}</strong>
                    </el-col>
                    <el-col :span="8">
                        出库时间: <span>{{signInfoData.netOutTime}}</span>
                    </el-col>
                    <el-col :span="8">
                        网点出库备注: <span>{{signInfoData.netOutRemark}}</span>
                    </el-col>
                     <table-info :tableColumns="netOutColumns" :tableData="netTaskItems" :tableConf="data.netOutColumns"></table-info>
                     <paging-query :pager="searchParams" @query="getNetTaskItemsPage"/>
                </el-row>
            </el-tab-pane>
        </el-tabs>
        </div>
    </Paper>
</template>
<script>
import Paper from '@/components/core/paper/Paper';
import Speed from '../../../../components/speed/speed.vue';
import Vehicle from '../../../../components/speed/Vehicle';
import data from './data.js';
import _ from '@/components/lots/utils';
import { taskDetail, netTaskItemsPage, netOrderLogs } from '../../../../api/netTaskManage.js';
import TableInfo from '../../components/SimpleTable/Table';
import PagingQuery from '../../components/page/PagingQuery';
import dialogTable from '../../../../components/dialog/dialogTable';
import AttachmentView from '../index/AttachmentView';
export default {
    name: 'netTaskDetails',
    components: { Paper, Speed, Vehicle, TableInfo, PagingQuery, dialogTable, AttachmentView },
    data() {
        return {
            processPo: {},
            processRi: {},
            infoData: [],
            netSignColumns: [],
            finalSignColumns: [],
            netOutColumns: [],
            logTable: [],
            detailsData: {},
            data,
            netTaskItems: [],
            orderType: '',
            visible: false,
            netAttachmentShow: false,
            type: '1',
            rowData: {},
            emergenceFlag: 0,
            scPosFlag: 0,
            specimenType: 0,
            title: '操作日志',
            logData: [],
            searchParams: { pageTotal: 0, pageNo: 1, pageSize: 10 },
            netPagesParams: { pageTotal: 0, pageNo: 1, pageSize: 10 },
            finalPagesParams: { pageTotal: 0, pageNo: 1, pageSize: 10 },
            inPagesParams: { pageTotal: 0, pageNo: 1, pageSize: 10 },
            outPagesParams: { pageTotal: 0, pageNo: 1, pageSize: 10 },
            signInfoData: {
                netSendCount: 0,
                netReceiveCount: 0,
                netRealReceive: 0,
                networkReceiptName: '',
                networkSignTime: '',
                networkSignRemark: '',
                networkAppointmentStart: '',
                networkAppointmentEnd: '',
                networkAppointmentRemark: '',
                engineerName: '',
                engineerMobile: '',
                finalSendCount: 0,
                finalReceiveCount: 0,
                finalRealReceive: 0,
                finalAbnormalCount: 0,
                finalReceiptName: '',
                finalSignTime: '',
                finalSignRemark: '',
                netRejectQty: 0,
                finalRejectQty: 0,
                netOutletsCount: 0,
                netStorageCount: 0,
                netInTime: '',
                netInRemark: '',
                netOutTime: '',
                netOutRemark: '',
                netDispatchRemark: ''
            },
            activeName: 'appoint',
            taskDetailLoading: false,
            taskItemsLoading: false
        };
    },
    methods: {
        operation() {
            this.visible = true;
            const logParams = { OrderNo: this.$route.query.orderNo };
            netOrderLogs(logParams).then(res => {
                this.logData = res.data.list;
            });
        },
        showAccessory() {
            this.netAttachmentShow = true;
        },
        viewTypeChange (type) {
            this.type = type;
        },
        showDispatchInfo() {},
        formatNull(val) {
            return val || '--';
        },
        objKeysVal(targetObj, sourceObj) {
            Object.keys(targetObj).forEach(key => {
                if (sourceObj.hasOwnProperty(key)) {
                    targetObj[key] = sourceObj[key];
                } else {
                    targetObj[key] = '';
                }
            });
            return targetObj;
        },
        getDetails(params) {
            const that = this;
            const git = function(num) {
                return that.infoData[num].subItems;
            };
            this.taskDetailLoading = true;
            taskDetail(params).then(res => {
                this.taskDetailLoading = false;
                if (res) {
                    this.detailsData = res.data;
                    this.rowData = res.data;
                    this.rowData.isShowUpload = true;
                    this.orderType = this.detailsData.orderType;
                    const orderStatus = +res.data.orderStatus;
                    const statusActions = this.data.statusActions;
                    if (this.orderType === 'PO') {
                        this.processPo.orderNo = params.orderNo;
                        this.processPo.title = res.data.orderStatusName;
                        this.processPo.step.map(item => {
                            item.id = '0';
                            item.carTimes = '';
                        });
                        if (statusActions[this.orderType].hasOwnProperty(orderStatus)) {
                            statusActions[this.orderType][orderStatus].forEach(item => {
                                this.processPo.step[item.index].id = '1';
                                this.processPo.step[item.index].carTimes = this.detailsData[item.propTime];
                                if (this.orderType === 'PO') {
                                    if (+item.index === 1) {
                                        this.processPo.step[item.index].carTimes = `要求：${this.formatNull(this.detailsData.networkSignPlanTime)} 实际：${this.formatNull(this.detailsData[item.propTime])}`;
                                    } else if (+item.index === 3) {
                                        this.processPo.step[item.index].carTimes = `要求：${this.formatNull(this.detailsData.finalSignPlanTime)} 实际：${this.formatNull(this.detailsData[item.propTime])}`;
                                    }
                                }
                            });
                        }
                    } else if (this.orderType === 'RI') {
                        this.processRi.orderNo = params.orderNo;
                        this.processRi.title = res.data.orderStatusName;
                        this.processRi.step.map(item => {
                            item.id = '0';
                            item.carTimes = '';
                        });
                        if (statusActions[this.orderType].hasOwnProperty(orderStatus)) {
                            statusActions[this.orderType][orderStatus].forEach(item => {
                                this.processRi.step[item.index].id = '1';
                                this.processRi.step[item.index].carTimes = this.detailsData[item.propTime];
                            });
                        }
                    }
                    this.objKeysVal(this.signInfoData, this.detailsData);
                    this.orderStatus = this.detailsData.orderStatus;
                    git(0)[0].value = this.formatNull(this.detailsData.orderTypeName);
                    git(0)[1].value = this.formatNull(this.detailsData.businessMode);
                    git(0)[2].value = this.formatNull(this.detailsData.remark);
                    git(1)[0].value = this.formatNull(this.detailsData.customerOrderNo);
                    git(1)[1].value = this.formatNull(this.detailsData.customerName);
                    git(1)[2].value = this.formatNull(this.detailsData.networkSignPlanTime);
                    git(2)[0].value = this.formatNull(this.detailsData.totalQty);
                    git(2)[1].value = this.formatNull(this.detailsData.taskTotalVolume);
                    git(2)[2].value = this.formatNull(this.detailsData.totalGrossWeight);
                    git(3)[0].value = this.formatNull(this.detailsData.tonetSiteName);
                    git(3)[1].value = this.formatNull(this.detailsData.fromDispatchNo);
                    git(3)[2].value = this.formatNull(this.detailsData.distributionFlagName);
                    git(4)[0].value = this.formatNull(this.detailsData.networkCode) + ' ~ ' + this.formatNull(this.detailsData.networkName);
                    git(4)[1].value = this.formatNull(this.detailsData.netTaskAddress.networkContact);
                    git(4)[2].value = this.formatNull(this.detailsData.netTaskAddress.networkAddr);
                    git(5)[0].value = this.formatNull(this.detailsData.receiverName);
                    git(5)[1].value = this.formatNull(this.detailsData.receiverTel);
                    git(5)[2].value = this.formatNull(this.detailsData.receiverDetailAddr);
                    if (this.detailsData.orderType === 'RI') {
                        this.infoData[5].title = '提货信息';
                        git(5)[0].label = '提货联系人';
                        git(5)[1].label = '提货联系方式';
                        git(5)[2].label = '提货地址';
                        git(5)[0].value = this.formatNull(this.detailsData.senderName);
                        git(5)[1].value = this.formatNull(this.detailsData.senderTel);
                        git(5)[2].value = this.formatNull(this.detailsData.senderDetailAddr);
                        git(1)[2].label = '上门取件应完成时间';
                        git(1)[2].value = this.formatNull(this.detailsData.requiredPickTime);
                        if (git(1)[3]) { git(1).pop(); }
                    } else {
                        this.infoData[5].title = '收货信息';
                        git(5)[0].label = '收货联系人';
                        git(5)[1].label = '收货联系方式';
                        git(5)[2].label = '收货地址';
                        git(1)[2].label = '要求网点签收时间';
                        if (!git(1)[3]) {
                            git(1).push({
                                label: '要求终端签收时间',
                                value: ''
                            });
                        }
                        git(1)[3].value = this.formatNull(this.detailsData.finalSignPlanTime);
                    }
                }
            }).catch(() => {
                this.taskDetailLoading = false;
            });
        },
        getNetTaskItemsPage() {
            const params = {
                orderNo: this.$route.query.orderNo,
                ...this.searchParams
            };
            this.taskItemsLoading = true;
            netTaskItemsPage(params).then(res => {
                this.taskItemsLoading = false;
                if (res) {
                    res.data.list.map(item => {
                        if (!item.finalRealReceive) item.finalRealReceive = 0;
                        if (!item.finalMildewPollute) item.finalMildewPollute = 0;
                        if (!item.finalPackageDamaged) item.finalPackageDamaged = 0;
                        if (!item.finalStockoutCount) item.finalStockoutCount = 0;
                        if (!item.finalRejectQty) item.finalRejectQty = 0;
                        if (!item.netRealReceive) item.netRealReceive = 0;
                        if (!item.netMildewPollute) item.netMildewPollute = 0;
                        if (!item.netPackageDamaged) item.netPackageDamaged = 0;
                        if (!item.netStockoutCount) item.netStockoutCount = 0;
                        if (!item.netRejectQty) item.netRejectQty = 0;
                        if (!item.netStorageCount) item.netStorageCount = 0;
                        if (!item.netOutletsCount) item.netOutletsCount = 0;
                    });
                    this.netTaskItems = res.data.list || [];
                    if (this.activeName !== 'appoint') this.searchParams.pageTotal = res.data.totalCount;
                }
            }).catch(() => {
                this.taskItemsLoading = false;
            });
        },
        handleTabClick() {
            if (this.activeName !== 'appoint') {
                this.searchParams = this[this.data.detailTabActions[this.activeName]];
                this.getNetTaskItemsPage();
            }
        }
    },
    created() {
        this.processPo = _.clone(data.processPo);
        this.processRi = _.clone(data.processRi);
        this.processPo.title = this.processRi.title = '';
        this.infoData = _.clone(data.infoData);
        this.netSignColumns = data.netSignColumns.columns;
        this.finalSignColumns = data.finalSignColumns.columns;
        this.netOutColumns = data.netOutColumns.columns;
        this.logTable = data.logTable;
    },
    mounted() {
        this.getDetails({ orderNo: this.$route.query.orderNo });
        this.getNetTaskItemsPage();
    },
    activated() {
        this.getDetails({ orderNo: this.$route.query.orderNo });
        this.getNetTaskItemsPage();
    }
};
</script>
<style lang="less">
.netTask-details {
    .content {
        height: 130px;
    }
    .el-row{
        .el-col{
                color: #666;
                font-size: 13px;
                margin-bottom: 10px;
        }
    }
    .el-pagination{
        float: right;
        margin-top: 10px;
    }
    .appointment {
        height: 300px;
    }
    .dialogTable {
        overflow: hidden;
        .dialogTablePagination{
            position:relative;
         }
}
}
</style>