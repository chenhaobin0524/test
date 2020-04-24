<template>
    <paper>
        <m-pane
            class="tablePage task_center-list"
            ref="tablePage"
            :config="config"
            :totalData="totalData"
            :pageTotal="pageTotal"
            :optionNum="optionNum"
            :loading="loading"
            :searchTotalTitle="searchTotalTitle"
            :initSearchInfo="initSearchInfo"
            @saveData="saveData"
            @row-db-click="rowDBclick"
            @remove-btn="removeBtn"
            @getTableConfigList="getTableConfigList"
            @check-btn="checkBtn"
            @edit-btn="editBtn"
            @dispatch-btn="dispatchBtn"
            @transfer-btn="transferBtn"
            @associate-btn="associateBtn"
            @switch-change="switchChange"
            @selectChange="selectChange"
            @searchChange="searchChange"
            @pageChange="pageChange"
            @sizeChange="sizeChange"
            @btnClick="btnClick"
            searchId="test"
            pageID="test"
        >
            <div slot="table-module-btn">
                <el-tooltip effect="dark" content="导出" placement="bottom">
                    <span v-has="'02020009'">
                    <el-button icon="el-icon-download" size="mini" @click="exportFile"></el-button>
                    </span>
                </el-tooltip>
            </div>
            <div slot="page-module-btn">
                <span v-has="'02020005'"><el-button type="primary" @click="taskDistibute">下 发</el-button></span>
                <span style="margin-left: 10px;" v-has="'02020007'"><el-button type="primary" @click="saveData">到车登记</el-button></span>
                <span style="margin-left: 10px;" v-has="'02020006'"><el-button type="primary" @click="handlerOverdue">逾期</el-button></span>
            </div>
        </m-pane>
        <m-dialog
            :dialog="dialog"
            :visible="visible"
            :tableData="tableData"
            @closeDialog="closeDialog"
            @search="search"
            @dialogCheck="dialogCheck"
        ></m-dialog>
        <m-dialog
            :dialog="carDialog"
            :visible="carVisible"
            ref="carDialog"
            :tableData="tableData"
            :mFormValue="carFormValue"
            @closeDialog="closeCarDialog"
            @search="search"
            @carDialogCheck="carDialogCheck"
        ></m-dialog>
        <m-dialog
            :dialog="editDialog"
            :visible="editVisible"
            :tableData="[]"
            :mFormValue="editFormData"
            @closeDialog="closeEditDialog"
        ></m-dialog>
        <reserve
            ref="reserve"
            :appointmentData="appointmentData"
            :showTimePick="appointmentParams.businessMode === 'B2B'"
            @closeDialog="closeReserve"
        ></reserve>
        <Log
            :visible.sync="logVisible"
            :tableData="logTableData"
            :items="logColumns"
            :title="logTitle"
            tableWidth="60%"
            @handleClose="handleClose"
        ></Log>
        <handler-overdue-dialog ref="handlerOverdueDialog"></handler-overdue-dialog>
        <associate-order-dialog ref="associateOrderDialog"></associate-order-dialog>
    </paper>
</template>
<script>
import moment from 'moment';
import _ from '@/components/lots/utils';
import mPane from '@/components/otpPanel';
import config from './config.json';
import paper from '@/components/core/paper/Paper';
import mDialog from '../../../../components/dialog/dialog';
import reserve from '../../../../components/reserve';
import handlerOverdueDialog from './_handlerOverdueDialog';
import associateOrderDialog from './_associateOrderDialog';
import { getAgingProduct } from '../../../../api/timeManage';
import {
    getSearchInfosApi,
    taskInfoEditApi,
    taskDistribute,
    // taskDetailInfoApi,
    searchTaskOrderDetails,
    appointment,
    carArrivedInfo,
    getTaskLogApi,
    transferOfGoodsRight,
    retract
} from '../../../../api/taskCenter';
import {
    exportTask
} from '../../../../api/export';
import { dateTimes } from '../../../../judge/configCenter';
import Log from '../../../../components/dispatchPopup/dispatchList/Main';

export default {
    name: 'taskCenter',
    components: { mPane, paper, mDialog, reserve, handlerOverdueDialog, associateOrderDialog, Log },
    data() {
        return {
            config: config,
            dialog: config.dialog,
            editDialog: config.editDialog,
            carDialog: config.dateDialog,
            editFormData: {},
            loading: false,
            optionNum: '',
            totalData: [],
            pageTotal: 10,
            searchTotalTitle: config.searchTotalTitle,
            selectedRows: [],
            visible: false,
            editVisible: false,
            tableData: [],
            searchParams: {
                pageSize: 10,
                pageNo: 1
            },
            appointmentData: {},
            appointmentParams: {},
            mFormValue: {},
            carFormValue: { type: 1, carTime: new Date(), carDate: this.GetDateT(new Date()), whCode: '' },
            carVisible: false,
            logTitle: '操作日志',
            logColumns: config.logColumns,
            logVisible: false,
            logTableData: [],
            initSearchInfo: {}
        };
    },
    methods: {
        rowDBclick(row) {
            // 表格内双击事件
            this.$router.push({
                query: { taskNo: row.taskNo },
                path: '/order-manage/task-detail'
            });
        },
        transferBtn(row) {
            this.$confirm('货权转移订单无须仓库扫码出库，是否确认货权转移？', '货权转移', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async action => {
                if (action === 'confirm') {
                    const res = await transferOfGoodsRight({
                        taskNo: row.taskNo
                    });
                    if (res && res.code === '0') {
                        this.$message.success('操作成功');
                    }
                }
            });
        },
        associateBtn(row) {
            this.$refs['associateOrderDialog'].show(true, row.taskNo);
        },
        checkBtn(data) {
            // 表格内按钮查看事件;
            if (data.taskStatus > 260) {
                this.$message({
                    type: 'warning',
                    message: '当前任务不能使用关联'
                });
                return;
            }
            getSearchInfosApi({
                siteCode: data.siteCode,
                whCode: data.whCode,
                inOutType: data.inOutType === 'in' ? 'out' : 'in',
                taskStatus: data.taskStatus
            }).then(res => {
                if (res) {
                    this.tableData = res.data.list.map(val => {
                        return val;
                    });
                    this.showDialog('normal');
                }
            });
        },
        btnView(data) {},
        editBtn(data) {
            const editData = _.clone(data);
            editData.customerName = editData.customerName
                ? editData.customerName
                : '';
            this.editDialog.layout.colList = [];
            this.editDialog.layout.colList.push(
                ...[
                    {
                        text: `任务号：${editData.taskNo}`
                    },
                    {
                        text: `客户简称：${editData.customerName}`
                    },
                    {
                        text: `客户单号：${editData.customerOrderNo}`
                    }
                ]
            );
            editData.scPos = !!editData.scPosFlag;
            this.editDialog.dialogForm.inputList[0].change = !(editData.businessMode === 'B2B' && (+editData.orderStatus) !== 370);
            this.editDialog.dialogForm.inputList[1].readOnly =
                !(editData.deliveryType !== 'ZT' &&
                (
                    (editData.inOutType === 'IN' && Number(editData.orderStatus) < 860) ||
                    ((editData.taskType === 'OUT' || editData.taskType === 'YS') && Number(editData.orderStatus) < 370) ||
                    (editData.taskType === 'DO' && Number(editData.orderStatus) < 450)
                ));
            this.editDialog.dialogForm.inputList[4].readOnly =
                !(editData.taskType !== 'YS' &&
                (
                    (editData.businessMode === 'B2B' && editData.inOutType === 'IN' && Number(editData.orderStatus) < 860) ||
                    (editData.taskType === 'OUT' && Number(editData.orderStatus) < 345 && editData.businessMode === 'B2B') ||
                    (editData.taskType === 'DO' && Number(editData.orderStatus) < 440 && editData.businessMode === 'B2B')
                ));
            this.editDialog.dialogForm.inputList[2].readOnly =
                !(editData.deliveryType !== 'ZT' &&
                (
                    (editData.businessMode === 'B2B' && editData.inOutType === 'IN' && Number(editData.orderStatus) < 860) ||
                    (editData.taskType === 'OUT' && Number(editData.orderStatus) < 370 && editData.businessMode === 'B2B') ||
                    (editData.taskType === 'DO' && Number(editData.orderStatus) < 450 && editData.businessMode === 'B2B') ||
                    (editData.taskType === 'YS' && Number(editData.orderStatus) < 370 && editData.businessMode === 'B2B')
                ));
            this.editDialog.dialogForm.inputList[3].readOnly =
                !(editData.deliveryType !== 'ZT' &&
                (
                    (editData.inOutType === 'IN' && Number(editData.orderStatus) < 860) ||
                    (editData.taskType === 'YS' && Number(editData.orderStatus) < 370) ||
                    (editData.taskType === 'OUT' && Number(editData.orderStatus) < 370) ||
                    (editData.taskType === 'DO' && Number(editData.orderStatus) < 450)
                ));
            this.editDialog.dialogForm.inputList[5].readOnly =
                !(editData.businessMode === 'B2B' && Number(editData.excuteStatus) < 880);
            this.editFormData = editData;
            this.compareData = _.clone(editData);
            this.editVisible = true;
        },
        GetDateT(d) {
            var s;
            s = d.getYear() + 1900 + '-';
            s = s + (d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1) + '-';
            s += d.getDate() < 10 ? '0' + d.getDate() : d.getDate() + '';
            return (s);
        },
        carDialogCheck(value, col) {
            if (value.detailTime) {
                value.carDate = value.detailTime.split(' ')[0];
                value.carTime = value.detailTime;
                delete value.detailTime;
            }
            if (col && col.value === 'type') {
                if (value.type === 2) {
                    const whCode = this.selectedRows[0].whCode;
                    this.carDialog.dialogForm.inputList.map(item => {
                        if (item.value !== 'code') {
                            item.disabled = true;
                            item.advanceUrl += whCode;
                        }
                        if (item.value === 'type' && (item.relyOn && item.relyOn.length)) {
                            item.relyOn.map(child => {
                                child.value = '';
                            });
                        }
                    });
                    value.carDate = '';
                    value.carTime = '';
                    this.carFormValue = { ...this.carFormValue, ...value };
                } else {
                    this.carDialog.dialogForm.inputList.map(item => {
                        if (item.value !== 'carDate') {
                            item.disabled = false;
                        }
                        if (item.value === 'type' && (item.relyOn && item.relyOn.length)) {
                            item.relyOn.map(child => {
                                if (child.field === 'carDate') {
                                    child.value = 'date';
                                } else if (child.field === 'carTime') {
                                    child.value = 'now';
                                } else {
                                    child.value = '';
                                }
                            });
                        }
                    });
                    value.carDate = this.GetDateT(new Date());
                    value.carTime = new Date();
                    this.carFormValue = { ...this.carFormValue, ...value };
                }
            }
        },
        dispatchBtn(data) {
            retract({ taskNo: data.taskNo }).then(res => {
                if (res.code === '0') {
                    this.$message.success('撤回成功');
                    this.getList();
                }
            });
        },
        selectChange(data) {
            // 表格内选择变化
            this.selectedRows = data;
        },
        switchChange(data) {
            // 表格内switch切换事件
        },
        searchChange(data) {
            // if (!data) {
            //     this.searchParams.pageNo = 1;
            // }
            if (data.customerOrderNoFussy && (!data.createdStartTime || !data.customerOrderNo)) {
                this.$message.warning('模糊搜索时必须填写订单号和时间！');
                return;
            }
            // 提交搜索框
            this.loading = true;
            // this.$refs.tablePage.changeLoading(true);
            let createStartTime, createEndTime;
            // 期望提货时间
            if (data.createdStartTime && data.createdStartTime.length) {
                createStartTime = dateTimes(data.createdStartTime[0]);
                createEndTime = dateTimes(data.createdStartTime[1]);
            }
            delete data.createdStartTime;
            if (!(data.customerOrderNo)) {
                if (new Date(createEndTime).getTime() - new Date(createStartTime).getTime() > 90 * 24 * 60 * 60 * 1000) {
                    this.$message.warning('只有时间查询条件时，查询时间跨度不可超过三个月！');
                    this.loading = false;
                    return;
                }
            }
            // 要求发货时间
            let requireOutStartTime, requireOutEndTime;
            if (data.requireOutTime && data.requireOutTime.length) {
                requireOutStartTime = dateTimes(data.requireOutTime[0]);
                requireOutEndTime = dateTimes(data.requireOutTime[1]);
            }
            delete data.requireOutTime;

            // 订单状态多选
            let orderStatusList = '';
            if (data.orderStatus && data.orderStatus.length) {
                orderStatusList = data.orderStatus.join(',');
            }
            delete data.orderStatus;

            // 订单类型多选
            let orderTypeList = '';
            if (data.orderType && data.orderType.length) {
                orderTypeList = data.orderType.join(',');
            }
            delete data.orderType;

            // 任务类型多选
            let taskTypeList = '';
            if (data.taskType && data.taskType.length) {
                taskTypeList = data.taskType.join(',');
            }
            delete data.taskType;

            // 任务状态多选
            let taskStatusList = '';
            if (data.taskStatus && data.taskStatus.length) {
                taskStatusList = data.taskStatus.join(',');
            }
            delete data.taskStatus;

            // 执行状态多选
            let excuteStatusList = '';
            if (data.excuteStatus && data.excuteStatus.length) {
                excuteStatusList = data.excuteStatus.join(',');
            }
            delete data.excuteStatus;

            // 业务类型多选
            let businessTypeList = '';
            if (data.businessType && data.businessType.length) {
                businessTypeList = data.businessType.join(',');
            }
            delete data.businessType;

            // 收货人信息
            if (data.finalCode && data.finalCode.length) {
                data['finalProvinceCode'] = data.finalCode[0];
                data['finalCityCode'] = data.finalCode[1];
                data['finalDistrictCode'] = data.finalCode[2];
                data['finalTownCode'] = data.finalCode[3];
            }
            delete data.finalCode;
            if (data.finalDetailAddr) {
                data.finalDetailAddr = encodeURIComponent(data.finalDetailAddr);
            }

            // 收货人信息
            if (data.senderCode && data.senderCode.length) {
                data['senderProvinceCode'] = data.senderCode[0];
                data['senderCityCode'] = data.senderCode[1];
                data['senderDistrictCode'] = data.senderCode[2];
                data['senderTownCode'] = data.senderCode[3];
            }
            delete data.senderCode;
            if (data.senderDetailAddr) {
                data.senderDetailAddr = encodeURIComponent(data.senderDetailAddr);
            }

            // 网点名称
            if (data.networkName) {
                data.networkName = encodeURIComponent(data.networkName);
            }
            if (data.agingProduct) {
                data.agingProductCode = data.agingProduct;
            }
            delete data.agingProduct;
            // 是否模糊搜索
            const isFuzzy = data.customerOrderNoFussy ? 1 : '';
            delete data.customerOrderNoFussy;

            this.searchParams = Object.assign({}, {
                pageNo: 1,
                pageSize: this.searchParams.pageSize,
                ...data,
                createStartTime,
                createEndTime,
                requireOutStartTime,
                requireOutEndTime,
                orderStatusList,
                orderTypeList,
                taskTypeList,
                taskStatusList,
                excuteStatusList,
                businessTypeList,
                isFuzzy
            });
            this.getList();
        },
        pageChange(data) {
            // 分页器页数变化
            this.searchParams.pageNo = data;
            this.getList();
        },
        sizeChange(data) {
            // 分页器页数大小变化
            this.$set(this.searchParams, 'pageSize', data);
            this.$set(this.searchParams, 'pageNo', 1);
            this.getList();
        },
        addData() {
            // 表格新增方法
            this.$refs.tablePage.$refs.table.addData();
        },
        closeReserve(val, type) {
            if (type === 'sure') {
                const { mFormData } = val;
                if (mFormData.appointTime && !mFormData.appointType) {
                    return this.$message.warning('请选择预约类型');
                }
                if (mFormData.appointType && !mFormData.appointTime) {
                    return this.$message.warning('请选择预约时间');
                }
                appointment({ ...mFormData, ...this.appointmentParams, taskNo: val.taskNo }).then(res => {
                    if (res.code === '0') {
                        this.$message.success('预约成功');
                        this.$refs.reserve.visible = false;
                    }
                });
            } else if (type === 'negative') {
                this.$refs.reserve.formData = { appointTime: this.GetDateT(new Date()) + ' 23:59:59' };
            } else {
                this.$refs.reserve.visible = false;
            }
        },
        removeBtn(data) {
            this.$refs.reserve.formData = { appointTime: this.GetDateT(new Date()) + ' 23:59:59' };
            this.$refs.reserve.showDialog();
            searchTaskOrderDetails({ taskNo: data.taskNo }).then(res => {
                if (res.code === '0') {
                    const d = res.data;
                    this.appointmentParams.orderCode = d.orderNo;
                    this.appointmentParams.businessMode = d.businessMode;
                    this.$refs.reserve.dialogs.dialogForm.inputList.map(
                        item => {
                            if (['appointTime', 'appointReason', 'appointType', 'secendAppointReason'].includes(item.value)) {
                                item.readOnly = true;
                            }
                            if (d.businessMode === 'B2C') {
                                if (['appointTime', 'appointType'].includes(item.value)) {
                                    item.readOnly = false;
                                }
                            } else {
                                if (['appointReason', 'appointType', 'secendAppointReason'].includes(item.value)) {
                                    item.readOnly = false;
                                }
                            }
                            if (item.value === 'appointType') {
                                if (d.orderInfo.orderStatus >= 350) {
                                    item.options = [{ 'label': '配送预约', 'value': 'DELEIVERY_APPOINTMENT' }];
                                } else {
                                    item.options = [{ 'label': '仓内预约', 'value': 'WH_APPOINTMENT' }];
                                }
                            }
                        }
                    );
                    const obj = {};
                    obj.taskNo = d.taskNo;
                    obj.customerOrderNo = d.customerOrderNo;
                    const addr = `${d.taskAddress.finalProvinceName}${d.taskAddress.finalCityName}${d.taskAddress.finalDistrictName}${d.taskAddress.finalTownName}${d.taskAddress.finalDetailAddr}`;
                    obj.receiveMessage = `${d.taskAddress.finalName}/${d.taskAddress.finalMobile}/${addr}`;
                    obj.expectTime = d.expectArriveEndTime
                        ? `${d.expectArriveStartTime}~${d.expectArriveEndTime}`
                        : d.expectArriveStartTime;
                    this.appointmentData = obj;
                }
            });
        },
        saveData(data) {
            // 表格新增修改后返回数据
            this.showDialog('date');
        },
        redomet(data) {
            // 这是删除方法
        },
        getTableConfigList(data) {},
        refresh() {
            // 表格内刷新按钮
            this.$router.go(0);
        },
        closeEditDialog(value) {
            if (!_.isEmptyObject(value)) {
                // if (((value.mFormData.scPos === this.compareData.scPos) && (value.mFormData.businessType === this.compareData.businessType))) {
                //     this.editVisible = false;
                //     return;
                // }
                const params = {
                    taskNo: value.mFormData.taskNo,
                    scPosFlag: value.mFormData.scPos ? 1 : 0,
                    businessType: value.mFormData.businessType,
                    orderRpFlag: value.mFormData.orderRpFlag,
                    remark: value.mFormData.remark,
                    loadType: value.mFormData.loadType,
                    specimenType: value.mFormData.specimenType
                };
                // 如果没修改，不传参数
                if (params['scPosFlag'] === this.compareData['scPosFlag']) {
                    Reflect.deleteProperty(params, 'scPosFlag');
                }
                // 如果只读，不传参数
                if (this.editDialog.dialogForm.inputList[1].readOnly) {
                    Reflect.deleteProperty(params, 'freightBasis');
                }
                if (this.editDialog.dialogForm.inputList[4].readOnly) {
                    Reflect.deleteProperty(params, 'orderRpFlag');
                }
                if (this.editDialog.dialogForm.inputList[2].readOnly) {
                    Reflect.deleteProperty(params, 'businessType');
                }
                if (this.editDialog.dialogForm.inputList[3].readOnly) {
                    Reflect.deleteProperty(params, 'loadType');
                }
                if (this.editDialog.dialogForm.inputList[5].readOnly) {
                    Reflect.deleteProperty(params, 'specimenType');
                }
                taskInfoEditApi(params).then(res => {
                    if (res) {
                        if (+res.code === 0) {
                            if (res.data === true) {
                                this.$message.success(`修改成功`);
                                this.getList();
                            } else {
                                this.$message.warning(`${res.data}`);
                            }
                        }
                    }
                });
            }
            this.editVisible = value.visible;
        },
        closeDialog(value) {
            // 点击确认或取消关闭弹框，返回的布尔值为：value.done
            this.visible = value.visible;
        },
        closeCarDialog(value, type) {
            if (type !== 'sure') {
                this.carFormValue = { type: 1, carTime: new Date(), carDate: this.GetDateT(new Date()) };
                this.carVisible = false;
                this.carDialog.dialogForm.inputList[1].type = 'text';
                this.carDialog.dialogForm.inputList.map(item => {
                    if (item.value !== 'carDate') {
                        item.disabled = false;
                    }
                });
                return;
            }
            this.carFormValue = { ...this.carFormValue, ...value.mFormData };
            const now = new Date(this.carFormValue.carTime);
            const hour = now.getHours() >= 10 ? now.getHours() : '0' + now.getHours();
            const minuite = now.getMinutes() >= 10 ? now.getMinutes() : '0' + now.getMinutes();
            const second = now.getSeconds() >= 10 ? now.getSeconds() : '0' + now.getSeconds();
            const detailTime = hour + ':' + minuite + ':' + second;
            const uploadData = JSON.parse(JSON.stringify(this.carFormValue));
            uploadData.arrivedTime = uploadData.carDate + ' ' + detailTime;
            delete uploadData.carTime;
            delete uploadData.carDate;
            delete uploadData.whCode;
            const n = new Date(new Date()).getTime();
            const time = new Date(uploadData.arrivedTime).getTime();
            if (uploadData.type === 1 && ((n - time > 12 * 3600 * 1000) || now < time)) {
                this.$message.warning('所选时间不得大于登记时间并且不得小于登记时间前12个小时');
                return;
            }
            uploadData.taskNos = this.idList;
            carArrivedInfo(uploadData).then(res => {
                if (res && res.code === '0') {
                    const data = JSON.parse(res.data);
                    this.carDialog.dialogForm.inputList[1].type = 'text';
                    if (data.fails && data.fails.length) {
                        this.$message.error(`部分登记失败(失败任务号：${data.fails.join(',')})，失败原因：任务为美的系任务`);
                    } else {
                        this.$message.success('操作成功');
                    }
                    this.carFormValue = { type: 1, carTime: new Date(), carDate: this.GetDateT(new Date()) };
                    this.carVisible = false;
                }
            });
        },
        search(value) {},
        showDialog(type) {
            if (type === 'normal') {
                this.dialog = this.config.dialog;
                this.visible = true;
            } else {
                if (!this.selectedRows.length) {
                    this.$message.warning('请先勾选数据');
                    return;
                }
                const idList = this.idList = [];
                let ZTcount = 0;
                let ZTcounts = 0;
                let whCodeList = {};
                const inOutTypeList = {};
                this.selectedRows.forEach(item => {
                    if (item.taskNo) {
                        idList.push(item.taskNo);
                    }
                    if (item.whCode) {
                        whCodeList[item.whCode] = 1;
                    }
                    if (item.inOutType) {
                        inOutTypeList[item.inOutType] = 1;
                    }
                    if (item.deliveryType === 'ZT' && item.taskType === 'OUT') {
                        ZTcount++;
                        if (this.selectedRows.length === ZTcount) {
                            ZTcounts = 1;
                        }
                    }
                });
                whCodeList = Object.keys(whCodeList);
                if (Object.keys(inOutTypeList).length > 1 || whCodeList.length > 1 ||
                (inOutTypeList['IN'] !== 1 && ZTcounts === 0) ||
                (inOutTypeList['OUT'] !== 1 && ZTcounts !== 0)) {
                    this.$message.warning('只能登记同仓库的入库任务，请重新选择');
                    return;
                }
                this.$set(this.carFormValue, 'whCode', whCodeList[0]);
                this.$nextTick(() => {
                    this.$refs.carDialog.setDayHeight(this.carDialog.dayHeight);
                });
                this.carVisible = true;
            }
        },
        dialogCheck(value) {
            // 查询按钮
            getSearchInfosApi(value).then(res => {
                if (res) {
                    this.tableData = res.data.list || [];
                }
            });
        },
        getList() {
            getSearchInfosApi(this.searchParams).then(res => {
                this.loading = false;
                // this.$refs.tablePage.changeLoading(false);
                if (res) {
                    this.totalData = res.data.list.map(val => {
                        val.orderStatus = val.orderStatus
                            ? '' + val.orderStatus
                            : '';
                        const hiddenEvent = [];
                        if (Number(val.excuteStatus) >= 880 || !(
                            (val.taskType === 'OUT' && Number(val.orderStatus) < 370 && val.businessMode === 'B2B') ||
                            (val.taskType === 'YS' && Number(val.orderStatus) < 370 && val.businessMode === 'B2B') ||
                            (val.taskType === 'DO' && Number(val.orderStatus) < 450 && val.businessMode === 'B2B') ||
                            (val.businessMode === 'B2B' && val.inOutType === 'IN' && Number(val.orderStatus) < 860)
                        )) {
                            hiddenEvent.push('edit');
                        }
                        if (!(
                            (val.businessMode === 'B2B' &&
                                (
                                    (val.taskType === 'OUT' && Number(val.orderStatus) < 345 && val.excuteStatus < 880) ||
                                    (['IN', 'TF', 'TFI', 'TFO', 'ADO', 'ADI'].includes(val.taskType) &&
                                        ((val.deliveryType === 'ZT' && Number(val.orderStatus) < 860 && val.excuteStatus < 880) ||
                                        (val.deliveryType !== 'ZT' && Number(val.orderStatus) < 370 && val.excuteStatus < 880))) ||
                                    (val.taskType === 'YS' && Number(val.orderStatus) < 370 && val.excuteStatus < 880) ||
                                    (val.taskType === 'DI' && val.orderType === 'DO' && Number(val.orderStatus) < 450 && val.excuteStatus < 880)
                                )
                            ) ||
                            (val.businessMode === 'B2C' &&
                                (
                                    (val.sourceSystem === 'CVTE' && Number(val.orderStatus) < 370 && val.excuteStatus < 880) ||
                                    (['AO', 'RO'].includes(val.orderType) && val.deliveryType !== 'ZT' && Number(val.orderStatus) < 345 && val.excuteStatus < 880)
                                )
                            )
                        )) {
                            hiddenEvent.push('dispatch');
                        }

                        // 预约按钮控制
                        // (1)B2B:（出库任务||分拨出库任务||运输任务）&发车之前;
                        // (2)B2C:（出库任务||分拨出库任务）
                        if (!(
                            (val.businessMode === 'B2C' && ['OUT', 'DO'].includes(val.taskType)) ||
                            (val.businessMode === 'B2B' && ['OUT'].includes(val.taskType) && Number(val.orderStatus) < 370) ||
                            (val.businessMode === 'B2B' && ['YS'].includes(val.taskType) && Number(val.orderStatus) < 370) ||
                            (val.businessMode === 'B2B' && ['DO'].includes(val.taskType) && Number(val.orderStatus) < 450) ||
                            (val.businessMode === 'B2B' && ['DO', 'PO'].includes(val.orderType) && val.deliveryType === 'NET' && Number(val.orderStatus) < 690)
                        )) {
                            hiddenEvent.push('remove');
                        }
                        if (val.orderStatus !== 880) {
                            // 根据任务类型判断 by yy
                            // if (!(val.businessMode === 'B2B' && (val.orderType === 'AO' || val.orderType === 'PO') && val.orderStatus < 320)) {
                            if (!(val.businessMode === 'B2B' && val.taskType === 'OUT' && val.orderStatus < 320)) {
                                hiddenEvent.push('transfer');
                            }
                            // if (!(val.businessMode === 'B2B' && (val.orderType === 'AI' || val.orderType === 'PI') && val.orderStatus < 860)) {
                            if (!(val.businessMode === 'B2B' && val.taskType === 'IN' && val.orderStatus < 860)) {
                                hiddenEvent.push('associate');
                            }
                            val.hiddenEvent = hiddenEvent;
                        }
                        val.distributionFlagName = val.distributionFlag === 1 ? '是' : '否';
                        val.scPosFlagName = val.scPosFlag === 1 ? '是' : '否';
                        val.upstreamDocTypeName = val.upstreamDocType === 1 ? '是' : '否';
                        val.receiverDetailAddr = [val.receiverProvinceName, val.receiverCityName, val.receiverDistrictName, val.receiverDetailAddr].join(' / ');
                        // val.hiddenEvent = val.deliveryType === 'ZT' || val.deliveryType === 'MJZT' ? ['edit'] : '';
                        return val;
                    });
                    this.pageTotal = res.data.totalCount;
                }
            });
        },
        // 任务下发
        async taskDistibute() {
            if (this.selectedRows.length > 0) {
                const res = await taskDistribute(
                    this.selectedRows.map(i => i.taskNo)
                );
                if (res && res.code === '0') {
                    if (res.msg && res.desc !== 'Success') {
                        this.$message.warning(res.msg);
                    } else {
                        this.$message.success('下发成功');
                    }
                    this.getList();
                }
            }
        },
        handlerOverdue() {
            this.$refs['handlerOverdueDialog'].show(true, this.selectedRows);
        },
        // 导出
        exportFile() {
            const params = { ...this.searchParams };
            Reflect.deleteProperty(params, 'pageNo');
            Reflect.deleteProperty(params, 'pageSize');
            exportTask(params).then(res => {
                this.$message.success('已发送导出请求，请稍后到右上角“用户文件列表”中下载');
            });
        },
        init() {
            const query = this.$route.query;
            const initSearchInfo = {};
            if (query.requireOutStartTime) {
                // 工作管理台跳转
                if (query.requireOutStartTime) {
                    initSearchInfo.requireOutTime = [new Date(query.requireOutStartTime), new Date(query.requireOutEndTime)];
                }
                if (query.orderStatusList) {
                    initSearchInfo.orderStatus = query.orderStatusList.split(',');
                }
                if (query.taskTypeList) {
                    initSearchInfo.taskType = query.taskTypeList.split(',');
                }
            } else {
                // 默认参数
                const startTime = moment().subtract(1, 'M').startOf('day');
                const endTime = moment().endOf('day');
                query.createStartTime = startTime.format('YYYY-MM-DD HH:mm:ss');
                query.createEndTime = endTime.format('YYYY-MM-DD HH:mm:ss');
                initSearchInfo.createdStartTime = [startTime.toDate(), endTime.toDate()];
            }
            this.initSearchInfo = initSearchInfo;
            this.searchParams = Object.assign({}, {
                pageSize: 10,
                pageNo: 1
            }, query);
            this.$router.replace({ name: 'taskCenter', query: {} });
            // this.getList();
            // this.$refs.tablePage.changeLoading(true);
        },
        handleClose() {
            this.logVisible = false;
        },
        btnClick(val, index, row) {
            getTaskLogApi({ taskNo: row.taskNo }).then(res => {
                if (res.code === '0') {
                    this.logTableData = res.data;
                    this.logVisible = true;
                }
            });
        }
    },
    mounted() {
        const agingProductSearchItem = this.config.searchTotalTitle.find(item => item.value === 'agingProduct');
        getAgingProduct({
            pageNo: 1,
            pageSize: 9999
        }).then(res => {
            if (res && res.code === '0') {
                agingProductSearchItem.options = res.data.list.filter(item => item.agingProductType === 'STANDARD').map(item => {
                    return {
                        label: item.agingProductName,
                        value: item.agingProductCode
                    };
                });
            }
        });
        this.init();
    },
    watch: {
        $route: {
            handler(n, o) {
                if ((o.path === '/index' && n.query.isRefresh)) {
                    this.init();
                }
            },
            deep: true
        }
    }
};
</script>
<style lang="less">
.tablePage {
    .el-button--text {
        padding: 0
    }
}
// .task_center-list {
    // .el-pager {
    //     & > .number {
    //         display: none;
    //         &.active {
    //             display: inline-block;
    //         }
    //     }
    //     & > .more {
    //         display: none;
    //     }
    // }
// }
</style>
