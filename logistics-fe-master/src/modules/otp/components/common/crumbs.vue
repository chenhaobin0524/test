<template>
    <el-breadcrumb class="app-breadcrumb crumbsCss" separator="/">
        <transition-group name="breadcrumb">
            <el-breadcrumb-item v-for="(item,index) in levelList" :key="item.path">
                <span
                    v-if="item.redirect==='noRedirect'||index===levelList.length-1"
                    class="no-redirect"
                >{{ item.meta.title }}</span>
                <router-link v-else :to="item.redirect||item.path">{{ item.meta.title }}</router-link>
            </el-breadcrumb-item>
        </transition-group>
    </el-breadcrumb>
</template>

<script>
import pathToRegexp from 'path-to-regexp';

export default {
    name: 'crumbs',
    data() {
        return {
            levelList: null
        };
    },
    watch: {
        $route() {
            this.getBreadcrumb();
        }
    },
    created() {
        this.getBreadcrumb();
    },
    methods: {
        getBreadcrumb() {
            const matched = this.$route.matched.filter(
                item => item.meta && item.meta.title
            );
            // console.log(matched);
            // let brdStr = '';
            // matched.map(el => {
            //     console.log(el);
            //     brdStr += el.meta.title;
            // });
            this.levelList = matched.filter(
                item =>
                    item.meta &&
                    !item.meta.indexFlag &&
                    item.meta.title &&
                    item.meta.breadcrumb !== false
            );
        },
        // isDashboard(route) {
        //     const name = route && route.name;
        //     if (!name) {
        //         return false;
        //     }
        //     return (
        //         name.trim().toLocaleLowerCase() ===
        //         'departure'.toLocaleLowerCase()
        //     );
        // },
        pathCompile(path) {
            const { params } = this.$route;
            var toPath = pathToRegexp.compile(path);
            return toPath(params);
        },
        handleLink(item) {
            const { redirect, path } = item;
            if (redirect) {
                this.$router.push(redirect);
                return;
            }
            this.$router.push(this.pathCompile(path));
        }
    }
};
</script>

<style lang="less">
.app-breadcrumb.el-breadcrumb {
    display: inline-block;
    font-size: 14px;

    .no-redirect {
        color: #97a8be;
        cursor: text;
    }
}
.crumbsCss {
    width: 100%;
    padding: 13px
}
</style>
