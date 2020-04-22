<template>
    <div id="demolitionOrder">
        <el-dialog
            title="分仓&拆单"
            :visible.sync="dialogVisible"
            width="90%"
            @close="handleClose"
        >
            <div class="userOrder">
                客户订单号：
                <span>{{customerOrderNo}}</span>
            </div>
            <div class="orderTable">
                <template>
                    <el-table :data="demolitionOrder" style="width: 100%">
                        <el-table-column
                            v-for="(item,index) in dataLable"
                            :key="index"
                            :prop="item.prop"
                            :label="item.label"
                            :width="item.width"
                            show-overflow-tooltip
                            :fixed="item.whCode ? false : 'left'"
                        >
                            <template slot="header">
                                {{item.label}}
                                <template v-if="item.prop === 'count'">
                                    <span class="table-cell-btn">&nbsp;&nbsp;<el-button type="text" @click="distrbuteStock(item.whCode, 1)">分配</el-button>
                                    <el-button type="text" @click="distrbuteStock(item.whCode, 0)">撤回</el-button></span>
                                </template>
                            </template>
                            <template slot-scope="scope" class="input">
                                <div class="input" v-if='item.whCode'>
                                    <template v-if="scope.row.warehouseList && scope.row.warehouseList.find(i => i.whCode === item.whCode)">
                                        <div>
                                            可用：
                                            <span style="margin-right: 5px;">
                                                {{ scope.row.warehouseList.find(i => i.whCode === item.whCode).count}}
                                            </span>
                                        </div>
                                        <div>
                                            <el-input
                                                :disabled="scope.row.warehouseList.find(i => i.whCode === item.whCode).count === 0 && inOutType !== 'IN' && orderType !== 'DO' && orderType !== 'YS'"
                                                v-model="scope.row['storehouse'+item.whCode]"
                                                onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
                                                onafterpaste="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
                                                @keyup.native="changeStorehouse(scope.row,'storehouse'+item.whCode)"
                                            ></el-input>
                                        </div>
                                    </template>
                                </div>
                                <span v-else>
                                    {{scope.row[item.prop]}}
                                </span>
                            </template>
                        </el-table-column>
                    </el-table>
                </template>
                <div style="margin: 15px 10px;  font-size: 14px;">
                    <div style="margin-bottom: 15px;"
                        v-for="(item,index) in wareHouses"
                        :key="index"
                        >
                        <div v-if="item.count">
                            <span>{{item.label}}&nbsp;&nbsp;/</span>&nbsp;&nbsp;
                            <span>数量：{{item.count}}</span>&nbsp;&nbsp;&nbsp;&nbsp;
                            <span>体积：{{item.volume}}(m²)</span>&nbsp;&nbsp;/&nbsp;&nbsp;
                            <span>重量：{{item.grossWeight}}kg</span>
                        </div>
                    </div>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleClose">取 消</el-button>
                <el-button type="primary" @click="save" :loading="btnLoading">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import _ from '@/components/lots/utils';
import { separateWarehouseSearch, separateWarehouseConfirm } from '../../../../api/orderCenter';
export default {
    data() {
        return {
            btnLoading: false,
            dataLable: [],
            dataLableTemp: [
                {
                    label: '客户商品编码',
                    width: '138',
                    prop: 'customerItemCode'
                },
                {
                    label: '商品名称',
                    width: '400',
                    prop: 'itemName'
                },
                {
                    label: '状态',
                    width: '100',
                    prop: 'itemStatusName'
                },
                {
                    label: '已分配',
                    width: '100',
                    prop: 'allocatedNum'
                },
                {
                    label: '未分配',
                    width: '100',
                    prop: 'unallocatedNum'
                }
            ],
            customerOrderNo: '',
            dialogVisible: false,
            demolitionOrder: [],
            storehouse: [],
            wareHouses: [],
            orderNo: '',
            inOutType: '',
            orderType: ''
        };
    },
    methods: {
        show(status = true, id, orderNo, inOutType, orderType) {
            this.customerOrderNo = id;
            this.orderNo = orderNo;
            this.inOutType = inOutType;
            this.orderType = orderType;

            this.storehouse = [];
            this.wareHouses = [];
            this.dataLable = [];
            this.demolitionOrder = [];
            separateWarehouseSearch({ orderNo: orderNo }).then(res => {
                if (res && res.code === '0') {
                    const wareHouse = {};
                    res.data.itemList.forEach(item => {
                        item.warehouseList && item.warehouseList.forEach(child => {
                            wareHouse[child.whCode] = {
                                label: child.whName,
                                prop: 'count',
                                whCode: child.whCode,
                                width: '210'
                            };
                        });
                    });
                    this.wareHouses = Object.values(wareHouse);
                    this.dataLable = this.dataLableTemp.concat(this.wareHouses);
                    this.demolitionOrder = res.data.itemList;
                }
            }).finally(() => {
                this.dialogVisible = status;
            });
        },
        handleClose() {
            this.dialogVisible = false;
            this.storehouse = [];
            this.$emit('reflashList', false);
        },
        save() {
            this.btnLoading = true;
            const demolitionOrder = _.clone(this.demolitionOrder);
            // 校验
            let hasDistribution = false;
            demolitionOrder.forEach(item => {
                item.inputStockNum = 0;
                Object.keys(item).forEach(key => {
                    if (key.startsWith('storehouse')) {
                        hasDistribution = true;
                        item.inputStockNum += Number(item[key]);
                    }
                });
            });

            // 没有任何修改
            if (!hasDistribution) {
                this.$message.error('没分配任何商品数量！');
                this.btnLoading = false;
                return;
            }
            // 商品数量分配总和不可大于未分配数量！
            for (let i = 0; i < demolitionOrder.length; i++) {
                if (Number(demolitionOrder[i].unallocatedNum) < Number(demolitionOrder[i].inputStockNum)) {
                    this.$message.error('商品数量分配总和不可大于未分配数量！');
                    this.btnLoading = false;
                    return;
                }
            }
            // 商品数量分配大于仓库库存,需重新分配！
            // DO单不做库存检查 by yy
            if (this.inOutType !== 'IN' && this.orderType !== 'DO') {
                for (let i = 0; i < demolitionOrder.length; i++) {
                    const warehouseList = _.get(demolitionOrder[i], 'warehouseList', []);
                    for (let j = 0; j < warehouseList.length; j++) {
                        if (warehouseList[j].count === 0) continue;
                        const str = 'storehouse' + warehouseList[j].whCode;
                        const warehouseCount = Number(_.get(demolitionOrder[i], str, 0));
                        if (warehouseCount > Number(warehouseList[j].count)) {
                            this.$message.error('商品数量分配大于仓库库存,需重新分配！');
                            this.btnLoading = false;
                            return;
                        }
                    }
                }
            }
            // 套件校验
            const suiteList = demolitionOrder.filter(item => item.itemSuiteCode);
            const uniqueSuiteMap = {};
            let ifSameCountOfSuite = true;
            for (const suite of suiteList) {
                // 以套机编码和商品状态来做套机数量校验
                const uniqueKey = suite.itemSuiteCode + suite.itemStatus;
                // 如果该套件编码已经判断过，到下一个
                if (uniqueSuiteMap[uniqueKey]) continue;

                // 获取所有相同套机编码的数据进行判断
                const sameSuiteList = suiteList.filter(o => o.itemSuiteCode + o.itemStatus === uniqueKey);

                for (const s of sameSuiteList) {
                    // 如果已经有数量不相同的，直接跳出循环
                    if (!ifSameCountOfSuite) break;
                    const warehouseList = s.warehouseList || [];
                    // 判断每个仓库的套机数量是否一致
                    for (const w of warehouseList) {
                        if (suite[`storehouse${w.whCode}`] !== s[`storehouse${w.whCode}`]) {
                            ifSameCountOfSuite = false;
                            break;
                        }
                    }
                }
                uniqueSuiteMap[uniqueKey] = 1;
            }
            if (!ifSameCountOfSuite) {
                this.$message.error('套件商品输入数量必须相同,仓库必须同一仓库！');
                this.btnLoading = false;
                return;
            }
            const confirm = {
                orderNo: this.orderNo,
                list: []
            };
            let itemList = {};
            for (let i = 0; i < demolitionOrder.length; i++) {
                const warehouseList = demolitionOrder[i].warehouseList || [];
                for (let j = 0; j < warehouseList.length; j++) {
                    const str = 'storehouse' + warehouseList[j].whCode;
                    const listOrder = Number(demolitionOrder[i][str]) || 0;
                    if (listOrder !== 0) {
                        itemList = {
                            whName: warehouseList[j].whName,
                            whCode: warehouseList[j].whCode,
                            count: listOrder,
                            itemCode: demolitionOrder[i].itemCode,
                            itemLineNo: demolitionOrder[i].itemLineNo
                        };
                        confirm.list.push(itemList);
                    }
                }
            }

            // 接口分仓
            separateWarehouseConfirm(confirm).then(res => {
                if (res.code === '0') {
                    for (let i = 0; i < this.demolitionOrder.length; i++) {
                        this.demolitionOrder[i].allocatedNum = demolitionOrder[i].allocatedNum + demolitionOrder[i].inputStockNum;
                        this.demolitionOrder[i].unallocatedNum = demolitionOrder[i].unallocatedNum - demolitionOrder[i].inputStockNum;
                        const warehouseList = demolitionOrder[i].warehouseList || [];
                        for (let j = 0; j < warehouseList.length; j++) {
                            const str = 'storehouse' + warehouseList[j].whCode;
                            const listOrder = Number(demolitionOrder[i][str]) || 0;
                            if (listOrder !== 0) {
                                if (this.inOutType !== 'IN') {
                                    warehouseList[j].count = warehouseList[j].count - demolitionOrder[i].inputStockNum;
                                } else {
                                    warehouseList[j].count = warehouseList[j].count + demolitionOrder[i].inputStockNum;
                                }
                                this.demolitionOrder[i][str] = '';
                            }
                        }
                        if (demolitionOrder[i].unallocatedNum === 0) {
                            this.dialogVisible = false;
                        }
                    }
                    this.$message.success('分仓成功！');
                    this.wareHouses = [];
                } else {
                    let msg = res.msg;
                    msg = msg.replace('</br>', '！');
                    this.$message.success(msg);
                }
                this.btnLoading = false;
            }).catch(e => {
                this.btnLoading = false;
            });
        },
        changeStorehouse(row) {
            const wareHouseMap = {};
            this.wareHouses.forEach(item => {
                item.count = 0;
                item.volume = 0;
                item.grossWeight = 0;
                wareHouseMap['storehouse' + item.whCode] = item;
            });
            this.demolitionOrder.forEach(item => {
                Object.keys(wareHouseMap).forEach(key => {
                    if (item[key]) {
                        wareHouseMap[key].count += parseInt(item[key]);
                        wareHouseMap[key].volume += parseInt(item[key]) * item.volume;
                        wareHouseMap[key].grossWeight += parseInt(item[key]) * item.grossWeight;
                    }
                });
            });
            this.wareHouses = Object.values(wareHouseMap);
        },
        distrbuteStock(whCode, status) {
            const demolitionOrder = _.clone(this.demolitionOrder);
            const varStr = `storehouse${whCode}`;
            this.demolitionOrder = demolitionOrder.map(o => {
                if (o.warehouseList && o.warehouseList.length) {
                    const warehouse = o.warehouseList.find(o2 => o2.whCode === whCode);
                    if (warehouse) {
                        const maxAmount = this.inOutType === 'OUT' ? Math.min(warehouse.count || 0, o.unallocatedNum) : o.unallocatedNum;
                        o[varStr] = status ? maxAmount : 0;
                    }
                }
                return o;
            });
        }
    }
};
</script>

<style lang="less">
#demolitionOrder {
    font-size: 12px;

    .userOrder {
        margin-bottom: 10px;
    }

    .el-dialog__body {
        padding: 20px;
    }

    .orderTable {
        border: 1px solid #e8e8e8;
        .table-cell-btn {
            position: absolute;
            top: -2px;
            right: 14px;
        }
    }

    .input {
        display: flex;
        text-align: center;
    }

    .el-input__inner {
        text-align: center;
    }
}
</style>
