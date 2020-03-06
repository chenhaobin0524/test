<template>
    <div>
         <el-dialog
            class="form-dialog"
            title="提示"
            :visible.sync="cellShaow"
            :before-close="handleCellStaStartClose"
            width="30%"
        >
            <span class="depart">是否取消到车？</span>
            <div slot="footer" class="dialog-footer">
                <el-button @click="handleCellStaStartClose">否</el-button>
                <el-button type="primary" @click="cellStart">是</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    props: {
        cellShaow: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {

        };
    },
    methods: {
        handleCellStaStartClose() {
            this.$emit('handleCellStaStartClose', '');
        },
        cellStart() {
            this.$emit('cellStart', '');
        }
    }
};
</script>

<style lang="less">

</style>