<template>
    <Paper>
        <div class="departure" id="orderCenterDetail" v-loading="isLoading">
            <div class="content">
                <speed :process="process"></speed>
            </div>
            <Vehicle
                :infoData="infoData"
                @operation="operation"
                @handleInfoClick="adjustMipBtn"
                :showTip="true"
                :showSmallPiece="customerOrderInfo.grayFlag === '5000000000014'"
                :isTip="customerOrderInfo.deliveryTypeName"
                :scPosFlag="customerOrderInfo.scPosFlag"
                :emergenceFlag="customerOrderInfo.emergenceFlag"
                :specimenType="customerOrderInfo.specimenType"
                :ifUpStairs="customerOrderInfo.ifUpStairs"
            ></Vehicle>
             <el-collapse class="bottomMassage"  v-model="activeNames">
                <el-collapse-item name="1" title="其他信息">
                    <otherMassage
                    :infoData="infoData2"
                    :showLog="false">
                    </otherMassage>
                </el-collapse-item>
             </el-collapse>
            <order
                :columns="columns"
                :orderInfoItems="orderInfoItems"
                :orderInfoDetails.sync="orderInfoDetails"
                :customerOrderInfo="customerOrderInfo"
                :orderStatus="orderStatus"
                :orderNo="orderNo"
                :agingProductName="agingProductName"
            ></order>
            <Log
                v-if="visible"
                :visible.sync="visible"
                :tableData="logTableData"
                :logOrderNo="logOrderNo"
                :items="logColumns"
                :tableWidth="'80%'"
                :title="title"
                @handleClose="handleClose"
                :logJumpParams="logJumpParams"
            ></Log>
            <mip-flow :extFrameUrl="extFrameUrl" :mipFdId="mipFdId" :orderNo="orderNo" :appCode="appCode" v-if="mipVisible" :mipVisible.sync="mipVisible"
            :mipFdStatus="mipFdStatus" :moduleName="moduleName"
            @handleMipClose="handleMipClose" @handleMipOk="handleMipClose"></mip-flow>
            <iflow-form v-if="formVisible" :formVisible.sync="formVisible" :orderNo="orderNo"
            @handleFormClose="handleFormClose" @handleFormOk="handleFormOk"></iflow-form>
        </div>
    </Paper>
</template>
<script>
import Paper from '@/components/core/paper/Paper';
import speed from '../../../../components/speed/speed.vue';
import Vehicle from '../../../../components/speed/Vehicle';
import order from '../order/order';
import Log from '../order/Log';
import mipFlow from '../mipIflow/MipiFlow';
import iflowForm from '../mipIflow/IflowForm';
import otherMassage from '../order/otherMassage';
import data from './data.js';
import { getOrderDetail, resInfos, getLog, workflowConfigs, mipExecutionLogs } from '../../../../api/orderCenter';
import _ from '@/components/lots/utils';
import { mapState } from 'vuex';

export default {
    name: '_orderCenterDetail',
    data() {
        return {
            activeNames: [''],
            process: {},
            infoData: [],
            infoData2: [],
            logTableData: [],
            tableDataItems: [],
            title: '操作日志',
            log: [],
            tableData: [],
            logColumns: [],
            columns: {},
            visible: false,
            isLoading: true,
            data: data,
            dialog: [],
            orderInfoItems: [],
            orderInfoDetails: [],
            customerOrderInfo: {},
            orderStatus: -1,
            identifyStatusMap: {
                1: '已质检、已封箱',
                2: '未质检、外包装完好',
                3: '未质检、未封箱',
                4: '已质检、未封箱'
            },
            mipVisible: false,
            formVisible: false,
            extFrameUrl: '',
            orderNo: '',
            appCode: '',
            mipFdId: '',
            mipFdStatus: '',
            moduleName: '',
            logJumpParams: {
                customerOrderNo: '',
                ownerCode: '',
                ownerName: '',
                siteCode: '',
                siteName: '',
                whCode: '',
                whName: '',
                itemCodes: '',
                itemStatus: '',
                invType: 'custInv'
            },
            logOrderNo: '',
            agingProductName: ''
        };
    },
    created() {
        this.init();
    },
    activated() {
        this.init();
    },
    mounted() {
        this.$nextTick(() => {
            const dblclicks = document.querySelectorAll('.departure .numbers');
            for (let i = 0; i < dblclicks.length; i++) {
                dblclicks[i].addEventListener('dblclick', (e) => {
                    e.stopPropagation();
                    this.copyText('.departure .numbers', i);
                });
            }
            const dblclick = document.querySelectorAll('.departure .messages');
            for (let i = 0; i < dblclick.length; i++) {
                dblclick[i].addEventListener('dblclick', (e) => {
                    e.stopPropagation();
                    this.copyText('.departure .messages', i);
                });
            }
        });
    },
    methods: {
        copyText(className, i) {
            var clickContent = document.querySelectorAll(className)[i].innerText;
            var input = document.createElement('input');
            document.body.appendChild(input);
            input.setAttribute('value', clickContent);
            input.setAttribute('readonly', 'readonly');
            input.select();
            document.execCommand('copy');
            document.body.removeChild(input);
            this.$message.success(`‘${input.value}’复制成功`);
        },
        init() {
            this.columns = _.clone(data.dialogTable);
            this.process = _.clone(data.process);
            this.process.title = '订单号';
            this.process.step.map(item => {
                item.id = '0';
                item.carTimes = '';
            });
            this.orderNo = this.$route.query.orderNo;
            this.process.orderNo = this.$route.query.orderNo;
            this.getList(this.$route.query.orderNo);
            this.infoData = _.clone(data.infoData);
            this.infoData2 = _.clone(data.infoData2);
            this.logColumns = _.clone(data.logColumns);
            this.log = _.clone(data.log);
            this.orderInfoDetails = [];
            this.orderStatus = -1;
            this.customerOrderInfo = {};
        },
        formatNull(val) {
            return val || '--';
        },
        operation() {
            getLog({ orderNo: this.$route.query.orderNo }).then(res => {
                if (res.code === '0') {
                    this.logTableData = res.data || [];
                }
            });
            if (this.customerOrderInfo.customerOrderNo) {
                this.title = `操作日志  (客户订单号:${this.customerOrderInfo.customerOrderNo})`;
            }
            this.logOrderNo = this.customerOrderInfo.orderNo;
            this.visible = true;
        },
        handleClose() {
            this.visible = false;
        },
        getFilterAddress(arr, sign = ' / ') {
            return arr.filter(item => item).join(sign);
        },
        getList(params) {
            const that = this;
            const git = function(num) {
                return that.infoData[num].subItems;
            };
            const gits = function(num) {
                return that.infoData2[num].subItems;
            };
            this.isLoading = true;
            getOrderDetail({ orderNo: this.$route.query.orderNo }).then(res => {
                if (res.code === '0') {
                    this.isLoading = false;
                    const info = res.data.customerOrderInfo;
                    this.orderInfoDetails = res.data.orderInfoDetails;
                    this.customerOrderInfo = info;
                    this.apartStatus = info.apartStatus;
                    if (this.$route.query.apartStatus === 'PART') {
                        // this.columns.columns.splice(
                        //     this.columns.columns.length - 1, 0,
                        //     { label: '计划数量', prop: 'planQty', width: 100 },
                        //     { label: '取消数量', prop: 'cancleQty', width: 100 },
                        //     { label: '未拆分数量', prop: 'undividedQTy', width: 100 }
                        // );
                    } else {
                        this.columns = _.clone(data.dialogTable);
                    }
                    if (this.customerOrderInfo.orderStatusName) {
                        this.process.title = this.customerOrderInfo.excuteStatusName;
                    }
                    // this.customerOrderInfo.scPosFlag = 1;
                    // this.customerOrderInfo.emergenceFlag = 1;
                    // this.customerOrderInfo.specimenType = 'N';
                    const address = res.data.address;
                    git(0)[0].value = this.formatNull(this.getFilterAddress(
                        [
                            _.get(info, 'orderTypeName', info.upperOrderTypeName),
                            info.upstreamDocType === 'Y' ? '仓间调拨' : false
                        ], ' - '));
                    git(0)[1].messages[0].value = info.siteName;
                    git(0)[1].messages[2].value = info.siteCode;
                    git(0)[1].messages[4].value = info.whName;
                    git(0)[2].value = this.formatNull(info.businessMode);
                    git(0)[3].value = this.formatNull(info.deliveryTypeName);
                    // 原销售出库单号显示隐藏
                    if (info.originOrderNo) {
                        git(0)[4].value = this.formatNull(info.originOrderNo);
                        if (+info.mipFlag !== 1) {
                            that.infoData[0].subItems.splice(5, 1);
                        }
                    } else {
                        that.infoData[0].subItems.splice(4, 1);
                        if (+info.mipFlag !== 1) {
                            that.infoData[0].subItems.splice(4, 1);
                        }
                    }
                    git(1)[0].value = this.formatNull(info.customerOrderNo);
                    // git(1)[1].value = this.formatNull([_.get(info, 'customerName', info.upperCustomerName), _.get(info, 'customerCode', info.upperCustomerCode)].join(' -- '));
                    git(1)[1].messages[0].value = info.customerName;
                    git(1)[1].messages[2].value = info.customerCode;
                    git(1)[2].value = this.formatNull(info.upperOrderTime);
                    git(1)[3].value = this.formatNull(info.expectArriveEndTime
                        ? `${info.expectArriveStartTime}~${info.expectArriveEndTime}`
                        : info.expectArriveStartTime);
                    git(1)[4].value = this.formatNull(info.relationOrderNo);
                    git(2)[0].message[0].value = this.formatNull(address.receiverName);
                    git(2)[0].message[1].value = this.formatNull(this.getFilterAddress([address.receiverMobile, address.receiverTel]));
                    git(2)[1].value = this.formatNull([info.upperReceiverCode, info.upperReceiverName].filter(item => item).join(' / '));
                    if (info.inOutType !== 'IN' && (info.targetSiteCode || info.targetCustomerCode)) {
                        git(2)[1].value = this.formatNull([info.targetSiteName, info.targetCustomerName].filter(item => item).join(' / '));
                    }
                    git(2)[2].value = this.formatNull(this.getFilterAddress([
                        address.receiverProvinceName,
                        address.receiverCityName,
                        address.receiverDistrictName,
                        address.receiverTownName,
                        ' '
                    ]));
                    git(2)[2].detailAddress = address.receiverDetailAddr;
                    git(2)[3].value = this.formatNull(address.originAddr);
                    if (info.inOutType === 'IN') {
                        // showItem = true为隐藏（切记）
                        that.infoData[2].showItem = true;
                        that.infoData = that.infoData.concat([]);
                    } else {
                        that.infoData[3].showItem = true;
                        that.infoData = that.infoData.concat([]);
                    }
                    git(3)[0].message[0].value = this.formatNull(address.senderName);
                    git(3)[0].message[1].value = this.formatNull(this.getFilterAddress([address.senderMobile, address.senderTel]));
                    git(3)[1].value = this.formatNull(info.upperSenderName);
                    if (info.inOutType === 'IN' && (info.targetSiteCode || info.targetCustomerCode)) {
                        git(3)[1].value = this.formatNull([info.targetSiteName, info.targetCustomerName].filter(item => item).join(' / '));
                    }
                    git(3)[2].value = this.formatNull(this.getFilterAddress([
                        address.senderProvinceName,
                        address.senderCityName,
                        address.senderDistrictName,
                        address.senderTownName,
                        ' '
                    ]));
                    git(3)[2].detailAddress = address.senderDetailAddr;
                    // 网点显示隐藏判断(国苏发网点（upperOrderType=PO-GS-01）||宅配订单(deliveryType=DOT)要展示网点地址) || 上门取件单（orderType === 'DP'）
                    if (!(info.upperOrderType === 'PO-GS-01' || info.deliveryType === 'DOT' || info.orderType === 'DP')) {
                        // showItem = true为隐藏（切记）
                        that.infoData2[1].showItem = true;
                        that.infoData2 = that.infoData2.concat([]);
                    }
                    if (!(info.orderType === 'YS')) {
                        // showItem = true为隐藏（切记）
                        that.infoData2[2].showItem = true;
                        that.infoData2 = that.infoData2.concat([]);
                    }
                    // 如果是上门取件单（orderType: "DP"）取子单网点信息
                    if (info.orderType === 'DP' && res.data.orderInfoDetails.length > 0) {
                        const subOrderInfo = res.data.orderInfoDetails[0].orderInfo;
                        address.networkContact = subOrderInfo.networkContact;
                        address.networkPhone = subOrderInfo.networkPhone;
                        address.networkName = subOrderInfo.networkName;
                        address.networkAddr = subOrderInfo.networkAddr;
                    }
                    gits(0)[0].value = this.formatNull(info.remark);
                    gits(0)[1].value = this.formatNull(info.agingProductName || info.agingProductCode);
                    gits(0)[2].value = this.formatNull(info.expectOutTime);
                    gits(0)[3].value = this.formatNull(this.identifyStatusMap[info.identifyStatus]);
                    gits(1)[0].message[0].value = this.formatNull(address.networkContact || address.networkName);
                    gits(1)[0].message[1].value = this.formatNull(address.networkPhone);
                    gits(1)[1].value = this.formatNull(address.networkName);
                    gits(1)[2].value = this.formatNull(this.getFilterAddress([
                        address.networkProvinceName,
                        address.networkCityName,
                        address.networkDistrictName,
                        address.networkTownName,
                        address.networkAddr
                    ]));
                    gits(2)[0].message[0].value = this.formatNull(address.senderName);
                    gits(2)[0].message[1].value = this.formatNull(this.getFilterAddress([address.senderMobile, address.senderTel]));
                    gits(2)[1].value = this.formatNull(info.upperSenderName);
                    if (info.inOutType === 'IN' && (info.targetSiteCode || info.targetCustomerCode)) {
                        gits(2)[1].value = this.formatNull([info.targetSiteName, info.targetCustomerName].filter(item => item).join(' / '));
                    }
                    gits(2)[2].value = this.formatNull(this.getFilterAddress([
                        address.senderProvinceName,
                        address.senderCityName,
                        address.senderDistrictName,
                        address.senderTownName,
                        address.senderDetailAddr
                    ]));
                    this.agingProductName = info.agingProductName || info.agingProductCode;
                    this.logJumpParams.customerOrderNo = info.customerOrderNo;
                    this.logJumpParams.ownerCode = info.customerCode;
                    this.logJumpParams.ownerName = info.customerName;
                    this.logJumpParams.siteCode = info.siteCode;
                    this.logJumpParams.siteName = info.siteName;
                    this.logJumpParams.whCode = info.whCode;
                    this.logJumpParams.whName = info.whName;
                    const goodsCode = [];
                    resInfos({ parentOrderNo: res.data.customerOrderInfo.orderNo }).then(resData => {
                        if (resData.code === '0') {
                            resData.data.list.map(item => {
                                if (item.orderStatus + '' === '100') {
                                    this.process.step[0].id = '1';
                                    this.process.step[0].carTimes = item.createTime;
                                } else if (item.orderStatus + '' === '200') {
                                    this.process.step[1].id = '1';
                                    this.process.step[1].carTimes = item.createTime;
                                } else if (['240', '250', '260'].includes(item.orderStatus + '')) {
                                    this.process.step[2].id = '1';
                                    this.process.step[2].carTimes = item.createTime;
                                } else if (item.orderStatus + '' === '880') {
                                    this.process.step[3].id = '1';
                                    this.process.step[3].carTimes = 'item.createTime';
                                }
                                this.orderStatus = +this.orderStatus < +item.orderStatus ? +item.orderStatus : this.orderStatus;
                                if (item.orderStatus && this.orderStatus >= 200 && info.apartType !== 'PART') {
                                    if (res.data.orderInfoDetails.length > 0) {
                                        this.orderInfoDetails.forEach(child => {
                                            child.tasks = this.sortByKey(child.tasks, 'id');
                                            if (child.items && child.items.length) {
                                                child.items.forEach((item, index) => {
                                                    if (child.tasks && child.tasks[index]) {
                                                        item.whName = child.tasks[index].whName;
                                                    } else {
                                                        item.whName = child.orderInfo.whName;
                                                    }
                                                    if (item.actQty) {
                                                        item.Qty = [item.planQty || 0, item.actQty].join(' / ');
                                                    } else {
                                                        item.Qty = item.planQty;
                                                    }
                                                    // 判断是否存在目标状态
                                                    if (item.itemStatusToName) {
                                                        item.itemStatus = item.itemStatusName + ` >>> ${item.itemStatusToName}`;
                                                    } else {
                                                        item.itemStatus = item.itemStatusName;
                                                    }
                                                });
                                            }
                                        });
                                        // this.orderInfoDetails = _.clone(res.data.orderInfoDetails);
                                    }
                                }
                            });
                            if (res.data.customerOrderItemList.length > 0) this.logJumpParams.itemStatus = res.data.customerOrderItemList[0].itemStatus;
                            // 这里把订单和子单信息分成两个对象来接收，分开展示
                            const items = res.data.customerOrderItemList.map(item => {
                                item.whName = info.whName;
                                if (item.actQty) {
                                    item.Qty = this.getFilterAddress([item.planQty || 0, item.actQty]);
                                } else {
                                    item.Qty = item.planQty;
                                }
                                // 判断是否存在目标状态
                                if (item.itemStatusToName) {
                                    item.itemStatus = item.itemStatusName + ` >>> ${item.itemStatusToName}`;
                                } else {
                                    item.itemStatus = item.itemStatusName;
                                }
                                return item;
                            });
                            if (items.length > 0) {
                                items.forEach(item => {
                                    goodsCode.push(item.itemCode);
                                });
                                this.logJumpParams.itemCodes = goodsCode.join(',');
                            }
                            this.orderInfoItems = [{ items }];
                        }
                    });
                } else {
                    this.isLoading = true;
                }
            });
        },
        handleFormClose() {
            this.formVisible = false;
        },
        handleFormOk() {
            this.formVisible = false;
            this.mipVisible = true;
        },
        handleMipClose() {
            this.mipVisible = false;
        },
        async adjustMipBtn(row) {
            const mipModuleRes = await workflowConfigs({ moduleCode: 'otp_inventory_account_adjustment' });
            const mipExecutionLogsRes = await mipExecutionLogs({ orderNo: this.orderNo });
            if (mipModuleRes) {
                if (mipModuleRes.data.list.length === 1) {
                    this.appCode = mipModuleRes.data.list[0].appCode;
                    this.moduleName = mipModuleRes.data.list[0].moduleName;
                    if (mipExecutionLogsRes) {
                        if (mipExecutionLogsRes.data.list.length > 0) {
                            this.mipVisible = true;
                        } else {
                            this.formVisible = true;
                        }
                    }
                }
            }
        },
        sortByKey(array, key) { // (数组、排序的列)
            return array.sort(function(a, b) {
                var x = a[key];
                var y = b[key];
                return ((x < y) ? -1 : ((x > y) ? 1 : 0));
            });
        }
    },
    components: { Paper, speed, Vehicle, order, Log, otherMassage, mipFlow, iflowForm },
    computed: {
        ...mapState(
            {
                user: state => state.user,
                currentTenant: state => state.currentTenant
            }
        )
    }
};
</script>
<style lang='less'>
#orderCenterDetail {
    .dialogTable {
        .el-table {
            font-size: 12px;
        }
    }
     .el-collapse-item__header {
            height: 30px;
            margin-left: 12px;
            font-size: 15px;
            color: rgb(102, 98, 90);
        }
    .bottomMassage{
        .el-collapse-item__header {
            height: 25px;

        }
    }

        .el-collapse-item__content{
        padding-bottom: 0px;
    }
}
</style>