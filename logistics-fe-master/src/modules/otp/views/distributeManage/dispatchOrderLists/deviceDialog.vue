<template>
    <!-- 设备弹框 -->
    <el-dialog
        v-dialogDrag
        class="dispatchOrder_deviceDialog"
        :closeOnClickModal='false'
        :before-close="beforeClose"
        :title="title"
        :visible="visible"
        width="30%">
        <el-input v-model.trim='params.deviceNo' placeholder='请输入设备号' :disabled="row.originDispatchStatus >= 40" clearable></el-input>
        <span slot="footer">
            <el-button type='primary' @click="bindBtn" v-if='isBind' :disabled="row.originDispatchStatus >= 40">绑 定</el-button>
            <div v-else>
                <el-button @click="unbindBtn">解 绑</el-button>
                <el-button type='primary' @click="changeBtn" :disabled="row.originDispatchStatus >= 40">修 改</el-button>
            </div>
        </span>
    </el-dialog>
</template>

<script>

import { saveupdatecancledevice } from '../../../api/dispatchOrder';
export default {
    props: {
        row: {
            type: Object,
            default: () => {
                return {};
            }
        },
        visible: {
            type: Boolean,
            default: () => {
                return false;
            }
        }
    },
    data() {
        return {
            isBind: true,
            dialogLoading: {}, // 弹框loading实例
            params: {
                deviceNo: '',
                deviceType: '00',
                dispatchDeviceOperateType: '',
                dispatchNo: ''
            },
            tableData: [],
            title: '设备绑定'
        };
    },
    methods: {
        fullLoading(status = true) {
            if (status) {
                this.dialogLoading = this.$loading({
                    target: '.dispatchOrder_deviceDialog > div',
                    background: 'rgba(255, 255, 255, .7)'
                });
            } else {
                this.dialogLoading.close();
            }
        },
        beforeClose() {
            this.$emit('update:visible', false);
        },
        bindBtn() {
            if (this.params.deviceNo.length === 0) {
                this.$message.warning('请输入设备号');
                return false;
            }
            this.params.dispatchDeviceOperateType = '0';
            this.fullLoading();
            saveupdatecancledevice(this.params).then(res => {
                if (res) {
                    this.$message.success('绑定成功');
                    this.$emit('refresh');
                    this.beforeClose();
                }
                this.fullLoading(false);
            }).catch(() => {
                this.fullLoading(false);
            });
        },
        unbindBtn() {
            this.$confirm('您确定要解绑吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.params.dispatchDeviceOperateType = '2';
                this.fullLoading();
                saveupdatecancledevice(this.params).then(res => {
                    if (res) {
                        this.$message.success('解绑成功');
                        this.$emit('refresh');
                        this.beforeClose();
                    }
                    this.fullLoading(false);
                }).catch(() => {
                    this.fullLoading(false);
                });
            }).catch(() => {
            });
        },
        changeBtn() {
            if (this.params.deviceNo.length === 0) {
                this.$message.warning('请输入设备号');
                return false;
            }
            this.params.dispatchDeviceOperateType = '1';
            this.fullLoading();
            saveupdatecancledevice(this.params).then(res => {
                if (res) {
                    this.$message.success('修改成功');
                    this.$emit('refresh');
                    this.beforeClose();
                }
                this.fullLoading(false);
            }).catch(() => {
                this.fullLoading(false);
            });
        }
    },
    created () {
        this.params.dispatchNo = this.row.dispatchNo;
        if (this.row.deviceNo !== undefined && this.row.deviceNo.length > 0) {
            this.isBind = false;
            this.title = '设备解绑/修改';
            this.params.deviceNo = this.row.deviceNo;
        }
    }
};
</script>

<style lang="less">
.dispatchOrder_deviceDialog {
    .el-input {
        width: 200px;
    }
    .el-dialog {
        min-width: 400px;
    }
    .el-dialog__body {
        text-align: center;
    }
}
</style>