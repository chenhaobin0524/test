<template>
    <div class="sider-bar"
        @click="collapseToggle"
    >
        <core-sidebar-menus :menuCollpased='menuCollpased' :menus='menus' :menuTitle='menuTitle'></core-sidebar-menus>
    </div>
</template>
<style lang="less">
.sider-bar {
    display: flex;
}
</style>
<script>
import CoreSidebarMenus from './CoreSidebarMenus';
import { mapGetters } from 'vuex';

export default {
    data() {
        return {
            menuCollpased: false
        };
    },
    computed: {
        ...mapGetters(['menus', 'menuTitle'])
    },
    methods: {
        toggleCollapse() {
            this.collapse = !this.collapse;
        },
        collapseToggle(e) {
            if (e.target.classList.contains('el-menu')) {
                this.menuCollpased = !this.menuCollpased;
                e.stopPropagation();
            }
        }
    },
    components: {
        CoreSidebarMenus
    }
};
</script>
