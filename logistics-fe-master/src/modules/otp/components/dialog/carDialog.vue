<template>
    <div>
        <el-dialog
            class="form-dialog"
            title="提示"
            :visible.sync="diaShaow"
            :before-close="handleStartClose"
            width="30%"
        >
            <span class="depart">是否发车？</span>
            <div slot="footer" class="dialog-footer">
                <el-button @click="handleStartClose">否</el-button>
                <el-button type="primary" @click="start">是</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    props: {
        diaShaow: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {};
    },
    methods: {
        start() {
            this.$emit('start', '');
        },
        handleStartClose() {
            this.$emit('handleStartClose', '');
        }
    }
};
</script>

<style lang="less">

</style>