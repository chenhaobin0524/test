<template>
    <div>
         <el-dialog
            class="form-dialog"
            title="提示"
            :visible.sync="cellShaowForm"
            :before-close="handleCellFormClose"
            width="30%"
        >
            <span class="depart">是否取消发车单？</span>
            <div slot="footer" class="dialog-footer">
                <el-button @click="handleCellFormClose">否</el-button>
                <el-button type="primary" @click="cellStartForm">是</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    props: {
        cellShaowForm: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {

        };
    },
    methods: {
        handleCellFormClose() {
            this.$emit('handleCellFormClose', '');
        },
        cellStartForm() {
            this.$emit('cellStartForm', '');
        }
    }
};
</script>

<style lang="less">

</style>