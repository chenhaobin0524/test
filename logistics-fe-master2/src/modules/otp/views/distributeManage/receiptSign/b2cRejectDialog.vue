<template>
     <!-- B2C+直配 拒收 弹框 -->
    <el-dialog
        :closeOnClickModal='false'
        width="50%"
        title="菜鸟用户拒收"
        :before-close="beforeClose"
        :visible="true"
        append-to-body>

        <el-form
            class="demo-form">
            <div class="reason">
                <el-form-item class="demo-form">
                    <el-select v-model="rejectReason" placeholder="拒收原因" clearable style="width: 400px">
                        <el-option
                            v-for="(item, index) in reasonOptions"
                            :key="index"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item class="demo-form">
                    <el-input
                        v-model.trim="signRemark"
                        type="textarea"
                        :rows="4"
                        maxlength="30"
                        placeholder="拒收备注">
                    </el-input>
                </el-form-item>
            </div>
        </el-form>

        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="confirm">确 认</el-button>
        </div>
    </el-dialog>
</template>
<script>
import { receiptRejectsign } from '../../../api/receiptSign';
import { getDictionaryDetailByCode } from '../../../api/common';
import { mapGetters } from 'vuex';
export default {
    props: {
        b2cRejectShow: {
            type: Boolean,
            default() {
                return false;
            }
        },
        getParams: {
            type: Function,
            default() {
                return () => {};
            }
        },
        closeDialogAndRefreshData: {
            type: Function,
            default() {
                return () => {};
            }
        }
    },
    data() {
        return {
            signRemark: '',
            rejectReason: '',
            reasonOptions: []
        };
    },
    methods: {
        confirm() {
            if (!this.rejectReason) {
                this.$message.warning('请选择拒收原因');
                return false;
            } else if (!this.signRemark) {
                this.$message.warning('请填写拒收备注');
                return false;
            }
            const params = this.getParams('03')[0];
            params.signRemark = this.signRemark;
            params.rejectReason = this.rejectReason;
            receiptRejectsign(params).then(res => {
                if (res) {
                    this.$message({
                        type: 'success',
                        message: '拒收成功'
                    });
                    this.$emit('update:b2cRejectShow', false);
                    // 关闭弹框并刷新首页列表数据
                    this.closeDialogAndRefreshData();
                }
            }).catch(() => {
            });
        },
        beforeClose() {
            this.$emit('update:b2cRejectShow', false);
        },
        // 获取拒收原因
        getRejectReason() {
            const params = {
                dictCodes: 'SYS_TMS_ELS_REJECT_REASON'
                // tenantCode: this.currentTenant.tenantCode
            };
            getDictionaryDetailByCode(params).then(res => {
                const dataObj = res.data.SYS_TMS_ELS_REJECT_REASON;
                Object.keys(dataObj).forEach(key => {
                    this.reasonOptions.push({
                        label: dataObj[key],
                        value: key
                    });
                });
            });
        }
    },
    created () {
        // 获取拒收原因
        this.getRejectReason();
    },
    computed: {
        ...mapGetters(['currentTenant'])
    }
};
</script>
