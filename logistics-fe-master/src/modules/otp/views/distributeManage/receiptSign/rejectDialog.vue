<template>
     <!-- 网批驳回 弹框 -->
    <el-dialog
        :closeOnClickModal='false'
        width="50%"
        title="驳回原因"
        :before-close="beforeClose"
        :visible="true"
        append-to-body>

        <el-form
            class="demo-form">
            <div class="reason">
                <el-form-item class="demo-form">
                    <el-input
                        v-model.trim="rejectInfo"
                        type="textarea"
                        :rows="4"
                        maxlength="30"
                        placeholder="客户签收问题"
                    ></el-input>
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
export default {
    props: {
        rejectShow: {
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
            rejectInfo: ''
        };
    },
    methods: {
        confirm() {
            const params = this.getParams('01')[0];
            params.receiptDetailResponse.itemDetails.forEach(item => {
                item.signRemark = this.rejectInfo || '客户签收问题';
            });
            receiptRejectsign(params).then(res => {
                if (res) {
                    this.$message({
                        type: 'success',
                        message: '驳回成功'
                    });
                    this.$emit('update:rejectShow', false);
                    // 关闭弹框并刷新首页列表数据
                    this.closeDialogAndRefreshData();
                }
            }).catch(() => {
            });
        },
        beforeClose() {
            this.$emit('update:rejectShow', false);
        }
    }
};
</script>
