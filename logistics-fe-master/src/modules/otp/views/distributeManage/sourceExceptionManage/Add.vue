<template>
    <div class="source-exception-add">
        <el-dialog
            class="source-exception-add-dialog"
            :title="titleName"
            :close-on-click-modal="false"
            width="32%"
            :visible.sync="visiableDialog"
            :before-close="handleClose">
            <el-form
                ref="formDialog"
                :model="formData"
                :rules="rules"
                label-width="130px"
                :inline="false">
                <el-form-item label="异常类型：" prop="distributionOrCliam">
                    <selects
                        :disabled="type === 'edit'"
                        :mValue="formData.distributionOrCliam"
                        :optionNum="'distribution_or_cliam'"
                        :prop="'distributionOrCliam'"
                        @getSelectValue="getDistributionOrCliam"
                    ></selects>
                </el-form-item>
                <el-form-item class="methods">
                    <el-select class="methods-option" size="small" v-model="addMethod" placeholder="请选择"
                        @change="methodsChange">
                        <el-option
                            v-for="item in methodsOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                    <div id="methods-option">
                        <el-input clearable @blur="addMethodBlur"
                            v-model.trim="formData[addMethod]" size="medium">
                        </el-input>
                    </div>
                </el-form-item>
                <el-form-item label="一级异常类型：" prop="tmsExceptionType1"
                    v-if="formData.distributionOrCliam === tenStr">
                    <selects
                        clearable
                        :mValue="formData.tmsExceptionType1"
                        :optionNum="'tms_exception_type1'"
                        :prop="'tmsExceptionType1'"
                        @getSelectValue="getTmsExceptionTypeOne"
                    ></selects>
                </el-form-item>
                <el-form-item label="二级异常类型：" prop="tmsExceptionType2"
                    v-if="formData.distributionOrCliam === tenStr">
                    <el-select class="methods" v-model="formData.tmsExceptionType2" placeholder="请选择">
                        <el-option v-for="(label, key) in tmsExceptionTypeTwos" :label="label" :value="key" :key="key"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="异常描述：" prop="abnormal"
                    v-if="formData.distributionOrCliam === tenStr">
                    <el-input type="textarea" clearable
                        v-model.trim="formData.abnormal" size="medium">
                    </el-input>
                </el-form-item>
                <el-form-item label="承运商：" prop="carrier" v-model="formData.carrier"
                    v-if="formData.distributionOrCliam === twentyStr">
                    <otpAdvance
                        :disabled="true"
                        :formData="formData"
                        @clear="clearClick(formData.carrier)"
                        :prop="'carrier'" :mValue="formData.carrier"
                        :params="carrierParams"
                        @getAdvanceValue="getCarriervalue">
                    </otpAdvance>
                </el-form-item>
                <el-form-item
                    label="司机："
                    prop="primaryDriver"
                    v-model="formData.primaryDriver"
                    v-if="formData.distributionOrCliam === twentyStr">
                    <otpAdvance :disabled="true" :formData="formData" :mValue="formData.primaryDriver" :prop="'primaryDriver'" @getAdvanceValue="getDriverValue" :params="driverParams"></otpAdvance>
                </el-form-item>
                <el-form-item label="费用类型：" prop="costType"
                    v-if="formData.distributionOrCliam === twentyStr">
                    <selects
                        clearable
                        :mValue="formData.costType"
                        :optionNum="'cost_type'"
                        :prop="'costType'"
                        @getSelectValue="getCostType"
                    ></selects>
                </el-form-item>
                <el-form-item label="费用：" prop="settlementCost"
                    v-if="formData.distributionOrCliam === twentyStr">
                    <el-input clearable
                        v-model.trim="formData.settlementCost" size="medium">
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button class="dialog-btn" @click="handleClose">取 消</el-button>
                <el-button class="dialog-cel" type="primary" @click="saveOk" :loading="loading">保 存</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import selects from '@/components/lots/otpSelect';
import otpAdvance from '@/components/lots/otpAdvance';
import { add, edit, findCarrierAndDriver } from '../../../api/sourceExceptionManage';
import { mapState } from 'vuex';
export default {
    components: { selects, otpAdvance },
    props: {
        visiableDialog: {
            type: Boolean,
            default: false
        },
        labelPosition: {
            type: String,
            default: 'right'
        },
        data: {
            type: Object,
            default() {
                return {};
            }
        },
        titleName: {
            type: String,
            default: ''
        },
        type: {
            type: String,
            default: 'add'
        }
    },
    data() {
        return {
            tenStr: '10',
            twentyStr: '20',
            addMethod: 'taskNo',
            loading: false,
            formData: {
                distributionOrCliam: '10',
                // dispatchNo: '',
                taskNo: '',
                customerOrderNumber: '',
                tmsExceptionType1: '',
                tmsExceptionType2: '',
                abnormal: '',
                primaryDriver: '',
                costType: '',
                settlementCost: '',
                carrier: ''
            },
            carrierParams: {
                name: '请输入承运商',
                advanceLabel: '承运商',
                value: 'carrierName',
                advanceConfig: [
                    { prop: 'suppliersNameCn', value: '承运商名称' },
                    { prop: 'suppliersCode', value: '承运商编码' },
                    { prop: 'tranName', value: '采购渠道' }
                ],
                tableConfig: [
                    { prop: 'suppliersNameCn', value: '承运商名称' },
                    { prop: 'suppliersCode', value: '承运商编码' },
                    { prop: 'tranName', value: '采购渠道' }
                ],
                advanceUrl: 'ebSupplier/searchBySupplier',
                cbParams: [
                    'suppliersNameCn#carrierName', 'suppliersCode#carrierCode', 'transType', 'tranName'
                ],
                advanceCascade: 'suppliersCode#carrierCode'
            },
            driverParams: {
                'name': '请输入司机',
                'advanceLabel': '司机',
                'value': 'driver',
                'advanceConfig': [
                    { 'prop': 'name', 'value': '司机' },
                    { 'prop': 'encuMobile', 'value': '电话' }

                ],
                'tableConfig': [
                    { 'prop': 'name', 'value': '司机' },
                    { 'prop': 'encuMobile', 'value': '电话' }
                ],
                'advanceUrl': 'suDriver/searchByConditions',
                'cbParams': [
                    'name#driver', 'encuMobile#driverContactWay', 'cardId#driverIdentity', 'suppliersCode'
                ],
                'advanceCascade': 'carrierCode#suppliersCode'
            },
            rules: {
                distributionOrCliam: [
                    { required: true, message: '异常类型不能为空', trigger: ['blur', 'change'] }
                ],
                tmsExceptionType1: [
                    { required: true, message: 'TMS一级异常类型不能为空', trigger: ['blur', 'change'] }
                ],
                // tmsExceptionType2: [
                //     { required: true, message: 'TMS二级异常类型不能为空', trigger: ['blur', 'change'] }
                // ],
                abnormal: [
                    { required: true, message: '异常原因不能为空', trigger: ['blur', 'change'] }
                ],
                // carrier: [
                //     { required: true, message: '承运商不能为空', trigger: ['blur', 'change'] }
                // ],
                // primaryDriver: [
                //     { required: true, message: '司机不能为空', trigger: ['blur', 'change'] }
                // ],
                costType: [
                    { required: true, message: '费用类型不能为空', trigger: ['blur', 'change'] }
                ],
                settlementCost: [
                    { required: true, message: '费用不能为空', trigger: ['blur', 'change'] }
                ],
                // dispatchNo: [
                //     { required: true, message: '发车单不能为空', trigger: ['blur', 'change'] }
                // ],
                taskNo: [
                    { required: true, message: '运输单不能为空', trigger: ['blur', 'change'] }
                ],
                customerOrderNumber: [
                    { required: true, message: '客户订单号不能为空', trigger: ['blur', 'change'] }
                ]
            },
            fieldList: [],
            methodsOptions: [
                // { value: 'dispatchNo', label: '按发车单' },
                { value: 'taskNo', label: '按运输单' },
                { value: 'customerOrderNumber', label: '按客户订单号' }
            ],
            tmsExceptionTypeTwos: [],
            tmsExceptionTypeTwoIsBack: window.sessionStorage.tms_exception_type2 ? JSON.parse(window.sessionStorage.tms_exception_type2) : []
        };
    },
    methods: {
        handleClose() {
            this.$emit('handleClose');
        },
        saveOk() {
            this.$refs['formDialog'].validate((valid) => {
                if (valid) {
                    let addMethodName = '';
                    this.methodsOptions.forEach(item => {
                        if (this.addMethod === item.value) {
                            addMethodName = item.label;
                        };
                    });
                    if (!this.formData[this.addMethod]) return this.$message.warning(`${addMethodName}新建内容不能为空`);
                    this.formData.informant = this.user.userName;
                    this.loading = true;
                    if (this.type === 'add') {
                        if (+this.formData.distributionOrCliam === 10) {
                            this.formData.primaryDriver =
                            this.formData.carrier =
                            this.formData.costType =
                            this.formData.settlementCost = '';
                        } else if (+this.formData.distributionOrCliam === 20) {
                            this.formData.tmsExceptionType1 =
                            this.formData.tmsExceptionType2 =
                            this.formData.abnormal = '';
                        }
                        add(this.formData).then(res => {
                            this.loading = false;
                            if (res && res.code === '0') {
                                this.$message.success('新增成功');
                                this.$emit('saveOk');
                            }
                        }).catch(() => {
                            this.loading = false;
                        });
                    } else if (this.type === 'edit') {
                        const params = {
                            ...this.formData,
                            id: this.data.id
                        };
                        edit(params).then(res => {
                            this.loading = false;
                            if (res && res.code === '0') {
                                this.$message.success('修改成功');
                                this.$emit('saveOk');
                            }
                        }).catch(() => {
                            this.loading = false;
                        });
                    }
                }
            });
        },
        getDistributionOrCliam(data) {
            this.formData.distributionOrCliam = data.distributionOrCliam;
        },
        getTmsExceptionTypeOne(data) {
            this.formData.tmsExceptionType1 = data.tmsExceptionType1;
            this.formData.tmsExceptionType2 = '';
        },
        getCarriervalue(data) {
            this.formData.carrier = data.carrierName;
        },
        getDriverValue(data) {
            this.formData.primaryDriver = data.driver;
        },
        getCostType(data) {
            this.formData.costType = data.costType;
        },
        methodsChange(val) {
            if (this.type === 'add') {
                // this.formData.dispatchNo = '';
                this.formData.taskNo = '';
                this.formData.customerOrderNumber = '';
            }
        },
        init() {
            if (this.type === 'edit') {
                Object.keys(this.formData).forEach(key => {
                    if (this.data.hasOwnProperty(key)) {
                        this.formData[key] = this.data[key];
                    } else {
                        this.formData[key] = '';
                    }
                });
            }
        },
        addMethodBlur() {
            if (+this.formData.distributionOrCliam === 20) {
                const params = {
                    taskNo: this.formData.taskNo,
                    customerOrderNumber: this.formData.customerOrderNumber
                };
                findCarrierAndDriver(params).then(res => {
                    this.formData.carrier = res.data.carrier;
                    this.formData.primaryDriver = res.data.primaryDriver;
                });
            }
        }
    },
    watch: {
        'formData.tmsExceptionType1'(val) {
            // this.formData.tmsExceptionType2 = '';
            this.tmsExceptionTypeTwos = Object.keys(this.tmsExceptionTypeTwoIsBack).reduce((result, key) => {
                if (key && key.split('_')[0] === val) {
                    result[key] = this.tmsExceptionTypeTwoIsBack[key];
                }
                return result;
            }, {});
        }
    },
    mounted() {
        this.init();
    },
    computed: {
        ...mapState({ user: state => state.user })
    }
};
</script>

<style lang="less">
    .source-exception-add {
        .source-exception-add-dialog {
            .methods {
                width: 100%;
                display: inline-block;
                .el-form-item__content {
                    margin-left: 0 !important;
                }
                .methods-option,#methods-option {
                    display: inline-block;
                }
                .methods-option {
                    margin-right: 10px;
                    width: 120px;
                }
                #methods-option {
                    width: calc(100% - 130px);
                    .el-select {
                        width: 100%;
                    }
                }
            }
        }
    }
</style>
