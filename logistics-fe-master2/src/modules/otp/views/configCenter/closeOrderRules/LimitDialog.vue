<template>
    <!-- 原出库单限制 -->
    <el-dialog
        class="closeOrderRules"
        :closeOnClickModal='false'
        title="原出库单限制"
        :visible="true"
        :before-close="beforeClose"
        width="30%">
        <div class="form">
            <div class="form-label">原出库单订单类型：</div>
            <div class="form-content">
                <el-select v-model="relation.orderType" placeholder="请选择" :disabled="readonly" clearable>
                    <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </div>
        </div>
        <div class="form">
            <div class="form-label">原出库单是否自提：</div>
            <div class="form-content">
                <el-switch
                    class="demo"
                    :disabled="readonly"
                    active-value="1"
                    inactive-value="0"
                    v-model="relation.isDelivery"
                    active-color="#00BCBF"
                    inactive-color="#CECECE"
                    active-text='启用'
                    inactive-text='停用'>
                </el-switch>
            </div>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button @click="beforeClose">取消</el-button>
            <el-button type="primary" @click="confirm" v-if='!readonly'>确定</el-button>
        </div>
    </el-dialog>
</template>

<script>
export default {
    props: {
        row: {
            type: Object,
            default: () => ({})
        },
        readonly: {
            type: Boolean,
            default: false
        },
        visible: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            relation: {},
            options: []
        };
    },
    methods: {
        confirm() {
            this.row.extendEntity.relation = this.relation;
            this.$emit('response', this.row);
            this.close();
        },
        close() {
            this.$emit('update:visible', false);
        },
        beforeClose() {
            if (this.readonly) {
                this.close();
                return false;
            }
            this.$confirm('你确定要取消编辑吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.close();
            }).catch(() => {
            });
        },
        getSessionData() {
            let ORDER_TYPE = sessionStorage.ORDER_TYPE && JSON.parse(sessionStorage.ORDER_TYPE);
            ORDER_TYPE = ORDER_TYPE || {};
            this.options = Object.entries(ORDER_TYPE).map(item => ({ value: item[0], label: item[1] }));
        }
    },
    created() {
        this.relation = Object.assign({}, this.row.extendEntity.relation);
        this.getSessionData();
    }
};
</script>

<style lang="less">
.closeOrderRules {
    .form {
        display: flex;
        justify-content: center;
        align-items: center;
        padding-bottom: 20px;
    }
    .form-label {
        width: 130px;
        text-align: right;
        padding-right: 20px;
    }
    .form-content {
        flex: 1;
        max-width: 200px;
    }
    .el-select {
        width: 100%;
    }
    .demo .el-switch__label {
        position: absolute;
        display: none;
        color: #fff;
    }
    /*打开时文字位置设置*/
    .demo .el-switch__label--right {
        z-index: 1;
        right: -10px;
    }
    /*关闭时文字位置设置*/
    .demo .el-switch__label--left {
        z-index: 1;
        left: 26px;
    }
    /*显示文字*/
    .demo .el-switch__label.is-active {
        display: block;
    }
    .demo.el-switch .el-switch__core,
    .el-switch .el-switch__label {
        width: 60px !important;
    }
}
</style>