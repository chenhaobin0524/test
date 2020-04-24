<template>
    <div class="wrapper-report">
        <keep-alive :include="cachedViews">
            <router-view></router-view>
        </keep-alive>
    </div>
</template>
<script>
export default {
    name: 'orderManage',
    data() {
        return {
        };
    },
    computed: {
        cachedViews() {
            return this.$store.state.cachedViews;
        }
    }
};
</script>

<style lang="less">
.wrapper-report{
    flex: 1;
    display: flex;
}
</style>
