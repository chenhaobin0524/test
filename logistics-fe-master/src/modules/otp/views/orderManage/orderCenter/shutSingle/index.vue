<template>
    <div id="demolitionOrder">
        <el-dialog
            title="订单关闭/确认"
            :visible.sync="shutSingle"
            width="80%"
            :before-close="handleClose"
            >
            <h2>可关闭订单数：{{list.length}}</h2>
            <div v-loading="loading">
                <div v-for="(item, index) in list" :key="index">
                    <div v-if="item.joinType && item.joinType === 'SHARE'">
                        <div class="shareReason">
                            <div class="customerOrderNo">
                                客户订单号：<span>{{item.customerOrderNo}}</span>
                            </div>
                            <div class="customerOrderNo">
                                客户名称：<span>{{item.customerName}}</span>
                            </div>
                            <div class="customerOrderNo">
                                <span>调剂失败原因：</span>
                                <div class="customerOrderNo" style="width: 160px;">
                                    <otpSelect :optionNum="'JOIN_REASON'" :prop="'joinReason'" @getSelectValue="(data) => getSelectValue(index, data)"></otpSelect>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-else>
                        <div class="userOrder">
                            <div class="customerOrderNo">
                                客户订单号：<span>{{item.customerOrderNo}}</span>
                            </div>
                            <div class="customerOrderNo">
                                客户名称：<span>{{item.customerName}}</span>
                            </div>
                        </div>
                        <div class="orderTable">
                            <el-table
                                    :data="item.customerOrderItemsExt"
                                    style="width: 100%">
                                <el-table-column
                                        prop="customerItemCode"
                                        label="客户商品编码"
                                        show-overflow-tooltip>
                                </el-table-column>
                                <el-table-column
                                        prop="itemCode"
                                        label="商品编码"
                                        show-overflow-tooltip>
                                </el-table-column>
                                <el-table-column
                                        prop="itemName"
                                        label="商品名称"
                                        show-overflow-tooltip
                                        width="300">
                                </el-table-column>
                                <el-table-column
                                        prop="planQty"
                                        label="计划数量"
                                        width="150">
                                </el-table-column>
                                <el-table-column
                                        prop="actQty"
                                        label="实际数量"
                                        width="150">
                                </el-table-column>
                                <template v-if="item.inOutType !== 'OUT'">
                                    <el-table-column
                                            prop="stockoutCount"
                                            label="短少"
                                            width="150">
                                        <template slot-scope="scope" class="input">
                                            <div class="input">
                                                <el-input-number :min="0"
                                                    :max="scope.row.planQty - scope.row.actQty"
                                                    v-model="scope.row.stockoutCount"
                                                    @input="changeStorehouse2(scope.row)"
                                                ></el-input-number>
                                            </div>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                            prop="rejectQty"
                                            label="拒收"
                                            width="150">
                                        <template slot-scope="scope" class="input">
                                            <div class="input">
                                                <el-input-number v-model="scope.row.rejectQty"
                                                    :min="0"
                                                    :max="scope.row.planQty - scope.row.actQty"
                                                    @input="changeStorehouse3(scope.row)"
                                                ></el-input-number>
                                            </div>
                                        </template>
                                    </el-table-column>
                                </template>
                                <template v-else>
                                    <el-table-column
                                            prop="cancleQty"
                                            label="冲销数量"
                                            width="150">
                                        <template slot-scope="scope" class="input">
                                            <div class="input">
                                                <el-input-number :min="0"
                                                    :max="scope.row.planQty - scope.row.actQty"
                                                    v-model="scope.row.cancleQty"
                                                ></el-input-number>
                                            </div>
                                        </template>
                                    </el-table-column>
                                </template>
                            </el-table>
                        </div>
                    </div>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="shutSingle = false">取 消</el-button>
                <el-button type="primary" @click="sava">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import otpSelect from '@/components/lots/otpSelect';
import { listCustomOrderItemsByOrderNos, closedCustomerOrderStatusMans } from '../../../../api/orderCenter';
export default {
    components: {
        otpSelect
    },
    props: {
        shutSingleLise: Array
    },
    data() {
        return {
            loading: false,
            shutSingle: false,
            stockoutCount: 0,
            rejectQty: 0,
            list: []
        };
    },
    mounted() {
    },
    computed: {
        newShutSingleLise() {
            let arr = [];
            const newArr = [];
            this.shutSingleLise.map(item => {
                arr.push(item);
                newArr.push(arr);
                arr = [];
            });
            return newArr;
        }
    },
    methods: {
        // 关闭订单保存
        _closedCustomerOrderStatusMans() {
            closedCustomerOrderStatusMans(this.list).then(res => {
                if (res && +res.code === 0) {
                    this.shutSingle = false;
                    this.$notify({
                        title: '成功关闭的订单',
                        message: `${res.data.successList.join(',')}`,
                        type: 'success'
                    });
                    setTimeout(() => {
                        this.$notify.error({
                            title: '失败的订单：',
                            message: `${res.data.failList.join(',')}`
                        });
                    }, 20);
                    setTimeout(() => {
                        this.$notify.warning({
                            title: '不符合的订单：',
                            message: `${res.data.nonConformityList.join(',')}`
                        });
                    }, 30);
                }
            });
        },
        // 查询关闭订单详情
        _listCustomOrderItemsByOrderNos() {
            this.loading = true;
            listCustomOrderItemsByOrderNos(this.shutSingleLise).then(res => {
                if (res && +res.code === 0 && res.data && res.data.length) {
                    this.list = res.data.map(item => {
                        if (item.customerOrderItemsExt) {
                            const inOrOut = item.inOutType;
                            item.customerOrderItemsExt = item.customerOrderItemsExt.map(i => {
                                i.actQty = +i.actQty || 0;
                                // i.stockoutCount = i.stockoutCount !== undefined && i.stockoutCount + '' ? +i.stockoutCount : (i.planQty - i.actQty);
                                // i.rejectQty = +i.rejectQty || 0;
                                const num = i.planQty - i.actQty;
                                i.cancleQty = inOrOut === 'OUT' ? num : 0;
                                i.stockoutCount = inOrOut !== 'OUT' && i.actQty !== 0 ? num : 0;
                                i.rejectQty = inOrOut !== 'OUT' && i.actQty === 0 ? num : 0;
                                return i;
                            });
                        }
                        return item;
                    });
                } else {
                    this.shutSingle = false;
                    this.$message.error('当前订单不可关闭');
                }
            }).finally(() => {
                this.loading = false;
            });
        },
        getSelectValue(index, data) {
            this.list[index] = Object.assign({}, this.list[index], data);
        },
        handleClose(done) {
            done();
        },
        sava() {
            this._closedCustomerOrderStatusMans();
        },
        changeStorehouse2(row) {
            row.rejectQty = row.planQty - row.actQty - row.stockoutCount;
        },
        changeStorehouse3(row) {
            row.stockoutCount = row.planQty - row.actQty - row.rejectQty;
        }
    },
    watch: {
        shutSingle(newValue) {
            if (newValue) {
                this._listCustomOrderItemsByOrderNos();
            }
        }
    }
};
</script>

<style lang="less">
#demolitionOrder{
    font-size: 12px;
    h2{
        margin: 0;
        color: #67C23A;
    }
    .userOrder{
        margin: 10px 0 5px 0;
    }
    .shareReason{
        margin-top: 15px;
        margin-bottom: 15px;
    }
    .customerOrderNo{
        display: inline-block;
        width: 30%;
    }
    .el-dialog__body{
        padding: 20px;
    }
    .orderTable{
        border: 1px solid #E8E8E8;
        margin-bottom: 15px;
        table{
            width: 100%;
        }
    }
    .input{
        display: flex;
        text-align: center;
    }
    .el-input__inner{
        text-align: center;
    }
}
</style>