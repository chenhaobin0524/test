<template>
    <Paper>
        <div class="edit-page">
            <div class="btn-group">
                <div class="left-btn">
                    <el-button type="primary" @click="statusUpload" :disabled="btnDisabled || status==='40'">确 认</el-button>
                    <el-button type="primary" @click="orderConfirm" :disabled="btnDisabled">关 闭</el-button>
                </div>
                <!-- <el-button
                    style="width: 30px; padding: 0;"
                    v-if="activeName === '2'"
                    @click="addRow"
                >
                    <i class="el-icon-plus"></i>
                </el-button> -->
                <el-button type='primary' @click="goList" v-if="activeName !== '2'">返 回</el-button>
            </div>
            <div class="wrap-tab">
                <el-tabs class="info" v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane label="商品信息" name="1">
                        <div class="commodity-info">
                            <el-table
                                :data="commodity.newTableData[commodity.currentPage-1]"
                                border
                                class="wrapp-tb"
                                @row-click="(row, column) => {this.handleDbClick('commodity', row, column)}"
                            >
                                <el-table-column prop="vdOrderNo" label="增值服务单号" width="180"></el-table-column>
                                <el-table-column prop="customerItemCode" label="商品编号" width="180"></el-table-column>
                                <el-table-column prop="itemName" label="商品名称" width="260"></el-table-column>
                                <el-table-column prop="itemLineNo" label="商品行号" width="160"></el-table-column>
                                <el-table-column prop="inventoryType" label="库存类型" width="120">
                                     <template slot-scope="scope">
                                        <span>{{ scope.row.inventoryType|showDict(options) }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="planQty" label="计划数量"></el-table-column>
                                <el-table-column prop="damage107Qty" width="140" label="机损物流责任数量">
                                    <template slot-scope="scope">
                                        <el-input
                                            size="mini"
                                            v-if="scope.row.isEdit"
                                            style="width: 100%;"
                                            v-model="scope.row.damage107Qty"
                                            @input="inputChange(scope.row,'damage107Qty')"
                                            @blur="handleNumber(scope.row, 'damage107Qty')"
                                        ></el-input>
                                        <span v-else>{{ scope.row.damage107Qty }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    prop="payment107Ratio"
                                    width="140"
                                    label="机损物流赔付比例"
                                >
                                    <template slot-scope="scope">
                                        <el-select
                                            size="mini"
                                            v-if="scope.row.isEdit"
                                            style="width: 100%;"
                                            :disabled="!scope.row.damage107Qty"
                                            v-model="scope.row.payment107Ratio"
                                            @change="inputChange"
                                        >
                                            <el-option
                                                v-for="(option,index) in selectOption"
                                                :key="index"
                                                :value="option.value"
                                                :label="option.label"
                                            ></el-option>
                                        </el-select>
                                        <span v-else>{{ scope.row.payment107Ratio|showDict(labelOptions) }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="damage108Qty" width="140" label="箱损物流责任数量">
                                    <template slot-scope="scope">
                                        <el-input
                                            size="mini"
                                            v-if="scope.row.isEdit"
                                            style="width: 100%;"
                                            v-model="scope.row.damage108Qty"
                                            @input="inputChange(scope.row,'damage108Qty')"
                                            @blur="handleNumber(scope.row, 'damage108Qty')"
                                        ></el-input>
                                        <span v-else>{{ scope.row.damage108Qty }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="paymentRatio" width="140" label="箱损物流赔付比例">
                                    <template slot-scope="scope">
                                        <span>{{scope.row.damage108Qty && +scope.row.damage108Qty > 0 ? 4 : ''}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="damage106Qty" width="140" label="机损商家责任数量">
                                    <template slot-scope="scope">
                                        <el-input
                                            size="mini"
                                            v-if="scope.row.isEdit"
                                            style="width: 100%;"
                                            v-model="scope.row.damage106Qty"
                                            @input="canSelect(scope.row)"
                                            @blur="handleNumber(scope.row, 'damage106Qty')"
                                        ></el-input>
                                        <span v-else>{{scope.row.damage106Qty}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    prop="payment106Ratio"
                                    width="140"
                                    label="机损商家赔付比例"
                                >
                                    <template slot-scope="scope">
                                        <!-- <el-select
                                            size="mini"
                                            v-if="scope.row.isEdit"
                                            type="text"
                                            style="width: 100%;"
                                            v-model="scope.row.payment106Ratio"
                                            :disabled="scope.row.disabled"
                                            @change="inputChange"
                                        >
                                            <el-option
                                                v-for="(option,index) in selectOption"
                                                :key="index"
                                                :value="option.value"
                                                :label="option.label"
                                            ></el-option>
                                        </el-select>
                                        <span v-else>{{ scope.row.payment106Ratio|showDict(labelOptions) }}</span> -->
                                        <span>{{ scope.row.payment106Ratio|showDict(labelOptions) }}</span>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <div class="footer">
                                <el-button
                                    type="primary"
                                    class="set-width saveBtn"
                                    size="small"
                                    @click="commoditySave"
                                    :disabled="btnDisabled"
                                >保 存</el-button>
                                <!-- <el-pagination
                                    class="text-right dialogTablePagination"
                                    @size-change="(val) => {this.handleSizeChange('commodity', val)}"
                                    @current-change="(val) => {this.handleCurrentChange('commodity', val)}"
                                    :current-page.sync="commodity.currentPage"
                                    :page-sizes="[10, 20, 30, 50, 100]"
                                    layout="total, sizes, prev, pager, next, jumper"
                                    :total="commodity.total"
                                ></el-pagination> -->
                            </div>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="SN信息" name="2">
                        <div class="SN-info">
                            <el-table
                                :data="SN.tableData"
                                class="wrapp-tb"
                                height="350"
                                border
                                @row-click="(row, column) => {this.handleDbClick('SN', row, column)}"
                            >
                                <el-table-column prop="itemLineNo" label="商品行号" width="180"></el-table-column>
                                <el-table-column prop="customerItemCode" label="商品编码" width="180"></el-table-column>
                                <el-table-column prop="inventoryType" label="库存类型">
                                    <template slot-scope="scope">
                                        <el-select
                                            size="mini"
                                            v-if="scope.row.isEdit"
                                            style="width: 100%;"
                                            v-model="scope.row.inventoryType"
                                        >
                                            <el-option
                                                v-for="(option,index) in SNOptions"
                                                :key="index"
                                                :value="option.value"
                                                :label="option.label"
                                                :disabled="option.disabled"
                                            ></el-option>
                                        </el-select>
                                        <span v-else>{{ scope.row.inventoryType|showDict(options) }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="snCode" label="商品SN">
                                    <template slot-scope="scope">
                                        <el-input
                                            size="mini"
                                            v-if="scope.row.isEdit"
                                            type="text"
                                            style="width: 100%;"
                                            :class="{showMustFill:!scope.row.snCode}"
                                            v-model="scope.row.snCode"
                                            @input="snInput"
                                            :disabled="scope.row.reqSuccessFlag===1"
                                        ></el-input>
                                        <span v-else>{{ scope.row.snCode }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="extends2" label="责任调拨方">
                                    <template slot-scope="scope">
                                        <el-input
                                            size="mini"
                                            v-if="scope.row.isEdit"
                                            type="text"
                                            style="width: 100%;"
                                            v-model="scope.row.extends2"
                                            :disabled="scope.row.reqSuccessFlag===1"
                                            @input="snInput"
                                        ></el-input>
                                        <span v-else>{{ scope.row.extends2 }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="extends3" label="内部责任方">
                                    <template slot-scope="scope">
                                        <el-input
                                            size="mini"
                                            v-if="scope.row.isEdit"
                                            type="text"
                                            style="width: 100%;"
                                            v-model="scope.row.extends3"
                                            :disabled="scope.row.reqSuccessFlag===1"
                                            @input="snInput"
                                        ></el-input>
                                        <span v-else>{{ scope.row.extends3 }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="remark" label="备注">
                                    <template slot-scope="scope">
                                        <el-input
                                            size="mini"
                                            v-if="scope.row.isEdit"
                                            type="text"
                                            style="width: 100%;"
                                            v-model="scope.row.remark"
                                            :disabled="scope.row.reqSuccessFlag===1"
                                            @input="snInput"
                                        ></el-input>
                                        <span v-else>{{ scope.row.remark }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="refKeyIn" label="入库单号"></el-table-column>
                                <el-table-column prop="refKeyOut" label="出库单号"></el-table-column>
                            </el-table>
                            <div class="footer">
                                <div>
                                    <el-button type="primary" class="set-width saveBtn" @click="snSave" :disabled="btnDisabled">保 存</el-button>
                                </div>
                            </div>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
    </Paper>
</template>
<script>
import Paper from '@/components/core/paper/Paper';
import { dictWithUrl } from '@/components/otpPanel/api';
import { isInt } from '../../../../judge/configCenter';
import { messageBox } from '../../../../utils/messageBox';
import {
    getvalueAddedServiceItems,
    getValueAddedServiceItemSns,
    batchUpdate,
    snBatchUpdate,
    statusUpload,
    orderConfirm
} from '../../../../api/orderManage';
const dic = {
    damage106Qty: '机损商家责任数量',
    damage107Qty: '机损物流责任数量',
    damage108Qty: '箱损物流责任数量'
};
export default {
    name: '_alibabaServicesSingle',
    data() {
        return {
            activeName: '1',
            dialogVisible: false,
            isSave: true,
            vdOrderNo: '',
            commodity: {
                currentPage: 1,
                total: 0,
                tableData: [],
                newTableData: [],
                pageSize: 999
            },
            selectOption: [
                {
                    value: 35,
                    label: '35'
                },
                {
                    value: 80,
                    label: '80'
                }
            ],
            labelOptions: [
                {
                    value: 0,
                    label: '0'
                },
                {
                    value: 3,
                    label: '3'
                },
                {
                    value: 4,
                    label: '4'
                },
                {
                    value: 35,
                    label: '35'
                },
                {
                    value: 80,
                    label: '80'
                }
            ],
            searchParams: {
                pageNo: 1,
                pageSize: 999
            },
            snSearchParams: {
                pageNo: 1,
                pageSize: 999
            },
            SN: {
                currentPage: 1,
                total: 0,
                newTableData: [],
                tableData: []
            },
            options: [],
            SNOptions: [
                {
                    value: '104',
                    label: '机损待鉴定',
                    disabled: true
                },
                {
                    value: '105',
                    label: '箱损待确定',
                    disabled: true
                },
                {
                    value: '106',
                    label: '机损商家责任数量'
                },
                {
                    value: '107',
                    label: '机损物流责任数量'
                },
                {
                    value: '108',
                    label: '箱损物流责任数量'
                }
            ],
            mustFillParams: {
                damage107Qty: 0,
                payment107Ratio: 0,
                damage108Qty: 0,
                paymentRatio: 4,
                damage106Qty: 0,
                payment106Ratio: 0
            },
            status: '',
            btnDisabled: false,
            snDeatilNum: [],
            snIsSave: true
        };
    },
    watch: {
        'commodity.tableData': function(a, b) {
            let arr = [];
            this.commodity.newTableData = [];
            this.commodity.tableData.map((item, index) => {
                arr.push(item);
                if ((index + 1) % this.commodity.pageSize === 0 || index === this.commodity.tableData.length - 1) {
                    this.commodity.newTableData.push(arr);
                    arr = [];
                }
            });
        }
    },
    methods: {
        snSave() {
            let flag = false;
            for (let i = 0; i < this.SN.tableData.length; i++) {
                if (!this.SN.tableData[i].snCode) {
                    this.SN.tableData[i].isEdit = true;
                    flag = true;
                }
                if (this.SN.tableData[i].snCode && this.SN.tableData[i].snCode.length > 60) {
                    this.$message.error('SN商品长度过长');
                    return;
                }
            }
            if (!flag) {
                this.SN.tableData.forEach(item => {
                    item.isEdit = false;
                });
            } else {
                this.$message.error('商品SN不能为空');
            }
            this.isSave = true;
            this.snIsSave = true;
            snBatchUpdate(this.SN.tableData).then(res => {
                if (res.code === '0') {
                    this.$message.success('操作成功');
                    this.getList();
                }
            });
        },
        snInput() {
            this.isSave = false;
        },
        statusUpload() {
            const that = this;
            const save = function() {
                let count = 0;
                that.commodity.tableData.map(item => {
                    if (item.planQty) {
                        count += item.planQty;
                    }
                });
                if (count !== that.SN.tableData.length || !that.snIsSave) {
                    that.$message.error('SN信息条数不等于商品信息之和，请添加补全SN信息表并保存后再操作');
                    return;
                }
                statusUpload({ vdOrderNo: that.vdOrderNo }).then(res => {
                    if (res.code === '0') {
                        that.$message.success('操作成功');
                        that.$eventBus.$emit('closeTag', that.$route);
                    }
                });
            };
            if (!this.isSave) {
                messageBox(this, '商品信息或SN信息存在未保存数据,是否继续确认操作？').then(() => {
                    save();
                });
            } else {
                save();
            }
        },
        orderConfirm() {
            orderConfirm({ vdOrderNo: this.vdOrderNo }).then(res => {
                if (res.code === '0') {
                    this.$message.success('操作成功');
                    this.$eventBus.$emit('closeTag', this.$route);
                }
            });
        },
        getDict() {
            dictWithUrl('O_ITEM_STATUS').then(res => {
                if (res.code === '0') {
                    this.options = [];
                    for (const key in res.data.O_ITEM_STATUS) {
                        if (res.data.O_ITEM_STATUS.hasOwnProperty(key)) {
                            this.options.push({
                                value: key,
                                label: res.data.O_ITEM_STATUS[key]
                            });
                        }
                    }
                }
            });
        },
        inputChange(val, prop) {
            if (prop === 'damage107Qty' && !val[prop]) {
                val.payment107Ratio = 0;
            }
            // if (prop === 'damage108Qty' && !val[prop]) {
            //     val.paymentRatio = null;
            // }
            this.isSave = false;
        },
        getCom() {
            return getvalueAddedServiceItems(this.searchParams).then(res => {
                if (res.code === '0') {
                    res.data.list.map(item => {
                        item.isEdit = false;
                        if (item.dutyRatio) {
                            item.disabled = true;
                        } else {
                            item.disabled = false;
                        }
                    });
                    if (res.data.list.length) {
                        this.vdOrderNo = res.data.list[0].vdOrderNo;
                    }
                    this.commodity.tableData = res.data.list.map(item => {
                        return { ...this.mustFillParams, ...item };
                    });
                    this.commodity.total = res.data.totalCount;
                }
            });
        },
        getSn(commitState) {
            // 造Sn数据
            if (commitState) {
                this.SN.tableData = this.snTableFactory(this.SN.tableData);
                this.SN.total = this.SN.tableData.length;
                return;
            }
            getValueAddedServiceItemSns(this.snSearchParams).then(sn => {
                if (sn.code === '0') {
                    sn.data.list.map(item => {
                        item.isEdit = false;
                    });
                    this.SN.tableData = this.snTableFactory(sn.data.list);
                    this.SN.total = this.SN.tableData.length;
                }
            });
        },
        snTableFactory(snData) {
            const snList = [];
            const count = {
                damage106Qty: 0,
                damage107Qty: 0,
                damage108Qty: 0
            };
            this.commodity.newTableData[this.commodity.currentPage - 1].forEach(item => {
                count.damage106Qty = item.damage106Qty;
                count.damage107Qty = item.damage107Qty;
                count.damage108Qty = item.damage108Qty;
                for (let i = 0; i < item.planQty; i++) {
                    let inventoryType;
                    let key;
                    if (count.damage106Qty > 0) {
                        inventoryType = '106';
                        key = 'damage106Qty';
                    } else if (count.damage107Qty > 0) {
                        inventoryType = '107';
                        key = 'damage107Qty';
                    } else if (count.damage108Qty > 0) {
                        inventoryType = '108';
                        key = 'damage108Qty';
                    }
                    snList.push({
                        itemLineNo: item.itemLineNo,
                        customerItemCode: item.customerItemCode,
                        inventoryType: inventoryType || item.inventoryType,
                        snCode: item.snCode,
                        extends2: item.extends2,
                        extends3: '',
                        remark: '',
                        refKeyIn: item.refKeyIn,
                        refKeyOut: item.refKeyOut,
                        isEdit: false,
                        reqSuccessFlag: 0,
                        ResTran: '',
                        vdOrderNo: item.vdOrderNo,
                        planQty: item.planQty
                    });
                    if (key) count[key] -= 1;
                }
            });
            // 将已有的Sn数据插入并删除造数据
            snData.forEach(item => {
                const f = snList.findIndex(nItem => {
                    return nItem.itemLineNo === item.itemLineNo && nItem.planQty !== item.planQty;
                });
                if (f >= 0) {
                    item.customerItemCode = snList[f].customerItemCode;
                    snList.splice(f, 1, item);
                }
            });
            return snList;
        },
        async getList() {
            this.getCom().then(this.getSn);
        },
        goList() {
            this.$router.push({
                path: '/order-manage/alibaba-services'
            });
        },
        commoditySave() {
            let qty106 = 0;
            let qty107 = 0;
            let qty108 = 0;
            const arr = this.commodity.tableData;
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].damage107Qty && !isInt(Number(arr[i].damage107Qty))) {
                    this.$message.error('机损物流责任数量必须为正整数或0');
                    return;
                }
                if (!arr[i].damage107Qty) {
                    arr[i].damage107Qty = 0;
                    qty107 = 0;
                } else {
                    qty107 = parseInt(arr[i].damage107Qty);
                }

                if (arr[i].damage106Qty && !isInt(Number(arr[i].damage106Qty))) {
                    this.$message.error('机损商家责任数量必须为正整数或0');
                    return;
                }
                if (!arr[i].damage106Qty) {
                    arr[i].damage106Qty = 0;
                    qty106 = 0;
                } else {
                    qty106 = parseInt(arr[i].damage106Qty);
                }
                if (arr[i].damage108Qty && !isInt(Number(arr[i].damage108Qty))) {
                    this.$message.error('箱损物流责任数量必须为正整数或0');
                    return;
                }
                if (!arr[i].damage108Qty) {
                    arr[i].damage108Qty = 0;
                    qty108 = 0;
                } else {
                    qty108 = parseInt(arr[i].damage108Qty);
                }
                if (parseInt(arr[i].planQty) !== qty106 + qty107 + qty108) {
                    this.$message.error(`第${Math.ceil((i + 1) / this.commodity.pageSize)}页第${(i + 1) % this.commodity.pageSize}行”机损物流责任数量“+”箱损物流责任数量“+”机损商家责任数量“必须等于”计划数量“`);
                    return;
                }
                arr[i].paymentRatio = 4;
            };
            this.commodity.tableData.forEach(item => {
                item.isEdit = false;
            });
            this.isSave = true;
            // console.log(this.commodity.tableData);

            batchUpdate(this.commodity.tableData).then(res => {
                if (res.code === '0') {
                    this.$message.success('修改成功');
                    this.getList();
                    this.getSn(true);
                }
            });
        },
        handleDbClick(text, row, column) {
            row.isEdit = true;
        },
        canSelect(val) {
            this.isSave = false;
            if (Number(val.damage106Qty)) {
                val.disabled = true;
                val.payment106Ratio = 0;
            } else {
                val.disabled = false;
            }
        },
        handleSizeChange(text, val) {
            if (text === 'commodity') {
                this.searchParams.pageSize = val;
                this.getCom();
            }
        },
        handleCurrentChange(text, val) {
            if (text === 'commodity') {
                this.commodity.currentPage = val;
            }
        },
        // beforeLeave() {
        //     if (!this.isSave) {
        //         this.$message.warning('请先保存数据');
        //         return false;
        //     } else {
        //         return true;
        //     }
        // },
        handleClick(data) {
            if (!this.isSave) {
                return false;
            }
            // this.getList();
        },
        addSnRow(arr, index) {
            let count = 0;
            for (let i = 0; i < index; i++) {
                count += this.commodity.tableData[i].planQty;
            }
            if (this.snDeatilNum.length - 1 === index) {
                this.snDeatilNum[index]++;
            } else {
                this.snDeatilNum[index] = this.SN.tableData.length - count + 1;
            }
            let flag = true;
            if (Number(arr[index].damage107Qty) && Number(arr[index].damage107Qty) >= this.snDeatilNum[index]) {
                flag = false;
            }
            this.SN.tableData.unshift({
                itemLineNo: arr[index].itemLineNo,
                vdOrderNo: arr[index].vdOrderNo,
                customerItemCode: arr[index].customerItemCode,
                inventoryType: flag ? '104' : '105',
                snCode: '',
                ResTran: '',
                reqSuccessFlag: 0,
                isEdit: true
            });
        },
        addRow() {
            const arr = this.commodity.tableData;
            this.addSnRow(arr, 0);
            // const arr = this.commodity.tableData;
            // let num = 0;
            // const numArr = [];
            // arr.map(item => {
            //     num += item.planQty;
            //     numArr.push(item.planQty);
            // });
            // if (this.SN.tableData.length === num) {
            //     this.$message.warning('添加行数不得超过商品信息计划数量之和');
            //     return;
            // }
            // this.isSave = false;
            // this.snIsSave = false;
            // if (this.SN.tableData.length < numArr[0]) {
            //     this.addSnRow(arr, 0);
            //     return;
            // }
            // let total = 0;
            // for (let j = 0; j < numArr.length; j++) {
            //     total += numArr[j];
            //     if (this.SN.tableData.length === total) {
            //         if (j < numArr.length - 1) {
            //             this.addSnRow(arr, j + 1);
            //             return;
            //         }
            //     }
            //     if (this.SN.tableData.length < total && this.SN.tableData.length >= total - numArr[j - 1]) {
            //         this.addSnRow(arr, j);
            //         return;
            //     }
            // }
        },
        setBtnDisabled(status) {
            this.status = status;
            if (status === '50' || status === '60') {
                this.btnDisabled = true;
            } else {
                this.btnDisabled = false;
            }
        },
        handleNumber(row, key) {
            const total = (+row.damage106Qty) + (+row.damage107Qty) + (+row.damage108Qty);
            if (total > row.planQty) {
                this.$message.warning(`${dic[key]}超出计划数量，请重新输入`);
                row[key] = 0;
            }
        }
    },
    components: {
        Paper
    },
    filters: {
        showDict(val, options) {
            for (let i = 0; i < options.length; i++) {
                if ((options[i].value + '') === (val + '')) {
                    return options[i].label;
                }
            }
        }
    },
    created() {
        this.setBtnDisabled(this.$route.query.status);
        this.searchParams = { ...this.searchParams, vdOrderNo: this.$route.params.id };
        this.snSearchParams = { ...this.snSearchParams, vdOrderNo: this.$route.params.id };
        this.getList();
        this.getDict();
    }
};
</script>
<style lang="less">
.edit-page {
    height: 100%;
    display: flex;
    flex-direction: column;
    .saveBtn{
        height:30px;
        padding:0;
    }
    .showMustFill {
        .el-input__inner {
            border: 1px solid #f00;
        }
    }
    .btn-group {
        display: flex;
        justify-content: space-between;
        .left-btn {
            .el-button {
                width: 80px;
            }
        }
    }
    .wrap-tab {
        flex: 1;
        display: flex;
        flex-direction: column;
        .info {
            flex: 1;
            display: flex;
            flex-direction: column;
            .el-tabs__content {
                flex: 1;
                .el-tab-pane {
                    height: 100%;
                }
            }
            .commodity-info,
            .SN-info {
                height: 100%;
                display: flex;
                flex-direction: column;
                .wrapp-tb {
                    width: 100%;
                    flex: 1;
                    overflow: auto;
                }
                .footer {
                    display: flex;
                    justify-content: space-between;
                    margin-top:30px;
                    .selectedNo {
                        font-size: 12px;
                        margin-right: 15px;
                    }
                    .set-width {
                        width: 80px;
                    }
                    .dialogTablePagination {

                        float: left;
                        padding: 0;
                        .btn-prev, .btn-next, .el-pager li {
                            background-color: #ffffff !important;
                            border: 1px solid #cccccc;
                            border-radius: 4px !important;
                            padding:0;
                            min-width: 30px;
                            margin-right:4px;
                        }
                        .el-pager li.active + li {
                            border-left: 1px solid #cccccc;
                        }
                        .el-pager li:not(.disabled).active{
                            background-color: #00BCBF !important;
                            border: 1px solid #00BCBF;
                            color:#ffffff;
                        }

                    }
                }
            }
        }
    }
}
</style>
