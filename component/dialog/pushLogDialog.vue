<template>
    <div class="pushLog">
        <el-dialog
            class="form-dialog"
            title="无车平台推送日志"
            :visible.sync="visiableDialog"
            :close-on-click-modal="false"
            :before-close="handleClose"
            width="90%"
        >
            <el-form
                :label-position="labelPosition"
                :model="ruleForm"
                :rules="rules"
                label-width="100px"
                ref="ruleForm"
                class="row-box"
            >
                <el-form-item label="发车单号" prop="dispatchNo" class="label-form">
                    <el-input
                        :disabled="true"
                        clearable
                        v-model.trim="ruleForm.dispatchNo"
                        size="medium"
                    ></el-input>
                </el-form-item>
                <el-form-item label="商品中文名称" prop="itemName" class="label-form">
                    <el-input
                        clearable
                        v-model.trim="ruleForm.itemName"
                        size="medium"
                    ></el-input>
                </el-form-item>
                <el-form-item label="发货地省份" prop="senderProvinceName" class="label-form">
                    <el-input
                        clearable
                        v-model.trim="ruleForm.senderProvinceName"
                        size="medium"
                    ></el-input>
                </el-form-item>
                <el-form-item label="发货地城市" prop="senderCityName" class="label-form">
                    <el-input
                        clearable
                        v-model.trim="ruleForm.senderCityName"
                        size="medium"
                    ></el-input>
                </el-form-item>
                <el-form-item label="发货地区县" prop="senderDistrictName" class="label-form">
                    <el-input
                        clearable
                        v-model.trim="ruleForm.senderDistrictName"
                        size="medium"
                    ></el-input>
                </el-form-item>
                <el-form-item label="目的地省份" prop="receiverProvinceName" class="label-form">
                    <el-input
                        clearable
                        v-model.trim="ruleForm.receiverProvinceName"
                        size="medium"
                    ></el-input>
                </el-form-item>
                <el-form-item label="目的地城市" prop="receiverCityName" class="label-form">
                    <el-input
                        clearable
                        v-model.trim="ruleForm.receiverCityName"
                        size="medium"
                    ></el-input>
                </el-form-item>
                <el-form-item label="目的地区县" prop="receiverDistrictName" class="label-form">
                    <el-input
                        clearable
                        v-model.trim="ruleForm.receiverDistrictName"
                        size="medium"
                    ></el-input>
                </el-form-item>
                <el-form-item label="运输成本" prop="allFreight" class="label-form">
                    <el-input
                        clearable
                        v-model.trim="ruleForm.allFreight"
                        size="medium"
                    ></el-input>
                </el-form-item>
                <el-form-item label="司机" prop="driver" class="label-form">
                    <el-input
                        clearable
                        v-model.trim="ruleForm.driver"
                        size="medium"
                    ></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="driverContactWay" class="label-form">
                    <el-input
                        clearable
                        v-model.trim="ruleForm.driverContactWay"
                        size="medium"
                    ></el-input>
                </el-form-item>
                <el-form-item label="车牌" prop="vehicleCard" class="label-form">
                    <el-input
                        clearable
                        v-model.trim="ruleForm.vehicleCard"
                        size="medium"
                    ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button class="dialog-btn" @click="handleClose">取 消</el-button>
                <el-button class="dialog-cel" type="primary" @click="addOk('ruleForm')">保 存</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    components: {},
    props: {
        visiableDialog: {
            type: Boolean,
            default: false
        },
        labelPosition: {
            type: String,
            default: 'right'
        },
        dataVisiableLists: {
            type: Object,
            default() {
                return {};
            }
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
            ruleForm: {
                dispatchNo: '',
                itemName: '',
                senderProvinceName: '',
                receiverProvinceName: '',
                senderCityName: '',
                senderDistrictName: '',
                receiverCityName: '',
                receiverDistrictName: '',
                allFreight: '',
                driver: '',
                driverContactWay: '',
                vehicleCard: ''
            },
            rules: {
                dispatchNo: [
                    {
                        required: true,
                        message: '发车单号不能为空',
                        trigger: 'blur'
                    }
                ],
                itemName: [
                    {
                        required: true,
                        message: '商品名称不能为空',
                        trigger: 'blur'
                    }
                ],
                senderProvinceName: [
                    {
                        required: true,
                        message: '发货地省份不能为空',
                        trigger: 'blur'
                    }
                ],
                receiverProvinceName: [
                    {
                        required: true,
                        message: '目的地省份不能为空',
                        trigger: 'blur'
                    }
                ],
                senderCityName: [
                    {
                        required: true,
                        message: '发货地城市不能为空',
                        trigger: 'blur'
                    }
                ],
                // senderDistrictName: [
                //     {
                //         required: true,
                //         message: '发货地区县不能为空',
                //         trigger: 'blur'
                //     }
                // ],
                receiverCityName: [
                    {
                        required: true,
                        message: '目的地城市不能为空',
                        trigger: 'blur'
                    }
                ],
                // receiverDistrictName: [
                //     {
                //         required: true,
                //         message: '目的地区县不能为空',
                //         trigger: 'blur'
                //     }
                // ],
                allFreight: [
                    {
                        required: true,
                        message: '运输成本不能为空',
                        trigger: 'blur'
                    },
                    {
                        pattern: /^(([1-9][0-9]{0,4})([.][0-9]{0,2})?|100000|100000.0|100000.00|!0.0|!0.00|!0)$/,
                        message:
                            '仅可输入数字，不能为0，支持小数点后2位；包含小数点共9位',
                        trigger: 'blur'
                    }
                ],
                driver: [
                    {
                        required: true,
                        message: '司机不能为空',
                        trigger: 'blur'
                    }
                ],
                driverContactWay: [
                    {
                        required: true,
                        message: '手机不能为空',
                        trigger: 'blur'
                    },
                    {
                        pattern: /^1[3|4|5|7|8][0-9]\d{8}$/,
                        message: '请输入正确的手机号',
                        trigger: 'blur'
                    }
                ],
                vehicleCard: [
                    {
                        required: true,
                        message: '车牌不能为空',
                        trigger: 'blur'
                    }
                ]
            }
        };
    },
    methods: {
        handleClose() {
            this.$emit('handleClose', '');
        },
        addOk(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.$emit('addOk', { state: true, data: this.ruleForm });
                    this.$emit('update:visiableDialog', false);
                } else {
                    this.$emit('addOk', { state: false, form: valid, data: {} });
                    return false;
                }
            });
        },
        // 赋值
        steDataLists() {
            this.ruleForm.dispatchNo = this.dataLists.dispatchNo;
            this.ruleForm.itemName = this.dataLists.itemName;
            this.ruleForm.senderProvinceName = this.dataLists.senderProvinceName;
            this.ruleForm.senderCityName = this.dataLists.senderCityName;
            this.ruleForm.senderDistrictName = this.dataLists.senderDistrictName;
            this.ruleForm.receiverProvinceName = this.dataLists.receiverProvinceName;
            this.ruleForm.receiverCityName = this.dataLists.receiverCityName;
            this.ruleForm.receiverDistrictName = this.dataLists.receiverDistrictName;
            this.ruleForm.allFreight = this.dataLists.allFreight;
            this.ruleForm.driver = this.dataLists.driver;
            this.ruleForm.driverContactWay = this.dataLists.driverContactWay;
            this.ruleForm.vehicleCard = this.dataLists.vehicleCard;
        }
    },
    mounted() {
        this.steDataLists();
    },
    created() {}
};
</script>

<style lang="less">
.pushLog{
    .el-dialog__body {
        padding: 0 !important;
    }
    .row-box{
        margin: 12px 10px;
        display: flex;
        flex-wrap: wrap;
    }
}
</style>