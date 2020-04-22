<template>
    <div class="g-seven-edit">
        <el-dialog
            class="g-seven-edit-dialog"
            title="无车平台推送日志-G7"
            :close-on-click-modal="false"
            width="90%"
            :visible.sync="visiableDialog"
            :before-close="handleClose">
            <!-- <el-form
                :inline="true"
                :label-position="labelPosition"
                :model="ruleForm"
                :rules="rules"
                label-width="100px"
                ref="ruleForm"
                class="row-box">
                <el-form-item label="发车单号" prop="dispatchNo">
                    <el-input
                        :disabled="true"
                        clearable
                        v-model.trim="ruleForm.dispatchNo"
                    ></el-input>
                </el-form-item>
                <el-form-item label="会计主体" prop="dispatchNo">
                    <el-input
                        clearable
                        v-model.trim="ruleForm.dispatchNo"
                    ></el-input>
                </el-form-item>
                <el-form-item label="发车平台" prop="dispatchNo">
                    <el-input
                        clearable
                        v-model.trim="ruleForm.dispatchNo"
                    ></el-input>
                </el-form-item>
                <el-form-item label="发货详细地址" prop="dispatchNo">
                    <el-input
                        clearable
                        v-model.trim="ruleForm.dispatchNo"
                    ></el-input>
                </el-form-item>
                <el-form-item label="收货详细地址" prop="dispatchNo">
                    <el-input
                        clearable
                        v-model.trim="ruleForm.dispatchNo"
                    ></el-input>
                </el-form-item>
                <el-form-item label="收货人" prop="dispatchNo">
                    <el-input
                        clearable
                        v-model.trim="ruleForm.dispatchNo"
                    ></el-input>
                </el-form-item>
                <el-form-item label="收货人电话" prop="dispatchNo">
                    <el-input
                        clearable
                        v-model.trim="ruleForm.dispatchNo"
                    ></el-input>
                </el-form-item>
                <el-form-item label="司机" prop="dispatchNo">
                    <el-input
                        clearable
                        v-model.trim="ruleForm.dispatchNo"
                    ></el-input>
                </el-form-item>
                <el-form-item label="司机电话" prop="dispatchNo">
                    <el-input
                        clearable
                        v-model.trim="ruleForm.dispatchNo"
                    ></el-input>
                </el-form-item>
                <el-form-item label="车牌" prop="dispatchNo">
                    <el-input
                        clearable
                        v-model.trim="ruleForm.dispatchNo"
                    ></el-input>
                </el-form-item>
                <el-form-item label="身份证号" prop="dispatchNo">
                    <el-input
                        clearable
                        v-model.trim="ruleForm.dispatchNo"
                    ></el-input>
                </el-form-item>
                <el-form-item label="运输成本" prop="dispatchNo">
                    <el-input
                        clearable
                        v-model.trim="ruleForm.dispatchNo"
                    ></el-input>
                </el-form-item>
                <el-form-item label="商品中文名称" prop="dispatchNo">
                    <el-input
                        clearable
                        v-model.trim="ruleForm.dispatchNo"
                    ></el-input>
                </el-form-item>
                <el-form-item label="重量（Kg）" prop="dispatchNo">
                    <el-input
                        clearable
                        v-model.trim="ruleForm.dispatchNo"
                    ></el-input>
                </el-form-item>
            </el-form> -->
            <form-dialog ref="formDialog" :inline="true" :fieldList="fieldList" :rules="rules" :data="data">
            </form-dialog>
            <div slot="footer" class="dialog-footer">
                <el-button class="dialog-btn" @click="handleClose">取 消</el-button>
                <el-button class="dialog-cel" type="primary" @click="saveOk">保 存</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import FormDialog from '../../components/formDialog/Main';
import { getUpdateLists } from '../../../../api/vehicleFreePlatform';
export default {
    components: { FormDialog },
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
        }
    },
    data() {
        const allFreightValida = (rule, value, callback) => {
            if (value !== '' && value !== undefined) {
                const reg = /^\d{0,7}(\.\d{0,2})?$/;
                if (reg.test(value)) {
                    return callback();
                } else {
                    return callback(new Error('不能大于2位小数，不能超百万'));
                }
            }
        };
        const weightValida = (rule, value, callback) => {
            if (value !== '' && value !== undefined) {
                const reg = /^\d+(\.\d{0,3})?$/;
                if (reg.test(value)) {
                    return callback();
                } else {
                    return callback(new Error('不大于3位小数'));
                }
            }
        };
        return {
            ruleForm: {
                dispatchNo: ''
            },
            rules: {
                dispatchNo: [
                    { required: true, message: '发车单号不能为空' }
                ],
                allFreight: [
                    { message: '不能大于2位小数，不能超百万', validator: allFreightValida }
                ],
                weight: [
                    { message: '不大于3位小数', validator: weightValida }
                ]
            },
            fieldList: [
                { label: '发车单号', prop: 'dispatchNo', type: 'input', disabled: true },
                {
                    label: '会计主体',
                    prop: 'invoiceUnitName',
                    type: 'input',
                    disabled: true,
                    params: {
                        'value': 'siteName',
                        'type': 'advance',
                        'unfold': true,
                        'advanceConfig': [
                            { 'prop': 'escoCompanyNameCn', 'value': '服务平台名称' },
                            { 'prop': 'escoCompanyNo', 'value': '服务平台编码' }
                        ],
                        'tableConfig': [
                            { 'prop': 'escoCompanyNameCn', 'value': '服务平台名称' },
                            { 'prop': 'escoCompanyNo', 'value': '服务平台编码' }
                        ],
                        'advanceUrl': '/searchPlatform',
                        'cbParams': ['escoCompanyNo#siteCode', 'escoCompanyNameCn#siteName'],
                        'advanceCode': 'advanceCode'
                    }
                },
                {
                    label: '发车平台',
                    prop: 'siteName',
                    type: 'siteAdvance',
                    params: {
                        'value': 'siteName',
                        'type': 'advance',
                        'unfold': true,
                        'advanceConfig': [
                            { 'prop': 'escoCompanyNameCn', 'value': '服务平台名称' },
                            { 'prop': 'escoCompanyNo', 'value': '服务平台编码' }
                        ],
                        'tableConfig': [
                            { 'prop': 'escoCompanyNameCn', 'value': '服务平台名称' },
                            { 'prop': 'escoCompanyNo', 'value': '服务平台编码' }
                        ],
                        'advanceUrl': '/searchPlatform',
                        'cbParams': ['escoCompanyNo#siteCode', 'escoCompanyNameCn#siteName'],
                        'advanceCode': 'advanceCode'
                    }
                },
                { label: '发货详细地址', prop: 'senderDetailAddr', type: 'input' },
                { label: '收货详细地址', prop: 'receiverDetailAddr', type: 'input' },
                { label: '收货人', prop: 'receiver', type: 'input' },
                { label: '收货人电话', prop: 'receiverContactWay', type: 'input' },
                {
                    label: '司机',
                    prop: 'driver',
                    type: 'driverAdvance',
                    params: {
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
                    }
                },
                { label: '司机电话', prop: 'driverContactWay', type: 'input', disabled: true },
                { label: '车牌', prop: 'vehicleCard', type: 'input' },
                { label: '身份证号', prop: 'driverCard', type: 'input', disabled: true },
                { label: '运输成本', prop: 'allFreight', type: 'input' },
                { label: '商品中文名称', prop: 'itemName', type: 'input' },
                { label: '重量（Kg）', prop: 'weight', type: 'input' }
            ]
        };
    },
    methods: {
        handleClose() {
            this.$emit('handleClose', '');
        },
        saveOk() {
            this.$refs.formDialog.$refs.formDialog.validate(valid => {
                if (valid) {
                    const params = this.$refs.formDialog.formData;
                    getUpdateLists(params).then(res => {
                        if (res) {
                            this.$message.success('编辑成功');
                            this.$emit('saveOk', true);
                        }
                    });
                }
            });
        },
        dialogMousedown() {}
    }
};
</script>

<style lang="less">

</style>