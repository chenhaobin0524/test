<template>
    <div class="flex transfer">
        <div class="left">
            <el-tooltip class="item" effect="dark" content="加入发车单" placement="top">
                <el-button  @click="moveDown" class="up-down" type="text" icon="el-icon-bottom"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="移除发车单" placement="top">
                <el-button @click="moveUp" class="up-down" type="text" icon="el-icon-top"></el-button>
            </el-tooltip>
            <span v-show="totalTargetData.length > 0" class="left-info">
                <span class="target-sel">{{tarSelRoot.vehicleCard || ''}}</span>
                <span class="target-sel dispatch-no" title="点击可复制" @click="dispatchNoCopy($event)">{{tarSelRoot.dispatchNo || ''}}</span>
                <span class="">单量：<span class="content">{{taskTotalQty}}</span></span>
                <span>方量(m³)：<span class="content">{{taskTotalVolume}}</span></span>
                <span>重量(KG)：<span class="content">{{taskTotalWeight}}</span></span>
                <i class="el-icon-view" @click="handleDetailStatistics"></i>
            </span>
        </div>
        <div class="right">
            <div class="btn-content">
                <el-button class="btn-content_button" v-show="showConfirmBtn" @click="newDispOrder">新建发车单</el-button>
            </div>
            <div class="btn-content" v-has="'04010003'">
                <el-button class="btn-content_button" :disabled="transDisable" v-show="showTransBtn" @click="handleTransfer">转移</el-button>
            </div>
            <div class="btn-content" v-has="'04010004'">
                <el-button class="btn-content_button" :disabled="confDisable" v-show="showConfirmBtn" @click="arrangeConfirm" :loading="confirmLoading">确认</el-button>
            </div>
            <div class="btn-content" v-has="'04010001'">
                <el-button class="btn-content_button" v-show="showScheduleBtn" @click="intelliArrange">智能排车</el-button>
            </div>
            <div class="btn-content" v-has="'04010002'">
                <el-button class="btn-content_button" v-show="showScheduleBtn" @click="submitArrange">排车</el-button>
            </div>
        </div>
        <el-dialog title="查看明细" :visible.sync="detailVisible" append-to-body width="65%">
            <el-table border :data="detailStatistics">
                <el-table-column property="customerItemCode" label="客户商品编码" width="130" sortable show-overflow-tooltip></el-table-column>
                <el-table-column property="itemName" label="商品名称" width="300" sortable show-overflow-tooltip></el-table-column>
                <el-table-column property="itemClass" label="商品分类" sortable show-overflow-tooltip></el-table-column>
                <el-table-column property="planQty" label="数量" sortable></el-table-column>
                <el-table-column property="volume" label="方量(m³)" sortable></el-table-column>
            </el-table>
        </el-dialog>
        <el-dialog title="转移" :visible.sync="transferVisi" width="40%" @close="transClose" append-to-body>
            <el-radio v-model="identify" label="1" @change="transferLabelChange">已有发车单
                <el-select v-model="value" filterable @change="handleSelChange">
                    <el-option v-for="(item, index) in transTree" :key="'dispatchNo'+index" :label="item.dispatchNo" :value="item.dispatchNo"></el-option>
                </el-select>
            </el-radio>
            <el-radio v-model="identify" label="2" @change="transferLabelChange">新建发车单</el-radio>
            <div slot="footer" class="dialog-footer">
                <el-button @click="handleCancel">取 消</el-button>
                <el-button type="primary" :disabled="isDisable" @click="handleSubmit">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { getDetailStatistics, updateCarArrange, updateIntelliArrange, getTransferData } from '../../../api/dispatchCenter';
export default {
    props: {
        flag: {
            type: String,
            default() {
                return '';
            }
        },
        tarSelRoot: {
            type: Object,
            default() {
                return {};
            }
        },
        totalTargetData: {
            type: Array,
            default() {
                return [];
            }
        },
        cheList: {
            type: Array,
            default() {
                return [];
            }
        },
        dropdownList: {
            type: Array,
            default() {
                return [];
            }
        },
        transDisable: {
            type: Boolean,
            default() {
                return false;
            }
        },
        confDisable: {
            type: Boolean,
            default() {
                return false;
            }
        },
        groupPolicyCode: {
            type: String,
            default() {
                return undefined;
            }
        },
        groupPolicyVal: {
            type: String,
            default() {
                return undefined;
            }
        },
        groupPolicyValArr: {
            type: Array,
            default() {
                return [];
            }
        },
        sourceTree: {
            type: Array,
            default() {
                return [];
            }
        },
        totalData: {
            type: Array,
            default() {
                return [];
            }
        },
        currWarehouseGroup: {
            type: String,
            default() {
                return undefined;
            }
        },
        currInOutType: {
            type: String,
            default() {
                return undefined;
            }
        },
        checkedSourceList: {
            type: Array,
            default() {
                return [];
            }
        }
    },
    data() {
        return {
            identify: this.flag,
            btnEnum: {
                confirm: ['0'],
                transConfirm: ['10', '20', '30'],
                schedule: [undefined]
            },
            confirmLoading: false,
            detailVisible: false,
            detailStatistics: [],
            showConfirmBtn: false,
            showTransBtn: false,
            showScheduleBtn: true,
            isDisable: false,
            value: '',
            transTree: [],
            transferVisi: false,
            groupPolicyValArrNew: this.groupPolicyValArr
        };
    },
    computed: {
        taskTotalQty: function() {
            return this.totalTargetData.length;
        },
        taskTotalVolume: function() {
            return this.totalTargetData.reduce((partical, value) => {
                const taskTotalVolume = partical + (value.totalVolume || 0);
                return Math.round(taskTotalVolume * 1000000) / 1000000;
            }, 0);
        },
        taskTotalWeight: function() {
            return this.totalTargetData.reduce((partical, value) => {
                const taskTotalWeight = partical + (value.totalGrossWeight || 0);
                return Math.round(taskTotalWeight * 1000) / 1000;
            }, 0);
        }
    },
    watch: {
        'tarSelRoot.dispatchStatus': function (newStatus) {
            if (this.btnEnum.confirm.includes(newStatus + '')) {
                this.showConfirmBtn = true;
                this.showScheduleBtn = this.showTransBtn = false;
                return;
            }
            if (this.btnEnum.transConfirm.includes(newStatus + '')) {
                this.showConfirmBtn = this.showTransBtn = true;
                this.showScheduleBtn = false;
                return;
            }
            if (this.btnEnum.schedule.includes(newStatus)) {
                this.showConfirmBtn = this.showTransBtn = false;
                this.showScheduleBtn = true;
                return;
            }
            this.showScheduleBtn = this.showConfirmBtn = this.showTransBtn = false;
        }
    },
    methods: {
        handleDetailStatistics() {
            this.detailVisible = true;
            const taskNoList = this.totalTargetData.map(item => item.taskNo);
            getDetailStatistics(taskNoList).then(res => {
                if (res) {
                    this.detailStatistics = res.data.list || [];
                }
            });
        },
        newDispOrder() {
            this.$emit('newDispOrder');
        },
        handleTransfer () {
            if (+this.tarSelRoot.gainingContract === 1) {
                this.$message.warning('正在获取合同号中，不能转移');
                return false;
            } else if (this.cheList.length === 0) {
                this.$message.warning('至少选择一条运输单!');
                return false;
            } else {
                // const flag = this.cheList.find(item => item.carrierVisibleFlag === 'Y');
                // if (flag) {
                //     this.$message.warning(`运输单：${flag.taskNo}，已下发不能转移`);
                //     return false;
                // }
                const cheList = this.cheList;
                for (var i = 0; i < cheList.length; i++) {
                    if (+cheList[i].taskStatus === 30 && (cheList[i].inOutType === 'YS' || cheList[i].inOutType === 'OUT') &&
                        cheList[i].sourceSystem === 'CIMS' && +cheList[i].distributionNum === 1 && cheList[i].orderSource === 'API') {
                        return this.$message.warning(`存在不能转移的运输单：${cheList[i].taskNo}`);
                    }
                    if (cheList[i].finalDetailAddr === cheList[0].finalDetailAddr &&
                        cheList[i].deliveryType !== cheList[0].deliveryType) {
                        return this.$message.warning('终端详细地址一样，配送方式不一样的不能转移');
                    }
                    if (+this.tarSelRoot.cnDispatch > 0 && +cheList[i].cnDispatch > 0) {
                        return this.$message.warning('预配载的发车单不允许转移预配载订单');
                    }
                };
                this.transferVisi = true;
                this.dropdownList.forEach(item => {
                    if (item.intelligentStatus !== 10) {
                        if (item.dispatchNo !== this.tarSelRoot.dispatchNo) {
                            this.transTree.push(item);
                        }
                    }
                });
            }
        },
        arrangeConfirm () {
            if (+this.tarSelRoot.gainingContract) {
                this.$message.warning('获取合同号中，不可以确认');
                return;
            }
            for (var i = 0; i < this.totalTargetData.length; i++) {
                if (+this.tarSelRoot.cnDispatch > 0 && !this.totalTargetData[i].dispatchNo && +this.totalTargetData[i].cnDispatch > 0) {
                    return this.$message.warning('预配载的发车单不允许确认预配载订单');
                }
            };
            this.confirmLoading = true;
            if (+this.tarSelRoot.intelligentFlag === 0) {
                const data = {
                    dispatchNo: this.tarSelRoot.dispatchNo,
                    dispatchStatus: this.tarSelRoot.dispatchStatus,
                    transportList: this.totalTargetData,
                    vehicleCard: this.tarSelRoot.vehicleCard
                };
                updateCarArrange(data).then(res => {
                    this.confirmLoading = false;
                    if (res) this.$message.success('确认成功');
                    this.$emit('arrangeConfirmOk', this.tarSelRoot.dispatchNo);
                }).catch(() => {
                    this.confirmLoading = false;
                });
            } else {
                const data = {
                    biz: 'tsp',
                    dispatchNo: this.tarSelRoot.dispatchNo,
                    dispatchStatus: this.tarSelRoot.dispatchStatus,
                    transportList: this.totalTargetData,
                    vehicleCard: this.tarSelRoot.vehicleCard,
                    intelligentFlag: this.tarSelRoot.intelligentFlag
                };
                updateIntelliArrange(data).then(res => {
                    this.confirmLoading = false;
                    if (res) this.$message.success('确认成功');
                    this.$emit('arrangeConfirmOk', this.tarSelRoot.dispatchNo);
                }).catch(() => {
                    this.confirmLoading = false;
                });
            }
        },
        intelliArrange() {
            this.$emit('intelArr');
        },
        submitArrange() {
            if (!this.totalTargetData.length) {
                this.$message.warning('请至少选择一条运输单');
                return;
            }
            if (this.tarSelRoot.status === undefined) {
                this.$emit('arraVisi');
            }
        },
        dispatchNoCopy(e) {
            var input = document.createElement('input');
            input.type = 'text';
            input.value = (e.target.innerHTML).trim();
            e.target.appendChild(input);
            input.select();
            document.execCommand('copy');
            e.target.removeChild(input);
            this.$message.success(`发车单号‘${input.value}’复制成功`);
        },
        handleCancel() {
            this.transferVisi = false;
            this.identify = '';
            this.value = '';
        },
        handleSubmit () {
            if (+this.identify === 2) {
                this.$emit('arraVisi', this.identify);
                this.transferVisi = false;
            } else if (+this.identify === 1) {
                this.isDisable = true;
                const obj = {
                    flag: +this.identify,
                    oldDispatchNo: this.tarSelRoot.dispatchNo,
                    newDispatchNo: this.value,
                    dispatchStatus: this.tarSelRoot.dispatchStatus,
                    transportList: this.cheList,
                    gainingContract: this.tarSelRoot.gainingContract
                };
                getTransferData(obj).then(res => {
                    this.isDisable = false;
                    if (res) {
                        this.handleCancel();
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
                                <a id="copyTraCNo" href='#' style='color: #11bec1; margin-left: 20px;'>复制</a>
                            </div>`,
                            type: 'success',
                            duration: 5000
                        });
                        document.getElementById('copyTraCNo').addEventListener('click', () => {
                            this.copyText(document.body, genDispatchNo, false);
                        });
                        this.$emit('leftList');
                    };
                });
            }
        },
        transClose () {
            this.transTree = [];
            this.value = '';
            this.identify = '';
        },
        handleSelChange() {
            this.identify = '1';
        },
        moveUp() {
            if (this.cheList.length === 0) return this.$message.warning('请至少勾选一条数据');
            if (+this.tarSelRoot.gainingContract) {
                this.$message.warning('获取合同号中，不可以加单');
            } else {
                for (let i = 0; i < this.cheList.length; i++) {
                    if (+this.cheList[i].taskStatus === 30 && this.cheList[i].dispatchNo && (this.cheList[i].inOutType === 'OUT' || this.cheList[i].inOutType === 'YS')) {
                        return this.$message.warning(`存在不能减单的运输单：${this.cheList[i].taskNo}`);
                    }
                }
                const targetDataTaskNo = this.cheList.map(el => el.taskNo);
                const targetClone = this.totalTargetData.filter(el => !targetDataTaskNo.includes(el.taskNo));
                const currentGroupPolicyData = []; // 在当前分组下要拖的数据
                this.groupPolicyValArrNew = [];
                this.sourceTree.forEach(item => {
                    if (item.isActive) this.groupPolicyValArrNew.push(item[this.groupPolicyCode]);
                });
                this.cheList.forEach(item => {
                    if (this.groupPolicyValArrNew.includes(item[this.groupPolicyCode])) currentGroupPolicyData.push(item);
                });
                const curGrototalDataClone = [].concat(this.totalData);
                const targetTabelTask = curGrototalDataClone.map(el => el.taskNo);
                let sourceData = this.totalData;
                currentGroupPolicyData.forEach(item => {
                    if (this.groupPolicyValArrNew.length === 0) {
                        sourceData = [];
                    } else if (this.groupPolicyValArrNew.includes(item[this.groupPolicyCode]) && !targetTabelTask.includes(item.taskNo)) {
                        this.totalData.unshift(item);
                    }
                });
                this.$emit('totalDataChange', targetClone, sourceData);
            }
        },
        moveDown() {
            if (this.checkedSourceList.length === 0) return this.$message.warning('请至少勾选一条数据');
            let rows2Transfer = this.checkedSourceList.filter(el => (this.currWarehouseGroup === undefined || el.warehouseGroup === this.currWarehouseGroup) &&
            (el.inOutType === this.currInOutType || this.currInOutType === undefined));
            if (rows2Transfer.length > 0) {
                const sameWhGroup = this.totalTargetData.length <= 0 || (this.totalTargetData.length > 0 && rows2Transfer[0].warehouseGroup === this.currWarehouseGroup);
                const sameInOutType = this.totalTargetData.length <= 0 || (this.totalTargetData.length > 0 && rows2Transfer[0].inOutType === this.currInOutType);
                if (this.totalTargetData.length <= 0 || (sameWhGroup && sameInOutType)) {
                    const totalTargetDataTaskNo = this.totalTargetData.map(el => el.taskNo);
                    rows2Transfer = rows2Transfer.filter(el => !totalTargetDataTaskNo.includes(el.taskNo));
                    if (this.totalTargetData.length > 0) {
                        for (let i = 0; i < rows2Transfer.length; i++) {
                            if (rows2Transfer[i].finalDetailAddr === this.totalTargetData[0].finalDetailAddr &&
                            rows2Transfer[i].deliveryType !== this.totalTargetData[0].deliveryType) {
                                this.$message.warning('终端详细地址一样，配送方式不一样的不能加单');
                                return;
                            }
                        }
                    }
                    if (rows2Transfer.length > 1 && (this.currWarehouseGroup === undefined) && (this.currInOutType === undefined)) {
                        for (let i = 1; i < rows2Transfer.length; i++) {
                            if ((rows2Transfer[i].warehouseGroup !== rows2Transfer[0].warehouseGroup) || (rows2Transfer[i].inOutType !== rows2Transfer[0].inOutType)) {
                                this.$message.warning('存在不同仓库分组或不同单据类型的运输单');
                                return;
                            }
                            if (rows2Transfer[i].finalDetailAddr === rows2Transfer[0].finalDetailAddr && rows2Transfer[i].deliveryType !== rows2Transfer[0].deliveryType) {
                                this.$message.warning('终端详细地址一样，配送方式不一样的不能加单');
                                return;
                            }
                        }
                    }
                    const totalTargetDataNew = [
                        ...rows2Transfer,
                        ...this.totalTargetData
                    ];
                    const transTaskNo = rows2Transfer.map(el => el.taskNo);
                    const totalDataNew = this.totalData.filter(el => !transTaskNo.includes(el.taskNo));
                    this.$emit('totalDataChange', totalTargetDataNew, totalDataNew, true);
                } else if (!sameWhGroup) {
                    return this.$message.warning('只允许加入同一仓库分组的运输单');
                } else if (!sameInOutType) {
                    return this.$message.warning('只允许加入同种单据类型的运输单');
                }
            } else {
                return this.$message.warning('只允许加入同一仓库分组、同种单据类型的运输单');
            }
        },
        transferLabelChange(label) {
            if (label === '2') this.value = '';
        },
        copyText(cellEl, copyText, classFlag) {
            if (cellEl.className && classFlag) {
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
        }
    }
};
</script>
<style lang="less">
.transfer {
    .dialog-footer {
        text-align: right;
        margin-top: 15px;
    }
    .up-down {
        font-size: 18px;
        margin-left: 0px;
        margin-right: 10px;
    }
    .right {
        .btn-content {
            display: inline-block;
        }
        .btn-content_button {
            margin-left: 10px;
        }
    }
}
</style>
