<template>
    <el-container class="system-app">
        <el-container>
            <el-aside width="200" :class="isCollapsed ? 'menu-collapsed' : 'menu-expanded'" @mouseenter.native="handleMouseEnter" @mouseleave.native="handleMouseLeave">
                <core-sidebar-menus :menus="menus" :collapse="isCollapsed"></core-sidebar-menus>
            </el-aside>
            <el-main class="mail-panel">
                <TagsView />
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>
<script>
import { CoreSidebarMenus } from '@/components/core/themes/default/';
import { mapGetters } from 'vuex';
import TagsView from '@/components/core/tags_nav/index.vue';
export default {
    data() {
        return {
            isCollapsed: true,
            Timeout: null
        };
    },
    computed: {
        rotateIcon() {
            return ['menu-icon', this.isCollapsed ? 'rotate-icon' : ''];
        },
        menuitemClasses() {
            return ['menu-item', this.isCollapsed ? 'collapsed-menu' : ''];
        },
        menus() {
            return this.authority.length ? this.authority.map(item => {
                item['fdFrontLink'] = item.frontUrl;
                item['path'] = item.frontUrl;
                item['name'] = item.resourceName;
                return item;
            }) : [];
        },
        ...mapGetters(['tags', 'authority'])
    },
    methods: {
        handleToggleClick() {
            this.$refs.sideMenu.toggleCollapse();
        },
        handleTabRemove(name) {
            this['tab' + name] = false;
        },
        tebChange() {
            this.isCollapsed = !this.isCollapsed;
        },
        handleMouseEnter() {
            clearTimeout(this.Timeout);
            this.Timeout = setTimeout(() => {
                this.isCollapsed = false;
            }, 300);
        },
        handleMouseLeave() {
            clearTimeout(this.Timeout);
            this.Timeout = setTimeout(() => {
                this.isCollapsed = true;
            }, 300);
        }
    },
    components: {
        CoreSidebarMenus,
        TagsView
    }
};
</script>
<style lang="less">
.menu-expanded {
    width: 200px;
    transition: width 0.2s ease;
    .el-menu:not(.el-menu--collapse) {
        width: 200px;
    }
}
.system-app {
    .menu-collapsed {
        width: 64px;
        transition: width 0.2s ease;
    }
    .mail-panel{
        display: flex;
        flex-direction: column;
    }
}
</style>