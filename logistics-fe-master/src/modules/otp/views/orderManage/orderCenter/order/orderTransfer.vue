<template>
    <div class="user-authority-wrapper">
        <div class="alterable">
            <el-dialog width="1250px" style="margin-top: -10vh;" title='商品选择'
                       :visible.sync="dialog.visible" @close="closeAdd">
                <div class="addWhite">
                    <div class='my-table3'>
                        <div class="row2">
                             <div class='select'>
                                 <el-select v-model="item" placeholder="请选择">
                                    <el-option value="itemName" label="商品名称"></el-option>
                                    <el-option value="itemCode" label="商品编码"></el-option>
                                    <el-option value="customerItemCode" label="客户商品编码"></el-option>
                                </el-select>
                             </div>
                            <el-input class="input" v-model='dialog.leftSelectValue'
                                      placeholder='请输入搜索条件'></el-input>
                            <el-button type='primary' size="small" @click="getList">查询</el-button>
                        </div>
                        <el-table
                            ref="multipleTable"
                            v-loading="dialog.leftLoading"
                            border
                            stripe
                            :data='dialog.leftList'
                            @select-all='select_all'
                            @select='select'
                            @selection-change="handleSelectionChange"
                            @row-click="rowClick"
                        >
                            <el-table-column prop="cdcmMaterialNo" width="100" label="商品编号">
                            </el-table-column>
                            <el-table-column prop="cdcmCustMaterialNo" width="130" label="客户商品编码">
                            </el-table-column>
                            <el-table-column prop="cdcmNameCn" width="260" show-overflow-tooltip label="商品名称">
                            </el-table-column>
                            <el-table-column type="selection" width="50" label='操作'>
                            </el-table-column>
                        </el-table>
                        <div class='my-pagination table-pagination'>
                            <el-pagination
                                @size-change="leftSizeChange"
                                :current-page.sync='dialog.leftCurrentPage'
                                @current-change="leftCurrentChange"
                                :page-sizes="[10, 20, 50]"
                                :page-size='10'
                                :pager-count='5'
                                layout='total, sizes, prev, pager, next'
                                :total='dialog.leftTotal'
                            ></el-pagination>
                        </div>
                    </div>
                    <div class='my-table4'>
                        <div class="row2 table4">
                            <!-- <div class='select'>
                                 <el-select v-model="value" disabled placeholder="请选择">
                                    <el-option value="itemName" label="商品名称"></el-option>
                                    <el-option value="itemCode" label="商品编码"></el-option>
                                </el-select>
                             </div> -->
                            <!-- <el-input disabled class="input" v-model='dialog.rightSelectValue'
                                      placeholder='请输入编码'></el-input>
                            <el-button disabled type='primary' size="small">查询</el-button> -->
                        </div>
                        <el-table stripe :data='dialog.rightList'>
                            <el-table-column prop="cdcmMaterialNo" width="100" label="商品编号">
                            </el-table-column>
                            <el-table-column prop="cdcmCustMaterialNo" width="135" label="客户商品编码">
                            </el-table-column>
                            <el-table-column prop="cdcmNameCn" show-overflow-tooltip width="120" label="商品名称">
                            </el-table-column>
                            <el-table-column width="70" prop="goodsQuant" label="数量">
                                <template slot-scope="scope">
                                    <input type="text" class="goodsQuant"
                                        v-model="scope.row.goodsQuant"
                                        onkeyup="this.value=this.value.replace(/\D/g,'')"
                                        onafterpaste="this.value=this.value.replace(/\D/g,'')"
                                        @input="changer(scope.row)">
                                </template>
                            </el-table-column>
                            <el-table-column width="100" label="状态">
                                <template slot-scope="scope" prop="stateName">
                                    <div class="inline_block" style="font-size: 12px; width: 80px;">
                                        <otpSelect :optionNum="'O_ITEM_STATUS'"
                                                @getSelectValue="getSelectValue"
                                                @change="changer(scope.row)"
                                                :filterable="true"
                                                :mValue="'Y'"
                                                :prop="'stateCode'">
                                        </otpSelect>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column fixed='right' label='操作'>
                                <template slot-scope='scope'>
                                    <el-button @click='delDialogSelect(scope.row)' type='text'
                                               size='mini'>删除
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
                <span slot='footer' class='dialog-footer'>
                    <el-button @click='closeAdd()'>取 消</el-button>
                    <el-button type='primary' @click="saveDialog()">确 定</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>
<script>
import { getSearchByMaterial } from '../../../../api/orderCenter';
import otpSelect from '@/components/lots/otpSelect';

export default {
    components: { otpSelect },
    mounted() {
    },
    data() {
        return {
            leftListLength: 0,
            leftLists: [],
            currentPage: 1,
            pageSize: 10,
            searchParams: {
                pageNo: 1,
                pageSize: 10
            },
            dialog: {
                stateCode: '',
                stateName: '',
                goodsQuant: 0,
                visible: false,
                checked: false,
                leftSelectValue: '',
                rightSelectValue: '',
                leftLoading: false,
                leftPageSize: 10,
                leftCurrentPage: 1,
                leftTotal: 0,
                rightList: [],
                leftList: []
            },
            multipleSelection: [],
            goodsQuants: '',
            item: 'itemName'
        };
    },
    created() {
    },
    methods: {
        // 基础数据下拉
        getSelectValue(data, label) {
            // data为一个对象（key是传入的prop，value是选择后的options的value），label为选中项的label
            if (!data) {
                data = { stateCode: 'Y' };
                label = '正品';
            }
            this.dialog.stateCode = { ...this.dialog.stateCode, ...data };
            this.dialog.stateName = label;
        },
        // 查询
        async getList() {
            if (this.item === 'itemName') {
                this.searchParams.cdcmNameCn = this.dialog.leftSelectValue;
                delete this.searchParams.cdcmMaterialNo;
                delete this.searchParams.cdcmCustMaterialNo;
            } else if (this.item === 'itemCode') {
                this.searchParams.cdcmMaterialNo = this.dialog.leftSelectValue;
                delete this.searchParams.cdcmNameCn;
                delete this.searchParams.cdcmCustMaterialNo;
            } else if (this.item === 'customerItemCode') {
                this.searchParams.cdcmCustMaterialNo = this.dialog.leftSelectValue;
                delete this.searchParams.cdcmNameCn;
                delete this.searchParams.cdcmMaterialNo;
            }
            const res = await getSearchByMaterial(this.searchParams);
            if (res.code === '0') {
                this.dialog.leftList = res.data.list || [];
                this.leftLists = res.data.list || [];
                this.dialog.leftTotal = res.data.totalCount;
                this.getSelectValue();
            }
        },
        // 取消
        closeAdd() {
            this.dialog.visible = false;
            this.dialog.leftSelectValue = '';
            this.dialog.rightSelectValue = '';
            this.dialog.leftCurrentPage = 1;
            this.dialog.leftPageSize = 10;
            this.dialog.leftTotal = 0;
            this.dialog.rightList = [];
            this.dialog.stateName = '';
            this.dialog.stateCode = '';
            // 关闭多选框
            for (var i = 0; i < this.dialog.leftList.length; i++) {
                this.$refs.multipleTable.toggleRowSelection(this.dialog.leftList[i], false);
                this.dialog.leftList[i].goodsQuant = '';
            }
        },
        // 底栏方法
        leftSizeChange(val) {
            this.searchParams.pageSize = val;
            this.getList(this.searchParams);
        },
        leftCurrentChange(val) {
            this.searchParams.pageNo = val;
            this.getList(this.searchParams);
        },
        // 确定按钮
        saveDialog() {
            const list = {};
            const rightList = this.dialog.rightList;
            const rightListGog = [];
            for (let i = 0; i < rightList.length; i++) {
                if (!rightList[i].goodsQuant) {
                    this.$message.error('请输入【数量】！');
                    return;
                }
                if (!rightList[i].stateName) {
                    this.$message.error('请输入【商品状态】！');
                    return;
                }
                list[i] = {
                    itemCode: rightList[i].cdcmMaterialNo ? rightList[i].cdcmMaterialNo : '',
                    itemName: rightList[i].cdcmNameCn ? rightList[i].cdcmNameCn : '',
                    itemClass: rightList[i].cdcmTypeCode ? rightList[i].cdcmTypeCode : '',
                    itemSize: rightList[i].cdcmSizeIdentification ? rightList[i].cdcmSizeIdentification : '',
                    grossWeight: rightList[i].cdcmWeight ? rightList[i].cdcmWeight : '',
                    netWeight: rightList[i].cdcmNetWeight ? rightList[i].cdcmNetWeight : '',
                    volume: rightList[i].cdcmCube ? rightList[i].cdcmCube : '',
                    barcode69: rightList[i].cdcmBarcode69 ? rightList[i].cdcmBarcode69 : '',
                    customerItemCode: rightList[i].cdcmCustMaterialNo ? rightList[i].cdcmCustMaterialNo : '',
                    unit: rightList[i].cdcmPackageUnitName ? rightList[i].cdcmPackageUnitName : '',
                    materialGroup1: rightList[i].cdcmMaterialGroup1 ? rightList[i].cdcmMaterialGroup1 : '',
                    materialGroup2: rightList[i].cdcmMaterialGroup2 ? rightList[i].cdcmMaterialGroup2 : '',
                    materialGroup3: rightList[i].cdcmMaterialGroup3 ? rightList[i].cdcmMaterialGroup3 : '',
                    materialGroup4: rightList[i].cdcmMaterialGroup4 ? rightList[i].cdcmMaterialGroup4 : '',
                    materialGroup5: rightList[i].cdcmMaterialGroup5 ? rightList[i].cdcmMaterialGroup5 : '',
                    planQty: rightList[i].goodsQuant ? rightList[i].goodsQuant : '',
                    itemStatusName: rightList[i].stateName ? rightList[i].stateName : '',
                    itemStatus: rightList[i].stateCode.stateCode ? rightList[i].stateCode.stateCode : '',
                    isParent: rightList[i].cdcmIsParent === 'Y' ? 1 : 0,
                    price: 0,
                    itemSuiteCode: ''
                };
                rightListGog.push(list[i]);
            }
            this.$emit('rightList', rightListGog);
            this.dialog.visible = false;
        },
        // 全选穿梭框
        select_all(selection, row) {
            if (selection.length === 0) {
                for (var k = 0; k < this.oldSelection.length; k++) {
                    for (var j = 0; j < this.dialog.rightList.length; j++) {
                        if (this.dialog.rightList[j].id === this.oldSelection[k].id) {
                            this.dialog.rightList.splice(j, 1);
                            break;
                        }
                    }
                }
                this.oldSelection = [];
            } else {
                this.oldSelection = selection.slice();
            }
            var ret = true;
            var length = 0;
            length = this.dialog.rightList.length;
            for (var i = 0; i < selection.length; i++) {
                for (j = 0; j < length; j++) {
                    if (this.dialog.rightList[j].id === selection[i].id) {
                        ret = false;
                    }
                }
                // 选中返回数据在 this.dialog.rightList 数组中
                if (ret) {
                    this.dialog.rightList.push(selection[i]);
                }
            }
        },
        // 单选穿梭框
        select(selection, row) {
            for (var i = 0; i < this.dialog.rightList.length; i++) {
                if (this.dialog.rightList[i].cdcmMaterialNo === row.cdcmMaterialNo) {
                    this.dialog.rightList.splice(i, 1);
                    return;
                }
            }
            // 选中返回数据在 this.dialog.rightList 数组中
            this.dialog.rightList.push(row);
        },
        changer(row) {
            const stateName = this.dialog.stateName;
            const stateCode = this.dialog.stateCode;
            for (var i = 0; i < this.dialog.rightList.length; i++) {
                if (this.dialog.rightList[i].cdcmMaterialNo === row.cdcmMaterialNo) {
                    this.dialog.rightList[i].goodsQuant = row.goodsQuant;
                    this.dialog.rightList[i].stateName = stateName;
                    this.dialog.rightList[i].stateCode = stateCode;
                }
            }
        },
        // 单击事件
        rowClick(row) {
            this.$refs.multipleTable.toggleRowSelection(row, true);
            for (var i = 0; i < this.dialog.rightList.length; i++) {
                if (this.dialog.rightList[i].cdcmMaterialNo === row.cdcmMaterialNo) {
                    this.dialog.rightList.splice(i, 1);
                    this.$refs.multipleTable.toggleRowSelection(row, false);
                    return;
                }
            }
            this.dialog.rightList.push(row);
        },
        // 打开弹窗
        Add() {
            // 查询制空
            this.searchParams.pageNo = 1;
            this.searchParams.pageSize = 10;
            this.searchParams.cdcmNameCn = '';
            this.getList(this.searchParams);
            this.dialog.visible = true;
        },
        // 行内删除事件
        delDialogSelect(row) {
            for (let i = 0; i < this.dialog.leftList.length; i++) {
                if (this.dialog.leftList[i].cdcmMaterialNo === row.cdcmMaterialNo) {
                    this.$refs.multipleTable.toggleRowSelection(this.dialog.leftList[i], false);
                }
            }
            for (let i = 0; i < this.dialog.rightList.length; i++) {
                if (this.dialog.rightList[i].cdcmMaterialNo === row.cdcmMaterialNo) {
                    row.goodsQuant = '';
                    this.dialog.rightList.splice(i, 1);
                }
            }
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
            this.multipleSelection = val.map(item => item.cdcmMaterialNo);
        }
    }
};
</script>
<style lang="less">
    .user-authority-wrapper {
        height: 100%;
        display: flex;
        flex-direction: column;
        .my-pagination{
            margin-top: 10px;
        }

         .table-pagination{
            padding: 0;
            float: left;
            .btn-prev, .btn-next, .el-pager li {
                background-color: #ffffff !important;
                border: 1px solid #cccccc;
                border-radius: 4px !important;
                margin-right: 4px;
            }
            .el-pager li.active + li {
                border-left: 1px solid #cccccc;
            }
            .el-pager li:not(.disabled).active{
                background-color: #00BCBF !important;
                border: 1px solid #00BCBF;
                color: #fff;
            }
        }

        .goodsQuant {
            text-align: center;
            width: 45px;
            height: 25px;
            line-height: 25px;
            border-radius: 5px;
            border: 1px solid #CECECE;
            outline: none;
            padding-left:5px;
        }
        .select{
            margin-left: 15px;
        }
       .table4{
           margin-top: 32px;
       }

        .input .el-input__inner {
            width: 100%;
        }

        .el-pagination .el-input__suffix {
            right: 25px;
        }

        .panel-group {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;

            .raido-group {
                margin-left: 10px;

                .el-radio-button {
                    .el-radio-button__inner {
                        width: 120px;
                    }
                }
            }

            .user-info {
                span {
                    margin-right: 30px;
                }
            }

            .select-group {
                display: flex;
                justify-content: flex-end;

                .select-input {
                    margin: 0 20px;
                    width: 200px;
                }
            }
        }
        .alterable {
            flex: 1;
            overflow: hidden;

            .role-authority {
                height: 100%;
                display: flex;
                flex-direction: column;

                .role-table {
                    flex: 1;
                    overflow: auto;
                }

                .text-right {
                    text-align: right;
                }
            }

            .data-authority {
                height: 100%;
            }

            .resource-authority {
                height: 100%;
            }

            .addWhite {
                display: flex;
                flex-direction: row;
                padding-bottom: 20px;
                align-items: flex-start;
                justify-content: center;
                border-top: 1px solid #DBDBDB;
                border-bottom: 1px solid #DBDBDB;
                border-right: 1px solid #DBDBDB;
                border-left: 1px solid #DBDBDB;

                .my-table3 {
                    width: 580px;
                    padding-top: 20px;
                    border-right: 1px solid #DBDBDB;
                    // padding-right: 10px;
                    padding-left: 10px;

                    .row {
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        justify-content: space-between;
                        padding-right: 20px;
                        padding-bottom: 5px;
                    }

                    .row2 {
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        padding-bottom: 5px;
                        padding-right: 30px;

                        .input {
                            padding-right: 10px;
                        }

                        .select {
                            padding-right: 10px;
                            width: 250px;
                        }
                    }
                }

                .my-table4 {
                    width: 690px;
                    padding-top: 20px;
                    padding-right: 10px;
                    padding-left: 10px;

                    .row {
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        justify-content: space-between;
                        padding-right: 20px;
                        padding-bottom: 5px;
                    }

                    .row2 {
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        padding-bottom: 5px;

                        .input {
                            padding-right: 10px;
                        }

                        .select {
                            padding-right: 10px;
                            width: 250px;
                        }
                    }
                }
            }
        }

        .user-authority-wrapper {
            height: 80%;
            overflow-y: hidden;
        }
    }
</style>
