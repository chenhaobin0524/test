<template>
    <div class="net-form-dialog">
        <el-dialog
            v-if="dialogVisible"
            :title="titleName"
            :visible.sync="dialogVisible"
            :width="dialogWidth"
            :before-close="handleClose">
            <el-form
                ref="formDialog"
                :model="formData"
                :rules="rules"
                :label-width="labelWidth"
                :inline="inline">
                <el-form-item
                    v-for="(item, index) in getConfigList()"
                    :key="index"
                    :prop="item.prop"
                    :label="item.label">
                    <el-input
                        v-if="item.type === 'input' || item.type === 'password' || item.type === 'textarea'"
                        v-model="formData[item.prop]"
                        :type="item.type"
                        :disabled="item.disabled"
                        :placeholder="item.placeholder"
                        clearable
                    />
                    <el-date-picker
                        v-else-if="item.type === 'datetime'"
                        v-model="formData[item.prop]"
                        type="datetime"
                        :placeholder="item.placeholder">
                    </el-date-picker>
                    <otpAdvance
                        :ref='item.prop'
                        class="advance-form-item"
                        v-else-if="item.type === 'netAdvance'"
                        :prop='item.prop'
                        :mValue="formData[item.prop]"
                        @getAdvanceValue="getNetValue"
                        :params="item.params">
                    </otpAdvance>
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
import OtpAdvance from '@/components/lots/otpAdvance';
export default {
    components: { OtpAdvance },
    props: {
        titleName: {
            type: String,
            default: ''
        },
        dialogWidth: {
            type: String,
            default: '30%'
        },
        dialogVisible: {
            type: Boolean,
            default: false
        },
        data: {
            type: Object,
            default() {
                return {};
            }
        },
        rules: {
            type: Object,
            default() {
                return {};
            }
        },
        labelWidth: {
            type: String,
            default: '100px'
        },
        fieldList: {
            type: Array,
            default() {
                return [];
            }
        },
        inline: {
            type: Boolean,
            default: true
        },
        loading: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            formData: {}
        };
    },
    methods: {
        getConfigList() {
            return this.fieldList.filter(item => !item.hasOwnProperty('show') || (item.hasOwnProperty('show') && item.show));
        },
        initData() {
            const data = {};
            this.fieldList.forEach(item => {
                if (this.data.hasOwnProperty(item.prop)) data[item.prop] = this.data[item.prop];
            });
            return data;
        },
        getNetValue(data) {
            this.formData.networkCode = data.networkCode;
            this.formData.networkName = data.networkName;
        },
        handleClose() {
            this.$emit('handleClose');
        },
        handleSave() {
            this.$emit('handleSave');
        }
    },
    mounted() {
        this.formData = this.initData();
    }
};
</script>
<style lang="less">
.net-form-dialog {
    .advance-form-item {
        margin-top: 6px;
    }
}
</style>
