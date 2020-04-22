<template>
    <div class="appoint-note">
        <el-dialog
            v-if="dialogVisible"
            :visible.sync="dialogVisible"
            title="预约备注"
            :before-close="handleClose"
            width="30%">
            <el-form ref="formDialog"
                :model="formData"
                :rules="rules"
                label-width="100px">
                <el-form-item prop="networkAppointmentStart" label="预约开始时间">
                    <el-date-picker
                        v-model="formData.networkAppointmentStart"
                        placeholder="预约开始时间"
                        type="datetime"
                        :picker-options="pickerOptionsStart">
                    </el-date-picker>
                </el-form-item>
                <el-form-item prop="networkAppointmentEnd" label="预约结束时间">
                    <el-date-picker
                        v-model="formData.networkAppointmentEnd"
                        placeholder="预约结束时间"
                        type="datetime"
                        :picker-options="pickerOptionsEnd">
                    </el-date-picker>
                </el-form-item>
                <el-form-item prop="networkAppointmentRemark" label="预约备注">
                    <el-input v-model="formData.networkAppointmentRemark" type="textarea" placeholder="请输入预约备注"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleClose">取 消</el-button>
                <el-button type="primary" @click="saveOk" :loading="loading">保 存</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import { networkAppointment } from '../../../../api/netTaskManage.js';
import formatTime from '@/utils/common.js';
export default {
    props: {
        dialogVisible: {
            type: Boolean,
            default: false
        },
        selected: {
            type: Array,
            default() {
                return [];
            }
        }
    },
    data() {
        return {
            rules: {},
            loading: false,
            formData: {
                networkAppointmentStart: '',
                networkAppointmentEnd: '',
                networkAppointmentRemark: ''
            },
            pickerOptionsStart: {
                disabledDate(time) {
                    return time.getTime() < Date.now() - 24 * 60 * 60 * 1000;
                }
            },
            pickerOptionsEnd: {
                disabledDate(time) {
                    return time.getTime() < Date.now() - 24 * 60 * 60 * 1000;
                }
            }
        };
    },
    methods: {
        handleClose() {
            this.$emit('handleClose');
        },
        saveOk() {
            this.$refs.formDialog.validate(valid => {
                if (valid) {
                    const orderNos = this.selected.map(item => item.orderNo);
                    if ((this.formData.networkAppointmentStart && !this.formData.networkAppointmentEnd) || (!this.formData.networkAppointmentStart && this.formData.networkAppointmentEnd)) {
                        return this.$message.warning('预约开始时间、预约结束时间，选择了其中一项则另一项需要必填');
                    }
                    if (this.formData.networkAppointmentStart - this.formData.networkAppointmentEnd > 0) {
                        return this.$message.warning('预约结束时间不能早于预约开始时间');
                    }
                    const params = {
                        networkAppointmentEnd: formatTime.formatDateTime(this.formData.networkAppointmentEnd),
                        networkAppointmentStart: formatTime.formatDateTime(this.formData.networkAppointmentStart),
                        networkAppointmentRemark: this.formData.networkAppointmentRemark,
                        orderNos: orderNos
                    };
                    this.loading = true;
                    networkAppointment(params).then(res => {
                        this.loading = false;
                        if (res && +res.code === 0) {
                            this.$message.success('预约成功');
                            this.$emit('saveOk');
                        }
                    }).catch(() => {
                        this.loading = false;
                    });
                }
            });
        }
    }
};
</script>

<style lang="less">
    .appoint-note {}
</style>
