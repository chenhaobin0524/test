<template>
    <div class="gwms-tags-view-container" id="gwms-tags-view-container">
        <div ref="scrollPane" class="tags-view-wrapper">
            <div class="all-tags-inner" v-if="isShowTabs">
                <router-link v-for="tag in visitedViews.slice(0, numberCanBeShow)" ref="tag" :class="isActive(tag)?'active':''"
                        :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }" :key="tag.fullPath" tag="span"
                        class="tags-view-item-all" @click.middle.native="closeSelectedTag(tag)"
                        @contextmenu.prevent.native="openMenu(tag,$event)">
                    <el-tooltip :content="$t((tag.meta && tag.meta.title) || tag.name)" placement="bottom" :disabled="tag.ellipsis">
                        <span class="tags-view-item">
                            <span class="tags-view-item-content">{{$t((tag.meta && tag.meta.title) || tag.name)}}{{tag.orderNo}}</span>
                            <span class="el-icon-close" @click.prevent.stop="closeSelectedTag(tag)" />
                        </span>
                    </el-tooltip>
                </router-link>
                <el-dropdown trigger="click" class="more-dropdown" v-if="visitedViews.length > numberCanBeShow">
                    <span class="el-dropdown-link">
                        {{ `更多` }}<i class="el-icon-arrow-down el-icon--right"></i>
                        <!-- $t('components.tagsNav.allTags') -->
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item v-for="(item, index) in allTags" :key="index" @click.native="handleCloseAll(item, index)" class="tag-item">
                            {{$t(item.meta.title || item.name)}}
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
            <ul v-show="visible" :style="{left:left+'px'}" class="contextmenu">
                <li @click="refreshSelectedTag(selectedTag)">{{ $t('components.tagsView.refresh') }}</li>
                <li @click="closeSelectedTag(selectedTag)">{{ $t('components.tagsView.close') }}</li>
                <li @click="closeOthersTags">{{ $t('components.tagsView.closeOthers') }}</li>
                <li @click="closeAllTags">{{ $t('components.tagsView.closeAll') }}</li>
            </ul>
        </div>
        <div class="all-tags" ref="allTags">
            <Tenant v-if="isShowTenant"/>
            <header-org v-if='hasHeaderOrg'></header-org>
            <msg-box v-if="showMessageTips" />
            <Info v-if="isShowInfo" :infoList='infoList'/>
            <el-dropdown v-if='hasUploadList'>
                <i class="icon iconfont iconMDM-gerenwenjianliebiao file-list"></i>
                <upload-list ref="uploadlist"></upload-list>
            </el-dropdown>
            <Lang v-if="isShowLang"/>
            <App />
            <User />
        </div>
    </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import User from '@/components/core/themes/default/components/User.vue';
import headerOrg from '../header_org/Main';
import MsgBox from '../messageBox/Index';
import Utils from '@/utils/common';
import UploadList from '@/components/lots/OSS/UploadList.vue';
import Tenant from '../tenant/Tenant';
import Lang from '../lang/Index';
import Info from '../info/Index';
import App from '../app/Index';
import './main.js';
export default {
    components: {
        User,
        headerOrg,
        MsgBox,
        UploadList,
        Tenant,
        Lang,
        Info,
        App
    },
    props: {
        isShowLang: {
            type: Boolean,
            default: true
        },
        isShowTenant: {
            type: Boolean,
            default: true
        },
        isShowTabs: {
            type: Boolean,
            default: true
        },
        hasHeaderOrg: {
            type: Boolean,
            default: false
        },
        isShowInfo: {
            type: Boolean,
            default: true
        },
        hasUploadList: {
            type: Boolean,
            default: true
        },
        infoList: {
            type: Array
        },
        showMessageTips: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            visible: false,
            left: 0,
            selectedTag: {},
            closeAllTag: [{ name: 'components.tagsView.closeAll', id: 'closeAll', meta: { title: '关闭' } }],
            allTags: [],
            warningList: [], // 预警列表
            warningType: ['', '消息', '预警'], // 预警类型
            noticeList: [], // 信息列表
            noticeType: ['', '公告', '预警', '维护', '更新'], // 信息类型
            msgDialogData: {}, // 信息弹窗数据
            warningListPage: 0,
            noticeListPage: 0,
            listPageSize: 10,
            warningListTotal: 0,
            noticeListTotal: 0,
            warningHasMore: true,
            noticeHasMore: true,
            warningScrollDisabled: true,
            noticeScrollDisabled: true,
            warningLoading: false,
            noticeLoading: false,
            numberCanBeShow: 0
        };
    },
    computed: {
        ...mapGetters(['user', 'visitedViews', 'cachedViews', 'tenantInfo', 'authority'])
    },
    watch: {
        authority(val) {
            if (!val.length) { // 没有菜单权限tab栏关闭所有页面去到404页面
                this.closeAllTags();
            }
        },
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
        this.$eventBus.$on('closeTag', param => {
            this.closeSelectedTag(param);
        });
        this.addViewTags();
        const dbody = document.getElementById('gwms-tags-view-container');
        this.mousewheelTags(dbody);
        // 多租户在 bms 与其他系统间切换
        if (/^bms.*$/i.test(location.host) && document.referrer &&
                document.referrer.split('://')[1].indexOf('bms') < 0 &&
                this.tenantInfo.list && this.tenantInfo.list.length > 1) {
            this.handleChangeTenant();
        }
        const widthCanBeUse = document.body.clientWidth -
        document.getElementsByClassName('all-tags')[0].offsetWidth - // all-tags的宽度
        200 - // 展开菜单的宽度
        30; // all-tags未渲染出的图标宽度
        const numberCanBeShow = parseInt((widthCanBeUse - 24 - 57) / 81);
        this.numberCanBeShow = numberCanBeShow;
    },
    methods: {
        handleFileList() {
            this.$refs.uploadlist.visible = true;
        },
        isActive(route) {
            return route.fullPath.split('?')[0] === this.$route.fullPath.split('?')[0];
        },
        addViewTags() {
            this.$emit('open-keep-alive');
            const { name } = this.$route;

            // 这里就是'/'
            if (name === 'm') {
                this.$router.push('/index');
                return true;
            }
            const temp = this.visitedViews.some(item => {
                return item.name === name;
            });
            if (name) {
                this.$store.dispatch('addView', this.$route);
                this.visitedViews.map(item => {
                    let realLength = 0;
                    let charCode = -1;
                    const str = this.$t((item.meta && item.meta.title) || item.name);
                    const len = str.length;
                    for (let i = 0; i < len; i++) {
                        charCode = str.charCodeAt(i);
                        if (charCode >= 0 && charCode <= 128) realLength += 1;
                        else realLength += 2;
                    }
                    if (realLength > 10) {
                        item.ellipsis = false;
                    } else {
                        item.ellipsis = true;
                    }
                });
                if (this.visitedViews.length > this.numberCanBeShow && !temp) {
                    let tempArr = [];
                    tempArr = Utils.ArrMove(this.visitedViews, this.visitedViews.length - 1, this.numberCanBeShow);
                    tempArr = Utils.ArrMove(tempArr, 0, tempArr.length - 1);
                    this.COVER_VISITED_VIEW(tempArr);
                    this.allTags = this.closeAllTag.concat(this.visitedViews.slice(this.numberCanBeShow));
                    // this.$router.push({ path: item.path, query: item.query, fullPath: item.fullPath });
                }
            }
            this.allTags = this.closeAllTag.concat(this.$store.getters.visitedViews.slice(this.numberCanBeShow));
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
        handleDestroyed(router) {
            const { path, matched } = router;
            let matchedRouter;
            if (matched) {
                matchedRouter = matched.find(item => {
                    return item.path === path;
                });
            }
            if (matchedRouter) {
                const { destroyPage } = matchedRouter.components.default;
                destroyPage && destroyPage.call(matchedRouter.instances.default);
            }
        },
        closeSelectedTag(view) {
            this.handleDestroyed(view);
            this.$eventBus.$emit(view.name);
            this.$emit('refresh-keep-alive', view);
            this.$store.dispatch('delView', view).then(({ visitedViews }) => {
                if (this.isActive(view)) {
                    const latestView = visitedViews.slice(-1)[0];
                    if (latestView) {
                        this.$router.push(latestView);
                    } else {
                        this.$router.push('/index');
                    }
                }
                this.allTags = this.closeAllTag.concat(visitedViews.slice(this.numberCanBeShow));
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
            this.$router.push('/index');
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
        handleCloseAll(item, index) {
            if (item.id && item.id === 'closeAll') {
                this.closeAllTags();
                this.$emit('refresh-keep-alive', 'closeAll');
            } else {
                let tempArr = [];
                tempArr = Utils.ArrMove(this.visitedViews, index + 4, 5);
                tempArr = Utils.ArrMove(tempArr, 0, tempArr.length - 1);
                this.COVER_VISITED_VIEW(tempArr);
                this.allTags = this.closeAllTag.concat(this.visitedViews.slice(this.numberCanBeShow));
                this.$router.push({ path: item.path, query: item.query, fullPath: item.fullPath });
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
        },
        ...mapMutations({
            COVER_VISITED_VIEW: 'COVER_VISITED_VIEW'
        })
    }
};

</script>

<style lang="less">
.gwms-tags-view-container {
    flex: 0 0 40px;
    display: flex;
    width: 100%;
    height: 40px;
    background: #fff;
    color: #999;
    overflow: hidden;
    .contextmenu {
        margin: 0;
        background: #fff;
        z-index: 100;
        top: 40px;
        position: absolute;
        list-style-type: none;
        line-height: 1.5em;
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
    .tags-view-item-all {
        cursor: pointer;
        height: 100%;
        line-height: 40px;
        padding: 0 8px;
        font-size: 12px;
        .tags-view-item {
            .el-icon-close {
                margin-left: 10px;
                color: #999;
                display: none;
            }
        }
        .tags-view-item-content {
            max-width: 65px;
            white-space:nowrap;
            overflow:hidden;
            text-overflow:ellipsis;
            display: table-cell;
        }
        &:hover {
            background-color: #fafafa;
            color: #666;
            .el-icon-close {
                margin-left: 10px;
                color: #999;
                display: inline-block;
            }
        }
        &.active {
            background-color: #f5f5f5;
            color: #333;
            &:after {
                content: none;
            }
            .el-icon-close {
                margin-left: 10px;
                color: #999;
                display: inline-block;
            }
        }

    }
    .tags-view-item-all.active {
        .el-icon-close:hover {
            background-color: rgba(255, 255, 255, 0.9);
            color: #00bcbf;
        }
        .tags-view-item {
            border: none;
        }
    }
    .more-dropdown{
        line-height: 40px;
        padding: 0 8px;
        cursor: pointer;
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
        flex: 1;
        overflow-x: auto;
        overflow-y: hidden;
        .all-tags-inner {
            height: 100%;
            overflow: visible;
            white-space: nowrap;
            display: flex;
            justify-content: flex-start;
            align-content: center;
        }
    }
    .all-tags {
        line-height: 40px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        .file-list{
            cursor: pointer;
            margin-right: 20px;
            font-size: 20px;
            vertical-align: middle;
        }
    }
}
.el-dropdown-menu {
    max-height: 400px;
    overflow: auto;
    a:first-child {
        .tag-item {
            color: #00BCBF;
            font-weight: bold;
        }
    }
}
</style>
