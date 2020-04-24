<template>
    <Paper>
        <el-card>
            示例页面
        </el-card>
    </Paper>
</template>
<style lang='less'>
</style>
<script>
import Paper from '@/components/core/paper/Paper';
export default {
    components: { Paper },
    data() {
        return {
            isCollapsed: false
        };
    },
    methods: {
        collapsedSider() {
            this.$refs.side1.toggleCollapse();
        }
    }
};
</script>
