<template>
    <div class="tags-view-container" id="tags-view-container">
        <div ref="scrollPane" class="tags-view-wrapper">
            <div class="all-tags-inner">
                <router-link v-for="tag in visitedViews" ref="tag" :class="isActive(tag)?'active':''"
                        :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }" :key="tag.fullPath" tag="span"
                        class="tags-view-item" @click.middle.native="closeSelectedTag(tag)"
                        @contextmenu.prevent.native="openMenu(tag,$event)">
                    {{ $t(tag.name)}}
                    <span class="el-icon-close" @click.prevent.stop="closeSelectedTag(tag)" />
                </router-link>
            </div>
            <ul v-show="visible" :style="{left:left+'px'}" class="contextmenu">
                <li @click="refreshSelectedTag(selectedTag)">{{ $t('components.tagsView.refresh') }}</li>
                <li @click="closeSelectedTag(selectedTag)">{{ $t('components.tagsView.close') }}</li>
                <li @click="closeOthersTags">{{ $t('components.tagsView.closeOthers') }}</li>
                <li @click="closeAllTags">{{ $t('components.tagsView.closeAll') }}</li>
            </ul>
        </div>
        <div class="all-tags" ref="allTags">
            <el-dropdown trigger="click">
                <span class="el-dropdown-link">
                    {{ $t('components.tagsNav.allTags') }}<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <router-link  v-for="(item, index) in allTags" :key="index" :to="{ path: item.path, query: item.query, fullPath: item.fullPath }">
                        <el-dropdown-item @click.native="handleCloseAll(item)" class="tag-item">
                            {{$t(item.name)}}
                        </el-dropdown-item>
                    </router-link>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    // components: { ScrollPane },
    data() {
        return {
            visible: false,
            left: 0,
            selectedTag: {},
            closeAllTag: [{ name: 'components.tagsView.closeAll', id: 'closeAll' }],
            allTags: []
        };
    },
    computed: {
        ...mapGetters(['visitedViews', 'cachedViews'])
    },
    watch: {
        $route() {
            this.addViewTags();
            this.moveToCurrentTag();
        },
        visible(value) {
            if (value) {
                document.body.addEventListener('click', this.closeMenu);
            } else {
                document.body.removeEventListener('click', this.closeMenu);
            }
        }
    },
    mounted() {
        this.addViewTags();
        const dbody = document.getElementById('tags-view-container');
        this.mousewheelTags(dbody);
    },
    methods: {
        isActive(route) {
            return route.fullPath === this.$route.fullPath;
        },
        addViewTags() {
            const { name } = this.$route;

            // 这里就是'/'
            if (name === 'm') {
                this.$router.push('/home');
                return true;
            }

            if (name) {
                this.$store.dispatch('addView', this.$route);
            }
            this.allTags = this.closeAllTag.concat(this.$store.getters.visitedViews);
            return false;
        },
        moveToCurrentTag() {
            const tags = this.$refs.tag;
            this.$nextTick(() => {
                if (!tags) {
                    return;
                }
                for (const tag of tags) {
                    if (tag.to.fullPath === this.$route.fullPath) {
                        // this.$refs.scrollPane.moveToTarget(tag);

                        // when query is different then update
                        /*
                        if (tag.to.fullPath !== this.$route.fullPath) {
                           this.$store.dispatch('updateVisitedView', this.$route)
                        }
                        */

                        break;
                    }
                }
            });
        },
        refreshSelectedTag(view) {
            this.$store.dispatch('delCachedView', view).then(() => {
                const { fullPath } = view;
                this.$nextTick(() => {
                    this.$router.replace({
                        path: '/redirect' + fullPath
                    });
                });
            });
        },
        closeSelectedTag(view) {
            this.$store.dispatch('delView', view).then(({ visitedViews }) => {
                if (this.isActive(view)) {
                    const latestView = visitedViews.slice(-1)[0];
                    if (latestView) {
                        this.$router.push(latestView);
                    } else {
                        this.$router.push('/home');
                    }
                }
                this.allTags = this.closeAllTag.concat(visitedViews);
            });
        },
        closeOthersTags() {
            this.$router.push(this.selectedTag);
            this.$store.dispatch('delOthersViews', this.selectedTag).then(() => {
                this.moveToCurrentTag();
            });
        },
        closeAllTags() {
            this.$store.dispatch('delAllViews');
            this.$router.push('/home');
        },
        openMenu(tag, e) {
            const menuMinWidth = 105;
            const offsetLeft = this.$el.getBoundingClientRect().left; // container margin left
            const offsetWidth = this.$el.offsetWidth; // container width
            const maxLeft = offsetWidth - menuMinWidth; // left boundary
            const left = e.clientX - offsetLeft + 15; // 15: margin right

            if (left > maxLeft) {
                this.left = maxLeft;
            } else {
                this.left = left;
            }

            this.visible = true;
            this.selectedTag = tag;
        },
        closeMenu() {
            this.visible = false;
        },
        handleCloseAll(item) {
            if (item.id && item.id === 'closeAll') {
                this.closeAllTags();
            }
        },
        mousewheelTags(dbody) {
            // ff用
            this.objAddEvent(dbody, 'DOMMouseScroll', (e) => {
                return this.mouseScroll(e, dbody);
            });
            // 非ff chrome 用
            this.objAddEvent(dbody, 'mousewheel', (e) => {
                return this.mouseScroll(e, dbody);
            });
            // chrome用
            this.objAddEvent(dbody, 'mousewheel', (e) => {
                return this.mouseScroll(e, dbody);
            });
        },
        // 这个是给对象增加监控方法的函数
        objAddEvent(oEle, sEventName, fnHandler) {
            if (oEle.attachEvent) {
                oEle.attachEvent('on' + sEventName, fnHandler);
            } else {
                oEle.addEventListener(sEventName, fnHandler, true);
            }
        },
        mouseScroll(e, dbody) {
            e = e || window.event;
            e.stopPropagation();
            e.preventDefault();
            const delD = e.wheelDelta ? e.wheelDelta : -e.deltaX * 40; // 判断上下方向
            const moves = delD > 0 ? -50 : 50;
            dbody.scrollLeft += moves; // 非chrome浏览器用这个
            // chrome浏览器用这个
            if (dbody.scrollLeft === 0) {
                dbody.scrollLeft += moves;
            }
            return false;
        }
    }
};

</script>

<style lang="less">
.contextmenu {
    margin: 0;
    background: #fff;
    z-index: 100;
    top: 40px;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, .3);

    li {
        margin: 0;
        padding: 7px 16px;
        cursor: pointer;

        &:hover {
            background: #eee;
        }
    }
}
.tags-view-container {
    position: sticky;
    top: 0;
    z-index: 999;
    height: 45px;
    width: 100%;
    background: #fff;
    border-bottom: 1px solid #f6f6f6;
    overflow: hidden;
    .tags-view-item {
        display: inline-block;
        position: relative;
        cursor: pointer;
        height: 26px;
        line-height: 26px;
        color: #495060;
        background: #fff;
        border: 1px solid #fff;
        border-radius: 2px;
        padding: 0 8px 0 12px;
        font-size: 12px;
        margin: 9px 2px;
        background-color: #f9f9f9;
        border: 1px solid #D8D8D8;

        &:first-of-type {
            margin-left: 15px;
        }

        &:last-of-type {
            margin-right: 15px;
        }

        &:hover {
            background-color: #e9f9f9;
        }
        &.active {
            background-color: #00bcbf;
            border-color: #00bcbf;
            color: #fff;
            &:after {
                content: none;
            }
        }

    }
    .tags-view-item.active {
        .el-icon-close:hover {
            background-color: rgba(255, 255, 255, 0.9);
            color: #00bcbf;
        }
    }
    .el-icon-close {
        width: 12px;
        height: 12px;
        line-height: 12px;
        border-radius: 50%;
        text-align: center;
        transition: all .3s cubic-bezier(.645, .045, .355, 1);
        transform-origin: 100% 50%;

        &:before {
            transform: scale(.6);
            display: inline-block;
            vertical-align: -2px;
            text-align: center;
            font-size: 18px;
            margin-left: -3px;
        }

        &:hover {
            background-color: #b4bccc;
            color: #fff;
        }
    }

    .tags-view-wrapper {
        position: absolute;
        padding-right: 96px;
        .all-tags-inner {
            overflow: visible;
            white-space: nowrap;
        }
    }
    .all-tags {
        position: fixed;
        top: 50px;
        right: 0;
        border-left: 1px solid #e6e6e6;
        height: 45px;
        width: 96px;
        text-align: center;
        line-height: 44px;
        background: #fff;
    }
}
.el-dropdown-menu {
    a:first-child {
        .tag-item {
            color: #00BCBF;
            font-weight: bold;
        }
    }
}
</style>
