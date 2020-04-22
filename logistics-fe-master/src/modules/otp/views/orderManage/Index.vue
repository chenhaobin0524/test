<template>
    <div class="wrapper-order">
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
.wrapper-order{
    flex: 1;
    /*overflow: hidden;*/
    display: flex;
}
</style>
