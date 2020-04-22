<template>
    <el-dialog
        class="form transferConfirmDialog"
        :title="titleName"
        :visible="true"
        :close-on-click-modal="closeOnClickModal"
        :before-close="beforeClose"
        width="75%">
        <div>
            <el-form label-width='90px'>
                <el-row>
                    <el-col :span='8'>
                        <el-form-item label="移交单号：">
                            {{rowData.transferNo}}
                        </el-form-item>
                    </el-col>
                    <el-col :span='8'>
                        <el-form-item label="移交创建人：">
                            {{rowData.transferPersonName}}
                        </el-form-item>
                    </el-col>
                    <el-col :span='8'>
                        <el-form-item label="移交时间：">
                            {{rowData.transferDate}}
                        </el-form-item>
                    </el-col>
                    <el-col :span='8'>
                        <el-form-item label="接收对象：">
                            {{rowData.customerName}}
                        </el-form-item>
                    </el-col>
                    <el-col :span='8'>
                        <el-form-item label="移交类型：">
                            {{rowData.transTypeText}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='8' v-if='titleName === "详情"'>
                        <el-form-item label="接收时间：">
                            {{obj.receiptDate}}
                        </el-form-item>
                    </el-col>
                    <el-col :span='8' v-if='titleName === "详情"'>
                        <el-form-item label="接收人：">
                            {{obj.receiptPersonName}}
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <el-table :data="tableData" border style="width: 100%" tooltip-effect="dark">
            <el-table-column
                sortable
                align="center"
                v-for="(column, idx) in columnsData"
                :key="idx"
                :min-width="column.minWidth || ''"
                :label="column.label"
                :prop="column.prop"
                :show-overflow-tooltip="true">
            </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
            <el-button @click="beforeClose">取 消</el-button>
            <el-button type="primary" @click="comfirm" v-if='titleName === "接收"'>确 认</el-button>
        </div>
    </el-dialog>
</template>

<script>
import { transfersToconfirmList, receiptTransfertoconfirm } from '../../../api/transferConfirm.js';
import { mapState } from 'vuex';
export default {
    props: {
        titleName: {
            type: String,
            default() {
                return '';
            }
        },
        cellShaow: {
            type: Boolean,
            default() {
                return false;
            }
        },
        rowData: {
            type: Object,
            default() {
                return {};
            }
        },
        searchObj: {
            type: Object,
            default() {
                return {};
            }
        }
    },
    data() {
        return {
            closeOnClickModal: false,
            dialogLoading: {}, // 弹框loading实例
            obj: {
                receiptPersonCode: '',
                receiptPersonName: '',
                receiptDate: ''
            },
            columnsData: [
                {
                    label: '运输单号',
                    prop: 'taskNo'
                },
                {
                    label: '合同编号',
                    prop: 'contractNo'
                },
                {
                    label: '客户订单号',
                    prop: 'customerOrderNo'
                },
                {
                    label: '客户',
                    prop: 'customerName'
                },
                {
                    label: '实收总数量(EA)',
                    prop: 'totalQty'
                },
                {
                    label: '实收总体积(m³)',
                    prop: 'totalVolume'
                },
                {
                    label: '实收总重量(KG)',
                    prop: 'totalGrossWeight'
                }
            ],
            tableData: []
        };
    },
    methods: {
        loading(status = true) {
            if (status) {
                this.dialogLoading = this.$loading({
                    target: '.transferConfirmDialog > div',
                    background: 'rgba(255, 255, 255, .7)'
                });
            } else {
                this.dialogLoading.close();
            }
        },
        // 查询弹框所需数据
        queryData() {
            this.loading();
            this.closeOnClickModal = true;
            this.obj.receiptDate = this.rowData.receiptDate;
            this.obj.receiptPersonName = this.rowData.receiptPersonName;
            transfersToconfirmList(this.rowData.transferNo).then(res => {
                if (res) {
                    this.tableData = res.data.list || [];
                    this.loading(false);
                    this.closeOnClickModal = false;
                } else {
                    this.beforeClose();
                }
            }).catch(() => {
                this.beforeClose();
            });
        },
        comfirm() {
            const params = {
                receiptPersonName: this.user.userName,
                receiptPersonCode: this.user.userCode,
                transferNo: this.rowData.transferNo,
                transferStatus: this.rowData.transferStatus,
                list: this.tableData
            };
            this.loading();
            receiptTransfertoconfirm(params).then(res => {
                if (res) {
                    this.$message.success('接收成功');
                    this.$emit('refreshList', this.searchObj);
                    this.beforeClose();
                } else {
                    this.loading(false);
                }
            }).catch(() => {
                this.loading(false);
            });
        },
        beforeClose() {
            this.$emit('update:cellShaow', false);
        }
    },
    mounted () {
        // 查询弹框所需数据
        this.queryData();
    },
    computed: {
        ...mapState({ user: state => state.user })
    }
};
</script>
<style lang="less" scoped>
.el-form-item {
    margin-bottom: 0;
}
</style>
