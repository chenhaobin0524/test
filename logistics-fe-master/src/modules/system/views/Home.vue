<template>
    <el-container class="system-app">
        <Aside />
        <el-container direction="vertical">
            <el-header height="50px">
                <TagsView />
            </el-header>
            <el-main class="mail-panel">
                <keep-alive :include="cachedViews">
                    <router-view></router-view>
                </keep-alive>
            </el-main>
        </el-container>
    </el-container>
</template>
<script>
import TagsView from '@/components/lots/themes/tags_nav/index.vue';
import Aside from '@/components/lots/themes/aside/Aside';
export default {
    components: {
        TagsView,
        Aside
    },
    computed: {
        cachedViews() {
            return this.$store.state.cachedViews;
        }
    }
};
</script>
<style lang="less">
@import "../styles/common.less";
</style>