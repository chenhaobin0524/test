/**
* Created by CHENRC2 on 2018-1-10.
*/
<template>
    <div class="logo-and-menu">
        <div class="logo-wrap">
            <img src="../../../../assets/lc-logo.svg" class="logo-icon">
            <img v-if="!isCollapse" src="../../../../assets/lc-logo-text.svg" class="logo-text">
        </div>
        <el-menu class="left-menu" :open-names="['1']" accordion @on-select="handleMenuSelect"
            mode="vertical" @open="handleOpen" @close="handleClose" :collapse-transition="false" :collapse="isCollapse"
            background-color="#232F3D" text-color="#fff" active-text-color="#fff" :unique-opened="true">
            <SidebarItem :menus="menus" :collapse="isCollapse">
            </SidebarItem>
        </el-menu>
    </div>
</template>
<style lang="less">
.logo-and-menu {
    .logo-wrap {
        display: flex;
        height: 40px;
        justify-items: center;
        align-items: center;
        padding-left: 18px;
    }
    .logo-icon {
        width: 21px;
    }
    .logo-text {
        width: 120px;
        margin-left: 0;
    }
    .left-menu {
        border-right: 0 none;
        background-color: #232F3D;
        color: #fff;
        .routeLink {
            &.router-link-active {
                .el-menu-item {
                    background-color: #00a9ac !important;
                }
            }
        }
    }
}
</style>
<script>
import { navigate } from '../core';
import SidebarItem from './SidebarItem';
export default {
    name: 'CoreSidebarMenus',
    components: {
        SidebarItem
    },
    props: {
        menus: {
            type: Array,
            default () {
                return [];
            }
        },
        menuTitle: {
            default () {
                return '';
            }
        },
        menuCollpased: {
            default () {
                return false;
            }
        },
        collapse: {
            type: Boolean,
            default () {
                return true;
            }
        }
    },
    data() {
        return {
            menuchild: [],
            message: 'developer.message'
        };
    },
    computed: {
        isCollapse() {
            return this.collapse;
        }
    },
    methods: {
        // 菜单导航
        handleMenuSelect(routerLink) {
            navigate(this.$router, routerLink);
        },
        // 判断当前菜单子级是按钮还是空
        computedChildIsButtonOrNull(menu) {
            let hasSubOrNull = true;
            if (menu.children && menu.children.length > 0) {
                const childIsButton = menu.children.filter(m => m.fdType === 'F');
                hasSubOrNull = childIsButton.length > 0;
            }
            return hasSubOrNull;
        },
        handleOpen(key, keyPath) {},
        handleClose(key, keyPath) {}
    }
};
</script>
