<template>
    <el-dropdown @command="handlerLang" class="lang-seletor">
        <i class="auth-icon-lang dropdown-img" style="margin:0;"></i>
        <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="zh-CN">简体中文</el-dropdown-item>
            <el-dropdown-item command="en-US">English</el-dropdown-item>
            <el-dropdown-item command="ja-JP">日本語の</el-dropdown-item>
        </el-dropdown-menu>
    </el-dropdown>
</template>
<script>
import { switchLang } from '@/modules/index/api/user';
import store from '@/store/index';
export default {
    data() {
        return {
            la: '简体中文'
        };
    },
    methods: {
        handlerLang(command) {
            switchLang(command).then(success => {
                if (success) {
                    store.dispatch('UPDATE_LANG');
                    this.la = 'English';
                    this.$router.go(0);
                } else {
                    this.$Message.error('语言切换失败');
                }
            }, () => {
                this.$Message.error('语言切换失败');
            });
        }
    }
};
</script>
<style lang="less">
    .lang-seletor {
        cursor: pointer;
        margin-right: 20px;
        display: flex;
        align-items: center;
        .dropdown-img{
            font-size: 20px;
            margin-right: 8px;
            &.auth-icon-message {
                display: block;
            }
        }
        .el-badge__content.is-fixed {
            right: 17px;
        }
    }
</style>