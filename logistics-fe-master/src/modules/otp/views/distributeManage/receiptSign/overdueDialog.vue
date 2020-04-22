<template>
    <!-- 逾期 弹框 -->
    <el-dialog
        :closeOnClickModal='false'
        class="overdue receiptSignOverdue"
        title="逾期"
        :visible="true"
        :before-close="beforeClose"
        width="40%">
        <el-form
            ref="overdueForm"
            class="demo-ruleForm">
            <el-form-item class="label-form1">
                <el-select v-model="overdueForm.overdueType" placeholder="逾期类型" @change='change'>
                    <el-option
                        v-for="(item, index) in overdueTypeOptions"
                        :key="index"
                        :label="item.label"
                        :value="item.value"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item class="label-form2">
                <el-cascader
                    clearable
                    style='width: 90%;'
                    placeholder="逾期原因"
                    :options="overdueCauseTypeOption"
                    v-model="overdueForm.overdueCauseType"
                ></el-cascader>
            </el-form-item>
        </el-form>
        <el-input type="textarea" clearable placeholder="逾期原因描述" :autosize="{ minRows: 2, maxRows: 4}" v-model.trim="overdueForm.overdueDesc"></el-input>
        <div slot="footer" class="dialog-footer">
            <el-button @click="beforeClose">取 消</el-button>
            <el-button type="primary" @click="confirm">确 认</el-button>
        </div>
    </el-dialog>
</template>
<script>
import { receiptOverdue } from '../../../api/receiptSign';
import { mapState } from 'vuex';

export default {
    props: {
        overdueShaowDialog: {
            type: Boolean,
            default() {
                return false;
            }
        },
        selectData: {
            type: Array,
            default() {
                return [];
            }
        },
        overdueTypeOptions: {
            type: Array,
            default() {
                return [];
            }
        },
        overdueCauseTypeOptions: {
            type: Object,
            default() {
                return {};
            }
        },
        searchObj: {
            type: Object,
            default() {
                return {};
            }
        }
    },
    data() {
        return {
            overdueCauseTypeOption: [],
            dialogLoading: {}, // 弹框loading实例
            overdueForm: {
                overdueType: '',
                overdueCauseType: [],
                overdueDesc: ''
            }
        };
    },
    methods: {
        change(value) {
            this.overdueForm.overdueCauseType = '';
            this.overdueCauseTypeOption = this.overdueCauseTypeOptions[value];
        },
        loading(status = true) {
            if (status) {
                this.dialogLoading = this.$loading({
                    target: '.receiptSignOverdue > div',
                    background: 'rgba(255, 255, 255, .7)'
                });
            } else {
                this.dialogLoading.close();
            }
        },
        confirm() {
            if (this.overdueForm.overdueType === '') {
                this.$message({
                    message: '请选择逾期类型',
                    type: 'warning'
                });
                return false;
            }
            if (this.overdueForm.overdueCauseType.length === 0) {
                this.$message({
                    message: '请选择逾期原因',
                    type: 'warning'
                });
                return false;
            }
            const params = {};
            const mapObj = {};
            this.selectData.forEach(item => {
                mapObj[item.taskNo] = item.dispatchNo;
            });
            params.map = mapObj;
            params.overdueType = this.overdueForm.overdueType;
            params.overdueDesc = this.overdueForm.overdueDesc;
            params.overdueReason = this.overdueForm.overdueCauseType[0];
            params.overdueReasDetail = this.overdueForm.overdueCauseType[1];
            params.createUserCode = this.user.userCode;
            params.createUserName = this.user.userName;

            this.loading();
            receiptOverdue(params).then(res => {
                if (res) {
                    this.$message({
                        message: res.msg,
                        type: 'success'
                    });
                }
                this.$emit('update:overdueShaowDialog', false);
                this.$emit('refreshList', this.searchObj); // 更新首页列表数据
            }).catch(() => {
                this.loading(false);
            });
        },
        beforeClose() {
            this.$confirm('您确定要取消编辑吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$emit('update:overdueShaowDialog', false);
            }).catch(() => {
            });
        }
    },
    computed: {
        ...mapState({ user: state => state.user })
    }

};
</script>

<style lang="less">
.receiptSignOverdue > div {
    min-width: 670px;
}
.receiptTile {
    .demo-ruleForm {
        display: flex;
        .label-form1 {
            width: 180px;
        }
        .label-form2 {
            flex: 1;
            text-align: right;
        }
    }
}
</style>
