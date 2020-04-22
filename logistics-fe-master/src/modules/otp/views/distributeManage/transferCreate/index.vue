<template>
    <paper class="dispatch-center">
        <m-pane
            ref="tablePage"
            :config="config"
            :totalData="totalData"
            :totalTargetData="totalTargetData"
            :sourceRootData="sourceTree"
            :targetRootData="targetTree"
            :searchTotalTitle="searchTotalTitle"
            :sourceTitle="sourceTitle"
            :targetTitle="targetTitle"
            :endMoveHeight="endMoveHeight"
            searchId="transfer_create_search"
            pageID="transfer_create"
            @searchChange="searchChange"
            @root-click="rootClick"
            @source-select-change="selectChange('checkedSourceList', $event)"
            @target-select-change="selectChange('checkedTargetList', $event)"
            @search-input="searchInput"
            @sourceCellDblclick="cellDblclick"
            @targetCellDblclick="cellDblclick"
            >
            <div slot="target-table-header" class="target-table-header" @mousedown.stop.prevent="mousedownTabelHeight">
                <div class="flex">
                    <div>
                        <el-tooltip effect="dark" content="加入移交单" placement="top">
                            <el-button  @click="moveDown" class="up-down" type="text" icon="el-icon-bottom"></el-button>
                        </el-tooltip>
                        <el-tooltip effect="dark" content="移除移交单" placement="top">
                            <el-button @click="moveUp" class="up-down" type="text" icon="el-icon-top"></el-button>
                        </el-tooltip>
                        <span v-show='targetSelected' class="transferInfo">
                            移交单号： <span class="targetSel dispatchNo" @click="dispatchNoCopy" title="点击可复制" >{{targetSelectedRoot.transferNo}}</span>
                            客户： <span class="targetSel">{{targetSelectedRoot.customerName}}</span>
                            数量： {{totalTargetData.length}}
                        </span>
                    </div>
                    <div class="right">
                        <el-button v-show="targetSelected" @click="newDispOrder">新建移交单</el-button>
                        <el-button v-show="targetSelected" @click="comfirm" v-has='"04060002"'>确认</el-button>
                        <el-button v-show="!targetSelected && totalTargetData.length !== 0" @click="arrangeConfirm" v-has='"04060001"'>移交</el-button>
                    </div>
                </div>
            </div>
        </m-pane>
        <el-dialog
            title="提示"
            :closeOnClickModal='false'
            :visible.sync="transferDialog"
            width="30%"
            >
            <span>{{transferMsg}}</span>
            <span slot="footer">
                <el-button type="primary" @click="transferDialog = false">确 定</el-button>
            </span>
        </el-dialog>
    </paper>
</template>
<script>
import { Sortable } from 'sortablejs';
import mPane from '../../../components/mPanel';
import config from './config.js';
import paper from '@/components/core/paper/Paper';
import { mapState } from 'vuex';
import {
    receiptTransfersGroup,
    receiptTransfersToconfirm,
    receiptTransfers,
    receiptGeneratetransfer
} from '../../../api/transferCreate.js';
import formatTime from '@/utils/common.js';
export default {
    name: 'transferCreate',
    components: { mPane, paper },
    data() {
        return {
            sourceTreeLoading: {},
            targetTreeLoading: {},
            transferMsg: '',
            transferDialog: false,
            targetSelected: false,
            searchObj: {},
            checkedSourceList: [], // 上表格选中数据
            checkedTargetList: [], // 下表格选中数据
            checkedWarehouse: {},
            currentTaskNo: '',
            currentRow: null,
            tempTargetTree: [],
            config: config,
            groupPolicy: '',
            groupPolicyCode: '',
            groupPolicyVal: '',
            sourceTitle: '待移交', // 上表格tab栏标题
            sourceTree: [], // 上表格左侧tab 数据
            targetTree: [], // 下表格左侧tab 数据
            dropdownList: [],
            sourceSelectedRoot: {},
            targetSelectedRoot: {},
            targetCanSort: true,
            purchaseChannelOps: [],
            payMethodOps: [],
            licenseOps: [],
            carrierOps: [],
            totalData: [], // 上表格数据
            totalTargetData: [], // 下表格数据
            searchParams: {},
            searchTotalTitle: config.searchTotalTitle, // 高级搜索配置项
            showConfirmBtn: false,
            showTransBtn: false,
            showScheduleBtn: true,
            arrangeForm: { procurementChannel: '' },
            startMove: 0,
            endMove: '',
            endMoveHeight: 0,
            timerUpDrag: '',
            timerDownDrag: ''
        };
    },
    computed: {
        ...mapState({ user: state => state.user }),
        // 下表格tab栏标题
        targetTitle: function() {
            return `待确认(${this.targetTree.length})`;
        }
    },
    methods: {
        dispatchNoCopy(e) {
            var input = document.createElement('input');
            input.type = 'text';
            input.value = (e.target.innerHTML).trim();
            e.target.appendChild(input);
            input.select();
            document.execCommand('copy');
            e.target.removeChild(input);
            this.$message.success(`移交单号‘${input.value}’复制成功`);
        },
        setSourceTreeLoading(status = true) {
            if (status) {
                this.sourceTreeLoading = this.$loading({
                    target: document.querySelectorAll('.flex-table')[0].querySelector('.table-lists'),
                    background: 'rgba(255, 255, 255, .7)'
                });
            } else {
                this.sourceTreeLoading.close();
            }
        },
        setTargetTreeLoading(status = true) {
            if (status) {
                this.targetTreeLoading = this.$loading({
                    target: document.querySelectorAll('.flex-table')[1].querySelector('.table-lists'),
                    background: 'rgba(255, 255, 255, .7)'
                });
            } else {
                this.targetTreeLoading.close();
            }
        },
        moveDown() {
            if (this.checkedSourceList.length === 0) {
                this.$message.warning('请勾选移交单');
                return false;
            }
            if (this.targetSelectedRoot.customerCode !== undefined && this.targetSelectedRoot.customerCode !== this.checkedSourceList[0].customerCode) {
                this.$message.warning('只允许加入同一客户的移交单');
                return false;
            }

            this.totalTargetData = [...this.checkedSourceList, ...this.totalTargetData];

            this.totalData = this.totalData.filter(item => !this.checkedSourceList.map(item => item.taskNo).includes(item.taskNo));
            this.checkedSourceList = [];
        },
        moveUp() {
            if (this.checkedTargetList.length === 0) {
                this.$message.warning('请勾选移交单');
                return false;
            }

            if (this.sourceSelectedRoot.customerCode !== undefined) {
                if (this.sourceSelectedRoot.customerCode === this.checkedTargetList[0].customerCode) {
                    this.totalData = [...this.checkedTargetList, ...this.totalData];
                }
            } else {
                this.totalData = [...this.checkedTargetList];
            }

            this.totalTargetData = this.totalTargetData.filter(item => !this.checkedTargetList.map(item => item.taskNo).includes(item.taskNo));
            this.checkedTargetList = [];
        },
        getData({ customerOrderNo, taskNo, contractNo, customerCode, beginDate, endDate, receiverDistrictCode, receiverDistrictName, receiverCityCode, receiverCityName }) {
            const createTime = this.$refs.tablePage.$refs.searchList.searchData.createTime;
            const params = {
                customerOrderNo,
                taskNo,
                contractNo,
                customerCode,
                beginDate: createTime ? formatTime.formatDateTime(createTime[0]) : '',
                endDate: createTime ? formatTime.formatDateTime(createTime[1]) : '',
                transferStatus: '0',
                receiverDistrictCode,
                receiverDistrictName,
                receiverCityCode,
                receiverCityName
            };
            this.searchObj = params;
            this.setSourceTreeLoading();
            receiptTransfersGroup(params).then(res => {
                if (res) {
                    // const taskNoArr = this.totalTargetData.map(item => item.taskNo);
                    // this.sourceTree = res.data.list.filter(item => {
                    //     item.textLeft = item.customerName;
                    //     return item.taskNos.filter(item => !taskNoArr.includes(item)).length > 0;
                    // });
                    this.sourceTree = res.data.list.map(item => {
                        item.textLeft = item.customerName;
                        return item;
                    });
                }
                this.setSourceTreeLoading(false);
            }).catch(() => {
                this.setSourceTreeLoading(false);
            });

            this.setTargetTreeLoading();
            receiptTransfersToconfirm({ transferStatus: '0' }).then(res => {
                if (res) {
                    res.data.forEach(item => {
                        item.html = `${item.transferNo} ${item.customerName}`;
                    });
                    this.targetTree = res.data;
                    this.tempTargetTree = res.data;
                }
                this.setTargetTreeLoading(false);
            }).catch(() => {
                this.setTargetTreeLoading(false);
            });
            this.$refs.tablePage.initActiveChange();
        },
        setSourceData() {
            const params = {
                ...this.searchObj,
                customerCode: this.sourceSelectedRoot.customerCode,
                transferStatus: '0'
            };
            this.$refs.tablePage.sourceLoading = true;
            receiptTransfers(params).then(res => {
                if (res) {
                    const taskNoArr = this.totalTargetData.map(item => item.taskNo);
                    this.totalData = res.data.list.filter(item => {
                        item.signIsFullText = item.signIsFull === 'Y' ? '是' : '否';
                        return !taskNoArr.includes(item.taskNo);
                    });
                }
                this.$refs.tablePage.sourceLoading = false;
            }).catch(() => {
                this.$refs.tablePage.sourceLoading = false;
            });
        },
        setTargetData() {
            this.$refs.tablePage.targetLoading = true;
            receiptTransfers({ transferNo: this.targetSelectedRoot.transferNo, transferStatus: '0' }).then(res => {
                if (res) {
                    res.data.list.forEach(item => {
                        item.signIsFullText = item.signIsFull === 'Y' ? '是' : '否';
                    });
                    this.totalTargetData = res.data.list;
                    this.targetSelected = true;
                }
                this.$refs.tablePage.targetLoading = false;
            }).catch(() => {
                this.$refs.tablePage.targetLoading = false;
            });
        },
        // 左边tab点击事件
        rootClick(item, to) {
            if (to === 'source') {
                this.sourceSelectedRoot = item;
                this.setSourceData();
            } else if (to === 'target') {
                this.targetSelectedRoot = item;
                this.setTargetData();
            }
        },
        // 绑定拖拽
        rowDrop() {
            const sourceTbody = document.querySelector('.source-table .el-table__body-wrapper tbody');
            const targetTable = document.querySelector('.target-table');
            const targetTableHeader = document.querySelector('.target-table-header');
            Sortable.create(sourceTbody, {
                group: {
                    name: 'sourceTbody'
                },
                sort: false, // 禁止表内排序
                onEnd: ({ newIndex, oldIndex, from, to, item }) => { // 在下表格松开鼠标触发
                    if (from !== to) {
                        const clone = this.totalData;
                        const cloneChecked = this.checkedSourceList;

                        this.totalData = [];
                        clearTimeout(this.timerDownDrag);
                        this.timerDownDrag = setTimeout(() => {
                            this.$nextTick(() => {
                                if (this.targetSelectedRoot.customerCode !== undefined && this.targetSelectedRoot.customerCode !== clone[oldIndex].customerCode) {
                                    this.totalData = clone;
                                    this.$message.warning('只允许加入同一客户的移交单');
                                    return false;
                                }

                                const isChecked = cloneChecked.map(item => item.taskNo).includes(clone[oldIndex].taskNo);
                                if (isChecked) {
                                    this.totalTargetData = [
                                        ...cloneChecked,
                                        ...this.totalTargetData
                                    ];
                                    this.totalData = clone.filter(item => !cloneChecked.map(item => item.taskNo).includes(item.taskNo));
                                } else {
                                    this.totalTargetData = [
                                        clone[oldIndex],
                                        ...this.totalTargetData
                                    ];
                                    this.totalData = clone.filter(item => item.taskNo !== clone[oldIndex].taskNo);
                                }
                            });
                        }, 80);
                    }
                }
            });
            Sortable.create(targetTable, {
                group: {
                    name: 'targetTable',
                    put: 'sourceTbody' // 可放置来自sourceTbody组的拖拽
                }
            });
            Sortable.create(targetTableHeader, {
                group: {
                    name: 'targetTableHeader',
                    put: 'sourceTbody' // 可放置来自sourceTbody组的拖拽
                }
            });
            const targetTbody = document.querySelector('.target-table .el-table__body-wrapper tbody');
            const sourceTable = document.querySelector('.source-table');
            Sortable.create(targetTbody, {
                group: {
                    name: 'targetTbody'
                },
                sort: false,
                onEnd: ({ newIndex, oldIndex, from, to, item }) => { // 在上表格松开鼠标触发
                    if (from !== to) {
                        const clone = this.totalTargetData;
                        const cloneChecked = this.checkedTargetList;

                        this.totalTargetData = [];
                        clearTimeout(this.timerUpDrag);
                        this.timerUpDrag = setTimeout(() => {
                            this.$nextTick(() => {
                                if (this.sourceSelectedRoot.customerCode !== undefined && this.sourceSelectedRoot.customerCode !== clone[oldIndex].customerCode) {
                                    this.totalTargetData = clone.filter(item => item.taskNo !== clone[oldIndex].taskNo);
                                    return false;
                                }

                                const isChecked = cloneChecked.map(item => item.taskNo).includes(clone[oldIndex].taskNo);
                                if (isChecked) {
                                    this.totalData = [
                                        ...cloneChecked,
                                        ...this.totalData
                                    ];
                                    this.totalTargetData = clone.filter(item => !cloneChecked.map(item => item.taskNo).includes(item.taskNo));
                                } else {
                                    this.totalData = [
                                        clone[oldIndex],
                                        ...this.totalData
                                    ];
                                    this.totalTargetData = clone.filter(item => item.taskNo !== clone[oldIndex].taskNo);
                                }
                            });
                        }, 80);
                    }
                }
            });
            Sortable.create(sourceTable, {
                group: {
                    name: 'sourceTable',
                    put: 'targetTbody' // 可放置来自targetTbody组的拖拽
                }
            });
        },
        // 点击搜索按钮
        searchChange(data) {
            if (data.createTime && data.createTime.length > 0) {
                data.beginDate = formatTime.formatDateTime(data.createTime[0]);
                data.endDate = formatTime.formatDateTime(data.createTime[1]);
            } else if (!data.createTime) {
                data.beginDate = '';
                data.endDate = '';
            }
            delete data.createTime;
            this.searchObj = { ...this.searchObj, ...data };
            this.getData(this.searchObj);
        },
        // 表格选中项变化
        selectChange(property, selection) {
            this[property] = selection;
        },
        // 确认
        comfirm() {
            const params = {
                transType: '2',
                customerCode: this.totalTargetData.length > 0 ? this.totalTargetData[0].customerCode : '',
                customerName: this.totalTargetData.length > 0 ? this.totalTargetData[0].customerName : '',
                transferPersonCode: this.user.userCode,
                transferPersonName: this.user.userName,
                transferNo: this.targetSelectedRoot.transferNo,
                transferCreatResponseList: this.totalTargetData
            };
            this.$refs.tablePage.targetLoading = true;
            receiptGeneratetransfer(params).then(res => {
                if (res) {
                    this.transferMsg = res.msg;
                    this.transferDialog = true;
                    this.newDispOrder();
                    this.getData(this.searchObj);
                }
                this.$refs.tablePage.targetLoading = false;
            }).catch(() => {
                this.$refs.tablePage.targetLoading = false;
            });
        },
        // 移交
        arrangeConfirm () {
            const params = {
                transType: '2',
                customerCode: this.totalTargetData[0].customerCode,
                customerName: this.totalTargetData[0].customerName,
                transferPersonCode: this.user.userCode,
                transferPersonName: this.user.userName,
                transferNo: '',
                transferCreatResponseList: this.totalTargetData
            };
            this.$refs.tablePage.targetLoading = true;
            receiptGeneratetransfer(params).then(res => {
                if (res) {
                    this.transferMsg = res.msg;
                    this.transferDialog = true;
                    this.newDispOrder();
                    this.getData(this.searchObj);
                }
                this.$refs.tablePage.targetLoading = false;
            }).catch(() => {
                this.$refs.tablePage.targetLoading = false;
            });
        },
        // 移交单搜索
        searchInput(input, ev) {
            this.targetTree = this.tempTargetTree.filter(item => item.transferNo.indexOf(input.trim()) !== -1);
        },
        // 新建移交单
        newDispOrder () {
            this.targetSelected = false;
            this.targetSelectedRoot = {};
            this.totalTargetData = [];
            this.targetTreeRemoveActive();
        },
        // 下表格顶部鼠标按下
        mousedownTabelHeight(e) {
            this.startMove = e.clientY;
            var distance;
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
        // 复制字段文本
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
        // 列字段双击
        cellDblclick(row, column, cell, event) {
            this.copyText(cell.children[0], cell.children[0].innerHTML, true);
        },
        // 清除下表格左侧tab栏
        targetTreeRemoveActive() {
            const lis = document.querySelector('.table-header .table-lists').children;
            for (let i = 0; i < lis.length; i++) {
                lis[i].classList.remove('active');
            }
        }
    },
    mounted() {
        // this.getData();
        // 绑定拖拽
        this.rowDrop();
    }
};
</script>
<style lang="less">
@primary-color: #00bcbf;
.dispatch-center {
    height: 100%;
    padding-bottom: 0;
    margin-bottom: 0;

    .left-doted:before {
        content: "";
        display: inline-block;
        margin-right: 5px;
        width: 5px;
        height: 5px;
        vertical-align: middle;
        background-color: @primary-color;
        border-radius: 50%;
    }
    .list-details {
        white-space: nowrap;
    }
    .target-table-header {
        font-size: 13px;
        color: #999;

        &:hover{
            cursor: n-resize;
        }
        .up-down {
            font-size: 18px;
        }
        .transferInfo {
            margin-left: 10px;
        }
    }
    .targetSel {
        color: @primary-color;
        margin-right: 30px;
    }
    .dispatchNo {
        cursor: pointer;
    }
    .target-table,
    .source-table,
    .target-table-header {
        & > tr {
            display: none;
        }
    }
}
</style>