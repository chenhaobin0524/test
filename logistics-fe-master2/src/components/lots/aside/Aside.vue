<template>
    <el-aside width="200" class="wrapper" :class="isUnfold ? 'menu-isUnfold' : 'menu-collapsed'" @mouseenter.native="handleMouseEnter" @mouseleave.native="handleMouseLeave">
        <core-sidebar-menus :menus="menus" :collapse="isUnfold ? false : isCollapsed"></core-sidebar-menus>
        <div class="global-search" :class="isCollapsed ? '' : 'setBg'" v-if="showSearch">
            <el-input
                placeholder="请输入内容"
                v-model="searchMenuName"
                @keyup.enter.native="handleEnter">
                <i slot="prefix" style="font-size: 16px;margin-left: 9px;" class="el-input__icon el-icon-search"></i>
            </el-input>
        </div>
    </el-aside>
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
            originMenu: []
        };
    },
    props: {
        isUnfold: {
            type: Boolean,
            default: false
        },
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
                this.isCollapsed = true;
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
.wrapper{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
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