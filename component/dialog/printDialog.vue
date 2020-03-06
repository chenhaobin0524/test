<template>
    <div>
        <el-dialog class="form-dialog" title="请选择打印的单据" :visible.sync="dialogVisible" :before-close="handleBillClose" width="40%">
            <div class="bill-dialog">
                <el-radio-group v-model="radio" class="print-group">
                    <el-radio :label="2" class="radio-width">集配单</el-radio>
                    <el-radio :label="1" class="radio-width">配送单</el-radio>
                    <el-radio :label="4" class="radio-width">出库单</el-radio>
                    <el-radio :label="3" class="radio-width">提货单</el-radio>
                    <el-radio :label="7" class="radio-width">分拨交接单</el-radio>
                    <el-radio :label="6" v-if="isTransport" class="radio-width">运输协议</el-radio>
                    <el-radio :label="8" v-if="isVisualLogistics" class="radio-width">视源物流签收单</el-radio>
                    <el-radio :label="9" class="radio-width">提货清单</el-radio>
                    <el-radio :label="10" class="radio-width">网点配送单</el-radio>
                    <el-radio :label="11" v-if="isShowElectron" class="radio-width">电子面单</el-radio>
                </el-radio-group>
            </div>
            <div slot="footer" class>
                <el-button @click="handleBillClose">取 消</el-button>
                <el-button type="primary" @click="cancelBill(radio)">确 认</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    props: {
        dialogVisible: {
            type: Boolean,
            default: false
        },
        isTransport: {
            type: Boolean,
            default: false
        },
        isVisualLogistics: {
            type: Boolean,
            default: false
        },
        isShowElectron: {
            type: Boolean,
            default: false
        },
        rowPrintData: {
            type: Object,
            default() {
                return {};
            }
        }
    },
    data() {
        return {
            radio: ''
        };
    },
    methods: {
        handleBillClose() {
            this.$emit('handleBillClose', '');
        },
        cancelBill(radio) {
            const actions = {
                1: ['配送单', 'distributionPrintTimes'],
                2: ['集配单', 'collectPrintTimes'],
                3: ['提货单', 'deliveryPrintTimes'],
                4: ['出库单', 'outPrintTimes'],
                7: ['分拨交接单', 'allocatePPrintTimes'],
                11: ['电子面单', 'ysPrintTimes']
            };
            const action = actions[+radio];
            if (action && this.rowPrintData[action[1]] > 0) {
                this.printConfirm(action[0], this.rowPrintData[action[1]], radio);
            } else {
                this.$emit('cancelBill', radio);
            }
        },
        printConfirm(type, printNums, radio) {
            this.$confirm(`该${type}已打印${printNums}次，是否继续？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$emit('cancelBill', radio);
            }).catch(() => {});
        }
    },
    created() {}
};
</script>

<style lang="less">
    .print-group {
        .radio-width {
            width: 90px;
            margin-bottom: 4px;
        }
    }
</style>