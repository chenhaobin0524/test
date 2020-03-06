<template>
    <div class="asternDialog">
        <el-dialog
            class="form-dialog"
            title="到车登记"
            :visible.sync="visiable"
            :close-on-click-modal="false"
            :before-close="handleClose"
            width="60%"
        >
            <el-form
                :label-position="labelPosition"
                :model="ruleForm"
                :rules="rules"
                label-width="100px"
                ref="ruleForm"
                class="row-box"
            >
                <el-form-item label="车牌" prop="vehicleCard" class="label-form">
                    <el-input
                        clearable
                        :disabled="true"
                        v-model.trim="ruleForm.vehicleCard"
                        size="medium"
                    ></el-input>
                </el-form-item>
                <el-form-item label="司机" prop="driver" class="label-form">
                    <el-input
                        clearable
                        :disabled="true"
                        v-model.trim="ruleForm.driver"
                        size="medium"
                    ></el-input>
                </el-form-item>
                <el-form-item label="联系方式" prop="driverContactWay" class="label-form">
                    <el-input
                        clearable
                        :disabled="true"
                        v-model.trim="ruleForm.driverContactWay"
                        size="medium"
                    ></el-input>
                </el-form-item>
                <el-form-item label="到车时间" prop="actualArriveDate" class="label-form" clearable>
                    <el-date-picker
                        class="arrival-time"
                        v-model="ruleForm.actualArriveDate"
                        type="datetime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        placeholder="选择日期时间"
                        default-time="12:00:00"
                    ></el-date-picker>
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
        visiable: {
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
        }
    },
    data() {
        return {
            ruleForm: {
                vehicleCard: '',
                actualArriveDate: '',
                driver: '',
                driverContactWay: ''
            },
            rules: {
                actualArriveDate: [
                    {
                        required: true,
                        message: '请选择到车时间',
                        trigger: 'blur'
                    }
                ]
            }
        };
    },
    methods: {
        getData(data) {
            this.ruleForm.vehicleCard = data.vehicleCard;
            this.ruleForm.driver = data.driver;
            this.ruleForm.driverContactWay = data.driverContactWay;
            this.dispatchNo = data.dispatchNo;
            this.version = data.version; // 版本号
        },
        handleClose() {
            this.$emit('handleClose', '');
        },
        addOk(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.$emit('addOk', { state: true, data: this.ruleForm });
                    this.$emit('update:visiable', false);
                } else {
                    this.$emit('addOk', { state: false, form: valid, data: {} });
                    return false;
                }
            });
        }
    },
    created() {
        this.getData(this.dataVisiableLists);
    }
};
</script>

<style lang="less">
.asternDialog {
    .el-input--medium{
        font-size: 12px;
    }
    .el-input__inner{
        width: 174px;
        height: 34px;
    }
     .el-date-editor.el-input {
        width: 174px !important;
    }
}
</style>