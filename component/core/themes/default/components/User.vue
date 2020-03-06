<template>
    <el-dropdown trigger="hover" placement="bottom-end" @on-click="menuHandler" class="user-dropdown">
        <img src="../../../../../assets/topbar_head.svg" class="dropdown-img"/>
        <!-- <span class="user-name"><span v-if="user.userName !== '请登录'">{{user.userName}}</span><a href="#" class="login-btn" @click="menuHandler('logout')" v-else>{{user.userName}}</a></span> -->
        <el-dropdown-menu slot="dropdown" v-if="user.userName !== '请登录'">
            <a class="user-center" :href="userCenterPath">
                <el-dropdown-item name="user-center">{{this.user ? this.user.userName : ''}}</el-dropdown-item>
            </a>
            <a href="#" class="logout-btn" @click="menuHandler('logout')">
                <el-dropdown-item divided name="logout">退出</el-dropdown-item>
            </a>
        </el-dropdown-menu>
    </el-dropdown>
</template>
<script>
import { mapGetters } from 'vuex';
import { logout } from '@/utils/index';
export default {
    name: 'User',
    data() {
        return {};
    },
    computed: {
        ...mapGetters(['user', 'currentTenant']),
        userCenterPath() {
            return this.currentTenant ? `//${this.currentTenant.tenantDomain}/system.html#/user-center` : '';
        }
    },
    methods: {
        menuHandler(name) {
            switch (name) {
            case 'logout':
                logout();
                break;
            case 'user-center':
                break;
            }
        }
    }
};
</script>
<style lang="less">
.user-dropdown {
    margin-right: 20px;
    cursor: pointer;
    display: flex !important;
    align-items: center;
    .dropdown-img{
        width: 20px;
        height: 20px;
    }
    .user-name {
        color: #fff;
        cursor: pointer;
    }
    .login-btn,
    .logout-btn {
        color: #fff;
        text-decoration: none;
    }
}

</style>
