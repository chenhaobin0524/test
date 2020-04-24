<template>
    <paper>
        <m-pane
            ref="tablePage"
            :config="config"
            :totalData="totalData"
            :pageTotal="pageTotal"
            :optionNum="optionNum"
            :loading="loading"
            :searchTotalTitle="config.searchTotalTitle"
            :initSearchInfo="initSearchInfo"
            @edit-btn="editBtn"
            @del-btn="delBtn"
            @row-db-click="rowDBclick"
            @separate-btn="separateBtn"
            @searchChange="searchChange"
            @dispatch-btn="dispatchBtn"
            @fixAddress-btn="fixAddressBtn"
            @check-btn="checkBtn"
            @adjustMip-btn="adjustMipBtn"
            @switch-change="switchChange"
            @selectChange="selectChange"
            @pageChange="pageChange"
            @sizeChange="sizeChange"
            @btnClick="btnClick"
            @getTableConfigList="getTableConfigList"
            searchId="test"
            pageID="test"
            class="order_center-list"
        >
            <div slot="table-module-btn">
                <el-tooltip effect="dark" content="导入" placement="bottom">
                    <span v-has="'02010006'" class="mgl-10">
                    <el-button icon="el-icon-upload2" size="mini" @click="orderImportC"></el-button>
                    </span>
                </el-tooltip>
                <el-tooltip effect="dark" content="导出" placement="bottom">
                    <span v-has="'02010007'" class="mgl-10">
                    <el-button icon="el-icon-download" size="mini" @click="exportFile"></el-button>
                    </span>
                </el-tooltip>
            </div>
            <div slot="page-module-btn">
                <span v-has="'02010003'"><el-button type="primary" @click="examine">审 核</el-button></span>
                <span v-has="'02010004'" style="margin-left: 10px;"><el-button type="primary" @click="chargeOff">冲 销</el-button></span>
                <span v-has="'02010005'" style="margin-left: 10px;"><el-button type="primary" @click="shutSingle">关 单</el-button></span>
                <!-- <el-button type="primary">异常处理</el-button> -->
                <span v-has="'02010011'" style="margin-left: 10px;"><el-button type="primary" @click="orderIntercept">拦 截</el-button></span>
                <el-dropdown style="margin-left: 10px;">
                    <span v-has="'02010008'">
                        <el-button type="primary">
                            手工建单
                            <i class="el-icon-arrow-down el-icon--right"></i>
                        </el-button>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="manualOrder">手工建单</el-dropdown-item>
                        <el-dropdown-item @click.native="viewsList">视图建单</el-dropdown-item>
                        <!-- <el-dropdown-item>红冲建单</el-dropdown-item> -->
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </m-pane>
        <addOrder
            ref="addOrder"
            :title="title"
            :orderId="orderId"
            @reflashList="reflashList"
            :basicData="config.viewBillBasicData"
        ></addOrder>
        <Import
            ref="Import"
            :ImportConfig="config.table.ImportConfig"
            :ImportContent="config.table.ImportContent"
        ></Import>
        <demolitionOrder
            ref="demolitionOrder"
            @reflashList="reflashList"
        ></demolitionOrder>
        <shutSingle ref="shutSingle" :shutSingleLise="financeShutSingle"></shutSingle>
        <!-- <reserve ref="reserve" :dialogs="config.dateDialog"></reserve> -->
        <viewBill ref="viewBill" :basicData="config.viewBillBasicData" @viewBill-success="viewBillSuccess"></viewBill>
        <Log
            :visible.sync="visible"
            :tableData="logTableData"
            :items="logColumns"
            :title="logTitle"
            :logOrderNo="logOrderNo"
            :logJumpParams="logJumpParams"
            tableWidth="80%"
            @handleClose="handleClose"
        ></Log>
        <orderIntercept
            ref='orderIntercept'
            @reflashList="reflashList"
        ></orderIntercept>
        <fix-address ref="fixAddress"></fix-address>
        <mip-flow :extFrameUrl="extFrameUrl" :mipFdId="mipFdId" :orderNo="orderNo" :appCode="appCode" v-if="mipVisible" :mipVisible.sync="mipVisible"
            :mipFdStatus="mipFdStatus" :moduleName="moduleName"
            @handleMipClose="handleMipClose" @handleMipOk="handleMipOk"></mip-flow>
        <iflow-form v-if="formVisible" :formVisible.sync="formVisible" :orderNo="orderNo"
            @handleFormClose="handleFormClose" @handleFormOk="handleFormOk"></iflow-form>
    </paper>
</template>
<script>
import moment from 'moment';
import mPane from '@/components/otpPanel';
import config from './config';
import paper from '@/components/core/paper/Paper';
import Import from '../order/Import';
import addOrder from '../order/addOrder.vue';
// import reserve from '../order/reserve';
import viewBill from '../order/viewBill';
import fixAddress from '../order/fixAddress';
import demolitionOrder from '../demolitionOrder/demolitionOrder';
import shutSingle from '../shutSingle';
import orderIntercept from '../order/orderIntercept';
import mipFlow from '../mipIflow/MipiFlow';
import iflowForm from '../mipIflow/IflowForm';
import {
    getCustomerOrderInfos,
    copyOrEditCustomerOrder,
    orderVrify,
    getCustomerOrderInfo,
    chargeOff,
    getLog,
    checkIsCanCloseOrder,
    workflowConfigs,
    getOrderDetail,
    mipExecutionLogs,
    selectOne
} from '../../../../api/orderCenter';
import {
    exportOrder
} from '../../../../api/export';
import { dateTimes } from '../../../../judge/configCenter';
import Log from '../order/Log';
import { messageBox } from '../../../../utils/messageBox.js';
import { mapState } from 'vuex';

export default {
    name: 'orderCenter',
    components: {
        mPane,
        paper,
        Import,
        addOrder,
        demolitionOrder,
        shutSingle,
        viewBill,
        Log,
        orderIntercept,
        fixAddress,
        mipFlow,
        iflowForm
    },
    data() {
        return {
            orderId: 0,
            logTitle: '订单日志',
            selectRow: [],
            config: config,
            loading: false,
            title: '',
            optionNum: '',
            totalData: [],
            pageTotal: 0,
            multipleSelection: [],
            searchParams: {
                pageSize: 10,
                pageNo: 1
            },
            financeShutSingle: [],
            canReflash: false,
            appointmentData: {},
            rowData: {
                apartStatus: ''
            },
            logColumns: config.logColumns,
            visible: false,
            logTableData: [],
            initSearchInfo: {},
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
                invType: 'custInv'
            },
            logOrderNo: ''
        };
    },
    methods: {
        async getList() {
            const res = await getCustomerOrderInfos(this.searchParams);
            if (res.code === '0') {
                res.data.list = res.data.list.map(item => {
                    return { ...this.rowData, ...item };
                });
                res.data.list.forEach(ref => {
                    ref.hiddenEvent = [];
                    if (!(ref.orderStatus === 199 && (ref.exceptionType === 'RECEIVER_ADDRESS_FAILED' || ref.exceptionType === 'SENDER_ADDRESS_FAILED'))) {
                        ref.hiddenEvent.push('dispatch');
                        ref.hiddenEvent.push('fixAddress');
                    }
                    if (!(
                        (ref.orderSource === 'HANDLE' && ((ref.excuteStatus === 199 && ref.orderStatus === 199) || ref.orderStatus === 100)) ||
                        (ref.orderSource === 'VIEW' && ref.orderType === 'RRI') ||
                        (ref.orderType === 'RRI' && (ref.orderStatus === 100))
                    )) {
                        ref.hiddenEvent.push('edit');
                    }
                    if (ref.excuteStatus >= 880 || !(
                        (ref.apartType === 'HANDLE' && !ref.apartStatus) ||
                        ref.apartStatus === 'PART' ||
                        (ref.exceptionType === 'INVENTORY_INSUFFICIENT')
                    )) {
                        ref.hiddenEvent.push('separate');
                    }
                    if (ref.excuteStatus === 999) {
                        ref.hiddenEvent.push('dispatch', 'edit', 'fixAddress');
                    }
                    if (+ref.mipFlag !== 1) {
                        ref.hiddenEvent.push('adjustMip');
                    }
                });
                for (let i = 0; i < res.data.list.length; i++) {
                    if (res.data.list[i].deliveryTypeName !== '自提') {
                        res.data.list[i].deliveryTypeName = '非自提';
                    }
                }
                this.totalData = res.data.list || [];
                this.pageTotal = res.data.totalCount;
            }
        },
        handleClose() {
            this.visible = false;
        },
        btnClick(val, index, row) {
            this.logJumpParams.customerOrderNo = row.customerOrderNo;
            this.logJumpParams.ownerCode = row.customerCode;
            this.logJumpParams.ownerName = row.customerName;
            this.logJumpParams.siteCode = row.siteCode;
            this.logJumpParams.siteName = row.siteName;
            this.logJumpParams.whCode = row.whCode;
            this.logJumpParams.whName = row.whName;
            this.logOrderNo = row.orderNo;
            const goodsCode = [];
            getLog({ orderNo: row.orderNo }).then(res => {
                if (res.code === '0') {
                    this.logTableData = res.data;
                    this.logTitle = `订单日志(客户订单号：${row.customerOrderNo})`;
                    this.visible = true;
                }
            });
            getOrderDetail({ orderNo: row.orderNo }).then(res => {
                if (res.code === '0') {
                    const items = res.data.customerOrderItemList;
                    if (items.length > 0) {
                        items.forEach(item => {
                            goodsCode.push(item.itemCode);
                        });
                        this.logJumpParams.itemStatus = items[0].itemStatus;
                        this.logJumpParams.itemCodes = goodsCode.join(',');
                    }
                }
            });
        },
        reflashList(val) {
            this.canReflash = val;
        },
        getInitList() {
            setTimeout(() => {
                this.$refs.tablePage.$refs.searchList.onSearchChange();
            }, 50);
        },
        // 导入
        orderImportC() {
            this.$refs.Import.orderImportC();
        },
        // 手工建单
        manualOrder() {
            this.title = '新增';
            this.$refs['addOrder'].show(true);
        },
        // 纠错
        dispatchBtn(data) {
            getCustomerOrderInfo({}, data.id).then(res => {
                if (res.code === '0') {
                    const address = res.data.address;
                    const orderNo = res.data.orderNo;
                    let inOutType = res.data.inOutType;
                    // 收货地址
                    const receiverProvinceName = !address.receiverProvinceName ? '' : address.receiverProvinceName;
                    const receiverCityName = !address.receiverCityName ? '' : address.receiverCityName;
                    const receiverDistrictName = !address.receiverDistrictName ? '' : address.receiverDistrictName;
                    const receiverTownName = !address.receiverTownName ? '' : address.receiverTownName;
                    const receiverDetailAddr = !address.receiverDetailAddr ? '' : address.receiverDetailAddr;
                    const receiverName = receiverProvinceName + receiverCityName + receiverDistrictName + receiverTownName + receiverDetailAddr;
                    // 发货地址
                    const senderProvinceName = !address.senderProvinceName ? '' : address.senderProvinceName;
                    const senderCityName = !address.senderCityName ? '' : address.senderCityName;
                    const senderDistrictName = !address.senderDistrictName ? '' : address.senderDistrictName;
                    const senderTownName = !address.senderTownName ? '' : address.senderTownName;
                    const senderDetailAddr = !address.senderDetailAddr ? '' : address.senderDetailAddr;
                    const senderName = senderProvinceName + senderCityName + senderDistrictName + senderTownName + senderDetailAddr;
                    let addressName = '';
                    if (res.data.inOutType === 'IN') {
                        addressName = senderName;
                    } else if (res.data.inOutType === 'OUT') {
                        addressName = receiverName;
                    } else if (res.data.inOutType === 'YS') {
                        if (!receiverTownName) {
                            inOutType = 'OUT';
                            addressName = receiverName;
                        } else if (!senderTownName) {
                            inOutType = 'IN';
                            addressName = senderName;
                        }
                    }
                    this.$router.push({ name: '_siteCorrection',
                        params: {
                            orderNo: orderNo,
                            address: addressName,
                            inOutType: inOutType
                        } });
                }
            });
        },
        // 地址修改
        fixAddressBtn(row) {
            this.$refs['fixAddress'].show(true, row);
        },
        // 视图弹窗
        viewsList() {
            this.$refs.viewBill.viewBill();
        },
        viewBillSuccess(customerOrderNo) {
            this.initSearchInfo = { ...this.initSearchInfo, customerOrderNo };
            this.getInitList();
        },
        rowDBclick(row) {
            // 表格内双击事件
            this.$router.push({
                query: { orderNo: row.orderNo, apartStatus: row.apartStatus },
                path: '/order-manage/order-detail'
            });
        },
        checkBtn(row) {
            // 行内按钮复制事件;
            const order = {
                orderNo: row.orderNo,
                flag: row.orderStatus === 100
            };
            copyOrEditCustomerOrder(order).then(res => {
                if (res.code === '0') {
                    this.title = '新增';
                    this.$refs['addOrder'].showCopy(true, res.data);
                }
            });
        },
        // removeBtn(data) {
        //     getOrderDetail({ orderNo: data.orderNo }).then(res => {
        //         if (res.code === '0') {
        //             this.appointmentData = res.data;
        //         }
        //     });
        //     this.$refs.reserve.showDialog();
        // },
        editBtn(row) {
            // 表格内按钮修改事件;
            this.title = '修改';
            selectOne({ customerOrderNo: row.customerOrderNo }).then((res) => {
                if (+res.code === 0 && !(res.data)) {
                    this.$refs['addOrder'].show(true, row.id);
                } else {
                    this.$message.warning('订单已生成子单，请撤回或取消分仓后修改');
                }
            });
        },
        delBtn(row) {
            // 表格内按钮删除事件;
        },
        separateBtn(row) {
            // 表格内按钮分仓事件;
            this.$refs['demolitionOrder'].show(
                true,
                row.customerOrderNo,
                row.orderNo,
                row.inOutType,
                row.orderType
            );
        },
        // 订单关闭确认
        async shutSingle() {
            if (!this.selectRow.length) {
                this.$message.error('请选中项!');
                return false;
            }
            this.financeShutSingle = this.selectRow.map(item => {
                return item.orderNo;
            });
            if (this.financeShutSingle.length > 1) return this.$message.warning('当前暂不支持批量关单，请勾选单个订单关单！');
            // 验证可关闭的订单
            const res = await checkIsCanCloseOrder(this.financeShutSingle);
            if (res && res.code === '0') {
                this.financeShutSingle = this.selectRow.filter(item => res.data.successList.includes(item.customerOrderNo)).map(item => {
                    return item.orderNo;
                });
                // 如果nonConformityList列表不为空，则该订单已关闭
                if (res.data.nonConformityList && res.data.nonConformityList.length > 0) {
                    this.$message.warning(res.data.nonConformityList[0]);
                    return;
                }
                this.$refs.shutSingle.shutSingle = true;
            }
        },
        selectChange(data) {
            // 表格内选择变化
            this.selectRow = data;
        },
        switchChange(data) {
            // 表格内switch切换事件
        },
        searchChange(data) {
            // 提交搜索框
            let createStartTime,
                createEndTime,
                payStartTime,
                payEndTime,
                upperConfirmStartTime,
                upperConfirmEndTime,
                upperOrderStartTime,
                upperOrderEndTime,
                expectPickStartTime,
                expectPickEndTime,
                requireOutStartTime,
                requireOutEndTime;
            if (data.customerOrderNoFussy && (!data.searchBeginTime || !data.customerOrderNo)) {
                this.$message.warning('模糊搜索时必须填写订单号和时间！');
                return;
            }
            if (!(data.waybillNo || data.subOrderNo) && !data.searchBeginTime && !data.customerOrderNo) {
                this.$message.warning('客户订单号 或 时间不可为空！');
                return;
            }
            if (data.searchBeginTime && data.searchBeginTime.length) {
                createStartTime = dateTimes(data.searchBeginTime[0]);
                createEndTime = dateTimes(data.searchBeginTime[1]);
            }
            delete data.searchBeginTime;
            if (!(data.waybillNo || data.subOrderNo)) {
                if (new Date(createEndTime).getTime() - new Date(createStartTime).getTime() > 90 * 24 * 60 * 60 * 1000) {
                    this.$message.warning('只有时间查询条件时，查询时间跨度不可超过三个月！');
                    return;
                }
            }
            // 支付时间
            if (data.payDate && data.payDate.length) {
                payStartTime = dateTimes(data.payDate[0]);
                payEndTime = dateTimes(data.payDate[1]);
            }
            delete data.payDate;

            // 上游审核时间
            if (data.upperComfirmTime && data.upperComfirmTime.length) {
                upperConfirmStartTime = dateTimes(data.upperComfirmTime[0]);
                upperConfirmEndTime = dateTimes(data.upperComfirmTime[1]);
            }
            delete data.upperComfirmTime;

            // 上游下单时间
            if (data.upperOrderTime && data.upperOrderTime.length) {
                upperOrderStartTime = dateTimes(data.upperOrderTime[0]);
                upperOrderEndTime = dateTimes(data.upperOrderTime[1]);
            }
            delete data.upperOrderTime;

            // 期望提货时间
            if (data.expectPickTime && data.expectPickTime.length) {
                expectPickStartTime = dateTimes(data.expectPickTime[0]);
                expectPickEndTime = dateTimes(data.expectPickTime[1]);
            }
            delete data.expectPickTime;

            // 要求发货时间
            if (data.requireOutTime && data.requireOutTime.length) {
                requireOutStartTime = dateTimes(data.requireOutTime[0]);
                requireOutEndTime = dateTimes(data.requireOutTime[1]);
            }
            delete data.requireOutTime;

            // 订单状态多选转换
            let orderStatusList = '';
            if (data.orderStatus && data.orderStatus.length) {
                orderStatusList = data.orderStatus.join(',');
            }
            delete data.orderStatus;

            // 订单类型多选转换
            let orderTypeList = '';
            if (data.orderType && data.orderType.length) {
                orderTypeList = data.orderType.join(',');
            }
            delete data.orderType;

            // 审核状态多选转换
            let excuteStatusList = '';
            if (data.excuteStatus && data.excuteStatus.length) {
                excuteStatusList = data.excuteStatus.join(',');
            }
            delete data.excuteStatus;

            const address = {};
            // 收货人信息
            if (data.receiverCode && data.receiverCode.length) {
                address['receiverProvinceCode'] = data.receiverCode[0];
                address['receiverCityCode'] = data.receiverCode[1];
                address['receiverDistrictCode'] = data.receiverCode[2];
                address['receiverTownCode'] = data.receiverCode[3];
            }
            delete data.receiverCode;
            if (data.receiverDetailAddr) {
                address.receiverDetailAddr = encodeURIComponent(data.receiverDetailAddr);
            }
            // 发货人信息
            if (data.senderCode && data.senderCode.length) {
                address['senderProvinceCode'] = data.senderCode[0];
                address['senderCityCode'] = data.senderCode[1];
                address['senderDistrictCode'] = data.senderCode[2];
                address['senderTownCode'] = data.senderCode[3];
            }
            delete data.senderCode;
            if (data.senderDetailAddr) {
                address.senderDetailAddr = encodeURIComponent(data.senderDetailAddr);
            }
            // 网点名称
            let networkName = '';
            if (data.networkName) {
                networkName = encodeURIComponent(data.networkName);
            }
            // 是否模糊搜索
            const isFuzzy = data.customerOrderNoFussy ? 1 : '';
            delete data.customerOrderNoFussy;

            const expectOutStartTime = this.searchParams.expectOutStartTime;
            const expectOutEndTime = this.searchParams.expectOutEndTime;
            this.searchParams = {
                pageNo: 1,
                pageSize: this.searchParams.pageSize,
                ...data,
                createStartTime,
                createEndTime,
                orderStatusList,
                orderTypeList,
                payStartTime,
                payEndTime,
                upperConfirmStartTime,
                upperConfirmEndTime,
                upperOrderStartTime,
                upperOrderEndTime,
                expectPickStartTime,
                expectPickEndTime,
                expectOutStartTime,
                expectOutEndTime,
                requireOutStartTime,
                requireOutEndTime,
                networkName,
                excuteStatusList,
                isFuzzy,
                ...address
            };
            this.getList();
        },
        pageChange(data) {
            // 分页器页数变化
            this.searchParams.pageNo = data;
            this.getList();
        },
        sizeChange(data) {
            // 分页器页数大小变化
            this.searchParams.pageSize = data;
            // this.getList();
            this.getInitList();
        },
        getTableConfigList(data) {},
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        // 审核按钮
        examine() {
            if (this.selectRow.length === 0 && this.selectRow) {
                this.$message.error('尚未选取任何数据！');
                return;
            }
            const auditedOrder = [];
            for (const o of this.selectRow) {
                if (o.excuteStatus >= 200) {
                    auditedOrder.push(o.orderNo);
                }
            }
            if (auditedOrder.length > 0) {
                if (auditedOrder.length === this.selectRow.length) {
                    this.$message.warning('选中的记录都不能进行审核操作!');
                } else {
                    this.$message.warning(`${auditedOrder.join('、')}不可审核，剩余${this.selectRow.length - auditedOrder.length}单开始审核`);
                }
            }
            const order = [];
            this.selectRow.filter(o => o.excuteStatus < 200).forEach(res => {
                order.push(res.orderNo);
            });
            if (order.length === 0) return;
            orderVrify(order).then(res => {
                if (res.code === '0') {
                    this.$message.success('正在审核，请在订单日志中查看结果！');
                    this.getList();
                }
            });
        },
        // 冲销
        async chargeOff() {
            const row = this.selectRow;
            if (!row.length) {
                this.$message.warning('请先选择数据');
                return;
            }
            await messageBox(this, '订单冲销后无法继续作业,是否确认冲销订单?');
            const idList = [];
            row.map(item => {
                if (item.orderNo) {
                    idList.push(item.orderNo);
                }
            });
            chargeOff({ orderNos: idList }).then(res => {
                if (res.code === '0') {
                    this.$message.success('操作成功');
                }
            });
        },
        // 订单拦截
        orderIntercept() {
            this.$refs['orderIntercept'].show(true);
        },
        // 导出
        exportFile() {
            const params = { ...this.searchParams };
            Reflect.deleteProperty(params, 'pageNo');
            Reflect.deleteProperty(params, 'pageSize');
            exportOrder(params).then(res => {
                this.$message.success('已发送导出请求，请稍后到右上角“用户文件列表”中下载');
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
        handleMipOk() {
            this.mipVisible = false;
            this.getInitList();
        },
        async adjustMipBtn(row) {
            this.orderNo = row.orderNo;
            const mipModuleRes = await workflowConfigs({ moduleCode: 'otp_inventory_account_adjustment' });
            const mipExecutionLogsRes = await mipExecutionLogs({ orderNo: row.orderNo });
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
        init() {
            const query = this.$route.query;
            const initSearchInfo = {};
            if (query.isRefresh) {
                const query = this.$route.query;
                if (query.createStartTime) {
                    initSearchInfo.searchBeginTime = [new Date(query.createStartTime), new Date(query.createEndTime)];
                }
                if (query.orderStatusList) {
                    initSearchInfo.orderStatus = query.orderStatusList.split(',');
                }
            } else {
                const startTime = moment().subtract(1, 'M').startOf('day');
                const endTime = moment().endOf('day');
                initSearchInfo.searchBeginTime = [startTime.toDate(), endTime.toDate()];
            }
            this.initSearchInfo = initSearchInfo;
            this.$router.replace({ name: 'orderCenter', query: {} });
            // this.getInitList();
        }
    },
    watch: {
        canReflash(val) {
            if (val) {
                this.getInitList();
                this.canReflash = false;
            }
        }
    },
    computed: {
        ...mapState(
            {
                user: state => state.user,
                currentTenant: state => state.currentTenant
            }
        )
    },
    activated() {
        if (this.$route.query.isRefresh) {
            this.init();
        }
    },
    mounted() {
        this.init();
    }
};
</script>
<style lang="less">
#gridData {
    .el-dialog__body {
        padding: 10px 20px;
    }

    .table-btn {
        margin: 0 5px;
        color: #00a9ac;
        cursor: pointer;
    }
}
.order_center-list {
    .el-pager {
        & > .number {
            display: none;
            &.active {
                display: inline-block;
            }
        }
        & > .more {
            display: none;
        }
    }
}
</style>
