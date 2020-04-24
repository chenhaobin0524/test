<template>
    <div id="view-bill">
        <el-dialog title="视图建单" :visible.sync="viewList" width="800px" @close="closeDialog">
            <el-form :model="viewsListForm" :rules="rules" ref="viewsListForm" label-width="100px"
                     class="demo-ruleForm">
                <el-row :gutter="5">
                    <el-col :span="11">
                        <el-form-item label="数据来源系统" prop="sourceSystem">
                            <otpSelect :optionNum="'SOURCE_SYSTEM'"
                                       :filterable="true"
                                       :prop="'sourceSystem'"
                                       :mValue="viewsListForm['sourceSystem']"
                                       @getSelectValue="_updateProps"></otpSelect>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="客户订单号" prop="customerOrderNo">
                            <el-input v-model="viewsListForm.customerOrderNo"
                                      placeholder="请输入客户订单号"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="5">
                    <el-col :span="11">
                        <el-form-item label="客户" prop="customerCode"
                            :required="viewsListForm['sourceSystem'] === ccs ? false : true">
                            <otpAdvance
                                :params="basicData.customerOrderNoCode"
                                :mValue="viewsListForm.customerName"
                                @getAdvanceValue="_updateProps"></otpAdvance>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="服务平台" prop="siteCode"
                            :required="viewsListForm['sourceSystem'] === ccs ? false : true">
                            <otpAdvance
                                :params="basicData.serviceTypeCode"
                                :mValue="viewsListForm.siteName"
                                @getAdvanceValue="_updateProps"></otpAdvance>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="viewList = false">取消</el-button>
                <Throttle delay="500">
                    <el-button type="primary" @click="submit" v-loading="btnLoading">确定</el-button>
                </Throttle>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import otpAdvance from '@/components/lots/otpAdvance';
import Throttle from '@/components/lots/debounce/Debounce';
import otpSelect from '@/components/lots/otpSelect';
import { viewCreateOrder } from '../../../../api/orderCenter';

export default {
    components: { otpAdvance, otpSelect, Throttle },
    props: { basicData: Object },
    data() {
        const customerValida = (rule, value, callback) => {
            if (this.viewsListForm.sourceSystem !== this.ccs && value === '') {
                return callback(new Error('请选择客户'));
            } else {
                return callback();
            }
        };
        const siteValida = (rule, value, callback) => {
            if (this.viewsListForm.sourceSystem !== this.ccs && value === '') {
                return callback(new Error('请选择服务平台'));
            } else {
                return callback();
            }
        };
        return {
            ccs: 'CCS',
            viewList: false,
            btnLoading: false,
            // 视图建单
            viewsListForm: {
                customerCode: '',
                customerOrderNo: '',
                sourceSystem: '',
                siteCode: ''
            },
            rules: {
                customerOrderNo: [
                    { required: true, message: '请输入客户订单号', trigger: 'blur' },
                    { max: 32, message: '最大长度为32位', trigger: 'blur' }
                ],
                customerCode: [
                    { message: '请选择客户', trigger: ['blur', 'change'], validator: customerValida }
                ],
                sourceSystem: [
                    { required: true, message: '请选择数据来源系统', trigger: 'blur' }
                ],
                siteCode: [
                    { message: '请选择服务平台', trigger: ['blur', 'change'], validator: siteValida }
                ]
            }
        };
    },
    methods: {
        viewBill() {
            this.viewList = true;
        },
        _updateProps(data) {
            Object.assign(this.viewsListForm, data);
        },
        submit() {
            this.btnLoading = true;
            this.$refs['viewsListForm'].validate(async (valid) => {
                if (valid) {
                    const res = await viewCreateOrder(this.viewsListForm);
                    if (res && res.code === '0') {
                        this.$message.success('建单成功');
                        this.viewList = false;
                        this.$emit('viewBill-success', this.viewsListForm.customerOrderNo);
                    }
                }
                this.btnLoading = false;
            });
        },
        closeDialog() {
            this.$refs['viewsListForm'].resetFields();
            this.viewsListForm = {
                customerCode: '',
                customerName: '',
                customerOrderNo: '',
                sourceSystem: '',
                siteCode: '',
                siteName: ''
            };
        }
    }
};
</script>

<style lang="less">
    #view-bill{
        .el-form-item__content {
            .el-input-group {
                vertical-align: middle;
            }
        }
    }
</style>