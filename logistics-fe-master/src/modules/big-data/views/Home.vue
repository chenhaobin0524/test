<template>
    <el-container class="big-data-app" style="position:relative;">
    <div class="home-nav" ref="imgNav">
        <img src="../images/nav.png" alt="" class="nav" @click="changeNav">
    </div>
    <transition name="slide-fade">
        <div id="menuId" ref="menuId" v-if="showNav">
            <div class="menuPadd"></div>
            <el-menu :default-active="$route.path"
                class="el-menu-vertical-demo"
                background-color="#204183"
                text-color="#94BBFF"
                active-text-color="#fff"
                router unique-opened>
                <el-menu-item index="/" @click="closeNav('/')">
                    <span slot="title">垛口看板</span>
                </el-menu-item>
                <!-- <el-menu-item index="2" @click="changeIndex('2')">
                    <span slot="title">垛口总览</span>
                </el-menu-item> -->
                <el-menu-item index="/warehouse-network" @click="closeNav('/warehouse-network')">
                    <span slot="title">仓储配送监控</span>
                </el-menu-item>
                <el-menu-item index="/storage-area-monitoring" @click="closeNav('/storage-area-monitoring')">
                    <span slot="title">备货区占用监控</span>
                </el-menu-item>
            </el-menu>
        </div>
    </transition>
    <router-view></router-view>
</el-container>
</template>
<script>
export default {
    data() {
        return {
            showNav: false,
            pathName: '/'
        };
    },
    mounted() {
        this.pathName = this.$route.path;
    },
    methods: {
        handleOpen() {

        },
        handleClose() {

        },
        // 按扭开关侧边导航
        changeNav() {
            this.showNav = !this.showNav;
            this.imgNavRoate();
        },
        // 判断路由是否切换，切换则改变导航和按钮样式
        closeNav(path) {
            if (this.pathName !== path) {
                this.showNav = false;
                this.pathName = path;
            }
            this.imgNavRoate();
        },
        // 控制按钮样式
        imgNavRoate() {
            if (this.showNav) {
                this.$refs.imgNav.style = 'transform: rotate(90deg)';
            } else {
                this.$refs.imgNav.style = 'transform: rotate(0deg)';
            }
        }
    }
};
</script>
<style lang="less">
.big-data-app {
    background: #284680!important;
    overflow-y: auto!important;
    .home-nav {
        position: absolute;
        left: 1.5rem;
        height: 1.2rem;
        width: 1.2rem;
        top: 1.7rem;
        z-index: 4;
        .nav {
            width: 100%;
        }
    }
    .home-nav:hover {
        cursor: pointer;
    }
    .el-menu-item:hover, .el-menu-item:focus, .el-menu-item:active {
        background-color: #1347A9!important;
    }
    .el-menu-item {
        font-size: 1.2rem;
        border-left: 4px solid transparent;
        height: 3.5rem;
        line-height: 3.5rem;
    }
    .is-active {
        background-color: #1347A9!important;
        border-radius: 3px;
        border-left: 4px solid #236CFF;
    }
    #menuId{
        z-index: 4;
        width: 13rem;
        height: calc(100% - 5rem);
        position: absolute;
        left: 0;
        top: 5rem;
        text-align: left;
        // transform: translateX(-13rem);
        border-radius: 5px;
        background: #204183;
        // 水平阴影 垂直阴影 模糊距离 阴影尺寸 阴影颜色 内/外阴影
        box-shadow: 0 2px 20px rgba(0, 0, 0, 0.39);
    }
    .menuPadd{
        padding-top: 2.5rem;
    }
    .slide-fade-enter-active {
        transform: translateX(0);
        transition: all .3s ease;
    }
    .slide-fade-leave-active {
        transition: all .3s ease;
    }
    .slide-fade-enter
        /* .slide-fade-leave-active for below version 2.1.8 */ {
        transform: translateX(-100%);
    }
    .slide-fade-leave-to{
        transform: translateX(-100%);
    }
}
</style>
