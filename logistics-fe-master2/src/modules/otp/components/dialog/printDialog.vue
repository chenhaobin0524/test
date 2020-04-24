<template>
    <div>
        <el-dialog class="form-dialog" title="请选择打印的单据" :visible.sync="dialogVisible" :before-close="handleBillClose" width="50%">
            <div class="bill-dialog">
                <el-radio-group v-model="radio" class="print-group">
                    <div class="printtop">
                        <el-radio :label="2" class="radio-width">集配单</el-radio>
                        <el-radio :label="1" class="radio-width">配送单</el-radio>
                        <el-radio :label="4" class="radio-width">出库单</el-radio>
                        <el-radio :label="3" class="radio-width">提货单</el-radio>
                        <el-radio :label="7" class="radio-width">分拨交接单</el-radio>
                        <el-radio :label="6" class="radio-width">运输协议</el-radio>
                        <el-radio :label="8" class="radio-width">视源物流签收单</el-radio>
                        <el-radio :label="9" class="radio-width">提货清单</el-radio>
                        <el-radio :label="10" class="radio-width">网点配送单</el-radio>
                        <el-radio :label="11" v-if="isShowElectron" class="radio-width">电子面单</el-radio>
                        <!-- <el-radio :label="16" class="radio-width">装车单</el-radio> -->
                    </div>
                    <div class="newprint">
                             <!-- <el-radio :label="12" class="radio-width">配送单(统配)
                                 <el-tooltip class="item" effect="dark" content="按照发车单维度进行打印，同一家门店订单汇总" placement="top">
                                   <span class="why">?</span>
                                </el-tooltip>
                             </el-radio>
                              <el-radio :label="18" class="radio-width">配送单
                                 <el-tooltip class="item" effect="dark" content="客户订单维度打印的配送单据" placement="top">
                                   <span class="why">?</span>
                                </el-tooltip>
                             </el-radio>
                             <el-radio :label="19" class="radio-width">配送单-协同仓
                                 <el-tooltip class="item" effect="dark" content="按照合同号维度打印的配送单据，无合同则按照客户订单号维度" placement="top">
                                   <span class="why">?</span>
                                </el-tooltip>
                             </el-radio> -->
                             <el-radio :label="13" class="radio-width">电商退货交接单
                                 <el-tooltip class="item" effect="dark" content="电商退货交接" placement="top">
                                   <span class="why">?</span>
                                </el-tooltip>
                             </el-radio>
                             <!-- <el-radio :label="17" class="radio-width">送货清单
                                 <el-tooltip class="item" effect="dark" content="送货合同，按照合同号维度进行分组打印" placement="top">
                                   <span class="why">?</span>
                                </el-tooltip>
                             </el-radio>
                             <el-radio :label="20" class="radio-width">提货单
                                 <el-tooltip class="item" effect="dark" content="提货单据明细" placement="top">
                                   <span class="why">?</span>
                                </el-tooltip>
                             </el-radio>
                              <el-radio :label="15" class="radio-width">集配单
                                 <el-tooltip class="item" effect="dark" content="电商宅配大单（送网点），按照网点进行分组打印" placement="top">
                                   <span class="why">?</span>
                                </el-tooltip>
                             </el-radio> -->
                             <el-radio :label="14" class="radio-width">集配小单
                                 <el-tooltip class="item" effect="dark" content="电商宅配小单（送网点），按照网点进行分组打印" placement="top">
                                   <span class="why">?</span>
                                </el-tooltip>
                             </el-radio>

                    </div>
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
                7: ['分拨交接单', 'allocatePrintTimes']
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
             height: 28px;
                border: 1px solid #ccc;
                width: 29%;
                min-width: 150px;
                margin-right: 3%;
                margin-bottom: 15px;
                padding: 16px 0 0 5px;
                .el-radio__label{
                    font-size: 15px;
                }
        }
        .newprint{
            border-top: 1px solid #ccc;
            margin-top: 10px;
            padding-top: 20px;
            .item{
                position: absolute;
                right: 8px;
            }
            .why{
                display: inline-block;
                width: 12px;
                height: 12px;
                text-align: center;
                line-height: 12px;
                border: 1px solid #ccc;
                border-radius: 50%;
                background: #cccccc;
                font-size: 12px;
                color: #555757;
            }
        }
    }
</style>