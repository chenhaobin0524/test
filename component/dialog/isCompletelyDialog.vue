<template>
    <div>
        <el-dialog
            class="form-dialog"
            title="提示"
            :visible.sync="completeShaowForm"
            :before-close="handleCompleteFormClose"
            width="30%"
        >
            <span class="depart">是否完全装车？</span>
            <div slot="footer" class="dialog-footer">
                <el-button @click="handleCompleteFormClose">否</el-button>
                <el-button type="primary" @click="completeStartForm">是</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    props: {
        completeShaowForm: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {

        };
    },
    methods: {
        handleCompleteFormClose() {
            this.$emit('handleCompleteFormClose', '');
        },
        completeStartForm() {
            this.$emit('completeStartForm', '');
        }
    }
};
</script>

<style lang="less">

</style>