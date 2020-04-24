<template>
    <div class="form-dialog-g7">
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
                    v-if="item.type === 'input' || item.type === 'password'"
                    v-model="formData[item.prop]"
                    :type="item.type"
                    :disabled="item.disabled"
                    :placeholder="item.placeholder"
                    clearable
                />
                <otpAdvance
                    :ref='item.prop'
                    class="advance-form-item"
                    v-else-if="item.type === 'siteAdvance'"
                    :prop='item.prop'
                    :mValue="formData[item.prop]"
                    @getAdvanceValue="getSiteCodeValue"
                    :params="item.params">
                </otpAdvance>
                <otpAdvance
                    :ref='item.prop'
                    class="advance-form-item"
                    v-else-if="item.type === 'driverAdvance'"
                    :prop='item.prop'
                    :mValue="formData[item.prop]"
                    @getAdvanceValue="getDriverValue"
                    :params="item.params">
                </otpAdvance>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import OtpAdvance from '@/components/lots/otpAdvance';
export default {
    components: { OtpAdvance },
    props: {
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
        getSiteCodeValue(data) {
            this.formData.siteCode = data.siteCode;
            this.formData.siteName = data.siteName;
        },
        getDriverValue(data) {
            this.formData.driver = data.driver;
            this.formData.driverCard = data.driverIdentity;
            this.formData.driverContactWay = data.driverContactWay;
        }
    },
    mounted() {
        this.formData = this.initData();
    }
};
</script>
<style lang="less">
.form-dialog-g7 {
    .advance-form-item {
        margin-top: 6px;
    }
    .el-form-item__content {
        width: 180px;
    }
}
</style>