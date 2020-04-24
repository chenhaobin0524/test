<template>
    <div>
        <el-dialog
            :title="dialogTitle"
            :visible.sync="dialogVisible"
            @close="resetForm"
            width="1200px">
            <div class="comp-container">
                <div class="order-info">订单信息</div>
                <el-form class="stock-adjust_detail_form" :rules="rules" ref="ruleForm" label-position="right" label-width="100px" :model="formData">
                    <el-row v-for="(row, index) in formRows" :key="index">
                        <el-col :span="col.span" v-for="col in row" :key="col.prop">
                            <el-form-item :label="col.label" :prop="!col.disabled ? col.prop : 'nothing'" :class="{'view': onlyView}" v-if="!(col.prop === 'smallPiece' && onlyView)">
                                <span v-if="onlyView" style="color: #999;">
                                    {{formData | showName(col)}}
                                </span>
                                <template v-else>
                                    <template v-if="col.type === 'select'">
                                        <mSelect
                                            :disabled="col.disabled"
                                            :optionArr="col.options"
                                            :optionNum="col.optionNum"
                                            :prop="col.prop"
                                            :mValue="formData[col.prop]"
                                            @getSelectValue="_updateProps"></mSelect>
                                    </template>
                                    <template v-else-if="col.type==='advance'">
                                        <otpAdvance
                                            :params="col"
                                            @getAdvanceValue="_updateProps"
                                            :mValue="formData[col.prop]"
                                            :formData="formData"
                                        ></otpAdvance>
                                    </template>
                                    <template v-else-if="col.type==='checkbox'">
                                        <el-checkbox
                                            :disabled="col.disabled"
                                            v-model="formData.smallPiece"
                                            @change="_updateProps({smallPiece: formData.smallPiece})"
                                        ></el-checkbox>
                                    </template>
                                    <template v-else>
                                        <el-input v-model="formData[col.prop]" :disabled="col.disabled"></el-input>
                                    </template>
                                </template>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <div class="goods-info">
                    <span class="goods-info_label">商品信息</span>
                    <span class="goods-info_fr-btn" v-if="!onlyView">
                        <el-button type="primary" @click="addGoods">新增商品</el-button>
                    </span>
                </div>
                <el-table
                    :data="tableData"
                    border
                    style="width: 100%">
                    <el-table-column
                        align="center"
                        v-for="(header, index) in tableHeader"
                        :key="header.prop + index"
                        :prop="header.prop"
                        :label="header.label"
                        :width="header.width">
                        <template slot-scope="scope">
                            <span v-if="onlyView" style="color: #999;">
                                {{scope.row[header.prop]}}
                            </span>
                            <template v-else>
                                <template v-if="header.type === 'input'">
                                    <el-input v-model="scope.row[header.prop]" :disabled="header.disabled"></el-input>
                                </template>
                                <template v-else-if="header.type === 'number'">
                                    <el-input type="number" v-model="scope.row[header.prop]" :disabled="header.disabled"></el-input>
                                </template>
                                <template v-else>{{scope.row[header.prop]}}</template>
                            </template>
                        </template>
                    </el-table-column>
                    <el-table-column
                        v-if="!onlyView"
                        align="center"
                        label="操作"
                        width="80">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click="delRow(scope.$index)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div slot="footer">
                <el-button type="text" @click="dialogVisible = false;">取消</el-button>
                <el-button v-if="onlyView" type="primary" @click="dialogVisible = false;">确定</el-button>
                <Throttle delay="500" v-else>
                    <el-button type="primary" @click="saveForm" :loading="btnLoading === true">保存</el-button>
                </Throttle>
            </div>
        </el-dialog>
        <advance-dialog ref="advanceDialog" @confirm="detaliSearchSure"></advance-dialog>
    </div>
</template>
<script>
import _ from '@/components/lots/utils';
import config from './_detailDialogConfig';
import otpAdvance from '@/components/lots/otpAdvance';
import otpSelect from '@/components/lots/otpSelect';
import Throttle from '@/components/lots/debounce/Debounce';
import advanceDialog from '@/components/lots/otpAdvanceDialog';
import { adjustApplysEdit, adjustApplyById } from '../../../api/orderManage';
import { isInt } from '../../../judge/configCenter';
export default {
    components: { mSelect: otpSelect, otpAdvance, advanceDialog, Throttle },
    data() {
        return {
            dialogVisible: false,
            onlyView: false,
            tableData: [],
            deletedTableData: [],
            tableHeader: config.table.header,
            formRows: _.clone(config.formData),
            goodsAdvanceConfig: config.goodsAdvanceConfig,
            btnLoading: false,
            formData: {
                customerOrderNo: '',
                sourceSystem: '',
                adjustType: '',
                customerCode: '',
                customerCodeName: '',
                applyStatus: '10',
                itemStatusFrom: '',
                itemStatusTo: '',
                upperWhCodeFrom: '',
                upperWhCodeTo: '',
                whCode: '',
                whCodeName: '',
                adjustReason: '',
                adjustNo: '',
                remark: '',
                smallPiece: false
            },
            rules: {
                customerOrderNo: [
                    { required: true, message: '请输入客户订单号', trigger: 'blur' },
                    { max: 64, message: '长度不能超过64个字符', trigger: 'blur' }
                ],
                sourceSystem: { required: true, message: '请选择上游系统来源' },
                adjustType: { required: true, message: '请选择调整类型' },
                customerCodeName: { required: true, message: '请选择客户' },
                itemStatusFrom: { required: true, message: '请选择原商品状态' },
                itemStatusTo: { required: true, message: '请选择目标状态' },
                whCodeName: { required: true, message: '请选择仓库' },
                adjustReason: { required: true, message: '请选择调整原因' }
            },
            extendsRules: {
                itemStatusFrom: { required: true, message: '请选择原商品状态' },
                itemStatusTo: { required: true, message: '请选择目标状态' },
                adjustReason: { required: true, message: '请选择调整原因' }
            }
        };
    },
    methods: {
        // 编辑时根据当前表单的值设置表单控制
        updateOptionsFields() {
            // 编辑时禁用客户订单号
            this.formRows[0][0].disabled = true;
            const comps = ['adjustType', 'itemStatusFrom', 'itemStatusTo', 'adjustReason', 'smallPiece'].map(prop => {
                const comp = this.formRowsInline.find(item => item.prop === prop);
                return comp;
            });
            comps[1].disabled = comps[2].disabled = comps[3].disabled = comps[4].disabled = true;
            this.tableHeader.find(item => item.prop === 'planQty').disabled = false;
            this.tableHeader.find(item => item.prop === 'snCode').disabled = false;
            if (this.formData.sourceSystem === 'CAINIAO') {
                comps[0].optionNum = 'ADJUST_TYPE';
                if (['701', '702'].includes(this.formData.adjustType)) {
                    // 2、来源平台为菜鸟时，且调整类型是盘盈或者盘亏时，SN置灰，不需要填
                    this.tableHeader.find(item => item.prop === 'snCode').disabled = true;
                    comps[1].optionNum = 'O_ITEM_STATUS';
                    comps[1].disabled = false;
                } else if (['703'].includes(this.formData.adjustType)) {
                    comps[1].optionNum = comps[2].optionNum = 'O_ITEM_STATUS';
                    comps[1].disabled = comps[2].disabled = comps[4].disabled = false;
                    this.tableHeader.find(item => item.prop === 'planQty').disabled = true;
                }
            } else if (this.formData.sourceSystem === 'CCS') {
                comps[0].optionNum = 'ECM_ADJUST_TYPE';
                if (['703'].includes(this.formData.adjustType)) {
                    comps[1].optionNum = comps[2].optionNum = 'O_ITEM_STATUS';
                    comps[1].disabled = comps[2].disabled = false;
                    comps[3].optionNum = 'ADJUST_REASON';
                    comps[3].disabled = false;
                }
            } else if (this.formData.sourceSystem === 'ECM') {
                comps[0].optionNum = 'ECM_ADJUST_TYPE';
                if (['703'].includes(this.formData.adjustType)) {
                    comps[1].optionNum = comps[2].optionNum = 'ECM_ADJUST_STATUS';
                    comps[1].disabled = comps[2].disabled = false;
                    comps[3].optionNum = 'ADJUST_REASON';
                    comps[3].disabled = false;
                }
            } else if (this.formData.sourceSystem === 'PDD') {
                comps[0].optionNum = 'PDD_ADJUST_ORDERTYPE';
                if (['701', '702'].includes(this.formData.adjustType)) {
                    comps[1].optionNum = 'PDD_ADJUST_STATUS';
                    comps[1].disabled = false;
                    comps[3].optionNum = 'ADJUST_REASON_PDD';
                    comps[3].disabled = false;
                }
            }
            if (this.formData.smallPiece) {
                comps[1].optionNum = comps[2].optionNum = 'CN_ITEM_STATUS';
            }
        },
        async show(status = true, id, onlyView = false) {
            this._dataReset();
            if (id) {
                const { data } = await adjustApplyById(id);
                data.adjustApply.applyStatus += '';
                this.onlyView = onlyView;
                this.formData = { ...this.formData, ...data.adjustApply };
                this.formData.smallPiece = !!this.formData.smallPiece;
                this.tableData = data.details ? data.details.map(elm => {
                    elm.planQty = elm.planQty || 1;
                    return { ...elm, snCode: elm.snCode.trim() };
                }) : [];
                this.updateOptionsFields();
            } else {
                delete this.formRows[0][0].disabled;
            }
            this.dialogVisible = status;
            this.resetForm();
        },
        _dataReset() {
            this.formRows = _.clone(config.formData);
            this.onlyView = false;
            this.tableData = [];
            this.deletedTableData = [];
            this.formData = {
                customerOrderNo: '',
                sourceSystem: '',
                adjustType: '',
                customerCode: '',
                customerCodeName: '',
                applyStatus: '10',
                itemStatusFrom: '',
                itemStatusTo: '',
                upperWhCodeFrom: '',
                upperWhCodeTo: '',
                whCode: '',
                whCodeName: '',
                adjustReason: '',
                adjustNo: '',
                remark: '',
                smallPiece: false
            };
        },
        _updateProps(data) {
            // 做元素显示控制
            Object.assign(this.formData, data);
            this.validateDisabledProp(this.formData, data);
        },
        validateDisabledProp(formData, data) {
            // 简化判断逻辑
            // 1、上游系统来源修改，清空调整类型、原商品状态，目标状态、调整原因、小件
            // 2、调整类型修改，清空原商品状态，目标状态、调整原因、小件
            if (Reflect.has(data, 'sourceSystem')) {
                const comps = ['adjustType', 'itemStatusFrom', 'itemStatusTo', 'adjustReason', 'smallPiece'].map(prop => {
                    // 清空调整类型、原商品状态，目标状态、调整原因、小件，并返回相应的配置项
                    if (prop === 'smallPiece') {
                        formData[prop] = false;
                    } else {
                        formData[prop] = null;
                    }
                    const comp = this.formRowsInline.find(item => item.prop === prop);
                    return comp;
                });
                comps[1].optionNum = comps[2].optionNum = 'O_ITEM_STATUS';
                comps[1].disabled = comps[2].disabled = comps[3].disabled = comps[4].disabled = true;
                if (formData.sourceSystem === 'CAINIAO') {
                    comps[0].optionNum = 'ADJUST_TYPE';
                } else if (formData.sourceSystem === 'CCS') {
                    comps[0].optionNum = 'ECM_ADJUST_TYPE';
                } else if (formData.sourceSystem === 'ECM') {
                    comps[0].optionNum = 'ECM_ADJUST_TYPE';
                } else if (formData.sourceSystem === 'PDD') {
                    comps[0].optionNum = 'PDD_ADJUST_ORDERTYPE';
                }
            } else if (Reflect.has(data, 'adjustType')) {
                // 清空原商品状态，目标状态、调整原因、小件，并返回相应的配置项
                const comps = ['itemStatusFrom', 'itemStatusTo', 'adjustReason', 'smallPiece'].map(prop => {
                    // 清空调整类型、原商品状态，目标状态、调整原因、小件，并返回相应的配置项
                    if (prop === 'smallPiece') {
                        formData[prop] = false;
                    } else {
                        formData[prop] = null;
                    }
                    const comp = this.formRowsInline.find(item => item.prop === prop);
                    return comp;
                });
                // 每次修改调整类型就做状态的初始化
                comps[0].optionNum = comps[1].optionNum = 'O_ITEM_STATUS';
                comps[0].disabled = comps[1].disabled = comps[2].disabled = comps[3].disabled = true;
                this.tableHeader.find(item => item.prop === 'planQty').disabled = false;
                this.tableHeader.find(item => item.prop === 'snCode').disabled = false;

                if (formData.sourceSystem === 'CAINIAO') {
                    if (['701', '702'].includes(formData.adjustType)) {
                        // 2、来源平台为菜鸟时，且调整类型是盘盈或者盘亏时，SN置灰，不需要填
                        this.tableHeader.find(item => item.prop === 'snCode').disabled = true;
                        this.tableData.forEach(item => {
                            item.snCode = '';
                        });
                        comps[0].optionNum = 'O_ITEM_STATUS';
                        comps[0].disabled = false;
                    } else if (['703'].includes(formData.adjustType)) {
                        // comps[0].optionNum = comps[1].optionNum = 'O_ITEM_STATUS';
                        comps[0].disabled = comps[1].disabled = comps[3].disabled = false;
                        this.tableData.forEach(item => {
                            item.planQty = 1;
                        });
                        this.tableHeader.find(item => item.prop === 'planQty').disabled = true;
                    }
                } else if (formData.sourceSystem === 'CCS') {
                    if (['703'].includes(formData.adjustType)) {
                        comps[0].optionNum = comps[1].optionNum = 'O_ITEM_STATUS';
                        comps[0].disabled = comps[1].disabled = false;
                        comps[2].optionNum = 'ADJUST_REASON';
                        comps[2].disabled = false;
                    }
                } else if (formData.sourceSystem === 'ECM') {
                    if (['703'].includes(formData.adjustType)) {
                        comps[0].optionNum = comps[1].optionNum = 'ECM_ADJUST_STATUS';
                        comps[0].disabled = comps[1].disabled = false;
                        comps[2].optionNum = 'ADJUST_REASON';
                        comps[2].disabled = false;
                    }
                } else if (formData.sourceSystem === 'PDD') {
                    if (['701', '702'].includes(formData.adjustType)) {
                        comps[0].optionNum = 'PDD_ADJUST_STATUS';
                        comps[0].disabled = false;
                        comps[2].optionNum = 'ADJUST_REASON_PDD';
                        comps[2].disabled = false;
                    }
                }
            } else if (Reflect.has(data, 'smallPiece')) {
                const optionNum = data.smallPiece ? 'CN_ITEM_STATUS' : 'O_ITEM_STATUS';
                // 清空原商品状态、目标状态，并修改对应数字字典值
                ['itemStatusFrom', 'itemStatusTo'].forEach(prop => {
                    formData[prop] = null;
                    this.formRowsInline.find(item => item.prop === prop).optionNum = optionNum;
                });
                this.tableHeader.find(item => item.prop === 'planQty').disabled = !data.smallPiece;
            }
        },
        addGoods() {
            this.$refs.advanceDialog.show(true, this.goodsAdvanceConfig, {});
        },
        delRow(index) {
            // 只把存在id的数据放到deletedTableData数组中
            const delRow = this.tableData.splice(index, 1);
            if (delRow[0] && delRow[0].id) {
                this.deletedTableData.push(delRow[0]);
            }
        },
        _validateTableData() {
            const result = {
                status: true
            };
            const tableData = this.tableData;
            if (tableData.length === 0) {
                result.status = false;
                result.msg = '请新增商品信息';
            } else {
                for (const row of tableData) {
                    if (!row.planQty) {
                        result.status = false;
                        result.msg = '请补全计划数量';
                        break;
                    } else if (!this.formData.smallPiece && this.formData.sourceSystem === 'CAINIAO' && ['703'].includes(this.formData.adjustType) && !row.snCode) {
                        // 来源平台为菜鸟时，申请类型为状态调整时，SN必填;其他情况都非必填
                        result.status = false;
                        result.msg = '请补全商品SN';
                        break;
                    } else if (!isInt(row.planQty)) {
                        result.status = false;
                        result.msg = '计划数量必须为整数';
                        break;
                    } else if (row.planQty.length > 9) {
                        result.status = false;
                        result.msg = '计划数量数值过大';
                        break;
                    }
                    // if (!row.planQty) {
                    //     result.status = false;
                    //     result.msg = '请补全计划数量';
                    //     break;
                    // } else if (this.formData.sourceSystem === 'CAINIAO' && ['703'].includes(this.formData.adjustType) && !row.snCode) {
                    //     // 来源平台为菜鸟时，申请类型为状态调整时，SN必填;其他情况都非必填
                    //     result.status = false;
                    //     result.msg = '请补全商品SN';
                    //     break;
                    // } else if (!isInt(row.planQty)) {
                    //     result.status = false;
                    //     result.msg = '计划数量必须为整数';
                    //     break;
                    // } else if (row.planQty.length > 9) {
                    //     result.status = false;
                    //     result.msg = '计划数量数值过大';
                    //     break;
                    // }
                }
            }
            return result;
        },
        validate() {
            const formValidate = new Promise((resolve, reject) => {
                this.$refs['ruleForm'].validate((valid) => {
                    if (valid) {
                        const result = this._validateTableData();
                        if (result.status) {
                            resolve('success');
                        } else {
                            this.$message.warning(result.msg);
                        }
                    }
                });
            });
            return formValidate;
        },
        async saveForm() {
            await this.validate();
            this.btnLoading = true;
            const deleteItems = this.deletedTableData;
            const insertItems = this.tableData.filter(item => !item.id);
            const updateItems = this.tableData.filter(item => item.id);
            const params = {
                ...this.formData,
                insertItems,
                updateItems,
                deleteItems
            };
            params.smallPiece = params.smallPiece ? 1 : 0;
            const res = await adjustApplysEdit(params);
            if (res && res.code === '0') {
                this.$message.success('添加成功');
                this.dialogVisible = false;
                this.$emit('success');
            }
            this.btnLoading = false;
        },
        detaliSearchSure(data) {
            // 如果未选中，或者多次选中同一商品，则不处理(放开，by lj)
            // if (!data.customerItemCode || (this.tableData.length > 0 && this.tableData.find(item => item.customerItemCode === data.customerItemCode))) return;
            const origin = {
                itemName: '',
                customerItemCode: '',
                planQty: 1,
                actQty: '',
                snCode: '',
                updateTime: ''
            };
            if (this.formData.smallPiece) {
                origin.planQty = '';
            }
            const row = Object.assign(origin, data);
            this.tableData.push(row);
        },
        resetForm() {
            this.$refs['ruleForm'] && this.$refs['ruleForm'].resetFields();
        }
    },
    filters: {
        showName(data, col) {
            var value = data[col.prop + 'Name'] || data[col.prop];
            return value;
        }
    },
    computed: {
        formRowsInline() {
            return this.formRows.reduce((result, row) => {
                return result.concat(row);
            }, []);
        },
        dialogTitle() {
            return this.onlyView ? '查看库存调整申请' : '编辑库存调整申请';
        }
    }
};
</script>
<style lang="less" scoped>
.comp-container{
    .order-info{
        line-height: 36px;
        font-size: 16px;
        margin-left: 25px;
    }
    .goods-info{
        // margin-top: 20px;
        .goods-info_label {
            display: inline-block;
            width: 120px;
            line-height: 50px;
            color: #00BCBF;
            border-bottom: 2px solid;
            text-align: center;
        }
        .goods-info_fr-btn{
            float: right;
        }
    }
    /deep/.el-input__inner {
        height: 28px !important;
    }
}
</style>
<style lang="less">
.comp-container{
    .stock-adjust_detail_form {
        .el-form-item{
            margin-bottom: 15px;
            &.view {
                margin-bottom: 0;
            }
        }
        .el-form-item__content {
            .el-input-group {
                vertical-align: middle;
            }
        }
    }
    .el-table {
        .cell {
            >.el-input {
                overflow: initial;
            }
        }
    }
}
</style>