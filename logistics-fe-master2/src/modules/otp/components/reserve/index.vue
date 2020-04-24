<template>
    <div id="dialogAppointment">
        <Dialog ref="dialog"
                :visible="visible"
                :dialog="dialogs"
                :mFormValue="formData"
                :showTimePick="showTimePick"
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
import Dialog from '../dialog/dialog';

export default {
    components: { Dialog },
    data() {
        return {
            visible: false,
            formData: {},
            value: null,
            dialogs: {
                'type': 'date',
                'title': '预约',
                'dateType': 'future',
                'detailTime': '23:59:59',
                'width': '1000px',
                'hideFooter': true,
                'hideTable': true,
                'dayHeight': '20px',
                'dateConnect': 'appointTime',
                'calendarWidth': '30%',
                'formBoxWidth': '70%',
                'btnList': [{
                    'type': 'negative',
                    'text': '重置'
                }, {
                    'type': 'sure',
                    'text': '保存'
                }],
                'dialogForm': {
                    'inline': false,
                    'labelWidth': 7,
                    'inputWidth': 15,
                    'inputList': [{
                        'label': '预约时间',
                        'value': 'appointTime',
                        'prop': 'appointTime',
                        'placeholder': '预约时间',
                        'readOnly': true,
                        'span': 12,
                        'type': 'readonlyText'
                    }, {
                        'label': '改约一级原因',
                        'prop': 'appointReason',
                        'value': 'appointReason',
                        'readOnly': true,
                        'placeholder': '请选择',
                        'span': 12,
                        'type': 'dictionary',
                        'optionNum': 'OTP_CHANGE_RESERVATION_TYPE'
                    }, {
                        'label': '预约类型',
                        'prop': 'appointType',
                        'value': 'appointType',
                        'mustFill': false,
                        'readOnly': true,
                        'placeholder': '请选择',
                        'options': [],
                        'span': 12,
                        'type': 'dictionary'
                    }, {
                        'label': '改约二级原因',
                        'prop': 'secendAppointReason',
                        'value': 'secendAppointReason',
                        'readOnly': true,
                        'placeholder': '请选择',
                        'span': 12,
                        'type': 'dictionary',
                        'optionNum': 'OTP_SYS_TMS_MARK_SH'
                    }, {
                        'label': '预约异常类型',
                        'prop': 'exceptionType',
                        'value': 'exceptionType',
                        'readOnly': false,
                        'placeholder': '请选择',
                        'span': 12,
                        'type': 'dictionary',
                        'optionNum': 'CAINIAO_WMS_ERROR'
                    }, {
                        'label': '备       注',
                        'prop': 'remark',
                        'value': 'remark',
                        'placeholder': '备注',
                        'span': 12,
                        'type': 'text'
                    }]
                }
            }
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
            const formData = { ...this.formData, ...value, taskNo: this.appointmentData.taskNo };
            this.$emit('closeDialog', formData, type);
        }
    },
    props: {
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
        },
        showTimePick: Boolean
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