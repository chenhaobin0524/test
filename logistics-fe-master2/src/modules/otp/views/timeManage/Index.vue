<template>
    <div class="relative-box">
        <keep-alive :include="cachedViews">
            <router-view></router-view>
        </keep-alive>
    </div>
</template>
<script>
export default {
    name: 'timeManage',
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
