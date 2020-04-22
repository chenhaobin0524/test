<template>
    <div style="height: 89%">
        <keep-alive :include="cachedViews">
            <router-view></router-view>
        </keep-alive>
    </div>
</template>
<script>
export default {
    name: 'distributeManage',
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