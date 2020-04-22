<template>
    <el-dialog title="原出库单限制" :visible.sync="visiableDialog"
        :before-close="handleClose" width="30%">
        <el-form
            ref="formDialog"
            :model="formData"
            :rules="rules"
            label-width="130px">
            <el-form-item label="原出库单订单类型：">
                <selects
                    :mValue="formData.orderType"
                    :optionNum="'ORDER_TYPE'"
                    :prop="'orderType'"
                    :disabled="readonly"
                    @getSelectValue="getOrderType"
                ></selects>
            </el-form-item>
            <el-form-item label="原出库单是否自提：">
                <el-switch v-model="formData.isDelivery"
                active-value="1" inactive-value="0"
                :disabled="readonly"></el-switch>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button class="dialog-btn" @click="handleClose">取 消</el-button>
            <el-button class="dialog-cel" type="primary" @click="confirmClick" v-if="!readonly" :loading="loading">确 认</el-button>
        </div>
    </el-dialog>
</template>
<script>
import selects from '@/components/lots/otpSelect';
export default {
    components: { selects },
    props: {
        row: {
            type: Object,
            default: () => ({})
        },
        readonly: {
            type: Boolean,
            default: false
        },
        visiableDialog: {
            type: Boolean,
            default: false
        },
        relationData: {
            type: Object,
            default: function() {
                return {};
            }
        }
    },
    data() {
        return {
            formData: {
                orderType: '',
                orderTypeName: '',
                isDelivery: false
            },
            rules: {},
            loading: false
        };
    },
    methods: {
        handleClose() {
            this.$emit('handleClose');
        },
        getOrderType(data) {
            this.formData.orderType = data.orderType;
        },
        confirmClick() {
            this.row.extendEntity.relation = this.formData;
            this.$emit('response', this.row);
        }
    },
    mounted() {
        this.formData = { ...this.row.extendEntity.relation };
    }
};
</script>