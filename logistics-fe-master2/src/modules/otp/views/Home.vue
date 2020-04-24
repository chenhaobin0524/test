<template>
    <el-container class="otp-app">
        <el-container>
            <Aside />
            <el-main class="mail-panel">
                <TagsView />
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
    data() {
        return {};
    },
    computed: {
        cachedViews() {
            return this.$store.state.cachedViews;
        }
    },
    components: {
        TagsView,
        Aside
    }
};
</script>
<style lang="less">
    .otp-app {
        .mail-panel{
            display: flex;
            flex-direction: column;
            overflow-x: hidden;
        }
        .el-input__inner {
            height: 28px !important;
        }
        .relative-box {
            position: relative;
        }
        .frame-dialog {
            position: absolute;
            background: rgba(0, 0, 0, .5);
        }
        .v-modal {
            position: absolute;
            background: transparent;
        }
        .mgl-10 {
            margin-left: 10px;
        }
    }
</style>