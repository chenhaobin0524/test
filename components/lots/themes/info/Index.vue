<template>
    <el-dropdown @command="handlerSelete" class="lang-seletor">
        <i class="el-icon-question dropdown-img" style="margin:0;"></i>
        <el-dropdown-menu slot="dropdown">
            <template v-if="location.pathname === '/gwms.html'">
                <el-dropdown-item v-for="item in infoList" :key="item.path" :command="item.path">{{item.name}}</el-dropdown-item>
            </template>
            <el-dropdown-item command="legal" :divided='infoList.length > 0 ? true : false'>法律声明及隐私政策</el-dropdown-item>
            <!-- <el-dropdown-item command="copyright">版权信息</el-dropdown-item> -->
            <!-- <el-dropdown-item command="feedback">意见反馈</el-dropdown-item> -->
            <el-dropdown-item command="about">联系我们</el-dropdown-item>
            <el-dropdown-item command="terms">服务条款</el-dropdown-item>
        </el-dropdown-menu>
    </el-dropdown>
</template>
<script>
export default {
    data() {
        return {
            location: location
        };
    },
    props: {
        infoList: {
            type: Array,
            default: () => {
                return [];
            }
        }
    },
    methods: {
        handlerSelete(command) {
            if (this.infoList.length > 0) {
                this.infoList.map(item => {
                    if (command === item.path) {
                        this.$router.push(item.path);
                    }
                });
            }
            if (command === 'legal') {
                window.open('https://static.annto.com/res/webInfo/privacy.html');
            } else if (command === 'about') {
                window.open('https://static.annto.com/res/webInfo/contact_us.html');
            } else if (command === 'terms') {
                window.open('https://static.annto.com/res/webInfo/service.html');
            }
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
