/**
* Created by CHENRC2 on 2018-1-10.
*/
<template>
    <div class="wrapper-menu">
        <template v-for="menu in menus">
            <el-submenu :name="menu.frontUrl || menu.resourceCode" v-if="+menu.resourceType === 1 && menu.subResources && menu.subResources.length" :index="menu.resourceCode" :key="menu.resourceCode">
                <template slot="title" >
                    <span v-if="menu.resourceUrl && sub">
                        <img v-if="menu.resourceUrl.indexOf('//') > -1" :src="menu.resourceUrl" alt="icon" width="18" height="18">
                        <i v-else-if="menu.resourceUrl.indexOf('icon-') > -1" class="menu-icon" :class="menu.resourceUrl"></i>
                        <i v-else class="menu-icon el-icon-menu"></i>
                    </span>
                    <i v-else-if="sub" class="menu-icon el-icon-menu"></i>
                    <span slot="title" v-if="!collapse">{{menu.resourceName}}</span>
                </template>
                <sidebar-item :menus="menu.subResources" :sub='false'></sidebar-item>
            </el-submenu>
            <a :href="menu.frontUrl" target="_blank" v-else-if="menu.frontUrl&&menu.frontUrl.indexOf('http')>=0" :key="menu.resourceCode" class="routeLink">
                <el-menu-item :index="menu.resourceCode" :name="menu.frontUrl || menu.resourceCode">
                    <span v-if="menu.resourceUrl && sub">
                        <img v-if="menu.resourceUrl.indexOf('//') > -1" :src="menu.resourceUrl" alt="icon" width="18" height="18">
                        <i v-else-if="menu.resourceUrl.indexOf('icon-') > -1" class="menu-icon" :class="menu.resourceUrl"></i>
                        <i v-else class="menu-icon el-icon-menu"></i>
                    </span>
                    <i v-else-if="sub" class="menu-icon el-icon-menu"></i>
                    <span slot="title" v-if="!collapse">{{menu.resourceName}}</span>
                </el-menu-item>
            </a>
            <router-link :to="menu.frontUrl" v-else-if="+menu.resourceType === 2" :key="menu.resourceCode" class="routeLink">
                <el-menu-item :index="menu.resourceCode" :name="menu.frontUrl || menu.resourceCode">
                    <span v-if="menu.resourceUrl && sub">
                        <img v-if="menu.resourceUrl.indexOf('//') > -1" :src="menu.resourceUrl" alt="icon" width="18" height="18">
                        <i v-else-if="menu.resourceUrl.indexOf('icon-') > -1" class="menu-icon" :class="menu.resourceUrl"></i>
                        <i v-else class="menu-icon el-icon-menu"></i>
                    </span>
                    <i v-else-if="sub" class="menu-icon el-icon-menu"></i>
                    <span slot="title" v-if="!collapse">{{menu.resourceName}}</span>
                </el-menu-item>
            </router-link>
        </template>
    </div>
</template>
<style lang="less">
.wrapper-menu {
    .el-menu-item {
        height: 46px;
        line-height: 46px;
    }
    .menu-icon {
        display: inline-block;
        width: 24px;
        font-size: 16px;
        color: #fff;
        margin-right: 5px;
        margin-left: -5px;
        text-align: center;
    }
    .el-submenu {
        .menu-icon {
            margin-left: -5px;
            color: #fff;
        }
        .el-menu-item {
            height: 38px;
            line-height: 38px;
        }
        &.is-active .el-submenu__title {
            background-color: #1C2631!important;
        }
    }
    .el-submenu__title {
        height: 46px;
        line-height: 46px;
    }
}
</style>
<script>
import { navigate } from '../core';

export default {
    name: 'SidebarItem',
    props: {
        menus: {
            type: Array,
            default () {
                return [];
            }
        },
        collapse: {
            default () {
                return false;
            }
        },
        sub: {
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
    methods: {
        // 菜单导航
        handleMenuSelect(routerLink) {
            navigate(this.$router, routerLink);
        },
        // 判断当前菜单子级是按钮还是空
        computedChildIsButtonOrNull(menu) {
            let hasSubOrNull = true;
            if (menu && menu.subResources && menu.subResources.length > 0) {
                const childIsButton = menu.subResources.filter(m => m.fdType === 'F');
                hasSubOrNull = childIsButton.length > 0;
            }
            return hasSubOrNull;
        },
        handleOpen(key, keyPath) {},
        handleClose(key, keyPath) {}
    }
};
</script>
