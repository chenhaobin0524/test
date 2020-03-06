<template>
    <div class="wp">
        <el-aside ref="aside" width="200" class="wrapper" :class="isUnfold ? 'menu-isUnfold' : 'menu-collapsed'" @mouseenter.native="handleMouseEnter" @mouseleave.native="handleMouseLeave">
            <core-sidebar-menus :menus="menus" :collapse="isUnfold ? false : isCollapsed"></core-sidebar-menus>
            <div class="global-search" :class="isCollapsed ? '' : 'setBg'" v-if="showSearch">
                <el-input
                    ref="menuSerach"
                    placeholder="请输入内容"
                    v-model="searchMenuName"
                    @keyup.enter.native="handleEnter">
                    <i slot="prefix" style="font-size: 16px;margin-left: 9px;" class="el-input__icon el-icon-search"></i>
                </el-input>
            </div>
        </el-aside>
        <div class="fixed-point" v-if="!isCollapsed" @click="handleFixedChange">
            <i v-if="isUnfold" class="el-icon-lock"></i>
            <i v-else class="el-icon-unlock"></i>
        </div>
    </div>
</template>
<script>
import { CoreSidebarMenus } from '@/components/core/themes/default/';
import { mapGetters, mapMutations } from 'vuex';
const DELAY_TIME = 300;
export default {
    data() {
        return {
            isCollapsed: true,
            Timeout: null,
            searchMenuName: '',
            originMenu: [],
            isUnfold: false
        };
    },
    props: {
        showSearch: {
            type: Boolean,
            default: true
        }
    },
    computed: {
        menus() {
            return this.authority.length ? this.authority.map(item => {
                item['fdFrontLink'] = item.frontUrl;
                item['path'] = item.frontUrl;
                item['name'] = item.resourceName;
                return item;
            }) : [];
        },
        ...mapGetters(['authority'])
    },
    methods: {
        handleFixedChange() {
            if (window._paq) {
                if (this.isUnfold) {
                    window._paq.push(['trackEvent', 'Menu', 'Click', '取消固定菜单']);
                } else {
                    window._paq.push(['trackEvent', 'Menu', 'Click', '固定菜单']);
                }
            }
            this.isUnfold = !this.isUnfold;
            this.handleMouseLeave();
        },
        getResourceIds(v) {
            const tempArr = [];
            getId(v);

            function getId(v) {
                v.forEach(item => {
                    if (item.resourceType && +item.resourceType === 1 && item.subResources) {
                        getId(item.subResources);
                    } else if (item.resourceType && +item.resourceType === 2) {
                        tempArr.push(item);
                    }
                });
            }
            return tempArr;
        },
        handleEnter() {
            if (this.searchMenuName) {
                let temp = this.getResourceIds(this.originMenu);
                temp = temp.filter(item => {
                    return item.resourceName.indexOf(this.searchMenuName) !== -1;
                });
                this.updateAuthority(temp);
            } else {
                this.updateAuthority(this.originMenu);
            }
            if (window._paq) {
                window._paq.push(['trackEvent', 'Menu', 'Enter', '菜单搜索']);
            }
        },
        handleMouseEnter() {
            clearTimeout(this.Timeout);
            this.Timeout = setTimeout(() => {
                this.isCollapsed = false;
            }, DELAY_TIME);
        },
        handleMouseLeave() {
            clearTimeout(this.Timeout);
            this.Timeout = setTimeout(() => {
                if (!this.isUnfold) {
                    this.isCollapsed = true;
                }
            }, DELAY_TIME * 5);
        },
        ...mapMutations({
            updateAuthority: 'updateAuthority'
        })
    },
    components: {
        CoreSidebarMenus
    },
    created() {
        this.originMenu = JSON.parse(JSON.stringify(this.menus));
    },
    mounted() {
        // 添加菜单访问统计
        this.$nextTick(() => {
            const { aside } = this.$refs;
            aside.$el.addEventListener('click', function(e) {
                if (window._paq) {
                    let element = e.target;
                    if (element.classList.contains('menu-icon')) {
                        element = element.parentNode;
                    }
                    if (element.classList.contains('el-menu-item') || element.parentNode.classList.contains('el-menu-item')) {
                        window._paq.push(['trackEvent', 'Menu', 'Click', element.innerText]);
                    }
                }
            });
        });
    }
};
</script>
<style lang="less">
@delayTime: .3s;

.menu-isUnfold{
    width: 200px;
}
.menu-collapsed {
    width: 56px;
    transition: width 0.2s ease @delayTime * 5;
}
.menu-collapsed:hover {
    width: 200px;
    transition: width 0.2s ease @delayTime;
    .el-menu:not(.el-menu--collapse) {
        width: 200px;
    }
}
.wp{
    position: relative;
    .fixed-point{
        width: 24px;
        height: 50px;
        position: absolute;
        top: 50%;
        right: -24px;
        transform: translateY(-25px);
        background-color: #232F3D;
        color: #fff;
        border-top-right-radius: 7px;
        border-bottom-right-radius: 7px;
        text-align: center;
        line-height: 50px;
        cursor: pointer;
        z-index: 999;
        box-shadow: 2px 2px 5px #888888;
    }
}
.wrapper{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    &::-webkit-scrollbar {
        width: 6px;
        height: 6px;
    }
    &::-webkit-scrollbar-thumb {
        background-color: #666;
    }
    .global-search{
        margin-bottom: 11px;
        height: 30px;
        padding: 10px;
        .el-input{
            margin-left: -3px;
            .el-input__inner{
                padding-left: 35px;
                background-color: rgba(255,255,255,0);
                border: none;
                color: #fff;
            }
        }
    }
    .setBg{
        .el-input{
            .el-input__inner{
                padding-left: 35px;
                background-color: rgba(255,255,255,0.1);
            }
        }
    }
}
</style>