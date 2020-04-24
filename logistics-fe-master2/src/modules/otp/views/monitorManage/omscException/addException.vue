<template>
    <div>
        <el-dialog
            :title="dialogState ? '新增异常' : '编辑异常'"
            :visible.sync="dialogVisible"
            @close="resetForm"
            width="1200px">
            <div class="comp-container">
                <div class="order-info">订单信息</div>
                <el-form class="stock-adjust_detail_form" :rules="rules" ref="ruleForm" label-position="right" label-width="100px" :model="formData">
                    <el-row v-for="(row, index) in formRows" :key="index">
                        <el-col :span="col.span" v-for="col in row" :key="col.prop">
                            <el-form-item :label="col.label" :prop="!col.disabled ? col.prop : 'nothing'">
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
                                <template v-else-if="col.type==='noAdvance'">
                                    <el-input>
                                        <el-button slot="append" icon="el-icon-search" @click="showOrderDialog = true"></el-button>
                                    </el-input>
                                </template>
                                <template v-else-if="col.type==='time'">
                                    <el-date-picker
                                        style="width: 100%"
                                        v-model="formData[col.prop]"
                                        type="datetime"
                                        :placeholder="col.placeholder"
                                        default-time="23:59:59"
                                    ></el-date-picker>
                                </template>
                                <template v-else>
                                    <el-input v-model="formData[col.prop]" :disabled="col.disabled"></el-input>
                                </template>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
            <div slot="footer">
                <el-button type="text" @click="dialogVisible = false;">取消</el-button>
                <Throttle delay="500">
                    <el-button type="primary" @click="saveForm" :loading="btnLoading === true">保存</el-button>
                </Throttle>
            </div>
        </el-dialog>
        <advance-dialog ref="advanceDialog"></advance-dialog>
    </div>
</template>
<script>
import _ from '@/components/lots/utils';
import config from './addConfig';
import otpAdvance from '@/components/lots/otpAdvance';
import otpSelect from '@/components/lots/otpSelect';
import advanceDialog from '@/components/lots/otpAdvanceDialog';
import Throttle from '@/components/lots/debounce/Debounce';
import { dateTimes } from '../../../judge/configCenter';
import { addException, editException } from '../../../api/omscExeptionApi';
export default {
    components: { mSelect: otpSelect, otpAdvance, Throttle, advanceDialog },
    props: {
        form: {
            type: Object,
            default() {
                return {};
            }
        }
    },
    data() {
        return {
            showorderDialog: false,
            dialogState: true,
            goodsAdvanceConfig: config.goodsAdvanceConfig,
            dialogVisible: false,
            formRows: _.clone(config.formData),
            btnLoading: false,
            formData: {
                customerOrderNo: '',
                customerCode: '',
                customerCodeName: '',
                itemName: '',
                orderNo: '',
                customerName: '',
                appointmentTime: '',
                exceptionTime: '',
                exceptionDesc: '',
                companyName: '',
                deliveryType: '',
                exceptionType: '',
                checkStatus: 0,
                id: '',
                version: ''
            },
            rules: {
                orderNo: { required: true, message: '请选择订单号' },
                exceptionType: { required: true, message: '请选择异常类型' },
                itemName: { required: true, message: '请选择商品' }
            }
        };
    },
    methods: {
        async show(status = true, state = true) {
            this.dialogVisible = status;
            this.dialogState = state;
            this.resetForm();
        },
        showOrderDialog() {
            this.$refs.advanceDialog.show(true, this.goodsAdvanceConfig);
        },
        _updateProps(data) {
            // 做元素显示控制
            Object.assign(this.formData, data);
            if (data.appointmentTime) {
                this.formData.appointmentTime = dateTimes(this.formData.appointmentTime);
            }
        },
        _dataReset() {
            this.formRows = _.clone(config.formData);
            this.formData = {
                customerOrderNo: '',
                customerCode: '',
                customerCodeName: '',
                itemName: '',
                orderNo: '',
                customerName: '',
                appointmentTime: '',
                exceptionTime: '',
                exceptionDesc: '',
                companyName: '',
                deliveryType: '',
                exceptionType: '',
                checkStatus: 1,
                id: ''
            };
        },
        delRow(index) {
        },
        validate() {
            const formValidate = new Promise((resolve, reject) => {
                this.$refs['ruleForm'].validate((valid) => {
                    if (valid) {
                        resolve('success');
                    }
                });
            });
            return formValidate;
        },
        async saveForm() {
            await this.validate();
            this.btnLoading = true;
            if (this.dialogState) {
                const res = await addException(this.formData);
                if (res && res.code === '0') {
                    this.$message.success('添加成功');
                    this.dialogVisible = false;
                    this.$emit('success');
                }
            } else {
                const res = await editException(this.formData);
                if (res && res.code === '0') {
                    this.$message.success('修改成功');
                    this.dialogVisible = false;
                    this.$emit('success');
                }
            }
            this.btnLoading = false;
        },
        resetForm() {
            this.$refs['ruleForm'] && this.$refs['ruleForm'].resetFields();
        }
    },
    watch: {
        form: {
            handler(val) {
                if (val) {
                    for (const key in this.formData) {
                        if (this.formData.hasOwnProperty(key)) {
                            this.formData[key] = val[key];
                        }
                    }
                }
            },
            deep: true
        }
    }
};
</script>
<style lang="less" scoped>
.comp-container{
    .order-info{
        line-height: 36px;
        font-size: 16px;
        margin-left: 5px;
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