<template>
    <div class="list-layout">
        <header class="list-header">
            <slot name="header-search"></slot>
            <slot name="header-button"></slot>
        </header>
        <main class="list-main" ref="listMain">
            <slot name="list" :tableHeight="tableHeight"></slot>
        </main>
        <footer class="list-footer">
            <slot name="footer"></slot>
        </footer>
    </div>
</template>
<style lang="less">
@import "./style.less";
</style>
<script>
export default {
    data() {
        return {
            tableHeight: 0
        };
    },
    mounted() {
        this.$nextTick(() => {
            this.resetTableHeight();
        });
        window.onresize = () => {
            this.resetListHeight();
            this.$nextTick(() => {
                this.resetTableHeight();
            });
        };
    },
    methods: {
        resetListHeight() {
            /* 将table 设置为一个较小的值，让 listMain 高度重新自适应 */
            this.tableHeight = 30;
        },
        resetTableHeight() {
            this.tableHeight = window.getComputedStyle(this.$refs['listMain']).height;
        }
    }
};
</script>