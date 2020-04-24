<template>
  <el-container class="mobile-app">
    <el-container>
      <Aside />
      <el-main ref="keepalive">
        <TagsView/>
        <keep-alive :include="cachedViews">
          <router-view></router-view>
        </keep-alive>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import TagsView from '@/components/core/tags_nav/index.vue';
import Aside from '@/components/lots/themes/aside/Aside';
export default {
    computed: {
        cachedViews() {
            return this.$store.state.cachedViews;
        },
        key() {
            return this.$route.fullPath;
        }
    },
    components: {
        TagsView,
        Aside
    }
};
</script>
<style lang="less">
.mobile-app {
  .mail-panel{
        display: flex;
        flex-direction: column;
        overflow-x: hidden;
    }
}
</style>