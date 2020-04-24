<template>
    <el-dialog title="订单拦截" id="orderIntercept" width="35%" style="margin-top: 15vh;" :visible.sync="dialogFormVisible">
        <el-form>
            <el-form-item label="运单号" :label-width="formLabelWidth">
                <el-input v-model="orderWaybillNo.waybillNo"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="cancel">取 消</el-button>
            <el-button type="primary" @click="save">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
import { routeIntercept } from '../../../../api/orderCenter';
export default {
    data() {
        return {
            dialogFormVisible: false,
            orderWaybillNo: {
                waybillNo: ''
            },
            formLabelWidth: '75px'
        };
    },
    methods: {
        show(status = true) {
            this.dialogFormVisible = status;
        },
        cancel() {
            this.orderWaybillNo.waybillNo = '';
            this.dialogFormVisible = false;
            this.$emit('reflashList', true);
        },
        save() {
            const waybillNo = this.orderWaybillNo.waybillNo;
            if (!waybillNo) {
                this.$message.error('运单号不可为空!');
                return;
            }
            routeIntercept(this.orderWaybillNo).then(ref => {
                if (ref.code === '0') {
                    this.$message.success(ref.msg);
                    this.cancel();
                }
            });
        }
    }
};
</script>
<style lang="less">
#orderIntercept{
    .el-input{
        width: 90%;
    }
    .el-dialog__body{
        margin-bottom: -30px;
    }
}
</style>