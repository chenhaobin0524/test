<template>
   <div class="carDialog">
       <el-dialog
        class="form-dialog row-dialog"
        title="排车调度"
        :visible="RwCarVisiable"
        :close-on-click-modal="false"
        :before-close="handleRwCarClose"
        width="85%"
        v-dialogDrag
    >
        <el-form
            :label-position="labelPosition"
            :model="AdmittRuleForm"
            :rules="AdmittRules"
            label-width="120px"
            ref="AdmittRuleForm"
            class="rowIndex"
        >
            <el-form-item label="承运商" prop="carrierName" class="label-form" v-model="AdmittRuleForm.carrierName">
                <otpAdvance
                    :formData="AdmittRuleForm"
                    @clear="clearClick(AdmittRuleForm.carrierName)"
                    :prop="'carrierName'" :mValue="AdmittRuleForm.carrierName"
                    :params="customerOrderNoCode"
                    @getAdvanceValue="getAdvanceValueLists">
                </otpAdvance>
            </el-form-item>
            <el-form-item
                v-model="AdmittRuleForm.procurementChannel"
                label="采购渠道"
                prop="procurementChannel"
                value-key="id"
                class="label-form"
            >
                <selects
                    :disabled="!!AdmittRuleForm.carrierName"
                    :filterable="true"
                    :mValue="AdmittRuleForm.procurementChannel"
                    :optionNum="'OTP_TMS_PROCUREMENT_CHANNEL'"
                    :prop="'procurementChannel'"
                    @getSelectValue="getSelectValue"
                ></selects>
            </el-form-item>
            <el-form-item
                    label="车牌"
                    prop="vehicleCard"
                    class="label-form"
                    v-model="AdmittRuleForm.vehicleCard"
                    v-if="AdmittRuleForm.procurementChannel">
                 <otpAdvance :formData="AdmittRuleForm" :prop="'vehicleCard'" :mValue="AdmittRuleForm.vehicleCard" @getAdvanceValue="getVehicleCardValue" :params="vehicleCardLists"></otpAdvance>
            </el-form-item>
            <el-form-item
                label="是否顺路带回"
                prop="conveniently"
                class="label-form"
                v-show="inOutTypeName === 'IN'"
                v-if="AdmittRuleForm.procurementChannel">
                <selects
                    :disabled="inOutTypeName === 'IN' && AdmittRuleForm.procurementChannel==='190' ? !isConvenientlyLists : isConvenientlyLists"
                    :optionNum="'YES_OR_NO'"
                    :mValue="AdmittRuleForm.conveniently"
                    :prop="'conveniently'"
                    @getSelectValue="getSelectValue"
                ></selects>
            </el-form-item>
            <el-form-item
                label="车型"
                prop="equipmentName"
                class="label-form"
                v-if="AdmittRuleForm.procurementChannel">
                <el-input
                    clearable
                    :disabled="true"
                    v-model="AdmittRuleForm.equipmentName"
                    size="medium"
                ></el-input>
            </el-form-item>
            <el-form-item
                label="预计到车时间"
                prop="besArriveDate"
                class="label-form"
                v-if="AdmittRuleForm.procurementChannel">
                <el-date-picker
                    popper-class="dispatch-center-car-scheduling"
                    v-model="AdmittRuleForm.besArriveDate"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择日期时间"
                ></el-date-picker>
            </el-form-item>
            <el-form-item
                label="司机"
                prop="driver"
                class="label-form"
                v-model="AdmittRuleForm.driver"
                v-if="AdmittRuleForm.procurementChannel">
                <otpAdvance :formData="AdmittRuleForm" :mValue="AdmittRuleForm.driver" :prop="'driver'" @getAdvanceValue="getDriverValue" :params="driverLists"></otpAdvance>
            </el-form-item>
            <el-form-item
                label="电话"
                prop="driverContactWay"
                class="label-form"
                v-if="AdmittRuleForm.procurementChannel">
                <el-input
                    clearable
                    :disabled="true"
                    v-model.trim="AdmittRuleForm.driverContactWay"
                    size="medium"
                ></el-input>
            </el-form-item>
            <el-form-item
                label="运输成本(元)"
                prop="transportationCost"
                class="label-form"
                v-if="AdmittRuleForm.procurementChannel !== '20' && AdmittRuleForm.procurementChannel !== '10' &&
                AdmittRuleForm.procurementChannel !== '40' && AdmittRuleForm.procurementChannel !== '120' && AdmittRuleForm.procurementChannel !== '190'">
                <el-input
                    clearable
                    @blur="transportationCostBlur(AdmittRuleForm.transportationCost)"
                    v-model.trim="AdmittRuleForm.transportationCost"
                    size="medium"
                ></el-input>
            </el-form-item>
            <el-form-item
                label="预付方式"
                prop="payMethod"
                class="label-form"
                v-if="AdmittRuleForm.procurementChannel !== '20' && AdmittRuleForm.procurementChannel !== '10' &&
                AdmittRuleForm.procurementChannel !== '40' && AdmittRuleForm.procurementChannel !== '120' && AdmittRuleForm.procurementChannel !== '190'">
                <selects
                    clearable
                    :mValue="AdmittRuleForm.payMethod"
                    :optionNum="'SYS_TMS_PAY_METHOD'"
                    :prop="'payMethod'"
                    @getSelectValue="getPayInAdvanceSelectValue"
                    @clear="clearPayMethodLits(AdmittRuleForm.payMethod)"
                ></selects>
            </el-form-item>
            <el-form-item
                label="预付金额(元)"
                prop="prepaidAmount"
                class="label-form"
                v-if="AdmittRuleForm.procurementChannel !== '20' && AdmittRuleForm.procurementChannel !== '10' &&
                AdmittRuleForm.procurementChannel !== '40' && AdmittRuleForm.procurementChannel !== '120' && AdmittRuleForm.procurementChannel !== '190'">
                <el-input
                    @clear="prepaidAmountClear(AdmittRuleForm.prepaidAmount)"
                    @blur="changeBlur(AdmittRuleForm.prepaidAmount)"
                    ref="isPrepaidAmount" clearable
                    v-model.trim="AdmittRuleForm.prepaidAmount" size="medium">
                </el-input>
            </el-form-item>
            <el-form-item
                label="信息费用(元)"
                prop="infoFee"
                class="label-form"
                v-if="AdmittRuleForm.procurementChannel !== '20' && AdmittRuleForm.procurementChannel !== '10' &&
                AdmittRuleForm.procurementChannel !== '40' && AdmittRuleForm.procurementChannel !== '120' && AdmittRuleForm.procurementChannel !== '190'">
                <el-input clearable @clear="infoFeeClear(AdmittRuleForm.infoFee)" @blur="changeInfoFeeBlur(AdmittRuleForm.infoFee)" v-model.trim="AdmittRuleForm.infoFee" size="medium"></el-input>
            </el-form-item>
            <el-form-item
                label="现汇税率(%)"
                prop="taxRate"
                class="label-form"
                v-if="AdmittRuleForm.procurementChannel !== '20' && AdmittRuleForm.procurementChannel !== '10' &&
                AdmittRuleForm.procurementChannel !== '40' && AdmittRuleForm.procurementChannel !== '120' && AdmittRuleForm.procurementChannel !== '190'">
                <otpAdvance
                    :mValue="AdmittRuleForm.taxRate.toString()"
                    :prop="'taxRate'"
                    @getAdvanceValue="getTaxRateValue"
                    :params="taxRateLists">
                </otpAdvance>
            </el-form-item>
            <el-form-item
                label="是否串点计费"
                prop="dmsFlag"
                class="label-form"
                v-if="AdmittRuleForm.procurementChannel">
                <selects
                    :disabled="isDmsFlagDisabled"
                    :mValue="(this.AdmittRuleForm.procurementChannel === '190') ? '1' : '0'"
                    :optionNum="'YES_OR_NO'"
                    :prop="'dmsFlag'"
                    @getSelectValue="getSelectValue"
                ></selects>
            </el-form-item>
            <el-form-item
                label="备注"
                prop="remark"
                class="label-form"
                v-if="AdmittRuleForm.procurementChannel">
                <el-input maxlength="15" show-word-limit clearable v-model.trim="AdmittRuleForm.remark" size="medium"></el-input>
            </el-form-item>
            <el-form-item
                label="装载过低异常类型"
                prop="exceptionType"
                class="label-form"
                v-if="AdmittRuleForm.procurementChannel">
                <selects
                    :mValue="AdmittRuleForm.exceptionType"
                    :optionNum="'exception_type'"
                    :prop="'exceptionType'"
                    @getSelectValue="getSelectValue"
                ></selects>
            </el-form-item>
            <el-form-item
                label="装载过低异常备注"
                prop="exceptionMark"
                class="label-form"
                v-if="AdmittRuleForm.procurementChannel">
                <el-input class="exception-mark" type="textarea" maxlength="100" show-word-limit autosize clearable v-model.trim="AdmittRuleForm.exceptionMark" size="medium"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer">
            <el-button @click="handleRwCarClose">取 消</el-button>
            <el-button type="primary" :loading="saveLoading" :disabled="isButtonDisabled"
            @click="AdmittOk('AdmittRuleForm')">保 存</el-button>
        </div>
    </el-dialog>
   </div>
</template>

<script>
import { getDispathOrderEdit } from '../../api/dispatchOrder';
import { getLicensePlate, getDriverName } from '../../api/carSchedulingDialog';
import carSchedulingDialog from './carSchedulingDialog/carSchedulingDialog';
import otpAdvance from '@/components/lots/otpAdvance';
import selects from '@/components/lots/otpSelect';
import '../../utils/directives';
export default {
    components: {
        selects, otpAdvance
    },
    props: {
        labelPosition: {
            type: String,
            default: 'right'
        },
        RwCarVisiable: {
            type: Boolean,
            default: false
        },
        dataLists: {
            type: Object,
            default() {
                return {};
            }
        },
        isConveniently: {
            type: Boolean,
            default: true
        },
        inOutType: {
            type: String,
            default() {
                return '';
            }
        }
    },
    data() {
        return {
            carSchedulingDialog,
            siteType: '',
            carrierDataCode: '',
            suppliersDataCode: '',
            isDmsFlagDisabled: true,
            isConvenientlyLists: true,
            driverOptions: [],
            LicensePlateOptions: [],
            businessOptions: [],
            AdmittRuleForm: {
                carrierName: '',
                dmsFlag: '',
                procurementChannel: '',
                conveniently: '',
                vehicleCard: '',
                equipmentName: '',
                driver: '',
                driverContactWay: '',
                besArriveDate: '',
                payMethod: '',
                transportationCost: '',
                prepaidAmount: '',
                taxRate: '',
                remark: '',
                driverIdentity: '',
                infoFee: '',
                equipmentType: '',
                exceptionType: '',
                exceptionMark: ''
            },
            prepaidAmount: '',
            taxRate: '',
            isButtonDisabled: false,
            saveLoading: false
        };
    },
    methods: {
        // 信息费用
        changeInfoFeeBlur(infoFee) {
            if (infoFee === undefined || infoFee === '') {
                this.isButtonDisabled = false;
            } else {
                const reg = /^(([1-9][0-9]{0,4})([.][0-9]{0,2})?|100000|100000.0|100000.00|0.0|0.00|0)$/;
                if (!reg.test(infoFee)) {
                    this.isButtonDisabled = true;
                    return this.$message.warning('请输入数字，可为0，最多支持2位小数；最高支持十万');
                } else {
                    this.isButtonDisabled = false;
                }
            }
        },
        // 预付金额
        changeBlur(prepaidAmount) {
            const reg = /^(([1-9][0-9]{0,4})([.][0-9]{0,2})?|100000|100000.0|100000.00|0.0|0.00|0)$/;
            if (Number(prepaidAmount) > Number(this.AdmittRuleForm.transportationCost)) {
                this.$message.warning('预付金额不可大于运输成本');
                this.isButtonDisabled = true;
                return false;
            } else {
                this.isButtonDisabled = false;
            }
            if (!reg.test(prepaidAmount) && prepaidAmount) {
                this.isButtonDisabled = true;
                return this.$message.warning('请输入数字，可为0，最多支持2位小数；最高支持十万');
            }
        },
        prepaidAmountClear(prepaidAmount) {
            if (prepaidAmount === '' && this.AdmittRuleForm.payMethod) {
                this.$message.warning('请填写预付金额');
                this.isButtonDisabled = true;
                return false;
            }
            if (!prepaidAmount) {
                this.isButtonDisabled = false;
            }
        },
        infoFeeClear(infoFee) {
            if (!infoFee) {
                this.isButtonDisabled = false;
            }
        },
        // 运输成本
        transportationCostBlur(transportationCost) {
            if ((Number(this.AdmittRuleForm.transportationCost)) < (Number(this.AdmittRuleForm.prepaidAmount))) {
                this.$message.warning('预付金额不可大于运输成本');
                this.isButtonDisabled = true;
                return false;
            } else {
                this.isButtonDisabled = false;
            }
        },
        // 车牌基础数据
        getVehicleCardValue(data) {
            this.AdmittRuleForm = { ...this.AdmittRuleForm, ...data };
            this.suppliersDataCode = data.carrierCode;
        },
        // 司机基础数据
        getDriverValue(data) {
            this.AdmittRuleForm = { ...this.AdmittRuleForm, ...data };
        },
        // 现汇税率基础数据
        getTaxRateValue(data) {
            this.AdmittRuleForm = { ...this.AdmittRuleForm, ...data };
            this.taxRate = (data.taxRate).toString();
        },
        // 承运商基础数据
        getAdvanceValueLists(data) {
            this.AdmittRuleForm = { ...this.AdmittRuleForm, ...data };
            this.carrierDataCode = data.carrierCode;
            this.siteType = data.transType;
            this.AdmittRuleForm.procurementChannel = data.transType;
            this.AdmittRuleForm.dmsFlag = (this.AdmittRuleForm.procurementChannel === '190') ? '1' : '0';
            this.getLicensePlateLists();
            this.getDriverNameLists();
        },
        getData(data) {
            getDispathOrderEdit(data).then(res => {});
        },
        // 预付方式
        clearPayMethodLits(payMethod) {
            if (payMethod === '') {
                this.AdmittRuleForm.prepaidAmount = '';
            }
        },
        // 预付方式数据字典
        getPayInAdvanceSelectValue(data) {
            this.AdmittRuleForm = { ...this.AdmittRuleForm, ...data };
            const prepaidAmountLists = this.AdmittRuleForm.prepaidAmount;
            if (data.payMethod && prepaidAmountLists === undefined) {
                this.isButtonDisabled = true;
                this.$message.warning('请填写预付金额');
            } else {
                this.isButtonDisabled = false;
            }
        },
        // 数据字典
        getSelectValue(data) {
            this.AdmittRuleForm = { ...this.AdmittRuleForm, ...data };
        },
        getSelectTaxRateValue(data) {
            this.AdmittRuleForm = { ...this.AdmittRuleForm, ...data };
        },
        // 车牌基础数据接口请求
        getLicensePlateLists(data) {
            const params = {
                pageSize: 10,
                pageNo: 1,
                suppliersCode: this.carrierDataCode,
                licensePlateNumber: ''
            };
            getLicensePlate(params).then(res => {
                if (res.data.list.length === 1) {
                    this.AdmittRuleForm.vehicleCard = res.data.list[0].licensePlateNumber; // 车牌
                    this.AdmittRuleForm.equipmentName = res.data.list[0].cdegNameCn; // 车型
                    this.AdmittRuleForm.equipmentType = res.data.list[0].etveType; // 车型代码
                }
            });
        },
        // 基础数据司机查询接口
        getDriverNameLists(data) {
            const params = {
                pageSize: 10,
                pageNo: 1,
                suppliersCode: this.carrierDataCode,
                name: ''
            };
            getDriverName(params).then(res => {
                if (res.data.list.length === 1) {
                    this.AdmittRuleForm.driver = res.data.list[0].name; // 司机
                    this.AdmittRuleForm.driverContactWay = res.data.list[0].encuMobile; // 电话
                    this.AdmittRuleForm.driverIdentity = res.data.list[0].cardId; // 身份证
                }
            });
        },
        handleRwCarClose() {
            this.$emit('update:RwCarVisiable', false);
        },
        AdmittOk(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    const reg = /^(([1-9][0-9]{0,4})([.][0-9]{0,2})?|100000|100000.0|100000.00|0.0|0.00|0)$/;
                    if (this.AdmittRuleForm.payMethod && !this.AdmittRuleForm.prepaidAmount) {
                        this.$message.warning('请填写预付金额');
                        this.isButtonDisabled = true;
                    } else if (Number(this.AdmittRuleForm.prepaidAmount) && !this.AdmittRuleForm.payMethod) {
                        this.$message.warning('请填写预付方式');
                        this.isButtonDisabled = true;
                    } else if (Number(this.AdmittRuleForm.prepaidAmount) > Number(this.AdmittRuleForm.transportationCost)) {
                        this.$message.warning('预付金额不可大于运输成本');
                        this.isButtonDisabled = true;
                    } else if (this.AdmittRuleForm.infoFee && !reg.test(this.AdmittRuleForm.infoFee)) {
                        this.isButtonDisabled = true;
                        return this.$message.warning('信息费用不能大于十万');
                    } else {
                        this.isButtonDisabled = false;
                        this.AdmittRuleForm['procurementChannel'] = this.siteType;
                        this.$emit('AdmittOk', { state: true, data: this.AdmittRuleForm });
                        // this.$emit('update:RwCarVisiable', false);
                    }
                } else {
                    this.$emit('AdmittOk', { state: false, form: valid, data: {} });
                    return false;
                }
            });
        },
        // 赋值
        setData() {
            this.AdmittRuleForm.driverIdentity = this.dataLists.driverIdentity;
            this.AdmittRuleForm.carrierName = this.dataLists.carrierName; // 承运商
            this.AdmittRuleForm.carrierCode = this.dataLists.carrierCode; // 承运商编码
            this.siteType = this.dataLists.procurementChannel; // 采购渠道
            this.AdmittRuleForm.procurementChannel = this.dataLists.procurementChannel;
            this.AdmittRuleForm.vehicleCard = this.dataLists.vehicleCard; // 车牌
            if (!this.AdmittRuleForm.conveniently) {
                this.AdmittRuleForm.conveniently = 0;
            }
            this.AdmittRuleForm.conveniently = this.dataLists.conveniently ? this.dataLists.conveniently : '0';
            this.AdmittRuleForm.equipmentName = this.dataLists.equipmentName;
            this.AdmittRuleForm.besArriveDate = this.dataLists.besArriveDate;
            this.AdmittRuleForm.driver = this.dataLists.driver;
            this.AdmittRuleForm.driverContactWay = this.dataLists.driverContactWay;
            this.AdmittRuleForm.transportationCost = this.dataLists.transportationCost;
            this.AdmittRuleForm.payMethod = this.dataLists.payMethod;
            this.AdmittRuleForm.prepaidAmount = this.dataLists.prepaidAmount;
            this.AdmittRuleForm.infoFee = this.dataLists.infoFee;
            if (this.AdmittRuleForm.taxRate === '' && this.dataLists.taxRate === undefined) {
                this.dataLists.taxRate = '';
            }
            this.AdmittRuleForm.taxRate = String(this.dataLists.taxRate) ? String(this.dataLists.taxRate) : '';
            this.AdmittRuleForm.dmsFlag = this.AdmittRuleForm.procurementChannel === '190' ? '1' : '0';
            this.AdmittRuleForm.remark = this.dataLists.remark;
            this.AdmittRuleForm.suppliersCode = this.dataLists.carrierCode;
            this.AdmittRuleForm.exceptionType = this.dataLists.exceptionType;
            this.AdmittRuleForm.exceptionMark = this.dataLists.exceptionMark;
            if (this.AdmittRuleForm.conveniently === 1) {
                this.AdmittRuleForm.conveniently = '1';
            } else if (this.AdmittRuleForm.conveniently === 0) {
                this.AdmittRuleForm.conveniently = '0';
            }
            if (this.AdmittRuleForm.payMethod === '网银转账') {
                this.AdmittRuleForm.payMethod = '0';
            } else if (this.AdmittRuleForm.payMethod === '油卡支付') {
                this.AdmittRuleForm.payMethod = '1';
            }
        },
        clearClick(carrierName) {
            if (!carrierName) {
                this.AdmittRuleForm.driverContactWay = '';
                this.AdmittRuleForm.equipmentName = '';
            }
        }
    },
    mounted() {
        this.getLicensePlateLists();
        this.getDriverNameLists();
    },
    created() {
        this.setData();
        this.customerOrderNoCode = carSchedulingDialog.customerOrderNoCode;
        this.vehicleCardLists = carSchedulingDialog.vehicleCardLists;
        this.driverLists = carSchedulingDialog.driverLists;
        this.taxRateLists = carSchedulingDialog.taxRateLists;
        this.AdmittRules = carSchedulingDialog.AdmittRules;
    },
    watch: {
        'AdmittRuleForm.carrierName': {
            deep: true,
            handler: function(newVal, oldVal) {
                if ((newVal !== oldVal) && (this.dataLists.carrierName !== this.AdmittRuleForm.carrierName)) {
                    this.AdmittRuleForm.vehicleCard = '';
                    this.AdmittRuleForm.driver = '';
                    this.AdmittRuleForm.equipmentName = '';
                    this.AdmittRuleForm.besArriveDate = '';
                    this.AdmittRuleForm.driverContactWay = '';
                    this.AdmittRuleForm.transportationCost = '';
                    this.AdmittRuleForm.payMethod = '';
                    this.AdmittRuleForm.prepaidAmount = '';
                    this.AdmittRuleForm.infoFee = '';
                    this.AdmittRuleForm.taxRate = '';
                    this.AdmittRuleForm.remark = '';
                }
            }
        }
    },
    computed: {
        show: {
            set(val) { this.$emit('update:RwCarVisiable', val); },
            get() { return this.RwCarVisiable; }
        },
        inOutTypeName: {
            set(val) {},
            get() { return this.inOutType; }
        }
    }
};
</script>

<style lang="less">
@import './carSchedulingDialog/carSchedulingDialog.less';
.dispatch-center-car-scheduling {
    .el-picker-panel__footer {
        .el-button--text {
            display: none;
        }
    }
}
</style>