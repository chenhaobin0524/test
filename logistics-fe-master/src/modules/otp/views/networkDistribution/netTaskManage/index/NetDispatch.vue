<template>
    <div class="appoint-note">
        <el-dialog
            v-if="dialogVisible"
            :visible.sync="dialogVisible"
            title="网点派工"
            :before-close="handleClose"
            width="30%">
            <el-form :model="formData" :inline="false" ref="formDialog" label-width="100px">
                <el-form-item prop="networkName" label="网点">
                    <el-input v-model="formData.networkName" disabled></el-input>
                </el-form-item>
                <el-form-item prop="engineerName" label="工程师">
                    <el-select placeholder="请选择" v-model="formData.engineerName"
                        @change="engineerChange">
                        <el-option
                            v-for="item in searchSelOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="engineerMobile" label="工程师联系方式">
                    <el-input v-model="formData.engineerMobile" disabled></el-input>
                </el-form-item>
                <el-form-item prop="netDispatchRemark" label="派工备注">
                    <el-input v-model="formData.netDispatchRemark" clearable></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleClose">取 消</el-button>
                <el-button type="primary" @click="handleSave" :loading="loading">保 存</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import { netDispatch, getEngineers } from '../../../../api/netTaskManage.js';
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
            loading: false,
            formData: {
                networkName: '',
                networkCode: '',
                engineerName: '',
                engineerNo: '',
                engineerMobile: '',
                netDispatchRemark: ''
            },
            searchSelOptions: []
        };
    },
    methods: {
        getEngineersList() {
            const params = {
                netCode: this.formData.networkCode
            };
            getEngineers(params).then(res => {
                this.searchSelOptions = [];
                if (res) {
                    res.data.map(item => {
                        this.searchSelOptions.push({
                            key: item.engineerNo,
                            value: item.engineerName,
                            engineerMobile: item.engineerMobile,
                            engineerNo: item.engineerNo
                        });
                    });
                    if (this.searchSelOptions.length === 1) {
                        this.formData.engineerName = this.searchSelOptions[0].value;
                        this.formData.engineerMobile = this.searchSelOptions[0].engineerMobile;
                        this.formData.engineerNo = this.searchSelOptions[0].engineerNo;
                    }
                }
            });
        },
        engineerChange(val) {
            this.searchSelOptions.forEach(item => {
                if (val === item.value) {
                    this.formData.engineerMobile = item.engineerMobile;
                    this.formData.engineerNo = item.engineerNo;
                }
            });
        },
        handleClose() {
            this.$emit('handleClose');
        },
        handleSave() {
            this.$refs.formDialog.validate(valid => {
                if (valid) {
                    const orderNos = this.selected.map(item => item.orderNo);
                    const params = {
                        ...this.formData,
                        orderNos: orderNos
                    };
                    this.loading = true;
                    netDispatch(params).then(res => {
                        this.loading = false;
                        if (res && +res.code === 0) {
                            this.$message.success('保存成功');
                            this.$emit('saveOk');
                        }
                    }).catch(() => {
                        this.loading = false;
                    });
                }
            });
        }
    },
    created() {
        if (this.selected.length < 1) return this.$message.warning('未选择单据');
        this.formData.networkCode = this.selected[0].networkCode;
        this.formData.networkName = this.selected[0].networkName;
        this.getEngineersList();
    }
};
</script>

<style lang="less">
    .appoint-note {
        .el-select {
            width: 100%;
        }
    }
</style>
