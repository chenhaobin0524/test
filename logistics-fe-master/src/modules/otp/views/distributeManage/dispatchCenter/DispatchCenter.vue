<template>
  <paper class="dispatch-center" style="height: 100%">
    <el-main v-loading="mainLoading" class="main-loading">
        <m-pane
        ref="tablePage"
        :config="config"
        :totalData="totalData"
        :totalTargetData="totalTargetData"
        :sourceRootData="sourceTree"
        :mulSourceSel="true"
        :targetRootData="targetTree"
        :pageTotal="pageTotal"
        :searchTotalTitle="searchTotalTitle"
        :optionNum="optionNum"
        :loading="loading"
        :targetTableLoading="targetTableLoading"
        :verification="verification"
        :sourceTitle="sourceTitle"
        :targetTitle="targetTitle"
        :endMoveHeight="endMoveHeight"
        :columnNum="columnNum" :isRefreshTarget="true"
        searchId="dispatch_center_query"
        pageID="dispatch_center"
        @getTableConfigList="getTableConfigList"
        @allocate-btn="allocateBtn"
        @cancleAllocate-btn="cancleAllocateBtn"
        @searchChange="searchChange"
        @root-click="rootClick"
        @source-select-change="sourceSelChange"
        @target-select-change="targetSelChange"
        @search-input="searchInput"
        @sourceCellDblclick="sourceCellDblclick"
        @targetCellDblclick="targetCellDblclick"
        @refreshTarget="refreshTargetList"
        >
        <div slot="table-module-btn">
            <el-tooltip effect="dark" content="撤回" placement="bottom">
                <span class="mgl-10">
                <el-button icon="el-icon-refresh-right" size="mini" @click="revocation"></el-button>
                </span>
            </el-tooltip>
            <el-tooltip effect="dark" content="下发" placement="bottom">
                <span class="mgl-10">
                <el-button icon="el-icon-thumb" size="mini" @click="issued"></el-button>
                </span>
            </el-tooltip>
            <el-tooltip effect="dark" content="修改配送方式" placement="bottom">
                <span v-has="'04010007'" class="mgl-10">
                <el-button icon="el-icon-s-operation" size="mini" @click="handleDelivery"></el-button>
                </span>
            </el-tooltip>
        </div>
        <div slot="target-table-header" class="target-table-header" @mousedown.stop.prevent="mousedownTabelHeight">
            <DispaHeader :tarSelRoot="tarSelRoot"
            :totalTargetData="totalTargetData" :totalData="totalData"
            :cheList="cheList" :dropdownList="dropdownList" :checkedSourceList="checkedSourceList"
            :transDisable="transferDisable" :confDisable="confirmDisable"
            :flag="flag" :groupPolicyCode="groupPolicyCode" :groupPolicyValArr="groupPolicyValArr" :sourceTree="sourceTree"
            :currWarehouseGroup="currWarehouseGroup" :currInOutType="currInOutType"
            @newDispOrder="newDispOrder" @leftList="leftList" @intelArr="intelliArrange"
            @arraVisi="arraVisi" @arrangeConfirmOk="arrangeConfirmOk" @totalDataChange="totalDataChange">
            </DispaHeader>
        </div>
        <div slot="expand-table-cont" slot-scope="{expandTable}">
            <expand-table-content :contentTableData="expandTable" :columnsList="expandTableHeader"></expand-table-content>
        </div>
        </m-pane>
    </el-main>
    <car-scheduling-dialog
        ref="carScheduling"
        label-position="right"
        :RwCarVisiable.sync="arrangeSubmVisi"
        v-if='arrangeSubmVisi'
        :inOutType="currInOutType"
        @AdmittOk="arrangeSubmOk">
    </car-scheduling-dialog>
    <el-dialog title="取消分拨" :visible.sync="centerDialogVisible" width="30%" center>
      <span>是否确认取消分拨？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleCancleAllocate">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="分拨" v-if="tableVisible" :visible.sync="tableVisible" highlight-current-row>
        <distribution :rowData="rowData" ref="distributionRef" @distributionOk="distributionOk" @distributionCancel="distributionCancel"></distribution>
    </el-dialog>
    <delivery-methods v-if="deliveryDialogShow" :deliveryDialogVisiable.sync="deliveryDialogShow" :checkedSourceList="checkedSourceList"
    @deliveryClose="deliveryClose" @deliveryOk="deliveryOk"></delivery-methods>
    <advanceDialog ref="advanceDialog" @confirm="advanceDialogConfirm" rejectClose></advanceDialog>
  </paper>
</template>
<script>
import advanceDialog from '@/components/lots/otpAdvanceDialog';
import { Sortable, MultiDrag } from 'sortablejs';
import mPane from '../../../components/mPanel';
import config from './dispCenterConfig.json';
import paper from '@/components/core/paper/Paper';
import ExpandTableContent from '../components/dispatchCenter/ExpandTableContent';
import { getDictionaryDetailByCode } from '../../../api/common';
import {
    getSourceRoot,
    getSourceData,
    getTargetRoot,
    getTargetData,
    saveCarArrange,
    getCancleAllocate,
    getTransferData,
    intelligentDispatch,
    getDictList,
    issueCarrier,
    confirmIssueCarrier
} from '../../../api/dispatchCenter';
import carSchedulingDialog from '../../../components/dialog/carSchedulingDialog';
import { groupPolicyObj } from '../../../utils/dispatchCenter.js';
import Distribution from './dialog/Distribution';
import DispaHeader from './DispaHeader';
import DeliveryMethods from './dialog/DeliveryMethods';
import formatTime from '@/utils/common.js';
import { setSession } from '@/utils/storage';
Sortable.mount(new MultiDrag());

export default {
    name: 'dispatchCenter',
    components: { mPane, paper, carSchedulingDialog, ExpandTableContent, Distribution, DispaHeader, DeliveryMethods, advanceDialog },
    data() {
        return {
            checkedSourceList: [],
            cheList: [],
            flag: '',
            currentTaskNo: '',
            currentRow: null,
            allocateData: [],
            tableVisible: false,
            centerDialogVisible: false,
            tempTargetTree: [],
            config: config,
            loading: false,
            groupPolicy: '',
            groupPolicyCode: '',
            groupPolicyValArr: [],
            targetTableLoading: false,
            sourceTitle: '待调度',
            sourceTree: [],
            targetTree: [],
            dropdownList: [],
            sourceSelectedRoot: {},
            tarSelRoot: {},
            targetCanSort: true,
            optionNum: 'DELIVERY_TYPE,TRANSPORT_STATUS',
            totalData: [],
            totalDataFirst: [],
            totalTargetData: [],
            pageTotal: 100,
            searchParams: {},
            searchTotalTitle: config.table.searchTotalTitle,
            arrangeSubmVisi: false,
            arrangeForm: { procurementChannel: '' },
            verification: {},
            expandTableHeader: [
                { label: '客户商品编码', prop: 'customerItemCode', width: 180 }, { label: '商品编码', prop: 'itemCode', width: 180 },
                { label: '名称', prop: 'itemName', width: 180 }, { label: '预计发数量', prop: 'unitQty', width: 100 },
                { label: '商品重量', prop: 'weight', width: 100 }, { label: '商品方量', prop: 'volume', width: 100 }
            ],
            startMove: 0,
            endMove: 0,
            endMoveHeight: 0,
            rowData: {},
            mainLoading: false,
            transferDisable: false,
            confirmDisable: false,
            sourceTableDom: '',
            targetTableDom: '',
            sourceTotalListPage: {
                pageNo: 1,
                pageSize: 100,
                total: 0
            },
            targetTotalListPage: {
                pageNo: 1,
                pageSize: 1000000,
                total: 0
            },
            columnNum: 15,
            mulTotalData: [],
            timerAllDiff: '',
            timerInOutType: '',
            timerWarehouseGroup: '',
            timerDragLoad: '',
            timerUpDrag: '',
            timerUpBtn: '',
            timerFinalDeliveryType: '',
            deliveryDialogShow: false
        };
    },
    computed: {
        targetTitle: function() {
            return `待发车(${this.targetTree.length || 0})`;
        },
        currWarehouseGroup: function () {
            return this.totalTargetData[0] && this.totalTargetData[0].warehouseGroup;
        },
        currInOutType: function () {
            return this.totalTargetData[0] && this.totalTargetData[0].inOutType;
        }
    },
    methods: {
        // 撤回
        revocation() {
            if (this.checkedSourceList.length === 0) {
                this.$message.warning('请勾选运输单');
                return false;
            }

            const reject = this.checkedSourceList.find(item => item.carrierVisibleFlag === 'N');
            if (reject) {
                this.$message.warning({
                    message: `运输单号：${reject.taskNo} 未下发，无法撤回`,
                    duration: 5000
                });
                return false;
            }
            const reject2 = this.checkedSourceList.find(item => item.taskStatus !== 0);
            if (reject2) {
                this.$message.warning({
                    message: `运输单号：${reject2.taskNo} 非待调度运单，无法撤回`,
                    duration: 5000
                });
                return false;
            }

            this.$confirm('你确定要撤回吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                const params = {
                    carrierVisibleFlag: 'N',
                    taskNos: []
                };
                this.checkedSourceList.forEach(item => params.taskNos.push(item.taskNo));
                issueCarrier(params).then(res => {
                    if (res) {
                        this.checkedSourceList.forEach(item => {
                            item.carrierVisibleFlagName = '否';
                            item.carrierVisibleFlag = 'N';
                            item.carrierName = '';
                            item.carrierCode = '';
                            item.procurementChannel = '';
                            item.procurementChannelName = '';
                        });
                        this.$message.success('撤回成功');
                    }
                }).catch(() => {
                });
            }).catch(() => {
            });
        },
        // 下发 1
        issued() {
            if (this.checkedSourceList.length === 0) {
                this.$message.warning('请勾选运输单');
                return false;
            }
            const reject = this.checkedSourceList.find(item => item.carrierVisibleFlag === 'Y');
            if (reject) {
                this.$message.warning({
                    message: `运输单号：${reject.taskNo} 已下发，不能重复下发`,
                    duration: 5000
                });
                return false;
            }
            const reject2 = this.checkedSourceList.find(item => item.taskStatus !== 0);
            if (reject2) {
                this.$message.warning({
                    message: `运输单号：${reject2.taskNo} 非待调度运单，无法下发`,
                    duration: 5000
                });
                return false;
            }
            this.showAdvanceDialog();
        },
        //  下发 2
        showAdvanceDialog() {
            const options = {
                name: '请输入承运商',
                advanceLabel: '承运商',
                value: 'carrierName',
                advanceConfig: [
                    { prop: 'suppliersNameCn', 'value': '承运商名称' },
                    { prop: 'suppliersCode', 'value': '承运商编码' },
                    { prop: 'tranName', 'value': '采购渠道' }
                ],
                tableConfig: [
                    { prop: 'suppliersNameCn', 'value': '承运商名称' },
                    { prop: 'suppliersCode', 'value': '承运商编码' },
                    { prop: 'tranName', 'value': '采购渠道' }
                ],
                advanceUrl: 'ebSupplier/searchBySupplier',
                cbParams: [
                    'suppliersNameCn#carrierName', 'suppliersCode#carrierCode', 'transType#procurementChannel', 'tranName#procurementChannelName'
                ]
            };
            this.$refs.advanceDialog.show(true, options);
        },
        // 承运商弹框返回值  做下发操作  下发 3
        advanceDialogConfirm(data) {
            const params = {
                carrierVisibleFlag: 'Y',
                taskNos: [],
                ...data
            };
            this.checkedSourceList.forEach(item => params.taskNos.push(item.taskNo));
            issueCarrier(params).then(res => {
                if (res) {
                    const successHandle = () => {
                        this.checkedSourceList.forEach(item => {
                            item.carrierVisibleFlagName = '是';
                            item.carrierVisibleFlag = 'Y';
                            item.carrierName = data.carrierName;
                            item.carrierCode = data.carrierCode;
                            item.procurementChannel = data.procurementChannel;
                            item.procurementChannelName = data.procurementChannelName;
                        });
                        this.$message.success('下发成功');
                        this.$refs.advanceDialog.dialogVisible = false;
                    };
                    if (res.data.flag !== 0) {
                        const tipArr = res.data.msg.split(',');
                        this.$confirm(tipArr.join('<br />') + '<br />' + '你确定要下发吗?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            dangerouslyUseHTMLString: true,
                            type: 'warning'
                        }).then(() => {
                            confirmIssueCarrier(params).then(res => {
                                if (res) {
                                    successHandle();
                                }
                            }).catch(() => {
                            });
                        }).catch(() => {
                            this.$refs.advanceDialog.disabledCancel = false;
                        });
                        return false;
                    }
                    successHandle();
                }
            }).catch(() => {
            });
        },
        leftList() {
            this.totalData = [];
            this.totalTargetData = [];
            this.mulTotalData = [];
            this.$refs.tablePage.$refs.searchList.onSearchChange();
        },
        getDictList() { // 针对查询条件无的数据字典（开始配置列未配置该字段，后面选中，数据字典未转换情况）
            getDictList({ 'dictCodes': this.optionNum }).then(res => {
                if (res) {
                    const dictObj = res.data;
                    Object.keys(dictObj).forEach(key => {
                        setSession(key, dictObj[key]);
                    });
                }
            });
        },
        initDispatchList () {
            if (+this.tarSelRoot.intelligentStatus === 10) this.$refs.tablePage.$refs.searchList.onSearchChange();
            this.$refs.tablePage.targetLoading = true;
            const params = { dispatchNo: this.tarSelRoot.dispatchNo, ...this.targetTotalListPage };
            getTargetData(params).then(res => {
                this.$refs.tablePage.targetLoading = false;
                if (res) {
                    const OTP_TMS_PROCUREMENT_CHANNEL = sessionStorage.OTP_TMS_PROCUREMENT_CHANNEL ? JSON.parse(sessionStorage.OTP_TMS_PROCUREMENT_CHANNEL) : {};
                    this.totalTargetData = res.data.list || [];
                    this.totalTargetData.forEach(item => {
                        item.procurementChannelName = OTP_TMS_PROCUREMENT_CHANNEL[item.procurementChannel];
                        item.distributionFlagName = item.distributionFlag === 'N' ? '否' : '是';
                        item.carrierVisibleFlagName = item.carrierVisibleFlag === 'Y' ? '是' : '否';
                        item.scPosFlagName = +item.scPosFlag === 0 ? '否' : (+item.scPosFlag === 1 ? '是' : item.scPosFlag);
                        item.cnDispatchName = +item.cnDispatch === 0 ? '否' : (+item.cnDispatch === 1 ? '是' : item.cnDispatch);
                        item.intelligentStatusName = +item.intelligentStatus === 0 ? '未智能调度' : (+item.intelligentStatus === 1 ? '智能调度成功' : '智能调度失败');
                        item.taskStatusName = window.sessionStorage.TRANSPORT_STATUS ? (JSON.parse(window.sessionStorage.TRANSPORT_STATUS))[item.taskStatus] : item.taskStatus;
                        item.orderTypeName = window.sessionStorage.ORDER_TYPE ? (JSON.parse(window.sessionStorage.ORDER_TYPE))[item.orderType] : item.orderType;
                        item.deliveryTypeName = window.sessionStorage.DELIVERY_TYPE ? (JSON.parse(window.sessionStorage.DELIVERY_TYPE))[item.deliveryType] : item.deliveryType;
                        item.projectClassifyName = window.sessionStorage.PROJECT_CLASSIFY ? (JSON.parse(window.sessionStorage.PROJECT_CLASSIFY))[item.projectClassify] : item.projectClassify;
                        item.taskTypeName = window.sessionStorage.TASK_TYPE ? (JSON.parse(window.sessionStorage.TASK_TYPE))[item.taskType] : item.taskType;
                    });
                }
            }).catch(() => {
                this.$refs.tablePage.targetLoading = false;
            });
        },
        initTransportList (scroll) {
            if (document.getElementById('clickMore')) document.querySelector('.source-table .el-table__body-wrapper').removeChild(document.getElementById('clickMore'));
            if (!scroll) this.sourceTotalListPage.pageNo = 1;
            this.$refs.tablePage.sourceLoading = true;
            const data = Object.assign({}, this.searchParams, this.sourceTotalListPage);
            groupPolicyObj.forEach(item => {
                if (item.name === this.groupPolicy) {
                    this.groupPolicyCode = item.code;
                    data[item.code] = this.sourceSelectedRoot[item.code] || '';
                }
            });
            getSourceData(data).then(resp => {
                this.$refs.tablePage.sourceLoading = false;
                if (resp) {
                    this.sourceSelectedRoot.isActive = !this.sourceSelectedRoot.isActive;
                    this.sourceTotalListPage.total = resp.data.totalCount;
                    const resData = resp.data.list || [];
                    if (this.sourceSelectedRoot.isActive) {
                        this.mulTotalData = this.mulTotalData.concat(resData);
                    } else {
                        const resDataGroupPolicyCode = resData.map(el => el[this.groupPolicyCode]);
                        this.mulTotalData = this.mulTotalData.filter(el => !resDataGroupPolicyCode.includes(el[this.groupPolicyCode]));
                    }
                    let btnCount = 0;
                    const totalTargetDataTaskNo = this.totalTargetData.map(el => el.taskNo);
                    this.mulTotalData = this.mulTotalData.filter(el => {
                        if (totalTargetDataTaskNo.includes(el.taskNo)) {
                            this.sourceTotalListPage.total--;
                        } else {
                            return !totalTargetDataTaskNo.includes(el.taskNo);
                        }
                    });
                    this.totalData = this.mulTotalData;
                    this.totalData.forEach((subItem, subIndex) => {
                        subItem.supplierReserveFlagName = subItem.supplierReserveFlag === 'Y' ? '是' : '否';
                        subItem.carrierVisibleFlagName = subItem.carrierVisibleFlag === 'Y' ? '是' : '否';
                        subItem.distributionFlagName = subItem.distributionFlag === 'N' ? '否' : '是';
                        subItem.scPosFlagName = +subItem.scPosFlag === 0 ? '否' : (+subItem.scPosFlag === 1 ? '是' : subItem.scPosFlag);
                        subItem.cnDispatchName = +subItem.cnDispatch === 0 ? '否' : (+subItem.cnDispatch === 1 ? '是' : subItem.cnDispatch);
                        subItem.intelligentStatusName = +subItem.intelligentStatus === 0 ? '未智能调度' : (+subItem.intelligentStatus === 1 ? '智能调度成功' : '智能调度失败');
                        subItem.taskStatusName = window.sessionStorage.TRANSPORT_STATUS ? (JSON.parse(window.sessionStorage.TRANSPORT_STATUS))[subItem.taskStatus] : subItem.taskStatus;
                        subItem.orderTypeName = window.sessionStorage.ORDER_TYPE ? (JSON.parse(window.sessionStorage.ORDER_TYPE))[subItem.orderType] : subItem.orderType;
                        subItem.deliveryTypeName = window.sessionStorage.DELIVERY_TYPE ? (JSON.parse(window.sessionStorage.DELIVERY_TYPE))[subItem.deliveryType] : subItem.deliveryType;
                        subItem.projectClassifyName = window.sessionStorage.PROJECT_CLASSIFY ? (JSON.parse(window.sessionStorage.PROJECT_CLASSIFY))[subItem.projectClassify] : subItem.projectClassify;
                        subItem.taskTypeName = window.sessionStorage.TASK_TYPE ? (JSON.parse(window.sessionStorage.TASK_TYPE))[subItem.taskType] : subItem.taskType;
                        if ((subItem.orderType === 'DO') || (subItem.orderType === 'RI') || (subItem.taskType === 'IN') || (subItem.taskType === 'YS') || (subItem.taskType === 'DI') ||
                            (subItem.taskType === 'RDI') || (subItem.distributionNum > 2)) {
                            subItem.hiddenEvent = ['allocate', 'cancleAllocate'];
                        } else if (subItem.distributionFlag === 'N') {
                            btnCount++;
                            subItem.hiddenEvent = ['cancleAllocate'];
                        } else if (subItem.distributionFlag === 'Y') {
                            btnCount++;
                            subItem.hiddenEvent = [];
                        }
                        // 添加修改配送方式的逻辑
                        // if ((subItem.orderType === 'DO') || (subItem.orderType === 'RI') || (subItem.taskType === 'IN') || (subItem.taskType === 'YS') || (subItem.taskType === 'DI') ||
                        //     (subItem.taskType === 'RDI') || (subItem.distributionNum > 2)) {
                        //     subItem.hiddenEvent = ['allocate', 'cancleAllocate'];
                        // } else {
                        //     if (subItem.deliveryType === 'NET') {
                        //         subItem.hiddenEvent = ['allocate', 'cancleAllocate'];
                        //     } else if (subItem.distributionFlag === 'N') {
                        //         btnCount++;
                        //         subItem.hiddenEvent = ['cancleAllocate'];
                        //     } else if (subItem.distributionFlag === 'Y') {
                        //         btnCount++;
                        //         subItem.hiddenEvent = [];
                        //     }
                        // }
                    });
                    this.config.table.leftOperation = !!btnCount;
                    this.totalDataFirst = JSON.parse(JSON.stringify(this.totalData));
                }
            }).catch(() => {
                this.$refs.tablePage.sourceLoading = false;
                this.sourceTotalListPage.pageNo--;
            });
        },
        rowDrop() {
            const sourceTbody = document.querySelector(
                '.source-table .el-table__body-wrapper tbody'
            );
            const _this = this;
            this.sortInst = Sortable.create(sourceTbody, {
                group: {
                    name: 'source',
                    pull: true,
                    put: 'target' // 可拖出
                },
                sort: false, // 禁止表内排序
                multiDrag: true,
                onEnd: ({ newIndex, oldIndex, from, to, item }) => {
                    const oldSourceInx = oldIndex;
                    if (from !== to) {
                        // 处理展开详情index顺序乱掉问题
                        if (item.className === '') {
                            oldIndex = oldSourceInx - 1;
                        } else {
                            const trs = from.getElementsByTagName('tr');
                            let trIndex = '';
                            for (let i = 0; i < trs.length; i++) {
                                if (trs[i].className === '') {
                                    trIndex = i;
                                }
                            }
                            if (trIndex === '') {
                                oldIndex = oldSourceInx;
                            } else if (trIndex < oldIndex) {
                                oldIndex = oldSourceInx - 1;
                            }
                        }
                        item.remove();
                        let rows2Transfer = _this.checkedSourceList.filter(el => (_this.currWarehouseGroup === undefined || el.warehouseGroup === _this.currWarehouseGroup) &&
                        (el.inOutType === _this.currInOutType || _this.currInOutType === undefined));
                        const isMulti = rows2Transfer.length > 1;
                        rows2Transfer = isMulti ? rows2Transfer : [_this.totalData[oldIndex]];
                        const sameWhGroup = _this.totalTargetData.length <= 0 || (_this.totalTargetData.length > 0 && rows2Transfer[0].warehouseGroup === _this.currWarehouseGroup);
                        const sameInOutType = _this.totalTargetData.length <= 0 || (_this.totalTargetData.length > 0 && rows2Transfer[0].inOutType === _this.currInOutType);
                        const clone = _this.totalData;
                        _this.totalData = [];
                        if (_this.totalTargetData.length <= 0 || (sameWhGroup && sameInOutType)) {
                            clearTimeout(this.timerAllDiff);
                            clearTimeout(this.timerDragLoad);
                            this.timerAllDiff = setTimeout(() => {
                                _this.$nextTick(() => {
                                    if (_this.totalTargetData.length > 0) {
                                        for (let i = 0; i < rows2Transfer.length; i++) {
                                            if (rows2Transfer[i].finalDetailAddr === _this.totalTargetData[0].finalDetailAddr &&
                                            rows2Transfer[i].deliveryType !== _this.totalTargetData[0].deliveryType) {
                                                _this.$message.warning('终端详细地址一样，配送方式不一样的不能加单');
                                                _this.totalData = clone;
                                                return;
                                            }
                                        }
                                    }
                                    const totalTargetDataTaskNo = _this.totalTargetData.map(el => el.taskNo);
                                    rows2Transfer = rows2Transfer.filter(el => !totalTargetDataTaskNo.includes(el.taskNo));
                                    if (rows2Transfer.length > 1 && (_this.currWarehouseGroup === undefined) && (_this.currInOutType === undefined)) {
                                        for (let i = 1; i < rows2Transfer.length; i++) {
                                            if ((rows2Transfer[i].warehouseGroup !== rows2Transfer[0].warehouseGroup) || (rows2Transfer[i].inOutType !== rows2Transfer[0].inOutType)) {
                                                _this.$message.warning('存在不同仓库分组或不同单据类型的运输单');
                                                _this.totalData = clone;
                                                return;
                                            }
                                            if (rows2Transfer[i].finalDetailAddr === rows2Transfer[0].finalDetailAddr && rows2Transfer[i].deliveryType !== rows2Transfer[0].deliveryType) {
                                                _this.$message.warning('终端详细地址一样，配送方式不一样的不能加单');
                                                _this.totalData = clone;
                                                return;
                                            }
                                        }
                                    }
                                    _this.totalTargetData = [
                                        ...rows2Transfer,
                                        ..._this.totalTargetData
                                    ];
                                    const transTaskNo = rows2Transfer.map(el => el.taskNo);
                                    _this.totalData = clone.filter(el => !transTaskNo.includes(el.taskNo));
                                });
                                this.timerDragLoad = setTimeout(() => {
                                    _this.$nextTick(() => {
                                        if ((sourceTbody.offsetHeight <= document.querySelector('.source-table .el-table__body-wrapper').offsetHeight) &&
                                        this.totalDataFirst.length < this.sourceTotalListPage.total && this.sourceSelectedRoot.isActive) {
                                            this.sourceTotalListPage.pageNo++;
                                            if (this.conColNums(this.sourceTotalListPage.pageNo)) return this.sourceTotalListPage.pageNo--;
                                            this.sourceSelectedRoot.isActive = false;
                                            this.initTransportList(true);
                                        }
                                    });
                                }, 100);
                            }, 80);
                        } else if (!sameWhGroup) {
                            clearTimeout(this.timerWarehouseGroup);
                            this.timerWarehouseGroup = setTimeout(() => {
                                _this.$nextTick(() => {
                                    _this.totalData = clone;
                                    _this.$message.warning('只允许加入同一仓库分组的运输单');
                                });
                            }, 80);
                        } else if (!sameInOutType) {
                            clearTimeout(this.timerInOutType);
                            this.timerInOutType = setTimeout(() => {
                                _this.$nextTick(() => {
                                    _this.totalData = clone;
                                    _this.$message.warning('只允许加入同种单据类型的运输单');
                                });
                            }, 80);
                        }
                    }
                }
            });
            const targetTbody = document.querySelector(
                '.target-table .el-table__body-wrapper tbody'
            );
            Sortable.create(targetTbody, {
                group: {
                    name: 'target',
                    pull: true,
                    put: 'source' // 可放置来自source组的拖拽
                },
                sort: false,
                multiDrag: true,
                onEnd: ({ newIndex, oldIndex, from, to, item }) => {
                    const oldTargetInx = oldIndex;
                    this.groupPolicyValArr = [];
                    if (from !== to) {
                        // 处理展开详情index顺序乱掉问题
                        if (item.className === '') {
                            oldIndex = oldTargetInx - 1;
                        } else {
                            const trs = from.getElementsByTagName('tr');
                            let trIndex = '';
                            for (let i = 0; i < trs.length; i++) {
                                if (trs[i].className === '') {
                                    trIndex = i;
                                }
                            }
                            if (trIndex === '') {
                                oldIndex = oldTargetInx;
                            } else if (trIndex < oldIndex) {
                                oldIndex = oldTargetInx - 1;
                            }
                        }
                        const moreData = _this.cheList.length > 1;
                        const targetTabelData = moreData ? _this.cheList : [_this.totalTargetData[oldIndex]];
                        const targetClone = _this.totalTargetData;
                        _this.totalTargetData = [];
                        clearTimeout(this.timerUpDrag);
                        this.timerUpDrag = setTimeout(() => {
                            _this.$nextTick(() => {
                                if (+this.tarSelRoot.gainingContract) {
                                    _this.$message.warning('获取合同号中，不可以加单');
                                    _this.totalTargetData = targetClone;
                                } else {
                                    for (let i = 0; i < targetTabelData.length; i++) {
                                        if (+targetTabelData[i].taskStatus === 30 && targetTabelData[i].dispatchNo &&
                                        (targetTabelData[i].inOutType === 'OUT' || targetTabelData[i].inOutType === 'YS')) {
                                            _this.totalTargetData = targetClone;
                                            return this.$message.warning(`存在不能减单的运输单：${targetTabelData[i].taskNo}`);
                                        }
                                    }
                                    const targetDataTaskNo = targetTabelData.map(el => el.taskNo);
                                    _this.totalTargetData = targetClone.filter(el => !targetDataTaskNo.includes(el.taskNo));
                                    const currentGroupPolicyData = []; // 在当前分组下要拖的数据
                                    this.groupPolicyValArr = [];
                                    // 多选功能下选中的待调度的分组
                                    this.sourceTree.forEach(item => {
                                        if (item.isActive) this.groupPolicyValArr.push(item[this.groupPolicyCode]);
                                    });
                                    targetTabelData.forEach(item => {
                                        if (this.groupPolicyValArr.includes(item[this.groupPolicyCode])) currentGroupPolicyData.push(item);
                                    });
                                    const curGrototalDataClone = [].concat(_this.totalData);
                                    const targetTabelTask = curGrototalDataClone.map(el => el.taskNo);
                                    currentGroupPolicyData.forEach(item => {
                                        if (this.groupPolicyValArr.length === 0) {
                                            _this.totalData = [];
                                        } else if (this.groupPolicyValArr.includes(item[this.groupPolicyCode]) && !targetTabelTask.includes(item.taskNo)) {
                                            _this.totalData.unshift(item);
                                        }
                                    });
                                }
                            });
                        }, 80);
                    }
                }
            });
        },
        async searchChange(data) {
            this.$refs.tablePage.changeLoading(true);
            this.$refs.tablePage.sourceTreeLoading = true;
            if (data.createTime && data.createTime.length > 0) {
                data.beginDate = formatTime.formatDateTime(data.createTime[0]);
                data.endDate = formatTime.formatDateTime(data.createTime[1]);
            } else if (!data.createTime) {
                data.beginDate = '';
                data.endDate = '';
            }
            if (data.departureTime && data.departureTime.length > 0) {
                data.beginDate1 = data.departureTime[0];
                data.endDate1 = data.departureTime[1];
            } else if (!data.departureTime) {
                data.beginDate1 = '';
                data.endDate1 = '';
            }
            if (data.requireArriveTime && data.requireArriveTime.length > 0) {
                data.requireArriveTimeBegin = data.requireArriveTime[0];
                data.requireArriveTimeEnd = data.requireArriveTime[1];
            } else if (!data.requireArriveTime) {
                data.requireArriveTimeBegin = '';
                data.requireArriveTimeEnd = '';
            }
            delete data.createTime;
            delete data.departureTime;
            delete data.requireArriveTime;
            this.totalData = [];
            this.mulTotalData = [];
            // this.totalTargetData = [];
            if (data.groupPolicy) this.groupPolicy = data.groupPolicy;
            data.taskStatus = '0';
            this.searchParams = {
                ...this.searchParams,
                ...data
            };
            await getSourceRoot(this.searchParams).then(resp => {
                this.$refs.tablePage.changeLoading(false);
                this.$refs.tablePage.sourceTreeLoading = false;
                if (resp) {
                    const sourceTree = resp.data.list;
                    if (sourceTree) {
                        sourceTree.forEach(root => {
                            root.isActive = false;
                            root['textLeft'] = `${root[this.groupPolicy] ? root[this.groupPolicy] : ' '} ${root.totalVolume || ''}m³/${root.totalWeight || ''}KG/${root.taskCount || ''}单`;
                        });
                    }
                    this.sourceTree = sourceTree;
                }
            }).catch(() => {
                this.$refs.tablePage.changeLoading(false);
                this.$refs.tablePage.sourceTreeLoading = false;
            });
            await this.getTargetList();
            this.$refs.tablePage.initActiveChange();
        },
        async getTargetList() {
            const obj = { dispatchStatus: '0,10,20,30' };
            await getTargetRoot(obj).then(res => {
                if (res) {
                    // this.newDispOrder();
                    const targetTree = res.data.list || [];
                    if (targetTree) {
                        targetTree.forEach(root => {
                            if (+root.intelligentFlag !== 0) {
                                if (+root.intelligentStatus === 10) {
                                    root['html'] = `<span class="left-doted"> 智能排车中...`;
                                } else {
                                    root['html'] = `<span class="left-doted">${root.vehicleCard} ${root.volume}m³/${root.totalWeight}KG/${Math.round(root.loadRate * 100)}%`;
                                }
                            } else {
                                root['html'] = `${root.vehicleCard} ${root.volume}m³/${root.totalWeight}KG/${Math.round(root.loadRate * 100)}%`;
                            }
                        });
                    }
                    this.targetTree = this.dropdownList = this.tempTargetTree = targetTree;
                }
            });
        },
        getTableConfigList(data) {},
        rootClick(item, to) {
            if (to === 'source') {
                this.sourceSelectedRoot = item;
                this.initTransportList();
            }
            if (to === 'target') {
                this.tarSelRoot = item;
                if (+this.tarSelRoot.intelligentStatus === 10) {
                    this.transferDisable = this.confirmDisable = true;
                } else if (+this.tarSelRoot.intelligentStatus === 30) {
                    this.transferDisable = this.confirmDisable = false;
                }
                this.initDispatchList();
            }
        },
        sourceSelChange(selection) {
            this.checkedSourceList = selection;
        },
        targetSelChange(selection) {
            this.cheList = selection;
        },
        intelliArrange() {
            if (this.totalTargetData.length) {
                if (this.totalTargetData.some(el => el.isIntelliFailed)) {
                    // 智能排车失败标志
                    this.$message.warning('存在请求智能排车的失败数据，不能进行二次智能排车');
                    return;
                }
                this.$refs.tablePage.targetLoading = true;
                const params = {
                    biz: 'vrp',
                    transportList: this.totalTargetData
                };
                intelligentDispatch(params).then(res => {
                    this.$refs.tablePage.targetLoading = false;
                    if (res) {
                        this.$message.success('已提交');
                        this.leftList();
                    }
                }).catch(() => {
                    this.$refs.tablePage.targetLoading = false;
                });
            } else {
                this.$message.warning('请至少选择一条运输单');
            }
        },
        handleArrangeClose() {
            this.arrangeSubmVisi = false;
        },
        arrangeSubmOk (data) {
            if (data.state) {
                this.arrangeSubmVisi = true;
                this.$refs.carScheduling.saveLoading = true;
                if (+this.flag === 2) {
                    const obj = {
                        flag: +this.flag,
                        oldDispatchNo: this.tarSelRoot.dispatchNo,
                        dispatchStatus: this.tarSelRoot.dispatchStatus,
                        transportList: this.cheList,
                        ...data.data
                    };
                    obj.transportList.forEach(item => {
                        item.carrierVisibleFlag = item.carrierVisibleFlag || 'N';
                    });
                    getTransferData(obj).then(res => {
                        this.$refs.carScheduling.saveLoading = false;
                        if (res) {
                            let genDispatchNo = '';
                            if (res.data.indexOf(',') < 0) {
                                genDispatchNo = res.data;
                            } else {
                                genDispatchNo = res.data.split(',')[0];
                            }
                            this.$message({
                                dangerouslyUseHTMLString: true,
                                message: `<div>
                                    <span>转移成功，生成发车单号：${res.data}</span>
                                    <a id="copyTraNo" href='#' style='color: #11bec1; margin-left: 20px;'>复制</a>
                                </div>`,
                                type: 'success',
                                duration: 5000
                            });
                            this.arrangeSubmVisi = false;
                            document.getElementById('copyTraNo').addEventListener('click', () => {
                                this.copyText(document.body, genDispatchNo, false);
                            });
                            this.leftList();
                        } else {
                            this.flag = '';
                        }
                    }).catch(() => {
                        this.flag = '';
                        this.$refs.carScheduling.saveLoading = false;
                    });
                } else {
                    this.mainLoading = true;
                    data = Object.assign({}, data.data, this.tarSelRoot);
                    data.transportList = this.totalTargetData;
                    data.transportList.forEach(item => {
                        item.carrierVisibleFlag = item.carrierVisibleFlag || 'N';
                    });
                    saveCarArrange(data).then(res => {
                        this.mainLoading = false;
                        this.$refs.carScheduling.saveLoading = false;
                        if (res && +res.code === 0) {
                            let genDispatchNo = '';
                            if (res.data.indexOf(',') < 0) {
                                genDispatchNo = res.data;
                            } else {
                                genDispatchNo = res.data.split(',')[0];
                            }
                            this.$message({
                                dangerouslyUseHTMLString: true,
                                message: `<div>
                                    <span>已保存，生成发车单号：${res.data}</span>
                                    <a id="copyNo" href='#' style='color: #11bec1; margin-left: 20px;'>复制</a>
                                </div>`,
                                type: 'success',
                                duration: 5000
                            });
                            this.arrangeSubmVisi = false;
                            document.getElementById('copyNo').addEventListener('click', () => {
                                this.copyText(document.body, genDispatchNo, false);
                            });
                            this.leftList();
                        } else if (+res.code === 200) {
                            this.arrangeSubmVisi = false;
                            this.$message.error(res.msg || '');
                            this.leftList();
                        }
                    }).catch(() => {
                        this.mainLoading = false;
                        this.$refs.carScheduling.saveLoading = false;
                    });
                }
            }
        },
        searchInput(input, ev) {
            this.targetTree = this.tempTargetTree.filter(item => {
                return (item.vehicleCard && item.vehicleCard.indexOf(input.trim()) !== -1) || (item.dispatchNo && item.dispatchNo.indexOf(input.trim()) !== -1);
            });
        },
        async arrangeConfirmOk(dispatchNo) {
            this.totalData = [];
            this.totalTargetData = [];
            this.tarSelRoot = {};
            await this.searchChange(this.searchParams);
            this.$refs.tablePage.isCondition = true;
            this.$refs.tablePage.isShowImg = false;
            this.$refs.tablePage.input = dispatchNo;
            this.targetTree = this.tempTargetTree.filter(item => {
                return (item.dispatchNo && item.dispatchNo.indexOf(dispatchNo.trim()) !== -1);
            });
            if (this.targetTree.length === 0) {
                this.$refs.tablePage.input = null;
                this.targetTree = this.tempTargetTree;
            }
        },
        handleCancleAllocate() {
            this.centerDialogVisible = false;
            const obj = { taskNo: this.currentTaskNo };
            getCancleAllocate(obj).then(res => {
                if (res) {
                    this.$message.success('已取消分拨');
                    this.$refs.tablePage.$refs.searchList.onSearchChange();
                };
            });
        },
        allocateBtn(data) {
            this.tableVisible = true;
            this.rowData = Object.assign({}, data);
        },
        distributionOk() {
            this.tableVisible = false;
            this.$refs.tablePage.$refs.searchList.onSearchChange();
        },
        distributionCancel() {
            this.tableVisible = false;
        },
        cancleAllocateBtn(data) {
            this.centerDialogVisible = true;
            this.currentTaskNo = data.taskNo;
        },
        newDispOrder () {
            this.tarSelRoot = {};
            this.totalTargetData = [];
        },
        arraVisi (val) {
            // val有值 是移交dialog 里面选了 新建发车单 然后点击确定按钮
            // carrierVisibleFlag !== 'Y'是点了排车, 但未下发供应商
            if (val || this.totalTargetData[0].carrierVisibleFlag !== 'Y') {
                this.arrangeSubmVisi = true;
                this.flag = val;
                return false;
            }
            const flag = this.totalTargetData.find((item, index, arr) => item.carrierCode !== arr[0].carrierCode);
            if (flag) {
                this.$message.warning('同一承运商的运单才能排车');
                return false;
            }
            // 点击了排车，已下发供应商
            this.arrangeSubmVisi = true;
            const params = {
                carrierName: this.totalTargetData[0].carrierName,
                carrierCode: this.totalTargetData[0].carrierCode,
                transType: this.totalTargetData[0].procurementChannel,
                tranName: this.totalTargetData[0].procurementChannelName
            };
            this.$nextTick(() => {
                this.$refs.carScheduling.AdmittRuleForm.carrierName = this.totalTargetData[0].carrierName;
                this.$refs.carScheduling.getAdvanceValueLists(params);
            });
        },
        mousedownTabelHeight(e) {
            this.startMove = e.clientY;
            var distance = 0;
            document.onmousemove = (ev) => {
                var thisEvent = ev || event;
                distance = this.startMove - thisEvent.clientY;
                this.endMove = distance;
                this.$refs.tablePage.targetTableEndMove(this.endMove);
            };
            document.onmouseup = () => {
                document.onmousemove = null;
                document.onmouseup = null;
                this.endMoveHeight = this.endMoveHeight + distance;
            };
        },
        copyText(cellEl, copyText, classFlag) {
            if (cellEl.className.indexOf('el-tooltip') < 0 && classFlag) {
                return;
            }
            var input = document.createElement('input');
            input.type = 'text';
            input.value = copyText.trim();
            cellEl.appendChild(input);
            input.select();
            document.execCommand('copy');
            cellEl.removeChild(input);
            this.$message.success(`‘${input.value}’复制成功`);
        },
        sourceCellDblclick(row, column, cell, event) {
            this.copyText(cell.children[0], cell.children[0].innerHTML, true);
        },
        targetCellDblclick(row, column, cell, event) {
            this.copyText(cell.children[0], cell.children[0].innerHTML, true);
        },
        totalDataChange(targetData, sourceData, scrollFlag) {
            const totalDataClone = JSON.parse(JSON.stringify(this.totalData));
            this.totalTargetData = targetData;
            this.totalData = sourceData;
            clearTimeout(this.timerUpBtn);
            if (scrollFlag) {
                this.timerUpBtn = setTimeout(() => {
                    this.$nextTick(() => {
                        if ((document.querySelector('.source-table .el-table__body-wrapper tbody').offsetHeight <= document.querySelector('.source-table .el-table__body-wrapper').offsetHeight) &&
                        (totalDataClone.length < this.sourceTotalListPage.total) && this.sourceSelectedRoot.isActive) {
                            this.sourceTotalListPage.pageNo++;
                            if (this.conColNums(this.sourceTotalListPage.pageNo)) return this.sourceTotalListPage.pageNo--;
                            this.sourceSelectedRoot.isActive = false;
                            this.initTransportList(true);
                        }
                    });
                }, 80);
            }
        },
        conColNums(pageNo) {
            if (+pageNo > 1) this.columnNum = 15;
            const tableListArr = this.$refs.tablePage.tableList.split(',');
            if (tableListArr && tableListArr.length > this.columnNum) {
                this.$message.warning(`数据量过大，为防止页面卡顿，请修改配置列，最多选择${this.columnNum}列`);
                if ((document.querySelector('.source-table .el-table__body-wrapper tbody').offsetHeight <= document.querySelector('.source-table .el-table__body-wrapper').offsetHeight) &&
                pageNo > 1 && this.sourceSelectedRoot.isActive) {
                    var span = document.createElement('span');
                    span.innerText = '请修改配置列数量后，点击加载更多...';
                    span.id = 'clickMore';
                    if (this.totalData.length === 0) {
                        document.querySelector('.source-table .el-table__body-wrapper').prepend(span);
                    } else {
                        document.querySelector('.source-table .el-table__body-wrapper').appendChild(span);
                    }
                    document.getElementById('clickMore').addEventListener('click', () => {
                        document.querySelector('.source-table .el-table__body-wrapper').removeChild(span);
                        this.sourceTotalListPage.pageNo++;
                        if (this.conColNums(this.sourceTotalListPage.pageNo)) return this.sourceTotalListPage.pageNo--;
                        this.sourceSelectedRoot.isActive = false;
                        this.initTransportList(true);
                    });
                }
                return true;
            }
        },
        handleDelivery() { // 更改网点配送方式
            if (this.checkedSourceList.length < 1) return this.$message.warning('请选择待调度的运输单进行操作');
            let deliveryTypeCount = 0;
            let deliveryCount = 0;
            let netCount = 0;
            let distributionFlagCount = 0;
            let distributionLastFlagCount = 0;
            this.checkedSourceList.forEach(item => {
                if (item.deliveryType === 'DELIVERY') ++deliveryCount;
                if (item.deliveryType === 'NET') ++netCount;
                if (item.deliveryType !== 'DELIVERY' && item.deliveryType !== 'NET') ++deliveryTypeCount;
                if (item.distributionFlag !== 'Y') ++distributionFlagCount;
                if (item.distributionLastFlag === 'N') ++distributionLastFlagCount;
            });
            if (deliveryTypeCount > 0) return this.$message.warning('只有网点配送和配送的单才能修改配送方式');
            if (netCount !== 0 && netCount !== this.checkedSourceList.length) return this.$message.warning('存在不同配送方式的运输单');
            if (deliveryCount > 0 && deliveryCount !== this.checkedSourceList.length && distributionFlagCount > 0) {
                return this.$message.warning('是否分拨最后一段为Y，配送方式为配送的单才能修改');
            }
            if (distributionLastFlagCount > 0) return this.$message.warning('非最后一段不允许修改配送方式');
            this.deliveryDialogShow = true;
        },
        deliveryClose() {
            this.deliveryDialogShow = false;
        },
        deliveryOk() {
            this.deliveryDialogShow = false;
            // 不能直接this.initTransportList()刷新，因为修改配送方式成功有些待调度的单据code会变
            this.$refs.tablePage.$refs.searchList.onSearchChange();
        },
        refreshTargetList() {
            this.totalTargetData = [];
            this.getTargetList();
            this.$refs.tablePage.initActiveChange();
        },
        getProcurementChannel() {
            getDictionaryDetailByCode({ dictCodes: 'OTP_TMS_PROCUREMENT_CHANNEL' }).then(res => {
                if (res) {
                    sessionStorage.OTP_TMS_PROCUREMENT_CHANNEL = JSON.stringify(res.data.OTP_TMS_PROCUREMENT_CHANNEL);
                }
            }).catch(() => {
            });
        }
    },
    mounted() {
        if (!sessionStorage.OTP_TMS_PROCUREMENT_CHANNEL) {
            this.getProcurementChannel();
        }
        this.getDictList();
        this.rowDrop();
        this.$refs.tablePage.$refs.searchList.onSearchChange();
        this.sourceTableDom = this.$refs.tablePage.$refs.table.$refs.moduleTable.bodyWrapper;
        this.sourceTableDom.addEventListener('scroll', (event) => {
            const target = event.target;
            if (target.scrollTop && (Math.ceil(target.scrollTop) + target.clientHeight) >= target.scrollHeight) {
                if (this.totalData.length < this.sourceTotalListPage.total && this.sourceTotalListPage.total > this.sourceTotalListPage.pageSize * this.sourceTotalListPage.pageNo) {
                    this.sourceTotalListPage.pageNo++;
                    if (this.conColNums(this.sourceTotalListPage.pageNo)) return this.sourceTotalListPage.pageNo--;
                    this.sourceSelectedRoot.isActive = false;
                    this.initTransportList(true);
                }
            }
        });
    }
};
</script>
<style lang="less">
    @import './dispatchCen.less';
</style>