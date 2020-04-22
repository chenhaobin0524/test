<template>
    <div id="dialogAppointment">
        <Dialog ref="dialog"
                :visible="visible"
                :dialog="dialogs"
                :mFormValue="formData"
                @closeDialog="closeDialog"
        >
            <template slot="formHeader">
                <el-row>
                    <el-col :span="5">任务号:</el-col>
                    <el-col :span="18" class="ml">{{appointmentData.taskNo}}</el-col>
                </el-row>
                <el-row>
                    <el-col :span="5">客户订单号:</el-col>
                    <el-col :span="18" class="ml">{{appointmentData.customerOrderNo}}</el-col>
                </el-row>
                <el-row>
                    <el-col :span="5">收件人信息:</el-col>
                    <el-col :span="18" class="ml">{{appointmentData.receiveMessage}}</el-col>
                </el-row>
                <el-row>
                    <el-col :span="5">客户要求送达时间:</el-col>
                    <el-col :span="18" class="ml">{{appointmentData.expectTime}}</el-col>
                </el-row>
            </template>
        </Dialog>
    </div>
</template>

<script>
import Dialog from '../../../../components/dialog/dialog';

export default {
    components: { Dialog },
    data() {
        return {
            visible: false,
            formData: {}
        };
    },
    mounted() {
    },
    methods: {
        showDialog() {
            this.$refs.dialog.setDayHeight('40px');
            this.visible = true;
        },
        closeDialog(value, type) {
            if (type !== 'negative' && type !== 'sure') {
                this.visible = false;
                return;
            }
            const formData = { ...this.formData, ...value, taskNo: this.appointmentData.taskNo };
            this.$emit('closeDialog', formData, type);
        }
    },
    props: {
        dialogs: Object,
        appointmentData: {
            type: Object,
            default() {
                return {
                    taskNo: '',
                    customerOrderNo: '',
                    receiveMessage: '',
                    expectTime: ''
                };
            }
        }
    }
};
</script>

<style lang="less">
    #dialogAppointment{
        .ml{
            margin-left:10px;
        }
    }

</style>