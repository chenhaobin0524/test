<template>
    <div class="tool-wrap">
        <el-dropdown @command="handlerLang" class="lang-seletor">
            <span class="el-dropdown-link">{{$t('components.topHeader.lang')}} <i class="el-icon-arrow-down el-icon--right"></i></span>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="zh-CN">简体中文</el-dropdown-item>
                <el-dropdown-item command="en-US">English</el-dropdown-item>
                <el-dropdown-item command="ja-JP">日本語の</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
    </div>
</template>
<script>
import ElementUI from 'element-ui';
import { switchLang } from '@/modules/index/api/user';
import store from '@/store/index';
import { mapGetters } from 'vuex';
export default {
    data() {
        return {
            la: '简体中文'
        };
    },
    name: 'Tools',
    computed: {
        ...mapGetters(['user'])
    },
    methods: {
        handleSearch() {

        },
        handlerLang(command) {
            switchLang(command).then(success => {
                if (success) {
                    store.dispatch('UPDATE_LANG');
                    this.la = 'English';
                    this.$router.go(0);
                } else {
                    ElementUI.$Message.error('语言切换失败');
                }
            }, () => {
                ElementUI.$Message.error('语言切换失败');
            });
        }
    }
};
</script>
<style lang="less">
.tool-wrap {
    display: inline-block;
    .search-input {
        width: 300px;
        margin-right: 50px;
        .el-input__inner {
            background: #8a8c8e;
            outline: none;
            border-color: #8a8c8e;
            color: #fff;
        }
        .m-input-icon {
            color: #fff;
        }
    }
    .message,
    .service,
    .lang-seletor {
        margin-right: 50px;
        cursor: pointer;
    }

    .lang-seletor,.service{
        color: #fff;
    }
}
</style>
