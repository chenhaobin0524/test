<template>
    <div>
        <el-dialog
            class="form-dialog"
            title="请选择仓库"
            :visible.sync="warehouseVisible"
            :before-close="warehouseClose"
            width="40%"
        >
            <div class="bill-dialog">
                <el-radio-group v-model="radio" @change="warehouseChange">
                    <el-radio :label="item.label" v-for="(item, index) in radioItems" :key="index">{{item.name}}</el-radio>
                </el-radio-group>
            </div>
            <div slot="footer" class>
                <el-button @click="warehouseClose">取 消</el-button>
                <el-button type="primary" @click="warehouseOk(radio)">确 认</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    props: {
        warehouseVisible: {
            type: Boolean,
            default: false
        },
        radioItems: {
            type: Array
        }
    },
    data() {
        return {
            radio: ''
        };
    },
    methods: {
        warehouseClose() {
            this.$emit('warehouseClose', '');
        },
        warehouseOk(radio) {
            this.$emit('warehouseOk', this.radio);
        },
        warehouseChange(radio) {
            this.$emit('warehouseChange', this.radio);
        }
    }
};
</script>

<style lang="less">

</style>