<template>
    <div>
        <el-dialog
            v-dialogDrag
            class="form-dialogs supplierDialog"
            title="排车调度"
            :visible.sync="controlVisiable"
            :before-close="cancelControl"
            width="72%"
        >
            <el-form
                :label-position="labelPosition"
                :model="controlRuleForm"
                :rules="controlRules"
                label-width="70px"
                ref="controlRuleForm"
                class="row-box"
            >
                <el-row :gutter="10">
                    <el-col :span="6">
                        <div class="grid-content bg-purple">
                            <el-form-item label="承运商" prop="carrierName" class="label-form">
                                <otpAdvance
                                    :title="controlRuleForm.carrierName"
                                    :formData="controlRuleForm"
                                    :prop="'carrierName'" :mValue="controlRuleForm.carrierName" :params="customerOrderNoCode"
                                    :disabled="isdisabled" @getAdvanceValue="getAdvanceValue">
                                </otpAdvance>
                            </el-form-item>
                        </div>
                    </el-col>
                    <el-col :span="6">
                        <div class="grid-content bg-purple">
                             <el-form-item label="采购渠道" prop="procurementChannel" class="label-form">
                                <el-input
                                    clearable
                                    :disabled="true"
                                    v-model.trim="controlRuleForm.procurementChannel"
                                    size="medium"
                                ></el-input>
                            </el-form-item>
                        </div>
                    </el-col>
                    <el-col :span="6">
                        <div class="grid-content bg-purple">
                            <el-form-item label="车牌" prop="vehicleCard" class="label-form" v-model="controlRuleForm.vehicleCard">
                                <otpAdvance
                                    :formData="controlRuleForm"
                                    :mValue="controlRuleForm.vehicleCard"
                                    :prop="'vehicleCard'" @getAdvanceValue="getAdvanceValue"
                                    :params="vehicleCardLists">
                                </otpAdvance>
                            </el-form-item>
                        </div>
                    </el-col>
                    <el-col :span="6">
                        <div class="grid-content bg-purple">
                            <el-form-item label="车型" prop="equipmentName" class="label-form">
                                <el-input
                                    clearable
                                    :disabled="true"
                                    v-model.trim="controlRuleForm.equipmentName"
                                    size="medium"
                                ></el-input>
                            </el-form-item>
                        </div>
                    </el-col>
                </el-row>
                <el-col :span="6">
                    <div class="grid-content bg-purple">
                        <el-form-item label="司机" prop="driver" class="label-form" v-model="controlRuleForm.driver">
                            <otpAdvance
                                :formData="controlRuleForm"
                                :mValue="controlRuleForm.driver"
                                :prop="'driver'"
                                @getAdvanceValue="getAdvanceValue"
                                :params="driverLists">
                            </otpAdvance>
                        </el-form-item>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="grid-content bg-purple">
                        <el-form-item label="电话" prop="driverContactWay" class="label-form">
                            <el-input
                                clearable
                                :disabled="true"
                                v-model.trim="controlRuleForm.driverContactWay"
                                size="medium"
                            ></el-input>
                        </el-form-item>
                    </div>
                </el-col>
            </el-form>
            <div slot="footer" class>
                <el-button @click="cancelControl">取 消</el-button>
                <el-button type="primary" @click="addOkControl('controlRuleForm')">确 认</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import otpAdvance from '@/components/lots/otpAdvance';
import { getDispathOrderEdit } from '../../api/dispatchOrder';
export default {
    components: { otpAdvance },
    props: {
        labelPosition: {
            type: String,
            default: 'right'
        },
        controlVisiable: {
            type: Boolean,
            default: false
        },
        dataLists: {
            type: Object,
            default() {
                return {};
            }
        }
    },
    data() {
        return {
            isdisabled: true,
            customerOrderNoCode: {
                'name': '请输入承运商',
                'advanceLabel': '承运商',
                'value': 'carrierName',
                'advanceConfig': [
                    { 'prop': 'suppliersNameCn', 'value': '承运商名称' },
                    { 'prop': 'suppliersCode', 'value': '承运商编码' },
                    { 'prop': 'tranName', 'value': '采购渠道' }
                ],
                'tableConfig': [
                    { 'prop': 'suppliersNameCn', 'value': '承运商名称' },
                    { 'prop': 'suppliersCode', 'value': '承运商编码' },
                    { 'prop': 'tranName', 'value': '采购渠道' }
                ],
                'advanceUrl': 'ebSupplier/searchBySupplier',
                'cbParams': [
                    'suppliersNameCn#carrierName', 'suppliersCode#carrierCode', 'transType', 'tranName'
                ],
                'advanceCascade': 'suppliersCode#carrierCode'
            },
            vehicleCardLists: {
                'name': '请输入车牌号',
                'advanceLabel': '车牌号',
                'value': 'vehicleCard',
                'advanceConfig': [
                    { 'prop': 'licensePlateNumber', 'value': '车牌' },
                    { 'prop': 'cargoVolume', 'value': '载货体积' },
                    { 'prop': 'cdegNameCn', 'value': '车型' }
                ],
                'tableConfig': [
                    { 'prop': 'licensePlateNumber', 'value': '车牌' },
                    { 'prop': 'cargoVolume', 'value': '载货体积' },
                    { 'prop': 'cdegNameCn', 'value': '车型' }
                ],
                'advanceUrl': 'suCar/searchByConditions',
                'cbParams': [
                    'licensePlateNumber#vehicleCard', 'cargoVolume', 'cdegNameCn#equipmentName', 'carrierCode#suppliersCode'
                ],
                'advanceCascade': 'carrierCode#suppliersCode'
            },
            driverLists: {
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
                'advanceUrl': '/suDriver/searchByConditions',
                'cbParams': [
                    'name#driver', 'encuMobile#driverContactWay', 'cardId#driverIdentity', 'carrierCode#suppliersCode'
                ],
                'advanceCascade': 'carrierCode#suppliersCode'
            },
            controlRuleForm: {
                vehicleCard: '',
                driver: '',
                driverIdentity: '',
                equipmentType: ''
            },
            controlRules: {
                vehicleCard: [
                    {
                        required: true,
                        message: '车牌不能为空',
                        trigger: 'blur'
                    }
                ],
                driver: [
                    {
                        required: true,
                        message: '司机不能为空',
                        trigger: 'blur'
                    }
                ]
            }
        };
    },
    methods: {
        getAdvanceValue(data) {
            this.controlRuleForm = { ...this.controlRuleForm, ...data };
        },
        getData(data) {
            getDispathOrderEdit(data).then(res => {
                const dataListsCode = {
                    '00': '自调车',
                    '10': '长合车',
                    '20': '物流公司',
                    '40': '车队供应商',
                    '160': '信息中介',
                    '170': '临时专线',
                    '180': '网络调车平台',
                    '190': '城配合同车'
                };
                this.dispatchNo = res.data.dispatchNo;
                this.controlRuleForm.carrierName = this.dataLists.carrierName;
                this.controlRuleForm.carrierCode = this.dataLists.carrierCode;
                this.siteType = this.dataLists.procurementChannel;
                this.controlRuleForm.procurementChannel = this.dataLists.procurementChannel;
                this.controlRuleForm.vehicleCard = this.dataLists.vehicleCard;
                this.controlRuleForm.equipmentName = this.dataLists.equipmentName;
                this.controlRuleForm.driver = this.dataLists.driver;
                this.controlRuleForm.driverContactWay = this.dataLists.driverContactWay;
                this.controlRuleForm.equipmentType = this.dataLists.equipmentType;
                this.controlRuleForm.driverIdentity = this.dataLists.driverIdentity;
                this.controlRuleForm.procurementChannel = dataListsCode[this.dataLists.procurementChannel];
            });
        },

        cancelControl() {
            this.$emit('cancelControl', '');
        },
        addOkControl(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.controlRuleForm['procurementChannel'] = this.siteType;
                    this.$emit('addOkControl', { state: true, data: this.controlRuleForm });
                    this.$emit('update:controlVisiable', false);
                } else {
                    this.$emit('addOkControl', { state: false, form: valid, data: {} });
                    return false;
                }
            });
        }
    },
    created() {
        this.getData(this.dataLists);
    }
};
</script>

<style lang="less">
.supplierDialog .el-input--medium{
    font-size: 12px;
}
.supplierDialog {
    .el-input--medium .el-input__inner {
        height: 28px;
    }
    .row-box{
        margin:0 !important;
    }
    .el-row {
        width:100%;
        margin:0 !important;
    }
    .el-col-6{
        padding:0 !important;
    }
}

</style>