<template>
    <div class="delivery-methods">
        <el-dialog
            title="配送方式"
            :visible.sync="deliveryDialogVisiable"
            width="30%"
            :close-on-click-modal="false"
            :before-close="handleClose">
            <el-form :model="formData" label-position="right" label-width="150px" :rules="rules" ref="formDialog">
                <el-form-item label="配送方式更改为：" prop="DELIVERY">
                    <span>{{formData.deliveryName}}</span>
                </el-form-item>
                <el-form-item label="网点：" v-if="formData.deliveryType === 'NET'" class="label-form" prop="netName">
                    <otpAdvance
                        :disabled="true"
                        class="advance-form-item"
                        prop='netName'
                        :mValue="formData.netName"
                        @getAdvanceValue="getNetValue"
                        :params="netInfo">
                    </otpAdvance>
                </el-form-item>
                <el-form-item label="网点信息：" v-if="formData.deliveryType === 'NET'" class="net-info">
                    <span>{{netContact || '--'}} / {{netMobile || '--'}}</span><br/>
                    <span>{{netAddr}}</span>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleClose">取 消</el-button>
                <el-button type="primary" @click="handleConfirm" :loading="loading">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import OtpAdvance from '@/components/lots/otpAdvance';
import { updateDeliveryMethods, searchNetInfo } from '../../../../api/dispatchCenter.js';
export default {
    components: { OtpAdvance },
    props: {
        deliveryDialogVisiable: {
            type: Boolean,
            default: false
        },
        checkedSourceList: {
            type: Array,
            default() {
                return [];
            }
        }
    },
    data() {
        return {
            netInfo: {
                name: '网点',
                value: 'networkName',
                type: 'advance',
                advanceConfig: [
                    { prop: 'netName', value: '网点名称' },
                    { prop: 'netCode', value: '网点编码' }
                ],
                tableConfig: [
                    { prop: 'netName', value: '网点名称' },
                    { prop: 'netCode', value: '网点编码' }
                ],
                advanceUrl: '/netInfos',
                cbParams: ['netCode#networkCode', 'netName#networkName']
            },
            formData: {
                deliveryType: '',
                deliveryName: '',
                netCode: '',
                netName: ''
            },
            rules: {
                netName: [
                    { required: true, message: '网点不能为空', trigger: ['blur', 'change'] }
                ]
            },
            loading: false,
            netContact: '',
            netMobile: '',
            netAddr: ''
        };
    },
    methods: {
        getNetValue(data) {},
        handleClose() {
            this.$emit('deliveryClose');
        },
        handleConfirm() {
            this.$refs['formDialog'].validate((valid) => {
                if (valid) {
                    const taskNos = this.checkedSourceList.map(item => item.taskNo);
                    let params = {
                        taskNos: taskNos,
                        deliveryType: this.formData.deliveryType
                    };
                    if (this.formData.deliveryType === 'NET') {
                        params = {
                            ...params,
                            ...this.formData
                        };
                    }
                    this.loading = true;
                    updateDeliveryMethods(params).then(res => {
                        this.loading = false;
                        if (res) {
                            this.$message.success('修改配送方式成功');
                            this.$emit('deliveryOk');
                        }
                    }).catch(() => {
                        this.loading = false;
                    });
                }
            });
        },
        getNetInfo() {
            const taskNos = this.checkedSourceList.map(item => item.taskNo);
            const params = {
                taskNos: taskNos
            };
            searchNetInfo(params).then(res => {
                if (res) {
                    if (res.data.length === 0 && this.formData.deliveryType === 'NET') {
                        this.formData.netCode = '';
                        this.formData.netName = '';
                        this.$message.warning('没有网点信息，请先到网点覆盖范围配置');
                    } else {
                        const data = res.data;
                        this.formData.netCode = data[0].netCode;
                        this.formData.netName = data[0].netName;
                        this.netContact = data[0].netContact;
                        this.netMobile = data[0].netMobile;
                        this.netAddr = data[0].netAddr;
                    }
                }
            });
        }
    },
    created() {
        if (this.checkedSourceList[0].deliveryType === 'NET') {
            this.formData.deliveryType = 'DELIVERY';
            this.formData.deliveryName = '配送';
        } else if (this.checkedSourceList[0].deliveryType === 'DELIVERY') {
            this.formData.deliveryType = 'NET';
            this.formData.deliveryName = '网点配送';
        }
        this.getNetInfo();
    }
};
</script>
<style lang="less">
    .delivery-methods {
        .label-form {
            width: 75%;
        }
        .net-info {
            span {
                display: inline-block;
                height: 20px;
                line-height: 20px;
            }
        }
    }
</style>