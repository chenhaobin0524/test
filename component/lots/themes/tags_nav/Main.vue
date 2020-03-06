<template>
    <div class="tags-nav">
        <div id="tags" class="tags">
            <div class="tags-inner">
                <el-tag v-for="tag in tags" type="dot" closable :color="tag.name===activeTag.name?'blue':'gray'"
                        :key="tag.name" @on-close.stop="handleTagClose(tag)" @click.native="handleSwitchTag(tag)">
                    {{tagName(tag)}}
                </el-tag>
            </div>
        </div>
        <div class="more">
            <el-dropdown trigger="click" style="margin: 4px 10px;" @command="handleMoreTagsClick" placement="bottom-end">
                <span>
                    {{$t('components.tagsNav.allTags')}}
                    <i class="el-icon-caret-bottom"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-for="tag in tags" :key="tag.name" :command="tag.name" :selected="tag.name===activeTag.name">{{tagName(tag)}}</el-dropdown-item>
                    <el-dropdown-item divided command="closeAll">{{$t('components.tagsNav.closeAll')}}</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex';

export default {
    computed: {
        ...mapGetters(['tags', 'activeTag', 'authority'])
    },
    mounted() {
        this.$store.dispatch('openTag', this.$route);
    },
    methods: {
        handleTagClose(tag) {
            this.$store.dispatch('closeTag', tag);
            this.$router.push({ name: this.activeTag.name });
        },
        handleSwitchTag(tag) {
            this.$store.dispatch('switchTag', tag);
            this.$router.push({ name: this.activeTag.name });
        },
        handleMoreTagsClick(name) {
            if (name === 'closeAll') {
                this.$store.dispatch('closeAllTags');
            } else {
                const tag = this.tags.filter(item => item.name === name);
                if (tag.length > 0) {
                    this.handleSwitchTag(tag[0]);
                }
            }
        },
        tagName(tag) {
            return this.getMenuName(tag, this.authority);
        },
        getMenuName(tag, menus) {
            for (let i = 0; i < menus.length; i += 1) {
                if (menus[i].fdKey === tag.name) {
                    return menus[i].fdName;
                }
            }
            for (let i = 0; i < menus.length; i += 1) {
                if (menus[i].subNodes.length) {
                    const res = this.getMenuName(tag, menus[i].subNodes);
                    if (res) return res;
                }
            }
            return null;
        }
    },
    watch: {
        $route(to) {
            if (this.tags.filter(item => item.name === to.name).length === 0) {
                this.$store.dispatch('openTag', to);
            } else {
                this.$store.dispatch('switchTag', to);
            }
        },
        activeTag(val) {
            if (this.$route.name !== val.name) {
                this.$router.push({ name: val.name, query: val.query, params: val.params });
            }
        },
        tags(val) {
            if (!val.length) {
                this.$router.push('/');
            }
        }
    }
};

</script>
<style lang="less">
.tags-nav {
    border-bottom: 1px solid #dddddd;
    background-color: #ffffff;
    position: relative;
    min-height: 40px;

    .tags {
        top: 1.5px;
        position: absolute;
        left: 10px;

        .tags-inner {
            overflow: visible;
            white-space: nowrap;
        }
    }

    .more {
        background-color: #ffffff;
        top: 0;
        border: 1px solid #eeeeee;
        padding-top: 7px;
        position: absolute;
        right: 0;
        bottom: 0;
    }
}

</style>
