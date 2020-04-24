<template>
    <el-dialog
        class="otp-handler-overdue-dialog"
        title="逾期"
        :visible.sync="visiable"
        :append-to-body="true"
        width="500px">
        <template v-if="isAllOut">
            <el-form ref="formOut" :model="form" label-width="100px">
                <el-form-item label="到货逾期原因" required>
                    <el-col :span="11">
                        <el-form-item prop="arriveOverdueReason1">
                            <el-select v-model="form.arriveOverdueReason1" placeholder="一级原因">
                                <el-option v-for="(label, key) in overdueArrive1" :label="label" :value="key" :key="key"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="2">&nbsp;</el-col>
                    <el-col :span="11">
                        <el-form-item prop="arriveOverdueReason2">
                            <el-select v-model="form.arriveOverdueReason2" placeholder="二级原因">
                                <el-option v-for="(label, key) in overdueArrive2" :label="label" :value="key" :key="key"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-form-item>
                <el-form-item label="到货联系人" required>
                    <el-col :span="11">
                        <el-form-item prop="arriveOverdueContactName">
                            <el-input v-model="form.arriveOverdueContactName" placeholder="请输入联系人" autocomplete="off"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="2">&nbsp;</el-col>
                    <el-col :span="11">
                        <el-form-item prop="arriveOverdueContactMobile">
                            <el-input v-model.number="form.arriveOverdueContactMobile" placeholder="请输入联系电话" autocomplete="off"></el-input>
                        </el-form-item>
                    </el-col>
                </el-form-item>
                <el-form-item label="到货描述" prop="arriveOverdueRemark">
                    <el-input type="textarea" v-model="form.arriveOverdueRemark"></el-input>
                </el-form-item>
                <div class="br"></div>
                <el-form-item label="出库逾期原因" required>
                    <el-col :span="11">
                        <el-form-item prop="overdueReason1">
                            <el-select v-model="form.overdueReason1" placeholder="一级原因">
                                <el-option v-for="(label, key) in overdueOut1" :label="label" :value="key" :key="key"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="2">&nbsp;</el-col>
                    <el-col :span="11">
                        <el-form-item prop="overdueReason2">
                            <el-select v-model="form.overdueReason2" placeholder="二级原因">
                                <el-option v-for="(label, key) in overdueOut2" :label="label" :value="key" :key="key"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-form-item>
                <el-form-item label="出库联系人" required>
                    <el-col :span="11">
                        <el-form-item prop="contactName">
                            <el-input v-model="form.contactName" placeholder="请输入联系人" autocomplete="off"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="2">&nbsp;</el-col>
                    <el-col :span="11">
                        <el-form-item prop="contactMobile">
                            <el-input v-model.number="form.contactMobile" placeholder="请输入联系电话" autocomplete="off"></el-input>
                        </el-form-item>
                    </el-col>
                </el-form-item>
                <el-form-item label="出库描述" prop="overdueRemark">
                    <el-input type="textarea" v-model="form.overdueRemark"></el-input>
                </el-form-item>
            </el-form>
        </template>
        <template v-if="isAllIn">
            <el-form ref="formIn" :model="form" label-width="80px">
                <el-form-item label="逾期原因" required>
                    <el-col :span="11">
                        <el-form-item prop="overdueReason1">
                            <el-select v-model="form.overdueReason1" placeholder="一级原因" @change="overdueReason1Change">
                                <el-option v-for="(label, key) in overdueIn1" :label="label" :value="key" :key="key"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="2">&nbsp;</el-col>
                    <el-col :span="11">
                        <el-form-item prop="overdueReason2">
                            <el-select v-model="form.overdueReason2" placeholder="二级原因" @change="overdueReason2Change">
                                <el-option v-for="(label, key) in overdueIn2" :label="label" :value="key" :key="key"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-form-item>
                <el-form-item label="描述" prop="overdueRemark">
                    <el-input type="textarea" v-model="form.overdueRemark"></el-input>
                </el-form-item>
                <el-form-item label="是否剔除" prop="overdueExcludeFlag">
                    <el-switch class="demo"
                        v-model="form.overdueExcludeFlag"
                        active-text="是"
                        active-value="1"
                        inactive-text="否"
                        inactive-value="0"
                        disabled>
                    </el-switch>
                </el-form-item>
            </el-form>
        </template>

        <span slot="footer" class="dialog-footer">
            <el-button @click="visiable = false">取 消</el-button>
            <el-button type="primary" @click="submit" v-loading="btnLoading">确 定</el-button>
        </span>
    </el-dialog>
</template>
<script>
import { dictWithUrl } from '@/components/otpPanel/api';
import {
    saveOverdueRegistration
} from '../../../../api/taskCenter';
export default {
    data() {
        return {
            btnLoading: false,
            visiable: false,
            isAllOut: false,
            isAllIn: false,
            overdueIn1: [],
            overdueIn2: [],
            overdueIn2Backup: [],
            overdueOut1: [],
            overdueOut2: [],
            overdueOut2Backup: [],
            overdueArrive1: [],
            overdueArrive2: [],
            overdueArrive2Backup: [],
            form: {
                contactName: '',
                contactMobile: '',
                overdueReason1: '',
                overdueReason2: '',
                overdueRemark: '',
                arriveOverdueReason1: '',
                arriveOverdueReason2: '',
                arriveOverdueContactName: '',
                arriveOverdueContactMobile: '',
                arriveOverdueRemark: '',
                overdueExcludeFlag: ''
            },
            rules: {
                contactName: [
                    { required: true, message: '请输入联系人', trigger: 'blur' }
                ],
                contactMobile: [
                    { required: true, message: '请输入联系电话', trigger: 'blur' },
                    { pattern: /^1\d{10}$/, message: '请输入正确的电话格式', trigger: 'blur' }
                ],
                overdueReason1: [
                    { required: true, message: '请选择一级原因', trigger: 'change' }
                ],
                overdueReason2: [
                    { required: true, message: '请选择二级原因', trigger: 'change' }
                ],
                arriveOverdueContactName: [
                    { required: true, message: '请输入联系人', trigger: 'blur' }
                ],
                arriveOverdueContactMobile: [
                    { required: true, message: '请输入联系电话', trigger: 'blur' },
                    { pattern: /^1\d{10}$/, message: '请输入正确的电话格式', trigger: 'blur' }
                ],
                arriveOverdueReason1: [
                    { required: true, message: '请选择一级原因', trigger: 'change' }
                ],
                arriveOverdueReason2: [
                    { required: true, message: '请选择二级原因', trigger: 'change' }
                ]
            }
        };
    },
    watch: {
        'form.overdueReason1'(val) {
            if (this.isAllIn) {
                this.overdueIn2 = Object.keys(this.overdueIn2Backup).reduce((result, key) => {
                    if (key && key.split('_')[0] === val) {
                        result[key] = this.overdueIn2Backup[key];
                    }
                    return result;
                }, {});
            } else {
                this.overdueOut2 = Object.keys(this.overdueOut2Backup).reduce((result, key) => {
                    if (key && key.split('_')[0] === val) {
                        result[key] = this.overdueOut2Backup[key];
                    }
                    return result;
                }, {});
            }
            this.form.overdueReason2 = '';
        },
        'form.arriveOverdueReason1'(val) {
            this.overdueArrive2 = Object.keys(this.overdueArrive2Backup).reduce((result, key) => {
                if (key && key.split('_')[0] === val) {
                    result[key] = this.overdueArrive2Backup[key];
                }
                return result;
            }, {});
            this.form.arriveOverdueReason2 = '';
        }
    },
    methods: {
        _reset() {
            this.form = {
                contactName: '',
                contactMobile: '',
                overdueReason1: '',
                overdueReason2: '',
                overdueRemark: '',
                arriveOverdueReason1: '',
                arriveOverdueReason2: '',
                arriveOverdueContactName: '',
                arriveOverdueContactMobile: '',
                arriveOverdueRemark: ''
            };
        },
        _map2Option(map) {
            return Object.keys(map).map(key => {
                return {
                    label: map[key],
                    value: key
                };
            });
        },
        show(status = true, selectedRows) {
            if (!selectedRows || selectedRows.length === 0) {
                this.$message.warning('至少选择一条数据');
                return;
            }
            const isAllIn = this.isAllIn = selectedRows.filter(item => item.inOutType === 'IN').length === selectedRows.length;
            const isAllOut = this.isAllOut = selectedRows.filter(item => item.inOutType === 'OUT').length === selectedRows.length;
            if (!(isAllIn || isAllOut)) {
                this.$message.warning('选中数据必须都为出库任务或者入库任务才能操作');
                return;
            }
            const optionsNum = isAllIn ? 'OVERDUE_IN_1,OVERDUE_IN_2' : 'OVERDUE_OUT_1,OVERDUE_OUT_2,OVERDUE_ARRIVE_1,OVERDUE_ARRIVE_2';
            dictWithUrl(optionsNum).then(res => {
                if (res && res.code === '0') {
                    if (isAllIn) {
                        this.overdueIn1 = res.data.OVERDUE_IN_1;
                        this.overdueIn2Backup = res.data.OVERDUE_IN_2;
                    } else {
                        this.overdueOut1 = res.data.OVERDUE_OUT_1;
                        this.overdueOut2Backup = res.data.OVERDUE_OUT_2;

                        this.overdueArrive1 = res.data.OVERDUE_ARRIVE_1;
                        this.overdueArrive2Backup = res.data.OVERDUE_ARRIVE_2;
                    }
                }
            });
            this.selectedRows = selectedRows;
            this.visiable = status;
            this._reset();
            setTimeout(() => {
                this.$refs[this.isAllIn ? 'formIn' : 'formOut'].resetFields();
            }, 50);
        },
        submit() {
            this.btnLoading = true;
            this.$refs[this.isAllIn ? 'formIn' : 'formOut'].validate(async (valid) => {
                if (valid) {
                    let params = {
                        orderNo: [],
                        parentOrderNo: [],
                        customerOrderNo: []
                    };
                    this.selectedRows.forEach(element => {
                        params.orderNo.push(element.orderNo);
                        params.parentOrderNo.push(element.parentOrderNo);
                        params.customerOrderNo.push(element.customerOrderNo);
                    });
                    params = { ...params, ...this.form };
                    const res = await saveOverdueRegistration(params);
                    if (res && res.code === '0') {
                        this.$message.success('操作成功');
                        this.visiable = false;
                    }
                }
                this.btnLoading = false;
            });
        },
        overdueReason1Change(val) {
            this.form.overdueExcludeFlag = '';
        },
        overdueReason2Change(val) {
            if (val && +this.form.overdueReason1 === 2) {
                this.form.overdueExcludeFlag = '0';
            } else if (val && (+this.form.overdueReason1 === 1 || +this.form.overdueReason1 === 3)) {
                this.form.overdueExcludeFlag = '1';
            }
        }
    }
};
</script>
<style lang="less">
.otp-handler-overdue-dialog {
    .br {
        border-bottom: 1px solid #cecece;
        margin-bottom: 20px;
    }
    .demo .el-switch__label {
        position: absolute;
        display: none;
        color: #fff;
    }

    /*打开时文字位置设置*/

    .demo .el-switch__label--right {
        z-index: 1;
        right: -10px;
    }

    /*关闭时文字位置设置*/

    .demo .el-switch__label--left {
        z-index: 1;
        left: 26px;
    }

    /*显示文字*/

    .demo .el-switch__label.is-active {
        display: block;
    }

    .demo.el-switch .el-switch__core,
    .el-switch .el-switch__label {
        width: 60px !important;
    }
}
</style>