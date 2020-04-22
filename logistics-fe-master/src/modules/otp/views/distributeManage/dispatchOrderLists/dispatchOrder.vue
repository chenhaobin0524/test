<template>
    <paper class="dispatchOrder">
        <m-pane
            ref="tablePage"
            :config="config"
            :totalData="totalData"
            :pageTotal="pageTotal"
            :searchTotalTitle="config.searchTotalTitle"
            :optionNum="optionNum"
            :loading="loading"
            searchId="dispatchOrderQuery"
            pageID="dispatchOrder"
            :currentPage='currentPage'
            @row-db-click="rowDBclick"
            @device-btn="deviceBtn"
            @check-btn="checkBtn"
            @adjust-btn="adjustBtn"
            @dispatch-btn="dispatchBtn"
            @print-btn="printBtn"
            @editor-btn="editorBtn"
            @recalculate-btn="recalculateBtn"
            @trajectory-btn="trajectoryBtn"
            @selectChange="selectChange"
            @searchChange="searchChange"
            @pageChange="pageChange"
            @sizeChange="sizeChange"
        >
            <div slot="table-module-btn">
                <el-tooltip effect="dark" content="导出" placement="bottom">
                    <span class="mgl-10">
                    <el-button icon="el-icon-download" size="mini" @click="exportFile"></el-button>
                    </span>
                </el-tooltip>
            </div>
            <div slot="page-module-btn">
                <el-button type="primary" @click="handleStart" v-has="'04040006'" :disabled="startDisabled">发 车</el-button>
            </div>
        </m-pane>

        <supplier-dialog
            v-if='controlVisiable'
            :controlVisiable.sync="controlVisiable"
            @cancelControl="cancelControl"
            @addOkControl="addOkControl"
            :dataLists='dataObj'
        ></supplier-dialog>

        <carDialog
            @handleStartClose="handleStartClose"
            @start="start"
            :diaShaow.sync="diaShaow"
        ></carDialog>

        <initiation-slip-dialog
            v-if="cellShaowForm"
            :cellShaowForm.sync="cellShaowForm"
            @handleCellFormClose="handleCellFormClose"
            @cellStartForm="cellStartForm"
        ></initiation-slip-dialog>

        <print-dialog
            ref="print"
            v-if="dialogVisible"
            :isShowElectron="isShowElectron"
            :dialogVisible.sync="dialogVisible"
            :rowPrintData="rowPrintData"
            @handleBillClose="handleBillClose"
            @cancelBill="cancelBill"
        ></print-dialog>

        <car-scheduling-dialog
            ref="AdmittRuleForm"
            :label-position="labelPosition"
            :RwCarVisiable.sync="RwCarVisiable"
            v-if='RwCarVisiable'
            :inOutType="dataObj.inOutType"
            @handleRwCarClose="handleRwCarClose"
            @AdmittOk="AdmittOk"
            :dataLists='dataObj'>
        </car-scheduling-dialog>

        <deviceDialog
            v-if='deviceVisible'
            :visible.sync='deviceVisible'
            :row='deviceRow'
            @refresh='clickSearch'
            >
        </deviceDialog>
        <detail-dialog ref="detailDialog" v-if='isDetailShow' :isDetailShow.sync="isDetailShow" class="adjust"
            :label-position="labelPosition" @isDetailShowClose="isDetailShowClose" @detailShowOk="detailShowOk" :dispatchNo="dispatchNo"></detail-dialog>
    </paper>
</template>
<script>
import mPane from '@/components/otpPanel';
import config from './dispatch.json';
import paper from '@/components/core/paper/Paper';
import carSchedulingDialog from '../../../components/dialog/carSchedulingDialog';
import supplierDialog from '../../../components/dialog/supplierDialog';
import initiationSlipDialog from '../../../components/dialog/initiationSlipDialog';
import printDialog from '../../../components/dialog/printDialog';
import carDialog from '../../../components/dialog/carDialog';
import detailDialog from '../../../components/dialog/detailDialog';
import configs from '@/config/user.env';
import formatTime from '@/utils/common.js';
import { getDispathOrderLists, getDispathOrderNoInitiationSlip, getDispathOrderStart, getDispathOrderPreservation, updataPrintTimes,
    getDispathOrderWarehouse, taskStatuLists, dispatchExport, printCheck } from '../../../api/dispatchOrder';
import deviceDialog from './deviceDialog';
import { mapState } from 'vuex';
export default {
    name: 'dispatchOrder',
    components: { mPane, paper, carSchedulingDialog, supplierDialog, initiationSlipDialog, printDialog, carDialog, deviceDialog, detailDialog },
    data() {
        return {
            deviceRow: {},
            deviceVisible: false,
            dataObj: {},
            radio: '',
            radios: '',
            restaurants: [],
            timeout: null,
            besArriveDate: '',
            payMethod: '',
            procurements: [],
            characteristics: [],
            chargingOptions: [],
            carArrivals: [],
            taxRates: [],
            driverControlOptions: [],
            vehicleCardControlOptions: [],
            LicensePlateOptions: [],
            value: '',
            labelPosition: 'right',
            diaShaow: false,
            controlVisiable: false,
            cellShaowForm: false,
            dialogVisible: false,
            warehouseVisible: false,
            RwCarVisiable: false,
            isIndeterminate: true,
            config: config,
            loading: false,
            startDisabled: false,
            isShowElectron: false,
            isDetailShow: false,
            optionNum: 'SYS_WM_ASN_STATUS,SYS_WM_SO_STATUS',
            totalData: [],
            selected: [],
            radioItems: [],
            hiddenEventType: [],
            searchDataLists: {},
            pageTotal: 0,
            currentPage: 1,
            page: {
                pageNo: 1,
                pageSize: 10
            },
            delPrintTimes: '',
            printTimesDistribution: '',
            collprints: '',
            outPrints: '',
            transferOrderPrints: '',
            rowPrintData: {}
        };
    },
    computed: {
        ...mapState({ user: state => state.user })
    },
    methods: {
        // 调用点击搜索按钮
        clickSearch() {
            this.$refs.tablePage.$refs.searchList.onSearchChange();
        },
        // 设备按钮
        deviceBtn(data) {
            this.deviceRow = data;
            this.deviceVisible = true;
        },
        // 编辑按钮
        checkBtn(data) {
            this.dataObj = data;
            this.dispatchNo = data.dispatchNo;
            this.version = data.version;
            this.RwCarVisiable = true;
        },
        // 取消发车单按钮
        dispatchBtn(data) {
            this.version = data.version;
            this.dispatchNo = data.dispatchNo;
            this.cellShaowForm = true;
        },
        // 打印按钮
        printBtn(data) {
            this.rowPrintData = data;
            if (data.inOutType === 'YS') {
                this.isShowElectron = true;
            } else {
                this.isShowElectron = false;
            }
            this.dispatchNo = data.dispatchNo;
            this.version = data.version; // 版本号
            this.delPrintTimes = data.deliveryPrintTimes || ''; // 打印提货单次数
            this.printTimesDistribution = data.distributionPrintTimes || ''; // 打印配送单次数
            this.collprints = data.collectPrintTimes || ''; // 打印集配单次数
            this.outPrints = data.outPrintTimes || ''; // 打印出库单次数
            this.transferOrderPrints = data.allocatePrintTimes || ''; // 打印分拨交接单次数
            this.electronPrints = data.ysPrintTimes || ''; // 打印电子回单次数
            this.unifiedDistributionPrints = data.unifiedDistributionPrintTimes || ''; // 打印配送单（统配）次数
            this.dialogVisible = true;
        },
        // 编辑按钮 editor
        editorBtn(data) {
            this.dataObj = data;
            this.dispatchNo = data.dispatchNo;
            this.version = data.version;
            this.controlVisiable = true;
        },
        // 轨迹图标按钮
        trajectoryBtn(data) {
            this.$router.push({
                name: 'trafficTrajectory',
                params: {
                    name: '/distribute/traffic-trajectory',
                    dispatchNo: data.dispatchNo
                }
            });
        },
        loader(val) {
            const arriveTypeSetMap = new Map();
            const flagCodeMap = new Map();
            this.loading = true;
            const initialTime = this.$refs.tablePage.$refs.searchList.searchData.createTime;
            const dispatchNos = this.$refs.tablePage.$refs.searchList.searchData.dispatchNo;
            var params = {
                pageNo: this.page.pageNo,
                pageSize: this.page.pageSize,
                dispatchNo: dispatchNos || this.searchDataLists.dispatchNo,
                dispatchStatuss: this.dispatchStatuss,
                startCreateTime: initialTime ? formatTime.formatDateTime(initialTime[0]) : '',
                endCreateTime: initialTime ? formatTime.formatDateTime(initialTime[1]) : '',
                startDispatchTime: this.searchDataLists.dispatchTime ? this.searchDataLists.dispatchTime[0] : '',
                endDispatchTime: this.searchDataLists.dispatchTime ? this.searchDataLists.dispatchTime[1] : '',
                taskNo: this.searchDataLists.taskNo,
                isPrintAssembly: this.searchDataLists.isPrintAssembly,
                siteName: this.searchDataLists.siteName,
                siteCode: this.searchDataLists.siteCode,
                whName: this.searchDataLists.whName,
                whCode: this.searchDataLists.whCode,
                procurementChannel: this.searchDataLists.procurementChannel,
                createUserNameDispatch: this.searchDataLists.createUserNameDispatch,
                custOrderNo: this.searchDataLists.custOrderNo,
                orderNo: this.searchDataLists.orderNo,
                carrierName: this.searchDataLists.carrierName,
                vehicleCard: this.searchDataLists.vehicleCard,
                ...val
            };
            const startTime = params.startCreateTime;
            const endTime = params.endCreateTime;
            var timeDifference = new Date(endTime).getTime() - new Date(startTime).getTime();
            if ((params.whCode || params.whName) && Math.floor(timeDifference / (24 * 3600 * 1000)) > 7) {
                this.$message.error('暂可查询7天内发车单');
                this.loading = false;
                return;
            }
            this.currentPage = this.page.pageNo;
            arriveTypeSetMap.set('', '').set('01', '手动到车').set('02', '直通宝到车');
            flagCodeMap.set('Y', '是').set('N', '否');
            getDispathOrderLists(params).then(res => {
                if (res && res.code === '0') {
                    this.totalData = res.data.list.map((item, index) => {
                        item.carrierVisibleFlagName = item.carrierVisibleFlag === 'Y' ? '是' : '否';
                        item['vehicleCard/equipmentName'] =
                            (item.vehicleCard ? item.vehicleCard : '') + '/' + (item.equipmentName ? item.equipmentName : '');
                        item['driver/driverContactWay'] =
                            (item.driver ? item.driver : '') + '/' + (item.driverContactWay ? item.driverContactWay : '');
                        item.dmsText = item.dmsFlag === 0 ? '否' : '是';
                        item.arriveType = arriveTypeSetMap.get(item.arriveType);
                        item.noCarPlatformFlagText = flagCodeMap.get(item.noCarPlatformFlag);
                        item.originDispatchStatus = item.dispatchStatus;
                        item.deviceTypeName = sessionStorage.deviceType ? JSON.parse(sessionStorage.deviceType)[item.deviceType] : item.deviceType;
                        item.dispatchStatus = window.sessionStorage.DISPATCH_STATUS ? JSON.parse(window.sessionStorage.DISPATCH_STATUS)[item.dispatchStatus] : item.dispatchStatus;
                        item.exceptionTypeName = window.sessionStorage.exception_type ? JSON.parse(window.sessionStorage.exception_type)[item.exceptionType] : item.exceptionType;
                        item.procurementChannelTetx = window.sessionStorage.OTP_TMS_PROCUREMENT_CHANNEL
                            ? JSON.parse(window.sessionStorage.OTP_TMS_PROCUREMENT_CHANNEL)[item.procurementChannel] : item.procurementChannel;
                        item.noCarCarrierTypeName = window.sessionStorage.no_car_carrier_type
                            ? JSON.parse(window.sessionStorage.no_car_carrier_type)[item.noCarCarrierType] : item.noCarCarrierType;
                        return item;
                    });
                    this.totalData.forEach((subItem, subIndex) => {
                        subItem.hiddenEvent = this.hiddenEventType = [];
                        if (subItem.dispatchStatus === '待确认') {
                            subItem.hiddenEvent.push('print');
                        }
                        if (subItem.dispatchStatus === '完成' || subItem.dispatchStatus === '待签收' || subItem.dispatchStatus === '抵达' || subItem.dispatchStatus === '在途') {
                            subItem.hiddenEvent.push('check', 'dispatch', 'editor');
                        }
                        if (subItem.dispatchStatus === '待到车' || subItem.dispatchStatus === '待装车' || subItem.dispatchStatus === '待发车') {
                            subItem.hiddenEvent.push('dispatch');
                        }
                        if (!(subItem.procurementChannel === '190' && Number(subItem.originDispatchStatus) <= 30)) {
                            subItem.hiddenEvent.push('adjust');
                        }
                    });
                    this.pageTotal = res.data.totalCount;
                    this.loading = false;
                } else {
                    this.loading = false;
                }
            }).catch(() => {
                this.loading = false;
            });
            this.taskLists();
        },
        AdmittOk(formName) {
            const version = this.version;
            const dispatchNo = this.dispatchNo;
            formName.data['dispatchNo'] = dispatchNo;
            formName.data['version'] = version;
            if (formName.state === true) {
                getDispathOrderPreservation(formName.data, this.dispatchNo, this.version).then(res => {
                    if (res && res.code === '0') {
                        this.$message.success('编辑成功');
                        this.RwCarVisiable = false;
                        this.loader();
                    } else {
                        this.RwCarVisiable = true;
                    }
                }).catch(() => {
                    this.RwCarVisiable = true;
                });
            } else {
                return false;
            }
        },
        handleRwCarClose() { this.RwCarVisiable = false; },
        async validPrint() {
            const res = await printCheck({ dispatchNo: this.dispatchNo, printType: this.$refs.print.radio });
            return res;
        },
        async cancelBill(radio) {
            if (+radio === 1) {
                this.printTimes = this.printTimesDistribution === '' ? 0 : this.printTimesDistribution;
            } else if (+radio === 2) {
                this.printTimes = this.collprints === '' ? 0 : this.collprints;
            } else if (+radio === 3) {
                this.printTimes = this.delPrintTimes === '' ? 0 : this.delPrintTimes;
            } else if (+radio === 4) {
                this.printTimes = this.outPrints === '' ? 0 : this.outPrints;
            } else if (+radio === 7) {
                this.printTimes = this.transferOrderPrints === '' ? 0 : this.transferOrderPrints;
            }
            if (radio !== '') {
                if (!await this.validPrint()) {
                    return false;
                }
                let api = `${configs.apiUrl}/api-otp/dispatch/print?dispatchNo=${this.dispatchNo}&printType=${this.$refs.print.radio}`;
                this.dialogVisible = false;
                let params = { dispatchNo: this.dispatchNo, printType: this.$refs.print.radio };
                if (+radio === 12 || +radio === 14 || +radio === 15 || +radio === 17 || +radio === 18 || +radio === 19) {
                    params = { ...params, username: this.user.userName };
                    api = api + `&username=${this.user.userName}`;
                }
                const paramsData = { dispatchNo: this.dispatchNo, printType: this.$refs.print.radio, version: this.version, printTimes: this.printTimes };
                Promise.all([getDispathOrderWarehouse, updataPrintTimes(paramsData)]).then(res => {
                    // this.loader(this.searchDataLists);
                }).catch(() => {
                    this.$message.warning('请求超时');
                });
                getDispathOrderWarehouse(params).then(res => {
                    if (+radio === 7 || +radio === 8 || +radio === 9 || (+radio >= 12 && +radio <= 20)
                    ) {
                        // request({ url: api, method: 'get' }).then(res => {
                        if (res) {
                            window.open(res.data);
                        }
                        // }).catch(() => {});
                    } else {
                        window.open(api);
                    }
                });
                // updataPrintTimes(paramsData).then(res => {});
            } else {
                this.$message.warning('请选择一条单据');
                return false;
            }
        },
        handleBillClose() { this.dialogVisible = false; },
        handleCellFormClose() { this.cellShaowForm = false; },
        cellStartForm() {
            const params = {
                dispatchNo: this.dispatchNo
                // version: this.version
            };
            getDispathOrderNoInitiationSlip(params).then(res => {
                if (res.code === '0') {
                    this.$message.success('取消发车单成功');
                    this.loader();
                }
            });
            this.cellShaowForm = false;
        },
        addOkControl(formName) {
            const version = this.version;
            const dispatchNo = this.dispatchNo;
            formName.data['dispatchNo'] = dispatchNo;
            formName.data['version'] = version;
            if (formName.state === true) {
                getDispathOrderPreservation(formName.data, this.dispatchNo, this.version).then(res => {
                    if (res && res.code === '0') {
                        this.$message.success('保存成功');
                        this.loader();
                    }
                });
            } else {
                return false;
            }
        },
        cancelControl() { this.controlVisiable = false; },
        selectChange(data) {
            data.forEach(item => {
                this.dispatchNo = item.dispatchNo;
            });
            this.selected = [].concat(data);
        },
        handleStart() {
            if (this.selected.length === 0) {
                this.$message.warning('至少选择一条数据');
                return;
            } else if (this.selected.length > 20) {
                this.$message.warning('最多只能选择20条数据');
                return;
            }
            for (let index = 0; index < this.selected.length; index++) {
                if (this.selected[index].dispatchStatus !== '待发车') {
                    this.diaShaow = false;
                    return this.$message.warning('已装车状态下才能发车');
                } else {
                    if (this.selected[index].dmsFlag === '1' && this.selected[index].totalMileage <= 0) {
                        return this.$message.warning('未计算里程，不允许发车');
                    } else {
                        this.diaShaow = true;
                    }
                }
            }
        },
        start() {
            var arr = [];
            this.selected.forEach(item => {
                arr.push({ dispatchNo: item.dispatchNo, version: item.version, inOutType: item.inOutType, queueCode: item.queueCode });
            });
            getDispathOrderStart(arr).then(res => {
                let message = '';
                let type = '';
                res.data.forEach(item => {
                    if (item.success === 1) {
                        type = `warning`;
                        message += `<div style='line-height: 30px;'>
                                <span style='color: #e6a23c;'>发车单号</span>
                                <span style='color: #e6a23c;'>${item.dispatchNo}</span>
                                <span style='color: #e6a23c;'>${item.message}</span></div>`;
                    } else if (item.success === 0) {
                        type = `success`;
                        message += `<div style='line-height: 30px;'>
                                <span style='color: #67c23a;'>发车单号</span>
                                <span style='color: #67c23a;'>${item.dispatchNo}</span>
                                <span style='color: #67c23a;'>${item.message}</span></div>`;
                    } else {
                        type = `warning`;
                        message += `<div style='line-height: 30px;'>
                                <span style='color: #909399;'>发车单号</span>
                                <span style='color: #F56C6C;'>${item.dispatchNo}</span>
                                <span style='color: #409EFF;'>${item.message}</span></div>`;
                    }
                });
                const duration = 5000 + res.data.length * 1500;
                this.$message({
                    type: type,
                    duration,
                    dangerouslyUseHTMLString: true,
                    message,
                    showClose: true
                });
                this.startDisabled = false;
                this.loader(this.val);
            }).catch(() => {
                this.startDisabled = false;
            });
            this.diaShaow = false;
            this.startDisabled = true;
        },
        handleStartClose() { this.diaShaow = false; },
        rowDBclick(row) {
            this.$router.push({
                query: { dispatchNo: row.dispatchNo },
                path: `/dispatch-order/dispatch-order-detail`
            });
        },
        searchChange(data) {
            data.dispatchStatuss = data.dispatchStatus.join();
            delete data.dispatchStatus;
            this.page.pageNo = 1;
            this.searchDataLists = data;
            if (this.searchDataLists.createTime !== null && this.searchDataLists.createTime !== '') {
                this.searchDataLists.startCreateTime = formatTime.formatDateTime(this.searchDataLists.createTime[0]);
                this.searchDataLists.endCreateTime = formatTime.formatDateTime(this.searchDataLists.createTime[1]);
                delete this.searchDataLists.createTime;
            } else {
                this.searchDataLists.startCreateTime = '';
                this.searchDataLists.endCreateTime = '';
            }
            if (this.searchDataLists.dispatchTime) {
                if (this.searchDataLists.dispatchTime !== null && this.searchDataLists.dispatchTime !== '') {
                    this.searchDataLists.startDispatchTime = this.searchDataLists.dispatchTime[0];
                    this.searchDataLists.endDispatchTime = this.searchDataLists.dispatchTime[1];
                } else {
                    this.searchDataLists.startDispatchTime = '';
                    this.searchDataLists.endDispatchTime = '';
                }
            } else {
                return this.loader(this.searchDataLists);
            }
            this.taskNo = data.taskNo;
            this.isPrintAssembly = data.isPrintAssembly;
            this.siteName = data.siteName;
            this.siteCode = data.siteCode;
            this.whName = data.whName;
            this.whCode = data.whCode;
            this.procurementChannel = data.procurementChannel;
            this.createUserNameDispatch = data.createUserNameDispatch;
            this.custOrderNo = data.custOrderNo;
            this.orderNo = data.orderNo;
            this.carrierName = data.carrierName;
            this.vehicleCard = data.vehicleCard;
            delete this.searchDataLists.dispatchTime;
            // delete data.dispatchStatus;
            this.loader(this.searchDataLists);
        },
        sizeChange(data) {
            this.currentPage = 1;
            this.page.pageSize = data;
            this.page.pageNo = 1;
            this.loader(this.searchDataLists);
        },
        pageChange(data) {
            this.page.pageNo = data;
            this.loader(this.searchDataLists);
        },
        taskLists() {
            taskStatuLists().then(res => {
                const taskObj = {};
                for (let index = 0; index < res.data.list.length; index++) {
                    taskObj[res.data.list[index].code] = res.data.list[index].name;
                }
                sessionStorage.setItem('TRANSPORT_STATUS', JSON.stringify(taskObj));
            });
        },
        adjustBtn(data) {
            this.dispatchNo = data.dispatchNo;
            this.isDetailShow = true;
        },
        isDetailShowClose() { this.isDetailShow = false; },
        detailShowOk(code) {
            if (code.code === '0') {
                this.isDetailShow = false;
                this.$nextTick(() => {
                    this.loader();
                });
            }
        },
        recalculateBtn() { // 重算
        },
        exportFile() {
            const initialTime = this.$refs.tablePage.$refs.searchList.searchData.createTime;
            this.searchDataLists.startCreateTime = initialTime ? formatTime.formatDateTime(initialTime[0]) : '';
            this.searchDataLists.endCreateTime = initialTime ? formatTime.formatDateTime(initialTime[1]) : '';
            const params = { ...this.searchDataLists };
            Reflect.deleteProperty(params, 'pageNo');
            Reflect.deleteProperty(params, 'pageSize');
            dispatchExport(params).then(res => {
                if (res) {
                    this.$message.success('已发送导出请求，请稍后到右上角“用户文件列表”中下载');
                }
            });
        }
    },
    mounted() {
        // setTimeout(() => {
        //     this.loader();
        // }, 50);
    },
    beforeRouteEnter (to, from, next) {
        if (from.path === '/order-manage/task-detail') {
            next(vm => {
                if (vm.$route.params.dispatchNo) {
                    vm.$refs.tablePage.$refs.searchList.searchData.dispatchNo = vm.$route.params.dispatchNo;
                    vm.$refs.tablePage.$refs.searchList.searchData.createTime = '';
                    vm.loader();
                }
            });
        } else {
            next();
        }
    }
};
</script>

<style lang="less">
@import './dispatchOrder.less';
</style>
